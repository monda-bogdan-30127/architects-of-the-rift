import { champions } from "@/app/data/champions";
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
import { inferCarryNeedPenalty } from "./draftCarryNeeds";
import { getCarrySelfProtectionScore } from "./draftArchetypes";
import { getCounterpickPreservationBonus, getInformationScore, getNeutralizableBlindPenalty } from "./draftInformation";
import { getDraftPlan } from "./draftPlan";
import { getSeriesAwareBanBonus } from "./draftSeriesMemory";
import {
  evaluateNeedStatuses,
  evaluateTeamDraft,
  getChampionById,
  getComfortScore,
  getMetaPriorityScore,
  getPlayerChampionFitScore,
} from "./draftEvaluator";
import {
  canAssignPickedChampionsToUniqueRoles,
  getOpenRolesForPickedChampions,
  resolveRoleAssignments,
} from "./draftRoleResolver";
import {
  getEnemySeasonSignatureThreat,
  getEnemySignatureThreat,
  getPlayerChampionHistoryBonus,
  getPlayerChampionMatchupDraftBias,
  getPlayerChampionSignatureBonus,
} from "./playerHistoryEvaluator";

const playersById = new Map(players.map((player) => [player.id, player]));
const championMap = new Map(champions.map((champion) => [champion.id, champion]));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTeamRosterFromSave(teamSlug: string, save: DraftSave | null): Partial<Record<Role, string>> {
  if (!save) return {};
  if (save.updatedTeamRosters?.[teamSlug]) return save.updatedTeamRosters[teamSlug];
  if (save.controlledTeamSlug === teamSlug) return save.roster;
  return {};
}

function getSideRoster(series: ActiveDraftSeries, side: Side, save: DraftSave | null): Partial<Record<Role, string>> {
  return getTeamRosterFromSave(side === "blue" ? series.blueTeamSlug : series.redTeamSlug, save);
}

function getSideChampionIds(game: DraftGameState, side: Side) {
  return side === "blue" ? game.picksBlue : game.picksRed;
}

function getEnemyChampionIds(game: DraftGameState, side: Side) {
  return side === "blue" ? game.picksRed : game.picksBlue;
}

function getUnavailableChampionIds(series: ActiveDraftSeries, game: DraftGameState) {
  const unavailable = new Set<string>();
  for (const draftGame of series.games) {
    if (draftGame.number >= game.number) continue;
    draftGame.picksBlue.forEach((championId) => unavailable.add(championId));
    draftGame.picksRed.forEach((championId) => unavailable.add(championId));
  }
  game.bansBlue.forEach((championId) => unavailable.add(championId));
  game.bansRed.forEach((championId) => unavailable.add(championId));
  game.picksBlue.forEach((championId) => unavailable.add(championId));
  game.picksRed.forEach((championId) => unavailable.add(championId));
  return unavailable;
}

function getExpectedOpenRoles(allyChampionIds: string[], roster: Partial<Record<Role, string>>): Role[] {
  const openRoles = getOpenRolesForPickedChampions(allyChampionIds, roster);
  return openRoles.length > 0 ? openRoles : [...ROLE_ORDER];
}

function getBanRolePlayability(candidate: Champion, enemyChampionIds: string[], enemyRoster: Partial<Record<Role, string>>) {
  const resolvedAssignments = resolveRoleAssignments(enemyChampionIds, enemyRoster);
  const lockedRoles = new Set<Role>(Object.keys(resolvedAssignments) as Role[]);
  const openRoles = getExpectedOpenRoles(enemyChampionIds, enemyRoster);

  const playableOpenRoles = candidate.roles.filter((role) => openRoles.includes(role));
  const hasOpenRole = playableOpenRoles.length > 0;

  const hardLockedOut =
    candidate.roles.length === 1 &&
    lockedRoles.has(candidate.roles[0]) &&
    !openRoles.includes(candidate.roles[0]);

  return {
    resolvedAssignments,
    lockedRoles,
    openRoles,
    playableOpenRoles,
    hasOpenRole,
    hardLockedOut,
  };
}

function getBanRoleFitBonus(candidate: Champion, enemyChampionIds: string[], enemyRoster: Partial<Record<Role, string>>) {
  const roleState = getBanRolePlayability(candidate, enemyChampionIds, enemyRoster);

  if (roleState.hardLockedOut) return -999;
  if (!roleState.hasOpenRole) return -999;

  if (candidate.roles.length === 1 && roleState.playableOpenRoles.length === 1) return 4.5;
  if (candidate.roles.length >= 2 && roleState.playableOpenRoles.length >= 1) return 2.2;

  return 0;
}


