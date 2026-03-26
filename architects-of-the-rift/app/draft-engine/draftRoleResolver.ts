import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { players } from "@/app/data/players";
import { getChampionById, getComfortScore, getPlayerChampionFitScore } from "./draftEvaluator";
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
    if (player.role === role) {
      score += 4;
    }
  }

  if (champion.roles[0] === role) {
    score += 2;
  }

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
  pickedChampionIds: string[]
): boolean {
  const result = getBestAssignment(pickedChampionIds, {});
  return result.assignedCount === pickedChampionIds.slice(0, ROLE_ORDER.length).length;
}

export function getOpenRolesForPickedChampions(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>
): Role[] {
  const result = getBestAssignment(pickedChampionIds, roster);
  const usedRoles = new Set<Role>(Object.keys(result.assignment) as Role[]);
  return ROLE_ORDER.filter((role) => !usedRoles.has(role));
}

export function resolveRoleAssignments(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>
): Partial<Record<Role, string>> {
  const cleanIds = pickedChampionIds.slice(0, ROLE_ORDER.length);
  if (cleanIds.length === 0) return {};

  const result = getBestAssignment(cleanIds, roster);
  if (result.assignedCount === cleanIds.length) {
    return result.assignment;
  }

  return mapPicksToRoleOrder(cleanIds);
}
