import type { Role } from "@/app/types/champion";
import { ROLE_ORDER } from "./draftTypes";
import type { LanePhaseResult, LaneRoleBreakdown } from "./matchSimulationTypes";
import {
  average,
  championBlindSafety,
  clamp,
  getChampionByIdSafe,
  getPlayerByIdSafe,
  matchupPowerAgainst,
  playerChampionDraftFit,
  playerChampionMatchupHistoryEdge,
  playerConsistencyScore,
  playerExecutionScore,
  playerLaningScore,
  playerMacroScore,
  round1,
} from "./matchSimulationUtils";
import { getHistoryAdjustedLaneBonus } from "./playerHistoryEvaluator";
import { getChampionStatsForRole } from "./championRoleStatsSystem";

function earlyStatScore(championId: string | null, role: Role) {
  const champion = getChampionByIdSafe(championId);
  if (!champion) return 5;

  const stats = getChampionStatsForRole(champion, role);
  const cs = clamp(((stats.csDiffAt15 ?? 0) + 15) / 30, 0, 1) * 10;
  const gold = clamp(((stats.goldDiffAt15 ?? 0) + 700) / 1400, 0, 1) * 10;
  const xp = clamp(((stats.xpDiffAt15 ?? 0) + 500) / 1000, 0, 1) * 10;

  return clamp(cs * 0.3 + gold * 0.45 + xp * 0.25, 0, 10);
}

function jungleInfluence(role: Role, playerId: string | null, championId: string | null) {
  if (role !== "jungle") return 0;
  const player = getPlayerByIdSafe(playerId);
  const champion = getChampionByIdSafe(championId);
  if (!player || !champion) return 5;

  const roam = champion.offers
    .filter((offer) => ["roamPressure", "engage", "earlyPrio", "reliableCC"].includes(offer.type))
    .reduce((sum, offer) => sum + offer.strength, 0);

  const macro = playerMacroScore(playerId);
  const execution = playerExecutionScore(playerId);

  return clamp(roam * 0.68 + macro * 0.82 + execution * 0.35, 0, 10);
}

type LaneContext = {
  blueRoster: Partial<Record<Role, string>>;
  redRoster: Partial<Record<Role, string>>;
  assignmentsBlue: Partial<Record<Role, string>>;
  assignmentsRed: Partial<Record<Role, string>>;
};

function picksOf(assignments: Partial<Record<Role, string>>) {
  return Object.values(assignments).filter(Boolean) as string[];
}

/**
 * Matchup-ul de linie în early (nota 2 la putere maximă, nota 3 aproape zero).
 * Botlane = 2v2: adversarul de pe același rol + 0.5 × celălalt campion bot inamic.
 */
function laneMatchup(
  role: Role,
  allyId: string | null,
  allyAssignments: Partial<Record<Role, string>>,
  allyRoster: Partial<Record<Role, string>>,
  enemyAssignments: Partial<Record<Role, string>>,
  enemyRoster: Partial<Record<Role, string>>
) {
  const ctx = {
    ownAllyIds: picksOf(allyAssignments),
    enemyAllyIds: picksOf(enemyAssignments),
    ownPlayerId: allyRoster[role] ?? null,
  };
  let value = matchupPowerAgainst(allyId, role, enemyAssignments[role] ?? null, role, "early", {
    ...ctx,
    enemyPlayerId: enemyRoster[role] ?? null,
  });
  const otherBotRole: Role | null = role === "adc" ? "support" : role === "support" ? "adc" : null;
  if (otherBotRole) {
    value += 0.5 * matchupPowerAgainst(allyId, role, enemyAssignments[otherBotRole] ?? null, otherBotRole, "early", {
      ...ctx,
      enemyPlayerId: enemyRoster[otherBotRole] ?? null,
    });
  }
  return clamp(value, -5, 5);
}

