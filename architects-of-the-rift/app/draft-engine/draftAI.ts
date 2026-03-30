import { teams } from "@/app/data/teams";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import type {
  ActiveDraftSeries,
  DraftAiConfig,
  DraftCandidateBreakdown,
  DraftGameState,
  DraftSave,
  DraftStep,
  Side,
} from "./draftTypes";
import { DEFAULT_AI_CONFIG, DRAFT_SEQUENCE, ROLE_ORDER } from "./draftTypes";
import {
  evaluateNeedStatuses,
  getChampionById,
  getComfortScore,
  getMetaPriorityScore,
  getPlayerChampionFitScore,
} from "./draftEvaluator";
import {
  canPickChampionIntoUniqueRoles,
  getOpenRolesForPickedChampions,
  getPreferredRolesForChampion,
  resolveRoleAssignments,
} from "./draftRoleResolver";
import {
  getUserBanTargetBias,
  getUserPickPreferenceBias,
  getUserPreferredOpenRoleBias,
} from "./userDraftMemory";

const playersById = new Map(players.map((player) => [player.id, player]));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTeamSlugForSide(series: ActiveDraftSeries, side: Side) {
  return side === "blue" ? series.blueTeamSlug : series.redTeamSlug;
}

function getTeamRosterFromSources({
  teamSlug,
  save,
}: {
  teamSlug: string;
  save: DraftSave | null;
}): Partial<Record<Role, string>> {
  if (!save) return {};

  const updatedRoster = teamSlug ? save.updatedTeamRosters?.[teamSlug] : undefined;
  if (updatedRoster && typeof updatedRoster === "object") {
    return updatedRoster;
  }

  if (teamSlug && save.controlledTeamSlug === teamSlug && save.roster) {
    return save.roster;
  }

  return {};
}

function getOwnState(game: DraftGameState, side: Side) {
  return {
    picks: side === "blue" ? game.picksBlue : game.picksRed,
    bans: side === "blue" ? game.bansBlue : game.bansRed,
    assignments: side === "blue" ? game.assignmentsBlue : game.assignmentsRed,
  };
}

function getEnemyState(game: DraftGameState, side: Side) {
  return getOwnState(game, side === "blue" ? "red" : "blue");
}

function getCurrentPickNumberForSide(game: DraftGameState, side: Side) {
  const picks = side === "blue" ? game.picksBlue : game.picksRed;
  return picks.length + 1;
}

function findRemainingOwnPickLabels(game: DraftGameState, side: Side) {
  return DRAFT_SEQUENCE.slice(game.phaseIndex)
    .filter((entry) => entry.action === "pick" && entry.side === side)
    .map((entry) => entry.label);
}

function hasAbsoluteLastPick(game: DraftGameState, side: Side) {
  const ownRemaining = findRemainingOwnPickLabels(game, side);
  return ownRemaining.includes("R5") && side === "red";
}

function hasCurrentSideLastRotation(game: DraftGameState, side: Side) {
  const ownRemaining = findRemainingOwnPickLabels(game, side);
  const enemyRemaining = findRemainingOwnPickLabels(game, side === "blue" ? "red" : "blue");
  if (!ownRemaining.length || !enemyRemaining.length) return true;

  const lastOwn = ownRemaining[ownRemaining.length - 1];
  const lastEnemy = enemyRemaining[enemyRemaining.length - 1];

  return (
    (side === "red" && lastOwn === "R5") ||
    (side === "blue" && lastOwn === "B5" && lastEnemy !== "R5")
  );
}

function getIdentityBias(teamSlug: string, champion: Champion) {
  const team = teams.find((entry) => entry.slug === teamSlug);
  const identity = team?.identity;
  if (!identity) return 0;

  const tagSet = new Set(champion.championTags ?? []);
  let bias = 0;

  if ((identity.flexBias ?? 0) >= 7 && champion.roles.length >= 2) bias += 1.35;
  if ((identity.earlyPriorityBias ?? 0) >= 7 && (champion.stats?.prioScore ?? 0) >= 65) bias += 1.15;
  if ((identity.counterpickBias ?? 0) >= 7 && champion.roles.length === 1) bias += 0.4;
  if ((identity.creativity ?? 0) >= 7 && champion.roles.length >= 2) bias += 0.6;

  for (const tag of identity.preferredTags ?? []) {
    if (tagSet.has(tag)) bias += 0.45;
  }

  for (const tag of identity.avoidTags ?? []) {
    if (tagSet.has(tag)) bias -= 0.6;
  }

  return clamp(bias, -3, 4);
}

