// Stats-urile vechi ale jucătorului (`player.stats`: mec, mac, tfg, clt, con, iq) sunt pe scala 10–100. Scorurile de
// simulare și de draft sunt pe 0–10: orice formulă care le amestecă le citește prin helper-ele de aici. (Fără ele,
// toate cele 6 scoruri player*Score, fit-ul jucător–campion și star power ieșeau 10 la toți jucătorii.)
//
// Afișarea în UI și locurile gândite explicit pe 10–100 (rosterPoints, OVR-ul de mastery, multiplicatorul de skill
// la matchup-urile de level 1) citesc în continuare `player.stats` direct.

import type { Player, PlayerStats } from "@/app/types/player";

/** Un stat vechi pe scala 0–10. */
export function legacyStatScore(player: Pick<Player, "stats"> | null | undefined, key: keyof PlayerStats, fallback = 5): number {
  const value = player?.stats?.[key];
  return typeof value === "number" ? value / 10 : fallback;
}

/** Toate stats-urile vechi pe scala 0–10 (pentru funcțiile care primesc obiectul întreg). */
export function normalizeLegacyStats(stats: PlayerStats): PlayerStats {
  return Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, typeof value === "number" ? value / 10 : value])) as PlayerStats;
}