function buildRoleBreakdown(
  role: Role,
  bluePlayerId: string | null,
  redPlayerId: string | null,
  blueChampionId: string | null,
  redChampionId: string | null,
  lane: LaneContext
): LaneRoleBreakdown {
  const blueMatchup = laneMatchup(role, blueChampionId, lane.assignmentsBlue, lane.blueRoster, lane.assignmentsRed, lane.redRoster);
  const redMatchup = laneMatchup(role, redChampionId, lane.assignmentsRed, lane.redRoster, lane.assignmentsBlue, lane.blueRoster);

  const blueDraftFit = playerChampionDraftFit(bluePlayerId, blueChampionId);
  const redDraftFit = playerChampionDraftFit(redPlayerId, redChampionId);

  const blueExec = playerExecutionScore(bluePlayerId);
  const redExec = playerExecutionScore(redPlayerId);
  const blueLaning = playerLaningScore(bluePlayerId);
  const redLaning = playerLaningScore(redPlayerId);
  const blueConsistency = playerConsistencyScore(bluePlayerId);
  const redConsistency = playerConsistencyScore(redPlayerId);

  const blueEarly = earlyStatScore(blueChampionId, role);
  const redEarly = earlyStatScore(redChampionId, role);

  const blueBlind = championBlindSafety(getChampionByIdSafe(blueChampionId), role);
  const redBlind = championBlindSafety(getChampionByIdSafe(redChampionId), role);

  const blueHistoryMatchup = playerChampionMatchupHistoryEdge(
    bluePlayerId,
    blueChampionId,
    redChampionId
  );
  const redHistoryMatchup = playerChampionMatchupHistoryEdge(
    redPlayerId,
    redChampionId,
    blueChampionId
  );
  const blueHistoryLaneBonus = getHistoryAdjustedLaneBonus(
    bluePlayerId,
    blueChampionId,
    redChampionId
  );
  const redHistoryLaneBonus = getHistoryAdjustedLaneBonus(
    redPlayerId,
    redChampionId,
    blueChampionId
  );

  const blueBase = clamp(
    blueEarly * 0.26 +
      blueDraftFit * 0.2 +
      blueExec * 0.1 +
      blueLaning * 0.16 +
      blueConsistency * 0.08 +
      blueBlind * 0.06 +
      jungleInfluence(role, bluePlayerId, blueChampionId) * 0.14 +
      blueMatchup * 0.42 +
      blueHistoryMatchup * 0.3 +
      blueHistoryLaneBonus * 0.7,
    0,
    10
  );

  const redBase = clamp(
    redEarly * 0.26 +
      redDraftFit * 0.2 +
      redExec * 0.1 +
      redLaning * 0.16 +
      redConsistency * 0.08 +
      redBlind * 0.06 +
      jungleInfluence(role, redPlayerId, redChampionId) * 0.14 +
      redMatchup * 0.42 +
      redHistoryMatchup * 0.3 +
      redHistoryLaneBonus * 0.7,
    0,
    10
  );

  const volatility = round1(
    clamp(
      average([
        Math.abs(blueMatchup),
        Math.abs(redMatchup),
        Math.abs(blueExec - redExec),
        Math.abs(blueEarly - redEarly),
      ]) * 0.75,
      1,
      10
    )
  );

  const noteParts: string[] = [];
  if (blueMatchup - redMatchup >= 2) noteParts.push("blue matchup edge");
  if (redMatchup - blueMatchup >= 2) noteParts.push("red matchup edge");
  if (blueHistoryLaneBonus - redHistoryLaneBonus >= 0.45) noteParts.push("blue player comfort edge");
  if (redHistoryLaneBonus - blueHistoryLaneBonus >= 0.45) noteParts.push("red player comfort edge");
  if (Math.abs(blueEarly - redEarly) >= 1.5) noteParts.push("early priority split");
  if (role === "jungle" && Math.abs(blueExec - redExec) >= 1.5) noteParts.push("pathing influence");

  return {
    role,
    blueChampionId,
    redChampionId,
    bluePlayerId,
    redPlayerId,
    blueScore: round1(blueBase),
    redScore: round1(redBase),
    volatility,
    note: noteParts.join(", ") || "stable lane",
  };
}

export function evaluateLanePhase(args: {
  blueRoster: Partial<Record<Role, string>>;
  redRoster: Partial<Record<Role, string>>;
  assignmentsBlue: Partial<Record<Role, string>>;
  assignmentsRed: Partial<Record<Role, string>>;
}): LanePhaseResult {
  const roles = ROLE_ORDER.map((role) =>
    buildRoleBreakdown(
      role,
      args.blueRoster[role] ?? null,
      args.redRoster[role] ?? null,
      args.assignmentsBlue[role] ?? null,
      args.assignmentsRed[role] ?? null,
      args
    )
  );

  const blueScore = round1(average(roles.map((role) => role.blueScore)));
  const redScore = round1(average(roles.map((role) => role.redScore)));
  const volatility = round1(average(roles.map((role) => role.volatility)));

  return {
    blueScore,
    redScore,
    volatility,
    roles,
  };
}
