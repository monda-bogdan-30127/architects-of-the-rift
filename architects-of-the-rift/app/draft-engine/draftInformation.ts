import type { Champion, Role } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Information / draft hiding score
 */
export function getInformationScore(args: {
  candidate: Champion;
  allyChampionIds: string[];
  metaPriority: number;
}) {
  const { candidate, allyChampionIds, metaPriority } = args;

  const pickNumber = allyChampionIds.length + 1;
  const singleRole = candidate.roles.length === 1;
  const isSoloLane = candidate.roles.includes("top") || candidate.roles.includes("mid");
  const isSupport = candidate.roles.includes("support");

  let leakPenalty = 0;
  let preserveBonus = 0;
  let forcedResponseBonus = 0;

  if (pickNumber <= 3 && singleRole && isSoloLane) leakPenalty += 1.8;
  if (pickNumber <= 2 && candidate.roles.length >= 2) preserveBonus += 2.1;
  if (pickNumber <= 2 && isSupport) preserveBonus += 1.1;

  if (metaPriority >= 7.4) forcedResponseBonus += 1.5;

  if (["poppy", "jarvan-iv", "braum", "galio"].includes(candidate.id) && pickNumber <= 2) {
    forcedResponseBonus -= 1.0;
    leakPenalty += 0.8;
  }

  if (candidate.mustWith.length > 0 && pickNumber <= 2) leakPenalty += 0.8;

  return {
    leakPenalty: clamp(leakPenalty, 0, 6),
    preserveBonus: clamp(preserveBonus, 0, 4),
    forcedResponseBonus: clamp(forcedResponseBonus, 0, 4),
  };
}

export function countOpenEnemyAnswers(
  game: DraftGameState,
  series: ActiveDraftSeries,
  answerIds: string[]
) {
  const unavailable = new Set<string>();

  for (const draftGame of series.games) {
    if (draftGame.number >= game.number) continue;

    draftGame.picksBlue.forEach((id) => unavailable.add(id));
    draftGame.picksRed.forEach((id) => unavailable.add(id));
  }

  game.bansBlue.forEach((id) => unavailable.add(id));
  game.bansRed.forEach((id) => unavailable.add(id));
  game.picksBlue.forEach((id) => unavailable.add(id));
  game.picksRed.forEach((id) => unavailable.add(id));

  return answerIds.reduce(
    (sum, championId) => sum + (!unavailable.has(championId) ? 1 : 0),
    0
  );
}

export function getNeutralizableBlindPenalty(args: {
  candidate: Champion;
  side: Side;
  allyChampionIds: string[];
  enemyChampionIds: string[];
  game: DraftGameState;
  series: ActiveDraftSeries;
}) {
  const { candidate, allyChampionIds } = args;

  const pickNumber = allyChampionIds.length + 1;
  let penalty = 0;

  const answerIds: string[] = [];

  if (candidate.id === "jarvan-iv") {
    answerIds.push("ezreal", "xayah", "corki", "poppy", "braum");
  }

  if (candidate.id === "poppy") {
    answerIds.push("ezreal", "corki", "xayah", "jinx", "aphelios");
    if (pickNumber <= 2) penalty += 1.5;
  }

  if (candidate.id === "vi") {
    answerIds.push("xayah", "ezreal", "poppy", "braum");
  }

  if (answerIds.length > 0) {
    const openAnswers = countOpenEnemyAnswers(args.game, args.series, answerIds);
    penalty += openAnswers * 0.35;
  }

  if (candidate.roles.length === 1 && pickNumber <= 2) {
    penalty += 0.8;
  }

  return clamp(penalty, 0, 6);
}

export function getCounterpickPreservationBonus(args: {
  candidate: Champion;
  openRoles: Role[];
  allyChampionIds: string[];
}) {
  const { candidate, openRoles, allyChampionIds } = args;

  let bonus = 0;

  if (allyChampionIds.length <= 2 && candidate.roles.length >= 2) {
    bonus += 2.2;
  }

  if (openRoles.length > 1 && candidate.roles.length >= 2) {
    bonus += 1.6;
  }

  return clamp(bonus, 0, 4);
}
