// ─── utils/championMasteryUtils.ts ──────────────────────────────────────────
//
// Game logic: grade resolution, draft weights, sim multipliers, pool building.
// No UI / display concerns — those live in championMasteryDisplay.ts.
//
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ChampionMasteryGrade,
  ResolvedChampionMastery,
} from "../types/championMastery";
import { championMasteryOverrides } from "../data/championMasteryOverrides";
import type { Player } from "../types/player";

// ─── Constants ───────────────────────────────────────────────────────────────

export const MASTERY_GRADES: readonly ChampionMasteryGrade[] = [
  "SS", "S", "A", "B", "C", "D", "F",
] as const;

export const MASTERY_MULTIPLIERS: Record<ChampionMasteryGrade, number> = {
  SS: 1.35,
  S:  1.20,
  A:  1.10,
  B:  1.00,
  C:  0.82,
  D:  0.65,
  F:  0.00,
};

export const GRADE_COMFORT_SCORES: Record<ChampionMasteryGrade, number> = {
  SS: 10.0,
  S:   9.25,
  A:   8.5,
  B:   7.0,
  C:   5.5,
  D:   3.5,
  F:   0.0,
};

export const GRADE_RANK: Record<ChampionMasteryGrade, number> = {
  SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1, F: 0,
};

export const isMasteryGrade = (value: unknown): value is ChampionMasteryGrade =>
  typeof value === "string" && (MASTERY_GRADES as readonly string[]).includes(value);

export const getMasteryMultiplier = (grade: ChampionMasteryGrade): number =>
  MASTERY_MULTIPLIERS[grade];

export const gradeToComfortScore = (grade: ChampionMasteryGrade): number =>
  GRADE_COMFORT_SCORES[grade];

export const compareGrades = (
  a: ChampionMasteryGrade,
  b: ChampionMasteryGrade,
): number => GRADE_RANK[a] - GRADE_RANK[b];

// ─── Meta dampening ──────────────────────────────────────────────────────────

/**
 * Returns a 0.6-1.0 multiplier that dampens mastery effects on off-meta champs.
 *
 * A SS on Aurelion Sol (off-meta, metaPriority ~3) effectively becomes ~0.84x
 * instead of full 1.35x. Faker on a nerfed champion still matters, but less.
 *
 * Curve:
 *   metaPriority 10 → 1.00 (no dampening, full mastery effect)
 *   metaPriority  7 → 0.88
 *   metaPriority  5 → 0.80 (median)
 *   metaPriority  3 → 0.72
 *   metaPriority  0 → 0.60 (heavy dampening, mostly unplayable in current meta)
 *
 * Apply this to draft scoring bonuses ONLY. Sim multiplier and variance are
 * NOT dampened — execution skill on a champion doesn't change with patches.
 */
export const getMetaDampeningFactor = (metaPriority: number): number => {
  const normalized = Math.max(0, Math.min(10, metaPriority)) / 10;
  return 0.6 + 0.4 * normalized;
};

// ─── Override detection ──────────────────────────────────────────────────────

export const hasMasteryOverride = (playerId: string): boolean =>
  Object.prototype.hasOwnProperty.call(championMasteryOverrides, playerId)
    && Object.keys(championMasteryOverrides[playerId] ?? {}).length > 0;

// ─── Grade resolution ────────────────────────────────────────────────────────

export const getChampionGrade = (
  player: Player,
  champion: string,
): ChampionMasteryGrade => {
  const overrides = championMasteryOverrides[player.id];

  if (overrides && Object.keys(overrides).length > 0) {
    return overrides[champion] ?? "F";
  }

  if (player.bestChampions.includes(champion)) return "A";
  if (player.comfortChampions?.includes(champion)) return "B";
  if (player.championPool?.includes(champion)) return "B";
  return "F";
};

export const getSimMultiplier = (player: Player, champion: string): number =>
  MASTERY_MULTIPLIERS[getChampionGrade(player, champion)];

// ─── Predicates ──────────────────────────────────────────────────────────────

export const canPlay = (player: Player, champion: string): boolean =>
  getChampionGrade(player, champion) !== "F";

export const isSignaturePick = (player: Player, champion: string): boolean => {
  const grade = getChampionGrade(player, champion);
  return grade === "SS" || grade === "S";
};

// ─── Pool resolution ─────────────────────────────────────────────────────────

export const getResolvedChampionPool = (
  player: Player,
): ResolvedChampionMastery[] => {
  const overrides = championMasteryOverrides[player.id];
  let entries: ResolvedChampionMastery[];

  if (overrides && Object.keys(overrides).length > 0) {
    entries = Object.entries(overrides)
      .filter(([, grade]) => grade !== "F")
      .map(([champion, grade]) => ({
        champion,
        grade,
        multiplier: getMasteryMultiplier(grade),
      }));
  } else {
    const seen = new Set<string>();
    const fallbackPool: { champion: string; grade: ChampionMasteryGrade }[] = [];

    for (const c of player.bestChampions) {
      if (seen.has(c)) continue;
      seen.add(c);
      fallbackPool.push({ champion: c, grade: "A" });
    }
    for (const c of player.comfortChampions ?? []) {
      if (seen.has(c)) continue;
      seen.add(c);
      fallbackPool.push({ champion: c, grade: "B" });
    }
    for (const c of player.championPool ?? []) {
      if (seen.has(c)) continue;
      seen.add(c);
      fallbackPool.push({ champion: c, grade: "B" });
    }

    entries = fallbackPool.map(({ champion, grade }) => ({
      champion,
      grade,
      multiplier: getMasteryMultiplier(grade),
    }));
  }

  return entries.sort((a, b) => b.multiplier - a.multiplier);
};

export const getDraftablePoolSize = (player: Player): number =>
  getResolvedChampionPool(player).length;

export const getMasteryStats = (
  player: Player,
): Record<ChampionMasteryGrade, number> => {
  const stats: Record<ChampionMasteryGrade, number> = {
    SS: 0, S: 0, A: 0, B: 0, C: 0, D: 0, F: 0,
  };
  for (const entry of getResolvedChampionPool(player)) {
    stats[entry.grade]++;
  }
  return stats;
};

// ─── Draft scoring ───────────────────────────────────────────────────────────

export const getMasteryContinuousBonus = (
  grade: ChampionMasteryGrade,
): number => {
  if (grade === "F") return -8.0;
  return (MASTERY_MULTIPLIERS[grade] - 1.0) * 10;
};

export const getDraftPickWeight = (
  player: Player,
  champion: string,
  baseWeight = 1.0,
): number => {
  const grade = getChampionGrade(player, champion);
  if (grade === "F") return 0;
  return baseWeight * getMasteryMultiplier(grade);
};

export const getBanPressureScore = (
  player: Player,
  champion: string,
): number => {
  const grade = getChampionGrade(player, champion);
  switch (grade) {
    case "SS": return 1.00;
    case "S":  return 0.65;
    case "A":  return 0.30;
    case "B":  return 0.10;
    default:   return 0.00;
  }
};