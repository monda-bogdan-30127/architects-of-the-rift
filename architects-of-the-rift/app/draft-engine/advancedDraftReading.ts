// ═══════════════════════════════════════════════════════════════════════════
// Upgrade 13 — Advanced Draft Reading + Simulation Events
//
// DRAFT additions:
//   1. Plan-adaptive ban logic (bans target enemies of chosen plan)
//   2. Draft conflict detection (contested picks get urgency bonus)
//   3. Pick pattern learning (ban preemptive on OP user-favorite champs)
//   4. Counter-ban theory (deduce user style from user bans)
//
// SIMULATION additions:
//   5. Jungle pathing events (discrete gank events)
//   6. Draft spike windows (abstract timing — early/mid/late spike strength)
//   7. Comeback mechanics (8-10% chance reversal in close games)
//
// NEW FILE: place in app/draft-engine/advancedDraftReading.ts
// ═══════════════════════════════════════════════════════════════════════════

import type { Champion, Role } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";
import { getChampionById, getMetaPriorityScore } from "./draftEvaluator";
import { getChampionRoleProfile } from "./championProfileSystem";
import type { DraftPlan, DraftPlanType } from "./draftPlanSystem";
import { getUserPickCounts } from "./userDraftMemory";
import { clamp, seededNoise } from "./matchSimulationUtils";

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: DRAFT SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════

// ─── 1. Plan-adaptive ban logic ─────────────────────────────────────────────
/**
 * Returns a bonus to ban score if the candidate is a natural enemy of the
 * AI's chosen draft plan. E.g. if AI plan is "dive", banning peel-heavy
 * supports (Braum, Lulu) protects the dive execution.
 *
 * Called from scoreBanCandidate — added to the totalScore for the ban.
 */
export function getPlanAdaptiveBanBonus(
  candidate: Champion,
  plan: DraftPlan | null
): number {
  if (!plan) return 0;

  // Get candidate's primary tags (role-agnostic)
  const profile = getChampionRoleProfile(candidate);
  if (!profile) return 0;
  const tags = new Set(profile.tags ?? []);

  // Which tags are "natural enemies" of each plan?
  const planCounters: Record<DraftPlanType, string[]> = {
    "dive":          ["peel", "warden", "enchanter", "disengage", "anti-dive"],
    "poke":          ["dive", "engage", "gap-closer", "hard-engage"],
    "pick":          ["warden", "peel", "enchanter", "group-up"],
    "front-to-back": ["dive", "backlineAccess", "burst", "assassin"],
    "teamfight":     ["pick", "poke", "split-push"],
    "protect-carry": ["dive", "pick", "burst", "assassin"],
  };

  const threateningTags = planCounters[plan.type] ?? [];
  let matches = 0;
  for (const tag of threateningTags) {
    if (tags.has(tag)) matches += 1;
  }

  if (matches === 0) return 0;

  // Each matching tag = ~1.5 bonus, scaled by plan confidence
  return clamp(matches * 1.5 * plan.confidence, 0, 5);
}

// ─── 2. Draft conflict detection ────────────────────────────────────────────
/**
 * Detects if a champion is "contested" — both user and AI want it.
 * AI first-picks contested champions more aggressively to avoid losing them.
 *
 * A champion is contested if:
 *   - High meta priority (both sides would naturally want it)
 *   - Fits both the AI's plan AND user's historical pick patterns
 *   - Is a signature of a user player
 */
