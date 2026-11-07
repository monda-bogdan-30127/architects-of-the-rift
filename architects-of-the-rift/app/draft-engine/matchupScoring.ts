// Singurul loc unde o relație de matchup devine valoare numerică
// (DRAFT_REWORK §4.0, MATCHUP_LEVEL_PHASE §5).
//
// Valoare pozitivă = avantaj pentru campionul nostru, negativă = dezavantaj.
// Valoarea în faza p = MATCHUP_LEVEL_WEIGHT[level] × curba[phase][p], apoi:
//   - level 2: factorul de slăbiciuni acoperite, DOAR pe mid și late;
//   - level 1: factorul de skill (diferența de `mec`), pe toate fazele;
//   - level 3: fără modificatori.
// Relațiile vin din `championMatchups.ts`; definițiile și curbele din `matchupGrades.ts`.

import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { MatchupLevel, MatchupPhase, MatchupRelation, Role } from "@/app/types/champion";
import { getMatchupRelations, getRoleMatchups, relationAppliesToEnemyRole } from "./championMatchups";
import { getChampionRoleProfile } from "./championProfileSystem";
import { resolveRoleAssignments } from "./draftRoleResolver";
import {
  MATCHUP_LEVEL_WEIGHT,
  combinePhases,
  getPhaseCurve,
  getSkillMatchupMultiplier,
  getWeaknessCoverage,
  getWeaknessCoverMultiplier,
  isHardCounter,
  isLaneCounter,
  isStrongCounter,
  type GamePhase,
  type MatchupKind,
  type MatchupPhaseWeights,
} from "./matchupGrades";

export { isHardCounter, isLaneCounter, isStrongCounter };

export type MatchupContext = {
  /** Draft: greutățile fazelor după planul compoziției proprii. Lipsă = media fazelor. */
  phaseWeights?: MatchupPhaseWeights;
  /** Simulare: o singură fază (are prioritate față de `phaseWeights`). */
  phase?: GamePhase;
  /** Level 2: aliații noștri (pot acoperi slăbiciunile NOASTRE). */
  ownAllyIds?: readonly string[];
  /** Level 2: aliații lor (pot acoperi slăbiciunile LOR). Implicit în `getMatchupValueVsTeam`: pick-urile inamice. */
  enemyAllyIds?: readonly string[];
  /** Level 1: jucătorul nostru proiectat. */
  ownPlayerId?: string | null;
  /** Level 1: jucătorul advers (un singur inamic). */
  enemyPlayerId?: string | null;
  /** Level 1 în `getMatchupValueVsTeam`: jucătorul advers se ia de pe rolul fiecărui inamic. */
  enemyRoster?: Partial<Record<Role, string>>;
  /** Rolurile finale ale inamicilor, dacă se știu (altfel se proiectează). */
  enemyAssignments?: Partial<Record<Role, string>>;
};

export type MatchupDetail = {
  enemyId: string;
  enemyRole: Role | null;
  level: MatchupLevel;
  phase: MatchupPhase;
  kind: MatchupKind;
  value: number;
};

const playersById = new Map(players.map((player) => [player.id, player]));

function getPlayerMec(playerId: string | null | undefined): number | null {
  if (!playerId) return null;
  return playersById.get(playerId)?.stats.mec ?? null;
}

function getRelationEffectValue(
  relation: Pick<MatchupRelation, "level" | "phase">,
  kind: MatchupKind,
  championId: string,
  enemyId: string,
  ctx: MatchupContext,
): number {
  const curve = getPhaseCurve(relation.level, relation.phase);
  const components = { ...curve };

  if (relation.level === 2) {
    // Slăbiciunile celui countrat, acoperite de aliații lui — contează în teamfight-uri
    // (mid / late), nu pe linie.
    const counteredId = kind === "good" ? enemyId : championId;
    const counteredAllies = kind === "good" ? ctx.enemyAllyIds : ctx.ownAllyIds;
    if (counteredAllies?.length) {
      const cover = getWeaknessCoverMultiplier(getWeaknessCoverage(counteredId, counteredAllies));
      components.mid *= cover;
      components.late *= cover;
    }
  }

  let value = MATCHUP_LEVEL_WEIGHT[relation.level] * combinePhases(components, { phase: ctx.phase, weights: ctx.phaseWeights });

  if (relation.level === 1) {
    const ownMec = getPlayerMec(ctx.ownPlayerId);
    const enemyMec = getPlayerMec(ctx.enemyPlayerId);
    value *= kind === "good"
      ? getSkillMatchupMultiplier(ownMec, enemyMec)
      : getSkillMatchupMultiplier(enemyMec, ownMec);
  }

  return kind === "good" ? value : -value;
}

