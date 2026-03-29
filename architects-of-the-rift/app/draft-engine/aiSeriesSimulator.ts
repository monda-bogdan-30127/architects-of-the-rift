import type { ActiveDraftSeries, DraftSave, SeriesResult } from "./draftTypes";
import {
  advanceSeries,
  commitActionToGame,
  completeCurrentGame,
  getAiChoice,
  getCurrentGame,
  getCurrentStep,
  resolveSeriesResult,
  seriesIsFinished,
} from "./draftEngine";
import { beginPlayerHistoryBatch, flushPlayerHistoryBatch } from "./playerHistoryStorage";
import { beginPlayerSeasonBatch, flushPlayerSeasonBatch } from "./playerSeasonStorage";

export function simulateAiVsAiSeries(
  series: ActiveDraftSeries,
  save: DraftSave | null
): {
  series: ActiveDraftSeries;
  result: SeriesResult | null;
} {
  let workingSeries: ActiveDraftSeries = {
    ...series,
    games: series.games.map((game) => ({ ...game })),
  };

  beginPlayerSeasonBatch();
  beginPlayerHistoryBatch();

  try {
    while (!seriesIsFinished(workingSeries)) {
      let currentGame = getCurrentGame(workingSeries);
      if (!currentGame) break;

      while (true) {
        const step = getCurrentStep(currentGame);
        if (!step) break;

        const aiChoice = getAiChoice(workingSeries, currentGame, step, save);
        if (!aiChoice) break;

        currentGame = commitActionToGame(
          currentGame,
          aiChoice.championId,
          step.side,
          step.action
        );
      }

      workingSeries = {
        ...workingSeries,
        games: workingSeries.games.map((game) =>
          game.number === currentGame.number ? currentGame : game
        ),
      };

      workingSeries = completeCurrentGame(workingSeries, save);

      if (seriesIsFinished(workingSeries)) break;
      workingSeries = advanceSeries(workingSeries);
    }
  } finally {
    flushPlayerHistoryBatch();
    flushPlayerSeasonBatch();
  }

  const result = resolveSeriesResult(workingSeries);
  return {
    series: workingSeries,
    result: result ? { ...result, resolution: "simulated" } : null,
  };
}
