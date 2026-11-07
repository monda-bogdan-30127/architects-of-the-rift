// Singurul loc unde o notă de matchup devine valoare numerică (DRAFT_REWORK §4.0).
//
// Valoare pozitivă = avantaj pentru campionul nostru, negativă = dezavantaj.
// Notele vin din `championMatchups.ts`; definițiile și factorii din
// `matchupGrades.ts` (faza, nota 4 = slăbiciuni acoperite, nota 1 = skill).

import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { MatchupGrade, Role } from "@/app/types/champion";
import { getMatchupGrades, getRoleMatchups, relationAppliesToEnemyRole } from "./championMatchups";
import { getChampionRoleProfile } from "./championProfileSystem";
import { resolveRoleAssignments } from "./draftRoleResolver";
import {
  MATCHUP_GRADE_EFFECTS,
  getPhaseMultiplier,
  getSkillMatchupMultiplier,
  getWeaknessCoverage,
  getWeaknessCoverMultiplier,
  type MatchupKind,
  type MatchupPhase,
  type MatchupPhaseWeights,
} from "./matchupGrades";

export type MatchupContext = {
  /** Draft: greutățile fazelor după planul compoziției proprii. Lipsă = media fazelor. */
  phaseWeights?: MatchupPhaseWeights;
  /** Simulare: o singură fază (are prioritate față de `phaseWeights`). */
  phase?: MatchupPhase;
  /** Nota 4: aliații noștri (pot acoperi slăbiciunile NOASTRE). */
  ownAllyIds?: readonly string[];
  /** Nota 4: aliații lor (pot acoperi slăbiciunile LOR). Implicit în `getMatchupValueVsTeam`: pick-urile inamice. */
  enemyAllyIds?: readonly string[];
  /** Nota 1: jucătorul nostru proiectat. */
  ownPlayerId?: string | null;
  /** Nota 1: jucătorul advers (un singur inamic). */
  enemyPlayerId?: string | null;
  /** Nota 1 în `getMatchupValueVsTeam`: jucătorul advers se ia de pe rolul fiecărui inamic. */
  enemyRoster?: Partial<Record<Role, string>>;
  /** Rolurile finale ale inamicilor, dacă se știu (altfel se proiectează). */
  enemyAssignments?: Partial<Record<Role, string>>;
};

export type MatchupDetail = {
  enemyId: string;
  enemyRole: Role | null;
  grade: MatchupGrade;
  kind: MatchupKind;
  value: number;
};

const playersById = new Map(players.map((player) => [player.id, player]));

function getPlayerMec(playerId: string | null | undefined): number | null {
  if (!playerId) return null;
  return playersById.get(playerId)?.stats.mec ?? null;
}

function getGradeEffectValue(
  grade: MatchupGrade,
  kind: MatchupKind,
  championId: string,
  enemyId: string,
  ctx: MatchupContext,
): number {
  const effect = MATCHUP_GRADE_EFFECTS[grade];
  let value = effect.draftWeight * getPhaseMultiplier(grade, { phase: ctx.phase, weights: ctx.phaseWeights });

  if (effect.conditionalOnWeaknessCover) {
    // Campionul countrat și aliații care îi pot acoperi slăbiciunile.
    const counteredId = kind === "good" ? enemyId : championId;
    const counteredAllies = kind === "good" ? ctx.enemyAllyIds : ctx.ownAllyIds;
    if (counteredAllies?.length) {
      value *= getWeaknessCoverMultiplier(getWeaknessCoverage(counteredId, counteredAllies));
    }
  }

  if (effect.skillDependent) {
    const ownMec = getPlayerMec(ctx.ownPlayerId);
    const enemyMec = getPlayerMec(ctx.enemyPlayerId);
    value *= kind === "good"
      ? getSkillMatchupMultiplier(ownMec, enemyMec)
      : getSkillMatchupMultiplier(enemyMec, ownMec);
  }

  return kind === "good" ? value : -value;
}

/** Notele aplicabile și valoarea fiecăreia (pot fi două: combinația 2/3). */
export function getMatchupDetails(
  championId: string,
  role: Role,
  enemyId: string,
  enemyRole: Role | null,
  ctx: MatchupContext = {},
): MatchupDetail[] {
  const grades = getMatchupGrades(championId, role, enemyId, enemyRole);
  const details: MatchupDetail[] = [];
  if (grades.good) {
    details.push({ enemyId, enemyRole, grade: grades.good, kind: "good", value: getGradeEffectValue(grades.good, "good", championId, enemyId, ctx) });
  }
  if (grades.weak) {
    details.push({ enemyId, enemyRole, grade: grades.weak, kind: "weak", value: getGradeEffectValue(grades.weak, "weak", championId, enemyId, ctx) });
  }
  return details;
}

export function getMatchupValue(
  championId: string,
  role: Role,
  enemyId: string,
  enemyRole: Role | null,
  ctx: MatchupContext = {},
): number {
  return getMatchupDetails(championId, role, enemyId, enemyRole, ctx).reduce((sum, detail) => sum + detail.value, 0);
}

