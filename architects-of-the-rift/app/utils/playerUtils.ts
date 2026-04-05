import type { PlayerStats } from "@/app/types/player";
import type { ChampionPlayerScaling } from "@/app/types/champion";

export function calculateRosterPoints(stats: PlayerStats): number {
  const normalize = (value: number) => value / 10;

  const score =
    (normalize(stats.mec) * 1.2 +
      normalize(stats.mac) * 1.1 +
      normalize(stats.tfg) * 1.2 +
      normalize(stats.clt) * 1.0 +
      normalize(stats.con) * 1.1 +
      normalize(stats.iq) * 1.0) /
    6.6;

  return Math.max(1, Math.min(10, Math.round(score)));
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
