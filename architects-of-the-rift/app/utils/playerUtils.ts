import type { PlayerStats } from "../types/player";
import type { ChampionPlayerScaling } from "../types/champion";

export function calculateRosterPoints(stats: PlayerStats): number {
  const score =
    (stats.mec * 1.2 +
      stats.mac * 1.1 +
      stats.tfg * 1.2 +
      stats.clt * 1.0 +
      stats.con * 1.1 +
      stats.iq * 1.0) /
    6.6;

  return Math.round(score);
}

export function calculateChampionFit(
  playerStats: PlayerStats,
  scaling?: ChampionPlayerScaling
): number {
  if (!scaling) {
    return 0;
  }

  let score = 0;

  if (scaling.mec) score += playerStats.mec * scaling.mec;
  if (scaling.mac) score += playerStats.mac * scaling.mac;
  if (scaling.tfg) score += playerStats.tfg * scaling.tfg;
  if (scaling.clt) score += playerStats.clt * scaling.clt;
  if (scaling.con) score += playerStats.con * scaling.con;
  if (scaling.iq) score += playerStats.iq * scaling.iq;

  return Number(score.toFixed(2));
}