function getRoleCoverageBonus(candidate: Champion, openRoles: Role[]) {
  if (openRoles.length === 0) return 5;
  const overlap = candidate.roles.filter((role) => openRoles.includes(role)).length;
  if (overlap === 0) return -12;
  if (overlap >= 2) return 12;
  return 10;
}

function getBestProjectedPlayer(candidate: Champion, openRoles: Role[], roster: Partial<Record<Role, string>>): Player | null {
  let bestPlayer: Player | null = null;
  let bestScore = -Infinity;

  for (const role of openRoles) {
    if (!candidate.roles.includes(role)) continue;
    const playerId = roster[role];
    const player = (playerId ? playersById.get(playerId) : null) ?? null;
    if (!player) continue;

    const score =
      getPlayerChampionFitScore(player.stats, candidate.playerScaling) +
      getComfortScore(player, candidate);

    if (score > bestScore) {
      bestScore = score;
      bestPlayer = player;
    }
  }

  return bestPlayer;
}

function getPlayerHistoryPickBias(candidate: Champion, projectedPlayer: Player | null) {
  if (!projectedPlayer) return 0;
  const championHistory = getPlayerChampionHistoryBonus(projectedPlayer.id, candidate.id);
  const signature = getPlayerChampionSignatureBonus(projectedPlayer.id, candidate.id);
  return clamp(championHistory * 5 + signature * 6.4, -4, 10.5);
}

function getProjectedMatchupPickBias(candidate: Champion, projectedPlayer: Player | null, enemyChampionIds: string[]) {
  if (!projectedPlayer || enemyChampionIds.length === 0) return 0;

  let relationBias = 0;
  for (const enemyChampionId of enemyChampionIds) {
    const goodVs = candidate.goodVs.find((item) => item.championId === enemyChampionId);
    if (goodVs) relationBias += (goodVs.score ?? 3) * 0.45;

    const weakVs = candidate.weakVs.find((item) => item.championId === enemyChampionId);
    if (weakVs) relationBias -= (weakVs.score ?? 3) * 0.3;
  }

  const playerMatchupBias = getPlayerChampionMatchupDraftBias(projectedPlayer.id, candidate.id, enemyChampionIds);
  return clamp(relationBias + playerMatchupBias * 6.5, -6, 9);
}

function getEnemySignatureBanThreat(candidate: Champion, projectedEnemyPlayer: Player | null) {
  if (!projectedEnemyPlayer) return 0;
  return getEnemySignatureThreat(projectedEnemyPlayer.id, candidate.id);
}

function getEnemyMatchupSignatureBanThreat(candidate: Champion, projectedEnemyPlayer: Player | null, shownAllyChampionIds: string[]) {
  if (!projectedEnemyPlayer || shownAllyChampionIds.length === 0) return 0;
  const matchupBias = getPlayerChampionMatchupDraftBias(projectedEnemyPlayer.id, candidate.id, shownAllyChampionIds);
  const seasonThreat = getEnemySeasonSignatureThreat(projectedEnemyPlayer.id, candidate.id);
  return clamp(matchupBias * 4.2 + seasonThreat * 0.32, 0, 8.5);
}

function getPickNumberForSide(game: DraftGameState, side: Side) {
  return getSideChampionIds(game, side).length + 1;
}

function isEarlyBlindWindow(game: DraftGameState, side: Side) {
  const allyPicks = getSideChampionIds(game, side).length;
  const enemyPicks = getEnemyChampionIds(game, side).length;
  return allyPicks <= 1 || enemyPicks <= 1;
}

function hasImmediateFollowUpPick(game: DraftGameState, side: Side) {
  const currentStep = DRAFT_SEQUENCE[game.phaseIndex];
  const nextStep = DRAFT_SEQUENCE[game.phaseIndex + 1];
  if (!currentStep || !nextStep) return false;
  return currentStep.action === "pick" && currentStep.side === side && nextStep.action === "pick" && nextStep.side === side;
}

