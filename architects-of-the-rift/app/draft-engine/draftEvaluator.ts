import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import { COMP_ATTRIBUTE_ORDER } from "@/app/types/compAttributes";
import type { Champion, ChampionPlayerScaling, Role } from "@/app/types/champion";
import type { Player, PlayerStats } from "@/app/types/player";
import type { NeedStatus, TeamCompVector, TeamDraftContext, TeamDraftEvaluation } from "./draftTypes";
import { ROLE_ORDER } from "./draftTypes";
import { getCarrySelfProtectionScore } from "./draftArchetypes";
import { getChampionRoleProfile } from "./championProfileSystem";
import { derivePlayerAdaptationProfile, derivePlayerArchetypeAffinity, derivePlayerPhaseProfile } from "./playerProfileSystem";
import { evaluateInteractionScore, evaluateRuleSynergy } from "./profileRuleEvaluator";
import { evaluateTeamIdentity } from "./teamIdentitySystem";
import { evaluateSimulationReadiness } from "./simulationReadinessSystem";
import {
  getHistoryAdjustedDraftFit,
  getPlayerChampionHistoryBonus,
  getPlayerChampionSignatureBonus,
} from "./playerHistoryEvaluator";

const championMap = new Map(champions.map((champion) => [champion.id, champion]));
const playersById = new Map(players.map((player) => [player.id, player]));
const maxPresence = Math.max(1, ...champions.map((champion) => Math.max(champion.stats.presence ?? 0, champion.stats.picks + champion.stats.bans)));
const maxBans = Math.max(1, ...champions.map((champion) => champion.stats.bans ?? 0));

const ATTRIBUTE_ALIASES: Record<string, string> = {
  burstDamage: "burstDamage",
  followup: "followUp",
  splitpush: "sideLanePressure",
  durability: "frontline",
  range: "poke",
};

const ENGAGE_ATTRIBUTES = ["engage", "reliableCC", "pick", "roamPressure"];
const FRONTLINE_ATTRIBUTES = ["frontline", "peel", "engage"];
const EXECUTION_HELP_ATTRIBUTES = ["reliableCC", "peel", "disengage", "waveclear"];
const PROTECTION_ATTRIBUTES = ["peel", "antiDive", "disengage", "frontline"];
const ANTI_DIVE_ATTRIBUTES = ["antiDive", "peel", "disengage", "frontline"];
const PRIMARY_ENGAGE_ATTRIBUTES = ["engage", "pick"];
const FOLLOW_UP_ATTRIBUTES = ["followUp", "burstDamage"];
const POKE_ATTRIBUTES = ["poke", "siege", "waveclear"];
const DIVE_ATTRIBUTES = ["dive", "backlineAccess", "engage", "roamPressure"];
const PICK_ATTRIBUTES = ["pick", "reliableCC", "roamPressure", "burstDamage"];
const TEAMFIGHT_ATTRIBUTES = ["engage", "followUp", "frontline", "peel"];
const HARD_PROTECT_CARRY_IDS = new Set(["kogmaw", "jinx", "aphelios", "vayne", "yunara", "zeri"]);
const RANGE_SAFE_IDS = new Set(["ezreal", "corki", "xayah", "zeri", "lucian", "sivir", "varus", "jinx", "kogmaw"]);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeAttribute(type: string) {
  return ATTRIBUTE_ALIASES[type] ?? type;
}

function vectorValue(vector: TeamCompVector, key: string) {
  const normalized = normalizeAttribute(key);
  return (vector as Record<string, number>)[normalized] ?? 0;
}

function addVectorValue(vector: TeamCompVector, key: string, amount: number) {
  const normalized = normalizeAttribute(key);
  if (COMP_ATTRIBUTE_ORDER.includes(normalized as never)) {
    (vector as Record<string, number>)[normalized] = vectorValue(vector, normalized) + amount;
  }
}

function advancedPrimary(player: Player, key: keyof Player["advancedProfile"]["primary"], fallback = 5) {
  const value = player.advancedProfile?.primary?.[key];
  return typeof value === "number" ? clamp(value / 10, 0, 10) : fallback;
}

function getOfferStrength(champion: Champion | null, attributes: string[]) {
  if (!champion) return 0;
  return champion.offers
    .filter((offer) => attributes.includes(normalizeAttribute(String(offer.type))))
    .reduce((sum, offer) => sum + offer.strength, 0);
}

