import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type {
  ActiveDraftSeries,
  DraftAction,
  DraftAiConfig,
  DraftGameState,
  DraftSave,
  DraftSimulationResult,
  DraftStep,
  SeriesResult,
  Side,
} from "./draftTypes";
import {
  DEFAULT_AI_CONFIG,
  DRAFT_SEQUENCE,
  REQUIRED_BANS_PER_SIDE,
  REQUIRED_PICKS_PER_SIDE,
  ROLE_ORDER,
} from "./draftTypes";
import { chooseAiAction } from "./draftAI";
import { evaluateTeamDraft } from "./draftEvaluator";
import { mapPicksToRoleOrder, resolveRoleAssignments } from "./draftRoleResolver";
import { simulateFullMatch } from "./matchSimulator";
import { recordCompletedUserDraftGame } from "./userDraftMemory";

const playersById = new Map(players.map((player) => [player.id, player]));
const teamsBySlug = new Map(teams.map((team) => [team.slug, team]));

export const SAVE_KEY = "rift-draft-save";
export const SERIES_STATE_KEY = "rift-series-state";
export const ACTIVE_DRAFT_SERIES_KEY = "rift-active-series-draft";

export function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getRequiredWins(bo: 3 | 5) {
  return Math.ceil(bo / 2);
}

export function getTeamSlugsFromSeriesId(seriesId: string) {
  const parts = seriesId.split("-");
  if (parts.length < 2) {
    return { leftTeamSlug: "", rightTeamSlug: "" };
  }

  return {
    leftTeamSlug: parts[parts.length - 2] ?? "",
    rightTeamSlug: parts[parts.length - 1] ?? "",
  };
}

export function inferSeriesBo(seriesId: string): 3 | 5 {
  const normalized = seriesId.toLowerCase();
  if (normalized.includes("bo5") || normalized.includes("playoff")) return 5;
  return 3;
}

export function getGameTeamSlugsForGameNumber(seriesId: string, gameNumber: number) {
  const { leftTeamSlug, rightTeamSlug } = getTeamSlugsFromSeriesId(seriesId);
  const isOddGame = gameNumber % 2 === 1;

  return isOddGame
    ? { blueTeamSlug: leftTeamSlug, redTeamSlug: rightTeamSlug }
    : { blueTeamSlug: rightTeamSlug, redTeamSlug: leftTeamSlug };
}

function getWinnerTeamSlugForGame(seriesId: string, game: DraftGameState) {
  if (!game.winnerSide) return null;
  const gameTeams = getGameTeamSlugsForGameNumber(seriesId, game.number);
  return game.winnerSide === "blue" ? gameTeams.blueTeamSlug : gameTeams.redTeamSlug;
}

export function createEmptyGame(number: number): DraftGameState {
  return {
    number,
    phaseIndex: 0,
    completed: false,
    winnerSide: null,
    bansBlue: [],
    bansRed: [],
    picksBlue: [],
    picksRed: [],
    assignmentsBlue: {},
    assignmentsRed: {},
  };
}

export function createInitialSeries(
  seriesId: string,
  controlledTeamSlug: string
): ActiveDraftSeries {
  const { leftTeamSlug, rightTeamSlug } = getTeamSlugsFromSeriesId(seriesId);
  const userSide: Side = controlledTeamSlug === leftTeamSlug ? "blue" : "red";

  return {
    seriesId,
    bo: inferSeriesBo(seriesId),
    currentGameNumber: 1,
    blueTeamSlug: leftTeamSlug,
    redTeamSlug: rightTeamSlug,
    userSide,
    games: [createEmptyGame(1)],
  };
}

export function countSeriesWins(series: ActiveDraftSeries) {
  let blueWins = 0;
  let redWins = 0;

  for (const game of series.games) {
    if (!game.completed || !game.winnerSide) continue;

    const winnerTeamSlug = getWinnerTeamSlugForGame(series.seriesId, game);
    if (!winnerTeamSlug) continue;

    if (winnerTeamSlug === series.blueTeamSlug) blueWins += 1;
    if (winnerTeamSlug === series.redTeamSlug) redWins += 1;
  }

  return { blueWins, redWins };
}

export function seriesIsFinished(series: ActiveDraftSeries) {
  const { blueWins, redWins } = countSeriesWins(series);
  const requiredWins = getRequiredWins(series.bo);
  return blueWins >= requiredWins || redWins >= requiredWins;
}