function canStillDraftPairSoon(candidate: Champion, game: DraftGameState, side: Side, series: ActiveDraftSeries) {
  const allyChampionIds = getSideChampionIds(game, side);
  const unavailable = getUnavailableChampionIds(series, game);

  let bestWindowScore = 0;
  for (const relation of candidate.mustWith) {
    if (allyChampionIds.includes(relation.championId)) {
      bestWindowScore = Math.max(bestWindowScore, 10);
      continue;
    }
    if (unavailable.has(relation.championId)) continue;
    const pairChampion = championMap.get(relation.championId);
    if (!pairChampion) continue;

    const projectedPairIds = [...allyChampionIds, candidate.id, relation.championId];
    if (!canAssignPickedChampionsToUniqueRoles(projectedPairIds)) continue;

    const pairMeta = getMetaPriorityScore(pairChampion);
    const sameWindowBonus = hasImmediateFollowUpPick(game, side) ? 2.5 : 0;
    const pairScore = clamp(5.5 + sameWindowBonus + pairMeta * 0.25 + (relation.score ?? 3) * 0.35, 0, 10);
    bestWindowScore = Math.max(bestWindowScore, pairScore);
  }

  return bestWindowScore;
}

function getMustWithTimingScore(candidate: Champion, game: DraftGameState, side: Side, series: ActiveDraftSeries) {
  if (candidate.mustWith.length === 0) return { bonus: 0, penalty: 0 };
  const allyChampionIds = getSideChampionIds(game, side);
  const unresolved = candidate.mustWith.filter((relation) => !allyChampionIds.includes(relation.championId));
  if (unresolved.length === 0) return { bonus: 8, penalty: 0 };

  const pairWindowScore = canStillDraftPairSoon(candidate, game, side, series);
  if (pairWindowScore >= 8) return { bonus: pairWindowScore, penalty: 0 };

  const blindWindow = isEarlyBlindWindow(game, side);
  const penalty = blindWindow ? clamp(8 - pairWindowScore, 0, 8) : clamp(5 - pairWindowScore, 0, 5);
  return { bonus: pairWindowScore * 0.55, penalty };
}

function countOpenEnemyAnswers(game: DraftGameState, side: Side, answerIds: string[], series: ActiveDraftSeries) {
  const unavailable = getUnavailableChampionIds(series, game);
  return answerIds.reduce((sum, championId) => sum + (!unavailable.has(championId) ? 1 : 0), 0);
}

function getReactiveUtilityEarlyPenalty(candidate: Champion, game: DraftGameState, side: Side, series: ActiveDraftSeries) {
  if (!isEarlyBlindWindow(game, side)) return 0;

  let penalty = 0;
  const enemyShown = getEnemyChampionIds(game, side);

  const enemyDashEngageCount = enemyShown.filter((championId) =>
    [
      "rell",
      "rakan",
      "leona",
      "nautilus",
      "pantheon",
      "vi",
      "wukong",
      "jarvan-iv",
      "camille",
      "ksante",
      "jax",
      "ambessa",
      "kled",
    ].includes(championId)
  ).length;

  if (candidate.id === "poppy") {
    penalty += 2.2;
    if (enemyShown.length === 0) penalty += 1.1;
    if (enemyDashEngageCount === 0) penalty += 1.2;
    if (candidate.roles.includes("support")) penalty += 0.45;
    penalty += countOpenEnemyAnswers(game, side, ["rakan", "rell", "leona", "nautilus", "pantheon", "vi", "wukong", "jarvan-iv"], series) * 0.08;
  }

  if (candidate.id === "braum") {
    penalty += 1.4;
    if (enemyShown.length === 0) penalty += 0.8;
  }

  if (candidate.id === "galio") {
    penalty += 1.1;
    if (enemyShown.length === 0) penalty += 0.6;
  }

  return clamp(penalty, 0, 4.6);
}

