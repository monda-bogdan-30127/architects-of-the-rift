// ═══════════════════════════════════════════════════════════════════════════
// Draft Plan System (Upgrade 12 — Block A)
//
// Before the first pick, AI chooses a comp plan based on:
//   1. Current meta (which OP champions exist in each role)
//   2. Own team's signature champions (plan must fit player pool)
//   3. User weakness history (champions user loses on get prioritized)
//   4. User ban/pick patterns (plan AI can execute around user's bans)
//
// The plan then gives bonus/penalty to picks that align/deviate from it.
//
// Plans available:
//   - dive         (engage + follow-up + burst)
//   - poke         (range + disengage + waveclear)
//   - pick         (CC chain + burst + roam)
//   - front-to-back (tank frontline + ADC peel + sustained)
//   - teamfight    (AoE + engage + late game)
//   - protect-carry (hyperscale carry + full peel shell)
//
// NEW FILE: place in app/draft-engine/draftPlanSystem.ts
// ═══════════════════════════════════════════════════════════════════════════

import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftGameState, DraftSave, Side } from "./draftTypes";
import { ROLE_ORDER } from "./draftTypes";
import { getChampionRoleProfile } from "./championProfileSystem";
import { getMetaPriorityScore, getComfortScore } from "./draftEvaluator";
import { getPlayerChampionHistoryMetrics } from "./playerHistoryEvaluator";

const playersById = new Map(players.map((p) => [p.id, p]));

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

// ─── Plan types ──────────────────────────────────────────────────────────────

export type DraftPlanType =
  | "dive"
  | "poke"
  | "pick"
  | "front-to-back"
  | "teamfight"
  | "protect-carry";

export type DraftPlan = {
  type: DraftPlanType;
  confidence: number; // 0-1: how strongly to enforce this plan
  reasoning: string[];
};

// Which tags a plan wants from its champions
const PLAN_DESIRED_TAGS: Record<DraftPlanType, string[]> = {
  "dive":            ["dive", "engage", "follow-up", "burst", "backlineAccess"],
  "poke":            ["poke", "zone-control", "disengage", "waveclear", "ranged"],
  "pick":            ["pick", "burst", "reliableCC", "roamPressure"],
  "front-to-back":   ["frontline", "peel", "dps", "sustainedDamage", "warden"],
  "teamfight":       ["engage", "follow-up", "frontline", "peel", "dps"],
  "protect-carry":   ["peel", "warden", "enchanter", "frontline", "dps", "anti-dive"],
};

// Which tags a plan AVOIDS (negative match)
const PLAN_AVOID_TAGS: Record<DraftPlanType, string[]> = {
  "dive":            ["poke", "warden"],
  "poke":            ["dive", "melee"],
  "pick":            ["warden"],
  "front-to-back":   ["dive", "burst"],
  "teamfight":       [],
  "protect-carry":   ["dive", "poke"],
};

// ─── Plan scoring ────────────────────────────────────────────────────────────

/**
 * Score how well a single champion fits a plan.
 * Positive = good fit, negative = bad fit.
 */
function scoreChampionForPlan(
  champion: Champion,
  role: Role | null,
  plan: DraftPlanType
): number {
  const profile = role ? getChampionRoleProfile(champion, role) : getChampionRoleProfile(champion);
  if (!profile) return 0;

  const tags = new Set(profile.tags ?? []);
  const desired = PLAN_DESIRED_TAGS[plan];
  const avoided = PLAN_AVOID_TAGS[plan];

  let score = 0;
  for (const tag of desired) {
    if (tags.has(tag)) score += 1;
  }
  for (const tag of avoided) {
    if (tags.has(tag)) score -= 1.2;
  }

  return score;
}

/**
 * Check how many OP (high meta priority) champions each plan has access to.
 * Plans without access to OP champions get lower confidence.
 */
function getMetaCoverageForPlan(plan: DraftPlanType, availableChampions: Champion[]): number {
  let opCount = 0;
  for (const champ of availableChampions) {
    const meta = getMetaPriorityScore(champ);
    if (meta < 6) continue;
    const fit = scoreChampionForPlan(champ, null, plan);
    if (fit >= 2) opCount += 1;
  }
  return clamp(opCount / 4, 0, 1); // 4+ OP champions = full coverage
}

/**
 * Check how well the team's roster fits each plan based on player signatures.
 * A team whose ADC is Zeri main fits dive/poke better than front-to-back.
 */
