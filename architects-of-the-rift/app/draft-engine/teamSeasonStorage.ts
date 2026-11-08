// Statistici de sezon pe echipă (DRAFT_THINKING §7.2): campionii cu care joacă și
// câștigă fiecare echipă și identitățile compozițiilor. Același tipar ca
// playerSeasonStorage (batch, guard pe `window`, normalizare în storageMigration).

import type { Role } from "@/app/types/champion";
import type { CompIdentity } from "./compIdentity";
import { normalizeTeamSeasonStore } from "./storageMigration";

export type TeamChampionLine = {
  games: number;
  wins: number;
  byRole: Partial<Record<Role, number>>;
  /** Ultimele 5 rezultate, 1 = victorie, 0 = înfrângere (cel mai recent la final). */
  recentResults: number[];
};

export type TeamSeasonRecord = {
  games: number;
  wins: number;
  champions: Record<string, TeamChampionLine>;
  identities: Partial<Record<CompIdentity | "balanced", { games: number; wins: number }>>;
};

export type TeamSeasonStore = Record<string /* teamSlug */, TeamSeasonRecord>;

export type TeamSeasonGame = {
  teamSlug: string;
  assignments: Partial<Record<Role, string>>;
  won: boolean;
  compIdentity: CompIdentity | "balanced";
};

export const TEAM_SEASON_STORAGE_KEY = "rift-team-season-champions";
const RECENT_RESULTS = 5;

let batchDepth = 0;
let pendingGames: TeamSeasonGame[] = [];
/** Doar pentru scripturi (Node, fără localStorage): un store fix în memorie. */
let storeOverride: TeamSeasonStore | null = null;

export function setTeamSeasonStoreOverride(store: TeamSeasonStore | null) {
  storeOverride = store;
}

export function emptyTeamSeasonRecord(): TeamSeasonRecord {
  return { games: 0, wins: 0, champions: {}, identities: {} };
}

// Draftul citește store-ul de multe ori pe tură: parsat o dată per conținut.
let cachedRaw: string | null = null;
let cachedStore: TeamSeasonStore = {};

export function readTeamSeasonStore(): TeamSeasonStore {
  if (storeOverride) return storeOverride;
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(TEAM_SEASON_STORAGE_KEY);
  if (!raw) return {};
  if (raw === cachedRaw) return cachedStore;
  try {
    cachedStore = normalizeTeamSeasonStore(JSON.parse(raw));
    cachedRaw = raw;
    return cachedStore;
  } catch {
    return {};
  }
}

function saveTeamSeasonStore(store: TeamSeasonStore) {
  if (storeOverride) return;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEAM_SEASON_STORAGE_KEY, JSON.stringify(normalizeTeamSeasonStore(store)));
}

function applyGame(store: TeamSeasonStore, game: TeamSeasonGame) {
  const record = (store[game.teamSlug] ??= emptyTeamSeasonRecord());
  record.games += 1;
  if (game.won) record.wins += 1;
  for (const [role, championId] of Object.entries(game.assignments) as [Role, string | undefined][]) {
    if (!championId) continue;
    const line = (record.champions[championId] ??= { games: 0, wins: 0, byRole: {}, recentResults: [] });
    line.games += 1;
    if (game.won) line.wins += 1;
    line.byRole[role] = (line.byRole[role] ?? 0) + 1;
    line.recentResults = [...line.recentResults, game.won ? 1 : 0].slice(-RECENT_RESULTS);
  }
  const identity = (record.identities[game.compIdentity] ??= { games: 0, wins: 0 });
  identity.games += 1;
  if (game.won) identity.wins += 1;
}

/** Înregistrează jocurile (ambele echipe); în batch, se scriu la `flushTeamSeasonBatch`. */
export function recordTeamSeasonGames(games: TeamSeasonGame[]) {
  if (!games.length) return;
  if (batchDepth > 0) {
    pendingGames.push(...games);
    return;
  }
  if (typeof window === "undefined" && !storeOverride) return;
  const store = readTeamSeasonStore();
  for (const game of games) applyGame(store, game);
  saveTeamSeasonStore(store);
}

export function beginTeamSeasonBatch() {
  batchDepth += 1;
}

export function flushTeamSeasonBatch() {
  if (batchDepth === 0) return;
  batchDepth -= 1;
  if (batchDepth > 0 || pendingGames.length === 0) return;
  const games = pendingGames;
  pendingGames = [];
  recordTeamSeasonGames(games);
}

export function resetTeamSeasonStore() {
  batchDepth = 0;
  pendingGames = [];
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEAM_SEASON_STORAGE_KEY);
}
