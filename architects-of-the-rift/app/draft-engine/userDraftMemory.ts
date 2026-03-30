import { champions } from "@/app/data/champions";
import type { Champion, Role } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";
import { ROLE_ORDER } from "./draftTypes";
import { resolveRoleAssignments } from "./draftRoleResolver";

const USER_DRAFT_MEMORY_KEY = "rift-user-draft-memory-v2";
const championMap = new Map(champions.map((champion) => [champion.id, champion]));

type CounterMap = Record<string, number>;
type RolePairKey = `${Role}|${Role}`;

type StoredUserDraftMemory = {
  version: 2;
  totalGames: number;
  firstPickCounts: CounterMap;
  firstPickRoleCounts: CounterMap;
  overallPickCounts: CounterMap;
  banCounts: CounterMap;
  compIdentityCounts: CounterMap;
  rolePickCounts: CounterMap;
  rolePairCounts: CounterMap;
  recentFirstPicks: string[];
  recentBans: string[];
  recentCompIdentities: string[];
  recentRoleAssignments: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createDefaultMemory(): StoredUserDraftMemory {
  return {
    version: 2,
    totalGames: 0,
    firstPickCounts: {},
    firstPickRoleCounts: {},
    overallPickCounts: {},
    banCounts: {},
    compIdentityCounts: {},
    rolePickCounts: {},
    rolePairCounts: {},
    recentFirstPicks: [],
    recentBans: [],
    recentCompIdentities: [],
    recentRoleAssignments: [],
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
      version: 2,
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
    assignments: side === "blue" ? game.assignmentsBlue : game.assignmentsRed,
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

  const totalRoleSamples = Object.values(memory.firstPickRoleCounts).reduce(
    (sum, value) => sum + value,
    0
  );

  if (totalRoleSamples <= 0) return 0;
  return clamp((topCount / totalRoleSamples) * 3.4, 0, 2.6);
}

function buildRoleKey(role: Role, championId: string) {
  return `${role}:${championId}`;
}

function buildRolePairKey(firstRole: Role, secondRole: Role): RolePairKey {
  return `${firstRole}|${secondRole}`;
}

function getCurrentSeriesUserCounts(series: ActiveDraftSeries) {
  const firstPickCounts: CounterMap = {};
  const overallPickCounts: CounterMap = {};
  const banCounts: CounterMap = {};
  const rolePickCounts: CounterMap = {};
  const rolePairCounts: CounterMap = {};

  for (const draftGame of series.games) {
    if (!draftGame.completed) continue;

    const collections = getSideCollections(draftGame, series.userSide);
    incrementCounter(firstPickCounts, collections.picks[0]);
    collections.picks.forEach((championId) => incrementCounter(overallPickCounts, championId));
    collections.bans.forEach((championId) => incrementCounter(banCounts, championId));

    const assignments =
      Object.keys(collections.assignments ?? {}).length > 0
        ? collections.assignments
        : resolveRoleAssignments(collections.picks, {});

    for (const role of ROLE_ORDER) {
      const championId = assignments[role];
      if (!championId) continue;
      incrementCounter(rolePickCounts, buildRoleKey(role, championId));
    }

    const openers = ROLE_ORDER.map((role) => assignments[role]).filter(Boolean) as string[];
    if (openers.length >= 2) {
      const firstRole = ROLE_ORDER.find((role) => assignments[role] === openers[0]) ?? null;
      const secondRole = ROLE_ORDER.find((role) => assignments[role] === openers[1]) ?? null;
      if (firstRole && secondRole) {
        incrementCounter(rolePairCounts, buildRolePairKey(firstRole, secondRole));
      }
    }
  }

  return { firstPickCounts, overallPickCounts, banCounts, rolePickCounts, rolePairCounts };
}

export function recordCompletedUserDraftGame(series: ActiveDraftSeries, completedGame: DraftGameState) {
  if (!completedGame.completed) return;

  const memory = readMemory();
  const collections = getSideCollections(completedGame, series.userSide);

  const firstPickId = collections.picks[0] ?? null;
  const firstPickRole = getChampionPrimaryRole(firstPickId ?? "");
  const compIdentity = collections.evaluation?.compIdentity ?? null;

  const assignments =
    Object.keys(collections.assignments ?? {}).length > 0
      ? collections.assignments
      : resolveRoleAssignments(collections.picks, {});

  memory.totalGames += 1;
  incrementCounter(memory.firstPickCounts, firstPickId);
  incrementCounter(memory.firstPickRoleCounts, firstPickRole);
  collections.picks.forEach((championId) => incrementCounter(memory.overallPickCounts, championId));
  collections.bans.forEach((championId) => incrementCounter(memory.banCounts, championId));
  incrementCounter(memory.compIdentityCounts, compIdentity);

  for (const role of ROLE_ORDER) {
    const championId = assignments[role];
    if (!championId) continue;
    incrementCounter(memory.rolePickCounts, buildRoleKey(role, championId));
    memory.recentRoleAssignments = pushRecent(
      memory.recentRoleAssignments,
      buildRoleKey(role, championId),
      20
    );
  }

  const openingRoles = ROLE_ORDER.filter((role) => Boolean(assignments[role])).slice(0, 2);
  if (openingRoles.length === 2) {
    incrementCounter(
      memory.rolePairCounts,
      buildRolePairKey(openingRoles[0], openingRoles[1])
    );
  }

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
  const firstPickCount =
    (memory.firstPickCounts[candidate.id] ?? 0) +
    (currentSeriesCounts.firstPickCounts[candidate.id] ?? 0) * 1.25;
  const overallPickCount =
    (memory.overallPickCounts[candidate.id] ?? 0) +
    (currentSeriesCounts.overallPickCounts[candidate.id] ?? 0) * 0.8;

  const recentFirstPickHit = memory.recentFirstPicks.includes(candidate.id) ? 1.5 : 0;
  const recentBanHit = memory.recentBans.includes(candidate.id) ? 0.7 : 0;
  const rolePressure = getRolePressureFromMemory(candidate, memory);

  const firstPickRate = firstPickCount / totalGames;
  const overallRate = overallPickCount / (totalGames * 5);

  return clamp(
    firstPickRate * 8.5 + overallRate * 10 + recentFirstPickHit + recentBanHit + rolePressure,
    0,
    8.5
  );
}

export function getUserPickPreferenceBias(
  candidate: Champion,
  targetRole: Role | null,
  aiSide: Side,
  series: ActiveDraftSeries
) {
  const enemySide: Side = aiSide === "blue" ? "red" : "blue";
  if (enemySide !== series.userSide) return 0;

  const memory = readMemory();
  const currentSeriesCounts = getCurrentSeriesUserCounts(series);

  const totalGames = Math.max(memory.totalGames, 1);
  const overallRate =
    ((memory.overallPickCounts[candidate.id] ?? 0) +
      (currentSeriesCounts.overallPickCounts[candidate.id] ?? 0) * 0.9) /
    (totalGames * 5);

  const roleSpecificRate =
    targetRole == null
      ? 0
      : ((memory.rolePickCounts[buildRoleKey(targetRole, candidate.id)] ?? 0) +
          (currentSeriesCounts.rolePickCounts[buildRoleKey(targetRole, candidate.id)] ?? 0) * 1.1) /
        totalGames;

  const recentHit = memory.recentRoleAssignments.includes(
    buildRoleKey((targetRole ?? candidate.roles[0]) as Role, candidate.id)
  )
    ? 1
    : 0;

  return clamp(overallRate * 7 + roleSpecificRate * 5 + recentHit, 0, 6);
}

export function getUserPreferredOpenRoleBias(
  candidate: Champion,
  role: Role,
  aiSide: Side,
  series: ActiveDraftSeries
) {
  const enemySide: Side = aiSide === "blue" ? "red" : "blue";
  if (enemySide !== series.userSide) return 0;

  const memory = readMemory();
  const totalRoleSamples = Object.values(memory.firstPickRoleCounts).reduce(
    (sum, value) => sum + value,
    0
  );

  if (totalRoleSamples <= 0) return 0;
  if (!candidate.roles.includes(role)) return 0;

  const firstPickRoleRate = (memory.firstPickRoleCounts[role] ?? 0) / totalRoleSamples;
  return clamp(firstPickRoleRate * 3.6, 0, 2.2);
}