function getBlindRiskPenalty(candidate: Champion, game: DraftGameState, side: Side, series: ActiveDraftSeries) {
  if (!isEarlyBlindWindow(game, side)) return 0;

  const metaPriority = getMetaPriorityScore(candidate);
  const prioScore = clamp((candidate.stats.prioScore ?? 0) / 10, 0, 10);
  const avgPickRound = candidate.stats.avgPickRound ?? 3;
  const blindPickRate = candidate.stats.blindPickRate ?? 0;

  let penalty = 0;
  if (metaPriority < 6.4) penalty += (6.4 - metaPriority) * 1.35;
  if (prioScore < 6.2) penalty += (6.2 - prioScore) * 0.85;
  if (avgPickRound > 2.15) penalty += (avgPickRound - 2.15) * 2.1;
  if (blindPickRate < 35) penalty += (35 - blindPickRate) * 0.035;
  if (candidate.mustWith.length > 0) penalty += 0.9;

  const openSlipperyCarries = countOpenEnemyAnswers(game, side, ["ezreal", "corki", "xayah", "zeri", "kaisa"], series);
  const openPeelAnswers = countOpenEnemyAnswers(game, side, ["braum", "poppy", "lulu", "renata-glasc", "bard", "seraphine"], series);
  const mobilityPunishable =
    candidate.id === "jarvan-iv" ||
    candidate.id === "vi" ||
    candidate.id === "nautilus" ||
    candidate.id === "leona";
  if (mobilityPunishable) {
    penalty += openSlipperyCarries * 0.42 + openPeelAnswers * 0.28;
  }

  penalty += getNeutralizableBlindPenalty({
    candidate,
    side,
    allyChampionIds: getSideChampionIds(game, side),
    enemyChampionIds: getEnemyChampionIds(game, side),
    game,
    series,
  });

  penalty += getReactiveUtilityEarlyPenalty(candidate, game, side, series);

  return clamp(penalty, 0, 10.5);
}

function getBlueSidePowerPickBias(candidate: Champion, game: DraftGameState, side: Side, series: ActiveDraftSeries) {
  if (side !== "blue") return 0;
  const pickNumber = getPickNumberForSide(game, side);
  if (pickNumber > 2) return 0;

  const metaPriority = getMetaPriorityScore(candidate);
  const blindPenalty = getBlindRiskPenalty(candidate, game, side, series);
  const reactiveUtilityPenalty = ["poppy", "braum", "galio"].includes(candidate.id) ? 2.4 : 0;
  return clamp(metaPriority * 0.9 - blindPenalty * 0.6 - reactiveUtilityPenalty, 0, 10);
}

function getCarrySelfDefenseContextBias(candidate: Champion, enemyChampionIds: string[]) {
  if (!candidate.roles.includes("adc")) return 0;

  const selfProtection = getCarrySelfProtectionScore(candidate);
  const diveThreats = new Set(["vi", "jarvan-iv", "wukong", "rell", "rakan", "nautilus", "leona", "pantheon", "nocturne", "camille", "ambessa", "poppy"]);
  const pickThreats = new Set(["vi", "nautilus", "leona", "ahri", "annie", "thresh", "zoe", "taliyah", "pantheon"]);
  const enemyDiveCount = enemyChampionIds.filter((id) => diveThreats.has(id)).length;
  const enemyPickCount = enemyChampionIds.filter((id) => pickThreats.has(id)).length;

  let bias = 0;
  if (enemyDiveCount > 0) bias += enemyDiveCount * (selfProtection - 1.6) * 0.52;
  if (enemyPickCount > 0) bias += enemyPickCount * (selfProtection - 1.8) * 0.38;

  if (candidate.id === "xayah") bias += enemyDiveCount * 0.7;
  if (candidate.id === "sivir") bias += enemyPickCount * 0.55 + enemyDiveCount * 0.22;
  if (candidate.id === "ezreal") bias += (enemyDiveCount + enemyPickCount) * 0.32;
  if ((candidate.id === "aphelios" || candidate.id === "jinx" || candidate.id === "kogmaw") && (enemyDiveCount + enemyPickCount) >= 2) {
    bias -= 1.2 + (enemyDiveCount + enemyPickCount) * 0.24;
  }

  return clamp(bias, -4.5, 4.5);
}

function getRedSideResponseBias(candidate: Champion, game: DraftGameState, side: Side) {
  if (side !== "red") return 0;
  const enemyChampionIds = getEnemyChampionIds(game, side);
  if (enemyChampionIds.length === 0) return 0;

  let response = 0;
  for (const enemyChampionId of enemyChampionIds) {
    const goodVs = candidate.goodVs.find((item) => item.championId === enemyChampionId);
    if (goodVs) response += (goodVs.score ?? 3) * 0.75;

    const weakVs = candidate.weakVs.find((item) => item.championId === enemyChampionId);
    if (weakVs) response -= (weakVs.score ?? 3) * 0.35;
  }

  const enemyRolesShown = new Set<Role>();
  enemyChampionIds.forEach((enemyChampionId) => {
    const enemyChampion = championMap.get(enemyChampionId);
    if (enemyChampion?.roles.length === 1) enemyRolesShown.add(enemyChampion.roles[0]);
  });

  if (enemyRolesShown.size > 0 && candidate.roles.some((role) => enemyRolesShown.has(role))) {
    response += 1.5;
  }

  return clamp(response, 0, 10);
}

