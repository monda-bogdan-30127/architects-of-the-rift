import type {
  PlayerHistoryRecord,
  PlayerHistoryStatLine,
  PlayerHistoryStore,
} from "./playerHistoryTypes";
import type { PlayerSeasonStore, PlayerGameLog } from "./playerSeasonStorage";
import type { ActiveDraftSeries } from "./draftTypes";
import type { TeamChampionLine, TeamSeasonRecord, TeamSeasonStore } from "./teamSeasonStorage";

export const RIFT_STORAGE_VERSION_KEY = "rift-storage-version";
export const RIFT_STORAGE_VERSION = 2;

const PLAYER_HISTORY_KEY = "rift-player-history";
const PLAYER_SEASON_STATS_KEY = "rift-player-season-stats";
const SAVE_KEY = "rift-draft-save";
const SERIES_SAVE_KEY = "rift-series-state";
const ACTIVE_DRAFT_SERIES_KEY = "rift-active-series-draft";
const PLAYER_SPIRIT_KEY = "rift-player-spirit";
const SPIRIT_ACCUMULATOR_KEY = "rift-spirit-accumulator";
const TEAM_SEASON_KEY = "rift-team-season-champions";

/**
 * Seria de draft salvată: completează câmpurile adăugate după ce a fost scrisă
 * (DRAFT_THINKING §1.2: `pickRolesBlue` / `pickRolesRed`, implicit `{}`).
 */
export function normalizeActiveDraftSeries(series: ActiveDraftSeries): ActiveDraftSeries {
  return {
    ...series,
    games: (series.games ?? []).map((game) => ({
      ...game,
      pickRolesBlue: game.pickRolesBlue ?? {},
      pickRolesRed: game.pickRolesRed ?? {},
    })),
  };
}

function localStorageSafe(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
}

function emptyStatLine(): PlayerHistoryStatLine {
  return {
    games: 0,
    wins: 0,
    scoreSum: 0,
    recentScores: [],
    recentResults: [],
    lastUpdatedAt: 0,
  };
}

function normalizeStatLine(line?: Partial<PlayerHistoryStatLine> | null): PlayerHistoryStatLine {
  return {
    games: typeof line?.games === "number" && Number.isFinite(line.games) ? line.games : 0,
    wins: typeof line?.wins === "number" && Number.isFinite(line.wins) ? line.wins : 0,
    scoreSum: typeof line?.scoreSum === "number" && Number.isFinite(line.scoreSum) ? line.scoreSum : 0,
    recentScores: Array.isArray(line?.recentScores) ? line.recentScores.filter((v): v is number => typeof v === "number" && Number.isFinite(v)) : [],
    recentResults: Array.isArray(line?.recentResults) ? line.recentResults.filter((v): v is number => typeof v === "number" && Number.isFinite(v)) : [],
    lastUpdatedAt: typeof line?.lastUpdatedAt === "number" && Number.isFinite(line.lastUpdatedAt) ? line.lastUpdatedAt : 0,
  };
}

function normalizePlayerHistoryRecord(record?: Partial<PlayerHistoryRecord> | null): PlayerHistoryRecord {
  const champions: Record<string, PlayerHistoryStatLine> = {};
  const matchups: Record<string, PlayerHistoryStatLine> = {};

  const rawChampions = record?.champions ?? {};
  if (rawChampions && typeof rawChampions === "object") {
    for (const [key, value] of Object.entries(rawChampions)) {
      champions[key] = normalizeStatLine(value as Partial<PlayerHistoryStatLine>);
    }
  }

  const rawMatchups = record?.matchups ?? {};
  if (rawMatchups && typeof rawMatchups === "object") {
    for (const [key, value] of Object.entries(rawMatchups)) {
      matchups[key] = normalizeStatLine(value as Partial<PlayerHistoryStatLine>);
    }
  }

  return { champions, matchups };
}

export function normalizePlayerHistoryStore(raw: unknown): PlayerHistoryStore {
  if (!raw || typeof raw !== "object") return {};
  const normalized: PlayerHistoryStore = {};
  for (const [playerId, value] of Object.entries(raw as Record<string, unknown>)) {
    normalized[playerId] = normalizePlayerHistoryRecord(value as Partial<PlayerHistoryRecord>);
  }
  return normalized;
}

