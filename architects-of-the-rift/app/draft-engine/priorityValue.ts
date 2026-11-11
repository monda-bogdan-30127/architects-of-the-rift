// DRAFT_REALISM §6 — priority value: cât e de contestat un campion. Aceeași formulă pentru ambele
// echipe, independentă de ce vrea echipa care draftează (mastery-ul propriu e doar filtru: `ownUsable`).
//
//   value = 0.40 × meta + 0.20 × flex + 0.20 × blindSafety + 0.20 × enemyWant

import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getRoleMatchups, relationAppliesToEnemyRole } from "./championMatchups";
import { getChampionStatsForRole } from "./championRoleStatsSystem";
import { getMetaPriorityScore } from "./draftEvaluator";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { isStrongCounter } from "./matchupGrades";
import { getSeasonChampionThreat } from "./seasonThreatSystem";

const PRIORITY = DRAFT_THINKING_CONFIG.priority;
const playersById = new Map(players.map((player) => [player.id, player]));

export type PriorityValue = {
  /** 0..10 */
  value: number;
  /** 1: ≥ tier1Min, 2: ≥ tier2Min, 3: restul. */
  tier: 1 | 2 | 3;
  meta: number;
  flex: number;
  blindSafety: number;
  /** Cât îl vrea ADVERSARUL echipei care draftează (0..10). */
  enemyWant: number;
  /** Un jucător propriu pe un rol liber îl are ≥ B (altfel poate fi doar ban / deny). */
  ownUsable: boolean;
  /** Cel mai bun grad al unui jucător propriu pe un rol liber (null = nimeni). */
  ownBestGrade: ChampionMasteryGrade | null;
  /** Rolul pe care se măsoară meta / blind safety (cel mai jucat în pro). */
  role: Role;
};

/** Perspectiva echipei care draftează: rosterele, rolurile libere, ce e indisponibil. */
export type PriorityPerspective = {
  ownRoster: Partial<Record<Role, string>>;
  ownOpenRoles: readonly Role[];
  enemyRoster: Partial<Record<Role, string>>;
  enemyOpenRoles: readonly Role[];
  enemyTeamSlug: string;
  unavailable: ReadonlySet<string>;
};

/** Rolul cu cele mai multe pick-uri pro (date pe rol), altfel primul rol. */
function getMainRole(champion: Champion): Role {
  let best: Role = champion.roles[0];
  let bestPicks = -1;
  for (const role of champion.roles) {
    const picks = champion.roleData[role]?.stats?.picks ?? -1;
    if (picks > bestPicks) {
      best = role;
      bestPicks = picks;
    }
  }
  return best;
}

/** 1 rol cu date pro → 0, 2 → 6, 3+ → 10; fără date pe rol: după `roles.length` × 0.7. */
export function getFlexScore(champion: Champion): number {
  const scale = (count: number) => (count >= 3 ? 10 : count === 2 ? 6 : 0);
  const withData = champion.roles.filter((role) => {
    const stats = champion.roleData[role]?.stats;
    return Boolean(stats && (stats.presence ?? 0) > 0);
  }).length;
  return withData > 0 ? scale(withData) : scale(champion.roles.length) * 0.7;
}

function grade(roster: Partial<Record<Role, string>>, role: Role, championId: string): ChampionMasteryGrade | null {
  const player = roster[role] ? playersById.get(roster[role]!) : undefined;
  return player ? getChampionGrade(player, championId) : null;
}

const clamp10 = (value: number) => Math.max(0, Math.min(10, value));

export function getPriorityValue(champion: Champion, view: PriorityPerspective): PriorityValue {
  const role = getMainRole(champion);
  const meta = clamp10(getMetaPriorityScore(champion, role));
  const flex = getFlexScore(champion);

  // Blind safety: blindPickRate normalizat, −1.5 pe fiecare counter „strong” încă disponibil pe un rol liber al lor.
  const blindRate = getChampionStatsForRole(champion, role).blindPickRate ?? 45;
  const counters = getRoleMatchups(champion.id, role).weakVs.filter(
    (relation) =>
      isStrongCounter(relation) &&
      !view.unavailable.has(relation.championId) &&
      view.enemyOpenRoles.some((enemyRole) => relationAppliesToEnemyRole(relation, role, enemyRole)),
  ).length;
  const blindSafety = clamp10(blindRate / 10 - counters * PRIORITY.blindCounterPenalty);

  // Cât îl vrea adversarul: cel mai bun grad al unui jucător de-al lor pe un rol încă liber + sezonul.
  let enemyWant = 0;
  for (const enemyRole of champion.roles) {
    if (!view.enemyOpenRoles.includes(enemyRole)) continue;
    const enemyGrade = grade(view.enemyRoster, enemyRole, champion.id);
    if (enemyGrade) enemyWant = Math.max(enemyWant, PRIORITY.gradeWant[enemyGrade]);
  }
  if (enemyWant > 0 || champion.roles.some((entry) => view.enemyOpenRoles.includes(entry))) {
    enemyWant += getSeasonChampionThreat(view.enemyTeamSlug, champion.id, view.enemyRoster).threat * PRIORITY.seasonWantWeight;
  }
  enemyWant = clamp10(enemyWant);

  // Folosibil de noi: un jucător propriu pe un rol liber îl are ≥ B.
  let ownBestGrade: ChampionMasteryGrade | null = null;
  for (const ownRole of champion.roles) {
    if (!view.ownOpenRoles.includes(ownRole)) continue;
    const ownGrade = grade(view.ownRoster, ownRole, champion.id);
    if (ownGrade && (!ownBestGrade || GRADE_RANK[ownGrade] > GRADE_RANK[ownBestGrade])) ownBestGrade = ownGrade;
  }
  const ownUsable = Boolean(ownBestGrade && GRADE_RANK[ownBestGrade] >= GRADE_RANK.B);

  const value = clamp10(
    PRIORITY.weights.meta * meta + PRIORITY.weights.flex * flex + PRIORITY.weights.blindSafety * blindSafety + PRIORITY.weights.enemyWant * enemyWant,
  );
  const tier = value >= PRIORITY.tier1Min ? 1 : value >= PRIORITY.tier2Min ? 2 : 3;
  return { value, tier, meta, flex, blindSafety, enemyWant, ownUsable, ownBestGrade, role };
}

/** Cache-ul unei perspective (o acțiune): priority value calculat o singură dată per campion. */
export function createPriorityLookup(view: PriorityPerspective) {
  const cache = new Map<string, PriorityValue>();
  return (champion: Champion): PriorityValue => {
    let entry = cache.get(champion.id);
    if (!entry) {
      entry = getPriorityValue(champion, view);
      cache.set(champion.id, entry);
    }
    return entry;
  };
}
