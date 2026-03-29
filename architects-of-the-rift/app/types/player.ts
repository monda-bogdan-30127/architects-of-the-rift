import type { Role } from "./champion";

export type PlayerRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type PlayerStats = {
  mec: PlayerRating;
  mac: PlayerRating;
  tfg: PlayerRating;
  clt: PlayerRating;
  con: PlayerRating;
  iq: PlayerRating;
};

export type PlayerSubstats = {
  microPrecision: PlayerRating;
  reactionTime: PlayerRating;
  comboExecution: PlayerRating;
  spacing: PlayerRating;
  handsConsistency: PlayerRating;

  mapReading: PlayerRating;
  objectiveSetup: PlayerRating;
  rotationTiming: PlayerRating;
  laneAssignment: PlayerRating;
  visionCraft: PlayerRating;
  waveControl: PlayerRating;

  positioningInFights: PlayerRating;
  targetSelection: PlayerRating;
  spellLayering: PlayerRating;
  frontToBackUnderstanding: PlayerRating;
  damageUptime: PlayerRating;
  engageFollowUp: PlayerRating;

  clutchDecisionMaking: PlayerRating;
  pressureExecution: PlayerRating;
  comebackNerve: PlayerRating;
  closeoutControl: PlayerRating;

  performanceFloor: PlayerRating;
  disciplineUnderPressure: PlayerRating;
  recoveryAfterMistakes: PlayerRating;

  patchInterpretation: PlayerRating;
  championLearning: PlayerRating;
  draftReadiness: PlayerRating;
  styleElasticity: PlayerRating;
  problemSolving: PlayerRating;
};

export type PlayerPlaystyleProfile = {
  carryResourceUsage: PlayerRating;
  utilityComfort: PlayerRating;
  playmakingIntent: PlayerRating;
  scalingOrientation: PlayerRating;
  laneControlBias: PlayerRating;
  roamBias: PlayerRating;
  riskAppetite: PlayerRating;
  setupDependence: PlayerRating;
};

export type PlayerTendencies = {
  invadeFrequency: PlayerRating;
  laneRevisitBias: PlayerRating;
  objectiveTradeBias: PlayerRating;
  diveFrequency: PlayerRating;
  flankPreference: PlayerRating;
  sideLaneCatchBias: PlayerRating;
  safeResetDiscipline: PlayerRating;
};

export type PlayerHiddenTraits = {
  greed: PlayerRating;
  composure: PlayerRating;
  leadership: PlayerRating;
  communication: PlayerRating;
  volatility: PlayerRating;
};

export type PlayerAdvancedProfile = {
  substats: PlayerSubstats;
  playstyle: PlayerPlaystyleProfile;
  tendencies: PlayerTendencies;
  hiddenTraits: PlayerHiddenTraits;
  notes?: string[];
};

export type Player = {
  id: string;
  slug: string;
  name: string;
  teamId: string;
  role: Role;
  image: string;
  stats: PlayerStats;
  advancedProfile?: PlayerAdvancedProfile;
  bestChampions: string[];
  comfortChampions: string[];
  championPool: string[];
  rosterPoints: number;
  sortOrder: number;
};
