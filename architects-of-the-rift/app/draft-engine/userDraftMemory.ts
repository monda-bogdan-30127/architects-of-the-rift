import { champions } from "@/app/data/champions";
import type { Champion, Role } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";

const USER_DRAFT_MEMORY_KEY = "rift-user-draft-memory-v1";
const championMap = new Map(champions.map((champion) => [champion.id, champion]));

type CounterMap = Record<string, number>;

type StoredUserDraftMemory = {
  version: 1;
  totalGames: number;
  firstPickCounts: CounterMap;
  firstPickRoleCounts: CounterMap;
  overallPickCounts: CounterMap;
  banCounts: CounterMap;
  compIdentityCounts: CounterMap;
  recentFirstPicks: string[];
  recentBans: string[];
  recentCompIdentities: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createDefaultMemory(): StoredUserDraftMemory {
  return {
    version: 1,
    totalGames: 0,
    firstPickCounts: {},
    firstPickRoleCounts: {},
    overallPickCounts: {},
    banCounts: {},
    compIdentityCounts: {},
    recentFirstPicks: [],
    recentBans: [],
    recentCompIdentities: [],
  };
}

function incrementCounter(map: CounterMap, key: string | null | undefined, amount = 1) {
  if (!key) return;
  map[key] = (map[key] ?? 0) + amount;
}

function pushRecent(list: string[], value: string | null | undefined, maxSize: number) {
  if (!value) return list;
  const next = [value, ...list.filter((entry) => entry !== value)];
  return next.slice(0, maxSize);
}

function readMemory(): StoredUserDraftMemory {
  if (typeof window === "undefined") return createDefaultMemory();

  try {
    const raw = window.localStorage.getItem(USER_DRAFT_MEMORY_KEY);
    if (!raw) return createDefaultMemory();
    const parsed = JSON.parse(raw) as Partial<StoredUserDraftMemory>;
    return {
      ...createDefaultMemory(),
      ...parsed,
      version: 1,
    };
  } catch {
    return createDefaultMemory();
  }
}

function writeMemory(memory: StoredUserDraftMemory) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_DRAFT_MEMORY_KEY, JSON.stringify(memory));
}

function getSideCollections(game: DraftGameState, side: Side) {
  return {
    picks: side === "blue" ? game.picksBlue : game.picksRed,
    bans: side === "blue" ? game.bansBlue : game.bansRed,
    evaluation: side === "blue" ? game.evaluationBlue : game.evaluationRed,
  };
}

function getChampionPrimaryRole(championId: string): Role | null {
  const champion = championMap.get(championId);
  if (!champion || champion.roles.length === 0) return null;
  return (champion.roles[0] ?? null) as Role | null;
}

function getRolePressureFromMemory(candidate: Champion, memory: StoredUserDraftMemory) {
  const sortedRoles = Object.entries(memory.firstPickRoleCounts).sort((a, b) => b[1] - a[1]);
  const [topRole, topCount] = sortedRoles[0] ?? [];
  if (!topRole || typeof topCount !== "number" || topCount <= 0) return 0;
  if (!candidate.roles.includes(topRole as Role)) return 0;

  const totalRoleSamples = Object.values(memory.firstPickRoleCounts).reduce((sum, value) => sum + value, 0);
  if (totalRoleSamples <= 0) return 0;
  return clamp((topCount / totalRoleSamples) * 3.4, 0, 2.6);
}

function getCurrentSeriesUserCounts(series: ActiveDraftSeries) {
  const firstPickCounts: CounterMap = {};
  const overallPickCounts: CounterMap = {};
  const banCounts: CounterMap = {};

  for (const draftGame of series.games) {
    if (!draftGame.completed) continue;
    const collections = getSideCollections(draftGame, series.userSide);
    incrementCounter(firstPickCounts, collections.picks[0]);
    collections.picks.forEach((championId) => incrementCounter(overallPickCounts, championId));
    collections.bans.forEach((championId) => incrementCounter(banCounts, championId));
  }

  return { firstPickCounts, overallPickCounts, banCounts };
}

export function recordCompletedUserDraftGame(series: ActiveDraftSeries, completedGame: DraftGameState) {
  if (!completedGame.completed) return;

  const memory = readMemory();
  const collections = getSideCollections(completedGame, series.userSide);
  const firstPickId = collections.picks[0] ?? null;
  const firstPickRole = getChampionPrimaryRole(firstPickId ?? "");
  const compIdentity = collections.evaluation?.compIdentity ?? null;

  memory.totalGames += 1;
  incrementCounter(memory.firstPickCounts, firstPickId);
  incrementCounter(memory.firstPickRoleCounts, firstPickRole);
  collections.picks.forEach((championId) => incrementCounter(memory.overallPickCounts, championId));
  collections.bans.forEach((championId) => incrementCounter(memory.banCounts, championId));
  incrementCounter(memory.compIdentityCounts, compIdentity);

  memory.recentFirstPicks = pushRecent(memory.recentFirstPicks, firstPickId, 8);
  memory.recentBans = collections.bans
    .slice(0, 5)
    .reduce((acc, championId) => pushRecent(acc, championId, 12), memory.recentBans);
  memory.recentCompIdentities = pushRecent(memory.recentCompIdentities, compIdentity, 8);

  writeMemory(memory);
}

export function getUserBanTargetBias(candidate: Champion, aiSide: Side, series: ActiveDraftSeries) {
  const enemySide: Side = aiSide === "blue" ? "red" : "blue";
  if (enemySide !== series.userSide) return 0;

  const memory = readMemory();
  const currentSeriesCounts = getCurrentSeriesUserCounts(series);
  const totalGames = Math.max(memory.totalGames, 1);

  const firstPickCount = (memory.firstPickCounts[candidate.id] ?? 0) + (currentSeriesCounts.firstPickCounts[candidate.id] ?? 0) * 1.25;
  const overallPickCount = (memory.overallPickCounts[candidate.id] ?? 0) + (currentSeriesCounts.overallPickCounts[candidate.id] ?? 0) * 0.8;
  const recentFirstPickHit = memory.recentFirstPicks.includes(candidate.id) ? 1.5 : 0;
  const recentBanHit = memory.recentBans.includes(candidate.id) ? 0.7 : 0;
  const rolePressure = getRolePressureFromMemory(candidate, memory);

  const firstPickRate = firstPickCount / totalGames;
  const overallRate = overallPickCount / (totalGames * 5);

  return clamp(firstPickRate * 8.5 + overallRate * 10 + recentFirstPickHit + recentBanHit + rolePressure, 0, 8.5);
}
