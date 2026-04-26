// ═══════════════════════════════════════════════════════════════════════════
// Bad Synergy Data
//
// Champion combinations that look good on paper but don't work in pro play.
// These are subtracted from getCompSynergyScore.
//
// Each entry: [championA, championB, penaltyScore]
// penaltyScore is the amount to subtract when both champions are on the same team.
//
// Add entries as you find more problematic combos during playtesting.
// Order doesn't matter — the lookup is symmetric.
// ═══════════════════════════════════════════════════════════════════════════

export type BadSynergyEntry = {
  championIds: [string, string];
  score: number; // how much to subtract from synergy (positive number)
};

export const BAD_SYNERGIES: BadSynergyEntry[] = [
  // ─── Bot lane anti-synergies ──────────────────────────────────────────────
  // Ezreal + Lulu: both defensive, no engage, no win condition in teamfights
  { championIds: ["ezreal", "lulu"], score: 3.5 },
  // Ezreal + Soraka: same problem, too passive, no lane presence
  // Ezreal + Yuumi: double disengage, zero lane pressure
  { championIds: ["seraphine", "yunara"], score: 3.0 },

  // Jhin + Braum: Jhin kites with slows, Braum wants melee range — conflicting ranges
  { championIds: ["jhin", "braum"], score: 2.5 },
  { championIds: ["ziggs", "lulu"], score: 3.0 },
  // Jhin + Lulu: Jhin is a carry, Lulu scales with carries — but Jhin doesn't want shields at range
  { championIds: ["jhin", "lulu"], score: 2.0 },

  // Kogmaw + Pyke: Pyke is a roamer, abandons Kog
  { championIds: ["kog-maw", "pyke"], score: 4.0 },

  // Zeri + Rell: no shielding, Zeri wants enchanter shell
  { championIds: ["zeri", "rell"], score: 2.5 },

  // Vayne + Pyke: Pyke roams, Vayne needs lane farm
  { championIds: ["vayne", "pyke"], score: 3.5 },

  // Jinx + Pyke: Jinx wants safety, Pyke roams away
  { championIds: ["jinx", "pyke"], score: 3.0 },

  // ─── Mid-jungle anti-synergies ────────────────────────────────────────────
  // Heavy AP mid + AP jungle without tank/bruiser = no frontline
  { championIds: ["syndra", "lillia"], score: 2.0 },
  { championIds: ["orianna", "karthus"], score: 2.0 },

  // ─── Top-jungle anti-synergies ────────────────────────────────────────────
  // Double scaling, no early pressure
  { championIds: ["kayle", "master-yi"], score: 2.5 },
  { championIds: ["nasus", "kayle"], score: 3.0 },
];

// Build a fast lookup map at module load time
const badSynergyMap: Map<string, number> = new Map();
for (const entry of BAD_SYNERGIES) {
  const [a, b] = entry.championIds;
  // Store both directions for symmetric lookup
  badSynergyMap.set(`${a}:${b}`, entry.score);
  badSynergyMap.set(`${b}:${a}`, entry.score);
}

/**
 * Returns the bad synergy penalty between two champions.
 * Returns 0 if they have no known anti-synergy.
 */
export function getBadSynergyPenalty(championIdA: string, championIdB: string): number {
  return badSynergyMap.get(`${championIdA}:${championIdB}`) ?? 0;
}

/**
 * Given a candidate champion and existing picks, returns total bad synergy
 * penalty. Used in getCompSynergyScore to subtract from raw synergy.
 */
export function getTotalBadSynergy(candidateId: string, existingPicks: string[]): number {
  let total = 0;
  for (const pickedId of existingPicks) {
    total += getBadSynergyPenalty(candidateId, pickedId);
  }
  return total;
}