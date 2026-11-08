import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { players } from "@/app/data/players";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import {
  getChampionById,
  getComfortScore,
  getPlayerChampionFitScore,
} from "./draftEvaluator";
import { ROLE_ORDER } from "./draftTypes";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";

const playersById = new Map(players.map((player) => [player.id, player]));

/**
 * Rolul pentru care a fost luat fiecare pick (DRAFT_THINKING §1.2): championId → rol.
 * Un campion blocat stă pe rolul lui; se mută doar dacă altfel nu încap toți,
 * pe un rol unde jucătorul are ≥ C, cu cost mare.
 */
export type LockedRoles = Partial<Record<string, Role>>;

type AssignmentResult = {
  assignment: Partial<Record<Role, string>>;
  assignedCount: number;
  score: number;
};

const MASTERY = DRAFT_THINKING_CONFIG.mastery;

function getRosterPlayer(roster: Partial<Record<Role, string>>, role: Role): Player | null {
  const playerId = roster[role];
  return (playerId ? playersById.get(playerId) : null) ?? null;
}

/** Rolul blocat al campionului, dacă e unul pe care chiar îl poate juca. */
function getLockedRole(championId: string, lockedRoles: LockedRoles | undefined): Role | null {
  const role = lockedRoles?.[championId];
  if (!role) return null;
  return getChampionById(championId)?.roles.includes(role) ? role : null;
}

/**
 * Scorul campionului pe rol; `null` = imposibil (nu joacă rolul, sau e blocat
 * pe alt rol și jucătorul de aici are sub C).
 */
function getRoleAssignmentScore(
  role: Role,
  championId: string,
  roster: Partial<Record<Role, string>>,
  lockedRoles?: LockedRoles
): number | null {
  const champion = getChampionById(championId);
  if (!champion) return null;
  if (!champion.roles.includes(role)) return null;

  const player = getRosterPlayer(roster, role);
  const lockedRole = getLockedRole(championId, lockedRoles);
  const movesLocked = lockedRole !== null && lockedRole !== role;
  const grade = player ? getChampionGrade(player, championId) : null;
  if (movesLocked && grade && GRADE_RANK[grade] < MASTERY.lockedMoveMinRank) return null;

  let score = 25;

  if (player) {
    score += getPlayerChampionFitScore(player.stats, champion.playerScaling) * 1.2;
    score += getComfortScore(player as Player, champion);
    if (player.role === role) score += 4;
    // §1.3: dintre asignările complete, una fără F / D.
    if (grade === "F") score -= MASTERY.assignmentPenalty.F;
    else if (grade === "D") score -= MASTERY.assignmentPenalty.D;
  }

  if (champion.roles[0] === role) score += 2;
  if (movesLocked) score -= MASTERY.lockedMoveCost;

  return score;
}

// Rezultatele DFS-ului depind doar de pick-uri, roster și blocări (datele de mastery sunt statice):
// draftul le cere de mai multe ori pe tură pentru aceleași intrări.
const assignmentCache = new Map<string, AssignmentResult>();
const ASSIGNMENT_CACHE_LIMIT = 4000;

function getBestAssignment(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>,
  lockedRoles?: LockedRoles
): AssignmentResult {
  const cleanIds = pickedChampionIds.slice(0, ROLE_ORDER.length).filter(Boolean);

  if (cleanIds.length === 0) {
    return { assignment: {}, assignedCount: 0, score: 0 };
  }

  const cacheKey = [
    cleanIds.join(","),
    ROLE_ORDER.map((role) => roster[role] ?? "").join(","),
    cleanIds.map((id) => lockedRoles?.[id] ?? "").join(","),
  ].join("|");
  const cached = assignmentCache.get(cacheKey);
  if (cached) return { ...cached, assignment: { ...cached.assignment } };
  const result = computeBestAssignment(cleanIds, roster, lockedRoles);
  if (assignmentCache.size >= ASSIGNMENT_CACHE_LIMIT) assignmentCache.clear();
  assignmentCache.set(cacheKey, result);
  return { ...result, assignment: { ...result.assignment } };
}

