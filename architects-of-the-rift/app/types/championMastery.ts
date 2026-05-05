// Champion Mastery System
// ─────────────────────────────────────────────────────────────────────────────
// Grades reflect how well a player can execute a specific champion.
//
//   SS  – Best in the world on this champion. Rare. Must-ban / comp-defining.
//   S   – Elite level. Strong priority in any draft context.
//   A   – Good. Reliable, competitive pick.
//   B   – Median baseline. Functional but unremarkable.
//   C   – Below average. Works in narrow situations.
//   D   – Underperforms. Avoided unless forced.
//   F   – Cannot play. Excluded from the champion pool entirely.
//
// Multipliers (applied to performance in simulation & pick weight in draft):
//
//   SS → ×1.35   S → ×1.20   A → ×1.10
//   B  → ×1.00   C → ×0.82   D → ×0.65   F → excluded
//
// ─────────────────────────────────────────────────────────────────────────────

export type ChampionMasteryGrade = "SS" | "S" | "A" | "B" | "C" | "D" | "F";

/** Map of champion slug → mastery grade for a single player. */
export type PlayerChampionMastery = Record<string, ChampionMasteryGrade>;

/** Full override map: player id → champion mastery. */
export type ChampionMasteryOverrides = Record<string, PlayerChampionMastery>;

/** Resolved champion entry — champion slug + its grade for a specific player. */
export interface ResolvedChampionMastery {
  champion: string;
  grade: ChampionMasteryGrade;
  multiplier: number;
}