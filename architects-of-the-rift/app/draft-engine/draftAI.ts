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
// FIX #1 — import shortlist pentru variatie draft AI
import { chooseFromAdaptiveShortlist } from "./draftVariationSystem";
import { getChampionRoleProfile } from "./championProfileSystem";
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
import { getTotalBadSynergy } from "./badSynergyData";
import { getTrapBanReduction, getTrapCounterBonus } from "./trapDraftSystem";
import { chooseDraftPlan, getPlanAlignmentBonus, type DraftPlan } from "./draftPlanSystem";
import { getSideAwareBonus, getFlexAmbiguityBonus } from "./sideAwareDraftSystem";
import {
  getPlanAdaptiveBanBonus,
  getContestedPickUrgency,
  getUserFavoriteBanBonus,
  deduceUserPlan,
  getCounterToUserPlanBonus,
} from "./advancedDraftReading";
import { evaluateRuleSynergy } from "./profileRuleEvaluator";
import { getPlayerChampionMatchupDraftBias } from "./playerHistoryEvaluator";


const playersById = new Map(players.map((player) => [player.id, player]));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const planCache: Map<string, DraftPlan | null> = new Map();

function getCachedPlan(args: {
  side: Side;
  game: DraftGameState;
  series: ActiveDraftSeries;
  save: DraftSave | null;
}): DraftPlan | null {
  const cacheKey = `${args.series.seriesId}:g${args.series.currentGameNumber}:${args.side}`;
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
  });

  planCache.set(cacheKey, plan);
  return plan;
}

// Call planCache.clear() at the start of each new game if needed.
// (Not required — cache key includes game number)

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
  projectedRole: Role | null
) {
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

    const directSynergy =
      candidate.synergyWith?.find(
        (entry: { championId: string; score?: number }) => entry.championId === picked.id
      )?.score ?? 0;
    const reverseSynergy =
      picked.synergyWith?.find(
        (entry: { championId: string; score?: number }) => entry.championId === candidate.id
      )?.score ?? 0;
    const mustPair =
      candidate.mustWith?.find(
        (entry: { championId: string; score?: number }) => entry.championId === picked.id
      )?.score ?? 0;

    synergy += directSynergy * 0.38;
    synergy += reverseSynergy * 0.38;
    synergy += mustPair * 0.45;
  }

  // UPGRADE 11: subtract known bad synergies
  synergy -= getTotalBadSynergy(candidate.id, ownPicks) * 0.55;

  return clamp(synergy, 0, 10);
}