function getBanKeepOpenPenalty(candidate: Champion, side: Side, game: DraftGameState, series: ActiveDraftSeries) {
  if (side !== "blue") return 0;
  if (getSideChampionIds(game, side).length > 0) return 0;
  if (game.phaseIndex > 5) return 0;

  const metaPriority = getMetaPriorityScore(candidate);
  const blindPenalty = getBlindRiskPenalty(candidate, game, side, series);
  if (metaPriority < 7.75) return 0;
  return clamp(metaPriority * 0.95 - blindPenalty * 0.55, 0, 8);
}

function getRedSideDenyBonus(candidate: Champion, side: Side, game: DraftGameState) {
  if (side !== "red") return 0;
  if (getSideChampionIds(game, side).length > 0) return 0;
  if (game.phaseIndex > 5) return 0;

  const metaPriority = getMetaPriorityScore(candidate);
  const prioScore = clamp((candidate.stats.prioScore ?? 0) / 10, 0, 10);
  return clamp(metaPriority * 0.9 + prioScore * 0.45, 0, 10);
}

function getFlexPickBonus(candidate: Champion, game: DraftGameState, side: Side) {
  const pickNumber = getPickNumberForSide(game, side);
  if (pickNumber > 3) return 0;
  const multiRoleCount = candidate.roles.length;
  const metaPriority = getMetaPriorityScore(candidate);

  if (multiRoleCount < 2) return 0;
  return clamp(multiRoleCount * 1.8 + metaPriority * 0.25, 0, 6);
}


function getStrictEarlyMetaThreshold(game: DraftGameState, side: Side) {
  const pickNumber = getPickNumberForSide(game, side);
  if (pickNumber <= 1) return 5.9;
  if (pickNumber === 2) return 5.1;
  return 4.4;
}

function getOffMetaPriorityPenalty(args: {
  candidate: Champion;
  game: DraftGameState;
  side: Side;
  metaPriority: number;
  historyBias: number;
  matchupBias: number;
}) {
  const { candidate, game, side, metaPriority, historyBias, matchupBias } = args;
  const pickNumber = getPickNumberForSide(game, side);
  const enemyShown = getEnemyChampionIds(game, side).length;
  const prioScore = clamp((candidate.stats.prioScore ?? 0) / 10, 0, 10);
  const presence = Math.max(candidate.stats.presence ?? 0, (candidate.stats.picks ?? 0) + (candidate.stats.bans ?? 0));
  const avgPickRound = candidate.stats.avgPickRound ?? 5;
  const blindPickRate = candidate.stats.blindPickRate ?? 0;
  const roleLockedSoloLane = candidate.roles.length === 1 && (candidate.roles.includes("top") || candidate.roles.includes("mid"));

  let penalty = 0;

  if (pickNumber <= 3) {
    const strictThreshold = getStrictEarlyMetaThreshold(game, side);
    if (metaPriority < strictThreshold) penalty += (strictThreshold - metaPriority) * 4.8;
    if (prioScore < strictThreshold - 1.4) penalty += (strictThreshold - 1.4 - prioScore) * 3.4;

    if (pickNumber === 1) {
      if (presence < 12) penalty += (12 - presence) * 0.42;
      if (avgPickRound > 2.45) penalty += (avgPickRound - 2.45) * 3.2;
      if (blindPickRate < 30) penalty += (30 - blindPickRate) * 0.07;
    } else if (pickNumber === 2) {
      if (presence < 8) penalty += (8 - presence) * 0.34;
      if (avgPickRound > 2.85) penalty += (avgPickRound - 2.85) * 2.2;
      if (blindPickRate < 22) penalty += (22 - blindPickRate) * 0.05;
    } else {
      if (presence < 5) penalty += (5 - presence) * 0.26;
      if (avgPickRound > 3.15) penalty += (avgPickRound - 3.15) * 1.8;
    }

    if (enemyShown <= 1 && roleLockedSoloLane) penalty += 1.15;
  } else {
    if (metaPriority < 2.6) penalty += (2.6 - metaPriority) * 2.2;
    if (prioScore < 1.8) penalty += (1.8 - prioScore) * 1.5;
    if (presence <= 0) penalty += 1.2;
  }

  const rescueValue = Math.max(0, matchupBias - 2.4) * 1.45 + Math.max(0, historyBias - 4.8) * 0.42;
  penalty -= rescueValue;

  if (candidate.id === "talon") penalty += pickNumber <= 3 ? 6 : 3.5;
  if (candidate.id === "shen") penalty += pickNumber <= 2 ? 5 : 2.2;

  return clamp(penalty, 0, 24);
}