function evaluateStructuralScore(championIds: string[], attributes: string[], target: number) {
  const total = championIds.reduce((sum, championId) => {
    const champion = getChampionById(championId);
    return sum + getOfferStrength(champion, attributes);
  }, 0);
  return clamp((total / Math.max(1, target)) * 10, 0, 10);
}

function evaluateDamageBalance(championIds: string[]) {
  if (championIds.length === 0) return 5;
  let ad = 0;
  let ap = 0;
  for (const championId of championIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;
    for (const token of champion.damageProfile.map((item) => String(item).toUpperCase())) {
      if (token.includes("AD")) ad += 1;
      if (token.includes("AP")) ap += 1;
      if (token.includes("TRUE")) {
        ad += 0.35;
        ap += 0.35;
      }
    }
  }
  const total = Math.max(1, ad + ap);
  const apShare = ap / total;
  const targetDistance = Math.abs(apShare - 0.5);
  let score = 10 - targetDistance * 16;
  if (apShare >= 0.76 || apShare <= 0.24) score -= 2.4;
  return clamp(score, 0, 10);
}

function inferCompIdentity(vector: TeamCompVector): TeamDraftEvaluation["compIdentity"] {
  const pickValue = PICK_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const diveValue = DIVE_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const pokeValue = POKE_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const teamfightValue = TEAMFIGHT_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const frontToBackValue = vectorValue(vector, "frontline") + vectorValue(vector, "peel") + vectorValue(vector, "disengage");
  const ranked = [
    { key: "front-to-back" as const, value: frontToBackValue },
    { key: "pick" as const, value: pickValue },
    { key: "dive" as const, value: diveValue },
    { key: "poke" as const, value: pokeValue },
    { key: "teamfight" as const, value: teamfightValue },
  ].sort((a, b) => b.value - a.value);
  if ((ranked[0]?.value ?? 0) < 7) return "balanced";
  return ranked[0]?.key ?? "balanced";
}

function evaluateRoleCoverage(championIds: string[]) {
  if (championIds.length === 0) return 0;
  const representedRoles = new Set<Role>();
  for (const championId of championIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;
    for (const role of champion.roles) representedRoles.add(role);
  }
  const rawCoverage = representedRoles.size / ROLE_ORDER.length;
  return clamp(rawCoverage * 10, 0, 10);
}

function getNeedRequirement(priority: 1 | 2 | 3) {
  if (priority === 3) return 7;
  if (priority === 2) return 5;
  return 3;
}

function evaluatePairSynergy(allyChampionIds: string[], enemyChampionIds: string[] = []) {
  let score = 0;
  const allyChampions = allyChampionIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion));
  const enemyChampions = enemyChampionIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion));
  for (const champion of allyChampions) {
    for (const relation of champion.synergyWith) {
      if (allyChampionIds.includes(relation.championId)) score += (relation.score ?? 3) * 0.35;
    }
    for (const relation of champion.mustWith) {
      if (allyChampionIds.includes(relation.championId)) score += (relation.score ?? 4) * 0.5;
      else score -= (relation.score ?? 4) * 0.2;
    }
  }
  const ruleScore = evaluateRuleSynergy(allyChampions, enemyChampions);
  return clamp(score * 0.55 + ruleScore * 0.75, 0, 10);
}

function evaluateCounterScore(allyChampionIds: string[], enemyChampionIds: string[]) {
  let score = 0;
  const allyChampions = allyChampionIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion));
  const enemyChampions = enemyChampionIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion));
  for (const champion of allyChampions) {
    for (const relation of champion.goodVs) {
      if (enemyChampionIds.includes(relation.championId)) score += (relation.score ?? 3) * 0.32;
    }
    for (const relation of champion.weakVs) {
      if (enemyChampionIds.includes(relation.championId)) score -= (relation.score ?? 3) * 0.32;
    }
  }
  const interactionScore = evaluateInteractionScore(allyChampions, enemyChampions);
  return clamp(score + interactionScore, 0, 10);
}

function evaluateWeaknessPenalty(allyChampionIds: string[], enemyVector: TeamCompVector) {
  let penalty = 0;
  for (const championId of allyChampionIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;
    for (const weakness of champion.weaknesses) {
      const exposure = vectorValue(enemyVector, String(weakness.exposedTo));
      penalty += Math.min(weakness.severity * 0.25 * exposure, 2);
    }
  }
  return clamp(penalty, 0, 10);
}