function computeBestAssignment(
  cleanIds: string[],
  roster: Partial<Record<Role, string>>,
  lockedRoles?: LockedRoles
): AssignmentResult {

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

        const roleScore = getRoleAssignmentScore(role, championId, roster, lockedRoles);
        if (roleScore === null) continue;

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

/** Asignările acoperă exact pick-urile (fiecare pick o dată)? */
export function assignmentsCoverPicks(
  assignments: Partial<Record<Role, string>> | undefined,
  picks: string[]
): boolean {
  if (!assignments) return false;
  const assigned = ROLE_ORDER.map((role) => assignments[role]).filter(Boolean) as string[];
  const cleanPicks = picks.slice(0, ROLE_ORDER.length).filter(Boolean);
  if (assigned.length !== cleanPicks.length) return false;
  const assignedSet = new Set(assigned);
  if (assignedSet.size !== assigned.length) return false;
  return cleanPicks.every((championId) => assignedSet.has(championId));
}

export function canAssignPickedChampionsToUniqueRoles(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>> = {},
  lockedRoles?: LockedRoles
): boolean {
  const cleanIds = pickedChampionIds.slice(0, ROLE_ORDER.length).filter(Boolean);
  const result = getBestAssignment(cleanIds, roster, lockedRoles);
  return result.assignedCount === cleanIds.length;
}

export function canPickChampionIntoUniqueRoles(
  pickedChampionIds: string[],
  candidateChampionId: string,
  roster: Partial<Record<Role, string>> = {},
  lockedRoles?: LockedRoles
): boolean {
  return canAssignPickedChampionsToUniqueRoles(
    [...pickedChampionIds, candidateChampionId],
    roster,
    lockedRoles
  );
}

export function getOpenRolesForPickedChampions(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>,
  lockedRoles?: LockedRoles
): Role[] {
  const result = getBestAssignment(pickedChampionIds, roster, lockedRoles);
  const usedRoles = new Set<Role>(Object.keys(result.assignment) as Role[]);
  return ROLE_ORDER.filter((role) => !usedRoles.has(role));
}

export function getPreferredRolesForChampion(
  pickedChampionIds: string[],
  candidateChampionId: string,
  roster: Partial<Record<Role, string>> = {},
  lockedRoles?: LockedRoles
): Role[] {
  const nextPicks = [...pickedChampionIds, candidateChampionId];
  const result = getBestAssignment(nextPicks, roster, lockedRoles);

  const candidate = getChampionById(candidateChampionId);
  if (!candidate) return [];

  const assignedRole = (Object.entries(result.assignment).find(
    ([, championId]) => championId === candidateChampionId
  )?.[0] ?? null) as Role | null;

  if (assignedRole) {
    return [assignedRole, ...candidate.roles.filter((role) => role !== assignedRole)];
  }

  const openRoles = getOpenRolesForPickedChampions(pickedChampionIds, roster, lockedRoles);
  const scoreOf = (role: Role) => getRoleAssignmentScore(role, candidateChampionId, roster, lockedRoles) ?? -999;
  return candidate.roles
    .filter((role) => openRoles.includes(role))
    .sort((a, b) => scoreOf(b) - scoreOf(a));
}

export function resolveRoleAssignments(
  pickedChampionIds: string[],
  roster: Partial<Record<Role, string>>,
  lockedRoles?: LockedRoles
): Partial<Record<Role, string>> {
  const cleanIds = pickedChampionIds.slice(0, ROLE_ORDER.length);
  if (cleanIds.length === 0) return {};

  const result = getBestAssignment(cleanIds, roster, lockedRoles);

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
      const roleScore = getRoleAssignmentScore(role, championId, roster) ?? -999;
      const score = isNative ? 1000 + roleScore : roleScore;

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