function getRosterFitForPlan(
  plan: DraftPlanType,
  roster: Partial<Record<Role, string>>
): number {
  let fitSum = 0;
  let count = 0;

  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    if (!playerId) continue;
    const player = playersById.get(playerId);
    if (!player) continue;

    // Check signature champions (best + comfort)
    const signatureIds = [
      ...(player.bestChampions ?? []),
      ...(player.comfortChampions ?? []),
    ];

    let bestFit = 0;
    for (const champId of signatureIds) {
      const champ = champions.find((c) => c.id === champId);
      if (!champ) continue;
      const fit = scoreChampionForPlan(champ, role, plan);
      if (fit > bestFit) bestFit = fit;
    }

    fitSum += bestFit;
    count += 1;
  }

  return count > 0 ? clamp(fitSum / (count * 3), 0, 1) : 0.5;
}

/**
 * Check past series games — what plans worked/failed previously.
 * If user beat us with poke comp in game 1, game 2 wants anti-poke (front-to-back or dive).
 */
function getSeriesAdaptationBonus(plan: DraftPlanType, series: ActiveDraftSeries): number {
  if (series.currentGameNumber <= 1) return 0;

  let bonus = 0;
  for (const prevGame of series.games) {
    if (prevGame.number >= series.currentGameNumber) continue;
    if (!prevGame.completed || !prevGame.winnerSide) continue;

    // If we lost this game, want a counter-plan for game 2+
    const ourSide = series.userSide === "blue" ? "red" : "blue"; // AI side
    const weWon = prevGame.winnerSide === ourSide;

    if (!weWon) {
      // We lost — what plan did the enemy have? Pick a counter.
      const enemyPicks = prevGame.winnerSide === "blue" ? prevGame.picksBlue : prevGame.picksRed;
      const enemyPlanGuess = guessPlanFromPicks(enemyPicks);

      // Counter mapping
      const counters: Record<DraftPlanType, DraftPlanType[]> = {
        "dive":          ["front-to-back", "poke"],
        "poke":          ["dive", "pick"],
        "pick":          ["front-to-back", "teamfight"],
        "front-to-back": ["poke", "pick"],
        "teamfight":     ["pick", "poke"],
        "protect-carry": ["dive", "pick"],
      };

      if (enemyPlanGuess && counters[enemyPlanGuess]?.includes(plan)) {
        bonus += 0.35; // Strong counter bonus
      }
    } else {
      // We won — slight bias towards repeating what worked
      const ourPicks = ourSide === "blue" ? prevGame.picksBlue : prevGame.picksRed;
      const ourPlanGuess = guessPlanFromPicks(ourPicks);
      if (ourPlanGuess === plan) bonus += 0.15;
    }
  }

  return clamp(bonus, -0.3, 0.5);
}

/**
 * Given a finished team comp, guess what plan it was.
 */
function guessPlanFromPicks(picks: string[]): DraftPlanType | null {
  if (picks.length < 3) return null;

  const plans: DraftPlanType[] = ["dive", "poke", "pick", "front-to-back", "teamfight", "protect-carry"];
  let bestPlan: DraftPlanType | null = null;
  let bestScore = -Infinity;

  for (const plan of plans) {
    let total = 0;
    for (const id of picks) {
      const champ = champions.find((c) => c.id === id);
      if (champ) total += scoreChampionForPlan(champ, null, plan);
    }
    if (total > bestScore) {
      bestScore = total;
      bestPlan = plan;
    }
  }

  return bestScore >= 4 ? bestPlan : null;
}

/**
 * Check user bad matchups — what champions did the user lose with historically?
 * If user has Azir at 30% WR, AI should plan around picking/denying Azir counters.
 * Returns a score boost for plans that can exploit user weaknesses.
 */
function getUserWeaknessBonus(
  plan: DraftPlanType,
  userRoster: Partial<Record<Role, string>>
): number {
  let bonus = 0;

  for (const role of ROLE_ORDER) {
    const userPlayerId = userRoster[role];
    if (!userPlayerId) continue;

    const userPlayer = playersById.get(userPlayerId);
    if (!userPlayer) continue;

    // Find user's worst champions by history
    const worstChamps: Array<{ championId: string; winRate: number }> = [];
    for (const champ of champions) {
      const metrics = getPlayerChampionHistoryMetrics(userPlayerId, champ.id);
      if (metrics.games < 3) continue;
      if (metrics.smoothedWinRate < 0.45) {
        worstChamps.push({ championId: champ.id, winRate: metrics.smoothedWinRate });
      }
    }

    // Check if this plan has good counters to user's bad champions
    for (const weak of worstChamps) {
      const weakChamp = champions.find((c) => c.id === weak.championId);
      if (!weakChamp) continue;
      // If weak champion is counter-able by this plan's tags, bonus
      const weakProfile = getChampionRoleProfile(weakChamp, role);
      const weakTags = new Set(weakProfile?.tags ?? []);
      const planDesired = PLAN_DESIRED_TAGS[plan];

      // Example: user bad at Zeri (ranged/self-sufficient) → dive plan exploits
      if (weakTags.has("ranged") && planDesired.includes("dive")) bonus += 0.1;
      if (weakTags.has("scaling") && planDesired.includes("burst")) bonus += 0.1;
      if (weakTags.has("poke") && planDesired.includes("engage")) bonus += 0.08;
    }
  }

  return clamp(bonus, 0, 0.5);
}