function shouldRestrictToMetaShortlist(step: DraftStep, game: DraftGameState) {
  if (step.action !== "pick") return false;
  const allyPicks = getSideChampionIds(game, step.side).length;
  const enemyPicks = getEnemyChampionIds(game, step.side).length;
  return allyPicks <= 1 || enemyPicks <= 1;
}

function scorePickCandidate(candidate: Champion, side: Side, game: DraftGameState, series: ActiveDraftSeries, save: DraftSave | null, config: DraftAiConfig): DraftCandidateBreakdown {
  const existingAllyChampionIds = getSideChampionIds(game, side);
  const allyChampionIds = [...existingAllyChampionIds, candidate.id];
  const enemyChampionIds = getEnemyChampionIds(game, side);
  const roster = getSideRoster(series, side, save);
  const currentOpenRoles = getExpectedOpenRoles(existingAllyChampionIds, roster);
  const projectedPlayer = getBestProjectedPlayer(candidate, currentOpenRoles, roster);

  const metaPriority = getMetaPriorityScore(candidate);
  const roleCoverageBonus = getRoleCoverageBonus(candidate, currentOpenRoles);
  const comfortScore = projectedPlayer ? getComfortScore(projectedPlayer, candidate) : 5;
  const playerFitScore = projectedPlayer ? getPlayerChampionFitScore(projectedPlayer.stats, candidate.playerScaling) : 5;

  const evaluation = evaluateTeamDraft({
    side,
    team: null,
    roster,
    playersById,
    championIds: allyChampionIds,
    enemyChampionIds,
    championMap,
  });

  const existingNeeds = evaluateNeedStatuses(existingAllyChampionIds);
  const nextNeeds = evaluateNeedStatuses(allyChampionIds);
  const existingMissing = existingNeeds.reduce((sum, item) => sum + item.missing, 0);
  const nextMissing = nextNeeds.reduce((sum, item) => sum + item.missing, 0);
  const needFill = clamp(existingMissing - nextMissing + 5, 0, 10);

  const mustWithTiming = getMustWithTimingScore(candidate, game, side, series);
  const blindRiskPenalty = getBlindRiskPenalty(candidate, game, side, series);
  const blueBias = getBlueSidePowerPickBias(candidate, game, side, series);
  const redBias = getRedSideResponseBias(candidate, game, side);
  const historyBias = getPlayerHistoryPickBias(candidate, projectedPlayer);
  const matchupBias = getProjectedMatchupPickBias(candidate, projectedPlayer, enemyChampionIds);
  const flexPickBonus = getFlexPickBonus(candidate, game, side);
  const carrySelfDefenseBias = getCarrySelfDefenseContextBias(candidate, enemyChampionIds);
  const offMetaPenalty = getOffMetaPriorityPenalty({
    candidate,
    game,
    side,
    metaPriority,
    historyBias,
    matchupBias,
  });
  const information = getInformationScore({ candidate, allyChampionIds: existingAllyChampionIds, metaPriority });
  const plan = getDraftPlan({ candidate, side, game, evaluation, enemyChampionIds });
  const preservationBonus = getCounterpickPreservationBonus({ candidate, openRoles: currentOpenRoles, allyChampionIds: existingAllyChampionIds });
  const protectionPenalty = inferCarryNeedPenalty({
    candidate,
    allyChampionIds,
    evaluation,
    championById: (championId) => championMap.get(championId) ?? null,
  });
  const executionPenalty = evaluation.executionDifficultyPenalty * 0.65 - evaluation.rosterExecutionScore * 0.18;

  const structuralValue =
    evaluation.damageBalanceScore * 0.85 +
    evaluation.engageScore * 0.68 +
    evaluation.frontlineScore * 0.62 +
    evaluation.roleCoverageScore * 0.7 +
    evaluation.executionEaseScore * 0.42 +
    evaluation.protectionScore * 0.55 +
    evaluation.antiDiveScore * 0.42 +
    evaluation.primaryEngageScore * 0.32 +
    evaluation.followUpScore * 0.28 +
    evaluation.rangeProfileScore * 0.15;

  const totalScore =
    metaPriority * config.metaWeight * (side === "blue" ? 1.1 : 0.95) +
    comfortScore * config.comfortWeight +
    playerFitScore * config.fitWeight +
    evaluation.synergyScore * config.synergyWeight +
    needFill * config.needWeight +
    evaluation.counterScore * config.counterWeight * (side === "red" ? 1.16 : 0.94) +
    structuralValue +
    roleCoverageBonus * 1.35 +
    mustWithTiming.bonus * 1.05 +
    blueBias * 1.18 +
    redBias * 1.28 +
    historyBias * 0.82 +
    matchupBias * 0.92 +
    carrySelfDefenseBias * 0.9 +
    flexPickBonus * 0.72 +
    plan.bias +
    (information.preserveBonus + preservationBonus) * 1.05 +
    information.forcedResponseBonus * 0.95 -
    offMetaPenalty * 1.28 -
    evaluation.weaknessPenalty * config.weaknessWeight -
    blindRiskPenalty * 1.24 -
    mustWithTiming.penalty * 1.38 -
    information.leakPenalty * 0.95 -
    protectionPenalty * 1.2 -
    Math.max(0, executionPenalty);

  const projectedRole = ROLE_ORDER.find((role) => candidate.roles.includes(role) && currentOpenRoles.includes(role)) ?? null;
  const reasonTags = [
    evaluation.compIdentity,
    plan.type,
    evaluation.damageBalanceScore >= 6 ? "damage-balance" : null,
    evaluation.engageScore >= 6 ? "engage" : null,
    evaluation.frontlineScore >= 6 ? "frontline" : null,
    evaluation.protectionScore >= 6 ? "protect" : null,
    matchupBias >= 1.5 ? "matchup" : null,
    carrySelfDefenseBias >= 1.4 ? "self-peel" : null,
    flexPickBonus >= 2 ? "flex" : null,
    redBias >= 2 ? "red-response" : null,
    blueBias >= 2 ? "blue-prio" : null,
    offMetaPenalty >= 6 ? "off-meta-tax" : null,
  ].filter(Boolean) as string[];

  return {
    championId: candidate.id,
    action: "pick",
    side,
    metaPriority,
    comfortScore,
    playerFitScore,
    compSynergy: evaluation.synergyScore,
    needFill,
    counterValue: evaluation.counterScore,
    weaknessPenalty: evaluation.weaknessPenalty + blindRiskPenalty + mustWithTiming.penalty + protectionPenalty,
    projectedRole,
    projectedPlayerId: projectedPlayer?.id ?? null,
    planType: plan.type,
    planBias: plan.bias,
    blindRiskPenalty,
    flexBonus: flexPickBonus,
    historyBias,
    matchupBias,
    sideBias: blueBias + redBias,
    informationLeakPenalty: information.leakPenalty,
    counterpickPreservationBonus: information.preserveBonus + preservationBonus,
    forcedResponseBonus: information.forcedResponseBonus,
    protectionPenalty,
    executionPenalty: Math.max(0, executionPenalty),
    reasonTags,
    totalScore,
  };
}

