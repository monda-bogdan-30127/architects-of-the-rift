import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import { COMP_ATTRIBUTE_ORDER } from "@/app/types/compAttributes";
import type { Champion, ChampionPlayerScaling, Role } from "@/app/types/champion";
import type { Player, PlayerStats } from "@/app/types/player";
import type {
  NeedStatus,
  TeamCompVector,
  TeamDraftContext,
  TeamDraftEvaluation,
} from "./draftTypes";
import { ROLE_ORDER } from "./draftTypes";
import { getCarrySelfProtectionScore } from "./draftArchetypes";
import {
  getHistoryAdjustedDraftFit,
  getPlayerChampionHistoryBonus,
  getPlayerChampionSignatureBonus,
} from "./playerHistoryEvaluator";

const championMap = new Map(champions.map((champion) => [champion.id, champion]));
const playersById = new Map(players.map((player) => [player.id, player]));

const maxPresence = Math.max(
  1,
  ...champions.map((champion) =>
    Math.max(champion.stats.presence ?? 0, champion.stats.picks + champion.stats.bans)
  )
);
const maxBans = Math.max(1, ...champions.map((champion) => champion.stats.bans ?? 0));

const ATTRIBUTE_ALIASES: Record<string, string> = {
  burstDamage: "burst",
  followup: "followUp",
  antiDive: "antiDive",
  frontToBack: "frontToBack",
  splitpush: "sideLanePressure",
  durability: "frontline",
  range: "poke",
  sustainedDamage: "sustainedDamage",
};

const ENGAGE_ATTRIBUTES = ["engage", "reliableCC", "pick", "roamPressure"];
const FRONTLINE_ATTRIBUTES = ["frontline", "peel", "engage"];
const EXECUTION_HELP_ATTRIBUTES = ["reliableCC", "frontToBack", "peel", "disengage", "waveclear"];
const PROTECTION_ATTRIBUTES = ["peel", "antiDive", "disengage", "frontline", "frontToBack"];
const ANTI_DIVE_ATTRIBUTES = ["antiDive", "peel", "disengage", "frontline"];
const PRIMARY_ENGAGE_ATTRIBUTES = ["engage", "pick"];
const FOLLOW_UP_ATTRIBUTES = ["followUp", "aoe", "wombo", "burst"];
const POKE_ATTRIBUTES = ["poke", "siege", "waveclear"];
const DIVE_ATTRIBUTES = ["dive", "backlineAccess", "engage", "roamPressure"];
const PICK_ATTRIBUTES = ["pick", "reliableCC", "roamPressure", "burst"];
const TEAMFIGHT_ATTRIBUTES = ["aoe", "engage", "frontToBack", "wombo", "teamfight", "followUp"];
const RANGE_SAFE_IDS = new Set(["ezreal", "corki", "xayah", "zeri", "lucian", "sivir", "varus", "jinx", "kogmaw"]);
const HARD_PROTECT_CARRY_IDS = new Set(["kogmaw", "jinx", "aphelios", "vayne", "yunara"]);
const SELF_SUFFICIENT_CARRY_IDS = new Set(["ezreal", "corki", "xayah", "kaisa", "lucian", "varus"]);

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

function getRawPlayerQuality(player: Player) {
  return clamp(
    player.stats.mec * 0.2 +
      player.stats.mac * 0.16 +
      player.stats.tfg * 0.18 +
      player.stats.con * 0.16 +
      player.stats.iq * 0.15 +
      player.stats.clt * 0.15,
    0,
    10
  );
}

function getOfferStrength(champion: Champion | null, attributes: string[]) {
  if (!champion) return 0;
  return champion.offers
    .filter((offer) => attributes.includes(normalizeAttribute(String(offer.type))))
    .reduce((sum, offer) => sum + offer.strength, 0);
}

function getChampionDamageWeights(champion: Champion | null) {
  if (!champion) return { ad: 0.5, ap: 0.5 };

  const raw = (champion as Champion & { damageProfile?: string[] }).damageProfile ?? [];
  let ad = 0;
  let ap = 0;

  for (const token of raw.map((item) => String(item).toUpperCase())) {
    if (token.includes("AD")) ad += 1;
    if (token.includes("AP") || token.includes("MAG")) ap += 1;
    if (token.includes("TRUE")) {
      ad += 0.35;
      ap += 0.35;
    }
  }

  if (ad === 0 && ap === 0) {
    if (champion.roles.includes("adc" as Role)) {
      ad = 0.85;
      ap = 0.15;
    } else if (champion.roles.includes("mid" as Role)) {
      ad = 0.35;
      ap = 0.65;
    } else if (champion.roles.includes("support" as Role)) {
      ad = 0.3;
      ap = 0.7;
    } else {
      ad = 0.5;
      ap = 0.5;
    }
  }

  const total = Math.max(1, ad + ap);
  return { ad: ad / total, ap: ap / total };
}

