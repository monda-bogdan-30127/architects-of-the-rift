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
  { championIds: ["ezreal", "soraka"], score: 3.0 },
  // Ezreal + Yuumi: double disengage, zero lane pressure
  { championIds: ["ezreal", "yuumi"], score: 4.0 },

  // Jhin + Braum: Jhin kites with slows, Braum wants melee range — conflicting ranges
  { championIds: ["jhin", "braum"], score: 2.5 },
  // Jhin + Lulu: Jhin is a carry, Lulu scales with carries — but Jhin doesn't want shields at range
  { championIds: ["jhin", "lulu"], score: 2.0 },

  // Kogmaw + Rell: Rell has no peel, Kog needs peel — pure offensive support for hyperscale carry
  { championIds: ["kog-maw", "rell"], score: 3.5 },
  // Kogmaw + Leona: same — Kog wants protection, Leona brings none
  { championIds: ["kog-maw", "leona"], score: 3.5 },
  // Kogmaw + Thresh: Thresh engage doesn't protect Kog properly
  { championIds: ["kog-maw", "thresh"], score: 2.5 },
  // Kogmaw + Pyke: Pyke is a roamer, abandons Kog
  { championIds: ["kog-maw", "pyke"], score: 4.0 },

  // Senna + Tahm Kench: Senna needs souls, Tahm W removes her from farm
  { championIds: ["senna", "tahm-kench"], score: 3.0 },

  // Zeri + Yuumi: Zeri already has mobility, Yuumi adds nothing structural
  { championIds: ["zeri", "yuumi"], score: 3.0 },
  // Zeri + Rell: no shielding, Zeri wants enchanter shell
  { championIds: ["zeri", "rell"], score: 2.5 },

  // Vayne + Pyke: Pyke roams, Vayne needs lane farm
  { championIds: ["vayne", "pyke"], score: 3.5 },

  // Aphelios + Leona: Aphelios needs peel for scaling, Leona is pure engage
  { championIds: ["aphelios", "leona"], score: 2.5 },

  // Jinx + Pyke: Jinx wants safety, Pyke roams away
  { championIds: ["jinx", "pyke"], score: 3.0 },

  // Twitch + any non-engage support: Twitch needs engage to unlock stealth value
  { championIds: ["twitch", "soraka"], score: 3.5 },
  { championIds: ["twitch", "lulu"], score: 3.0 },
  { championIds: ["twitch", "yuumi"], score: 4.0 },

  // ─── Mid-jungle anti-synergies ────────────────────────────────────────────
  // Heavy AP mid + AP jungle without tank/bruiser = no frontline
  { championIds: ["syndra", "lillia"], score: 2.0 },
  { championIds: ["orianna", "karthus"], score: 2.0 },

  // ─── Top-jungle anti-synergies ────────────────────────────────────────────
  // Double scaling, no early pressure
  { championIds: ["kayle", "master-yi"], score: 2.5 },
  { championIds: ["nasus", "kayle"], score: 3.0 },

  // ─── Comp-breaking combos ─────────────────────────────────────────────────
  // Two hard engages in bot + jg = overcommit, no disengage
  { championIds: ["leona", "vi"], score: 1.5 },
  { championIds: ["nautilus", "sejuani"], score: 1.5 },

  // Two enchanters (support + mid/top) without carry = no damage ceiling
  { championIds: ["lulu", "karma"], score: 2.0 },
  { championIds: ["soraka", "karma"], score: 2.5 },
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