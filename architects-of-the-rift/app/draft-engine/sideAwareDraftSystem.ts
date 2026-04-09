// ═══════════════════════════════════════════════════════════════════════════
// Side-Aware Drafting (Upgrade 12 — Block A)
//
// In pro play, draft side changes pick strategy:
//
//   BLUE SIDE:
//     - First pick in draft → must use it for a power/contested champion
//     - Loses information advantage (picks first, enemy counters)
//     - Wants flex picks in later rounds to hide role assignment
//     - Prefers meta-neutral champions that don't get hard countered
//
//   RED SIDE:
//     - Last pick in draft (R5) → absolute counter pick advantage
//     - Gets to react to blue's composition
//     - Wants to hold flex options to force blue reveals
//     - Can afford late-round specialization (anti-meta counter picks)
//
// NEW FILE: place in app/draft-engine/sideAwareDraftSystem.ts
// ═══════════════════════════════════════════════════════════════════════════

import type { Champion, Role } from "@/app/types/champion";
import type { DraftGameState, Side } from "./draftTypes";
import { getMetaPriorityScore } from "./draftEvaluator";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * Returns a bonus/penalty based on the champion's fit for the current draft side
 * and pick position.
 *
 * Blue side early picks → favor contested power picks (high prioScore)
 * Blue side later picks → favor flex champions (ambiguous role)
 * Red side early picks → favor meta-safe, flex
 * Red side late picks (R5) → favor counter picks and specialized answers
 */
export function getSideAwareBonus(args: {
  candidate: Champion;
  side: Side;
  game: DraftGameState;
  projectedRole: Role | null;
  counterValue: number; // pre-computed counter score from scorePickCandidate
}): number {
  const { candidate, side, game, counterValue } = args;
  const ownPicks = side === "blue" ? game.picksBlue : game.picksRed;
  const enemyPicks = side === "blue" ? game.picksRed : game.picksBlue;
  const ownPickNumber = ownPicks.length + 1; // 1-indexed

  const metaPriority = getMetaPriorityScore(candidate);
  const isFlex = candidate.roles.length >= 2;

  let bonus = 0;

  if (side === "blue") {
    // ─── BLUE SIDE ─────────────────────────────────────────────────────
    // Blue pick 1 (B1): hardest decision — must be contested power pick
    if (ownPickNumber === 1) {
      // Want high metaPriority (contested), moderate flex
      if (metaPriority >= 7.5) bonus += 1.5;
      if (metaPriority >= 8.5) bonus += 1.0; // Extra for top-tier picks
      // Flex value helps hide role info
      if (isFlex) bonus += 0.8;
      // Penalty for easily-countered champions at B1
      if (counterValue <= 4) bonus -= 0.6;
    }

    // Blue pick 2-3 (B2/B3): want flex picks to maintain ambiguity
    if (ownPickNumber === 2 || ownPickNumber === 3) {
      if (isFlex) bonus += 1.0;
      // Still prefer meta champions
      if (metaPriority >= 6.5) bonus += 0.5;
    }

    // Blue pick 4-5 (B4/B5): hardest — they're last to commit solo lanes
    // Want safe, blind-pickable champions
    if (ownPickNumber >= 4) {
      const safeBlind = candidate.stats?.blindPickRate ?? 45;
      if (safeBlind >= 55) bonus += 0.8;
      if (safeBlind < 35) bonus -= 1.0; // Dangerous to blind
    }
  } else {
    // ─── RED SIDE ──────────────────────────────────────────────────────
    // Red pick 1 (R1): responds to B1 — grab counter or flex
    if (ownPickNumber === 1) {
      // If enemy picked already, prefer counters
      if (enemyPicks.length >= 1 && counterValue >= 6) bonus += 1.2;
      // Flex is very valuable on red side
      if (isFlex) bonus += 1.0;
      if (metaPriority >= 7) bonus += 0.8;
    }

    // Red pick 2-3 (R2/R3): mid-draft flex
    if (ownPickNumber === 2 || ownPickNumber === 3) {
      if (isFlex) bonus += 0.9;
      if (counterValue >= 6) bonus += 0.5;
    }

    // Red pick 4 (R4): set up the R5 trap
    if (ownPickNumber === 4) {
      // Save solo lanes for R5
      if (candidate.roles.length === 1) {
        const isSoloRole = candidate.roles[0] === "top" || candidate.roles[0] === "mid";
        if (isSoloRole) bonus -= 0.8; // Don't lock solo lane yet
      }
    }

    // Red pick 5 (R5): ABSOLUTE LAST PICK — counter pick gold mine
    if (ownPickNumber === 5) {
      // Pure counter picking — counter value is king here
      bonus += counterValue * 0.35; // Can add up to +3.5 for perfect counter
      // Specialization rewarded (don't waste R5 on flex)
      if (!isFlex) bonus += 0.5;
    }
  }

  return clamp(bonus, -3, 5);
}

/**
 * Info-ambiguity bonus: reward picks that keep enemy guessing about role.
 * Flex picks in early rounds = enemy has to prepare for multiple counters.
 */
export function getFlexAmbiguityBonus(args: {
  candidate: Champion;
  side: Side;
  game: DraftGameState;
}): number {
  const { candidate, side, game } = args;
  const ownPicks = side === "blue" ? game.picksBlue : game.picksRed;
  const ownPickNumber = ownPicks.length + 1;

  // Only applies to early picks (first 3)
  if (ownPickNumber > 3) return 0;
  if (candidate.roles.length < 2) return 0;

  // Check if this champion is genuinely contestable for multiple roles
  // (not just listed as flex but actually played in both)
  const rolePickRate = candidate.stats?.presence ?? 0;
  if (rolePickRate < 5) return 0; // Not enough sample size

  // Strong flex bonus early — maintains ambiguity
  let bonus = 0;
  if (ownPickNumber === 1) bonus += 1.4; // Biggest mind-game impact at B1/R1
  if (ownPickNumber === 2) bonus += 0.9;
  if (ownPickNumber === 3) bonus += 0.5;

  // Extra bonus for 3-role flex (e.g. Gragas top/jg/mid)
  if (candidate.roles.length >= 3) bonus *= 1.25;

  return clamp(bonus, 0, 2);
}