function evaluateRangeProfile(championIds: string[]) {
  if (championIds.length === 0) return 5;
  const safeCount = championIds.reduce((sum, championId) => {
    const champion = getChampionById(championId);
    if (!champion) return sum;
    const safe = RANGE_SAFE_IDS.has(champion.id) || getOfferStrength(champion, ["poke", "siege", "waveclear"]) >= 4;
    return sum + (safe ? 1 : 0);
  }, 0);
  return clamp((safeCount / championIds.length) * 10, 0, 10);
}

function isShortRangeChampion(champion: Champion | null) {
  if (!champion) return false;
  if (RANGE_SAFE_IDS.has(champion.id)) return false;
  return getOfferStrength(champion, ["dive", "backlineAccess", "engage", "burstDamage"]) >= 4;
}

function evaluateShortRangePenalty(championIds: string[]) {
  const shortRangeCount = championIds.reduce((sum, championId) => sum + (isShortRangeChampion(getChampionById(championId)) ? 1 : 0), 0);
  if (championIds.length < 4 || shortRangeCount <= 2) return 0;
  return clamp((shortRangeCount - 2) * 1.6, 0, 4.8);
}

function evaluateCarryProtectionPenalty(championIds: string[], vector: TeamCompVector) {
  const adcChampions = championIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion && champion.roles.includes("adc")));
  if (!adcChampions.length) return 0;
  const protectionSupply = vectorValue(vector, "peel") + vectorValue(vector, "antiDive") + vectorValue(vector, "disengage") + vectorValue(vector, "frontline");
  const required = adcChampions.reduce((sum, champion) => {
    const selfProtection = getCarrySelfProtectionScore(champion);
    const hardProtectBonus = HARD_PROTECT_CARRY_IDS.has(champion.id) ? 1.2 : 0;
    return sum + clamp(8.4 - selfProtection * 1.1 + hardProtectBonus, 3.2, 9);
  }, 0);
  return clamp((required - protectionSupply) * 0.2, 0, 5.5);
}

function evaluateExecutionDifficultyPenalty(championIds: string[]) {
  const difficulties = championIds
    .map((championId) => getChampionById(championId))
    .filter((champion): champion is Champion => Boolean(champion))
    .map((champion) => average(Object.values(champion.playerScaling ?? {}) as number[]))
    .filter((value) => Number.isFinite(value));
  if (!difficulties.length) return 0;
  return clamp((average(difficulties) - 3.8) * 0.85, 0, 3.5);
}

function getTopStrengths(vector: TeamCompVector) {
  return [...Object.entries(vector)].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([type, value]) => ({ type: type as NeedStatus["type"], value }));
}

function getRoleProfileScore(championIds: string[]) {
  const profiles = championIds.map((id) => getChampionRoleProfile(getChampionById(id))).filter(Boolean);
  if (!profiles.length) return 5;
  return clamp(average(profiles.map((profile) => {
    const p = profile!;
    return average([
      p.accessProfile.targetAccess,
      p.damageDelivery.reliability,
      p.threatProfile.backlineThreat,
      p.threatProfile.frontlineThreat,
      p.draftProfile.blindPick,
    ]);
  })), 0, 10);
}

function evaluateAccessScore(championIds: string[]) {
  const profiles = championIds.map((id) => getChampionRoleProfile(getChampionById(id))).filter(Boolean);
  if (!profiles.length) return 5;
  return clamp(average(profiles.map((profile) => average([profile!.accessProfile.engageRange, profile!.accessProfile.targetAccess, profile!.accessProfile.stickiness]))), 0, 10);
}

function evaluateThreatScore(championIds: string[]) {
  const profiles = championIds.map((id) => getChampionRoleProfile(getChampionById(id))).filter(Boolean);
  if (!profiles.length) return 5;
  return clamp(average(profiles.map((profile) => average(Object.values(profile!.threatProfile)))), 0, 10);
}

function evaluateTeamIdentityScore(context: TeamDraftContext, compIdentity: TeamDraftEvaluation["compIdentity"]) {
  const champions = context.championIds.map((id) => getChampionById(id));
  return evaluateTeamIdentity(context.team, compIdentity, champions);
}

