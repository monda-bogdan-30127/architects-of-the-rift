import type { Role } from "@/app/types/champion";

export type TeamPhaseScores = {
  draft: number;
  playerPower: number;
  assignment: number;
  lane: number;
  objectives: number;
  execution: number;
  clutch: number;
  late: number;
  total: number;
};

export type LaneRoleBreakdown = {
  role: Role;
  blueChampionId: string | null;
  redChampionId: string | null;
  bluePlayerId: string | null;
  redPlayerId: string | null;
  blueScore: number;
  redScore: number;
  volatility: number;
  note: string;
};

export type LanePhaseResult = {
  blueScore: number;
  redScore: number;
  volatility: number;
  roles: LaneRoleBreakdown[];
};

export type PlayerGameScore = {
  side: "blue" | "red";
  role: Role;
  playerId: string;
  playerName: string;
  championId: string;
  championName: string;
  score: number;
  laneScore: number;
  draftFit: number;
  clutch: number;
  impact: number;
  stability: number;
  carryFactor: number;
  mistakeRisk: number;
  note: string;
};

export type MatchFlowLabel =
  | "stomp"
  | "controlled"
  | "back-and-forth"
  | "comeback"
  | "late-decider";

export type MatchProfile = "snowball" | "standard" | "scaling";

export type FullMatchSimulationResult = {
  winnerSide: "blue" | "red";
  blueTeamSlug: string;
  redTeamSlug: string;
  seriesScoreBlue: number;
  seriesScoreRed: number;
  blueDraftScore: number;
  redDraftScore: number;
  bluePlayerPower: number;
  redPlayerPower: number;
  blueTotal: number;
  redTotal: number;
  bluePhaseScores: TeamPhaseScores;
  redPhaseScores: TeamPhaseScores;
  closeness: number;
  volatility: number;
  flow: MatchFlowLabel;
  matchProfile: MatchProfile;
  reason: string;
  lane: LanePhaseResult;
  playerScores: PlayerGameScore[];
  mvpPlayerId: string | null;
};