function getCounterValueScore(enemyPicks: string[], candidate: Champion) {
  let counter = 0;
  for (const enemyId of enemyPicks) {
    const enemy = getChampionById(enemyId);
    if (!enemy) continue;

    const intoEnemy =
      candidate.goodVs?.find(
        (entry: { championId: string; score?: number }) => entry.championId === enemy.id
      )?.score ?? 0;
    const threatenedByEnemy =
      candidate.weakVs?.find(
        (entry: { championId: string; score?: number }) => entry.championId === enemy.id
      )?.score ?? 0;

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

function getOffMetaPenalty(
  candidate: Champion,
  series: ActiveDraftSeries
): number {
  const effectivePresence = Math.max(
    candidate.stats.presence ?? 0,
    candidate.stats.picks + candidate.stats.bans
  );
  if (effectivePresence <= 0) return 6.5;

  const picks = candidate.stats.picks ?? 0;
  const proWinRate = candidate.stats.proWinRate ?? null;

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

  const soloqWR = candidate.stats.soloqKrChallengerWinRate ?? null;
  if (soloqWR !== null && soloqWR >= 53) {
    const soloqDiscount = clamp((soloqWR - 52) / 15, 0.05, 0.20);
    penalty *= (1 - soloqDiscount);
  }

  const csDiff = candidate.stats.csDiffAt15 ?? null;
  const goldDiff = candidate.stats.goldDiffAt15 ?? null;
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

function getWinConditionCoherenceScore(
  ownPicks: string[],
  candidate: Champion,
  projectedRole: Role | null
): number {
  if (ownPicks.length < 2) return 0; // Too early to have a clear identity

  // Build current comp identity from existing picks
  const existingOffers: Record<string, number> = {};
  for (const pickedId of ownPicks) {
    const picked = getChampionById(pickedId);
    if (!picked) continue;
    for (const offer of picked.offers) {
      existingOffers[offer.type] = (existingOffers[offer.type] ?? 0) + offer.strength;
    }
  }

  // Detect emerging identity
  const diveSignal = (existingOffers["dive"] ?? 0) + (existingOffers["backlineAccess"] ?? 0) + (existingOffers["engage"] ?? 0);
  const pokeSignal = (existingOffers["poke"] ?? 0) + (existingOffers["siege"] ?? 0) + (existingOffers["waveclear"] ?? 0);
  const pickSignal = (existingOffers["pick"] ?? 0) + (existingOffers["reliableCC"] ?? 0) + (existingOffers["roamPressure"] ?? 0);
  const frontToBackSignal = (existingOffers["frontline"] ?? 0) + (existingOffers["peel"] ?? 0) + (existingOffers["sustainedDamage"] ?? 0);

  const signals = [
    { id: "dive", value: diveSignal },
    { id: "poke", value: pokeSignal },
    { id: "pick", value: pickSignal },
    { id: "front-to-back", value: frontToBackSignal },
  ].sort((a, b) => b.value - a.value);

  const dominant = signals[0];
  if (!dominant || dominant.value < 6) return 0; // No clear identity yet

  // Check how well the candidate fits the dominant identity
  const candidateOffers = new Set(candidate.offers.map((o) => String(o.type)));
  const candidateProfile = getChampionRoleProfile(candidate, projectedRole);
  const candidateTags = new Set(candidateProfile?.tags ?? []);

  let coherence = 0;

  switch (dominant.id) {
    case "dive":
      if (candidateTags.has("dive") || candidateTags.has("engage") || candidateTags.has("follow-up")) coherence += 2.0;
      if (candidateOffers.has("poke") && !candidateTags.has("dive")) coherence -= 1.5; // poke in dive = bad
      break;
    case "poke":
      if (candidateOffers.has("poke") || candidateOffers.has("siege") || candidateOffers.has("waveclear")) coherence += 2.0;
      if (candidateTags.has("dive") && !candidateOffers.has("poke")) coherence -= 1.5; // dive piece in poke = bad
      break;
    case "pick":
      if (candidateTags.has("pick") || candidateOffers.has("reliableCC") || candidateOffers.has("roamPressure")) coherence += 1.8;
      break;
    case "front-to-back":
      if (candidateTags.has("frontline") || candidateTags.has("peel") || candidateOffers.has("sustainedDamage")) coherence += 1.8;
      if (candidateTags.has("dive") && !candidateTags.has("frontline")) coherence -= 1.2;
      break;
  }

  return clamp(coherence, -3, 3);
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
  const totalPicksSoFar = game.picksBlue.length + game.picksRed.length;
  const draftPhase = getDraftPhase(totalPicksSoFar + 1);
  const phaseBias = getPhaseBias(draftPhase);
  const adjustedConfig = {
    ...config,
    metaWeight: config.metaWeight * phaseBias.metaWeight,
    counterWeight: config.counterWeight * phaseBias.counter,
    synergyWeight: config.synergyWeight * phaseBias.compIdentity,
  };
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
  const offMetaPenalty = getOffMetaPenalty(candidate, series);
  const archetypeAffinity = getArchetypeAffinityScore(roster, projected.projectedRole, candidate);
  const comboDependencyPenalty = getComboDependencyPenalty(ownState.picks, candidate, projected.projectedRole);
  const winConditionCoherence = getWinConditionCoherenceScore(ownState.picks, candidate, projected.projectedRole);
  const proPickTiming = getProPickTimingBonus(candidate, game, step.side, projected.projectedRole);

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
  });

  // UPGRADE 12: Draft plan alignment
  const draftPlan = getCachedPlan({ side: step.side, game, series, save });
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

  // UPGRADE 13: Counter user's deduced plan
  const userDeducedPlan = deduceUserPlan(game, step.side === "blue" ? "red" : "blue");
  const counterUserPlanBonus = getCounterToUserPlanBonus(candidate, userDeducedPlan);

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
  const trapCounter = getTrapCounterBonus(candidate, game, series, step.side);

  let botLaneFitBonus = 0;
  if (projected.projectedRole === "support" || projected.projectedRole === "adc") {
    const currentPicks = [...ownState.picks, candidate.id];
    const fitResult = getBotLaneArchetypeFit({
      championIds: currentPicks,
      championById: getChampionById,
    });

    botLaneFitBonus = clamp((fitResult - 5) * 0.5, -2, 2);
  }

  // DRAFT FINAL FIX 5: Comp completeness gate at picks 4-5
  const compGate = getCompCompletenessGate(
    ownState.picks,
    candidate,
    projected.projectedRole,
    getCurrentPickNumberForSide(game, step.side)
  );

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
    metaPriority * adjustedConfig.metaWeight +
    comfortScore * adjustedConfig.comfortWeight +
    playerFitScore * adjustedConfig.fitWeight +
    compSynergy * adjustedConfig.synergyWeight +
    needFill * adjustedConfig.needWeight +
    counterValue * adjustedConfig.counterWeight +
    identityBias +
    flexBonus +
    roleCoverage +
    counterpickPreservationBonus +
    userBias +
    userRoleBias +
    archetypeAffinity +
    winConditionCoherence +
    proPickTiming +
    adaptivePriority +
    botLaneFitBonus +
    trapCounter +
    planAlignment +
    sideAware +
    flexAmbiguity +
    contestedUrgency +
    counterUserPlanBonus +
    ruleSynergyBonus +             // DRAFT FINAL FIX 1
    matchupHistoryBias +           // DRAFT FINAL FIX 2
    compGate -                     // DRAFT FINAL FIX 5
    weaknessPenalty * adjustedConfig.weaknessWeight -
    blindRiskPenalty -
    comboDependencyPenalty -
    offMetaPenalty -
    contestability -
    carryNeedPenalty -
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
// BUG FIX: accepts roster so flex picks (Anivia mid/support) resolve correctly
// when another champion (Nautilus) already fills one of the flex roles.
function isRoleAlreadyCoveredByEnemy(
  candidate: Champion,
  enemyPicks: string[],
  enemyRoster: Partial<Record<Role, string>>
): boolean {
  if (!enemyPicks.length) return false;
  const enemyAssignments = resolveRoleAssignments(enemyPicks, enemyRoster);
  const coveredRoles = new Set(Object.keys(enemyAssignments) as Role[]);
  return candidate.roles.every((role) => coveredRoles.has(role));
}

// ─── BUG FIX: Don't ban champions that enemy already counters ───────────────
// If user has Anivia and Ryze is weakVs Anivia, banning Ryze helps the user.
// AI should WANT enemies to pick champions that its own picks counter.
function getCounterProductiveBanPenalty(
  candidate: Champion,
  enemyPicks: string[]
): number {
  if (enemyPicks.length === 0) return 0;

  let totalCounterStrength = 0;

  for (const enemyPickId of enemyPicks) {
    const enemyChamp = getChampionById(enemyPickId);
    if (!enemyChamp) continue;

    // Check if the ban candidate is weak against any enemy pick
    const candidateWeakVsEnemy = candidate.weakVs?.find(
      (rel) => rel.championId === enemyPickId
    )?.score ?? 0;

    // Check if enemy champion is strong against the ban candidate
    const enemyGoodVsCandidate = enemyChamp.goodVs?.find(
      (rel) => rel.championId === candidate.id
    )?.score ?? 0;

    totalCounterStrength += candidateWeakVsEnemy * 0.6 + enemyGoodVsCandidate * 0.5;
  }

  if (totalCounterStrength <= 0) return 0;

  // Negative = penalty to ban score (don't ban what enemy counters)
  return -clamp(totalCounterStrength * 0.75, 0, 5);
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
    const synergyWithEnemy =
      enemy.synergyWith?.find(
        (e: { championId: string; score?: number }) => e.championId === candidate.id
      )?.score ?? 0;
    const mustWithEnemy =
      enemy.mustWith?.find(
        (e: { championId: string; score?: number }) => e.championId === candidate.id
      )?.score ?? 0;

    bonus += synergyWithEnemy * 0.42 + mustWithEnemy * 0.65;
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
  const avgPickRound = candidate.stats.avgPickRound ?? 3;
  const prioScore = candidate.stats.prioScore ?? 50;
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

function scoreBanCandidate(
  candidate: Champion,
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null
): DraftCandidateBreakdown {
  const ownState = getOwnState(game, step.side);
  const enemyState = getEnemyState(game, step.side);
  const enemyTeamSlug = getTeamSlugForSide(series, step.side === "blue" ? "red" : "blue");

  const metaPriority = clamp(getMetaPriorityScore(candidate), 0, 10);
  const enemyComfortPressure = clamp((candidate.stats?.prioScore ?? 50) / 13.5, 0, 8);
  const enemyCounterWindow =
    ownState.picks.length >= 3 &&
      (candidate.roles.includes("top") || candidate.roles.includes("mid"))
      ? 1.15
      : 0;
  const userBias = getUserBanTargetBias(candidate, step.side, series);

  // FIX #2: penalitate daca rolul candidatului e deja umplut de inamic
  // BUG FIX: pass enemy roster so flex picks resolve correctly
  // (e.g. Anivia mid/support resolves to mid when Nautilus is support)
  const enemyRoster = getTeamRosterFromSources({ teamSlug: enemyTeamSlug, save });
  const redundantBanPenalty = isRoleAlreadyCoveredByEnemy(candidate, enemyState.picks, enemyRoster)
    ? -7
    : 0;

  // BUG FIX: Don't ban champions that enemy picks already counter
  // e.g. don't ban Ryze when user has Anivia (Ryze weakVs Anivia)
  const counterProductiveBanPenalty = getCounterProductiveBanPenalty(candidate, enemyState.picks);

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
  const aiBanPlan = getCachedPlan({ side: step.side, game, series, save });

  // UPGRADE 13: Ban bonus for champions that counter AI's plan
  const planAdaptiveBanBonus = getPlanAdaptiveBanBonus(candidate, aiBanPlan);

  // UPGRADE 13: Preemptive ban on user-favorite OP champions
  const userFavoriteBan = getUserFavoriteBanBonus(candidate, series);

  // DRAFT FINAL FIX 3: Phase 2 bans — protect own comp
  // In phase 2 (after 6 picks), AI has 3 picks visible. Ban champions that
  // hard-counter what AI itself has picked.
  let protectOwnCompBonus = 0;
  if (game.phaseIndex >= 12 && ownState.picks.length >= 2) {
    for (const ownPickId of ownState.picks) {
      const ownChamp = getChampionById(ownPickId);
      if (!ownChamp) continue;

      // Does the ban candidate counter our pick?
      const candidateCountersUs = candidate.goodVs?.find(
        (rel) => rel.championId === ownPickId
      )?.score ?? 0;

      // Are we weak against this candidate?
      const weAreWeakVs = ownChamp.weakVs?.find(
        (rel) => rel.championId === candidate.id
      )?.score ?? 0;

      protectOwnCompBonus += candidateCountersUs * 0.45 + weAreWeakVs * 0.35;
    }
    protectOwnCompBonus = clamp(protectOwnCompBonus, 0, 4);
  }

  // FIX A: Reduce metaPriority dominance, boost signature bans
  const totalScore =
    metaPriority * 0.95 +
    enemyComfortPressure * 1.1 +
    enemyCounterWindow +
    userBias +
    synergyCompletionBonus +
    signatureBonus * 1.4 +
    redundantBanPenalty +
    counterProductiveBanPenalty -
    banRepeatPenalty +
    seriesAwareBan +
    comfortRepeatThreat +
    trapBanReduction +
    planAdaptiveBanBonus +
    userFavoriteBan +
    protectOwnCompBonus +          // DRAFT FINAL FIX 3
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
      userBias > 1 || signatureBonus > 2 ? "user-pattern" : "meta-ban",
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
    return scoreBanCandidate(candidate, step, game, series, save);
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

  // UPGRADE 11 FIX 3: Pre-filter pool to speed up scoring.
  // Full scoring is expensive (calls evaluateSimulationReadiness, etc per candidate).
  // For picks: keep top ~50 by meta priority + any player comfort pick.
  // For bans: keep top ~30 by meta priority + signature ban candidates.
  let filteredPool = pool;

  if (step.action === "pick") {
    // Pre-sort by cheap meta priority, keep top 50
    const cheapRanked = [...pool]
      .map((c) => ({
        champion: c,
        priority: (c.stats?.prioScore ?? 0) + (c.stats?.presence ?? 0) * 0.5,
      }))
      .sort((a, b) => b.priority - a.priority);

    // Top 50 by priority + any champion from user's roster comfort pool
    filteredPool = cheapRanked.slice(0, 50).map((e) => e.champion);

    // If filtered too aggressively and < 20 candidates, fall back to more
    if (filteredPool.length < 20) {
      filteredPool = cheapRanked.slice(0, 80).map((e) => e.champion);
    }
  } else {
    // Bans: only top 30 meta candidates matter
    const cheapRanked = [...pool]
      .map((c) => ({
        champion: c,
        priority: (c.stats?.prioScore ?? 0) + (c.stats?.bans ?? 0) * 0.5,
      }))
      .sort((a, b) => b.priority - a.priority);

    filteredPool = cheapRanked.slice(0, 30).map((e) => e.champion);
  }

  const ranked = filteredPool
    .map((candidate) => scoreDraftCandidate(candidate, step, game, series, save, config))
    .sort((a, b) => {
      const primary = b.totalScore - a.totalScore;
      if (Math.abs(primary) > 0.01) return primary;
      return applyRealisticPickTiebreaker(a, b);
    });

  if (step.action === "pick") {
    const valid = ranked.filter(
      (entry) => !entry.reasonTags?.includes("invalid-role-map")
    );

    const seed = `${series.seriesId}:${series.currentGameNumber}:${game.phaseIndex}:${step.side}`;
    return chooseFromAdaptiveShortlist(valid, seed) ?? null;
  }

  const banSeed = `${series.seriesId}:${series.currentGameNumber}:${game.phaseIndex}:ban:${step.side}`;
  const banShortlist = ranked.slice(0, 3);
  const banHash = banSeed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return banShortlist[banHash % banShortlist.length] ?? ranked[0] ?? null;

}