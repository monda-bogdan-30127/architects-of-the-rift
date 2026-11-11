// FEEDBACK_FIXES §6.2 — „De ce am câștigat / pierdut”: factorii rezultatului în cuvinte (engleză, apar în joc).

import type { OutcomeFactor, OutcomeFactorKey } from "./matchSimulationTypes";
import type { Side } from "./draftTypes";

export const OUTCOME_FACTOR_LABELS: Record<OutcomeFactorKey, string> = {
  draft: "Draft impact",
  players: "Player power",
  mastery: "Mastery & roles",
  lane: "Lane phase",
  objectives: "Objectives",
  execution: "Execution",
  clutch: "Clutch",
  late: "Late game",
  momentum: "Momentum",
  variance: "Variance",
  early: "Early game",
  mid: "Mid game",
  lateFights: "Late fights",
};

/** RESULTS_DIALOG_TABS §3.2 — tooltip-uri (o propoziție) pentru factorii care se pot confunda. */
export const OUTCOME_FACTOR_TOOLTIPS: Partial<Record<OutcomeFactorKey, string>> = {
  draft: "How much the draft moved the final result",
};

/** §3.3 — bara e plină de la atâta contribuție (scală fixă, ca un +0.05 să arate mic). */
export const OUTCOME_BAR_FULL = 0.5;
/** §3.3 — un factor „decide” meciul doar dacă e cel puțin atâta din diferența totală și cel puțin DECIDING_MIN. */
const DECIDING_SHARE = 0.35;
const DECIDING_MIN = 0.15;

/** Sub atât, un factor nu „a contat” (contribuția la diferența de total, scala 0..10). */
const MIN_EDGE = 0.01;
/** Un avantaj al userului e menționat în propoziția sumar doar de la atât. */
const MIN_SUMMARY_EDGE = 0.05;
/** Meci strâns: `closeness` de la atât în sus. */
const CLOSE_GAME = 0.7;

export type OutcomeFactorLine = { key: OutcomeFactorKey; label: string; value: number };

export type OutcomeExplanation = {
  /** Primii 3 factori în favoarea câștigătorului. */
  winnerFactors: OutcomeFactorLine[];
  /** Echipa userului a pierdut: factorii în favoarea ei (null dacă userul a câștigat / nu e în meci). */
  userFactors: OutcomeFactorLine[] | null;
  /** „Your draft was better (+0.3), but their player power (+0.6) and late game (+0.4) decided the game.” */
  summary: string | null;
  /** „Close game, decided by variance.” (nu și cu upset: upset are prioritate). */
  varianceNote: string | null;
  /** §3.3 — niciun factor nu a decis singur meciul. */
  closeGame: boolean;
  /** Câștigătorul avea totalul mai mic (comeback / variance). */
  upset: boolean;
};

/** „+0.6”, „+0.04” (două zecimale sub 0.1, ca să nu iasă „+0.0”). */
export function formatEdge(value: number): string {
  const digits = Math.abs(value) >= 0.1 ? 1 : 2;
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}`;
}

function linesFor(factors: OutcomeFactor[], side: Side): OutcomeFactorLine[] {
  return factors
    .map((factor) => ({ key: factor.key, label: OUTCOME_FACTOR_LABELS[factor.key], value: side === "blue" ? factor.edgeBlue : -factor.edgeBlue }))
    .filter((line) => line.value >= MIN_EDGE)
    .sort((a, b) => b.value - a.value);
}

const lower = (label: string) => label.charAt(0).toLowerCase() + label.slice(1);
const mention = (line: OutcomeFactorLine) => `${lower(line.label)} (${formatEdge(line.value)})`;

export function explainOutcome(args: {
  factors: OutcomeFactor[] | undefined;
  winnerSide: Side;
  /** Side-ul echipei userului în acest joc (null = nu e în meci). */
  userSide: Side | null;
  closeness: number;
}): OutcomeExplanation | null {
  const factors = args.factors ?? [];
  if (!factors.length) return null;
  const loserSide: Side = args.winnerSide === "blue" ? "red" : "blue";
  const winnerAll = linesFor(factors, args.winnerSide);
  const winnerFactors = winnerAll.slice(0, 3);
  const totalEdge = factors.reduce((sum, factor) => sum + factor.edgeBlue, 0) * (args.winnerSide === "blue" ? 1 : -1);

  const userLost = args.userSide !== null && args.userSide === loserSide;
  const userFactors = userLost ? linesFor(factors, loserSide).slice(0, 3) : null;

  // §3.3: un factor „decide” doar dacă e ≥ 35% din diferența totală și ≥ 0.15.
  const upset = totalEdge < 0;
  const deciders = winnerFactors
    .filter((line) => line.value >= DECIDING_MIN && line.value >= DECIDING_SHARE * Math.abs(totalEdge))
    .slice(0, 2);
  const closeGame = deciders.length === 0;

  let summary: string | null = null;
  if (closeGame) {
    // Upset are prioritate peste „close game” (se afișează doar unul).
    if (!upset && winnerFactors.length) {
      summary = `Close game: no single factor decided it. Top factors: ${winnerFactors.map((line) => `${line.label} ${formatEdge(line.value)}`).join(", ")}.`;
    }
  } else if (userLost) {
    // „their late fights (+0.4) and variance (+0.2)”: variance nu e „a lor”.
    const decided = deciders.map((line) => (line.key === "variance" ? mention(line) : `their ${mention(line)}`)).join(" and ");
    const best = userFactors?.[0];
    summary =
      best && best.value >= MIN_SUMMARY_EDGE
        ? `You had the better ${lower(best.label)} (${formatEdge(best.value)}), but ${decided} decided the game.`
        : `${decided.charAt(0).toUpperCase()}${decided.slice(1)} decided the game.`;
  }

  const varianceTop = deciders.some((line) => line.key === "variance");
  const varianceNote = !upset && varianceTop && args.closeness >= CLOSE_GAME ? "Close game, decided by variance." : null;

  return { winnerFactors, userFactors, summary, varianceNote, closeGame, upset };
}