function evaluateDamageBalance(championIds: string[]) {
  if (championIds.length === 0) return 5;

  let ad = 0;
  let ap = 0;
  for (const championId of championIds) {
    const weights = getChampionDamageWeights(getChampionById(championId));
    ad += weights.ad;
    ap += weights.ap;
  }

  const total = Math.max(1, ad + ap);
  const apShare = ap / total;
  const adShare = ad / total;
  const targetDistance = Math.abs(apShare - 0.5);
  let score = 10 - targetDistance * 16;

  if (apShare >= 0.76 || adShare >= 0.76) score -= 2.4;
  if (apShare >= 0.84 || adShare >= 0.84) score -= 2.2;

  return clamp(score, 0, 10);
}

function inferCompIdentity(vector: TeamCompVector): TeamDraftEvaluation["compIdentity"] {
  const pickValue = PICK_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const diveValue = DIVE_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const pokeValue = POKE_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const teamfightValue = TEAMFIGHT_ATTRIBUTES.reduce((sum, key) => sum + vectorValue(vector, key), 0);
  const frontToBackValue =
    vectorValue(vector, "frontToBack") +
    vectorValue(vector, "frontline") +
    vectorValue(vector, "peel") +
    vectorValue(vector, "disengage");

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

function evaluateStructuralScore(championIds: string[], attributes: string[], target: number) {
  const total = championIds.reduce((sum, championId) => {
    const champion = getChampionById(championId);
    return sum + getOfferStrength(champion, attributes);
  }, 0);

  return clamp((total / Math.max(1, target)) * 10, 0, 10);
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
  let score = rawCoverage * 10;
  if (championIds.length >= 4 && representedRoles.size < 4) score -= 2.5;
  if (championIds.length === 5 && representedRoles.size < 5) score -= 3;
  return clamp(score, 0, 10);
}

function isShortRangeChampion(champion: Champion | null) {
  if (!champion) return false;
  if (RANGE_SAFE_IDS.has(champion.id)) return false;
  return getOfferStrength(champion, ["dive", "backlineAccess", "engage", "burst"]) >= 4;
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

function evaluateShortRangePenalty(championIds: string[]) {
  const shortRangeCount = championIds.reduce((sum, championId) => {
    const champion = getChampionById(championId);
    return sum + (isShortRangeChampion(champion) ? 1 : 0);
  }, 0);
  if (championIds.length < 4) return 0;
  if (shortRangeCount <= 2) return 0;
  return clamp((shortRangeCount - 2) * 1.6, 0, 4.8);
}

function evaluateCarryProtectionPenalty(championIds: string[], vector: TeamCompVector) {
  const adcChampions = championIds
    .map((championId) => getChampionById(championId))
    .filter((champion): champion is Champion => champion !== null && champion.roles.includes("adc"));
  if (adcChampions.length === 0) return 0;

  const protectionSupply =
    vectorValue(vector, "peel") +
    vectorValue(vector, "antiDive") +
    vectorValue(vector, "disengage") +
    vectorValue(vector, "frontline");

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

  if (difficulties.length === 0) return 0;
  const avgDifficulty = average(difficulties);
  return clamp((avgDifficulty - 3.8) * 0.85, 0, 3.5);
}

function evaluateRosterExecution(roster: Partial<Record<Role, string>>, championIds: string[]) {
  const championByRole = new Map<Role, Champion>();
  for (const championId of championIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;
    for (const role of champion.roles) {
      if (!championByRole.has(role)) {
        championByRole.set(role, champion);
      }
    }
  }

  const scores: number[] = [];
  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const player = playerId ? getPlayerById(playerId) : null;
    const champion = championByRole.get(role) ?? null;
    if (!player || !champion) continue;

    const playerSkill = (player.stats.mec + player.stats.mac + player.stats.iq + player.stats.tfg) / 4;
    const difficulty = average(Object.values(champion.playerScaling ?? {}) as number[]) || 5;
    scores.push(clamp(playerSkill * 0.72 + (10 - difficulty) * 0.28, 0, 10));
  }

  return scores.length > 0 ? average(scores) : 5;
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
  const effectivePresence = Math.max(
    champion.stats.presence ?? 0,
    champion.stats.picks + champion.stats.bans
  );

  const presenceRate = clamp(effectivePresence / maxPresence, 0, 1);
  const banRate = clamp((champion.stats.bans ?? 0) / maxBans, 0, 1);
  const avgPickRound = champion.stats.avgPickRound ?? 3;
  const pickPriorityRate = clamp(1 / Math.max(1, avgPickRound), 0, 1);
  const blindRate = clamp((champion.stats.blindPickRate ?? 40) / 100, 0, 1);

  const raw = presenceRate * 0.53 + banRate * 0.22 + pickPriorityRate * 0.15 + blindRate * 0.1;
  return clamp(raw * 10, 0, 10);
}

export function getPlayerChampionFitScore(
  playerStats: PlayerStats,
  scaling?: ChampionPlayerScaling
): number {
  if (!scaling) return 5;

  const entries = Object.entries(scaling) as Array<[keyof PlayerStats, number]>;
  if (entries.length === 0) return 5;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [statKey, weight] of entries) {
    weightedSum += playerStats[statKey] * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 5;
  return clamp(weightedSum / totalWeight, 0, 10);
}

export function buildDerivedChampionPool(player: Player, role: Role): string[] {
  const directPool = new Set([
    ...player.bestChampions,
    ...player.comfortChampions,
    ...player.championPool,
  ]);

  for (const champion of champions) {
    if (!champion.roles.includes(role)) continue;
    const fit = getPlayerChampionFitScore(player.stats, champion.playerScaling);
    if (fit >= 6.5) {
      directPool.add(champion.id);
    }
  }

  return Array.from(directPool);
}

export function getComfortScore(player: Player | null, champion: Champion): number {
  if (!player) return 5;

  let base = champion.roles.includes(player.role) ? 4.75 : 2.5;
  if (player.bestChampions.includes(champion.id)) base = 10;
  else if (player.comfortChampions.includes(champion.id)) base = 8.5;
  else if (player.championPool.includes(champion.id)) base = 7.25;
  else {
    const derivedPool = buildDerivedChampionPool(player, player.role);
    if (derivedPool.includes(champion.id)) {
      base = 6.5;
    }
  }

  const signatureBonus = getPlayerChampionSignatureBonus(player.id, champion.id);
  return clamp(base + signatureBonus * 0.35, 0, 10);
}

export function buildCompVector(championIds: string[]): TeamCompVector {
  const vector = createEmptyCompVector();

  for (const championId of championIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;

    for (const offer of champion.offers) {
      addVectorValue(vector, String(offer.type), offer.strength);
    }
  }

  return vector;
}

function getNeedRequirement(priority: 1 | 2 | 3) {
  if (priority === 3) return 7;
  if (priority === 2) return 5;
  return 3;
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
        statusMap.set(type, {
          type: type as NeedStatus["type"],
          required,
          current,
          missing,
        });
      }
    }
  }

  return Array.from(statusMap.values()).sort((a, b) => b.missing - a.missing);
}

