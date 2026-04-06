import { players } from "@/app/data/players";
import { readPlayerSeasonStore } from "@/app/draft-engine/playerSeasonStorage";
import type { FinalsMvpResult } from "./playoffTypes";

export function getTeamFinalsMvpCandidate(
  teamSlug: string,
  teamName: string
): FinalsMvpResult | null {
  const store = readPlayerSeasonStore();
  const logs = (store.logs ?? []).filter(
    (log) => log.teamSlug === teamSlug && log.bestOf === 5
  );

  if (logs.length === 0) {
    return null;
  }

  const grouped = new Map<string, number[]>();

  for (const log of logs) {
    const current = grouped.get(log.playerId) ?? [];
    current.push(log.score);
    grouped.set(log.playerId, current);
  }

  let bestPlayerId: string | null = null;
  let bestAverage = -1;

  for (const [playerId, scores] of grouped.entries()) {
    if (scores.length === 0) continue;

    const average =
      scores.reduce((sum, value) => sum + value, 0) / scores.length;

    if (average > bestAverage) {
      bestAverage = average;
      bestPlayerId = playerId;
    }
  }

  if (!bestPlayerId) {
    return null;
  }

  const player = players.find((entry) => entry.id === bestPlayerId);

  return {
    playerName: player?.name ?? "Player Name",
    team: teamName,
    grade: Number(bestAverage.toFixed(2)),
  };
}