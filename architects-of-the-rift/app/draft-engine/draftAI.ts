import { teams } from "@/app/data/teams";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import type {
  ActiveDraftSeries,
  DraftCandidateBreakdown,
  DraftGameState,
  DraftSave,
  DraftStep,
  Side,
} from "./draftTypes";
import { DRAFT_SEQUENCE, ROLE_ORDER } from "./draftTypes";
import type { BanBucketId, PickBucketId } from "./draftTypes";
import type { DraftContext } from "./draftContext";
import { sumBuckets, UNIT_BAN_WEIGHTS, UNIT_PICK_WEIGHTS, type BucketWeights } from "./draftBuckets";
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
  type LockedRoles,
} from "./draftRoleResolver";
import { getBestOpenRoleGradeRank, getMasteryGate, getReassignmentCheck } from "./draftMasteryGate";
import { getCandidateIdentityFit, readCompIdentity } from "./compIdentity";
import { getWinConditionEffect } from "./winCondition";
import { getCompCounterValue, getEnemyIdentityBanBonus, getLosingLanesEffect } from "./compCounter";
import {
  getSeasonBestIdentity,
  getSeasonChampionThreat,
  getSeasonCounters,
  getSeasonThreatResponse,
  isSeasonFavorite,
  type SeasonThreatResponse,
} from "./seasonThreatSystem";
import {
  getBotDuoState,
  getDuoFallbackBonus,
  getDuoPickBonus,
  getEnemyDuoDenyBonus,
  type BotDuoOption,
  type BotDuoState,
} from "./botDuoPlan";
import { getUserPickCounts } from "./userDraftMemory";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import {
  getUserBanTargetBias,
  getUserPickPreferenceBias,
  getUserPreferredOpenRoleBias,
} from "./userDraftMemory";
import { getChampionRoleProfile } from "./championProfileSystem";
import { getChampionStatsForRole } from "./championRoleStatsSystem";
import {
  PROTECT_BAN_MAX,
  getAvailableCounterBlindRisk,
  getCounterProductiveBanValue,
  getDirectLaneCounterPenalty,
  getMatchupValueVsTeam,
  getProjectedEnemyRoles,
  getProtectOwnPickBanValue,
  getTeamPhaseWeights,
  type MatchupDetail,
} from "./matchupScoring";
import {
  MUSTWITH_CONFIG,
  getAllEligiblePartners,
  getMustWithDenyBonus,
  getNonBotMustWithBonus,
  getNonBotOverride,
  getUnavailableChampionIds,
  isExplicitBotPair,
  isProtectedOwnPartner,
  resolveMustWithLock,
  type EligiblePartner,
  type MustWithTeamContext,
} from "./mustWithPriority";
import {
  describeBadSynergy,
  describeMasteryBlock,
  describePlanAnchor,
  describeReassignment,
  describeSeasonBan,
  describeSeasonCounter,
  describeSeasonPlan,
} from "./draftDecisionExplainer";
import {
  derivePlayerArchetypeAffinity,
  derivePlayerAdaptationProfile,
} from "./playerProfileSystem";
import { getAdaptivePriorityBonus } from "./adaptivePrioritySystem";
import { getContestabilityPenalty } from "./draftContestability";
import { getDraftPhase, getPhaseBias } from "./draftPhase";
import { getDraftIntent } from "./draftIntentSystem";
import { getSeriesAwareBanBonus, getSeriesComfortRepeatThreat } from "./draftSeriesMemory";
import { inferCarryNeedPenalty, getBotLaneArchetypeFit } from "./draftCarryNeeds";
import { getBadSynergy, getTotalBadSynergy } from "./badSynergy";
import { getTrapBanReduction, getTrapCounterBonus } from "./trapDraftSystem";
import { chooseDraftPlan, getPlanAlignmentBonus, type DraftPlan, type DraftPlanType } from "./draftPlanSystem";
import { getSideAwareBonus, getFlexAmbiguityBonus } from "./sideAwareDraftSystem";
import {
  getPlanAdaptiveBanBonus,
  getContestedPickUrgency,
  getUserFavoriteBanBonus,
  deduceUserPlan,
} from "./advancedDraftReading";
import { evaluateRuleSynergy } from "./profileRuleEvaluator";
import { getPlayerChampionMatchupDraftBias } from "./playerHistoryEvaluator";
import {
  getMasteryPickBonus,
  getCachedTopSignatureSlot,
  getEnemyMasteryBanBonus,
  getOwnMasteryBanPenalty,
} from "./championMasteryDraftSystem";
import { getChampionMap } from "./championPool";
import {
  getCachedAdvancedContext,
  getPredictiveCounterBonus,
  getClutchAmplifierForSide,
  getTargetBanningBonus,
  getPredictiveBanBonus,
} from "./championMasteryAdvanced";


const playersById = new Map(players.map((player) => [player.id, player]));

/** §1.2 — rolurile blocate la pick ale echipei (`{}` pentru salvări vechi). */
export function getLockedRoles(game: DraftGameState, side: Side): LockedRoles {
  return (side === "blue" ? game.pickRolesBlue : game.pickRolesRed) ?? {};
}

/** Echipa e AI (nu userul)? Doar pentru AI folosim rolurile blocate ale adversarului. */
export function isAiSide(series: ActiveDraftSeries, side: Side) {
  return series.userSide !== side;
}

/** Tag-uri care scot un candidat din pick (§1.4 / §1.5), pe lângă `invalid-role-map`. */
export const BLOCKING_PICK_TAGS = ["invalid-role-map", "breaks-own-pick", "mastery-f"];
export const isBlockedPick = (entry: DraftCandidateBreakdown) =>
  BLOCKING_PICK_TAGS.some((tag) => entry.reasonTags?.includes(tag));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const planCache: Map<string, DraftPlan | null> = new Map();
/** Ultimul plan calculat înainte de blocare (§4.2), per serie:joc:side. */
const lastPlanBeforeLock: Map<string, DraftPlan | null> = new Map();

export function getCachedPlan(args: {
  side: Side;
  game: DraftGameState;
  series: ActiveDraftSeries;
  save: DraftSave | null;
}): DraftPlan | null {
  // DRAFT_THINKING §4.2: planul se recalculează după fiecare pick propriu și se blochează
  // după al 3-lea (de acolo toate pick-urile citesc aceeași intrare).
  const ownPickCount = getOwnState(args.game, args.side).picks.length;
  const lockAt = DRAFT_THINKING_CONFIG.plan.lockAfterOwnPicks;
  const baseKey = `${args.series.seriesId}:g${args.series.currentGameNumber}:${args.side}`;
  const cacheKey = `${baseKey}:p${Math.min(ownPickCount, lockAt)}`;
  if (planCache.has(cacheKey)) return planCache.get(cacheKey) ?? null;

  const aiTeamSlug = getTeamSlugForSide(args.series, args.side);
  const userTeamSlug = getTeamSlugForSide(args.series, args.side === "blue" ? "red" : "blue");
  const aiRoster = getTeamRosterFromSources({ teamSlug: aiTeamSlug, save: args.save });
  const userRoster = getTeamRosterFromSources({ teamSlug: userTeamSlug, save: args.save });

  const plan = chooseDraftPlan({
    side: args.side,
    game: args.game,
    series: args.series,
    aiRoster,
    userRoster,
    save: args.save,
    lockedPlan: ownPickCount >= lockAt ? lastPlanBeforeLock.get(baseKey) ?? null : null,
    // §7: un favorit de sezon al echipei contează ca priority pick; planul ține cont de stilul de sezon al lor.
    isSeasonFavorite: (championId) => isSeasonFavorite(aiTeamSlug, championId, aiRoster),
    seasonEnemyBestIdentity: getSeasonBestIdentity(userTeamSlug),
  });

  if (ownPickCount < lockAt) lastPlanBeforeLock.set(baseKey, plan);
  if (planCache.size > 500) planCache.clear();
  if (lastPlanBeforeLock.size > 500) lastPlanBeforeLock.clear();
  planCache.set(cacheKey, plan);
  return plan;
}

// Call planCache.clear() at the start of each new game if needed.
// (Not required — cache key includes game number)

function getTeamSlugForSide(series: ActiveDraftSeries, side: Side) {
  return side === "blue" ? series.blueTeamSlug : series.redTeamSlug;
}

