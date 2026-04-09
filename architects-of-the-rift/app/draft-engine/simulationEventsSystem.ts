// ═══════════════════════════════════════════════════════════════════════════
// Simulation Events System (Upgrade 12 — Block B + C)
//
// Adds realism layers to match simulation:
//   1. Lane snowball — early lane advantage carries into mid/late (capped)
//   2. Champion power spikes — items/levels affect phase power non-linearly
//   3. Objective fights — discrete events where key fights happen
//   4. Macro mistake events — bad macro players can lose games
//   5. Champion mastery scaling — deep signature champion mastery matters
//
// NEW FILE: place in app/draft-engine/simulationEventsSystem.ts
// ═══════════════════════════════════════════════════════════════════════════

import type { Champion, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { getChampionByIdSafe, getPlayerByIdSafe, clamp, seededNoise } from "./matchSimulationUtils";
import { getPlayerChampionHistoryMetrics } from "./playerHistoryEvaluator";

// ─── 1. Lane Snowball ───────────────────────────────────────────────────────
/**
 * Calculates how much early lane advantage carries into later phases.
 * Capped so early doesn't dominate the game entirely.
 *
 * Formula: earlyDiff influences midDiff by ~35%, midDiff influences lateDiff by ~40%
 * Max swing cap: ±0.8 per phase transition to prevent runaway snowballs.
 */
export function computeLaneSnowball(args: {
  blueEarlyScore: number;
  redEarlyScore: number;
  blueMidScore: number;
  redMidScore: number;
}): {
  midSwing: { blue: number; red: number };
  lateSwing: { blue: number; red: number };
} {
  const earlyDiff = args.blueEarlyScore - args.redEarlyScore;

  // Early → Mid snowball (capped)
  // Each point of early advantage gives ~0.2 mid bonus, capped at 0.8
  const rawMidSwing = earlyDiff * 0.20;
  const midSwing = clamp(rawMidSwing, -0.8, 0.8);

  // Updated mid scores after snowball
  const effectiveBlueMid = args.blueMidScore + (midSwing > 0 ? midSwing : 0);
  const effectiveRedMid = args.redMidScore + (midSwing < 0 ? -midSwing : 0);

  // Mid → Late snowball (also capped)
  const midDiff = effectiveBlueMid - effectiveRedMid;
  const rawLateSwing = midDiff * 0.25;
  const lateSwing = clamp(rawLateSwing, -0.8, 0.8);

  return {
    midSwing: {
      blue: midSwing > 0 ? midSwing : 0,
      red: midSwing < 0 ? -midSwing : 0,
    },
    lateSwing: {
      blue: lateSwing > 0 ? lateSwing : 0,
      red: lateSwing < 0 ? -lateSwing : 0,
    },
  };
}

// ─── 2. Champion Power Spikes ───────────────────────────────────────────────
/**
 * Champions have non-linear power curves. Jinx at 3 items >> Jinx at 1 item.
 * Veigar scales infinitely. Kassadin hits 16 and starts winning.
 *
 * Returns a phase multiplier that adjusts the champion's contribution
 * in each phase based on item/level timings.
 */
export function getChampionPowerSpikeMultiplier(
  championId: string,
  phase: "early" | "mid" | "late"
): number {
  const champion = getChampionByIdSafe(championId);
  if (!champion) return 1.0;

  // Hyperscale ADCs — weak early, strong late
  const hyperscaleAdcs = new Set([
    "jinx", "kog-maw", "vayne", "aphelios", "twitch", "kayle", "veigar", "nasus", "kassadin",
  ]);
  if (hyperscaleAdcs.has(championId)) {
    if (phase === "early") return 0.85;
    if (phase === "mid") return 1.0;
    if (phase === "late") return 1.20;
  }

  // Early-game bullies — strong laning, fall off mid/late
  const earlyBullies = new Set([
    "renekton", "pantheon", "draven", "lee-sin", "elise", "xin-zhao", "olaf", "lucian",
  ]);
  if (earlyBullies.has(championId)) {
    if (phase === "early") return 1.20;
    if (phase === "mid") return 0.95;
    if (phase === "late") return 0.80;
  }

  // Mid-game spikes — item-dependent at 2-3 items
  const midSpikers = new Set([
    "orianna", "leblanc", "syndra", "ahri", "taliyah", "yone", "viego",
  ]);
  if (midSpikers.has(championId)) {
    if (phase === "early") return 0.92;
    if (phase === "mid") return 1.15;
    if (phase === "late") return 1.0;
  }

  // Teamfight monsters — strong in late-game 5v5
  const teamfighters = new Set([
    "kennen", "orianna", "miss-fortune", "karthus", "ziggs", "malphite",
  ]);
  if (teamfighters.has(championId)) {
    if (phase === "early") return 0.95;
    if (phase === "mid") return 1.0;
    if (phase === "late") return 1.12;
  }

  // Default: neutral curve
  return 1.0;
}

// ─── 3. Objective Fights ────────────────────────────────────────────────────
/**
 * Pro games are decided by ~3-5 key objective fights (Dragons, Baron, Atakhan).
 * This simulates them as discrete events that can swing a close game.
 *
 * Each fight has a winner based on:
 *   - Team teamfight readiness
 *   - Phase in which it happens
 *   - Closeness (close games have more coinflip fights)
 *   - RNG
 *
 * Returns a swing to blueTotal/redTotal representing objective game impact.
 */
export function simulateObjectiveFights(args: {
  blueTeamfightScore: number;
  redTeamfightScore: number;
  blueEngage: number;
  redEngage: number;
  closeness: number;
  seriesId: string;
  gameNumber: number;
}): { blueSwing: number; redSwing: number; fightCount: number } {
  // Number of fights depends on closeness — close games have more
  const fightCount = args.closeness >= 0.7 ? 5 : args.closeness >= 0.4 ? 4 : 3;

  let blueSwing = 0;
  let redSwing = 0;

  for (let i = 0; i < fightCount; i++) {
    // Fight strength — blend of teamfight + engage
    const blueStrength = args.blueTeamfightScore * 0.65 + args.blueEngage * 0.35;
    const redStrength = args.redTeamfightScore * 0.65 + args.redEngage * 0.35;
    const strengthDiff = blueStrength - redStrength;

    // Close games: fights are more coinflip (RNG matters more)
    const coinflipFactor = 0.4 + args.closeness * 0.6; // 0.4 to 1.0
    const fightRng = seededNoise(
      `${args.seriesId}:g${args.gameNumber}:fight:${i}`,
      1.2
    ) * coinflipFactor;

    const fightOutcome = strengthDiff * 0.3 + fightRng;

    // Each fight contributes to swing
    if (fightOutcome > 0.3) blueSwing += 0.25 + Math.abs(fightRng) * 0.1;
    else if (fightOutcome < -0.3) redSwing += 0.25 + Math.abs(fightRng) * 0.1;
    // Middle range → neutral fight (no swing)
  }

  return {
    blueSwing: clamp(blueSwing, 0, 1.5),
    redSwing: clamp(redSwing, 0, 1.5),
    fightCount,
  };
}

// ─── 4. Macro Mistake Events ────────────────────────────────────────────────
/**
 * Per-player chance to make a game-affecting macro mistake.
 * Players with low macro/consistency are more likely to:
 *   - Throw at Baron
 *   - Over-extend and die
 *   - Miss objective rotations
 *   - Bad vision control
 *
 * Chance per player per game: 12-15% base, modified by macro/consistency.
 * Impact: -0.8 to -1.2 to that player's score.
 * Rare (3%): also causes a team score swing.
 */
export function rollMacroMistake(args: {
  player: Player | null;
  playerId: string;
  seriesId: string;
  gameNumber: number;
  role: Role;
  side: "blue" | "red";
}): {
  occurred: boolean;
  severity: number; // 0.8 to 1.2 (score penalty)
  affectsTeam: boolean;
} {
  if (!args.player) return { occurred: false, severity: 0, affectsTeam: false };

  const macro = getPlayerAttribute(args.player, "macro");
  const consistency = getPlayerAttribute(args.player, "consistency");
  const discipline = getPlayerAttribute(args.player, "discipline");

  // Base chance: 13% per player per game
  // Adjusted by macro/consistency: worse players up to 18%, better down to 8%
  const skillFactor = (macro + consistency + discipline) / 3; // 0-10
  const baseChance = 0.13;
  const adjustedChance = baseChance + (5 - skillFactor) * 0.012;
  const finalChance = clamp(adjustedChance, 0.08, 0.18);

  const roll = seededNoise(
    `${args.seriesId}:g${args.gameNumber}:${args.side}:${args.role}:${args.playerId}:macro-mistake`,
    1
  ) * 0.5 + 0.5; // 0-1 range

  if (roll > finalChance) {
    return { occurred: false, severity: 0, affectsTeam: false };
  }

  // Mistake occurred — severity based on consistency
  // Low consistency → bigger mistakes
  const severity = clamp(0.8 + (6 - consistency) * 0.08, 0.8, 1.2);

  // Rare: 3% chance mistake is catastrophic enough to affect team outcome
  const catastrophicRoll = seededNoise(
    `${args.seriesId}:g${args.gameNumber}:${args.side}:${args.role}:${args.playerId}:catastrophic`,
    1
  ) * 0.5 + 0.5;
  const affectsTeam = catastrophicRoll < 0.03;

  return { occurred: true, severity, affectsTeam };
}

function getPlayerAttribute(player: Player, attr: "macro" | "consistency" | "discipline"): number {
  const advanced = player.advancedProfile?.primary;
  if (!advanced) {
    // Fallback to legacy stats
    if (attr === "macro") return player.stats?.mac ?? 5;
    if (attr === "consistency") return player.stats?.con ?? 5;
    return 5;
  }
  if (attr === "macro") return (advanced.mapAwareness + advanced.objectiveControl) / 20;
  if (attr === "consistency") return advanced.consistency / 10;
  return advanced.discipline / 10;
}

// ─── 5. Champion Mastery Scaling ────────────────────────────────────────────
/**
 * Deep champion mastery gives players a performance boost on their signatures.
 * Faker on Ahri with 200+ games is better than Faker on Ahri with 20.
 *
 * Returns a score bonus up to +1.0 for deep mastery.
 */
export function getChampionMasteryBonus(
  playerId: string | null,
  championId: string | null
): number {
  if (!playerId || !championId) return 0;

  const metrics = getPlayerChampionHistoryMetrics(playerId, championId);
  if (metrics.games < 5) return 0;

  // Mastery score from games played and win rate
  // 5-15 games: minor bonus (learning)
  // 15-40 games: solid bonus (comfortable)
  // 40+ games: deep mastery (signature)
  let bonus = 0;

  if (metrics.games >= 40) {
    bonus += 0.5; // Base deep mastery
  } else if (metrics.games >= 15) {
    bonus += 0.3;
  } else {
    bonus += 0.1;
  }

  // Win rate bonus: above 55% adds more
  if (metrics.smoothedWinRate >= 0.60) bonus += 0.35;
  else if (metrics.smoothedWinRate >= 0.55) bonus += 0.2;
  else if (metrics.smoothedWinRate >= 0.50) bonus += 0.1;

  // Recent form matters
  if (metrics.recentScoreAvg >= 7.5 && metrics.recentConfidence >= 0.5) {
    bonus += 0.15;
  }

  return clamp(bonus, 0, 1.0); // Cap at +1.0 as requested
}