export function createEmptyCompVector(): TeamCompVector {
  return Object.fromEntries(COMP_ATTRIBUTE_ORDER.map((key) => [key, 0])) as TeamCompVector;
}

export function getChampionById(championId: string) {
  return championMap.get(championId) ?? null;
}

export function getPlayerById(playerId: string) {
  return playersById.get(playerId) ?? null;
}

export function getMetaPriorityScore(champion: Champion): number {
  const effectivePresence = Math.max(champion.stats.presence ?? 0, champion.stats.picks + champion.stats.bans);
  const presenceRate = clamp(effectivePresence / maxPresence, 0, 1);
  const banRate = clamp((champion.stats.bans ?? 0) / maxBans, 0, 1);
  const avgPickRound = champion.stats.avgPickRound ?? 3;
  const pickPriorityRate = clamp(1 / Math.max(1, avgPickRound), 0, 1);
  const blindRate = clamp((champion.stats.blindPickRate ?? 40) / 100, 0, 1);
  return clamp((presenceRate * 0.53 + banRate * 0.22 + pickPriorityRate * 0.15 + blindRate * 0.1) * 10, 0, 10);
}

export function getPlayerChampionFitScore(playerStats: PlayerStats, scaling?: ChampionPlayerScaling): number {
  if (!scaling) return 5;
  const entries = Object.entries(scaling) as Array<[keyof PlayerStats, number]>;
  if (!entries.length) return 5;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [statKey, weight] of entries) {
    weightedSum += playerStats[statKey] * weight;
    totalWeight += weight;
  }
  return totalWeight === 0 ? 5 : clamp(weightedSum / totalWeight, 0, 10);
}

export function getProjectedPlayerChampionFitScore(player: Player | null, champion: Champion | null, role?: Role | null): number {
  if (!player || !champion) return 5;
  const legacyFit = getPlayerChampionFitScore(player.stats, champion.playerScaling);
  const phaseProfile = derivePlayerPhaseProfile(player);
  const archetype = derivePlayerArchetypeAffinity(player);
  const adaptation = derivePlayerAdaptationProfile(player);
  const roleProfile = getChampionRoleProfile(champion, role ?? player.role) ?? getChampionRoleProfile(champion);
  if (!roleProfile) return legacyFit;
  const phaseFit = average([
    phaseProfile.early.skirmish / 1.15,
    phaseProfile.mid.mapPlay / 1.1,
    phaseProfile.late.teamfight / 1.05,
  ]);
  const archetypeFit = average([
    roleProfile.tags.includes("engage") ? archetype.engage : 5,
    roleProfile.tags.includes("enchanter") ? archetype.enchanter : 5,
    roleProfile.tags.includes("frontline") ? archetype.tank : 5,
    roleProfile.tags.includes("dive") ? archetype.dive : 5,
    roleProfile.tags.includes("dps") || roleProfile.tags.includes("primary-carry") ? archetype.carry : 5,
  ]);
  const executionMatch = clamp(10 - Math.max(0, average(Object.values(champion.playerScaling ?? {}) as number[]) - average([phaseProfile.late.teamfight, adaptation.composure, adaptation.matchupLearning])), 0, 10);
  return clamp(legacyFit * 0.44 + phaseFit * 0.24 + archetypeFit * 0.22 + executionMatch * 0.10, 0, 10);
}

export function buildDerivedChampionPool(player: Player, role: Role): string[] {
  const directPool = new Set([...player.bestChampions, ...player.comfortChampions, ...player.championPool]);
  for (const champion of champions) {
    if (!champion.roles.includes(role)) continue;
    const fit = getProjectedPlayerChampionFitScore(player, champion, role);
    if (fit >= 6.5) directPool.add(champion.id);
  }
  return Array.from(directPool);
}

export function getComfortScore(player: Player | null, champion: Champion): number {
  if (!player) return 5;
  let base = champion.roles.includes(player.role) ? 4.75 : 2.5;
  if (player.bestChampions.includes(champion.id)) base = 10;
  else if (player.comfortChampions.includes(champion.id)) base = 8.5;
  else if (player.championPool.includes(champion.id)) base = 7.25;
  else if (buildDerivedChampionPool(player, player.role).includes(champion.id)) base = 6.5;
  const signatureBonus = getPlayerChampionSignatureBonus(player.id, champion.id);
  return clamp(base + signatureBonus * 0.35, 0, 10);
}

