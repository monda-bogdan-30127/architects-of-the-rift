// ═══════════════════════════════════════════════════════════════════════════
// Upgrade 3: Tendency-based micro-events
//
// Connects all 8 PlayerTendencies fields to the match simulation.
// Each tendency can trigger stochastic events that swing phase scores.
// Events are seeded (deterministic per game) but probabilistic.
//
// NEW FILE: place in app/draft-engine/tendencyEventSystem.ts
// ═══════════════════════════════════════════════════════════════════════════

import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { getChampionRoleProfile } from "./championProfileSystem";
import {
  clamp,
  round1,
  seededNoise,
  getChampionByIdSafe,
  getPlayerByIdSafe,
  playerExecutionScore,
  playerLaningScore,
} from "./matchSimulationUtils";
import { ROLE_ORDER } from "./draftTypes";

// ─── Types ──────────────────────────────────────────────────────────────────

export type TendencyEvent = {
  type: string;
  phase: "early" | "mid" | "late";
  role: Role;
  playerId: string;
  impact: number;
  description: string;
};

export type TendencyEventResult = {
  earlyBonus: number;
  midBonus: number;
  lateBonus: number;
  events: TendencyEvent[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTendency(player: Player | null, key: keyof Player["advancedProfile"]["tendencies"]): number {
  if (!player) return 50;
  const value = player.advancedProfile?.tendencies?.[key];
  return typeof value === "number" ? value : 50;
}

function getPrimary(player: Player | null, key: keyof Player["advancedProfile"]["primary"]): number {
  if (!player) return 50;
  const value = player.advancedProfile?.primary?.[key];
  return typeof value === "number" ? value : 50;
}

/** Returns true if the seeded roll passes a threshold based on tendency (0-99 scale) */
function tendencyTriggers(tendencyValue: number, seed: string, threshold = 55): boolean {
  // tendency 99 → ~90% chance, tendency 50 → ~40% chance, tendency 10 → ~5% chance
  const roll = seededNoise(seed, 1) * 0.5 + 0.5; // 0-1
  const chance = clamp((tendencyValue - 20) / 80, 0.05, 0.90);
  return roll < chance;
}

/** Impact scales with tendency strength and player execution, with variance */
function eventImpact(
  tendencyValue: number,
  executionScore: number,
  seed: string,
  baseSwing: number
): number {
  const quality = (tendencyValue / 100) * 0.55 + (executionScore / 10) * 0.45;
  const variance = seededNoise(seed, 0.35);
  return round1(baseSwing * quality + variance);
}

// ─── Individual event evaluators ────────────────────────────────────────────

function evaluateInvadeEvent(
  junglePlayer: Player | null,
  enemyJunglePlayer: Player | null,
  jungleChampionId: string | null,
  seed: string
): TendencyEvent | null {
  if (!junglePlayer) return null;

  const invadeFreq = getTendency(junglePlayer, "invadeFrequency");
  if (!tendencyTriggers(invadeFreq, `${seed}:invade:trigger`, 50)) return null;

  const exec = playerExecutionScore(junglePlayer.id);
  const enemyDiscipline = enemyJunglePlayer
    ? getPrimary(enemyJunglePlayer, "discipline") / 10
    : 5;

  // Champion early power matters for invades
  const champProfile = getChampionRoleProfile(getChampionByIdSafe(jungleChampionId), "jungle");
  const champEarlyPower = champProfile?.scaling?.early?.power ?? 5;

  // Success: player execution + champion early power vs enemy discipline
  const attackPower = exec * 0.45 + champEarlyPower * 0.35 + (invadeFreq / 100) * 10 * 0.20;
  const defensePower = enemyDiscipline * 0.6 + 5 * 0.4;
  const impact = clamp((attackPower - defensePower) * 0.35, -1.2, 1.5);

  return {
    type: "invade",
    phase: "early",
    role: "jungle",
    playerId: junglePlayer.id,
    impact: round1(impact),
    description: impact > 0 ? "successful invade disrupted enemy pathing" : "failed invade gave enemy jungler tempo",
  };
}

function evaluateTowerDiveEvent(
  player: Player | null,
  role: Role,
  championId: string | null,
  enemyPlayer: Player | null,
  seed: string
): TendencyEvent | null {
  if (!player) return null;
  if (role === "adc") return null; // ADCs rarely initiate dives

  const diveFreq = getTendency(player, "towerDiveFrequency");
  if (!tendencyTriggers(diveFreq, `${seed}:dive:trigger`, 55)) return null;

  const exec = playerExecutionScore(player.id);
  const champProfile = getChampionRoleProfile(getChampionByIdSafe(championId), role);
  const diveCapability = champProfile
    ? (champProfile.accessProfile?.targetAccess ?? 5) * 0.4 +
      (champProfile.threatProfile?.backlineThreat ?? 5) * 0.3 +
      (champProfile.scaling?.early?.power ?? 5) * 0.3
    : 5;

  const enemyAntiDive = enemyPlayer
    ? getPrimary(enemyPlayer, "discipline") / 10 * 0.5 +
      getPrimary(enemyPlayer, "riskManagement") / 10 * 0.5
    : 5;

  // Tower dives are high variance — big success or big fail
  const quality = exec * 0.4 + diveCapability * 0.35 + (diveFreq / 100) * 10 * 0.25;
  const risk = enemyAntiDive * 0.5 + 4.5 * 0.5; // tower is always dangerous
  const rawImpact = (quality - risk) * 0.4;

  // Amplify variance — dives are feast-or-famine
  const impact = rawImpact >= 0
    ? clamp(rawImpact * 1.3, 0, 1.8)
    : clamp(rawImpact * 1.5, -2.0, 0);

  return {
    type: "tower-dive",
    phase: "early",
    role,
    playerId: player.id,
    impact: round1(impact),
    description: impact > 0 ? "aggressive tower dive secured a kill" : "botched tower dive gave enemy a reset",
  };
}

function evaluateObjectiveContestEvent(
  roster: Partial<Record<Role, string>>,
  assignments: Partial<Record<Role, string>>,
  seed: string
): TendencyEvent | null {
  // Team-level tendency: average objectiveContestBias across all players
  let totalBias = 0;
  let count = 0;
  let bestPlayerId = "";
  let bestBias = 0;

  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    if (!playerId) continue;
    const player = getPlayerByIdSafe(playerId);
    if (!player) continue;

    const bias = getTendency(player, "objectiveContestBias");
    totalBias += bias;
    count += 1;
    if (bias > bestBias) {
      bestBias = bias;
      bestPlayerId = playerId;
    }
  }

  if (count === 0) return null;
  const avgBias = totalBias / count;

  if (!tendencyTriggers(avgBias, `${seed}:objective:trigger`, 50)) return null;

  // Higher contest bias = more drake/baron fights forced
  // Success depends on teamfight power and objective control of champions
  let champObjective = 0;
  let champCount = 0;
  for (const role of ROLE_ORDER) {
    const champId = assignments[role];
    const champ = getChampionByIdSafe(champId ?? null);
    if (!champ) continue;
    const obj = champ.offers
      .filter((o) => ["objectiveControl", "zoneControl", "engage"].includes(o.type))
      .reduce((sum, o) => sum + o.strength, 0);
    champObjective += obj;
    champCount += 1;
  }

  const champPower = champCount > 0 ? champObjective / champCount : 0;
  const impact = clamp((avgBias / 100 * 10 * 0.4 + champPower * 0.6 - 4) * 0.22, -0.6, 1.2);

  return {
    type: "objective-contest",
    phase: "mid",
    role: "jungle",
    playerId: bestPlayerId,
    impact: round1(impact),
    description: impact > 0 ? "proactive objective contest secured dragon" : "forced objective fight backfired",
  };
}

function evaluateSplitPushEvent(
  player: Player | null,
  role: Role,
  championId: string | null,
  seed: string
): TendencyEvent | null {
  if (!player) return null;
  if (role !== "top" && role !== "mid") return null;

  const splitBias = getTendency(player, "splitPushBias");
  if (!tendencyTriggers(splitBias, `${seed}:split:trigger`, 55)) return null;

  const laning = playerLaningScore(player.id);
  const champProfile = getChampionRoleProfile(getChampionByIdSafe(championId), role);
  const sidelanePower = champProfile?.roleSpecific?.top?.sideLaneControl ?? 5;

  const quality = laning * 0.35 + sidelanePower * 0.35 + (splitBias / 100) * 10 * 0.30;
  const impact = clamp((quality - 5) * 0.28, -0.5, 1.0);

  return {
    type: "split-push",
    phase: "mid",
    role,
    playerId: player.id,
    impact: round1(impact),
    description: impact > 0 ? "split push pressure created map advantage" : "over-committed split push got collapsed on",
  };
}

function evaluateFlankEvent(
  player: Player | null,
  role: Role,
  championId: string | null,
  seed: string
): TendencyEvent | null {
  if (!player) return null;
  if (role === "adc") return null; // ADCs don't flank

  const flankPref = getTendency(player, "flankPreference");
  if (!tendencyTriggers(flankPref, `${seed}:flank:trigger`, 58)) return null;

  const exec = playerExecutionScore(player.id);
  const champProfile = getChampionRoleProfile(getChampionByIdSafe(championId), role);
  const accessPower = champProfile
    ? (champProfile.accessProfile?.targetAccess ?? 5) * 0.5 +
      (champProfile.threatProfile?.backlineThreat ?? 5) * 0.5
    : 5;

  // Flanks are playmaking moments — high ceiling, real floor
  const quality = exec * 0.4 + accessPower * 0.35 + (flankPref / 100) * 10 * 0.25;
  const rawImpact = (quality - 5) * 0.32;
  const impact = rawImpact >= 0
    ? clamp(rawImpact * 1.2, 0, 1.5)
    : clamp(rawImpact * 1.4, -1.2, 0);

  return {
    type: "flank-play",
    phase: "late",
    role,
    playerId: player.id,
    impact: round1(impact),
    description: impact > 0 ? "devastating flank turned the teamfight" : "flank mistimed and got isolated",
  };
}

function evaluateLaneRevisitEvent(
  player: Player | null,
  role: Role,
  championId: string | null,
  seed: string
): TendencyEvent | null {
  if (!player) return null;
  if (role !== "jungle" && role !== "support") return null;

  const revisitBias = getTendency(player, "laneRevisitBias");
  if (!tendencyTriggers(revisitBias, `${seed}:revisit:trigger`, 52)) return null;

  const mapSense = getPrimary(player, "mapAwareness") / 10;
  const champProfile = getChampionRoleProfile(getChampionByIdSafe(championId), role);
  const roamPower = champProfile
    ? (champProfile.roleSpecific?.support?.roamValue ??
       champProfile.roleSpecific?.jungle?.gankPower ?? 5)
    : 5;

  const quality = mapSense * 0.45 + roamPower * 0.30 + (revisitBias / 100) * 10 * 0.25;
  const impact = clamp((quality - 5) * 0.25, -0.4, 0.9);

  return {
    type: "lane-revisit",
    phase: "early",
    role,
    playerId: player.id,
    impact: round1(impact),
    description: impact > 0 ? "repeated ganks snowballed a lane" : "predictable pathing got tracked and punished",
  };
}

function evaluateResetDisciplineEffect(
  roster: Partial<Record<Role, string>>,
  seed: string
): { midPenalty: number; latePenalty: number } {
  // Team-level: poor reset discipline = throwing leads, getting caught
  // Good reset discipline = clean macro, consistent advantage maintenance
  let totalDiscipline = 0;
  let count = 0;

  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    if (!playerId) continue;
    const player = getPlayerByIdSafe(playerId);
    if (!player) continue;

    totalDiscipline += getTendency(player, "resetDiscipline");
    count += 1;
  }

  if (count === 0) return { midPenalty: 0, latePenalty: 0 };

  const avgDiscipline = totalDiscipline / count;
  // Low discipline (< 45) = penalty; high discipline (> 65) = small bonus
  const modifier = clamp((avgDiscipline - 55) / 100 * 0.8, -0.5, 0.3);

  return {
    midPenalty: round1(-modifier * 0.6), // less impact mid
    latePenalty: round1(-modifier),       // full impact late (resets matter most late)
  };
}