function normalizeGameLog(raw: Partial<PlayerGameLog> | null | undefined): PlayerGameLog | null {
  if (!raw?.playerId || !raw.teamSlug || !raw.role) return null;
  if (typeof raw.score !== "number" || !Number.isFinite(raw.score)) return null;
  if (raw.side !== "blue" && raw.side !== "red") return null;
  if (raw.result !== "win" && raw.result !== "loss") return null;
  if (typeof raw.bestOf !== "number" || !Number.isFinite(raw.bestOf)) return null;

  return {
    playerId: raw.playerId,
    teamSlug: raw.teamSlug,
    role: raw.role,
    score: raw.score,
    side: raw.side,
    result: raw.result,
    bestOf: raw.bestOf,
  };
}

export function normalizePlayerSeasonStore(raw: unknown): PlayerSeasonStore {
  const logs = Array.isArray((raw as PlayerSeasonStore | null | undefined)?.logs)
    ? ((raw as PlayerSeasonStore).logs.map((entry) => normalizeGameLog(entry)).filter((entry): entry is PlayerGameLog => entry !== null))
    : [];
  return { logs };
}

const finiteCount = (value: unknown) => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0);

/** DRAFT_THINKING §7.2 — store-ul de sezon pe echipă (`rift-team-season-champions`). */
export function normalizeTeamSeasonStore(raw: unknown): TeamSeasonStore {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const store: TeamSeasonStore = {};
  for (const [teamSlug, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const record = value as Partial<TeamSeasonRecord>;
    const champions: Record<string, TeamChampionLine> = {};
    for (const [championId, line] of Object.entries(record.champions ?? {})) {
      if (!line || typeof line !== "object") continue;
      const entry = line as Partial<TeamChampionLine>;
      const byRole: TeamChampionLine["byRole"] = {};
      for (const [role, count] of Object.entries(entry.byRole ?? {})) byRole[role as keyof typeof byRole] = finiteCount(count);
      champions[championId] = {
        games: finiteCount(entry.games),
        wins: finiteCount(entry.wins),
        byRole,
        recentResults: Array.isArray(entry.recentResults) ? entry.recentResults.filter((result) => result === 0 || result === 1).slice(-5) : [],
      };
    }
    const identities: TeamSeasonRecord["identities"] = {};
    for (const [identity, stats] of Object.entries(record.identities ?? {})) {
      if (!stats || typeof stats !== "object") continue;
      identities[identity as keyof typeof identities] = { games: finiteCount(stats.games), wins: finiteCount(stats.wins) };
    }
    store[teamSlug] = { games: finiteCount(record.games), wins: finiteCount(record.wins), champions, identities };
  }
  return store;
}

function normalizeJsonAtKey<T>(storage: Storage, key: string, normalizer: (raw: unknown) => T) {
  const raw = storage.getItem(key);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizer(parsed);
    storage.setItem(key, JSON.stringify(normalized));
  } catch {
    storage.removeItem(key);
  }
}

function validateJsonAtKey(storage: Storage, key: string) {
  const raw = storage.getItem(key);
  if (!raw) return;
  try {
    JSON.parse(raw);
  } catch {
    storage.removeItem(key);
  }
}

export function migrateAllRiftStorage() {
  const storage = localStorageSafe();
  if (!storage) return;

  normalizeJsonAtKey(storage, PLAYER_HISTORY_KEY, normalizePlayerHistoryStore);
  normalizeJsonAtKey(storage, PLAYER_SEASON_STATS_KEY, normalizePlayerSeasonStore);
  normalizeJsonAtKey(storage, TEAM_SEASON_KEY, normalizeTeamSeasonStore);

  validateJsonAtKey(storage, SAVE_KEY);
  validateJsonAtKey(storage, SERIES_SAVE_KEY);
  validateJsonAtKey(storage, ACTIVE_DRAFT_SERIES_KEY);
  validateJsonAtKey(storage, PLAYER_SPIRIT_KEY);
  validateJsonAtKey(storage, SPIRIT_ACCUMULATOR_KEY);

  storage.setItem(RIFT_STORAGE_VERSION_KEY, String(RIFT_STORAGE_VERSION));
}

export function resetRiftStorageVersion() {
  const storage = localStorageSafe();
  if (!storage) return;
  storage.removeItem(RIFT_STORAGE_VERSION_KEY);
}

export function resetSpiritStorage() {
  const storage = localStorageSafe();
  if (!storage) return;
  storage.removeItem(PLAYER_SPIRIT_KEY);
  storage.removeItem(SPIRIT_ACCUMULATOR_KEY);
}

export function makeSafeStatLine(line?: Partial<PlayerHistoryStatLine> | null): PlayerHistoryStatLine {
  return normalizeStatLine(line ?? emptyStatLine());
}