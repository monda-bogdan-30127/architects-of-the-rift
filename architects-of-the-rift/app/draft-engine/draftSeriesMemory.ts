import type { ActiveDraftSeries, Side } from "./draftTypes";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Pick-urile echipei care a câștigat jocul. */
function getWinnerPicks(draftGame: ActiveDraftSeries["games"][number]) {
  return draftGame.winnerSide === "blue" ? draftGame.picksBlue : draftGame.picksRed;
}

export function getSeriesAwareBanBonus(candidateId: string, side: Side, series: ActiveDraftSeries) {
  const enemyTeamSlug = side === "blue" ? series.redTeamSlug : series.blueTeamSlug;
  let bonus = 0;
  for (const draftGame of series.games) {
    if (!draftGame.completed || !draftGame.winnerSide || !draftGame.simulation) continue;
    const winnerTeamSlug = draftGame.winnerSide === "blue"
      ? draftGame.simulation.blueTeamSlug
      : draftGame.simulation.redTeamSlug;
    if (winnerTeamSlug !== enemyTeamSlug) continue;
    // DRAFT_THINKING §7.5: doar pick-urile echipei câștigătoare (înainte: și ale celei care a pierdut).
    if (getWinnerPicks(draftGame).includes(candidateId)) {
      bonus += 1.25;
    }
  }
  return clamp(bonus, 0, 4.5);
}

export function getSeriesComfortRepeatThreat(candidateId: string, side: Side, series: ActiveDraftSeries) {
  const enemyTeamSlug = side === "blue" ? series.redTeamSlug : series.blueTeamSlug;
  let threat = 0;
  for (const draftGame of series.games) {
    if (!draftGame.completed || !draftGame.winnerSide || !draftGame.simulation) continue;
    const enemyWon = (draftGame.winnerSide === "blue" ? draftGame.simulation.blueTeamSlug : draftGame.simulation.redTeamSlug) === enemyTeamSlug;
    if (!enemyWon) continue;
    if (getWinnerPicks(draftGame).includes(candidateId)) threat += 0.8;
  }
  return clamp(threat, 0, 3.2);
}
