import type { Side } from "./draftTypes";

export type PlayerHistoryStatLine = {
  games: number;
  wins: number;
  scoreSum: number;
  recentScores: number[];
  recentResults: number[];
  lastUpdatedAt: number;
};

export type PlayerChampionHistory = Record<string, PlayerHistoryStatLine>;
export type PlayerChampionMatchupHistory = Record<string, PlayerHistoryStatLine>;

export type PlayerHistoryRecord = {
  champions: PlayerChampionHistory;
  matchups: PlayerChampionMatchupHistory;
};

export type PlayerHistoryStore = Record<string, PlayerHistoryRecord>;

export type ResolvedHistoryGameInput = {
  winnerSide: Side;
  blueRoster: Partial<Record<import("@/app/types/champion").Role, string>>;
  redRoster: Partial<Record<import("@/app/types/champion").Role, string>>;
  assignmentsBlue: Partial<Record<import("@/app/types/champion").Role, string>>;
  assignmentsRed: Partial<Record<import("@/app/types/champion").Role, string>>;
  playerScores?: Array<{
    playerId: string;
    score: number;
  }>;
  gameNumber?: number;
};

export type PlayerHistoryMetrics = {
  games: number;
  wins: number;
  scoreAvg: number;
  recentScoreAvg: number;
  smoothedWinRate: number;
  confidence: number;
  recentConfidence: number;
};