export function assignmentsToRoleMap(assignments: Partial<Record<Role, string>>): Map<string, Role> {
  const roles = new Map<string, Role>();
  for (const [role, championId] of Object.entries(assignments) as [Role, string | undefined][]) {
    if (championId) roles.set(championId, role);
  }
  return roles;
}

/** Rolurile proiectate ale pick-urilor inamice (championId → rol). */
export function getProjectedEnemyRoles(
  enemyPicks: readonly string[],
  enemyRoster: Partial<Record<Role, string>> = {},
): Map<string, Role> {
  return assignmentsToRoleMap(resolveRoleAssignments([...enemyPicks], enemyRoster));
}

/** Suma pe toți inamicii, cu rolurile lor proiectate. */
export function getMatchupValueVsTeam(
  championId: string,
  role: Role,
  enemyPicks: readonly string[],
  ctx: MatchupContext = {},
): { total: number; details: MatchupDetail[] } {
  if (enemyPicks.length === 0) return { total: 0, details: [] };

  const enemyRoles = ctx.enemyAssignments
    ? assignmentsToRoleMap(ctx.enemyAssignments)
    : getProjectedEnemyRoles(enemyPicks, ctx.enemyRoster);
  const enemyAllyIds = ctx.enemyAllyIds ?? enemyPicks;
  const details: MatchupDetail[] = [];

  for (const enemyId of enemyPicks) {
    const enemyRole = enemyRoles.get(enemyId) ?? null;
    details.push(
      ...getMatchupDetails(championId, role, enemyId, enemyRole, {
        ...ctx,
        enemyAllyIds,
        enemyPlayerId: enemyRole && ctx.enemyRoster ? ctx.enemyRoster[enemyRole] ?? null : ctx.enemyPlayerId,
      }),
    );
  }

  return { total: details.reduce((sum, detail) => sum + detail.value, 0), details };
}

// ─── Tabele notă → valoare pentru deciziile discrete (ban-uri, trap) ─────────

/** 4.2 protectOwnCompBonus: cât de important e să banezi un counter al pick-ului propriu. */
const PROTECT_BAN_VALUE: Record<MatchupGrade, number> = { 5: 2.5, 4: 1.6, 3: 0.8, 2: 0.6, 1: 0.2 };
export const PROTECT_BAN_MAX = 4;

/** Valoarea de ban pentru a proteja `ownId` (pe `ownRole`) de `candidateId` (pe `candidateRole`). */
export function getProtectOwnPickBanValue(
  ownId: string,
  ownRole: Role,
  candidateId: string,
  candidateRole: Role | null,
): number {
  const weak = getMatchupGrades(ownId, ownRole, candidateId, candidateRole).weak;
  return weak ? PROTECT_BAN_VALUE[weak] : 0;
}

/**
 * 4.2 getCounterProductiveBanPenalty: pick-urile inamicului îl countrează deja
 * pe candidat (dacă l-am lua noi). Nota 5 → nu-l bana deloc; nota 1 → aproape zero.
 */
export const COUNTER_PRODUCTIVE_BAN = { hardCounterPenalty: -15, valueFactor: 1.2, maxPenalty: 5 } as const;

export function getCounterProductiveBanValue(
  candidateId: string,
  candidateRole: Role | null,
  enemyPicks: readonly string[],
  enemyRoster: Partial<Record<Role, string>> = {},
): number {
  if (!candidateRole || enemyPicks.length === 0) return 0;
  const enemyRoles = getProjectedEnemyRoles(enemyPicks, enemyRoster);
  let total = 0;
  for (const enemyId of enemyPicks) {
    const enemyRole = enemyRoles.get(enemyId);
    if (!enemyRole) continue;
    for (const detail of getMatchupDetails(enemyId, enemyRole, candidateId, candidateRole)) {
      if (detail.kind !== "good") continue;
      if (detail.grade === 5) return COUNTER_PRODUCTIVE_BAN.hardCounterPenalty;
      total += detail.value;
    }
  }
  return -Math.min(COUNTER_PRODUCTIVE_BAN.maxPenalty, total * COUNTER_PRODUCTIVE_BAN.valueFactor);
}

/** 4.6 getTrapCounterBonus: nota 5 → 4, 4 → 3, 3/2 → 2, 1 → 1. */
const TRAP_COUNTER_BONUS: Record<MatchupGrade, number> = { 5: 4, 4: 3, 3: 2, 2: 2, 1: 1 };

export function getTrapCounterValue(
  candidateId: string,
  candidateRole: Role | null,
  baitId: string,
  baitRole: Role | null,
): number {
  if (!candidateRole) return 0;
  const good = getMatchupGrades(candidateId, candidateRole, baitId, baitRole).good;
  return good ? TRAP_COUNTER_BONUS[good] : 0;
}