export function getContestedPickUrgency(args: {
  candidate: Champion;
  plan: DraftPlan | null;
  series: ActiveDraftSeries;
  userSide: Side;
  currentPickNumber: number;
}): number {
  const { candidate, plan } = args;
  const metaPriority = getMetaPriorityScore(candidate);

  // Only applies for high meta champions
  if (metaPriority < 6.5) return 0;

  // Only applies in the first 3 picks — after that, contests are resolved
  if (args.currentPickNumber > 3) return 0;

  let contestedScore = 0;

  // Factor 1: Is this a champion the user has picked recently?
  const userPickCounts = getUserPickCounts();
  const userPickFreq = userPickCounts[candidate.id] ?? 0;
  if (userPickFreq >= 2) contestedScore += 1.5; // User loves this champion
  else if (userPickFreq >= 1) contestedScore += 0.8;

  // Factor 2: High meta = high contest naturally
  if (metaPriority >= 8) contestedScore += 1.2;
  else if (metaPriority >= 7) contestedScore += 0.6;

  // Factor 3: Fits AI plan = AI really wants it
  if (plan) {
    const profile = getChampionRoleProfile(candidate);
    const tags = new Set(profile?.tags ?? []);
    const planDesiredTags: Record<DraftPlanType, string[]> = {
      "dive":          ["dive", "engage", "follow-up"],
      "poke":          ["poke", "zone-control", "disengage"],
      "pick":          ["pick", "burst", "reliableCC"],
      "front-to-back": ["frontline", "peel", "dps"],
      "teamfight":     ["engage", "frontline", "follow-up"],
      "protect-carry": ["peel", "warden", "dps"],
    };
    const desired = planDesiredTags[plan.type] ?? [];
    const matches = desired.filter((t) => tags.has(t)).length;
    if (matches >= 2) contestedScore += 1.0 * plan.confidence;
  }

  return clamp(contestedScore, 0, 3);
}

// ─── 3. Pick pattern learning (preemptive bans on OP user favorites) ────────
/**
 * Returns bonus to ban score if the candidate is:
 *   - Something user picks often (from userDraftMemory)
 *   - AND has high meta priority (OP)
 *
 * Logic: If OP, ban preemptively. If niche, let it be (user will signal their hand).
 */
export function getUserFavoriteBanBonus(
  candidate: Champion,
  series: ActiveDraftSeries
): number {
  const pickCounts = getUserPickCounts();
  const userPickFreq = pickCounts[candidate.id] ?? 0;

  // User must have picked this champion at least 2 times previously
  if (userPickFreq < 2) return 0;

  const metaPriority = getMetaPriorityScore(candidate);

  // If it's OP, big ban bonus (preemptive)
  if (metaPriority >= 7.5) {
    return clamp(userPickFreq * 0.9 + 1.5, 1.5, 4.5);
  }

  // If it's a solid meta champion (6-7.5), moderate ban bonus
  if (metaPriority >= 6) {
    return clamp(userPickFreq * 0.5, 0, 2);
  }

  // Niche champion — don't ban (let user reveal plan)
  return 0;
}

// ─── 4. Counter-ban theory (simpler version) ────────────────────────────────
/**
 * Deduces user's intended playstyle from their bans.
 * If user bans Orianna + Azir + Syndra, they probably fear control mages →
 * they're playing assassin mid → AI wants anti-assassin picks.
 *
 * Returns a DraftPlanType that user is likely to play (or null if unclear).
 * Used to adjust both plan selection and pick scoring.
 */
export function deduceUserPlan(
  game: DraftGameState,
  userSide: Side
): DraftPlanType | null {
  const userBans = userSide === "blue" ? game.bansBlue : game.bansRed;
  if (userBans.length < 2) return null;

  // Count what tags user is banning — they fear these → they play counter
  const bannedTags: Record<string, number> = {};

  for (const banId of userBans) {
    const champ = getChampionById(banId);
    if (!champ) continue;
    const profile = getChampionRoleProfile(champ);
    if (!profile) continue;

    for (const tag of profile.tags ?? []) {
      bannedTags[tag] = (bannedTags[tag] ?? 0) + 1;
    }
  }

  // Deduction rules (simple heuristics):
  // User banning peel/warden champions → fears dive comps → playing dive
  if ((bannedTags["peel"] ?? 0) + (bannedTags["warden"] ?? 0) >= 2) {
    return "dive";
  }
  // User banning dive/engage → fears being dived → playing poke or protect-carry
  if ((bannedTags["dive"] ?? 0) + (bannedTags["engage"] ?? 0) >= 2) {
    return "poke";
  }
  // User banning control mages (burst+zone) → fears mid burst → playing assassin or pick
  if ((bannedTags["burst"] ?? 0) + (bannedTags["zone-control"] ?? 0) >= 2) {
    return "pick";
  }
  // User banning frontline → fears teamfight → playing pick or poke
  if ((bannedTags["frontline"] ?? 0) >= 2) {
    return "pick";
  }
  // User banning poke → fears siege → playing dive
  if ((bannedTags["poke"] ?? 0) >= 2) {
    return "dive";
  }

  return null;
}

