import type { FullMatchSimulationResult } from "./matchSimulationTypes";
import type { Champion, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import type { Team } from "@/app/types/team";
import type { CompAttribute } from "@/app/types/compAttributes";

export type Side = "blue" | "red";
export type DraftAction = "ban" | "pick";

export type DraftPlanType =
  | "secure-power"
  | "protect-blind"
  | "hold-counter"
  | "hide-solo-lane"
  | "lock-bot-prio"
  | "protect-carry"
  | "deny-signature"
  | "stabilize-comp";

export type DraftStep = {
  label: string;
  side: Side;
  action: DraftAction;
};

export type DraftGameState = {
  number: number;
  phaseIndex: number;
  completed: boolean;
  winnerSide: Side | null;
  bansBlue: string[];
  bansRed: string[];
  picksBlue: string[];
  picksRed: string[];
  assignmentsBlue: Partial<Record<Role, string>>;
  assignmentsRed: Partial<Record<Role, string>>;
  evaluationBlue?: TeamDraftEvaluation;
  evaluationRed?: TeamDraftEvaluation;
  simulation?: DraftSimulationResult;
};

export type ActiveDraftSeries = {
  seriesId: string;
  bo: 3 | 5;
  currentGameNumber: number;
  blueTeamSlug: string;
  redTeamSlug: string;
  userSide: Side;
  games: DraftGameState[];
};

export type DraftSave = {
  region: string;
  controlledTeamSlug: string;
  budget: number;
  leftRp?: number;
  roster: Record<Role, string>;
  updatedTeamRosters: Record<string, Record<Role, string>>;
  playerTeamAssignments: Record<string, string>;
  freeAgentPlayerIds: string[];
};

export type SeriesResult = {
  winnerTeamSlug: string;
  leftWins: number;
  rightWins: number;
  completedAt: number;
  resolution: "played" | "simulated";
};

export type TeamCompVector = Record<CompAttribute, number>;

export type TeamDraftContext = {
  side: Side;
  team: Team | null;
  roster: Partial<Record<Role, string>>;
  playersById: Map<string, Player>;
  championIds: string[];
  enemyChampionIds: string[];
  championMap: Map<string, Champion>;
};

export type NeedStatus = {
  type: CompAttribute;
  required: number;
  current: number;
  missing: number;
};

export type TeamDraftEvaluation = {
  compVector: TeamCompVector;
  synergyScore: number;
  needScore: number;
  weaknessPenalty: number;
  counterScore: number;
  metaScore: number;
  playerFitScore: number;
  comfortScore: number;
  engageScore: number;
  frontlineScore: number;
  damageBalanceScore: number;
  roleCoverageScore: number;
  executionEaseScore: number;
  protectionScore: number;
  antiDiveScore: number;
  primaryEngageScore: number;
  followUpScore: number;
  rangeProfileScore: number;
  shortRangePenalty: number;
  carryProtectionPenalty: number;
  executionDifficultyPenalty: number;
  rosterExecutionScore: number;
  compIdentity: "front-to-back" | "pick" | "dive" | "poke" | "teamfight" | "balanced";
  draftPower: number;
  missingNeeds: NeedStatus[];
  topStrengths: Array<{ type: CompAttribute; value: number }>;
  accessScore?: number;
  threatScore?: number;
  roleProfileScore?: number;
  teamIdentityScore?: number;
  simulationReadinessScore?: number;
  simulationRisks?: string[];
  identityMatchedTags?: string[];
  identityAvoidedTags?: string[];
  identityNote?: string;
};

export type DraftCandidateBreakdown = {
  championId: string;
  action: DraftAction;
  side: Side;
  metaPriority: number;
  comfortScore: number;
  playerFitScore: number;
  compSynergy: number;
  needFill: number;
  counterValue: number;
  weaknessPenalty: number;
  totalScore: number;
  projectedRole?: Role | null;
  projectedPlayerId?: string | null;
  planType?: DraftPlanType;
  planBias?: number;
  blindRiskPenalty?: number;
  flexBonus?: number;
  historyBias?: number;
  matchupBias?: number;
  signatureThreat?: number;
  sideBias?: number;
  informationLeakPenalty?: number;
  counterpickPreservationBonus?: number;
  forcedResponseBonus?: number;
  protectionPenalty?: number;
  executionPenalty?: number;
  variabilityPenalty?: number;
  teamIdentityBias?: number;
  userPatternBias?: number;
  accessValue?: number;
  threatValue?: number;
  synergyRuleValue?: number;
  simulatedFitValue?: number;
  reasonTags?: string[];
  explanation?: string[];
};

export type DraftAiConfig = {
  metaWeight: number;
  comfortWeight: number;
  fitWeight: number;
  synergyWeight: number;
  needWeight: number;
  counterWeight: number;
  weaknessWeight: number;
  banThreatWeight: number;
  varietyWeight?: number;
  temperature?: number;
  userExploitWeight?: number;
  teamIdentityWeight?: number;
  shortlistWindow?: number;
};

export type DraftSimulationResult = FullMatchSimulationResult;

export const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];

export const DRAFT_SEQUENCE: DraftStep[] = [
  { label: "B1", side: "blue", action: "ban" },
  { label: "R1", side: "red", action: "ban" },
  { label: "B2", side: "blue", action: "ban" },
  { label: "R2", side: "red", action: "ban" },
  { label: "B3", side: "blue", action: "ban" },
  { label: "R3", side: "red", action: "ban" },

  { label: "B1", side: "blue", action: "pick" },
  { label: "R1", side: "red", action: "pick" },
  { label: "R2", side: "red", action: "pick" },
  { label: "B2", side: "blue", action: "pick" },
  { label: "B3", side: "blue", action: "pick" },

  { label: "R4", side: "red", action: "ban" },
  { label: "B4", side: "blue", action: "ban" },
  { label: "R5", side: "red", action: "ban" },
  { label: "B5", side: "blue", action: "ban" },

  { label: "R3", side: "red", action: "pick" },
  { label: "B4", side: "blue", action: "pick" },
  { label: "R4", side: "red", action: "pick" },
  { label: "B5", side: "blue", action: "pick" },
];

export const REQUIRED_BANS_PER_SIDE = 5;
export const REQUIRED_PICKS_PER_SIDE = 5;

export const DEFAULT_AI_CONFIG: DraftAiConfig = {
  metaWeight: 1.95,
  comfortWeight: 1.1,
  fitWeight: 1.05,
  synergyWeight: 1.35,
  needWeight: 1.15,
  counterWeight: 1.2,
  weaknessWeight: 1.2,
  banThreatWeight: 1.35,
  varietyWeight: 1,
  temperature: 0.72,
  userExploitWeight: 1,
  teamIdentityWeight: 1,
  shortlistWindow: 7,
};