function getProjectedPlayerForRole(
  roster: Partial<Record<Role, string>>,
  role: Role
): Player | null {
  const playerId = roster[role];
  if (!playerId) return null;
  return playersById.get(playerId) ?? null;
}

function getProjectedRoleAndPlayer(
  candidate: Champion,
  ownPicks: string[],
  roster: Partial<Record<Role, string>>
) {
  const preferredRoles = getPreferredRolesForChampion(ownPicks, candidate.id, roster);
  const projectedRole = preferredRoles[0] ?? candidate.roles[0] ?? null;
  const projectedPlayer = projectedRole ? getProjectedPlayerForRole(roster, projectedRole) : null;

  return {
    projectedRole,
    projectedPlayer,
  };
}

function getCounterRoleTargets(enemyPicks: string[]) {
  const assignments = resolveRoleAssignments(enemyPicks, {});
  const openEnemyRoles = ROLE_ORDER.filter((role) => !assignments[role]);

  const soloRoles = openEnemyRoles.filter((role) => role === "top" || role === "mid");
  if (soloRoles.length) return soloRoles;

  return openEnemyRoles;
}

function getRoleCoverageUrgency(
  game: DraftGameState,
  side: Side,
  ownPicks: string[],
  candidate: Champion,
  projectedRole: Role | null,
  roster: Partial<Record<Role, string>>
) {
  const openRolesBefore = getOpenRolesForPickedChampions(ownPicks, roster);
  const openRolesAfter = getOpenRolesForPickedChampions([...ownPicks, candidate.id], roster);
  const ownPickNumber = getCurrentPickNumberForSide(game, side);

  if (!projectedRole) return -8;
  if (!openRolesBefore.includes(projectedRole)) return 1.5;

  let value = (openRolesBefore.length - openRolesAfter.length) * 4.2;

  if (ownPickNumber <= 2) {
    if (projectedRole === "jungle") value += 2.2;
    if (projectedRole === "adc" || projectedRole === "support") value += 1.2;
  }

  if (ownPickNumber <= 3 && (projectedRole === "top" || projectedRole === "mid")) {
    const lastPickHeld = hasAbsoluteLastPick(game, side) || hasCurrentSideLastRotation(game, side);
    if (!lastPickHeld && candidate.roles.length === 1) {
      value += 0.9;
    }
  }

  return value;
}

function getCounterpickPreservationBonus(
  game: DraftGameState,
  side: Side,
  candidate: Champion,
  projectedRole: Role | null,
  enemyPicks: string[]
) {
  if (!projectedRole) return 0;

  const targetRoles = getCounterRoleTargets(enemyPicks);
  const isSoloRole = projectedRole === "top" || projectedRole === "mid";
  const saveForLastPick = hasAbsoluteLastPick(game, side);

  if (!isSoloRole) return 0;
  if (!saveForLastPick) return 0;

  if (targetRoles.includes(projectedRole) && candidate.roles.length === 1) {
    return -4.75;
  }

  if (candidate.roles.length >= 2) {
    return 1.75;
  }

  return 0;
}

function getBlindRiskPenalty(game: DraftGameState, side: Side, candidate: Champion, projectedRole: Role | null) {
  if (!projectedRole) return 0;

  const ownPickNumber = getCurrentPickNumberForSide(game, side);
  const safeBlind = clamp((candidate.stats?.blindPickRate ?? 45) / 10, 0, 10);

  if (ownPickNumber >= 4) return 0;
  if (projectedRole !== "top" && projectedRole !== "mid") return 0;

  return clamp((6.8 - safeBlind) * 0.95, 0, 4.2);
}

function getNeedFillScore(ownPicks: string[], candidate: Champion) {
  const statuses = evaluateNeedStatuses(ownPicks);
  if (!statuses.length) return 4;

  const offerTypes = new Set((candidate.offers ?? []).map((offer) => String(offer.type)));
  let value = 0;

  for (const need of statuses.slice(0, 3)) {
    if (offerTypes.has(String(need.type))) {
      value += need.missing * 1.6;
    }
  }

  return clamp(value, 0, 10);
}

function getCompSynergyScore(ownPicks: string[], candidate: Champion) {
  let synergy = 4.5;

  for (const pickedId of ownPicks) {
    const picked = getChampionById(pickedId);
    if (!picked) continue;

    const directSynergy = candidate.synergyWith?.find((entry: { championId: string; score?: number }) => entry.championId === picked.id)?.score ?? 0;
    const reverseSynergy = picked.synergyWith?.find((entry: { championId: string; score?: number }) => entry.championId === candidate.id)?.score ?? 0;
    const mustPair = candidate.mustWith?.find((entry: { championId: string; score?: number }) => entry.championId === picked.id)?.score ?? 0;

    synergy += directSynergy * 0.38;
    synergy += reverseSynergy * 0.38;
    synergy += mustPair * 0.45;
  }

  return clamp(synergy, 0, 10);
}

