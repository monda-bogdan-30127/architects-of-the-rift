import type { Role } from "./champion";

export type PlayerRating = number;

export type PlayerStats = {
  mec: number;
  mac: number;
  tfg: number;
  clt: number;
  con: number;
  iq: number;
};

export type PlayerSeed = {
  execution: PlayerRating;
  mapSense: PlayerRating;
  combat: PlayerRating;
  resilience: PlayerRating;
  stability: PlayerRating;
  gameRead: PlayerRating;
};

export type PlayerPrimaryStats = {
  mechanics: number;
  laning: number;
  positioning: number;
  skirmishing: number;
  teamfighting: number;
  mapAwareness: number;
  objectiveControl: number;
  rotationTiming: number;
  consistency: number;
  adaptability: number;
  discipline: number;
  clutchFactor: number;
  championPoolSize: number;
  metaReadiness: number;
  blindPickStrength: number;
  counterPickStrength: number;
  aggression: number;
  roamFrequency: number;
  scalingPreference: number;
  playmakingBias: number;
  riskManagement: number;
  currentForm: number;
  patchComfort: number;
};

export type PlayerSubstats = {
  mechanicalExecution: number;
  reactionTime: number;
  laneTrading: number;
  spacing: number;
  comboPrecision: number;
  skirmishInstinct: number;
  teamfightSpacing: number;
  targetSelection: number;
  mapReading: number;
  objectiveSetup: number;
  rotationPlanning: number;
  visionCraft: number;
  metaAdaptation: number;
  blindStability: number;
  counterPrep: number;
  pressureExecution: number;
  disciplineUnderStress: number;
  riskCalibration: number;
  championDepth: number;
  patchIntegration: number;
  roamWindowReading: number;
  carryComfort: number;
  utilityComfort: number;
  styleFlex: number;
};

export type PlayerPlaystyleProfile = {
  carryResourceUsage: number;
  utilityComfort: number;
  playmakingIntent: number;
  scalingOrientation: number;
  laneControlBias: number;
  roamBias: number;
  riskAppetite: number;
  setupDependence: number;
  styleFlex: number;
};

export type PlayerTendencies = {
  invadeFrequency: number;
  towerDiveFrequency: number;
  objectiveContestBias: number;
  splitPushBias: number;
  flankPreference: number;
  safeLanePreference: number;
  laneRevisitBias: number;
  resetDiscipline: number;
};

export type PlayerHiddenTraits = {
  greed: number;
  composure: number;
  leadership: number;
  communication: number;
  volatility: number;
};

export type PlayerAdvancedProfile = {
  seed: PlayerSeed;
  primary: PlayerPrimaryStats;
  substats: PlayerSubstats;
  playstyle: PlayerPlaystyleProfile;
  tendencies: PlayerTendencies;
  hiddenTraits: PlayerHiddenTraits;
};

export type PlayerPhaseSnapshot = {
  laneControl: number;
  skirmish: number;
  stability: number;
  mapPlay: number;
  teamfight: number;
  clutch: number;
};

export type PlayerPhaseProfile = {
  early: PlayerPhaseSnapshot;
  mid: PlayerPhaseSnapshot;
  late: PlayerPhaseSnapshot;
};

export type PlayerArchetypeAffinity = {
  engage: number;
  enchanter: number;
  carry: number;
  tank: number;
  poke: number;
  setup: number;
  utility: number;
  dive: number;
  frontToBack: number;
};

export type PlayerAdaptationProfile = {
  draftFlex: number;
  creativity: number;
  composure: number;
  matchupLearning: number;
};


export type PlayerStyleLabel =
  | "carry"
  | "utility"
  | "playmaker"
  | "scaler"
  | "lane_bully"
  | "roamer"
  | "aggressive"
  | "setup"
  | "flex"
  | "weakside";

export type PlayerStyleIdentity = {
  primary: PlayerStyleLabel;
  secondary: PlayerStyleLabel;
  scores: Record<PlayerStyleLabel, number>;
};

export type Player = {
  id: string;
  slug: string;
  name: string;
  teamId: string;
  role: Role;
  image: string;
  stats: PlayerStats;
  advancedProfile: PlayerAdvancedProfile;
  playstyleIdentity: PlayerStyleIdentity;
  bestChampions: string[];
  comfortChampions: string[];
  championPool: string[];
  rosterPoints: number;
  sortOrder: number;
  phaseProfile?: PlayerPhaseProfile;
  archetypeAffinity?: PlayerArchetypeAffinity;
  adaptationProfile?: PlayerAdaptationProfile;
};