export function evaluatePlayerPower(
  roster: Partial<Record<Role, string>>,
  assignments: Partial<Record<Role, string>>
): number {
  let total = 0;
  let count = 0;

  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const championId = assignments[role];
    if (!playerId || !championId) continue;

    const player = getPlayerById(playerId);
    const champion = getChampionById(championId);
    if (!player || !champion) continue;

    const fit = getPlayerChampionFitScore(player.stats, champion.playerScaling);
    const comfort = getComfortScore(player, champion);
    const adjustedFit = getHistoryAdjustedDraftFit(fit, player.id, champion.id);
    const historyBonus = getPlayerChampionHistoryBonus(player.id, champion.id);
    const rawPlayerQuality = getRawPlayerQuality(player);
    total +=
      adjustedFit * 0.42 +
      comfort * 0.28 +
      rawPlayerQuality * 0.22 +
      (5 + historyBonus * 2) * 0.08;
    count += 1;
  }

  return count === 0 ? 0 : total / count;
}

function evaluatePairSynergy(allyChampionIds: string[]) {
  let score = 0;

  for (const championId of allyChampionIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;

    for (const relation of champion.synergyWith) {
      if (allyChampionIds.includes(relation.championId)) {
        score += (relation.score ?? 3) * 0.35;
      }
    }

    for (const relation of champion.mustWith) {
      if (allyChampionIds.includes(relation.championId)) {
        score += (relation.score ?? 4) * 0.5;
      }
    }
  }

  return clamp(score, 0, 10);
}