function scoreBanCandidate(candidate: Champion, side: Side, game: DraftGameState, series: ActiveDraftSeries, save: DraftSave | null, config: DraftAiConfig): DraftCandidateBreakdown {
  const enemySide: Side = side === "blue" ? "red" : "blue";
  const enemyChampionIds = getSideChampionIds(game, enemySide);
  const enemyRoster = getSideRoster(series, enemySide, save);
  const openRoles = getExpectedOpenRoles(enemyChampionIds, enemyRoster);
  const roleFitBonus = getBanRoleFitBonus(candidate, enemyChampionIds, enemyRoster);

  if (roleFitBonus <= -999) {
    return {
      championId: candidate.id,
      action: "ban",
      side,
      metaPriority: 0,
      comfortScore: 0,
      playerFitScore: 0,
      compSynergy: 0,
      needFill: 0,
      counterValue: 0,
      weaknessPenalty: 0,
      signatureThreat: 0,
      totalScore: -999,
    };
  }

  const projectedEnemyPlayer = getBestProjectedPlayer(candidate, openRoles, enemyRoster);
  const metaPriority = getMetaPriorityScore(candidate);
  const comfortScore = projectedEnemyPlayer ? getComfortScore(projectedEnemyPlayer, candidate) : 5;
  const playerFitScore = projectedEnemyPlayer ? getPlayerChampionFitScore(projectedEnemyPlayer.stats, candidate.playerScaling) : 5;

  let counterThreat = 5;
  for (const allyChampionId of getSideChampionIds(game, side)) {
    const allyChampion = getChampionById(allyChampionId);
    if (!allyChampion) continue;
    const relation = allyChampion.weakVs.find((item: { championId: string; score?: number }) => item.championId === candidate.id);
    if (relation) counterThreat += relation.score ?? 3;
  }

  const keepOpenPenalty = getBanKeepOpenPenalty(candidate, side, game, series);
  const redDenyBonus = getRedSideDenyBonus(candidate, side, game);
  const enemySignatureThreat = getEnemySignatureBanThreat(candidate, projectedEnemyPlayer);
  const enemyMatchupThreat = getEnemyMatchupSignatureBanThreat(candidate, projectedEnemyPlayer, getSideChampionIds(game, side));
  const seriesThreat = getSeriesAwareBanBonus(candidate.id, side, series);

  const openRolePressure = clamp((3 - openRoles.length) * 1.1, 0, 2.2);
  const targetedWindowBonus = roleFitBonus * (1 + openRolePressure * 0.35);

  const totalScore =
    metaPriority * config.metaWeight +
    comfortScore * config.comfortWeight +
    playerFitScore * config.fitWeight +
    counterThreat * config.banThreatWeight +
    enemySignatureThreat * 0.8 +
    enemyMatchupThreat * 1.05 +
    seriesThreat * 1.2 +
    redDenyBonus * 1.2 +
    targetedWindowBonus -
    keepOpenPenalty * 1.45;

  return {
    championId: candidate.id,
    action: "ban",
    side,
    metaPriority,
    comfortScore,
    playerFitScore,
    compSynergy: 0,
    needFill: 0,
    counterValue: counterThreat + redDenyBonus + enemySignatureThreat + enemyMatchupThreat + seriesThreat + targetedWindowBonus,
    weaknessPenalty: keepOpenPenalty,
    signatureThreat: enemySignatureThreat + enemyMatchupThreat + seriesThreat,
    totalScore,
  };
}

