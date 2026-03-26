"use client";

import { useEffect, useMemo, useState } from "react";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftSave, Side } from "@/app/draft-engine/draftTypes";
import { migrateAllRiftStorage } from "@/app/draft-engine/storageMigration";
import {
  ACTIVE_DRAFT_SERIES_KEY,
  SAVE_KEY,
  SERIES_STATE_KEY,
  advanceSeries,
  commitActionToGame,
  completeCurrentGame,
  countSeriesWins,
  createInitialSeries,
  getAiChoice,
  getCurrentGame,
  getCurrentGameUnavailableChampionIds,
  getCurrentStep,
  getLockedChampionIdsForSide,
  isGameFullyDrafted,
  readJson,
  resolveFinishedDraftAssignments,
  resolveSeriesResult,
  seriesIsFinished,
  swapAssignedRoles,
  writeJson,
  getRequiredWins,
} from "@/app/draft-engine/draftEngine";

export function useDraftEngine(seriesId: string) {
  const [series, setSeries] = useState<ActiveDraftSeries | null>(null);
  const [draftSave, setDraftSave] = useState<DraftSave | null>(null);

  useEffect(() => {
    if (!seriesId) return;

    migrateAllRiftStorage();

    const save = readJson<DraftSave>(SAVE_KEY);
    setDraftSave(save);

    const savedActiveSeries = readJson<ActiveDraftSeries>(ACTIVE_DRAFT_SERIES_KEY);
    if (savedActiveSeries && savedActiveSeries.seriesId === seriesId) {
      setSeries(savedActiveSeries);
      return;
    }

    const controlledTeamSlug = save?.controlledTeamSlug ?? "";
    setSeries(createInitialSeries(seriesId, controlledTeamSlug));
  }, [seriesId]);

  useEffect(() => {
    if (!series) return;
    writeJson(ACTIVE_DRAFT_SERIES_KEY, series);
  }, [series]);

  const currentGame = useMemo(() => getCurrentGame(series), [series]);
  const currentStep = useMemo(() => getCurrentStep(currentGame), [currentGame]);
  const userSide = series?.userSide ?? "blue";
  const aiSide: Side = userSide === "blue" ? "red" : "blue";
  const blueTeam = useMemo(
    () => (series ? teams.find((team) => team.slug === series.blueTeamSlug) ?? null : null),
    [series]
  );
  const redTeam = useMemo(
    () => (series ? teams.find((team) => team.slug === series.redTeamSlug) ?? null : null),
    [series]
  );

  const unavailableChampionIds = useMemo(() => {
    if (!series || !currentGame) return new Set<string>();
    return getCurrentGameUnavailableChampionIds(series, currentGame);
  }, [series, currentGame]);

  const blueLockedChampionIds = useMemo(
    () => (series ? getLockedChampionIdsForSide(series, "blue") : []),
    [series]
  );
  const redLockedChampionIds = useMemo(
    () => (series ? getLockedChampionIdsForSide(series, "red") : []),
    [series]
  );

  const { blueWins, redWins } = useMemo(
    () => (series ? countSeriesWins(series) : { blueWins: 0, redWins: 0 }),
    [series]
  );

  const isUserTurn =
    currentStep != null && currentStep.side === userSide && !currentGame?.completed;
  const allPicksCompleted =
    currentGame != null && currentGame.picksBlue.length === 5 && currentGame.picksRed.length === 5;
  const canSwapRoles =
    !!series && !!currentGame && allPicksCompleted && !currentStep && !currentGame.completed;
  const readyDisabled = !series || !currentGame || !isGameFullyDrafted(currentGame);

  function patchCurrentGame(transform: (game: NonNullable<typeof currentGame>) => NonNullable<typeof currentGame>) {
    setSeries((prev) => {
      if (!prev) return prev;
      const game = getCurrentGame(prev);
      if (!game) return prev;

      return {
        ...prev,
        games: prev.games.map((entry) => (entry.number === game.number ? transform(game) : entry)),
      };
    });
  }

  function commitAction(championId: string, side: Side, action: "ban" | "pick") {
    setSeries((prev) => {
      if (!prev) return prev;
      const game = getCurrentGame(prev);
      if (!game) return prev;

      const nextGame = commitActionToGame(game, championId, side, action);
      return {
        ...prev,
        games: prev.games.map((entry) => (entry.number === game.number ? nextGame : entry)),
      };
    });
  }

  function swapRoles(side: Side, sourceRole: Role, targetRole: Role) {
    patchCurrentGame((game) => swapAssignedRoles(game, side, sourceRole, targetRole));
  }

  function finishCurrentGame(): "series-finished" | "next-game" | "idle" {
    if (!series || !currentGame) return "idle";

    const completedSeries = completeCurrentGame(series, draftSave);
    const nextWins = countSeriesWins(completedSeries);
    const hitRequiredWins =
      nextWins.blueWins >= getRequiredWins(completedSeries.bo) ||
      nextWins.redWins >= getRequiredWins(completedSeries.bo);

    if (hitRequiredWins || seriesIsFinished(completedSeries)) {
      const existingSeriesState = readJson<Record<string, import("@/app/draft-engine/draftTypes").SeriesResult>>(SERIES_STATE_KEY) ?? {};
      const resolved = resolveSeriesResult(completedSeries);

      if (resolved) {
        writeJson(SERIES_STATE_KEY, {
          ...existingSeriesState,
          [completedSeries.seriesId]: resolved,
        });
        window.dispatchEvent(new Event("rift-series-state-updated"));
      }

      window.localStorage.removeItem(ACTIVE_DRAFT_SERIES_KEY);
      setSeries(completedSeries);
      return "series-finished";
    }

    setSeries(advanceSeries(completedSeries));
    return "next-game";
  }

  useEffect(() => {
    if (!series || !currentGame || !currentStep) return;
    if (currentStep.side !== aiSide) return;

    const timeout = window.setTimeout(() => {
      const choice = getAiChoice(series, currentGame, currentStep, draftSave);
      if (!choice) return;

      setSeries((prev) => {
        if (!prev) return prev;
        const game = getCurrentGame(prev);
        if (!game) return prev;

        let nextGame = commitActionToGame(game, choice.championId, currentStep.side, currentStep.action);
        const nextStep = getCurrentStep(nextGame);

        if (!nextStep && nextGame.picksBlue.length === 5 && nextGame.picksRed.length === 5) {
          nextGame = resolveFinishedDraftAssignments(nextGame, prev, draftSave);
        }

        return {
          ...prev,
          games: prev.games.map((entry) => (entry.number === game.number ? nextGame : entry)),
        };
      });
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [series, currentGame, currentStep, aiSide, draftSave]);

  return {
    draftSave,
    series,
    setSeries,
    currentGame,
    currentStep,
    userSide,
    aiSide,
    blueTeam,
    redTeam,
    unavailableChampionIds,
    blueLockedChampionIds,
    redLockedChampionIds,
    blueWins,
    redWins,
    isUserTurn,
    allPicksCompleted,
    canSwapRoles,
    readyDisabled,
    commitAction,
    swapRoles,
    finishCurrentGame,
  };
}