function evaluateSafeLaneEffect(
  roster: Partial<Record<Role, string>>,
  seed: string
): number {
  // High safeLanePreference across the team = lower variance, more predictable early game
  // This acts as a small stability bonus (or penalty if very low = too many risks)
  let totalSafe = 0;
  let count = 0;

  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    if (!playerId) continue;
    const player = getPlayerByIdSafe(playerId);
    if (!player) continue;

    totalSafe += getTendency(player, "safeLanePreference");
    count += 1;
  }

  if (count === 0) return 0;

  const avgSafe = totalSafe / count;
  // Very high safe lane = small early stability bonus
  // Very low safe lane = small early instability penalty
  return round1(clamp((avgSafe - 50) / 100 * 0.6, -0.3, 0.3));
}

// ─── Main entry point ───────────────────────────────────────────────────────

export function computeTendencyEvents(args: {
  roster: Partial<Record<Role, string>>;
  assignments: Partial<Record<Role, string>>;
  enemyRoster: Partial<Record<Role, string>>;
  enemyAssignments: Partial<Record<Role, string>>;
  seedRoot: string;
  side: "blue" | "red";
}): TendencyEventResult {
  const { roster, assignments, enemyRoster, enemyAssignments, seedRoot, side } = args;
  const seed = `${seedRoot}:${side}:tendency`;

  const events: TendencyEvent[] = [];
  let earlyBonus = 0;
  let midBonus = 0;
  let lateBonus = 0;

  // ─── Per-role events ────────────────────────────────────────────────────
  for (const role of ROLE_ORDER) {
    const playerId = roster[role] ?? null;
    const championId = assignments[role] ?? null;
    const player = getPlayerByIdSafe(playerId);

    const enemyPlayerId = enemyRoster[role] ?? null;
    const enemyPlayer = getPlayerByIdSafe(enemyPlayerId);

    const roleSeed = `${seed}:${role}`;

    // Invade (jungle only)
    if (role === "jungle") {
      const invade = evaluateInvadeEvent(player, enemyPlayer, championId, roleSeed);
      if (invade) {
        events.push(invade);
        earlyBonus += invade.impact;
      }
    }

    // Tower dive (any non-ADC)
    const dive = evaluateTowerDiveEvent(player, role, championId, enemyPlayer, roleSeed);
    if (dive) {
      events.push(dive);
      earlyBonus += dive.impact * 0.6;
      midBonus += dive.impact * 0.4;
    }

    // Split push (top/mid only)
    const split = evaluateSplitPushEvent(player, role, championId, roleSeed);
    if (split) {
      events.push(split);
      midBonus += split.impact * 0.5;
      lateBonus += split.impact * 0.5;
    }

    // Flank plays (non-ADC)
    const flank = evaluateFlankEvent(player, role, championId, roleSeed);
    if (flank) {
      events.push(flank);
      lateBonus += flank.impact;
    }

    // Lane revisit (jungle/support)
    const revisit = evaluateLaneRevisitEvent(player, role, championId, roleSeed);
    if (revisit) {
      events.push(revisit);
      earlyBonus += revisit.impact * 0.7;
      midBonus += revisit.impact * 0.3;
    }
  }

  // ─── Team-level effects ─────────────────────────────────────────────────

  // Objective contest (team average)
  const objective = evaluateObjectiveContestEvent(roster, assignments, seed);
  if (objective) {
    events.push(objective);
    midBonus += objective.impact;
  }

  // Reset discipline (affects mid and late)
  const resetEffect = evaluateResetDisciplineEffect(roster, seed);
  midBonus += resetEffect.midPenalty;
  lateBonus += resetEffect.latePenalty;

  // Safe lane preference (affects early stability)
  const safeLaneBonus = evaluateSafeLaneEffect(roster, seed);
  earlyBonus += safeLaneBonus;

  return {
    earlyBonus: round1(clamp(earlyBonus, -3, 3)),
    midBonus: round1(clamp(midBonus, -2.5, 2.5)),
    lateBonus: round1(clamp(lateBonus, -2.5, 2.5)),
    events,
  };
}