/**
 * Returns bonus for picks that counter the user's deduced plan.
 */
export function getCounterToUserPlanBonus(
  candidate: Champion,
  deducedUserPlan: DraftPlanType | null
): number {
  if (!deducedUserPlan) return 0;

  const profile = getChampionRoleProfile(candidate);
  if (!profile) return 0;
  const tags = new Set(profile.tags ?? []);

  // Counter tags per deduced user plan
  const counterTags: Record<DraftPlanType, string[]> = {
    "dive":          ["peel", "warden", "enchanter", "disengage", "anti-dive"],
    "poke":          ["dive", "engage", "gap-closer"],
    "pick":          ["warden", "peel", "group-up"],
    "front-to-back": ["dive", "backlineAccess", "burst"],
    "teamfight":     ["pick", "poke"],
    "protect-carry": ["dive", "pick", "burst"],
  };

  const counters = counterTags[deducedUserPlan] ?? [];
  let matches = 0;
  for (const tag of counters) {
    if (tags.has(tag)) matches += 1;
  }

  if (matches === 0) return 0;
  return clamp(matches * 0.9, 0, 2.5);
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: SIMULATION SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════

// ─── 5. Jungle pathing events ───────────────────────────────────────────────
/**
 * Simulates discrete gank events during early/mid game.
 *
 * Returns swings to lane scores based on successful ganks.
 * A strong jungler ganking a weak vision lane = big swing.
 *
 * Typically 1-3 gank events per game total (blue + red combined).
 */
export function simulateJunglePathing(args: {
  blueJunglerId: string | null;
  redJunglerId: string | null;
  blueLaneScores: { top: number; mid: number; bot: number };
  redLaneScores: { top: number; mid: number; bot: number };
  blueJunglerMacro: number;
  redJunglerMacro: number;
  seriesId: string;
  gameNumber: number;
}): {
  blueTopSwing: number;
  blueMidSwing: number;
  blueBotSwing: number;
  redTopSwing: number;
  redMidSwing: number;
  redBotSwing: number;
  events: Array<{ side: "blue" | "red"; lane: "top" | "mid" | "bot"; strength: number }>;
} {
  const events: Array<{ side: "blue" | "red"; lane: "top" | "mid" | "bot"; strength: number }> = [];

  let blueTopSwing = 0, blueMidSwing = 0, blueBotSwing = 0;
  let redTopSwing = 0, redMidSwing = 0, redBotSwing = 0;

  const lanes: Array<"top" | "mid" | "bot"> = ["top", "mid", "bot"];

  // Each side rolls for gank events based on jungler macro
  for (const side of ["blue", "red"] as const) {
    const junglerMacro = side === "blue" ? args.blueJunglerMacro : args.redJunglerMacro;
    const enemyLaneScores = side === "blue" ? args.redLaneScores : args.blueLaneScores;

    // Gank count: 1-3 based on jungler skill
    // Better jungler = more successful ganks
    const rollGankCount = seededNoise(
      `${args.seriesId}:g${args.gameNumber}:${side}:gank-count`,
      1
    ) * 0.5 + 0.5; // 0-1

    // Jungler macro 5 = 1-2 ganks avg, macro 8 = 2-3 ganks avg
    const baseGanks = 1 + Math.floor((junglerMacro - 4) * 0.3);
    const gankCount = clamp(baseGanks + (rollGankCount > 0.6 ? 1 : 0), 1, 3);

    for (let g = 0; g < gankCount; g++) {
      // Pick a lane to gank — prefer weak enemy lanes
      const laneRoll = seededNoise(
        `${args.seriesId}:g${args.gameNumber}:${side}:gank-${g}:lane`,
        1
      ) * 0.5 + 0.5;
      const targetLane = lanes[Math.floor(laneRoll * lanes.length)] ?? "mid";

      // Success check: jungler macro vs enemy lane (low lane = low vision = easy gank)
      const enemyLaneStrength = enemyLaneScores[targetLane];
      const successRoll = seededNoise(
        `${args.seriesId}:g${args.gameNumber}:${side}:gank-${g}:success`,
        1
      ) * 0.5 + 0.5;

      // Success chance: higher jungler macro vs lower enemy lane = more likely
      const successChance = clamp(
        0.35 + (junglerMacro - 5) * 0.04 + (5 - enemyLaneStrength) * 0.06,
        0.2,
        0.75
      );

      if (successRoll < successChance) {
        // Successful gank: +0.6 to friendly lane, -0.5 to enemy lane
        const strength = 0.5 + successRoll * 0.3;

        if (side === "blue") {
          if (targetLane === "top") blueTopSwing += strength;
          if (targetLane === "mid") blueMidSwing += strength;
          if (targetLane === "bot") blueBotSwing += strength;
          if (targetLane === "top") redTopSwing -= strength * 0.8;
          if (targetLane === "mid") redMidSwing -= strength * 0.8;
          if (targetLane === "bot") redBotSwing -= strength * 0.8;
        } else {
          if (targetLane === "top") redTopSwing += strength;
          if (targetLane === "mid") redMidSwing += strength;
          if (targetLane === "bot") redBotSwing += strength;
          if (targetLane === "top") blueTopSwing -= strength * 0.8;
          if (targetLane === "mid") blueMidSwing -= strength * 0.8;
          if (targetLane === "bot") blueBotSwing -= strength * 0.8;
        }

        events.push({ side, lane: targetLane, strength });
      }
    }
  }

  return {
    blueTopSwing: clamp(blueTopSwing, -1.5, 1.5),
    blueMidSwing: clamp(blueMidSwing, -1.5, 1.5),
    blueBotSwing: clamp(blueBotSwing, -1.5, 1.5),
    redTopSwing: clamp(redTopSwing, -1.5, 1.5),
    redMidSwing: clamp(redMidSwing, -1.5, 1.5),
    redBotSwing: clamp(redBotSwing, -1.5, 1.5),
    events,
  };
}

// ─── 6. Draft spike windows (abstract) ──────────────────────────────────────
/**
 * Computes the "spike strength" of each team in each phase.
 * Strong spike = team has champions that peak in that phase.
 *
 * The team with the bigger spike in a given phase gets a bonus in that phase.
 *
 * Simpler than explicit timings — uses champion phase tags.
 */
export function computeDraftSpikeWindows(
  blueAssignments: Partial<Record<Role, string>>,
  redAssignments: Partial<Record<Role, string>>
): {
  earlySpikeAdvantage: { blue: number; red: number };
  midSpikeAdvantage: { blue: number; red: number };
  lateSpikeAdvantage: { blue: number; red: number };
} {
  const computeTeamSpikes = (assignments: Partial<Record<Role, string>>) => {
    let earlySpikes = 0, midSpikes = 0, lateSpikes = 0;

    for (const champId of Object.values(assignments)) {
      if (!champId) continue;
      const champ = getChampionById(champId);
      if (!champ) continue;

      // Use presence of tags to infer spike timing
      const profile = getChampionRoleProfile(champ);
      if (!profile) continue;
      const tags = new Set(profile.tags ?? []);

      // Early-game power
      if (tags.has("lane-bully") || tags.has("early-game")) earlySpikes += 1.5;
      if (tags.has("early-pressure")) earlySpikes += 1.0;

      // Mid-game power
      if (tags.has("mid-game") || tags.has("item-dependent")) midSpikes += 1.3;
      if (tags.has("burst") && !tags.has("late-game")) midSpikes += 0.8;

      // Late-game power
      if (tags.has("scaling") || tags.has("late-game") || tags.has("hyperscale")) lateSpikes += 1.5;
      if (tags.has("dps") && !tags.has("early-game")) lateSpikes += 0.7;

      // Fallback: use phase power from champion data if available
      const earlyPower = profile.scaling?.early?.power ?? 5;
      const midPower = profile.scaling?.mid?.power ?? 5;
      const latePower = profile.scaling?.late?.power ?? 5;
      earlySpikes += (earlyPower - 5) * 0.15;
      midSpikes += (midPower - 5) * 0.15;
      lateSpikes += (latePower - 5) * 0.15;
    }

    return { earlySpikes, midSpikes, lateSpikes };
  };

  const blueSpikes = computeTeamSpikes(blueAssignments);
  const redSpikes = computeTeamSpikes(redAssignments);

  // Advantage = difference, capped
  const earlyDiff = blueSpikes.earlySpikes - redSpikes.earlySpikes;
  const midDiff = blueSpikes.midSpikes - redSpikes.midSpikes;
  const lateDiff = blueSpikes.lateSpikes - redSpikes.lateSpikes;

  return {
    earlySpikeAdvantage: {
      blue: clamp(earlyDiff * 0.15, 0, 0.8),
      red: clamp(-earlyDiff * 0.15, 0, 0.8),
    },
    midSpikeAdvantage: {
      blue: clamp(midDiff * 0.15, 0, 0.8),
      red: clamp(-midDiff * 0.15, 0, 0.8),
    },
    lateSpikeAdvantage: {
      blue: clamp(lateDiff * 0.15, 0, 0.8),
      red: clamp(-lateDiff * 0.15, 0, 0.8),
    },
  };
}

// ─── 7. Comeback mechanics ──────────────────────────────────────────────────
/**
 * Checks if a close game has a chance to be reversed.
 *
 * Conditions (ALL required):
 *   a) Loser has better late-game scaling than winner
 *   b) Winner has weak macro/discipline (prone to throws)
 *   c) Game was close (scoreDiff < 2)
 *
 * If all conditions met → 8-10% chance the game reverses.
 *
 * Returns: true if the game should reverse winners.
 */
export function checkComebackReversal(args: {
  currentWinner: "blue" | "red";
  blueLateScore: number;
  redLateScore: number;
  blueMacroAvg: number;
  redMacroAvg: number;
  scoreDiff: number;
  seriesId: string;
  gameNumber: number;
}): boolean {
  // Condition C: game must be close
  if (Math.abs(args.scoreDiff) >= 2) return false;

  const loser = args.currentWinner === "blue" ? "red" : "blue";
  const loserLate = loser === "blue" ? args.blueLateScore : args.redLateScore;
  const winnerLate = args.currentWinner === "blue" ? args.blueLateScore : args.redLateScore;
  const winnerMacro = args.currentWinner === "blue" ? args.blueMacroAvg : args.redMacroAvg;

  // Condition A: loser has better late scaling (by at least 1)
  if (loserLate - winnerLate < 1.0) return false;

  // Condition B: winner has weak macro (below 6.2)
  if (winnerMacro >= 6.2) return false;

  // All conditions met — roll for reversal
  const roll = seededNoise(
    `${args.seriesId}:g${args.gameNumber}:comeback`,
    1
  ) * 0.5 + 0.5; // 0-1

  // 8-10% base chance, scales with how much better loser's late is
  const lateSuperiorityBonus = (loserLate - winnerLate - 1) * 0.015; // up to +0.03
  const macroWeaknessBonus = (6.2 - winnerMacro) * 0.01; // up to +0.02
  const finalChance = 0.08 + lateSuperiorityBonus + macroWeaknessBonus;

  return roll < clamp(finalChance, 0.08, 0.12);
}