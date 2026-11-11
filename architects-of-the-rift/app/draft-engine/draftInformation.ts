import type { ActiveDraftSeries, DraftGameState } from "./draftTypes";

/** Câți dintre `answerIds` sunt încă disponibili (fearless + ban-uri + pick-uri din jocul curent). */
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
