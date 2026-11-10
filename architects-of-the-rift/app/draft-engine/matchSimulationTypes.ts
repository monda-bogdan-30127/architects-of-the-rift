import type { Role } from "@/app/types/champion";

// ─── Phase-level scoring (Upgrade 1: 3-phase simulation) ───────────────────
export type PhaseScore = {
  playerStrength: number;
  championPower: number;
  phaseTotal: number;
};

export type PhaseBreakdown = {
  early: PhaseScore;
  mid: PhaseScore;
  late: PhaseScore;
};

export type TeamPhaseScores = {
  draft: number;
  playerPower: number;
  assignment: number;
  lane: number;
  objectives: number;
  execution: number;
  clutch: number;
  late: number;
  /** FEEDBACK_FIXES §6.1 — momentum și variația (rng), adunate în total. Opționale: salvările vechi nu le au. */
  momentum?: number;
  rng?: number;
  total: number;
  /** Totalul înainte de clamp-uri și rotunjire (= Σ contribuțiilor). */
  totalRaw?: number;
  /** Contribuția fiecărui factor la total, cu ponderile din `buildTeamPhaseScores`. */
  contributions?: Record<OutcomeFactorKey, number>;
  phases: PhaseBreakdown;
};

/** FEEDBACK_FIXES §6.1 — factorii rezultatului. */
export type OutcomeFactorKey =
  | "draft" | "players" | "mastery" | "lane" | "objectives" | "execution" | "clutch" | "late"
  | "momentum" | "variance" | "early" | "mid" | "lateFights";

export type OutcomeFactor = {
  key: OutcomeFactorKey;
  /** Valoarea factorului pentru fiecare echipă (scorul categoriei / fazei). */
  blue: number;
  red: number;
  /** Contribuția la diferența de total; pozitivă = în favoarea blue. */
  edgeBlue: number;
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
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
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
  gameLength: string;
  /** FEEDBACK_FIXES §6.1 — ce a decis meciul (opțional: salvările vechi nu îl au). */
  outcomeFactors?: OutcomeFactor[];
};