function getCounterValueScore(enemyPicks: string[], candidate: Champion) {
  let counter = 0;
  for (const enemyId of enemyPicks) {
    const enemy = getChampionById(enemyId);
    if (!enemy) continue;

    const intoEnemy = candidate.goodVs?.find((entry: { championId: string; score?: number }) => entry.championId === enemy.id)?.score ?? 0;
    const threatenedByEnemy = candidate.weakVs?.find((entry: { championId: string; score?: number }) => entry.championId === enemy.id)?.score ?? 0;

    counter += intoEnemy * 0.7;
    counter -= threatenedByEnemy * 0.55;
  }

  return clamp(counter + 5, 0, 10);
}

function getWeaknessPenalty(enemyPicks: string[], candidate: Champion) {
  let penalty = 0;

  for (const enemyId of enemyPicks) {
    const enemy = getChampionById(enemyId);
    if (!enemy) continue;

    const enemyOfferTypes = new Set((enemy.offers ?? []).map((offer) => String(offer.type)));
    for (const weakness of candidate.weaknesses ?? []) {
      if (enemyOfferTypes.has(String(weakness.exposedTo))) {
        penalty += weakness.severity * 0.8;
      }
    }
  }

  return clamp(penalty, 0, 10);
}

function getProjectedPlayerScores(
  roster: Partial<Record<Role, string>>,
  projectedRole: Role | null,
  candidate: Champion
) {
  if (!projectedRole) {
    return { comfortScore: 2.5, playerFitScore: 2.5, projectedPlayerId: null };
  }

  const player = getProjectedPlayerForRole(roster, projectedRole);
  if (!player) {
    return { comfortScore: 5, playerFitScore: 5, projectedPlayerId: null };
  }

  return {
    comfortScore: getComfortScore(player, candidate),
    playerFitScore: getPlayerChampionFitScore(player.stats, candidate.playerScaling),
    projectedPlayerId: player.id,
  };
}

function scorePickCandidate(
  candidate: Champion,
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig
): DraftCandidateBreakdown {
  const ownState = getOwnState(game, step.side);
  const enemyState = getEnemyState(game, step.side);
  const teamSlug = getTeamSlugForSide(series, step.side);
  const roster = getTeamRosterFromSources({ teamSlug, save });

  const canFit = canPickChampionIntoUniqueRoles(ownState.picks, candidate.id, roster);
  const projected = getProjectedRoleAndPlayer(candidate, ownState.picks, roster);

  const metaPriority = clamp(getMetaPriorityScore(candidate), 0, 10);
  const identityBias = getIdentityBias(teamSlug, candidate);
  const flexBonus = candidate.roles.length >= 2 ? 1.8 : 0.35;

  const roleCoverage = getRoleCoverageUrgency(
    game,
    step.side,
    ownState.picks,
    candidate,
    projected.projectedRole,
    roster
  );

  const counterpickPreservationBonus = getCounterpickPreservationBonus(
    game,
    step.side,
    candidate,
    projected.projectedRole,
    enemyState.picks
  );

  const blindRiskPenalty = getBlindRiskPenalty(
    game,
    step.side,
    candidate,
    projected.projectedRole
  );

  const { comfortScore, playerFitScore, projectedPlayerId } = getProjectedPlayerScores(
    roster,
    projected.projectedRole,
    candidate
  );

  const compSynergy = getCompSynergyScore(ownState.picks, candidate);
  const needFill = getNeedFillScore(ownState.picks, candidate);
  const counterValue = getCounterValueScore(enemyState.picks, candidate);
  const weaknessPenalty = getWeaknessPenalty(enemyState.picks, candidate);

  const userBias = getUserPickPreferenceBias(
    candidate,
    projected.projectedRole,
    step.side,
    series
  );
  const userRoleBias =
    projected.projectedRole == null
      ? 0
      : getUserPreferredOpenRoleBias(candidate, projected.projectedRole, step.side, series);

  const invalidRolePenalty = canFit ? 0 : 100;
  const totalScore =
    metaPriority * config.metaWeight +
    comfortScore * config.comfortWeight +
    playerFitScore * config.fitWeight +
    compSynergy * config.synergyWeight +
    needFill * config.needWeight +
    counterValue * config.counterWeight +
    identityBias +
    flexBonus +
    roleCoverage +
    counterpickPreservationBonus +
    userBias +
    userRoleBias -
    weaknessPenalty * config.weaknessWeight -
    blindRiskPenalty -
    invalidRolePenalty;

  let planType: DraftCandidateBreakdown["planType"] = "stabilize-comp";
  if (counterpickPreservationBonus >= 1.2) planType = "hide-solo-lane";
  if (counterpickPreservationBonus <= -2.5) planType = "hold-counter";
  else if (
    projected.projectedRole === "adc" ||
    projected.projectedRole === "support"
  ) {
    planType = "lock-bot-prio";
  }

  return {
    championId: candidate.id,
    action: "pick",
    side: step.side,
    metaPriority,
    comfortScore,
    playerFitScore,
    compSynergy,
    needFill,
    counterValue,
    weaknessPenalty,
    totalScore,
    projectedRole: projected.projectedRole,
    projectedPlayerId,
    planType,
    planBias: identityBias + roleCoverage,
    blindRiskPenalty,
    flexBonus,
    historyBias: userBias,
    counterpickPreservationBonus,
    reasonTags: [
      canFit ? "valid-role-map" : "invalid-role-map",
      candidate.roles.length >= 2 ? "flex" : "single-role",
      projected.projectedRole ?? "unassigned",
    ],
  };
}