export function getTeamRosterFromSources({
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
  roster: Partial<Record<Role, string>>,
  lockedRoles?: LockedRoles
) {
  const preferredRoles = getPreferredRolesForChampion(ownPicks, candidate.id, roster, lockedRoles);
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
  roster: Partial<Record<Role, string>>,
  lockedRoles?: LockedRoles
) {
  const openRolesBefore = getOpenRolesForPickedChampions(ownPicks, roster, lockedRoles);
  const openRolesAfter = getOpenRolesForPickedChampions([...ownPicks, candidate.id], roster, lockedRoles);
  const ownPickNumber = getCurrentPickNumberForSide(game, side);

  if (!projectedRole) return -8;
  if (!openRolesBefore.includes(projectedRole)) return 1.5;

  let value = (openRolesBefore.length - openRolesAfter.length) * 4.2;

  if (ownPickNumber <= 2) {
    if (projectedRole === "jungle") value += 2.2;
    if (projectedRole === "adc" || projectedRole === "support") value += 2.8; // Increased from 1.2
  }
  // NEW: if ADC/support still not picked at pick 3, extra urgency
  if (ownPickNumber === 3) {
    if (projectedRole === "adc" || projectedRole === "support") value += 1.8;
  }

  if (ownPickNumber <= 3 && (projectedRole === "top" || projectedRole === "mid")) {
    const lastPickHeld = hasAbsoluteLastPick(game, side) || hasCurrentSideLastRotation(game, side);
    if (!lastPickHeld && candidate.roles.length === 1) {
      value += 0.9;
    }
  }

  // DRAFT FINAL FIX 4: At picks 4-5, filling the LAST open role is critical
  // If only 1-2 roles remain open, champion that fills one = big bonus
  if (ownPickNumber >= 4 && openRolesAfter.length < openRolesBefore.length) {
    // Each role filled at pick 4+ is worth extra
    value += (openRolesBefore.length - openRolesAfter.length) * 3.5;
  }
  // If at pick 5 and role is still open, massive urgency
  if (ownPickNumber === 5 && openRolesBefore.includes(projectedRole)) {
    value += 5.0;
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

function getBlindRiskPenalty(
  game: DraftGameState,
  side: Side,
  candidate: Champion,
  projectedRole: Role | null,
  unavailable: ReadonlySet<string>
) {
  if (!projectedRole) return 0;

  const ownPickNumber = getCurrentPickNumberForSide(game, side);
  const safeBlind = clamp((getChampionStatsForRole(candidate, projectedRole).blindPickRate ?? 45) / 10, 0, 10);

  let penalty = 0;
  if (ownPickNumber < 4 && (projectedRole === "top" || projectedRole === "mid")) {
    penalty = clamp((6.8 - safeBlind) * 0.95, 0, 4.2);
  }

  // Counteri de nota 4/5 pe rolul proiectat, încă disponibili, pe roluri inamice încă libere.
  const enemyPicks = side === "blue" ? game.picksRed : game.picksBlue;
  const filledEnemyRoles = new Set(getProjectedEnemyRoles(enemyPicks).values());
  const openEnemyRoles = ROLE_ORDER.filter((role) => !filledEnemyRoles.has(role));
  penalty += getAvailableCounterBlindRisk(
    candidate.id,
    projectedRole,
    (championId) => !unavailable.has(championId),
    openEnemyRoles
  );

  return penalty;
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

    const directSynergy =
      candidate.synergyWith?.find(
        (entry: { championId: string; score?: number }) => entry.championId === picked.id
      )?.score ?? 0;
    const reverseSynergy =
      picked.synergyWith?.find(
        (entry: { championId: string; score?: number }) => entry.championId === candidate.id
      )?.score ?? 0;
    synergy += directSynergy * 0.38;
    synergy += reverseSynergy * 0.38;
  }

  // UPGRADE 11: subtract known bad synergies
  synergy -= getTotalBadSynergy(candidate.id, ownPicks) * 0.55;

  return clamp(synergy, 0, 10);
}

// ─── MUSTWITH STATE (DRAFT_REWORK §5) ────────────────────────────────────────
// Partenerii eligibili ai ambelor echipe, calculați o singură dată pe tură.
export type MustWithTurnState = {
  own: MustWithTeamContext;
  ownPartners: EligiblePartner[];
  enemy: MustWithTeamContext;
  enemyPartners: EligiblePartner[];
  /** §5.4: excepția care poate depăși partenerul non-bot (null = nicio excepție). */
  nonBotOverride: string | null;
  /** DRAFT_THINKING §2 — duo-urile bot ale ambelor echipe. */
  ownDuo: BotDuoState;
  enemyDuo: BotDuoState;
  /** Override-ul de botlane (§5.2) există pe tura asta? (fallback-ul §2.3 doar fără el) */
  hasMustWithLock: boolean;
  /** §2.4 — deny pe noul duo al inamicului: inamicul e AI sau userul joacă des duo-ul. */
  isEnemyDuoRelevant: (duo: BotDuoOption) => boolean;
  bans: string[];
};

const mustWithStateCache = new Map<string, MustWithTurnState>();

export function getCachedMustWithState(
  series: ActiveDraftSeries,
  game: DraftGameState,
  side: Side,
  save: DraftSave | null
): MustWithTurnState {
  const enemySide: Side = side === "blue" ? "red" : "blue";
  const ownRoster = getTeamRosterFromSources({ teamSlug: getTeamSlugForSide(series, side), save });
  const enemyRoster = getTeamRosterFromSources({ teamSlug: getTeamSlugForSide(series, enemySide), save });
  const key = [
    series.seriesId,
    series.currentGameNumber,
    side,
    game.picksBlue.join(","),
    game.picksRed.join(","),
    game.bansBlue.join(","),
    game.bansRed.join(","),
    ROLE_ORDER.map((role) => ownRoster[role] ?? "").join(","),
    ROLE_ORDER.map((role) => enemyRoster[role] ?? "").join(","),
    JSON.stringify(getLockedRoles(game, side)),
    isAiSide(series, enemySide) ? JSON.stringify(getLockedRoles(game, enemySide)) : "user",
  ].join("|");

  const cached = mustWithStateCache.get(key);
  if (cached) return cached;

  const unavailable = getUnavailableChampionIds(series, game);
  const own: MustWithTeamContext = {
    ownPicks: getOwnState(game, side).picks,
    roster: ownRoster,
    unavailable,
    lockedRoles: getLockedRoles(game, side),
  };
  // §1.2: rolurile blocate ale adversarului doar dacă e AI (intenția userului nu o știm).
  const enemy: MustWithTeamContext = {
    ownPicks: getOwnState(game, enemySide).picks,
    roster: enemyRoster,
    unavailable,
    ...(isAiSide(series, enemySide) ? { lockedRoles: getLockedRoles(game, enemySide) } : {}),
  };
  const ownPartners = getAllEligiblePartners(own);
  const bans = [...game.bansBlue, ...game.bansRed];
  const state: MustWithTurnState = {
    own,
    ownPartners,
    enemy,
    enemyPartners: getAllEligiblePartners(enemy),
    nonBotOverride: ownPartners.some((partner) => !partner.isBotPair) ? getNonBotOverride(own, enemy) : null,
    ownDuo: getBotDuoState(own, bans),
    enemyDuo: getBotDuoState(enemy, bans),
    hasMustWithLock: resolveMustWithLock(own) !== null,
    isEnemyDuoRelevant: (duo) => {
      if (isAiSide(series, enemySide)) return true;
      const counts = getUserPickCounts();
      const min = DRAFT_THINKING_CONFIG.duo.userDuoMinPicks;
      return (counts[duo.adcId] ?? 0) >= min && (counts[duo.supportId] ?? 0) >= min;
    },
    bans,
  };

  if (mustWithStateCache.size > 200) mustWithStateCache.clear();
  mustWithStateCache.set(key, state);
  return state;
}

// ─── MEMORIA SEZONULUI (DRAFT_THINKING §7) ───────────────────────────────────
export type SeasonTurnState = {
  enemyTeamName: string;
  responses: SeasonThreatResponse[];
  /** Counteri pregătiți pentru favoriții lor încă liberi: counterId → favoritul. */
  ready: Map<string, string>;
  /** Counteri pentru favoriții pe care i-au luat deja: counterId → favoritul + W–L. */
  punish: Map<string, { championId: string; wins: number; games: number; threat: number }>;
};

const seasonStateCache = new Map<string, SeasonTurnState>();

export function getCachedSeasonState(series: ActiveDraftSeries, game: DraftGameState, side: Side, save: DraftSave | null): SeasonTurnState {
  const enemySide: Side = side === "blue" ? "red" : "blue";
  const enemyTeamSlug = getTeamSlugForSide(series, enemySide);
  const ownRoster = getTeamRosterFromSources({ teamSlug: getTeamSlugForSide(series, side), save });
  const enemyRoster = getTeamRosterFromSources({ teamSlug: enemyTeamSlug, save });
  const key = [series.seriesId, series.currentGameNumber, side, game.phaseIndex, game.picksBlue.join(","), game.picksRed.join(","), game.bansBlue.join(","), game.bansRed.join(",")].join("|");
  const cached = seasonStateCache.get(key);
  if (cached) return cached;

  const unavailable = getUnavailableChampionIds(series, game);
  const responses = getSeasonThreatResponse({ enemyTeamSlug, enemyRoster, ownRoster, unavailable });
  const ready = new Map<string, string>();
  for (const response of responses) {
    if (response.kind !== "plan") continue;
    for (const counterId of response.counterIds) if (!ready.has(counterId)) ready.set(counterId, response.championId);
  }
  const punish = new Map<string, { championId: string; wins: number; games: number; threat: number }>();
  const enemyPicks = getOwnState(game, enemySide).picks;
  const enemyAssignments = resolveRoleAssignments(enemyPicks, enemyRoster, isAiSide(series, enemySide) ? getLockedRoles(game, enemySide) : undefined);
  for (const championId of enemyPicks) {
    const threat = getSeasonChampionThreat(enemyTeamSlug, championId, enemyRoster);
    if (threat.threat < DRAFT_THINKING_CONFIG.season.threatThreshold) continue;
    const role = (ROLE_ORDER.find((entry) => enemyAssignments[entry] === championId) ?? threat.role) as Role | null;
    for (const counterId of getSeasonCounters(championId, role, ownRoster, unavailable).counterIds) {
      if (!punish.has(counterId)) punish.set(counterId, { championId, wins: threat.wins, games: threat.games, threat: threat.threat });
    }
  }
  const team = teams.find((entry) => entry.slug === enemyTeamSlug);
  const state: SeasonTurnState = { enemyTeamName: team?.abbreviation ?? team?.name ?? enemyTeamSlug, responses, ready, punish };
  if (seasonStateCache.size > 200) seasonStateCache.clear();
  seasonStateCache.set(key, state);
  return state;
}

function getCounterValueScore(args: {
  enemyPicks: string[];
  candidate: Champion;
  projectedRole: Role | null;
  ownPicks: string[];
  projectedPlayerId: string | null;
  enemyRoster: Partial<Record<Role, string>>;
}): { score: number; details: MatchupDetail[] } {
  const role = args.projectedRole ?? args.candidate.roles[0] ?? null;
  if (!role || args.enemyPicks.length === 0) return { score: 5, details: [] };

  const { total, details } = getMatchupValueVsTeam(args.candidate.id, role, args.enemyPicks, {
    phaseWeights: getTeamPhaseWeights(args.ownPicks, args.candidate.id),
    ownAllyIds: [...args.ownPicks, args.candidate.id],
    ownPlayerId: args.projectedPlayerId,
    enemyRoster: args.enemyRoster,
  });

  return { score: clamp(total + 5, 0, 10), details };
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

function getOffMetaPenalty(
  candidate: Champion,
  series: ActiveDraftSeries,
  projectedRole: Role | null
): number {
  const stats = getChampionStatsForRole(candidate, projectedRole);
  const effectivePresence = Math.max(
    stats.presence ?? 0,
    stats.picks + stats.bans
  );
  if (effectivePresence <= 0) return 6.5;

  const picks = stats.picks ?? 0;
  const proWinRate = stats.proWinRate ?? null;

  const presenceRate = effectivePresence / Math.max(1, 80);
  const isOffMeta = presenceRate < 0.18 || picks < 7;
  const isVeryOffMeta = presenceRate < 0.10 || picks < 3;

  if (!isOffMeta) return 0;

  let penalty = isVeryOffMeta ? 10.5 : 6.0;

  if (proWinRate !== null && proWinRate >= 0.55 && picks >= 4) {
    penalty *= 0.65;
  } else if (proWinRate !== null && proWinRate >= 0.52 && picks >= 5) {
    penalty *= 0.80;
  }

  const soloqWR = stats.soloqKrChallengerWinRate ?? null;
  if (soloqWR !== null && soloqWR >= 53) {
    const soloqDiscount = clamp((soloqWR - 52) / 15, 0.05, 0.20);
    penalty *= (1 - soloqDiscount);
  }

  const csDiff = stats.csDiffAt15 ?? null;
  const goldDiff = stats.goldDiffAt15 ?? null;
  if (csDiff !== null && csDiff >= 8) penalty *= 0.92;
  if (goldDiff !== null && goldDiff >= 300) penalty *= 0.92;

  const gameNumber = series.currentGameNumber ?? 1;
  if (gameNumber >= 5) penalty *= 0.25;
  else if (gameNumber >= 4) penalty *= 0.40;
  else if (gameNumber >= 3) penalty *= 0.65;
  else if (gameNumber >= 2) penalty *= 0.90;

  return clamp(penalty, 0, 12);
}

function getArchetypeAffinityScore(
  roster: Partial<Record<Role, string>>,
  projectedRole: Role | null,
  candidate: Champion
): number {
  if (!projectedRole) return 0;

  const playerId = roster[projectedRole];
  if (!playerId) return 0;

  const player = playersById.get(playerId);
  if (!player) return 0;

  const archetype = derivePlayerArchetypeAffinity(player);
  const profile = getChampionRoleProfile(candidate, projectedRole);
  if (!profile) return 0;

  const tags = new Set(profile.tags ?? []);
  let affinitySum = 0;
  let matchCount = 0;

  // Map champion tags to player archetype scores
  const tagMap: Array<[string, number]> = [
    ["engage", archetype.engage],
    ["enchanter", archetype.enchanter],
    ["frontline", archetype.tank],
    ["tank", archetype.tank],
    ["dive", archetype.dive],
    ["dps", archetype.carry],
    ["burst", archetype.carry],
    ["poke", archetype.poke],
    ["setup", archetype.setup],
    ["utility", archetype.utility],
    ["warden", archetype.enchanter],
    ["pick", archetype.setup],
    ["zone-control", archetype.poke],
    ["follow-up", archetype.dive],
    ["anti-dive", archetype.tank],
    ["peel", archetype.enchanter],
  ];

  for (const [tag, affinity] of tagMap) {
    if (tags.has(tag)) {
      affinitySum += affinity;
      matchCount += 1;
    }
  }

  if (matchCount === 0) return 0;

  // Average affinity across matched tags, centered at 5
  const avgAffinity = affinitySum / matchCount;
  // Return a score from -3 to +3 (centered at 0)
  return clamp((avgAffinity - 5) * 0.6, -3, 3);
}

function getComboDependencyPenalty(
  ownPicks: string[],
  candidate: Champion,
  projectedRole: Role | null
): number {
  const profile = getChampionRoleProfile(candidate, projectedRole);
  if (!profile?.comboDependency) return 0;

  const dep = profile.comboDependency;
  let penalty = 0;

  // Check each dependency against existing picks
  const pickedProfiles = ownPicks
    .map((id) => {
      const champ = getChampionById(id);
      if (!champ) return null;
      return getChampionRoleProfile(champ);
    })
    .filter(Boolean);

  const allTags = new Set(pickedProfiles.flatMap((p) => p?.tags ?? []));

  // needsKnockup: check for allies with knockup CC
  if ((dep.needsKnockup ?? 0) >= 5) {
    const hasKnockup = pickedProfiles.some((p) =>
      p?.abilities?.some((a) =>
        a.effects?.some((e) => e.type === "knockup" && e.strength >= 6)
      )
    );
    if (!hasKnockup) {
      // Only penalize if we've already picked enough allies that knockup SHOULD exist
      if (ownPicks.length >= 2) {
        penalty += (dep.needsKnockup ?? 0) * 0.65;
      }
    }
  }

  // needsEngage
  if ((dep.needsEngage ?? 0) >= 5 && !allTags.has("engage")) {
    if (ownPicks.length >= 2) penalty += (dep.needsEngage ?? 0) * 0.35;
  }

  // needsFrontline
  if ((dep.needsFrontline ?? 0) >= 5 && !allTags.has("frontline")) {
    if (ownPicks.length >= 2) penalty += (dep.needsFrontline ?? 0) * 0.3;
  }

  // needsPeel
  if ((dep.needsPeel ?? 0) >= 5 && !allTags.has("peel") && !allTags.has("warden") && !allTags.has("enchanter")) {
    if (ownPicks.length >= 3) penalty += (dep.needsPeel ?? 0) * 0.3;
  }

  // needsEnchanter
  if ((dep.needsEnchanter ?? 0) >= 5 && !allTags.has("enchanter")) {
    if (ownPicks.length >= 3) penalty += (dep.needsEnchanter ?? 0) * 0.3;
  }

  return clamp(penalty, 0, 8);
}

/**
 * Coerența candidatului cu identitatea emergentă a compoziției (DRAFT_THINKING §3):
 * aceeași sursă ca planul și evaluatorul (`readCompIdentity` + `getCandidateIdentityFit`);
 * acoperă toate cele 6 identități, inclusiv teamfight și protect-carry.
 */
function getWinConditionCoherenceScore(
  ownPicks: string[],
  candidate: Champion,
  projectedRole: Role | null,
  ownAssignments?: Partial<Record<Role, string>>
): number {
  if (ownPicks.length < 2) return 0; // Too early to have a clear identity

  const identity = readCompIdentity(ownPicks, ownAssignments);
  if (!identity.dominant) return 0; // No clear identity yet

  // §5.1: efectul crește cu cât identitatea e mai clară și spre ultimele pick-uri.
  const cohesion = DRAFT_THINKING_CONFIG.cohesion;
  const commitment = DRAFT_THINKING_CONFIG.plan.commitmentByPick[Math.min(4, ownPicks.length)];
  const fit = getCandidateIdentityFit(candidate, projectedRole, identity.dominant);
  return clamp(fit * cohesion.coherenceFitFactor * identity.strength * commitment, cohesion.coherenceClamp[0], cohesion.coherenceClamp[1]);
}

/**
 * §5.2 — compoziția nu era împărțită, dar devine (două identități incompatibile,
 * aproape egale) cu candidatul → penalizare și explicație.
 */
function getSplitIdentityPenalty(
  ownPicks: string[],
  candidate: Champion,
  roster: Partial<Record<Role, string>>,
  lockedRoles: LockedRoles
): { penalty: number; line: string | null } {
  if (ownPicks.length === 0) return { penalty: 0, line: null };
  const before = readCompIdentity(ownPicks, resolveRoleAssignments(ownPicks, roster, lockedRoles));
  if (before.split) return { penalty: 0, line: null };
  const afterRoles = resolveRoleAssignments([...ownPicks, candidate.id], roster, lockedRoles);
  const after = readCompIdentity([...ownPicks, candidate.id], afterRoles);
  if (!after.split || !after.dominant || !after.runnerUp) return { penalty: 0, line: null };

  const cohesion = DRAFT_THINKING_CONFIG.cohesion;
  const penalty = ownPicks.length + 1 <= 2 ? cohesion.splitPenalty : cohesion.splitPenaltyLate;
  const role = (ROLE_ORDER.find((entry) => afterRoles[entry] === candidate.id) ?? null) as Role | null;
  const candidateSide =
    getCandidateIdentityFit(candidate, role, after.dominant) >= getCandidateIdentityFit(candidate, role, after.runnerUp)
      ? after.dominant
      : after.runnerUp;
  const compSide = candidateSide === after.dominant ? after.runnerUp : after.dominant;
  const anchor = getChampionById(ownPicks[0])?.name ?? ownPicks[0];
  return { penalty, line: `${candidate.name} ar amesteca ${candidateSide} în comp-ul de ${compSide} (${anchor})` };
}

export function scorePickCandidate(
  candidate: Champion,
  ctx: DraftContext,
  weights: BucketWeights = UNIT_PICK_WEIGHTS
): DraftCandidateBreakdown {
  const { step, game, series, config } = ctx;
  const ownState = { picks: ctx.own.picks };
  const enemyState = { picks: ctx.enemy.picks };
  const teamSlug = ctx.own.teamSlug;
  const roster = ctx.own.roster;

  const lockedRoles = getLockedRoles(game, step.side);
  const canFit = canPickChampionIntoUniqueRoles(ownState.picks, candidate.id, roster, lockedRoles);
  const totalPicksSoFar = game.picksBlue.length + game.picksRed.length;
  const draftPhase = getDraftPhase(totalPicksSoFar + 1);
  const phaseBias = getPhaseBias(draftPhase);
  const adjustedConfig = {
    ...config,
    metaWeight: config.metaWeight * phaseBias.metaWeight,
    counterWeight: config.counterWeight * phaseBias.counter,
    synergyWeight: config.synergyWeight * phaseBias.compIdentity,
  };
  const projected = getProjectedRoleAndPlayer(candidate, ownState.picks, roster, lockedRoles);
  // §1.4 / §1.5: reasignarea pick-urilor proprii + gate-ul de mastery pe candidat.
  const reassignment = getReassignmentCheck(ownState.picks, candidate.id, roster, lockedRoles);
  const masteryGate = getMasteryGate(projected.projectedPlayer, candidate.id, projected.projectedRole);
  // ── MASTERY: resolve top signature slot for this team (cached) ──────────
  const projectedPlayer = projected.projectedPlayer;

  const topSignatureSlot = getCachedTopSignatureSlot({
    game,
    side: step.side,
    roster,
    availableChampions: getChampionMap(),
  });

  // ── MASTERY ADVANCED: clutch context + draft reading (cached per turn) ──
  const enemyRosterForAdv = ctx.enemy.roster;
  const advCtx = getCachedAdvancedContext({
    game,
    side: step.side,
    series,
    enemyRoster: enemyRosterForAdv,
  });
  const clutchAmp = getClutchAmplifierForSide(series, step.side);

  // ── MASTERY: compute pick bonus (continuous + signature pull) ───────────
  const ownPickChampions = ownState.picks
    .map((id) => getChampionById(id))
    .filter((c): c is Champion => Boolean(c));

  const masteryPick = getMasteryPickBonus({
    player: projectedPlayer,
    candidate,
    side: step.side,
    pickNumber: totalPicksSoFar + 1,
    ownPicks: ownPickChampions,
    counterValue: 0, // will be overwritten below after counterValue is computed
    topSignatureSlot,
    clutchAmplifier: clutchAmp,
  });
  const metaPriority = clamp(getMetaPriorityScore(candidate, projected.projectedRole), 0, 10);
  const identityBias = getIdentityBias(teamSlug, candidate);
  const flexBonus = candidate.roles.length >= 2 ? 1.8 : 0.35;

  const roleCoverage = getRoleCoverageUrgency(
    game,
    step.side,
    ownState.picks,
    candidate,
    projected.projectedRole,
    roster,
    lockedRoles
  );

  const counterpickPreservationBase = getCounterpickPreservationBonus(
    game,
    step.side,
    candidate,
    projected.projectedRole,
    enemyState.picks
  );
  // 4.1: inamicul are deja pe rolul nostru un counter de nota 4/5 → penalizare suplimentară.
  const directLaneCounterPenalty = getDirectLaneCounterPenalty(
    candidate.id,
    projected.projectedRole,
    enemyState.picks
  );
  const counterpickPreservationBonus = counterpickPreservationBase - directLaneCounterPenalty;

  const mustWithState = ctx.mustWith;

  const blindRiskPenalty = getBlindRiskPenalty(
    game,
    step.side,
    candidate,
    projected.projectedRole,
    mustWithState.own.unavailable
  );

  const { comfortScore, playerFitScore, projectedPlayerId } = getProjectedPlayerScores(
    roster,
    projected.projectedRole,
    candidate
  );

  const compSynergy = getCompSynergyScore(ownState.picks, candidate);
  const badSynergies = ownState.picks.flatMap((pickedId) => {
    const relation = getBadSynergy(candidate.id, pickedId);
    return relation ? [{ partnerId: pickedId, level: relation.level, note: relation.note }] : [];
  });
  const needFill = getNeedFillScore(ownState.picks, candidate);
  const counterResult = getCounterValueScore({
    enemyPicks: enemyState.picks,
    candidate,
    projectedRole: projected.projectedRole,
    ownPicks: ownState.picks,
    projectedPlayerId,
    enemyRoster: enemyRosterForAdv,
  });
  const counterValue = counterResult.score;
  // ── MASTERY: re-compute pick bonus with the actual counterValue ─────────
  const masteryPickFinal = getMasteryPickBonus({
    player: projectedPlayer,
    candidate,
    side: step.side,
    pickNumber: totalPicksSoFar + 1,
    ownPicks: ownPickChampions,
    counterValue,
    topSignatureSlot,
    clutchAmplifier: clutchAmp,
  });
  // ── MASTERY ADVANCED: predictive counter prep ───────────────────────────
  const predictiveCounter = getPredictiveCounterBonus({
    candidate,
    candidateRole: projected.projectedRole,
    predictions: advCtx.enemyPredictions,
  });
  const weaknessPenalty = getWeaknessPenalty(enemyState.picks, candidate);
  const offMetaPenalty = getOffMetaPenalty(candidate, series, projected.projectedRole);
  const archetypeAffinity = getArchetypeAffinityScore(roster, projected.projectedRole, candidate);
  const comboDependencyPenalty = getComboDependencyPenalty(ownState.picks, candidate, projected.projectedRole);
  const winConditionCoherence = getWinConditionCoherenceScore(
    ownState.picks,
    candidate,
    projected.projectedRole,
    ctx.own.assignments
  );
  const proPickTiming = getProPickTimingBonus(candidate, game, step.side, projected.projectedRole);
  // §7.4: memoria sezonului — counter pregătit / pedepsit, propriii favoriți de sezon.
  const seasonState = ctx.season;
  const seasonPunish = seasonState.punish.get(candidate.id) ?? null;
  const seasonReady = !seasonPunish && seasonState.ready.has(candidate.id);
  const ownSeasonThreat = getSeasonChampionThreat(teamSlug, candidate.id, roster).threat;
  const seasonPickBonus =
    (seasonPunish ? DRAFT_THINKING_CONFIG.season.counterPunishBonus : 0) +
    (seasonReady ? DRAFT_THINKING_CONFIG.season.counterReadyBonus : 0) +
    Math.min(ownSeasonThreat * DRAFT_THINKING_CONFIG.season.ownComfortWeight, DRAFT_THINKING_CONFIG.season.ownComfortCap);
  // §5.2 / §5.3: identitate împărțită și win condition.
  const splitIdentity = getSplitIdentityPenalty(ownState.picks, candidate, roster, lockedRoles);
  const ownIdentity = ctx.own.identity;
  const winCondition = ctx.ownWinCondition;
  const winConditionEffect = getWinConditionEffect(candidate, winCondition, ownState.picks);

  const adaptivePriority = getAdaptivePriorityBonus({
    candidate,
    side: step.side,
    game,
    enemyChampionIds: enemyState.picks,
  });

  const contestability = getContestabilityPenalty({
    candidate,
    side: step.side,
    game,
    series,
    allyChampionIds: ownState.picks,
    enemyChampionIds: enemyState.picks,
    projectedRole: projected.projectedRole,
    mustWithContext: mustWithState.own,
  });

  // UPGRADE 12: Draft plan alignment
  const draftPlan = ctx.plan;
  const planAlignment = getPlanAlignmentBonus(
    candidate,
    projected.projectedRole,
    draftPlan,
    getCurrentPickNumberForSide(game, step.side)
  );

  // UPGRADE 12: Side-aware drafting
  const sideAware = getSideAwareBonus({
    candidate,
    side: step.side,
    game,
    projectedRole: projected.projectedRole,
    counterValue,
  });

  // UPGRADE 12: Flex ambiguity bonus for early picks
  const flexAmbiguity = getFlexAmbiguityBonus({
    candidate,
    side: step.side,
    game,
  });

  // UPGRADE 13: Contested pick urgency — bonus for champions user also wants
  const contestedUrgency = getContestedPickUrgency({
    candidate,
    plan: draftPlan,
    series,
    userSide: step.side === "blue" ? "red" : "blue",
    currentPickNumber: getCurrentPickNumberForSide(game, step.side),
  });

  // DRAFT_THINKING §6: comp counter (înlocuiește counterUserPlanBonus; și AI vs AI), fără tunnel vision,
  // plus bilanțul liniilor („still losing matchups”).
  const enemyAssignmentsForComp = ctx.enemy.assignments;
  const ownAssignmentsWithCandidate = resolveRoleAssignments([...ownState.picks, candidate.id], roster, lockedRoles);
  const compCounter = getCompCounterValue({
    candidate,
    role: projected.projectedRole,
    ownPicks: ownState.picks,
    ownAssignmentsWithCandidate,
    enemyPicks: enemyState.picks,
    enemyAssignments: enemyAssignmentsForComp,
  });
  const losingLanes = getLosingLanesEffect({
    candidate,
    role: projected.projectedRole,
    ownAssignments: ownAssignmentsWithCandidate,
    enemyAssignments: enemyAssignmentsForComp,
  });

  // DRAFT FINAL FIX 1: evaluateRuleSynergy — rich synergy rules
  // "Sejuani + 2 melee = bonus", "Zeri without protection = don't pick"
  // Computed with current picks + candidate vs enemy picks
  let ruleSynergyBonus = 0;
  if (ownState.picks.length >= 1) {
    const allyChamps = [...ownState.picks, candidate.id]
      .map((id) => getChampionById(id))
      .filter(Boolean) as Champion[];
    const enemyChamps = enemyState.picks
      .map((id) => getChampionById(id))
      .filter(Boolean) as Champion[];
    // evaluateRuleSynergy returns 0-10, centered at 5
    const ruleScore = evaluateRuleSynergy(allyChamps, enemyChamps);
    ruleSynergyBonus = clamp((ruleScore - 5) * 0.55, -2.5, 2.5);
  }

  // DRAFT FINAL FIX 2: matchup history memory
  // If Faker on Azir has beaten Orianna 3 times, bonus when picking Azir into Orianna
  let matchupHistoryBias = 0;
  if (projectedPlayerId && enemyState.picks.length > 0) {
    matchupHistoryBias = clamp(
      getPlayerChampionMatchupDraftBias(projectedPlayerId, candidate.id, enemyState.picks) * 1.8,
      -1.5, 1.5
    );
  }

  const carryNeedEvaluation = {
    protectionScore: 5,
    antiDiveScore: 5,
    frontlineScore: 5,
  } as Parameters<typeof inferCarryNeedPenalty>[0]["evaluation"];

  const carryNeedPenalty = inferCarryNeedPenalty({
    candidate,
    allyChampionIds: ownState.picks,
    evaluation: carryNeedEvaluation,
    championById: getChampionById,
  });

  // UPGRADE 8A: Trap counter bonus — if enemy picked the bait, counter it
  const trapCounter = getTrapCounterBonus(candidate, game, series, step.side, projected.projectedRole);

  let botLaneFitBonus = 0;
  if (projected.projectedRole === "support" || projected.projectedRole === "adc") {
    const currentPicks = [...ownState.picks, candidate.id];
    const botAssignments = resolveRoleAssignments(currentPicks, roster, lockedRoles);
    const fitResult = getBotLaneArchetypeFit({
      championIds: currentPicks,
      championById: getChampionById,
      assignments: botAssignments,
    });

    // 5.3: perechea explicită (mustWith / synergyWith ≥ 4) cântărește mai mult.
    if (isExplicitBotPair(botAssignments.adc, botAssignments.support)) {
      const cap = MUSTWITH_CONFIG.explicitBotPairFitCap;
      botLaneFitBonus = clamp((fitResult - 5) * MUSTWITH_CONFIG.explicitBotPairFitWeight, -cap, cap);
    } else {
      botLaneFitBonus = clamp((fitResult - 5) * 0.5, -2, 2);
    }
  }

  // DRAFT FINAL FIX 5: Comp completeness gate at picks 4-5
  const compGate = getCompCompletenessGate(
    ownState.picks,
    candidate,
    projected.projectedRole,
    getCurrentPickNumberForSide(game, step.side)
  );

  // ─── MUSTWITH BUFFS (with comp-safety) ────────────────────────────────────
  // Only apply if the pick wouldn't break the comp:
  //   - Role must be fillable (canFit)
  //   - Comp gate isn't strongly negative (would mean we're missing critical role)
  //   - Off-meta penalty isn't too high (avoid forcing bad picks)
  const compSafe = canFit && compGate > -2.0 && offMetaPenalty < 8;

  // Botlane-ul (5.2) e override în chooseAiAction; aici rămân bonusurile.
  // DRAFT_THINKING §2.2: primul pick de bot = planul de duo (înlocuiește combo potential 5.3).
  // Penalizarea de ancoră orfană se aplică oricum; bonusul doar dacă pick-ul e comp-safe.
  const duoPickRaw = canFit
    ? getDuoPickBonus(candidate, projected.projectedRole, mustWithState.own, mustWithState.ownDuo, mustWithState.bans, enemyState.picks)
    : { bonus: 0, tag: null, line: null };
  const duoPick = duoPickRaw.bonus > 0 && !compSafe ? { bonus: 0, tag: null, line: null } : duoPickRaw;
  // §2.3: ancora bot e luată, dar partenerul mustWith nu mai e eligibil → partener synergy.
  const duoFallback = compSafe
    ? getDuoFallbackBonus(candidate, projected.projectedRole, mustWithState.own, mustWithState.hasMustWithLock)
    : { bonus: 0, anchorId: null, line: null };
  // §2.4: inamicul și-a pierdut duo-ul principal printr-un ban → deny pe noul lui duo.
  const duoDeny = compSafe
    ? getEnemyDuoDenyBonus(candidate, mustWithState.enemyDuo, false, mustWithState.isEnemyDuoRelevant)
    : 0;
  // 5.4: partenerul unei ancore non-bot proprii.
  const nonBotMustWith = compSafe
    ? getNonBotMustWithBonus(candidate, mustWithState.own, mustWithState.ownPartners, mustWithState.nonBotOverride)
    : { bonus: 0, partner: null };
  // 5.5: inamicul are ancora, candidatul e partenerul lui liber.
  const mustWithDeny = compSafe
    ? getMustWithDenyBonus(candidate, mustWithState.enemy, false, mustWithState.enemyPartners)
    : { bonus: 0, partner: null };
  const mustWithBonus = duoPick.bonus + duoFallback.bonus + nonBotMustWith.bonus + Math.max(mustWithDeny.bonus, duoDeny);

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

  // DRAFT_REALISM §3.2: rol imposibil / pick propriu mutat pe F / F pe jucătorul proiectat → filtru
  // (`isBlockedPick`). Penalizarea rămâne în scor doar ca să ordoneze fallback-ul `forced-off-pool`.
  const invalidRolePenalty = canFit && !reassignment.breaksOwnPick && !masteryGate.blocked ? 0 : 100;

  // DRAFT_REALISM §4.1: termenii existenți, grupați pe bucket-uri; totalul = Σ bucket × pondere.
  const seasonCounterBonus =
    (seasonPunish ? DRAFT_THINKING_CONFIG.season.counterPunishBonus : 0) +
    (seasonReady ? DRAFT_THINKING_CONFIG.season.counterReadyBonus : 0);
  const seasonComfortBonus = seasonPickBonus - seasonCounterBonus;
  const mustWithDenyValue = Math.max(mustWithDeny.bonus, duoDeny);
  const buckets: Record<PickBucketId, number> = {
    power:
      metaPriority * adjustedConfig.metaWeight +
      proPickTiming +
      contestedUrgency -
      offMetaPenalty,
    comp:
      compSynergy * adjustedConfig.synergyWeight +
      needFill * adjustedConfig.needWeight +
      archetypeAffinity +
      winConditionCoherence +
      planAlignment +
      ruleSynergyBonus +             // DRAFT FINAL FIX 1
      compGate +
      botLaneFitBonus +
      (mustWithBonus - mustWithDenyValue) + // duo plan / fallback / partener non-bot (§2, §5.4)
      winConditionEffect.bonus -     // §5.3: susține / încarcă win condition-ul
      splitIdentity.penalty -        // §5.2: identitate împărțită
      weaknessPenalty * adjustedConfig.weaknessWeight -
      comboDependencyPenalty -
      carryNeedPenalty,
    counter:
      counterValue * adjustedConfig.counterWeight +
      predictiveCounter.bonus +
      trapCounter +
      matchupHistoryBias +           // DRAFT FINAL FIX 2
      compCounter.value +            // §6.1 / §6.2: comp counter (redus la tunnel vision)
      losingLanes.bonus +            // §6.3: liniile pierdute
      seasonCounterBonus,            // §7.4: counter de sezon (pregătit / pedepsit)
    comfort:
      comfortScore * adjustedConfig.comfortWeight +
      playerFitScore * adjustedConfig.fitWeight +
      masteryPickFinal.total +
      seasonComfortBonus -           // §7.4: favoriții noștri de sezon
      reassignment.penalty -         // §1.4: pick propriu mutat pe D / grad mult mai mic
      masteryGate.penalty,           // §1.5: D pe jucătorul proiectat
    deny:
      mustWithDenyValue +            // §5.5 / §2.4: partenerul liber al ancorei lor
      userBias,                      // ce îi place userului (adversarul), ca să i-l luăm
    info:
      flexBonus +
      roleCoverage +
      counterpickPreservationBonus +
      sideAware +
      flexAmbiguity +
      userRoleBias -
      blindRiskPenalty -
      contestability,
    style: identityBias,
  };
  // §11: `adaptivePriority` se șterge; până atunci stă în afara ponderilor.
  const unweighted = adaptivePriority - invalidRolePenalty;
  const totalScore = sumBuckets(buckets, weights) + unweighted;

  const explanation = [
    ...reassignment.entries.map((entry) => describeReassignment(candidate.id, entry, reassignment.breaksOwnPick)),
    ...(projectedPlayerId && (masteryGate.blocked || masteryGate.soft) && masteryGate.grade
      ? [describeMasteryBlock(projectedPlayerId, candidate.id, masteryGate.grade)]
      : []),
    ...(draftPlan?.anchorChampionId && planAlignment !== 0
      ? [describePlanAnchor(draftPlan.type, draftPlan.anchorChampionId, step.side, draftPlan.lockedAtPick)]
      : []),
    ...(splitIdentity.line ? [splitIdentity.line] : []),
    ...compCounter.lines,
    ...(seasonPunish ? [describeSeasonCounter(seasonPunish.championId, seasonPunish.wins, seasonPunish.games)] : []),
    ...(losingLanes.line ? [losingLanes.line] : []),
    ...(winConditionEffect.line ? [winConditionEffect.line] : []),
    ...(duoPick.line ? [duoPick.line] : []),
    ...(duoFallback.line ? [duoFallback.line] : []),
    ...badSynergies.map(describeBadSynergy),
  ];

  let planType: DraftCandidateBreakdown["planType"] = "stabilize-comp";
  if (counterpickPreservationBase >= 1.2) planType = "hide-solo-lane";
  if (counterpickPreservationBase <= -2.5) planType = "hold-counter";
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
    matchupDetails: counterResult.details,
    mustWithBonus,
    ...(badSynergies.length ? { badSynergies } : {}),
    ...(reassignment.entries.length ? { reassignment: reassignment.entries } : {}),
    planAlignment,
    buckets,
    bucketWeights: weights,
    phase: ctx.phase,
    ...(compCounter.ours && compCounter.theirs ? { compCounterValue: compCounter.value } : {}),
    ...(ownIdentity.dominant
      ? { identity: { dominant: ownIdentity.dominant, fit: getCandidateIdentityFit(candidate, projected.projectedRole, ownIdentity.dominant) } }
      : {}),
    ...(winCondition ? { winCondition } : {}),
    ...(seasonPunish ? { seasonThreat: { championId: seasonPunish.championId, threat: seasonPunish.threat, kind: "counter" as const } } : {}),
    ...(draftPlan
      ? { plan: { type: draftPlan.type, anchorChampionId: draftPlan.anchorChampionId, lockedAtPick: draftPlan.lockedAtPick } }
      : {}),
    ...(explanation.length ? { explanation } : {}),
    reasonTags: [
      ...(reassignment.breaksOwnPick ? ["breaks-own-pick"] : []),
      ...(splitIdentity.penalty > 0 ? ["split-identity"] : []),
      ...(compCounter.tunnelVision ? ["tunnel-vision"] : []),
      ...(seasonPunish ? ["season-counter"] : []),
      ...(losingLanes.tag ? [losingLanes.tag] : []),
      ...(masteryGate.blocked ? ["mastery-f"] : []),
      ...(masteryGate.soft ? ["mastery-d"] : []),
      ...(badSynergies.length ? ["bad-synergy"] : []),
      ...(duoPick.tag ? [duoPick.tag] : []),
      ...(duoFallback.bonus > 0 ? ["duo-fallback"] : []),
      ...(nonBotMustWith.bonus > 0 ? ["mustwith-partner"] : []),
      ...(mustWithDeny.bonus > 0 || duoDeny > 0 ? ["mustwith-deny"] : []),
      canFit ? "valid-role-map" : "invalid-role-map",
      candidate.roles.length >= 2 ? "flex" : "single-role",
      projected.projectedRole ?? "unassigned",
      getDraftIntent({
        candidate,
        side: step.side,
        game,
        synergyScore: compSynergy,
        counterScore: counterValue,
        comfortScore,
        planBonus: identityBias + roleCoverage,
      }).primary,
      offMetaPenalty >= 3 ? "off-meta" : "meta-ok",
      contestability >= 2 ? "high-contestability" : "safe-pick",
      draftPhase,
    ],
  };
}

// ─── FIX #2: ban inutil daca rolul e deja acoperit de inamic ─────────────────
// If user already picked a jungler, banning another jungler is COMPLETELY
// pointless — user won't pick a second jungler. Penalty must be crushing
// enough to override any metaPriority/comfort bonuses.
function getRoleCoveredBanPenalty(
  candidate: Champion,
  enemyPicks: string[]
): number {
  if (!enemyPicks.length) return 0;

  const enemyAssignments = resolveRoleAssignments(enemyPicks, {});
  const coveredRoles = new Set(Object.keys(enemyAssignments) as Role[]);

  const candidateRoles = candidate.roles;
  if (candidateRoles.length === 0) return 0;

  let penalty = 0;

  // Part A: Role coverage check
  const coveredCount = candidateRoles.filter((role) => coveredRoles.has(role)).length;
  if (coveredCount === candidateRoles.length) {
    // ALL roles covered → ban is 100% useless, user can't pick this champion
    penalty = -20;
  } else if (coveredCount > 0) {
    // Partial coverage → graduated penalty
    const coverageRatio = coveredCount / candidateRoles.length;
    penalty = -coverageRatio * 12;
  }

  // Part B: Primary role overlap — if ban candidate's main role matches
  // any enemy pick's main role, user almost certainly won't pick this.
  // e.g. ban Jarvan (jungle) when user already has Vi (jungle)
  const candidatePrimaryRole = candidateRoles[0];
  for (const pickId of enemyPicks) {
    const pickChamp = getChampionById(pickId);
    if (!pickChamp || pickChamp.roles.length === 0) continue;
    if (pickChamp.roles[0] === candidatePrimaryRole) {
      penalty = Math.min(penalty, -15);
      break;
    }
  }

  return penalty;
}

// ─── BUG FIX: Don't ban champions that enemy already counters ───────────────
// If user has Anivia and Ryze is weakVs Anivia, banning Ryze helps the user.
// AI should WANT enemies to pick champions that its own picks counter.
function getCounterProductiveBanPenalty(
  candidate: Champion,
  enemyPicks: string[],
  ownPicks: string[],
  ownRoster: Partial<Record<Role, string>>,
  enemyRoster: Partial<Record<Role, string>>,
  ownLockedRoles?: LockedRoles
): number {
  if (enemyPicks.length === 0) return 0;
  // Rolul pe care l-am juca noi pe candidat; pick-urile inamicului îl countrează deja?
  const candidateRole =
    getPreferredRolesForChampion(ownPicks, candidate.id, ownRoster, ownLockedRoles)[0] ?? candidate.roles[0] ?? null;
  // Negativ = penalizare la scorul de ban (nota 5 → nu-l bana deloc).
  return getCounterProductiveBanValue(candidate.id, candidateRole, enemyPicks, enemyRoster);
}

// ─── DRAFT FINAL FIX 5: Comp completeness gate ─────────────────────────────
// At pick 4-5, if the team is missing a structural role (frontline, engage,
// or ADC damage), champions that fill the gap get a big bonus and champions
// that DON'T fill it get a penalty. This prevents "all carries no tank" comps.
function getCompCompletenessGate(
  ownPicks: string[],
  candidate: Champion,
  projectedRole: Role | null,
  pickNumber: number
): number {
  // Only active at picks 4-5 (when comp must be completed)
  if (pickNumber < 4) return 0;
  if (ownPicks.length < 3) return 0;

  // Analyze what the team already has
  let hasFrontline = false;
  let hasEngage = false;
  let hasAdc = false;
  let hasDamage = false;

  for (const pickId of ownPicks) {
    const champ = getChampionById(pickId);
    if (!champ) continue;
    const profile = getChampionRoleProfile(champ);
    if (!profile) continue;
    const tags = new Set(profile.tags ?? []);

    if (tags.has("frontline") || tags.has("tank")) hasFrontline = true;
    if (tags.has("engage")) hasEngage = true;
    if (tags.has("dps") || tags.has("burst")) hasDamage = true;
    if (champ.roles.includes("adc")) hasAdc = true;
  }

  // Check what the candidate brings
  const candidateProfile = getChampionRoleProfile(candidate, projectedRole);
  const candidateTags = new Set(candidateProfile?.tags ?? []);
  const isAdc = projectedRole === "adc" || candidate.roles.includes("adc");

  let bonus = 0;

  // Missing frontline at pick 4-5 → frontline champion gets big bonus
  if (!hasFrontline && (candidateTags.has("frontline") || candidateTags.has("tank"))) {
    bonus += pickNumber === 5 ? 4.0 : 2.5;
  }
  // Missing frontline and candidate doesn't fill it at pick 5 → penalty
  if (!hasFrontline && pickNumber === 5 && !candidateTags.has("frontline") && !candidateTags.has("tank")) {
    bonus -= 2.0;
  }

  // Missing ADC at pick 4-5 → ADC gets bonus
  if (!hasAdc && isAdc) {
    bonus += pickNumber === 5 ? 3.5 : 2.0;
  }

  // Missing any damage at pick 5 → damage champion bonus
  if (!hasDamage && (candidateTags.has("dps") || candidateTags.has("burst"))) {
    bonus += 2.0;
  }

  return clamp(bonus, -3, 5);
}

// ─── FIX #3: ban pe campioni care completeaza sinergia inamicului (faza 2) ───
// Daca inamicul a luat deja 2-3 campioni cu synergy intre ei, candidatul
// care le-ar amplifica sinergia (ex: Orianna + Jarvan → Rumble tare cu ei)
// primeste bonus de ban.
function getEnemySynergyCompletionBonus(
  candidate: Champion,
  enemyPicks: string[]
): number {
  if (enemyPicks.length < 2) return 0;
  let bonus = 0;
  for (const enemyId of enemyPicks) {
    const enemy = getChampionById(enemyId);
    if (!enemy) continue;

    // Cat de bine se sinergiaza candidatul cu pick-urile deja facute de inamic?
    // (mustWith e tratat de deny-ul din mustWithPriority.ts, §5.5)
    const synergyWithEnemy =
      enemy.synergyWith?.find(
        (e: { championId: string; score?: number }) => e.championId === candidate.id
      )?.score ?? 0;

    bonus += synergyWithEnemy * 0.42;
  }
  return clamp(bonus, 0, 4.2);
}

// ─── FIX #4: ban signature pentru AI vs AI ───────────────────────────────────
// In contextul original, getUserBanTargetBias functioneaza doar pentru
// jucatorul uman. Aceasta functie aplica aceeasi logica pentru orice echipa,
// uitandu-se la bestChampions/comfortChampions ale jucatorilor inamici.
function getAiSignatureBanBonus(
  candidate: Champion,
  enemyTeamSlug: string,
  save: DraftSave | null
): number {
  const enemyRoster = getTeamRosterFromSources({ teamSlug: enemyTeamSlug, save });
  let bonus = 0;

  for (const playerId of Object.values(enemyRoster)) {
    if (!playerId) continue;
    const player = playersById.get(playerId);
    if (!player) continue;

    if (player.bestChampions?.includes(candidate.id)) bonus += 2.8;
    else if (player.comfortChampions?.includes(candidate.id)) bonus += 1.5;
    else if (player.championPool?.includes(candidate.id)) bonus += 0.65;
  }

  return clamp(bonus, 0, 5.0);
}

function getBanRepeatPenalty(
  candidate: Champion,
  game: DraftGameState,
  series: ActiveDraftSeries
): number {
  // Penalize banning the same champion that was already banned in previous
  // games of this series. Encourages diverse ban strategies across a Bo3/Bo5.
  let penalty = 0;

  for (const prevGame of series.games) {
    if (prevGame.number >= game.number) continue;
    if (!prevGame.completed) continue;

    const wasBanned =
      prevGame.bansBlue.includes(candidate.id) ||
      prevGame.bansRed.includes(candidate.id);

    if (wasBanned) {
      penalty += 1.8; // First repeat = -1.8, second = -3.6, etc.
    }
  }

  // But if champion was PICKED by enemy and WON, banning again is smart
  for (const prevGame of series.games) {
    if (prevGame.number >= game.number) continue;
    if (!prevGame.completed || !prevGame.winnerSide) continue;

    const enemyWon = true; // Simplified: if picked and team won
    const wasPicked =
      prevGame.picksBlue.includes(candidate.id) ||
      prevGame.picksRed.includes(candidate.id);

    if (wasPicked && enemyWon) {
      penalty -= 1.2; // Reduce penalty — respect banning a winning champion
    }
  }

  return clamp(penalty, 0, 5);
}

function getProPickTimingBonus(
  candidate: Champion,
  game: DraftGameState,
  side: Side,
  projectedRole: Role | null
): number {
  const roleStats = getChampionStatsForRole(candidate, projectedRole);
  const avgPickRound = roleStats.avgPickRound ?? 3;
  const prioScore = roleStats.prioScore ?? 50;
  const ownPickNumber = getCurrentPickNumberForSide(game, side);

  // How many total picks have happened?
  const totalPicks = game.picksBlue.length + game.picksRed.length;

  // A champion with avgPickRound 1.5 that's still available at pick 5+ is a steal
  // pickRoundGap = how far past their "expected" pick round we are
  const currentRound = Math.ceil(totalPicks / 2) + 1; // Approximate current round
  const pickRoundGap = currentRound - avgPickRound;

  if (pickRoundGap <= 0) {
    // Champion is being picked at or before their expected round — normal
    return 0;
  }

  // The further past their expected round, the bigger the "steal" bonus
  // A champion with avgPickRound 1.2 still available at round 3 = gap of 1.8
  let stealBonus = clamp(pickRoundGap * 2.2, 0, 6);

  // High prio score amplifies the bonus (very contested champions)
  if (prioScore >= 70) stealBonus *= 1.25;
  else if (prioScore >= 55) stealBonus *= 1.1;

  // Role-specific timing expectations from pro:
  // - ADC with high prio → MUST go phase 1 (avgPickRound typically 1-2)
  // - Support with high prio → usually phase 1 (avgPickRound 1-2)
  // - Jungle with high prio → phase 1 (avgPickRound 1-2)
  // - Solo lanes → phase 2 is fine for counterpick (avgPickRound 3-4)
  //
  // We DON'T hardcode role order — we let the data speak through avgPickRound.
  // A high-prio mid (Ahri with avgPickRound 1.8) will also get bonus.

  // Additionally: if this is a high-prio champion for a "safe blind" role
  // (ADC, support, jungle), it should go early. Solo lanes should wait.
  if (projectedRole === "adc" || projectedRole === "support" || projectedRole === "jungle") {
    if (avgPickRound <= 2.0 && ownPickNumber >= 3) {
      stealBonus += 4.0; // Increased from 2.5 — much stronger urgency
    }
    // Even at pick 2, ADC with very low avgPickRound should be considered
    if (avgPickRound <= 1.5 && ownPickNumber >= 2) {
      stealBonus += 2.0; // Early signal: this champion is first-pickable
    }
  }

  // If solo lane champion has high avgPickRound (3+), no urgency to pick early
  if (projectedRole === "top" || projectedRole === "mid") {
    if (avgPickRound >= 3.0 && ownPickNumber <= 2) {
      // Actually penalize picking solo laners too early if data says they go late
      return clamp(-1.5, -2, 0);
    }
  }

  return clamp(stealBonus, -2, 8);
}

export function scoreBanCandidate(
  candidate: Champion,
  ctx: DraftContext,
  weights: BucketWeights = UNIT_BAN_WEIGHTS
): DraftCandidateBreakdown {
  const { step, game, series, save } = ctx;
  const ownState = { picks: ctx.own.picks };
  const enemyState = { picks: ctx.enemy.picks };
  const enemyTeamSlug = ctx.enemy.teamSlug;
  // ── MASTERY: enemy roster for ban pressure ──────────────────────────────
  const enemyRoster = ctx.enemy.roster;
  const ownRoster = ctx.own.roster;

  // Enemy has SS/S on this champion → ban pressure
  // DRAFT_THINKING §7.4: favoriții de sezon ai adversarului — ban dacă n-avem răspuns, altfel îi lăsăm.
  const seasonBanState = ctx.season;
  const seasonResponse = seasonBanState.responses.find(
    (response) => response.kind !== "ignore" && response.championId === candidate.id
  );
  const seasonBan =
    seasonResponse?.kind === "ban"
      ? Math.min(seasonResponse.threat * DRAFT_THINKING_CONFIG.season.banWeight, DRAFT_THINKING_CONFIG.season.banCap)
      : 0;
  const seasonBanLine =
    seasonResponse?.kind === "ban"
      ? describeSeasonBan(seasonBanState.enemyTeamName, candidate.id, seasonResponse.wins, seasonResponse.games)
      : seasonResponse?.kind === "plan"
        ? describeSeasonPlan(candidate.id, seasonResponse.counterIds[0], seasonResponse.counterGrades[seasonResponse.counterIds[0]])
        : null;

  const enemyMasteryBan = getEnemyMasteryBanBonus({
    candidate,
    enemyRoster,
  });

  // Own team wants to pick this → don't ban it
  const ownMasteryProtect = getOwnMasteryBanPenalty({
    candidate,
    ownRoster,
  });

  // ── MASTERY ADVANCED: target banning + draft reading ────────────────────
  const advCtxBan = getCachedAdvancedContext({
    game,
    side: step.side,
    series,
    enemyRoster,
  });

  const targetBan = getTargetBanningBonus({
    candidate,
    enemyRoster,
    currentBans: new Set([...game.bansBlue, ...game.bansRed]),
    currentPicks: new Set([...game.picksBlue, ...game.picksRed]),
  });

  const predictiveBan = getPredictiveBanBonus({
    candidate,
    predictions: advCtxBan.enemyPredictions,
  });

  const metaPriority = clamp(getMetaPriorityScore(candidate), 0, 10);
  const enemyComfortPressure = clamp((candidate.stats?.prioScore ?? 50) / 13.5, 0, 8);
  const enemyCounterWindow =
    ownState.picks.length >= 3 &&
      (candidate.roles.includes("top") || candidate.roles.includes("mid"))
      ? 1.15
      : 0;
  const userBias = getUserBanTargetBias(candidate, step.side, series);

  // FIX #2: penalitate daca rolul candidatului e deja umplut de inamic
  // Graduated: all roles covered = -7, partial = proportional, primary role match = -4
  const redundantBanPenalty = getRoleCoveredBanPenalty(candidate, enemyState.picks);

  // BUG FIX: Don't ban champions that enemy picks already counter
  // e.g. don't ban Ryze when user has Anivia (Ryze weakVs Anivia)
  const counterProductiveBanPenalty = getCounterProductiveBanPenalty(
    candidate,
    enemyState.picks,
    ownState.picks,
    ownRoster,
    enemyRoster,
    getLockedRoles(game, step.side)
  );

  // FIX #3: bonus pentru ban-uri in faza 2 care distrug sinergia inamicului
  // Activat dupa prima tura de pick-uri (phaseIndex >= 12)
  const synergyCompletionBonus =
    game.phaseIndex >= 12
      ? getEnemySynergyCompletionBonus(candidate, enemyState.picks)
      : 0;

  // FIX #4: bonus pentru ban-uri signature pe campionii "best" ai inamicului
  const signatureBonus = getAiSignatureBanBonus(candidate, enemyTeamSlug, save);

  const banRepeatPenalty = getBanRepeatPenalty(candidate, game, series);

  // UPGRADE 8A: Trap draft — reduce ban score for bait champion
  const trapBanReduction = getTrapBanReduction(candidate, game, series, step.side);
  const seriesAwareBan = getSeriesAwareBanBonus(candidate.id, step.side, series);
  const comfortRepeatThreat = getSeriesComfortRepeatThreat(candidate.id, step.side, series);

  // UPGRADE 13: Get AI plan to guide ban targeting
  const aiBanPlan = ctx.plan;

  // UPGRADE 13: Ban bonus for champions that counter AI's plan
  const planAdaptiveBanBonus = getPlanAdaptiveBanBonus(candidate, aiBanPlan);

  // DRAFT_THINKING §6.1 (ban): campionii care ar întări cel mai mult identitatea inamicului.
  // Cu ≥ 2 pick-uri: identitatea din pick-uri; altfel, la user, planul dedus din ban-urile lui.
  const enemyBanSide: Side = step.side === "blue" ? "red" : "blue";
  const enemyBanIdentity: { dominant: DraftPlanType | null; strength: number } =
    enemyState.picks.length >= DRAFT_THINKING_CONFIG.compCounter.minEnemyPicks
      ? readCompIdentity(enemyState.picks)
      : !isAiSide(series, enemyBanSide)
        ? { dominant: deduceUserPlan(game, enemyBanSide), strength: 0.5 }
        : { dominant: null, strength: 0 };
  const identityBanBonus = getEnemyIdentityBanBonus(
    candidate,
    enemyBanIdentity,
    ownState.picks.length ? readCompIdentity(ownState.picks).dominant : aiBanPlan?.type ?? null
  );

  // UPGRADE 13: Preemptive ban on user-favorite OP champions
  const userFavoriteBan = getUserFavoriteBanBonus(candidate, series);

  // DRAFT FINAL FIX 3: Phase 2 bans — protect own comp
  // In phase 2 (after 6 picks), AI has 3 picks visible. Ban champions that
  // hard-counter what AI itself has picked.
  let protectOwnCompBonus = 0;
  if (game.phaseIndex >= 12 && ownState.picks.length >= 2) {
    // Rolul probabil al candidatului dacă l-ar lua inamicul.
    const candidateEnemyRole =
      getPreferredRolesForChampion(enemyState.picks, candidate.id, enemyRoster)[0] ?? null;
    const ownAssignments = resolveRoleAssignments(ownState.picks, ownRoster, getLockedRoles(game, step.side));
    for (const [ownRole, ownPickId] of Object.entries(ownAssignments) as [Role, string | undefined][]) {
      if (!ownPickId) continue;
      protectOwnCompBonus += getProtectOwnPickBanValue(ownPickId, ownRole, candidate.id, candidateEnemyRole);
    }
    protectOwnCompBonus = clamp(protectOwnCompBonus, 0, PROTECT_BAN_MAX);
  }

  // ─── MUSTWITH BAN (§5.5) ──────────────────────────────────────────────────
  const mustWithBanState = ctx.mustWith;
  // Deny: inamicul are ancora (ex. Rakan) → ban pe partenerul lui liber (Xayah).
  const mustWithBanBonus = Math.max(
    getMustWithDenyBonus(candidate, mustWithBanState.enemy, true, mustWithBanState.enemyPartners).bonus,
    // §2.4: deny-ul se mută pe noul cel mai bun duo al inamicului.
    getEnemyDuoDenyBonus(candidate, mustWithBanState.enemyDuo, true, mustWithBanState.isEnemyDuoRelevant)
  );
  // Nu-ți bana niciodată partenerul eligibil al unui campion deja luat.
  const ownMustWithBanBlock = isProtectedOwnPartner(
    candidate.id,
    mustWithBanState.own,
    mustWithBanState.ownPartners
  )
    ? MUSTWITH_CONFIG.ownPartnerBanScore
    : 0;

  // DRAFT_REALISM §4.2: termenii existenți, grupați pe bucket-uri; `hygiene` e mereu × 1.
  const buckets: Record<BanBucketId, number> = {
    power: metaPriority * 0.95 + (candidate.roles.length >= 2 ? 0.8 : 0),
    // Jucătorii lor. §7.4: banul de sezon nu se adună peste mastery / target ban: se ia maximul.
    target:
      enemyComfortPressure * 1.1 +
      signatureBonus * 1.4 +
      Math.max(enemyMasteryBan.bonus + targetBan.bonus, seasonBan) +
      userFavoriteBan +
      userBias +
      seriesAwareBan +
      comfortRepeatThreat,
    // Pick-urile noastre.
    protect:
      protectOwnCompBonus +          // DRAFT FINAL FIX 3
      counterProductiveBanPenalty +
      ownMasteryProtect.penalty,
    // Compoziția lor.
    compDeny:
      synergyCompletionBonus +
      mustWithBanBonus +
      planAdaptiveBanBonus +
      identityBanBonus +             // §6.1: întărește identitatea inamicului
      enemyCounterWindow,
    predict: predictiveBan.bonus,
    hygiene:
      redundantBanPenalty -
      banRepeatPenalty +
      trapBanReduction +
      ownMustWithBanBlock,
  };
  const totalScore = sumBuckets(buckets, weights);


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
    buckets,
    bucketWeights: weights,
    phase: ctx.phase,
    mustWithBonus: mustWithBanBonus + ownMustWithBanBlock,
    ...(seasonBanLine ? { explanation: [seasonBanLine] } : {}),
    ...(seasonResponse && seasonResponse.kind !== "ignore"
      ? { seasonThreat: { championId: candidate.id, threat: seasonResponse.threat, kind: seasonResponse.kind } }
      : {}),
    reasonTags: [
      ...(seasonBan > 0 ? ["season-ban"] : []),
      userBias > 1 || signatureBonus > 2 ? "user-pattern" : "meta-ban",
      candidate.roles.length >= 2 ? "flex" : "single-role",
      ...(mustWithBanBonus > 0 ? ["mustwith-deny"] : []),
      ...(ownMustWithBanBlock < 0 ? ["mustwith-protected"] : []),
    ],
  };
}

/**
 * Pool-ul de candidați scorați la pick (pre-filtru ieftin): top 50 după prioritate,
 * partenerii mustWith eligibili, campionii B+ ai jucătorilor de pe rolurile libere;
 * fără campionii pe care toți jucătorii de pe rolurile lor libere îi au la F (§1.5).
 */
export function getPickCandidatePool(
  pool: Champion[],
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  ownPartnerIds: ReadonlySet<string> = new Set()
): Champion[] {
  // Pre-sort by cheap meta priority, keep top 50
  const cheapRanked = [...pool]
    .map((c) => ({
      champion: c,
      priority: (c.stats?.prioScore ?? 0) + (c.stats?.presence ?? 0) * 0.5,
    }))
    .sort((a, b) => b.priority - a.priority);

  // Top 50 by priority + any champion from user's roster comfort pool
  let filteredPool = cheapRanked.slice(0, 50).map((e) => e.champion);

  // If filtered too aggressively and < 20 candidates, fall back to more
  if (filteredPool.length < 20) {
    filteredPool = cheapRanked.slice(0, 80).map((e) => e.champion);
  }

  // 4.3: partenerii mustWith eligibili nu sunt tăiați de pre-filtru.
  const included = new Set(filteredPool.map((champion) => champion.id));
  for (const champion of pool) {
    if (ownPartnerIds.has(champion.id) && !included.has(champion.id)) {
      filteredPool.push(champion);
      included.add(champion.id);
    }
  }

  // DRAFT_THINKING §1.5 pct. 3: campionii B+ ai jucătorilor de pe rolurile libere intră mereu;
  // campionii pe care toți jucătorii de pe rolurile lor libere îi au la F ies (dacă rămâne ceva).
  const ownPicks = getOwnState(game, step.side).picks;
  const ownRoster = getTeamRosterFromSources({ teamSlug: getTeamSlugForSide(series, step.side), save });
  const openRoles = getOpenRolesForPickedChampions(ownPicks, ownRoster, getLockedRoles(game, step.side));
  const gradeById = new Map(pool.map((champion) => [champion.id, getBestOpenRoleGradeRank(champion.id, openRoles, ownRoster)]));
  for (const champion of pool) {
    if (included.has(champion.id)) continue;
    if ((gradeById.get(champion.id)?.bestRank ?? -1) >= DRAFT_THINKING_CONFIG.mastery.rosterPoolMinRank) {
      filteredPool.push(champion);
      included.add(champion.id);
    }
  }
  const playable = filteredPool.filter((champion) => !gradeById.get(champion.id)?.allBlocked);
  if (playable.length) filteredPool = playable;
  return filteredPool;
}

/**
 * DRAFT_REALISM §3.2 — filtrul dur de pick, înaintea oricărui scor: rol imposibil
 * (`invalid-role-map`), pick propriu mutat pe un jucător cu F (`breaks-own-pick`, §1.4),
 * F pe jucătorul proiectat (`mastery-f`, §1.5). Aceleași verificări ca în `scorePickCandidate`.
 */
export function getPickHardFilter(candidate: Champion, ctx: DraftContext): "invalid-role-map" | "breaks-own-pick" | "mastery-f" | null {
  const lockedRoles = getLockedRoles(ctx.game, ctx.side);
  if (!canPickChampionIntoUniqueRoles(ctx.own.picks, candidate.id, ctx.own.roster, lockedRoles)) return "invalid-role-map";
  if (getReassignmentCheck(ctx.own.picks, candidate.id, ctx.own.roster, lockedRoles).breaksOwnPick) return "breaks-own-pick";
  const projected = getProjectedRoleAndPlayer(candidate, ctx.own.picks, ctx.own.roster, lockedRoles);
  if (getMasteryGate(projected.projectedPlayer, candidate.id, projected.projectedRole).blocked) return "mastery-f";
  return null;
}