// ─── Main: choose the plan ──────────────────────────────────────────────────

export function chooseDraftPlan(args: {
  side: Side;
  game: DraftGameState;
  series: ActiveDraftSeries;
  aiRoster: Partial<Record<Role, string>>;
  userRoster: Partial<Record<Role, string>>;
  save: DraftSave | null;
}): DraftPlan | null {
  // Only pick plan during early draft (pick phase 1)
  // If picks already made, use existing plan from game state
  const aiPicks = args.side === "blue" ? args.game.picksBlue : args.game.picksRed;
  if (aiPicks.length >= 3) return null; // Plan should be decided by pick 3

  // Available champions (not banned, not picked)
  const unavailable = new Set([
    ...args.game.bansBlue,
    ...args.game.bansRed,
    ...args.game.picksBlue,
    ...args.game.picksRed,
  ]);
  const availableChampions = champions.filter((c) => !unavailable.has(c.id));

  const plans: DraftPlanType[] = ["dive", "poke", "pick", "front-to-back", "teamfight", "protect-carry"];
  const scored: Array<{ plan: DraftPlanType; score: number; breakdown: Record<string, number> }> = [];

  for (const plan of plans) {
    const metaCoverage = getMetaCoverageForPlan(plan, availableChampions);
    const rosterFit = getRosterFitForPlan(plan, args.aiRoster);
    const seriesAdapt = getSeriesAdaptationBonus(plan, args.series);
    const userWeakness = getUserWeaknessBonus(plan, args.userRoster);

    // Weighted score
    const score =
      metaCoverage * 0.35 +    // Access to OP champions is biggest factor
      rosterFit * 0.30 +       // Team must be able to execute the plan
      seriesAdapt * 0.20 +     // Adaptation between games matters
      userWeakness * 0.15;     // Exploit user weaknesses where possible

    scored.push({
      plan,
      score,
      breakdown: { metaCoverage, rosterFit, seriesAdapt, userWeakness },
    });
  }

  scored.sort((a, b) => b.score - a.score);

  // Pick from top 2 with some randomness (so AI isn't 100% deterministic)
  const seed = `${args.series.seriesId}:${args.series.currentGameNumber}:${args.side}:plan-select`;
  const roll = hashString(seed) % 100;
  const chosen = roll < 70 ? scored[0] : scored[1] ?? scored[0];

  if (!chosen || chosen.score < 0.25) return null; // No good plan

  const reasoning: string[] = [];
  if (chosen.breakdown.metaCoverage >= 0.6) reasoning.push("meta has strong OP pool");
  if (chosen.breakdown.rosterFit >= 0.6) reasoning.push("team signatures fit");
  if (chosen.breakdown.seriesAdapt >= 0.25) reasoning.push("counter-adaptation from previous game");
  if (chosen.breakdown.userWeakness >= 0.2) reasoning.push("exploits user champion weaknesses");

  return {
    type: chosen.plan,
    confidence: clamp(chosen.score, 0, 1),
    reasoning,
  };
}

// ─── Score alignment with current plan ──────────────────────────────────────

/**
 * Called from scorePickCandidate — returns bonus/penalty based on how well
 * the candidate fits the chosen plan. Only active during the first 4 picks
 * (the plan "locks in" after comp is mostly formed).
 */
export function getPlanAlignmentBonus(
  candidate: Champion,
  role: Role | null,
  plan: DraftPlan | null,
  pickNumber: number
): number {
  if (!plan) return 0;
  if (pickNumber >= 5) return 0; // Plan enforcement fades late in draft

  const fit = scoreChampionForPlan(candidate, role, plan.type);

  // Fit range typically -3 to +5
  // Convert to pick score modifier scaled by plan confidence
  // High confidence + good fit = +3 bonus
  // High confidence + bad fit = -4 penalty
  const alignment = fit * 0.7 * plan.confidence;

  return clamp(alignment, -4, 3);
}