export function scoreDraftCandidate(candidate: Champion, step: DraftStep, game: DraftGameState, series: ActiveDraftSeries, save: DraftSave | null, config: DraftAiConfig = DEFAULT_AI_CONFIG): DraftCandidateBreakdown {
  if (step.action === "ban") {
    return scoreBanCandidate(candidate, step.side, game, series, save, config);
  }
  return scorePickCandidate(candidate, step.side, game, series, save, config);
}

export function chooseAiAction(pool: Champion[], step: DraftStep, game: DraftGameState, series: ActiveDraftSeries, save: DraftSave | null, config: DraftAiConfig = DEFAULT_AI_CONFIG): DraftCandidateBreakdown | null {
  let scopedPool = pool;
  if (step.action === "pick") {
    const currentPicks = getSideChampionIds(game, step.side);
    const strictRolePool = pool.filter((candidate) => canAssignPickedChampionsToUniqueRoles([...currentPicks, candidate.id]));
    if (strictRolePool.length > 0) scopedPool = strictRolePool;
  }

  const ranked = scopedPool
    .map((candidate) => scoreDraftCandidate(candidate, step, game, series, save, config))
    .sort((a, b) => b.totalScore - a.totalScore);

  if (step.action === "pick" && ranked.length > 1 && shouldRestrictToMetaShortlist(step, game)) {
    const bestScore = ranked[0]?.totalScore ?? -Infinity;
    const strictThreshold = getStrictEarlyMetaThreshold(game, step.side);
    const metaShortlist = ranked.filter((entry) => {
      const candidate = championMap.get(entry.championId);
      if (!candidate) return false;
      const prioScore = clamp((candidate.stats.prioScore ?? 0) / 10, 0, 10);
      return entry.totalScore >= bestScore - 8 && (entry.metaPriority >= strictThreshold || prioScore >= strictThreshold - 1.1);
    });

    if (metaShortlist.length > 0) {
      return metaShortlist[0] ?? ranked[0] ?? null;
    }
  }

  return ranked[0] ?? null;
}
