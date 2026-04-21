// ═══════════════════════════════════════════════════════════════════════════
// KDA Storage
//
// Persists average KDA per player across games in localStorage.
// Used by the roster page to display "KDA: 3.6" next to each player.
//
// NEW FILE: place in app/draft-engine/kdaStorage.ts
// ═══════════════════════════════════════════════════════════════════════════

const KDA_STORAGE_KEY = "rift-player-kda-stats";

type PlayerKdaRecord = {
  games: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
};

type KdaStore = Record<string, PlayerKdaRecord>;

function readStore(): KdaStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KDA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: KdaStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KDA_STORAGE_KEY, JSON.stringify(store));
}

/**
 * Record a player's KDA from a completed game.
 * Called after each simulation.
 */
export function recordPlayerKda(
  playerId: string,
  kills: number,
  deaths: number,
  assists: number
): void {
  const store = readStore();
  const existing = store[playerId] ?? { games: 0, totalKills: 0, totalDeaths: 0, totalAssists: 0 };

  existing.games += 1;
  existing.totalKills += kills;
  existing.totalDeaths += deaths;
  existing.totalAssists += assists;

  store[playerId] = existing;
  writeStore(store);
}

/**
 * Get the average KDA ratio for a player across all games.
 * Returns (totalK + totalA) / totalD as a single number (e.g. 3.6).
 * Returns null if player has no recorded games.
 */
export function getPlayerAverageKda(playerId: string): number | null {
  const store = readStore();
  const record = store[playerId];
  if (!record || record.games === 0) return null;

  if (record.totalDeaths === 0) {
    return Math.round((record.totalKills + record.totalAssists) * 10) / 10;
  }

  return Math.round(((record.totalKills + record.totalAssists) / record.totalDeaths) * 10) / 10;
}

/**
 * Get full KDA breakdown for a player.
 * Returns { avgKills, avgDeaths, avgAssists, kdaRatio, games }.
 */
export function getPlayerKdaBreakdown(playerId: string): {
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  kdaRatio: number;
  games: number;
} | null {
  const store = readStore();
  const record = store[playerId];
  if (!record || record.games === 0) return null;

  const avgKills = Math.round((record.totalKills / record.games) * 10) / 10;
  const avgDeaths = Math.round((record.totalDeaths / record.games) * 10) / 10;
  const avgAssists = Math.round((record.totalAssists / record.games) * 10) / 10;

  const kdaRatio = record.totalDeaths === 0
    ? Math.round((record.totalKills + record.totalAssists) * 10) / 10
    : Math.round(((record.totalKills + record.totalAssists) / record.totalDeaths) * 10) / 10;

  return { avgKills, avgDeaths, avgAssists, kdaRatio, games: record.games };
}

/**
 * Batch record KDAs from a completed game simulation.
 */
export function recordGameKdas(
  playerScores: Array<{ playerId: string; kills: number; deaths: number; assists: number }>
): void {
  for (const entry of playerScores) {
    recordPlayerKda(entry.playerId, entry.kills, entry.deaths, entry.assists);
  }
}