/** Relațiile aplicabile și valoarea fiecăreia (pot fi două: lane + late pe același adversar). */
export function getMatchupDetails(
  championId: string,
  role: Role,
  enemyId: string,
  enemyRole: Role | null,
  ctx: MatchupContext = {},
): MatchupDetail[] {
  const relations = getMatchupRelations(championId, role, enemyId, enemyRole);
  const details: MatchupDetail[] = [];
  for (const kind of ["good", "weak"] as const) {
    const relation = relations[kind];
    if (!relation) continue;
    details.push({
      enemyId,
      enemyRole,
      level: relation.level,
      phase: relation.phase,
      kind,
      value: getRelationEffectValue(relation, kind, championId, enemyId, ctx),
    });
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

// ─── Tabele level/phase → valoare pentru deciziile discrete (ban-uri, trap) ──

type LevelPhase = Pick<MatchupRelation, "level" | "phase">;
const isLaneOrAll = (relation: LevelPhase) => relation.phase === "lane" || relation.phase === "all";

/** protectOwnCompBonus: 3/all → 2.5; 3/lane|late → 1.8; 2/all → 1.6; 2/late → 0.8; 2/lane → 0.6; 1 → 0.2. */
function protectBanValue(relation: LevelPhase): number {
  if (relation.level === 3) return relation.phase === "all" ? 2.5 : 1.8;
  if (relation.level === 2) return relation.phase === "all" ? 1.6 : relation.phase === "late" ? 0.8 : 0.6;
  return 0.2;
}
export const PROTECT_BAN_MAX = 4;

/** Valoarea de ban pentru a proteja `ownId` (pe `ownRole`) de `candidateId` (pe `candidateRole`). */
export function getProtectOwnPickBanValue(
  ownId: string,
  ownRole: Role,
  candidateId: string,
  candidateRole: Role | null,
): number {
  const weak = getMatchupRelations(ownId, ownRole, candidateId, candidateRole).weak;
  return weak ? protectBanValue(weak) : 0;
}

/**
 * getCounterProductiveBanPenalty: pick-urile inamicului îl countrează deja pe
 * candidat (dacă l-am lua noi). Proporțional cu valoarea; maxim (nu-l bana deloc)
 * la level 3 / all.
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
      if (detail.level === 3 && detail.phase === "all") return COUNTER_PRODUCTIVE_BAN.hardCounterPenalty;
      total += detail.value;
    }
  }
  return -Math.min(COUNTER_PRODUCTIVE_BAN.maxPenalty, total * COUNTER_PRODUCTIVE_BAN.valueFactor);
}

/** getTrapCounterBonus: 3/all → 4; 3/lane|late sau 2/all → 3; 2/lane|late → 2; 1 → 1. */
function trapCounterBonus(relation: LevelPhase): number {
  if (relation.level === 3) return relation.phase === "all" ? 4 : 3;
  if (relation.level === 2) return relation.phase === "all" ? 3 : 2;
  return 1;
}

export function getTrapCounterValue(
  candidateId: string,
  candidateRole: Role | null,
  baitId: string,
  baitRole: Role | null,
): number {
  if (!candidateRole) return 0;
  const good = getMatchupRelations(candidateId, candidateRole, baitId, baitRole).good;
  return good ? trapCounterBonus(good) : 0;
}

/**
 * Penalizare suplimentară: inamicul are deja pe rolul nostru un counter direct.
 * 3/lane|all → 3; 2/all sau 3/late → 1.5; 2/lane → 0.75. Lane-ul contează mai mult
 * aici, pentru că e matchup direct de linie.
 */
function directCounterPenalty(relation: LevelPhase): number {
  if (relation.level === 3) return isLaneOrAll(relation) ? 3 : 1.5;
  if (relation.level === 2) return relation.phase === "all" ? 1.5 : relation.phase === "lane" ? 0.75 : 0;
  return 0;
}

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
    const weak = getMatchupRelations(candidateId, candidateRole, enemyId, enemyRole).weak;
    if (weak) penalty = Math.max(penalty, directCounterPenalty(weak));
  }
  return penalty;
}

/** getBlindRiskPenalty: 3/all → 0.6; 3/lane|late → 0.45; 2/all → 0.3 (counteri încă disponibili). */
function blindCounterRisk(relation: LevelPhase): number {
  if (relation.level === 3) return relation.phase === "all" ? 0.6 : 0.45;
  if (relation.level === 2 && relation.phase === "all") return 0.3;
  return 0;
}

export function getAvailableCounterBlindRisk(
  candidateId: string,
  candidateRole: Role,
  isAvailable: (championId: string) => boolean,
  openEnemyRoles: readonly Role[],
): number {
  let risk = 0;
  for (const relation of getRoleMatchups(candidateId, candidateRole).weakVs) {
    const value = blindCounterRisk(relation);
    if (!value || !isAvailable(relation.championId)) continue;
    const appliesToOpenRole = openEnemyRoles.some((enemyRole) =>
      relationAppliesToEnemyRole(relation, candidateRole, enemyRole),
    );
    if (appliesToOpenRole) risk += value;
  }
  return risk;
}

/** Numărul de weakVs „strong” pe rol (siguranța de blind în simulare). */
export function countStrongCounters(championId: string, role: Role): number {
  return getRoleMatchups(championId, role).weakVs.filter(isStrongCounter).length;
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