function scoreBanCandidate(
  candidate: Champion,
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries
): DraftCandidateBreakdown {
  const ownState = getOwnState(game, step.side);
  const enemyState = getEnemyState(game, step.side);

  const metaPriority = clamp(getMetaPriorityScore(candidate), 0, 10);
  const enemyComfortPressure = clamp((candidate.stats?.prioScore ?? 50) / 13.5, 0, 8);
  const enemyCounterWindow =
    ownState.picks.length >= 3 && (candidate.roles.includes("top") || candidate.roles.includes("mid"))
      ? 1.15
      : 0;
  const userBias = getUserBanTargetBias(candidate, step.side, series);

  const totalScore =
    metaPriority * 1.3 +
    enemyComfortPressure +
    enemyCounterWindow +
    userBias +
    (candidate.roles.length >= 2 ? 0.8 : 0);

  return {
    championId: candidate.id,
    action: "ban",
    side: step.side,
    metaPriority,
    comfortScore: 5,
    playerFitScore: 5,
    compSynergy: 5,
    needFill: 5,
    counterValue: totalScore,
    weaknessPenalty: 0,
    totalScore,
    planType: "deny-signature",
    historyBias: userBias,
    reasonTags: [
      userBias > 1 ? "user-pattern" : "meta-ban",
      candidate.roles.length >= 2 ? "flex" : "single-role",
    ],
  };
}

export function scoreDraftCandidate(
  candidate: Champion,
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig = DEFAULT_AI_CONFIG
): DraftCandidateBreakdown {
  if (step.action === "ban") {
    return scoreBanCandidate(candidate, step, game, series);
  }

  return scorePickCandidate(candidate, step, game, series, save, config);
}

function applyRealisticPickTiebreaker(
  a: DraftCandidateBreakdown,
  b: DraftCandidateBreakdown
) {
  const roleCoverageDiff = (b.planBias ?? 0) - (a.planBias ?? 0);
  if (Math.abs(roleCoverageDiff) > 0.01) return roleCoverageDiff;

  const counterPreservationDiff =
    (b.counterpickPreservationBonus ?? 0) - (a.counterpickPreservationBonus ?? 0);
  if (Math.abs(counterPreservationDiff) > 0.01) return counterPreservationDiff;

  const flexDiff = (b.flexBonus ?? 0) - (a.flexBonus ?? 0);
  if (Math.abs(flexDiff) > 0.01) return flexDiff;

  return 0;
}

export function chooseAiAction(
  pool: Champion[],
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig = DEFAULT_AI_CONFIG
): DraftCandidateBreakdown | null {
  if (!pool.length) return null;

  const ranked = pool
    .map((candidate) => scoreDraftCandidate(candidate, step, game, series, save, config))
    .sort((a, b) => {
      const primary = b.totalScore - a.totalScore;
      if (Math.abs(primary) > 0.01) return primary;
      return applyRealisticPickTiebreaker(a, b);
    });

  if (step.action === "pick") {
    const valid = ranked.filter((entry) => !entry.reasonTags?.includes("invalid-role-map"));
    return valid[0] ?? ranked[0] ?? null;
  }

  return ranked[0] ?? null;
}
