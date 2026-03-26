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

export type Player = {
  id: string;
  slug: string;
  name: string;
  teamId: string;
  role: Role;
  image: string;
  stats: PlayerStats;
  bestChampions: string[];
  comfortChampions: string[];
  championPool: string[];
  rosterPoints: number;
  sortOrder: number;
};