export function resolveSeriesResult(series: ActiveDraftSeries): SeriesResult | null {
  const { leftTeamSlug, rightTeamSlug } = getTeamSlugsFromSeriesId(series.seriesId);
  let leftWins = 0;
  let rightWins = 0;

  for (const game of series.games) {
    if (!game.completed || !game.winnerSide) continue;

    const winnerTeamSlug = getWinnerTeamSlugForGame(series.seriesId, game);
    if (!winnerTeamSlug) continue;

    if (winnerTeamSlug === leftTeamSlug) leftWins += 1;
    if (winnerTeamSlug === rightTeamSlug) rightWins += 1;
  }

  if (leftWins === rightWins) return null;

  return {
    winnerTeamSlug: leftWins > rightWins ? leftTeamSlug : rightTeamSlug,
    leftWins,
    rightWins,
    completedAt: Date.now(),
    resolution: "played",
  };
}

export function getAllPreviouslyPlayedChampionIds(
  series: ActiveDraftSeries,
  untilGameNumberExclusive: number
) {
  const used = new Set<string>();

  for (const game of series.games) {
    if (game.number >= untilGameNumberExclusive) continue;
    for (const championId of game.picksBlue) used.add(championId);
    for (const championId of game.picksRed) used.add(championId);
  }

  return used;
}

export function getCurrentGameUnavailableChampionIds(
  series: ActiveDraftSeries,
  game: DraftGameState
) {
  const unavailable = getAllPreviouslyPlayedChampionIds(series, game.number + 1);

  for (const championId of game.bansBlue) unavailable.add(championId);
  for (const championId of game.bansRed) unavailable.add(championId);
  for (const championId of game.picksBlue) unavailable.add(championId);
  for (const championId of game.picksRed) unavailable.add(championId);

  return unavailable;
}

export function getLockedChampionIdsForSide(series: ActiveDraftSeries, side: Side) {
  const locked: string[] = [];

  for (const game of series.games) {
    if (game.number === series.currentGameNumber) continue;
    locked.push(...(side === "blue" ? game.picksBlue : game.picksRed));
  }

  return locked;
}

export function getCurrentGame(series: ActiveDraftSeries | null) {
  if (!series) return null;
  return series.games.find((game) => game.number === series.currentGameNumber) ?? null;
}

export function getCurrentStep(game: DraftGameState | null): DraftStep | null {
  if (!game) return null;
  return DRAFT_SEQUENCE[game.phaseIndex] ?? null;
}

export function isGameFullyDrafted(game: DraftGameState) {
  return (
    game.bansBlue.length === REQUIRED_BANS_PER_SIDE &&
    game.bansRed.length === REQUIRED_BANS_PER_SIDE &&
    game.picksBlue.length === REQUIRED_PICKS_PER_SIDE &&
    game.picksRed.length === REQUIRED_PICKS_PER_SIDE &&
    game.phaseIndex >= DRAFT_SEQUENCE.length
  );
}

export function getTeamRosterFromSources({
  teamSlug,
  save,
}: {
  teamSlug: string;
  save: DraftSave | null;
}): Partial<Record<Role, string>> {
  if (!save) return {};

  const updatedRoster = teamSlug ? save.updatedTeamRosters?.[teamSlug] : undefined;
  if (updatedRoster && typeof updatedRoster === "object") {
    return updatedRoster;
  }

  if (teamSlug && save.controlledTeamSlug === teamSlug && save.roster) {
    return save.roster;
  }

  return {};
}

function normalizeAssignmentValues(assignments: Partial<Record<Role, string>>) {
  return ROLE_ORDER.map((role) => assignments[role]).filter(Boolean) as string[];
}

function hasResolvedAssignmentsForPicks(
  assignments: Partial<Record<Role, string>>,
  picks: string[]
) {
  const assigned = normalizeAssignmentValues(assignments);
  const cleanPicks = picks.slice(0, ROLE_ORDER.length).filter(Boolean);

  if (assigned.length !== cleanPicks.length) return false;

  const assignedSet = new Set(assigned);
  if (assignedSet.size !== assigned.length) return false;

  for (const championId of cleanPicks) {
    if (!assignedSet.has(championId)) return false;
  }

  return true;
}

function replaceAssignments(
  game: DraftGameState,
  side: Side,
  assignments: Partial<Record<Role, string>>
) {
  if (side === "blue") return { ...game, assignmentsBlue: assignments };
  return { ...game, assignmentsRed: assignments };
}

export function commitActionToGame(
  game: DraftGameState,
  championId: string,
  side: Side,
  action: DraftAction
): DraftGameState {
  const nextGame: DraftGameState = { ...game };

  if (action === "ban") {
    if (side === "blue") nextGame.bansBlue = [...game.bansBlue, championId];
    if (side === "red") nextGame.bansRed = [...game.bansRed, championId];
  }

  if (action === "pick") {
    if (side === "blue") {
      nextGame.picksBlue = [...game.picksBlue, championId];
    }
    if (side === "red") {
      nextGame.picksRed = [...game.picksRed, championId];
    }
  }

  nextGame.phaseIndex = Math.min(game.phaseIndex + 1, DRAFT_SEQUENCE.length);
  return nextGame;
}

