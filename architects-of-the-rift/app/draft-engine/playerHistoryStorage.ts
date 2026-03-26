import { makeSafeStatLine, normalizePlayerHistoryStore } from "./storageMigration";
import type { Role } from "@/app/types/champion";
import type {
  PlayerHistoryRecord,
  PlayerHistoryStatLine,
  PlayerHistoryStore,
  ResolvedHistoryGameInput,
} from "./playerHistoryTypes";
import { ROLE_ORDER } from "./draftTypes";

export const PLAYER_HISTORY_STORAGE_KEY = "rift-player-history";
const RECENT_WINDOW = 6;

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

function emptyRecord(): PlayerHistoryRecord {
  return {
    champions: {},
    matchups: {},
  };
}

function getLocalStorageSafe(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
}

export function readPlayerHistoryStore(): PlayerHistoryStore {
  const storage = getLocalStorageSafe();
  if (!storage) return {};

  try {
    const raw = storage.getItem(PLAYER_HISTORY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return normalizePlayerHistoryStore(parsed);
  } catch {
    return {};
  }
}

export function writePlayerHistoryStore(store: PlayerHistoryStore) {
  const storage = getLocalStorageSafe();
  if (!storage) return;

  try {
    storage.setItem(PLAYER_HISTORY_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore write failures
  }
}

export function resetPlayerHistoryStore() {
  const storage = getLocalStorageSafe();
  if (!storage) return;
  storage.removeItem(PLAYER_HISTORY_STORAGE_KEY);
}

export function buildChampionMatchupKey(championId: string, enemyChampionId: string) {
  return `${championId}__vs__${enemyChampionId}`;
}

function ensurePlayerRecord(store: PlayerHistoryStore, playerId: string): PlayerHistoryRecord {
  if (!store[playerId]) {
    store[playerId] = emptyRecord();
  }
  return store[playerId];
}

function ensureStatLine(record: Record<string, PlayerHistoryStatLine>, key: string): PlayerHistoryStatLine {
  const existing = record[key];

  if (!existing) {
    record[key] = emptyStatLine();
    return record[key];
  }

  const normalized = makeSafeStatLine(existing);
  record[key] = normalized;
  return normalized;
}

function pushRecentValue<T>(values: T[] | undefined, next: T, limit = RECENT_WINDOW) {
  if (!Array.isArray(values)) return;
  values.push(next);
  if (values.length > limit) {
    values.splice(0, values.length - limit);
  }
}

function updateStatLine(
  record: Record<string, PlayerHistoryStatLine>,
  key: string,
  didWin: boolean,
  score: number,
  stamp: number
) {
  const line = ensureStatLine(record, key);
  line.games += 1;
  if (didWin) line.wins += 1;
  line.scoreSum += Number.isFinite(score) ? score : 0;
  pushRecentValue(line.recentScores, Number.isFinite(score) ? score : 0);
  pushRecentValue(line.recentResults, didWin ? 1 : 0);
  line.lastUpdatedAt = stamp;
}

function withDefaults(line?: Partial<PlayerHistoryStatLine> | null): PlayerHistoryStatLine {
  return makeSafeStatLine(line);
}

export function getPlayerChampionHistoryLine(
  store: PlayerHistoryStore,
  playerId: string | null | undefined,
  championId: string | null | undefined
): PlayerHistoryStatLine {
  if (!playerId || !championId) return emptyStatLine();
  return withDefaults(store[playerId]?.champions?.[championId]);
}

export function getPlayerChampionMatchupHistoryLine(
  store: PlayerHistoryStore,
  playerId: string | null | undefined,
  championId: string | null | undefined,
  enemyChampionId: string | null | undefined
): PlayerHistoryStatLine {
  if (!playerId || !championId || !enemyChampionId) return emptyStatLine();
  return withDefaults(
    store[playerId]?.matchups?.[buildChampionMatchupKey(championId, enemyChampionId)]
  );
}

export function updatePlayerHistoryFromResolvedGame(input: ResolvedHistoryGameInput) {
  const store = readPlayerHistoryStore();
  const scoreMap = new Map<string, number>();
  const stamp = input.gameNumber ?? Date.now();

  for (const entry of input.playerScores ?? []) {
    if (!entry?.playerId) continue;
    scoreMap.set(entry.playerId, Number.isFinite(entry.score) ? entry.score : 0);
  }

  for (const role of ROLE_ORDER) {
    const bluePlayerId = input.blueRoster[role] ?? null;
    const redPlayerId = input.redRoster[role] ?? null;
    const blueChampionId = input.assignmentsBlue[role] ?? null;
    const redChampionId = input.assignmentsRed[role] ?? null;

    if (bluePlayerId && blueChampionId) {
      const record = ensurePlayerRecord(store, bluePlayerId);
      const blueScore = scoreMap.get(bluePlayerId) ?? 0;
      updateStatLine(record.champions, blueChampionId, input.winnerSide === "blue", blueScore, stamp);
      if (redChampionId) {
        updateStatLine(
          record.matchups,
          buildChampionMatchupKey(blueChampionId, redChampionId),
          input.winnerSide === "blue",
          blueScore,
          stamp
        );
      }
    }

    if (redPlayerId && redChampionId) {
      const record = ensurePlayerRecord(store, redPlayerId);
      const redScore = scoreMap.get(redPlayerId) ?? 0;
      updateStatLine(record.champions, redChampionId, input.winnerSide === "red", redScore, stamp);
      if (blueChampionId) {
        updateStatLine(
          record.matchups,
          buildChampionMatchupKey(redChampionId, blueChampionId),
          input.winnerSide === "red",
          redScore,
          stamp
        );
      }
    }
  }

  writePlayerHistoryStore(store);
}