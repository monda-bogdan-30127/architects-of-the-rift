// ═══════════════════════════════════════════════════════════════════════════
// Trap Draft System
//
// AI occasionally leaves a strong champion unbanned on purpose, knowing
// it has powerful counter-draft answers prepared. If the user takes the
// bait, AI's subsequent picks naturally counter the "OP" champion.
//
// Activation: ~30% of games in game 1, ~45% in game 3+, never in game 5.
// The trap is subtle — it just reduces the ban score of the bait champion,
// it doesn't guarantee the user picks it.
//
// NEW FILE: place in app/draft-engine/trapDraftSystem.ts
// ═══════════════════════════════════════════════════════════════════════════

import { champions } from "@/app/data/champions";
import type { Champion, Role } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftGameState, DraftSave, Side } from "./draftTypes";
import { getChampionById, getMetaPriorityScore } from "./draftEvaluator";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function seededRoll(seed: string): number {
  return (hashSeed(seed) % 10000) / 10000;
}

type TrapCandidate = {
  championId: string;
  metaPriority: number;
  counterStrength: number;
  trapScore: number;
};

/**
 * Determines if the AI should attempt a trap draft this game.
 * Returns false for game 5 (too risky), higher chance in mid-series.
 */
function shouldAttemptTrap(series: ActiveDraftSeries, side: Side): boolean {
  const gameNumber = series.currentGameNumber ?? 1;
  const seed = `${series.seriesId}:${gameNumber}:${side}:trap-activation`;
  const roll = seededRoll(seed);

  // Never trap in decisive game 5 — too risky
  if (gameNumber >= 5) return false;

  // Activation chances:
  // Game 1: 25% (AI plays standard mostly)
  // Game 2: 35% (starting to read opponent)
  // Game 3: 45% (adaptation mode)
  // Game 4: 40% (high stakes but still adapting)
  const chances: Record<number, number> = { 1: 0.25, 2: 0.35, 3: 0.45, 4: 0.40 };
  const threshold = chances[gameNumber] ?? 0.30;

  return roll < threshold;
}

/**
 * Finds the best "bait" champion — one that looks tempting (high meta priority)
 * but has strong counters available to the AI team.
 *
 * The bait champion must:
 * 1. Have high meta priority (looks OP, user will want to pick it)
 * 2. Have strong counter-champions that the AI can draft after
 * 3. Not be a signature champion of the enemy (user would pick it regardless)
 */
function findBaitChampion(
  game: DraftGameState,
  series: ActiveDraftSeries,
  side: Side
): TrapCandidate | null {
  const unavailable = new Set([
    ...game.bansBlue,
    ...game.bansRed,
    ...game.picksBlue,
    ...game.picksRed,
  ]);

  const candidates: TrapCandidate[] = [];

  for (const champion of champions) {
    if (unavailable.has(champion.id)) continue;

    const metaPriority = getMetaPriorityScore(champion);
    // Must be tempting — at least 6.5 meta priority
    if (metaPriority < 6.5) continue;

    // Must have real counters
    const counterChampions = (champion.weakVs ?? [])
      .filter((rel) => !unavailable.has(rel.championId))
      .filter((rel) => (rel.score ?? 0) >= 3);

    if (counterChampions.length < 2) continue;

    // Must have weakness exploitable by team comp attributes
    const hasExploitableWeakness = (champion.weaknesses ?? []).some(
      (w) => w.severity >= 2
    );

    if (!hasExploitableWeakness) continue;

    // Counter strength = sum of counter scores from available counters
    const counterStrength = counterChampions
      .slice(0, 4)
      .reduce((sum, rel) => sum + (rel.score ?? 3), 0);

    // Trap score: high meta (tempting) + high counter availability
    const trapScore = metaPriority * 0.45 + counterStrength * 0.55;

    candidates.push({
      championId: champion.id,
      metaPriority,
      counterStrength,
      trapScore,
    });
  }

  if (candidates.length === 0) return null;

  // Pick the best trap — highest trapScore
  candidates.sort((a, b) => b.trapScore - a.trapScore);

  // Use seeded selection from top 3 for variety
  const seed = `${series.seriesId}:${series.currentGameNumber}:${side}:trap-select`;
  const index = hashSeed(seed) % Math.min(3, candidates.length);

  return candidates[index] ?? null;
}

/**
 * Main entry point. Called from scoreBanCandidate.
 * Returns a negative modifier for the bait champion's ban score,
 * making the AI "forget" to ban it.
 *
 * Returns 0 for most champions (no trap effect).
 * Returns a large negative number for the bait champion (AI won't ban it).
 */
export function getTrapBanReduction(
  candidate: Champion,
  game: DraftGameState,
  series: ActiveDraftSeries,
  side: Side
): number {
  // Only activate during ban phase 1 (first 6 bans, phaseIndex 0-5)
  if (game.phaseIndex >= 6) return 0;

  // Check if trap should activate this game
  if (!shouldAttemptTrap(series, side)) return 0;

  // Find the bait champion
  const bait = findBaitChampion(game, series, side);
  if (!bait) return 0;

  // Only reduce ban score for the specific bait champion
  if (candidate.id !== bait.championId) return 0;

  // Large reduction — effectively removes it from ban consideration
  // Scale with counter strength: stronger counters = more confident trap
  const reduction = clamp(bait.counterStrength * 0.8 + 3, 5, 12);

  return -reduction;
}

/**
 * After user picks the bait champion, AI gets a counter-drafting bonus
 * for champions that are strong against it.
 * Called from scorePickCandidate.
 */
export function getTrapCounterBonus(
  candidate: Champion,
  game: DraftGameState,
  series: ActiveDraftSeries,
  side: Side
): number {
  // Only works if trap was activated
  if (!shouldAttemptTrap(series, side)) return 0;

  const bait = findBaitChampion(game, series, side);
  if (!bait) return 0;

  // Check if the enemy actually picked the bait
  const enemyPicks = side === "blue" ? game.picksRed : game.picksBlue;
  if (!enemyPicks.includes(bait.championId)) return 0;

  // Bonus for champions that counter the bait
  const counterRelation = candidate.goodVs?.find(
    (rel) => rel.championId === bait.championId
  );

  if (!counterRelation) return 0;

  // Strong counter bonus — AI prioritizes the counter-pick
  return clamp((counterRelation.score ?? 3) * 0.8, 1, 4);
}
