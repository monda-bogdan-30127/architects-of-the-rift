// ═══════════════════════════════════════════════════════════════════════════
// MVP Storage
//
// Persists Game MVP and Series MVP counts per player across games / series
// in localStorage. Used by the roster page to display both totals.
//
// FILE: app/draft-engine/mvpStorage.ts
// ═══════════════════════════════════════════════════════════════════════════

const MVP_STORAGE_KEY = "rift-player-mvp-stats";

export type MvpRecord = {
  gameMvps:   number;
  seriesMvps: number;
};

type MvpStore = Record<string, MvpRecord>;

// ── Internal store I/O ───────────────────────────────────────────────────────

function readStore(): MvpStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(MVP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    // Migrate legacy shape (Record<string, number>) → new shape
    const out: MvpStore = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (typeof value === "number") {
        out[id] = { gameMvps: value, seriesMvps: 0 };
      } else if (value && typeof value === "object") {
        const v = value as Partial<MvpRecord>;
        out[id] = {
          gameMvps:   typeof v.gameMvps   === "number" ? v.gameMvps   : 0,
          seriesMvps: typeof v.seriesMvps === "number" ? v.seriesMvps : 0,
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

function writeStore(store: MvpStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MVP_STORAGE_KEY, JSON.stringify(store));
}

function ensureRecord(store: MvpStore, playerId: string): MvpRecord {
  if (!store[playerId]) store[playerId] = { gameMvps: 0, seriesMvps: 0 };
  return store[playerId];
}

// ── Recording APIs ───────────────────────────────────────────────────────────

/**
 * Increment the Game MVP count for a player.
 * Call this after each game with the `mvpPlayerId` returned by the simulator.
 */
export function recordPlayerGameMvp(playerId: string): void {
  if (!playerId) return;
  const store = readStore();
  ensureRecord(store, playerId).gameMvps += 1;
  writeStore(store);
}

/**
 * Increment the Series MVP count for a player.
 * Call this once at the end of each series with the result of `computeSeriesMvp`.
 */
export function recordPlayerSeriesMvp(playerId: string): void {
  if (!playerId) return;
  const store = readStore();
  ensureRecord(store, playerId).seriesMvps += 1;
  writeStore(store);
}

// ── Read APIs ────────────────────────────────────────────────────────────────

export function getPlayerGameMvpCount(playerId: string): number {
  return readStore()[playerId]?.gameMvps ?? 0;
}

export function getPlayerSeriesMvpCount(playerId: string): number {
  return readStore()[playerId]?.seriesMvps ?? 0;
}

export function getPlayerMvpStats(playerId: string): MvpRecord {
  return readStore()[playerId] ?? { gameMvps: 0, seriesMvps: 0 };
}

/** Get all MVP records as a Map. Useful for batch lookup in lists/tables. */
export function getAllMvpStats(): Map<string, MvpRecord> {
  return new Map(Object.entries(readStore()));
}

/** Reset all MVP records (call when starting a fresh save / draft). */
export function clearMvpStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MVP_STORAGE_KEY);
}

// ── Series MVP computation ───────────────────────────────────────────────────

export type SeriesGameSummary = {
  /** mvpPlayerId returned by simulateMatch for that game (may be null). */
  mvpPlayerId: string | null;
  /** Per-player scores returned by simulateMatch for that game. */
  playerScores: Array<{ playerId: string; score: number; side: "blue" | "red" }>;
  /** Which side won this game. */
  winnerSide: "blue" | "red";
};

/**
 * Compute who should be Series MVP given the games of a series.
 *
 * Only players from the series-winning team are eligible.
 *
 * Rules (in order):
 *   1. Player with most Game MVPs across the series wins.
 *   2. Tiebreak: highest aggregate score across all games.
 *   3. If still tied or no data: returns null.
 */