/** 4.1 penalizare suplimentară: inamicul are deja pe rolul nostru un counter de nota 4/5. */
const DIRECT_COUNTER_PENALTY: Partial<Record<MatchupGrade, number>> = { 5: 3, 4: 1.5 };

export function getDirectLaneCounterPenalty(
  candidateId: string,
  candidateRole: Role | null,
  enemyPicks: readonly string[],
  enemyRoster: Partial<Record<Role, string>> = {},
): number {
  if (!candidateRole || enemyPicks.length === 0) return 0;
  const enemyRoles = getProjectedEnemyRoles(enemyPicks, enemyRoster);
  let penalty = 0;
  for (const [enemyId, enemyRole] of enemyRoles) {
    if (enemyRole !== candidateRole) continue;
    const weak = getMatchupGrades(candidateId, candidateRole, enemyId, enemyRole).weak;
    if (weak) penalty = Math.max(penalty, DIRECT_COUNTER_PENALTY[weak] ?? 0);
  }
  return penalty;
}

/** 4.1 getBlindRiskPenalty: risc suplimentar pentru counterii de nota 4/5 încă disponibili. */
const BLIND_COUNTER_RISK: Partial<Record<MatchupGrade, number>> = { 5: 0.6, 4: 0.3 };

export function getAvailableCounterBlindRisk(
  candidateId: string,
  candidateRole: Role,
  isAvailable: (championId: string) => boolean,
  openEnemyRoles: readonly Role[],
): number {
  let risk = 0;
  for (const relation of getRoleMatchups(candidateId, candidateRole).weakVs) {
    const value = BLIND_COUNTER_RISK[relation.score];
    if (!value || !isAvailable(relation.championId)) continue;
    const appliesToOpenRole = openEnemyRoles.some((enemyRole) =>
      relationAppliesToEnemyRole(relation, candidateRole, enemyRole),
    );
    if (appliesToOpenRole) risk += value;
  }
  return risk;
}

/** Numărul de weakVs cu nota ≥ 4 pe rol (siguranța de blind în simulare). */
export function countHardCounters(championId: string, role: Role): number {
  return getRoleMatchups(championId, role).weakVs.filter((relation) => relation.score >= 4).length;
}

// ─── Greutățile fazelor după compoziție ──────────────────────────────────────

let globalPhaseMeans: MatchupPhaseWeights | null = null;

/** Media `scaling.*.power` pe toate profilurile campion×rol — „compoziția neutră”. */
function getGlobalPhaseMeans(): MatchupPhaseWeights {
  if (globalPhaseMeans) return globalPhaseMeans;
  const sums = { early: 0, mid: 0, late: 0 };
  let count = 0;
  for (const champion of champions) {
    for (const role of champion.roles) {
      const profile = getChampionRoleProfile(champion, role);
      if (!profile) continue;
      sums.early += profile.scaling.early.power;
      sums.mid += profile.scaling.mid.power;
      sums.late += profile.scaling.late.power;
      count += 1;
    }
  }
  globalPhaseMeans = count
    ? { early: sums.early / count, mid: sums.mid / count, late: sums.late / count }
    : { early: 1, mid: 1, late: 1 };
  return globalPhaseMeans;
}

const championsById = new Map(champions.map((champion) => [champion.id, champion]));

/**
 * Greutățile fazelor pentru compoziția proprie (+ candidat): media
 * `scaling.early/mid/late.power` pe rolurile proiectate, raportată la media
 * globală a fiecărei faze și normalizată la medie 1. Comp early → `early` > 1,
 * comp scaling → `mid/late` > 1. Fără pick-uri → 1/1/1.
 */
export function getTeamPhaseWeights(ownPicks: readonly string[], candidateId?: string): MatchupPhaseWeights {
  const picks = candidateId && !ownPicks.includes(candidateId) ? [...ownPicks, candidateId] : [...ownPicks];
  if (picks.length === 0) return { early: 1, mid: 1, late: 1 };

  const assignments = resolveRoleAssignments(picks, {});
  const sums = { early: 0, mid: 0, late: 0 };
  let count = 0;
  for (const [role, championId] of Object.entries(assignments) as [Role, string | undefined][]) {
    const champion = championId ? championsById.get(championId) : null;
    const profile = champion ? getChampionRoleProfile(champion, role) : null;
    if (!profile) continue;
    sums.early += profile.scaling.early.power;
    sums.mid += profile.scaling.mid.power;
    sums.late += profile.scaling.late.power;
    count += 1;
  }
  if (count === 0) return { early: 1, mid: 1, late: 1 };

  const means = getGlobalPhaseMeans();
  const relative = {
    early: sums.early / count / means.early,
    mid: sums.mid / count / means.mid,
    late: sums.late / count / means.late,
  };
  const average = (relative.early + relative.mid + relative.late) / 3 || 1;
  return { early: relative.early / average, mid: relative.mid / average, late: relative.late / average };
}