function evaluateCounterScore(allyChampionIds: string[], enemyChampionIds: string[]) {
  let score = 0;

  for (const championId of allyChampionIds) {
    const champion = getChampionById(championId);
    if (!champion) continue;

    for (const relation of champion.goodVs) {
      if (enemyChampionIds.includes(relation.championId)) {
        score += (relation.score ?? 3) * 0.32;
      }
    }

    for (const relation of champion.weakVs) {
      if (enemyChampionIds.includes(relation.championId)) {
        score -= (relation.score ?? 3) * 0.32;
      }
    }
  }

  return clamp(score + 5, 0, 10);
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

function getTopStrengths(vector: TeamCompVector): Array<{ type: import("@/app/types/compAttributes").CompAttribute; value: number }> {
  return [...Object.entries(vector)]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, value]) => ({ type: type as import("@/app/types/compAttributes").CompAttribute, value }));
}

export function evaluateTeamDraft(context: TeamDraftContext): TeamDraftEvaluation {
  const vector = buildCompVector(context.championIds);
  const enemyVector = buildCompVector(context.enemyChampionIds);
  const missingNeeds = evaluateNeedStatuses(context.championIds);
  const satisfiedNeeds = missingNeeds.filter((need) => need.missing === 0).length;
  const totalNeeds = Math.max(1, missingNeeds.length);
  const needScore = clamp((satisfiedNeeds / totalNeeds) * 10, 0, 10);
  const synergyScore = evaluatePairSynergy(context.championIds);
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
  const rosterExecutionScore = evaluateRosterExecution(context.roster, context.championIds);
  const compIdentity = inferCompIdentity(vector);

  const metaValues = context.championIds
    .map((championId) => getChampionById(championId))
    .filter((champion): champion is Champion => Boolean(champion))
    .map((champion) => getMetaPriorityScore(champion));
  const metaScore = average(metaValues);

  const comfortValues: number[] = [];
  const fitValues: number[] = [];

  for (const role of ROLE_ORDER) {
    const playerId = context.roster[role];
    const championId = context.championIds.find((id) => {
      const champion = getChampionById(id);
      return champion?.roles.includes(role) ?? false;
    });

    if (!playerId || !championId) continue;
    const player = context.playersById.get(playerId) ?? null;
    const champion = getChampionById(championId);
    if (!player || !champion) continue;

    const comfort = getComfortScore(player, champion);
    const fit = getPlayerChampionFitScore(player.stats, champion.playerScaling);
    comfortValues.push(comfort);
    fitValues.push(getHistoryAdjustedDraftFit(fit, player.id, champion.id));
  }

  const comfortScore = average(comfortValues);
  const playerFitScore = average(fitValues);

  let structurePenalty = 0;
  if (context.championIds.length >= 3 && engageScore < 4.2) structurePenalty += 0.8;
  if (context.championIds.length >= 4 && frontlineScore < 4.2) structurePenalty += 1.2;
  if (context.championIds.length >= 4 && damageBalanceScore < 4.5) structurePenalty += 1.2;
  if (context.championIds.length >= 4 && roleCoverageScore < 6) structurePenalty += 1;
  if (context.championIds.length >= 4 && protectionScore < 4.2 && carryProtectionPenalty > 1.5) structurePenalty += 0.8;
  if (primaryEngageScore < 3.8 && compIdentity !== "poke") structurePenalty += 0.7;

  const draftPower = clamp(
    metaScore * 0.12 +
      comfortScore * 0.12 +
      playerFitScore * 0.14 +
      synergyScore * 0.13 +
      needScore * 0.11 +
      counterScore * 0.1 +
      engageScore * 0.05 +
      frontlineScore * 0.05 +
      damageBalanceScore * 0.045 +
      roleCoverageScore * 0.04 +
      executionEaseScore * 0.04 +
      protectionScore * 0.045 +
      antiDiveScore * 0.035 +
      primaryEngageScore * 0.03 +
      followUpScore * 0.025 +
      rangeProfileScore * 0.02 +
      rosterExecutionScore * 0.04 -
      weaknessPenalty * 0.075 -
      shortRangePenalty * 0.22 -
      carryProtectionPenalty * 0.5 -
      executionDifficultyPenalty * 0.42 -
      structurePenalty,
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
  };
}
