import type { FullMatchSimulationResult } from "./matchSimulationTypes";
import type { BadSynergyLevel, Champion, MatchupLevel, MatchupPhase, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import type { Team } from "@/app/types/team";
import type { CompAttribute } from "@/app/types/compAttributes";
import type { DraftPhaseId } from "./draftPhase";

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

/** DRAFT_THINKING §8 — raportul de draft pe piloni. */
export type PillarGrade = "A" | "B" | "C" | "D";
export type DraftPillar = { grade: PillarGrade; notes: string[] };
export type DraftPillarReport = {
  /** Priority pick-uri luate / lăsate. */
  priority: DraftPillar;
  /** Identitate, split, win condition. */
  cohesion: DraftPillar;
  /** Bilanțul liniilor + comp counter + tunnel vision. */
  matchups: DraftPillar;
  /** Gradele pe jucători, F / D, reasignări. */
  mastery: DraftPillar;
  /** Răspunsul la favoriții de sezon ai adversarului. */
  seasonPrep: DraftPillar;
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
  /**
   * Rolul pentru care a fost luat fiecare pick (DRAFT_THINKING §1.2): championId → rol.
   * AI: rolul proiectat la pick; user: slotul din ordinea pick-urilor (actualizat la swap).
   */
  pickRolesBlue: Partial<Record<string, Role>>;
  pickRolesRed: Partial<Record<string, Role>>;
  /** §8 — calculat la încheierea jocului (opțional: salvările vechi nu-l au). */
  pillarReportBlue?: DraftPillarReport;
  pillarReportRed?: DraftPillarReport;
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
  /** Rolurile finale (lipsă → `resolveRoleAssignments(championIds, roster)`). */
  assignments?: Partial<Record<Role, string>>;
  enemyAssignments?: Partial<Record<Role, string>>;
  enemyRoster?: Partial<Record<Role, string>>;
  /** Ban-uri + alți campioni indisponibili (pentru perechile mustWith ratate). */
  unavailableChampionIds?: string[];
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
  compIdentity: "front-to-back" | "pick" | "dive" | "poke" | "teamfight" | "protect-carry" | "balanced";
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
  /** Notele de matchup care au intrat în `counterValue` (pentru explainer). */
  matchupDetails?: {
    enemyId: string;
    enemyRole: Role | null;
    level: MatchupLevel;
    phase: MatchupPhase;
    kind: "good" | "weak";
    value: number;
  }[];
  /** Pick forțat de regula mustWith (botlane override sau lock non-bot). */
  mustWithLock?: { anchorId: string; partnerId: string; grade: string | null };
  /** Bonusurile mustWith adunate în scor (combo potential, non-bot, deny). */
  mustWithBonus?: number;
  /** DRAFT_THINKING §4 — alinierea cu planul (× angajamentul pe pick) și planul folosit. */
  planAlignment?: number;
  plan?: { type: string; anchorChampionId?: string; lockedAtPick?: number };
  /** §3 / §5 — identitatea dominantă a pick-urilor proprii și potrivirea candidatului (−3..+3). */
  identity?: { dominant: string; fit: number };
  /** §7 — amenințarea de sezon relevantă pentru candidat (ban / counter). */
  seasonThreat?: { championId: string; threat: number; kind: "ban" | "plan" | "counter" };
  /** §6 — comp counter (matrice × strength, după tunnel vision). */
  compCounterValue?: number;
  /** §5.3 — win condition-ul compoziției proprii. */
  winCondition?: { championId: string; role: Role; kind: string };
  /** §1.4 — pick-uri proprii pe care candidatul le-ar muta pe alt rol. */
  reassignment?: { championId: string; fromRole: Role; toRole: Role; playerId: string | null; grade: string | null }[];
  /** Anti-sinergiile candidatului cu pick-urile proprii (`badSynergyWith`, pentru explainer). */
  badSynergies?: { partnerId: string; level: BadSynergyLevel; note: string }[];
  /**
   * Include, pe lângă cele vechi: "mustwith-lock", "mustwith-deny", "bad-synergy";
   * DRAFT_THINKING: "breaks-own-pick", "mastery-f", "mastery-d", "forced-off-pool",
   * "duo-plan", "duo-fallback", "orphan-anchor".
   */
  reasonTags?: string[];
  explanation?: string[];
  /** Locul alegerii în lista de candidați valizi, sortată (0 = primul). Lipsă la acțiunile forțate. */
  choiceRank?: number;
  /** DRAFT_REALISM §4.3 — subtotalul fiecărui bucket, înainte de ponderi. */
  buckets?: Partial<Record<BucketId, number>>;
  /** Ponderile folosite (totalul = Σ bucket × pondere). */
  bucketWeights?: Partial<Record<BucketId, number>>;
  phase?: DraftPhaseId;
  /** Intențiile echipei la acest pas, sortate desc; primul = intenția principală (§7). */
  intents?: { id: IntentId; urgency: number; reason?: string }[];
};

/** DRAFT_REALISM §4 — bucket-urile de pick / ban. */
export type PickBucketId = "power" | "comp" | "counter" | "comfort" | "deny" | "info" | "style";
export type BanBucketId = "power" | "target" | "protect" | "compDeny" | "predict" | "hygiene";
export type BucketId = PickBucketId | BanBucketId;
/** DRAFT_REALISM §7 — intențiile echipei. */
export type IntentId = "secure-priority" | "deny" | "answer" | "build-identity" | "comfort" | "hide";

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

export type DraftSimulationResult = FullMatchSimulationResult & {
  seriesMvpPlayerId: string | null;
  isSeriesComplete: boolean;
};

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
  { label: "R3", side: "red", action: "pick" },

  { label: "R4", side: "red", action: "ban" },
  { label: "B4", side: "blue", action: "ban" },
  { label: "R5", side: "red", action: "ban" },
  { label: "B5", side: "blue", action: "ban" },

  { label: "R4", side: "red", action: "pick" },
  { label: "B4", side: "blue", action: "pick" },
  { label: "B5", side: "blue", action: "pick" },
  { label: "R5", side: "red", action: "pick" },
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