export function buildCompVector(championIds: string[]): TeamCompVector {
  const vector = createEmptyCompVector();
  for (const championId of championIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;
    for (const offer of champion.offers) addVectorValue(vector, String(offer.type), offer.strength);
  }
  return vector;
}

export function evaluateNeedStatuses(championIds: string[]): NeedStatus[] {
  const vector = buildCompVector(championIds);
  const statusMap = new Map<string, NeedStatus>();
  for (const championId of championIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;
    for (const need of champion.needs) {
      const required = getNeedRequirement(need.priority);
      const type = normalizeAttribute(String(need.type));
      if (!COMP_ATTRIBUTE_ORDER.includes(type as never)) continue;
      const current = vectorValue(vector, type);
      const missing = Math.max(0, required - current);
      const existing = statusMap.get(type);
      if (!existing || missing > existing.missing) {
        statusMap.set(type, { type: type as NeedStatus["type"], required, current, missing });
      }
    }
  }
  return Array.from(statusMap.values()).sort((a, b) => b.missing - a.missing);
}

export function evaluatePlayerPower(roster: Partial<Record<Role, string>>, assignments: Partial<Record<Role, string>>): number {
  let total = 0;
  let count = 0;
  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const championId = assignments[role];
    if (!playerId || !championId) continue;
    const player = getPlayerById(playerId);
    const champion = getChampionById(championId);
    if (!player || !champion) continue;
    const fit = getProjectedPlayerChampionFitScore(player, champion, role);
    const comfort = getComfortScore(player, champion);
    const adjustedFit = getHistoryAdjustedDraftFit(fit, player.id, champion.id);
    const historyBonus = getPlayerChampionHistoryBonus(player.id, champion.id);
    total += adjustedFit * 0.42 + comfort * 0.24 + advancedPrimary(player, "adaptability", player.stats.iq) * 0.16 + advancedPrimary(player, "teamfighting", player.stats.tfg) * 0.12 + (5 + historyBonus * 2) * 0.06;
    count += 1;
  }
  return count === 0 ? 0 : total / count;
}