export function computeSeriesMvp(games: SeriesGameSummary[]): string | null {
  if (!games || games.length === 0) return null;

  // Determine which side won the series (most game wins)
  let blueWins = 0;
  let redWins = 0;
  for (const game of games) {
    if (game.winnerSide === "blue") blueWins++;
    else redWins++;
  }
  const seriesWinningSide: "blue" | "red" = blueWins >= redWins ? "blue" : "red";

  // Collect IDs of players on the winning side across all games of the series
  const winningPlayerIds = new Set<string>();
  for (const game of games) {
    for (const entry of game.playerScores ?? []) {
      if (entry.side === seriesWinningSide) {
        winningPlayerIds.add(entry.playerId);
      }
    }
  }

  const gameMvpCount = new Map<string, number>();
  const totalScore   = new Map<string, number>();

  for (const game of games) {
    // Only count Game MVPs from the winning team
    if (game.mvpPlayerId && winningPlayerIds.has(game.mvpPlayerId)) {
      gameMvpCount.set(game.mvpPlayerId, (gameMvpCount.get(game.mvpPlayerId) ?? 0) + 1);
    }
    for (const entry of game.playerScores ?? []) {
      if (!entry?.playerId || typeof entry.score !== "number") continue;
      // Only track scores for winning-team players
      if (!winningPlayerIds.has(entry.playerId)) continue;
      totalScore.set(entry.playerId, (totalScore.get(entry.playerId) ?? 0) + entry.score);
    }
  }

  // Pool: anyone on winning team with at least one game MVP; fallback to all winning-team players
  const candidates = gameMvpCount.size > 0
    ? [...gameMvpCount.keys()]
    : [...totalScore.keys()];

  if (candidates.length === 0) return null;

  let best: string | null = null;
  let bestMvps  = -1;
  let bestScore = -Infinity;

  for (const id of candidates) {
    const mvps  = gameMvpCount.get(id) ?? 0;
    const score = totalScore.get(id) ?? 0;
    if (mvps > bestMvps || (mvps === bestMvps && score > bestScore)) {
      best      = id;
      bestMvps  = mvps;
      bestScore = score;
    }
  }

  return best;
}

/**
 * Convenience: compute the series MVP from the games and record it in storage.
 * Call this once when a series finishes.
 *
 * @returns the playerId that was awarded Series MVP, or null if none.
 */
export function recordSeriesMvpFromGames(games: SeriesGameSummary[]): string | null {
  const mvpId = computeSeriesMvp(games);
  if (mvpId) recordPlayerSeriesMvp(mvpId);
  return mvpId;
}

// ── Per-series accumulator ───────────────────────────────────────────────────
// Tracks games as they complete within a series so Series MVP can be computed
// automatically when the last game finishes — works for any caller (player
// match, AI vs AI match) without needing to track series state externally.

const SERIES_PROGRESS_KEY = "rift-series-mvp-progress";

type SeriesProgressStore = Record<string, SeriesGameSummary[]>;

function readSeriesProgress(): SeriesProgressStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SERIES_PROGRESS_KEY);
    return raw ? JSON.parse(raw) as SeriesProgressStore : {};
  } catch {
    return {};
  }
}

function writeSeriesProgress(store: SeriesProgressStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SERIES_PROGRESS_KEY, JSON.stringify(store));
}

/**
 * Append a single game's summary to a series and, when the series finishes,
 * automatically compute + record the Series MVP and clear the accumulator.
 *
 * Pass `seriesComplete: true` on the last game of the series.
 *
 * @returns the playerId awarded Series MVP if seriesComplete was true, else null.
 */
export function trackSeriesGame(
  seriesId: string,
  game: SeriesGameSummary,
  seriesComplete: boolean,
): string | null {
  if (!seriesId) return null;

  const store = readSeriesProgress();
  const games = store[seriesId] ?? [];
  games.push(game);
  store[seriesId] = games;

  if (!seriesComplete) {
    writeSeriesProgress(store);
    return null;
  }

  // Series done: compute + record + clear
  const mvpId = recordSeriesMvpFromGames(games);
  delete store[seriesId];
  writeSeriesProgress(store);
  return mvpId;
}

/** Clear the per-series progress accumulator (call on fresh save / reset). */
export function clearSeriesProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SERIES_PROGRESS_KEY);
}