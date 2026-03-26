// Auto-generated from Winter 2026 pro patch 16.5 data provided by the user.

import type { CompAttribute } from './compAttributes';

export type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support';

export type DamageType = 'AD' | 'AP' | 'TRUE';

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
};
