import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { players } from "@/app/data/players";
import {
  getChampionById,
  getComfortScore,
  getPlayerChampionFitScore,
} from "./draftEvaluator";
import { ROLE_ORDER } from "./draftTypes";

const playersById = new Map(players.map((player) => [player.id, player]));

type AssignmentResult = {
  assignment: Partial<Record<Role, string>>;
  assignedCount: number;
  score: number;
};

function getRoleAssignmentScore(
  role: Role,
  championId: string,
  roster: Partial<Record<Role, string>>
) {
  const champion = getChampionById(championId);
  if (!champion) return -999;
  if (!champion.roles.includes(role)) return -999;

  let score = 25;

  const playerId = roster[role];
  const player = (playerId ? playersById.get(playerId) : null) ?? null;

  if (player) {
    score += getPlayerChampionFitScore(player.stats, champion.playerScaling) * 1.2;
    score += getComfortScore(player as Player, champion);
    if (player.role === role) score += 4;
  }

  if (champion.roles[0] === role) score += 2;

  return score;
}

function getBestAssignment(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>
): AssignmentResult {
  const cleanIds = pickedChampionIds.slice(0, ROLE_ORDER.length).filter(Boolean);

  if (cleanIds.length === 0) {
    return { assignment: {}, assignedCount: 0, score: 0 };
  }

  let best: AssignmentResult = {
    assignment: {},
    assignedCount: -1,
    score: -Infinity,
  };

  function dfs(
    championIndex: number,
    usedRoles: Set<Role>,
    currentAssignment: Partial<Record<Role, string>>,
    currentScore: number,
    assignedCount: number
  ) {
    if (championIndex >= cleanIds.length) {
      if (
        assignedCount > best.assignedCount ||
        (assignedCount === best.assignedCount && currentScore > best.score)
      ) {
        best = {
          assignment: { ...currentAssignment },
          assignedCount,
          score: currentScore,
        };
      }
      return;
    }

    const championId = cleanIds[championIndex];
    const champion = getChampionById(championId);

    if (champion) {
      for (const role of ROLE_ORDER) {
        if (usedRoles.has(role)) continue;
        if (!champion.roles.includes(role)) continue;

        const roleScore = getRoleAssignmentScore(role, championId, roster);
        if (roleScore < 0) continue;

        usedRoles.add(role);
        currentAssignment[role] = championId;
        dfs(
          championIndex + 1,
          usedRoles,
          currentAssignment,
          currentScore + roleScore,
          assignedCount + 1
        );
        delete currentAssignment[role];
        usedRoles.delete(role);
      }
    }

    dfs(championIndex + 1, usedRoles, currentAssignment, currentScore, assignedCount);
  }

  dfs(0, new Set<Role>(), {}, 0, 0);
  return best;
}

export function mapPicksToRoleOrder(
  pickedChampionIds: string[]
): Partial<Record<Role, string>> {
  const fallback: Partial<Record<Role, string>> = {};

  ROLE_ORDER.forEach((role, index) => {
    const championId = pickedChampionIds[index];
    if (championId) {
      fallback[role] = championId;
    }
  });

  return fallback;
}

export function canAssignPickedChampionsToUniqueRoles(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>> = {}
): boolean {
  const cleanIds = pickedChampionIds.slice(0, ROLE_ORDER.length).filter(Boolean);
  const result = getBestAssignment(cleanIds, roster);
  return result.assignedCount === cleanIds.length;
}

export function canPickChampionIntoUniqueRoles(
  pickedChampionIds: string[],
  candidateChampionId: string,
  roster: Partial<Record<Role, string>> = {}
): boolean {
  return canAssignPickedChampionsToUniqueRoles(
    [...pickedChampionIds, candidateChampionId],
    roster
  );
}

export function getOpenRolesForPickedChampions(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>
): Role[] {
  const result = getBestAssignment(pickedChampionIds, roster);
  const usedRoles = new Set<Role>(Object.keys(result.assignment) as Role[]);
  return ROLE_ORDER.filter((role) => !usedRoles.has(role));
}

export function getPreferredRolesForChampion(
  pickedChampionIds: string[],
  candidateChampionId: string,
  roster: Partial<Record<Role, string>> = {}
): Role[] {
  const nextPicks = [...pickedChampionIds, candidateChampionId];
  const result = getBestAssignment(nextPicks, roster);

  const candidate = getChampionById(candidateChampionId);
  if (!candidate) return [];

  const assignedRole = (Object.entries(result.assignment).find(
    ([, championId]) => championId === candidateChampionId
  )?.[0] ?? null) as Role | null;

  if (assignedRole) {
    return [assignedRole, ...candidate.roles.filter((role) => role !== assignedRole)];
  }

  const openRoles = getOpenRolesForPickedChampions(pickedChampionIds, roster);
  return candidate.roles
    .filter((role) => openRoles.includes(role))
    .sort(
      (a, b) =>
        getRoleAssignmentScore(b, candidateChampionId, roster) -
        getRoleAssignmentScore(a, candidateChampionId, roster)
    );
}

export function resolveRoleAssignments(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>
): Partial<Record<Role, string>> {
  const cleanIds = pickedChampionIds.slice(0, ROLE_ORDER.length);
  if (cleanIds.length === 0) return {};

  const result = getBestAssignment(cleanIds, roster);

  // Perfect assignment — every champion mapped to a valid role
  if (result.assignedCount === cleanIds.length) {
    return result.assignment;
  }

  // Partial assignment — some champions couldn't fit their declared roles.
  // Use the partial DFS result (valid assignments) and greedily fill
  // remaining champions into remaining open slots, preferring roles the
  // champion actually declares even if the DFS couldn't find a global fit.
  const assignment: Partial<Record<Role, string>> = { ...result.assignment };
  const assignedChampionIds = new Set(Object.values(assignment).filter(Boolean));
  const usedRoles = new Set(Object.keys(assignment) as Role[]);

  const unassigned = cleanIds.filter((id) => !assignedChampionIds.has(id));
  const openRoles = ROLE_ORDER.filter((role) => !usedRoles.has(role));

  for (const championId of unassigned) {
    if (openRoles.length === 0) break;

    const champion = getChampionById(championId);

    // Try to find an open role that the champion actually supports
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < openRoles.length; i++) {
      const role = openRoles[i];
      const isNative = champion?.roles.includes(role) ?? false;
      // Native role gets a large bonus; fallback roles get a small one
      // based on roster player fit so the least-bad option wins
      const score = isNative
        ? 1000 + getRoleAssignmentScore(role, championId, roster)
        : getRoleAssignmentScore(role, championId, roster);

      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    // If no native role available, just take first open slot (last resort)
    const chosenIdx = bestIdx >= 0 ? bestIdx : 0;
    const chosenRole = openRoles[chosenIdx];
    assignment[chosenRole] = championId;
    openRoles.splice(chosenIdx, 1);
  }

  return assignment;
}