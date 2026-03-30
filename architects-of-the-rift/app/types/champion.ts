// Extended champion model with backward compatibility for the existing data files.

import type { CompAttribute } from './compAttributes';

export type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support';
export type DamageType = 'AD' | 'AP' | 'TRUE';
export type Phase = 'early' | 'mid' | 'late';
export type PhaseRoleIdentity =
  | 'carry'
  | 'secondary-carry'
  | 'setup'
  | 'utility'
  | 'tank'
  | 'pick'
  | 'zone-control'
  | 'peel';

export type ChampionOffer = {
  type: CompAttribute;
  strength: 1 | 2 | 3 | 4 | 5;
};

export type ChampionNeed = {
  type: CompAttribute;
  priority: 1 | 2 | 3;
};

export type ChampionWeakness = {
  exposedTo: CompAttribute;
  severity: 1 | 2 | 3;
};

export type ChampionRelation = {
  championId: string;
  score?: number;
};

export type ChampionCarryProfile = {
  selfPeel?: 0 | 1 | 2 | 3 | 4 | 5;
  selfSave?: 0 | 1 | 2 | 3 | 4 | 5;
  mobilitySafety?: 0 | 1 | 2 | 3 | 4 | 5;
};

export type ChampionPlayerScaling = {
  mec?: 1 | 2 | 3 | 4 | 5;
  mac?: 1 | 2 | 3 | 4 | 5;
  tfg?: 1 | 2 | 3 | 4 | 5;
  clt?: 1 | 2 | 3 | 4 | 5;
  con?: 1 | 2 | 3 | 4 | 5;
  iq?: 1 | 2 | 3 | 4 | 5;
};

export type ChampionStats = {
  picks: number;
  bans: number;
  presence: number;
  prioScore: number;
  wins: number | null;
  losses: number | null;
  proWinRate: number | null;
  kda: number | null;
  avgBanTurn: number | null;
  avgPickRound: number | null;
  blindPickRate: number | null;
  averageGameTime: string | null;
  csPerMinute: number | null;
  damagePerMinute: number | null;
  goldPerMinute: number | null;
  csDiffAt15: number | null;
  goldDiffAt15: number | null;
  xpDiffAt15: number | null;
  soloqKrChallengerWinRate: number | null;
};

export type EffectType =
  | 'cc'
  | 'dash'
  | 'anti-dash'
  | 'ground'
  | 'slow'
  | 'knockup'
  | 'stun'
  | 'root'
  | 'silence'
  | 'displacement'
  | 'shield'
  | 'heal'
  | 'burst'
  | 'dps'
  | 'poke'
  | 'execute'
  | 'projectile'
  | 'projectile-block'
  | 'unstoppable'
  | 'zone-control'
  | 'mark'
  | 'vision'
  | 'anti-engage'
  | 'mobility'
  | 'setup'
  | 'pick';

export type ChampionEffect = {
  type: EffectType;
  subtype?: string;
  strength: number;
  reliability: number;
  priority?: number;
  conditions?: string[];
  counters?: string[];
  counteredBy?: string[];
};

export type ChampionAbility = {
  key: 'passive' | 'q' | 'w' | 'e' | 'r';
  name?: string;
  effects: ChampionEffect[];
};

export type ChampionPhaseProfile = {
  power: number;
  execution: number;
};

export type ChampionAccessProfile = {
  engageRange: number;
  targetAccess: number;
  stickiness: number;
};

export type ChampionDamageDeliveryProfile = {
  uptime: number;
  reliability: number;
  aoe: number;
};

export type ChampionConditionsProfile = {
  requiresFrontline?: boolean;
  requiresSetup?: boolean;
  requiresPeel?: boolean;
  requiresEngage?: boolean;
  requiresFollowUp?: boolean;
};

export type ChampionThreatProfile = {
  backlineThreat: number;
  frontlineThreat: number;
  pickThreat: number;
  zoneThreat: number;
  antiDiveThreat: number;
};

export type ChampionInteractionProfile = {
  counters: string[];
  counteredBy: string[];
};

export type ChampionDraftProfile = {
  flexValue: number;
  blindPick: number;
  contestPriority: number;
};

export type ChampionComboDependencyProfile = {
  needsKnockup?: number;
  needsEngage?: number;
  needsFrontline?: number;
  needsPeel?: number;
  needsEnchanter?: number;
};

export type ChampionScalingByCount = {
  count: number;
  score: number;
};

export type ChampionSynergyRule = {
  id: string;
  type: 'ally' | 'team' | 'enemy';
  targetTags?: string[];
  targetChampionIds?: string[];
  minCount?: number;
  maxCount?: number;
  scalingByCount?: ChampionScalingByCount[];
  effect: {
    score: number;
    reason: string;
  };
  phase?: Phase[];
};

export type ChampionRoleProfile = {
  role: Role;
  tags: string[];
  abilities: ChampionAbility[];
  damageProfileDetailed: {
    burst: number;
    dps: number;
    poke: number;
    execute: number;
  };
  damageDelivery: ChampionDamageDeliveryProfile;
  ccProfile: {
    hard: number;
    soft: number;
    pick: number;
    lockdown: number;
    chainPotential: number;
  };
  peelProfile: {
    disengage: number;
    antiDive: number;
    bodyguard: number;
    shield: number;
    resetProtection: number;
  };
  accessProfile: ChampionAccessProfile;
  special: {
    antiDash: number;
    projectileBlock: number;
    ground: number;
    displacement: number;
    visionControl: number;
  };
  threatProfile: ChampionThreatProfile;
  scaling: {
    early: ChampionPhaseProfile;
    mid: ChampionPhaseProfile;
    late: ChampionPhaseProfile;
  };
  phaseIdentity: {
    earlyRole: PhaseRoleIdentity;
    midRole: PhaseRoleIdentity;
    lateRole: PhaseRoleIdentity;
  };
  conditions: ChampionConditionsProfile;
  interactionProfile: ChampionInteractionProfile;
  draftProfile: ChampionDraftProfile;
  comboDependency: ChampionComboDependencyProfile;
  synergy: {
    wantsAllies: ChampionSynergyRule[];
    wantsTeam: ChampionSynergyRule[];
    goodVs: ChampionSynergyRule[];
    weakVs: ChampionSynergyRule[];
    goodWith: ChampionSynergyRule[];
    mustWith: ChampionSynergyRule[];
  };
  roleSpecific?: {
    jungle?: {
      clearSpeed: number;
      healthAfterClear: number;
      gankPower: number;
      objectiveControl: number;
      invade: number;
    };
    support?: {
      lanePressure: number;
      roamValue: number;
      visionControl: number;
      peelExecution: number;
    };
    adc?: {
      laneSafety: number;
      spacingBurden: number;
      sustainedFightValue: number;
    };
    top?: {
      sideLaneControl: number;
      blindStability: number;
      weaksideTolerance: number;
    };
    mid?: {
      waveControl: number;
      setupPower: number;
      roamPressure: number;
    };
  };
};

export type Champion = {
  id: string;
  name: string;
  image: string;
  roles: Role[];
  damageProfile: DamageType[];
  stats: ChampionStats;
  weakVs: ChampionRelation[];
  goodVs: ChampionRelation[];
  mustWith: ChampionRelation[];
  synergyWith: ChampionRelation[];
  offers: ChampionOffer[];
  needs: ChampionNeed[];
  weaknesses: ChampionWeakness[];
  playerScaling?: ChampionPlayerScaling;
  carryProfile?: ChampionCarryProfile;
  roleProfiles?: ChampionRoleProfile[];
  championTags?: string[];
};
