// ═══════════════════════════════════════════════════════════════════════════
// Upgrade 4: Personality-driven variance
//
// Connects all 5 PlayerHiddenTraits to the match simulation:
//   volatility  → per-player RNG spread (wider distribution)
//   greed       → amplifies carry ceiling, increases fail floor
//   composure   → clutch scaling in close games
//   leadership  → team stability bonus from best leader
//   communication → team coordination for teamfights + objectives
//
// NEW FILE: place in app/draft-engine/personalitySystem.ts
// ═══════════════════════════════════════════════════════════════════════════

import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import {
  clamp,
  round1,
  seededNoise,
  getPlayerByIdSafe,
} from "./matchSimulationUtils";
import { ROLE_ORDER } from "./draftTypes";

// ─── Types ──────────────────────────────────────────────────────────────────

export type TeamChemistry = {
  leadershipBonus: number;
  communicationBonus: number;
  teamChemistryScore: number;
};

export type PlayerPersonalityModifiers = {
  volatilityRngScale: number;
  greedCarryAmplifier: number;
  greedRiskAmplifier: number;
  composureClutchScale: number;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getHidden(player: Player | null, key: keyof Player["advancedProfile"]["hiddenTraits"]): number {
  if (!player) return 50;
  const value = player.advancedProfile?.hiddenTraits?.[key];
  return typeof value === "number" ? value : 50;
}

// ─── Team chemistry ─────────────────────────────────────────────────────────

/**
 * Computes team-level bonuses from leadership and communication.
 * 
 * Leadership: The best leader on the team provides a stability + objective
 * bonus to the whole team. A team with a strong shotcaller (Faker, Keria)
 * plays cleaner macro.
 * 
 * Communication: Average communication across 5 players affects teamfight
 * coordination. A team of 5 players who all communicate well executes
 * teamfights and rotations better than a team of silent individuals.
 */
export function computeTeamChemistry(
  roster: Partial<Record<Role, string>>
): TeamChemistry {
  let bestLeadership = 0;
  let totalComm = 0;
  let count = 0;

  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    if (!playerId) continue;
    const player = getPlayerByIdSafe(playerId);
    if (!player) continue;

    const leadership = getHidden(player, "leadership");
    const communication = getHidden(player, "communication");

    if (leadership > bestLeadership) bestLeadership = leadership;
    totalComm += communication;
    count += 1;
  }

  if (count === 0) return { leadershipBonus: 0, communicationBonus: 0, teamChemistryScore: 5 };

  const avgComm = totalComm / count;

  // Leadership: best leader above 65 → positive bonus, below 45 → penalty
  // Scale: 0-99 → roughly -0.4 to +0.6 bonus
  const leadershipBonus = round1(clamp((bestLeadership - 55) / 100 * 1.0, -0.4, 0.6));

  // Communication: team average above 65 → coordination bonus, below 45 → penalty
  // Scale: 0-99 → roughly -0.35 to +0.5 bonus
  const communicationBonus = round1(clamp((avgComm - 55) / 100 * 0.85, -0.35, 0.5));

  // Combined team chemistry score (0-10 scale, centered at 5)
  const teamChemistryScore = round1(clamp(
    5 + leadershipBonus * 2.5 + communicationBonus * 2.5,
    0,
    10
  ));

  return { leadershipBonus, communicationBonus, teamChemistryScore };
}

// ─── Per-player personality modifiers ───────────────────────────────────────

/**
 * Computes per-player modifiers based on their hidden traits.
 * Used in buildPlayerScores to adjust individual player scoring.
 * 
 * Volatility: High volatility = wider RNG spread. A volatile player
 * (Chovy on a bad day vs Chovy on a good day) has bigger swings.
 * The base RNG amplitude is multiplied by this factor.
 * 
 * Greed: A greedy player on a carry champion has higher ceiling
 * (carryFactor amplified) but also higher risk (mistakeRisk amplified).
 * On utility champions, greed is a slight penalty (doesn't play for team).
 * 
 * Composure: In close games (high closeness), composure amplifies
 * or dampens the clutch modifier. A composed player performs better
 * when the game is tight; an uncomposed player chokes.
 */
export function getPlayerPersonalityModifiers(
  playerId: string | null,
  championTags: Set<string>,
  closeness: number
): PlayerPersonalityModifiers {
  const player = getPlayerByIdSafe(playerId);
  if (!player) {
    return {
      volatilityRngScale: 1.0,
      greedCarryAmplifier: 0,
      greedRiskAmplifier: 0,
      composureClutchScale: 1.0,
    };
  }

  const volatility = getHidden(player, "volatility");
  const greed = getHidden(player, "greed");
  const composure = getHidden(player, "composure");

  // ─── Volatility → RNG scale ───────────────────────────────────────────
  // volatility 50 → scale 1.0 (normal)
  // volatility 80 → scale 1.45 (big swings)
  // volatility 20 → scale 0.7 (very consistent)
  const volatilityRngScale = clamp(0.7 + (volatility - 20) / 100 * 1.0, 0.55, 1.6);

  // ─── Greed → carry/risk amplification ─────────────────────────────────
  // Only affects carry-type champions positively
  const isCarryChamp = championTags.has("dps") || championTags.has("burst") ||
    championTags.has("carry") || championTags.has("self-sufficient");
  const isUtilityChamp = championTags.has("utility") || championTags.has("warden") ||
    championTags.has("enchanter") || championTags.has("tank");

  let greedCarryAmplifier = 0;
  let greedRiskAmplifier = 0;

  if (isCarryChamp) {
    // Greedy player on carry → bigger plays, bigger risks
    greedCarryAmplifier = clamp((greed - 50) / 100 * 0.4, -0.1, 0.25);
    greedRiskAmplifier = clamp((greed - 40) / 100 * 0.3, 0, 0.2);
  } else if (isUtilityChamp) {
    // Greedy player on utility → slight penalty (doesn't play selflessly)
    greedCarryAmplifier = clamp((greed - 60) / 100 * -0.15, -0.15, 0);
    greedRiskAmplifier = clamp((greed - 60) / 100 * 0.1, 0, 0.1);
  }

  // ─── Composure → clutch scaling ───────────────────────────────────────
  // In close games (closeness > 0.6), composure matters a lot.
  // composure 80 → clutch modifier amplified by 1.35x
  // composure 30 → clutch modifier dampened to 0.7x
  // In non-close games, composure barely matters.
  const closenessWeight = clamp(closeness, 0, 1);
  const baseComposureScale = clamp(0.7 + (composure - 30) / 100 * 0.9, 0.6, 1.45);
  // Blend: in close games composure matters, in stomps it doesn't
  const composureClutchScale = 1.0 + (baseComposureScale - 1.0) * closenessWeight;

  return {
    volatilityRngScale: round1(volatilityRngScale * 100) / 100,
    greedCarryAmplifier: round1(greedCarryAmplifier * 100) / 100,
    greedRiskAmplifier: round1(greedRiskAmplifier * 100) / 100,
    composureClutchScale: round1(composureClutchScale * 100) / 100,
  };
}