export function resolveFinishedDraftAssignments(
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null
): DraftGameState {
  const blueRoster = getTeamRosterFromSources({ teamSlug: series.blueTeamSlug, save });
  const redRoster = getTeamRosterFromSources({ teamSlug: series.redTeamSlug, save });

  const assignmentsBlue = hasResolvedAssignmentsForPicks(game.assignmentsBlue, game.picksBlue)
    ? game.assignmentsBlue
    : series.userSide === "blue"
      ? mapPicksToRoleOrder(game.picksBlue)
      : resolveRoleAssignments(game.picksBlue, blueRoster);

  const assignmentsRed = hasResolvedAssignmentsForPicks(game.assignmentsRed, game.picksRed)
    ? game.assignmentsRed
    : series.userSide === "red"
      ? mapPicksToRoleOrder(game.picksRed)
      : resolveRoleAssignments(game.picksRed, redRoster);

  return {
    ...game,
    assignmentsBlue,
    assignmentsRed,
  };
}

export function swapAssignedRoles(
  game: DraftGameState,
  side: Side,
  sourceRole: Role,
  targetRole: Role
) {
  if (sourceRole === targetRole) return game;

  const userAssignments =
    side === "blue" ? game.assignmentsBlue : game.assignmentsRed;
  const sourceChampion = userAssignments[sourceRole];
  const targetChampion = userAssignments[targetRole];
  if (!sourceChampion || !targetChampion) return game;

  const nextAssignments = { ...userAssignments };
  nextAssignments[sourceRole] = targetChampion;
  nextAssignments[targetRole] = sourceChampion;
  return replaceAssignments(game, side, nextAssignments);
}

export function evaluateDraftGame(
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null
) {
  const blueRoster = getTeamRosterFromSources({ teamSlug: series.blueTeamSlug, save });
  const redRoster = getTeamRosterFromSources({ teamSlug: series.redTeamSlug, save });

  const evaluationBlue = evaluateTeamDraft({
    side: "blue",
    team: teamsBySlug.get(series.blueTeamSlug) ?? null,
    roster: blueRoster,
    playersById,
    championIds: game.picksBlue,
    enemyChampionIds: game.picksRed,
    championMap: new Map(champions.map((champion) => [champion.id, champion])),
  });

  const evaluationRed = evaluateTeamDraft({
    side: "red",
    team: teamsBySlug.get(series.redTeamSlug) ?? null,
    roster: redRoster,
    playersById,
    championIds: game.picksRed,
    enemyChampionIds: game.picksBlue,
    championMap: new Map(champions.map((champion) => [champion.id, champion])),
  });

  return {
    evaluationBlue,
    evaluationRed,
  };
}

export function simulateDraftResult(
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null
): DraftSimulationResult {
  return simulateFullMatch({
    game,
    series,
    save,
  });
}

export function completeCurrentGame(
  series: ActiveDraftSeries,
  save: DraftSave | null
): ActiveDraftSeries {
  const currentGame = getCurrentGame(series);
  if (!currentGame) return series;

  const resolvedGame = resolveFinishedDraftAssignments(currentGame, series, save);
  const simulation = simulateDraftResult(resolvedGame, series, save);
  const { evaluationBlue, evaluationRed } = evaluateDraftGame(resolvedGame, series, save);
  const completedGame: DraftGameState = {
    ...resolvedGame,
    completed: true,
    winnerSide: simulation.winnerSide,
    evaluationBlue,
    evaluationRed,
    simulation,
  };

  try {
    recordCompletedUserDraftGame(series, completedGame);
  } catch {
    // localStorage is best-effort only
  }

  return {
    ...series,
    games: series.games.map((game) =>
      game.number === currentGame.number ? completedGame : game
    ),
  };
}

export function advanceSeries(series: ActiveDraftSeries): ActiveDraftSeries {
  const nextGameNumber = series.currentGameNumber + 1;
  const hasNextGame = series.games.some((game) => game.number === nextGameNumber);

  return {
    ...series,
    currentGameNumber: nextGameNumber,
    blueTeamSlug: series.redTeamSlug,
    redTeamSlug: series.blueTeamSlug,
    userSide: series.userSide === "blue" ? "red" : "blue",
    games: hasNextGame ? series.games : [...series.games, createEmptyGame(nextGameNumber)],
  };
}

export function getAiChoice(
  series: ActiveDraftSeries,
  game: DraftGameState,
  step: DraftStep,
  save: DraftSave | null,
  config: DraftAiConfig = DEFAULT_AI_CONFIG
) {
  const unavailable = getCurrentGameUnavailableChampionIds(series, game);
  const pool = champions.filter((champion) => !unavailable.has(champion.id));
  return chooseAiAction(pool, step, game, series, save, config);
}