export function evaluateTeamDraft(context: TeamDraftContext): TeamDraftEvaluation {
  const vector = buildCompVector(context.championIds);
  const enemyVector = buildCompVector(context.enemyChampionIds);
  const missingNeeds = evaluateNeedStatuses(context.championIds);
  const satisfiedNeeds = missingNeeds.filter((need) => need.missing === 0).length;
  const needScore = clamp((satisfiedNeeds / Math.max(1, missingNeeds.length)) * 10, 0, 10);
  const synergyScore = evaluatePairSynergy(context.championIds, context.enemyChampionIds);
  const counterScore = evaluateCounterScore(context.championIds, context.enemyChampionIds);
  const weaknessPenalty = evaluateWeaknessPenalty(context.championIds, enemyVector);
  const engageScore = evaluateStructuralScore(context.championIds, ENGAGE_ATTRIBUTES, 11);
  const frontlineScore = evaluateStructuralScore(context.championIds, FRONTLINE_ATTRIBUTES, 12);
  const damageBalanceScore = evaluateDamageBalance(context.championIds);
  const roleCoverageScore = evaluateRoleCoverage(context.championIds);
  const executionEaseScore = evaluateStructuralScore(context.championIds, EXECUTION_HELP_ATTRIBUTES, 12);
  const protectionScore = evaluateStructuralScore(context.championIds, PROTECTION_ATTRIBUTES, 10);
  const antiDiveScore = evaluateStructuralScore(context.championIds, ANTI_DIVE_ATTRIBUTES, 10);
  const primaryEngageScore = evaluateStructuralScore(context.championIds, PRIMARY_ENGAGE_ATTRIBUTES, 9);
  const followUpScore = evaluateStructuralScore(context.championIds, FOLLOW_UP_ATTRIBUTES, 9);
  const rangeProfileScore = evaluateRangeProfile(context.championIds);
  const shortRangePenalty = evaluateShortRangePenalty(context.championIds);
  const carryProtectionPenalty = evaluateCarryProtectionPenalty(context.championIds, vector);
  const executionDifficultyPenalty = evaluateExecutionDifficultyPenalty(context.championIds);
  const compIdentity = inferCompIdentity(vector);
  const accessScore = evaluateAccessScore(context.championIds);
  const threatScore = evaluateThreatScore(context.championIds);
  const roleProfileScore = getRoleProfileScore(context.championIds);
  const teamIdentity = evaluateTeamIdentityScore(context, compIdentity);
  const teamIdentityScore = teamIdentity.score;

  const metaScore = average(context.championIds.map((id) => getChampionById(id)).filter(Boolean).map((champion) => getMetaPriorityScore(champion!)));
  const comfortValues: number[] = [];
  const fitValues: number[] = [];

  for (const role of ROLE_ORDER) {
    const playerId = context.roster[role];
    const championId = context.championIds.find((id) => getChampionById(id)?.roles.includes(role));
    if (!playerId || !championId) continue;
    const player = context.playersById.get(playerId) ?? null;
    const champion = getChampionById(championId);
    if (!player || !champion) continue;
    comfortValues.push(getComfortScore(player, champion));
    fitValues.push(getHistoryAdjustedDraftFit(getProjectedPlayerChampionFitScore(player, champion, role), player.id, champion.id));
  }

  const comfortScore = average(comfortValues);
  const playerFitScore = average(fitValues);
  const rosterExecutionScore = evaluatePlayerPower(context.roster, Object.fromEntries(context.championIds.map((id, idx) => [ROLE_ORDER[idx] ?? ROLE_ORDER[0], id])) as Partial<Record<Role, string>>);

  let structurePenalty = 0;
  if (context.championIds.length >= 3 && engageScore < 4.2) structurePenalty += 0.8;
  if (context.championIds.length >= 4 && frontlineScore < 4.2) structurePenalty += 1.2;
  if (context.championIds.length >= 4 && protectionScore < 4.2 && carryProtectionPenalty > 1.5) structurePenalty += 0.8;

  const simulationReadiness = evaluateSimulationReadiness(
    context.championIds.map((id) => getChampionById(id)),
    {
      compVector: vector,
      protectionScore,
      frontlineScore,
      primaryEngageScore,
      followUpScore,
      accessScore,
      threatScore,
      roleProfileScore,
    }
  );
  const simulationReadinessScore = clamp(average([
    accessScore,
    threatScore,
    roleProfileScore,
    rosterExecutionScore,
    teamIdentityScore,
    simulationReadiness.score,
  ]), 0, 10);

  const draftPower = clamp(
    metaScore * 0.1 + comfortScore * 0.1 + playerFitScore * 0.14 + synergyScore * 0.11 + needScore * 0.08 + counterScore * 0.08 +
    engageScore * 0.045 + frontlineScore * 0.045 + damageBalanceScore * 0.04 + roleCoverageScore * 0.035 + executionEaseScore * 0.03 + protectionScore * 0.04 +
    antiDiveScore * 0.03 + primaryEngageScore * 0.025 + followUpScore * 0.02 + rangeProfileScore * 0.02 + rosterExecutionScore * 0.045 + accessScore * 0.05 + threatScore * 0.05 +
    roleProfileScore * 0.04 + teamIdentityScore * 0.03 + simulationReadinessScore * 0.055 - weaknessPenalty * 0.07 - shortRangePenalty * 0.2 - carryProtectionPenalty * 0.46 -
    executionDifficultyPenalty * 0.4 - structurePenalty,
    0,
    10
  );

  return {
    compVector: vector,
    synergyScore,
    needScore,
    weaknessPenalty,
    counterScore,
    metaScore,
    playerFitScore,
    comfortScore,
    engageScore,
    frontlineScore,
    damageBalanceScore,
    roleCoverageScore,
    executionEaseScore,
    protectionScore,
    antiDiveScore,
    primaryEngageScore,
    followUpScore,
    rangeProfileScore,
    shortRangePenalty,
    carryProtectionPenalty,
    executionDifficultyPenalty,
    rosterExecutionScore,
    compIdentity,
    draftPower,
    missingNeeds,
    topStrengths: getTopStrengths(vector),
    accessScore,
    threatScore,
    roleProfileScore,
    teamIdentityScore,
    simulationReadinessScore,
    simulationRisks: simulationReadiness.risks,
    identityMatchedTags: teamIdentity.matchedTags,
    identityAvoidedTags: teamIdentity.avoidedTags,
    identityNote: teamIdentity.note,
  };
}
