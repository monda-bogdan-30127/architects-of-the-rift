import type { PlayerHistoryMetrics, PlayerHistoryStatLine } from "./playerHistoryTypes";
import {
  getPlayerChampionHistoryLine,
  getPlayerChampionMatchupHistoryLine,
  readPlayerHistoryStore,
} from "./playerHistoryStorage";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function smoothPlayerHistoryWinRate(wins: number, games: number, priorWins = 3, priorGames = 6) {
  return (wins + priorWins) / (games + priorGames);
}

export function historyConfidenceScale(games: number, fullConfidenceGames = 12) {
  return clamp(games / fullConfidenceGames, 0, 1);
}

function getRecentWinRate(values: number[]) {
  if (values.length === 0) return 0.5;
  return average(values);
}

function buildMetrics(line: PlayerHistoryStatLine): PlayerHistoryMetrics {
  const scoreAvg = line.games > 0 ? line.scoreSum / line.games : 0;
  const recentScoreAvg = line.recentScores.length > 0 ? average(line.recentScores) : scoreAvg;
  const recentConfidence = historyConfidenceScale(line.recentScores.length, 5);

  return {
    games: line.games,
    wins: line.wins,
    scoreAvg,
    recentScoreAvg,
    smoothedWinRate: smoothPlayerHistoryWinRate(line.wins, line.games),
    confidence: historyConfidenceScale(line.games),
    recentConfidence: recentConfidence * 0.9 + getRecentWinRate(line.recentResults) * 0.1,
  };
}

function scoreEdge(score: number) {
  if (!Number.isFinite(score) || score <= 0) return 0;
  return clamp((score - 6.8) / 2.2, -1, 1.2);
}

export function getPlayerChampionHistoryMetrics(
  playerId: string | null | undefined,
  championId: string | null | undefined
): PlayerHistoryMetrics {
  const store = readPlayerHistoryStore();
  const line = getPlayerChampionHistoryLine(store, playerId, championId);
  return buildMetrics(line);
}

export function getPlayerChampionMatchupHistoryMetrics(
  playerId: string | null | undefined,
  championId: string | null | undefined,
  enemyChampionId: string | null | undefined
): PlayerHistoryMetrics {
  const store = readPlayerHistoryStore();
  const line = getPlayerChampionMatchupHistoryLine(store, playerId, championId, enemyChampionId);
  return buildMetrics(line);
}

export function getPlayerChampionFamiliarityBonus(
  playerId: string | null | undefined,
  championId: string | null | undefined
) {
  const metrics = getPlayerChampionHistoryMetrics(playerId, championId);
  return clamp(metrics.confidence * 0.35 + metrics.recentConfidence * 0.12, 0, 0.45);
}

export function getPlayerChampionHistoryBonus(
  playerId: string | null | undefined,
  championId: string | null | undefined
) {
  const metrics = getPlayerChampionHistoryMetrics(playerId, championId);
  const winEdge = (metrics.smoothedWinRate - 0.5) * 2;
  const ratingEdge = scoreEdge(metrics.scoreAvg) * 0.42 + scoreEdge(metrics.recentScoreAvg) * 0.58;
  const familiarity = getPlayerChampionFamiliarityBonus(playerId, championId);
  return clamp(
    winEdge * metrics.confidence * 0.72 +
      ratingEdge * (0.45 + metrics.recentConfidence * 0.35) +
      familiarity,
    -0.95,
    1.35
  );
}

export function getPlayerChampionSignatureBonus(
  playerId: string | null | undefined,
  championId: string | null | undefined
) {
  const metrics = getPlayerChampionHistoryMetrics(playerId, championId);
  if (metrics.games < 6) return 0;
  if (metrics.smoothedWinRate < 0.56 && metrics.recentScoreAvg < 7.4) return 0;
  return clamp(
    (metrics.smoothedWinRate - 0.56) * 1.8 +
      scoreEdge(metrics.recentScoreAvg) * 0.45 +
      metrics.confidence * 0.2,
    0,
    0.85
  );
}

export function getPlayerChampionMatchupHistoryBonus(
  playerId: string | null | undefined,
  championId: string | null | undefined,
  enemyChampionId: string | null | undefined
) {
  const metrics = getPlayerChampionMatchupHistoryMetrics(playerId, championId, enemyChampionId);
  const winEdge = (metrics.smoothedWinRate - 0.5) * 2;
  const ratingEdge = scoreEdge(metrics.scoreAvg) * 0.35 + scoreEdge(metrics.recentScoreAvg) * 0.65;
  return clamp(
    winEdge * metrics.confidence * 0.72 +
      ratingEdge * (0.32 + metrics.recentConfidence * 0.4),
    -1,
    1
  );
}

export function getPlayerChampionMatchupDraftBias(
  playerId: string | null | undefined,
  championId: string | null | undefined,
  enemyChampionIds: string[]
) {
  if (!playerId || !championId || enemyChampionIds.length === 0) return 0;
  const values = enemyChampionIds.map((enemyChampionId) =>
    getPlayerChampionMatchupHistoryBonus(playerId, championId, enemyChampionId)
  );
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const strongest = values.reduce((best, value) => (Math.abs(value) > Math.abs(best) ? value : best), 0);
  return clamp(avg * 0.65 + strongest * 0.35, -1.1, 1.2);
}

export function getHistoryAdjustedDraftFit(
  baseFit: number,
  playerId: string | null | undefined,
  championId: string | null | undefined
) {
  const historyBonus = getPlayerChampionHistoryBonus(playerId, championId);
  const signatureBonus = getPlayerChampionSignatureBonus(playerId, championId);
  return clamp(baseFit + historyBonus * 1.15 + signatureBonus * 0.65, 0, 10);
}

export function getHistoryAdjustedLaneBonus(
  playerId: string | null | undefined,
  championId: string | null | undefined,
  enemyChampionId: string | null | undefined
) {
  const matchupBonus = getPlayerChampionMatchupHistoryBonus(playerId, championId, enemyChampionId);
  const signatureBonus = getPlayerChampionSignatureBonus(playerId, championId) * 0.3;
  return clamp(matchupBonus + signatureBonus, -1.1, 1.25);
}

export function getEnemySignatureThreat(
  playerId: string | null | undefined,
  championId: string | null | undefined
) {
  const historyBonus = getPlayerChampionHistoryBonus(playerId, championId);
  const signatureBonus = getPlayerChampionSignatureBonus(playerId, championId);
  return clamp(historyBonus * 5.2 + signatureBonus * 7.2, 0, 10);
}

export function getEnemySeasonSignatureThreat(
  playerId: string | null | undefined,
  championId: string | null | undefined
) {
  const metrics = getPlayerChampionHistoryMetrics(playerId, championId);
  if (metrics.games < 8) return 0;
  const raw =
    metrics.games * 0.35 +
    (metrics.smoothedWinRate - 0.5) * 14 +
    scoreEdge(metrics.recentScoreAvg) * 2.6 +
    metrics.confidence * 2.2;
  return clamp(raw, 0, 10);
}