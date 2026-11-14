import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import { legacyStatScore, normalizeLegacyStats } from "@/app/utils/legacyStats";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { COMP_ATTRIBUTE_ORDER } from "@/app/types/compAttributes";
import type { Champion, ChampionPlayerScaling, Role } from "@/app/types/champion";
import type { Player, PlayerStats } from "@/app/types/player";
import type { NeedStatus, TeamCompVector, TeamDraftContext, TeamDraftEvaluation } from "./draftTypes";
import { ROLE_ORDER } from "./draftTypes";
import { getCarrySelfProtectionScore } from "./draftArchetypes";
import { getChampionRoleProfile } from "./championProfileSystem";
import { getChampionStatsForRole } from "./championRoleStatsSystem";
import { derivePlayerAdaptationProfile, derivePlayerArchetypeAffinity, derivePlayerPhaseProfile } from "./playerProfileSystem";
import { evaluateInteractionScore, evaluateRuleSynergy } from "./profileRuleEvaluator";
import { getLaneMatchupEdge } from "./matchupScoring";
import { championMetaPower, getChampionPhasePower, getTeamChampionPhasePower } from "./matchSimulationUtils";
import { MUSTWITH_CONFIG, getCompletedMustWithPairs, hadAvailableUnusedPartner } from "./mustWithPriority";
import { getBadSynergyPenalty } from "./badSynergy";
import { resolveRoleAssignments } from "./draftRoleResolver";
import { readCompIdentity } from "./compIdentity";
import { evaluateContextualNeedStatuses } from "./contextualNeeds";
import { evaluateTeamIdentity } from "./teamIdentitySystem";
import { evaluateSimulationReadiness } from "./simulationReadinessSystem";
import {
  getHistoryAdjustedDraftFit,
  getPlayerChampionHistoryBonus,
  getPlayerChampionSignatureBonus,
} from "./playerHistoryEvaluator";
import {
  hasMasteryOverride,
  getChampionGrade,
  gradeToComfortScore,
} from "@/app/utils/championMasteryUtils";

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
// DRAFT_SIM_ALIGNMENT §8.3: era aceeași listă ca PROTECTION_ATTRIBUTES (deci antiDiveScore = protectionScore în
// fiecare joc). Anti-dive = ce pedepsește un diver ajuns în backline: unelte antiDive, CC sigur, control de zonă.
const ANTI_DIVE_ATTRIBUTES = ["antiDive", "reliableCC", "zoneControl"];
const PRIMARY_ENGAGE_ATTRIBUTES = ["engage", "pick"];
const FOLLOW_UP_ATTRIBUTES = ["followUp", "burstDamage"];
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

/** Identitatea finală — din `readCompIdentity` (DRAFT_THINKING §3), aceeași sursă ca draftul. */
function inferCompIdentity(
  championIds: string[],
  assignments: Partial<Record<Role, string>>
): TeamDraftEvaluation["compIdentity"] {
  return readCompIdentity(championIds, assignments).dominant ?? "balanced";
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

export function getNeedRequirement(priority: 1 | 2 | 3) {
  if (priority === 3) return 7;
  if (priority === 2) return 5;
  return 3;
}

/** Factorul perechilor din `synergyWith` în evaluator; anti-sinergiile folosesc același factor. */
const BAD_PAIR_SYNERGY_FACTOR = 0.35;

function evaluatePairSynergy(
  allyChampionIds: string[],
  enemyChampionIds: string[],
  assignments: Partial<Record<Role, string>>,
  roster: Partial<Record<Role, string>>,
  unavailable: ReadonlySet<string> | null
) {
  let score = 0;
  const allyChampions = allyChampionIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion));
  const enemyChampions = enemyChampionIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion));
  for (const champion of allyChampions) {
    for (const relation of champion.synergyWith) {
      if (allyChampionIds.includes(relation.championId)) score += (relation.score ?? 3) * BAD_PAIR_SYNERGY_FACTOR;
    }
  }
  // Anti-sinergiile (`badSynergyWith`) din draftul final: fiecare pereche o dată, același factor ca synergyWith.
  for (let i = 0; i < allyChampionIds.length; i += 1) {
    for (let j = i + 1; j < allyChampionIds.length; j += 1) {
      score -= getBadSynergyPenalty(allyChampionIds[i], allyChampionIds[j]) * BAD_PAIR_SYNERGY_FACTOR;
    }
  }

  // 4.7: perechea mustWith completă → bonus fix (botlane > restul).
  for (const pair of getCompletedMustWithPairs(assignments)) {
    score += pair.isBotPair ? MUSTWITH_CONFIG.evaluatorPairBonus.bot : MUSTWITH_CONFIG.evaluatorPairBonus.other;
  }
  // Ancoră fără partener → mică penalizare doar dacă un partener era disponibil.
  if (unavailable) {
    for (const [role, championId] of Object.entries(assignments) as [Role, string | undefined][]) {
      if (championId && hadAvailableUnusedPartner(championId, role, assignments, roster, unavailable)) {
        score -= MUSTWITH_CONFIG.evaluatorMissedPairPenalty;
      }
    }
  }

  const ruleScore = evaluateRuleSynergy(allyChampions, enemyChampions);
  return clamp(score * 0.55 + ruleScore * 0.75, 0, 10);
}

/** Factorul valorilor de matchup în scorul de counter al draftului încheiat (calibrat în §4.9). */
export const EVALUATOR_COUNTER_FACTOR = 0.4;

/**
 * DRAFT_SIM_ALIGNMENT §3.1: matchup-ul direct pe lane, cu aceeași funcție ca simularea (getLaneMatchupEdge).
 * Media pe rolurile cu campion propriu; adversarul încă nedraftat pe rol = 0 (neutru). 5 = lane-uri egale.
 */
function evaluateCounterScore(
  assignments: Partial<Record<Role, string>>,
  enemyAssignments: Partial<Record<Role, string>>,
  roster: Partial<Record<Role, string>>,
  enemyRoster: Partial<Record<Role, string>>
) {
  const edges = ROLE_ORDER.filter((role) => assignments[role]).map((role) => getLaneMatchupEdge(role, assignments, enemyAssignments, roster, enemyRoster));
  if (!edges.length) return 5;
  return clamp(5 + average(edges) * DRAFT_THINKING_CONFIG.draftEvaluation.counterScale, 0, 10);
}

type PhaseKey = "early" | "mid" | "late";
const PHASE_KEYS: PhaseKey[] = ["early", "mid", "late"];
/** Media ligii a puterii campionilor pe rol și fază (toți campionii care pot juca rolul). */
const leaguePhasePower = new Map<string, number>();
function leaguePhasePowerFor(role: Role, phase: PhaseKey) {
  const key = `${role}:${phase}`;
  let value = leaguePhasePower.get(key);
  if (value === undefined) {
    value = average(champions.filter((champion) => champion.roles.includes(role)).map((champion) => getChampionPhasePower(champion.id, role, phase)));
    leaguePhasePower.set(key, value);
  }
  return value;
}

/**
 * DRAFT_SIM_ALIGNMENT §3.2: puterea campionilor pe faze, cu ponderile din simulare. Cu ambele echipe complete,
 * diferența getTeamChampionPhasePower folosită în simulare; în timpul draftului, pe rolurile cu campion propriu:
 * puterea noastră − a adversarului de pe rol (media ligii, dacă rolul lui e încă liber).
 */
function evaluatePhasePowerScore(assignments: Partial<Record<Role, string>>, enemyAssignments: Partial<Record<Role, string>>) {
  const roles = ROLE_ORDER.filter((role) => assignments[role]);
  if (!roles.length) return 5;
  const weights = DRAFT_THINKING_CONFIG.simulation.phaseChampionWeights;
  const complete = roles.length === ROLE_ORDER.length && ROLE_ORDER.every((role) => enemyAssignments[role]);
  let weighted = 0;
  let totalWeight = 0;
  for (const phase of PHASE_KEYS) {
    const edge = complete
      ? getTeamChampionPhasePower(assignments, phase) - getTeamChampionPhasePower(enemyAssignments, phase)
      : average(
          roles.map((role) => {
            const enemyId = enemyAssignments[role];
            return getChampionPhasePower(assignments[role]!, role, phase) - (enemyId ? getChampionPhasePower(enemyId, role, phase) : leaguePhasePowerFor(role, phase));
          })
        );
    weighted += weights[phase] * edge;
    totalWeight += weights[phase];
  }
  return clamp(5 + (DRAFT_THINKING_CONFIG.draftEvaluation.phasePowerScale * weighted) / totalWeight, 0, 10);
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

/** Percentila mechanics (`stats.mec`) a jucătorului în toată liga, 0–1 (calculată o singură dată). */
let sortedMechanics: number[] | null = null;
function mechanicsPercentile(player: Player | null) {
  const value = player?.stats?.mec;
  if (typeof value !== "number") return 0.5;
  sortedMechanics ??= players.map((entry) => entry.stats?.mec).filter((entry): entry is number => typeof entry === "number").sort((a, b) => a - b);
  if (!sortedMechanics.length) return 0.5;
  const below = sortedMechanics.filter((entry) => entry < value).length;
  const equal = sortedMechanics.filter((entry) => entry === value).length;
  return (below + equal / 2) / sortedMechanics.length;
}

/**
 * DRAFT_SIM_ALIGNMENT §8.3: penalizarea de dificultate e relativă la jucător. Pe fiecare rol, dificultatea
 * campionului (media playerScaling) peste capacitatea jucătorului (vezi executionCapacitySpread) × 0.85; media pe
 * roluri. Un jucător cu mechanics mari nu e penalizat pe un campion greu.
 */
function evaluateExecutionDifficultyPenalty(
  assignments: Partial<Record<Role, string>>,
  roster: Partial<Record<Role, string>>,
  playersById: Map<string, Player>
) {
  const spread = DRAFT_THINKING_CONFIG.draftEvaluation.executionCapacitySpread;
  const penalties: number[] = [];
  for (const role of ROLE_ORDER) {
    const champion = assignments[role] ? getChampionById(assignments[role]!) : null;
    if (!champion) continue;
    const difficulty = average(Object.values(champion.playerScaling ?? {}) as number[]);
    if (!Number.isFinite(difficulty)) continue;
    const player = roster[role] ? playersById.get(roster[role]!) ?? null : null;
    const capacity = 3.8 + (mechanicsPercentile(player) - 0.5) * 2 * spread;
    penalties.push(Math.max(0, difficulty - capacity) * 0.85);
  }
  return penalties.length ? clamp(average(penalties), 0, 3.5) : 0;
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

/** `role` dat → statisticile de pe acel rol (cu fallback pe cele globale). */
export function getMetaPriorityScore(champion: Champion, role?: Role | null): number {
  const stats = getChampionStatsForRole(champion, role);
  const effectivePresence = Math.max(stats.presence ?? 0, stats.picks + stats.bans);
  const presenceRate = clamp(effectivePresence / maxPresence, 0, 1);
  const banRate = clamp((stats.bans ?? 0) / maxBans, 0, 1);
  const avgPickRound = stats.avgPickRound ?? 3;
  const pickPriorityRate = clamp(1 / Math.max(1, avgPickRound), 0, 1);
  const blindRate = clamp((stats.blindPickRate ?? 40) / 100, 0, 1);
  return clamp((presenceRate * 0.53 + banRate * 0.22 + pickPriorityRate * 0.15 + blindRate * 0.1) * 10, 0, 10);
}

/** Fit-ul brut pe 0–10: media ponderată (playerScaling) a stats-urilor vechi normalizate. */
function rawPlayerChampionFit(playerStats: PlayerStats, scaling?: ChampionPlayerScaling): number | null {
  if (!scaling) return null;
  const entries = Object.entries(scaling) as Array<[keyof PlayerStats, number]>;
  if (!entries.length) return null;
  const normalized = normalizeLegacyStats(playerStats);
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [statKey, weight] of entries) {
    weightedSum += normalized[statKey] * weight;
    totalWeight += weight;
  }
  return totalWeight === 0 ? null : weightedSum / totalWeight;
}

let medianFit: number | null = null;
/** Mediana fit-ului brut pe ligă (jucător × campionii lui de bază). */
function getMedianFit(): number {
  if (medianFit !== null) return medianFit;
  const values: number[] = [];
  for (const player of players) {
    for (const championId of player.bestChampions) {
      const value = rawPlayerChampionFit(player.stats, championMap.get(championId)?.playerScaling);
      if (value !== null) values.push(value);
    }
  }
  values.sort((a, b) => a - b);
  medianFit = values[Math.floor(values.length / 2)] ?? 7.5;
  return medianFit;
}

/**
 * Fit-ul jucător–campion din stats-urile vechi (`playerScaling`). Stats-urile sunt pe 10–100: normalizate, apoi relativ
 * la mediana ligii la nivelul de bază de dinainte (10 = fit-ul median; înainte, fit-ul era 10 pentru toți).
 */
export function getPlayerChampionFitScore(playerStats: PlayerStats, scaling?: ChampionPlayerScaling): number {
  const raw = rawPlayerChampionFit(playerStats, scaling);
  if (raw === null) return 5;
  return clamp(10 + (raw - getMedianFit()) * DRAFT_THINKING_CONFIG.simulation.playerSkillScale, 0, 12);
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

  // ── NEW: When mastery override exists, use grade-based comfort ──────────
  // This intentionally IGNORES bestChampions/comfortChampions/championPool —
  // the override is the single source of truth for that player.
  if (hasMasteryOverride(player.id)) {
    const grade = getChampionGrade(player, champion.id);
    const gradeComfort = gradeToComfortScore(grade);
    const signatureBonus = getPlayerChampionSignatureBonus(player.id, champion.id);
    return clamp(gradeComfort + signatureBonus * 0.35, 0, 10);
  }

  // ── LEGACY: tier-based fallback for players without mastery override ────
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
    total += adjustedFit * 0.42 + comfort * 0.24 + advancedPrimary(player, "adaptability", legacyStatScore(player, "iq")) * 0.16 + advancedPrimary(player, "teamfighting", legacyStatScore(player, "tfg")) * 0.12 + (5 + historyBonus * 2) * 0.06;
    count += 1;
  }
  return count === 0 ? 0 : total / count;
}

// ─── DRAFT_SIM_ALIGNMENT §2.1: calitatea alegerii, nu nivelul jucătorului ──────
/** q = cât de bun e jucătorul pe campion (fit + comfort, fără istoric, ca referința să fie comparabilă). */
function choiceQuality(player: Player, champion: Champion, role: Role) {
  const share = DRAFT_THINKING_CONFIG.draftEvaluation.choiceFitShare;
  return getProjectedPlayerChampionFitScore(player, champion, role) * share + getComfortScore(player, champion) * (1 - share);
}

/** jucător:rol → campionii care pot juca rolul, sortați descrescător după q (calculat o singură dată). */
const choiceQualityCache = new Map<string, Array<[string, number]>>();
function rankedChoices(player: Player, role: Role) {
  const key = `${player.id}:${role}`;
  let ranked = choiceQualityCache.get(key);
  if (!ranked) {
    ranked = champions
      .filter((champion) => champion.roles.includes(role))
      .map((champion) => [champion.id, choiceQuality(player, champion, role)] as [string, number])
      .sort((a, b) => b[1] - a[1]);
    choiceQualityCache.set(key, ranked);
  }
  return ranked;
}

/**
 * 5 = a ales cât de bine se putea pentru jucător (media celor mai buni N campioni încă disponibili), sub 5 = sub
 * nivelul lui. „Disponibil” = nebanat și neluat de adversar sau de coechipieri, pe starea draftului evaluată
 * (aproximarea stării de la momentul pick-ului: evaluatorul nu are ordinea pick-urilor).
 */
function evaluateChoiceFit(
  roster: Partial<Record<Role, string>>,
  assignments: Partial<Record<Role, string>>,
  playersById: Map<string, Player>,
  unavailable: Set<string>
) {
  const { choiceFitTopN, choiceFitScale } = DRAFT_THINKING_CONFIG.draftEvaluation;
  const values: number[] = [];
  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const championId = assignments[role];
    const player = playerId ? playersById.get(playerId) ?? null : null;
    const champion = championId ? getChampionById(championId) : null;
    if (!player || !champion) continue;
    const taken = new Set([...unavailable, ...Object.entries(assignments).filter(([other]) => other !== role).map(([, id]) => id)]);
    const best = rankedChoices(player, role).filter(([id]) => id === champion.id || !taken.has(id)).slice(0, choiceFitTopN);
    const reference = average(best.map(([, value]) => value));
    values.push(clamp(5 + (choiceQuality(player, champion, role) - reference) * choiceFitScale, 0, 10));
  }
  return values.length ? average(values) : 5;
}

export function evaluateTeamDraft(context: TeamDraftContext): TeamDraftEvaluation {
  const vector = buildCompVector(context.championIds);
  const enemyVector = buildCompVector(context.enemyChampionIds);
  const missingNeeds = evaluateNeedStatuses(context.championIds);
  // COMP_ATTRIBUTES_EXPANSION §3.3: nevoile contextuale (din compoziția lor) contează ca nevoile fixe.
  const contextualNeeds = evaluateContextualNeedStatuses(context.championIds, context.enemyChampionIds);
  const satisfiedNeeds =
    missingNeeds.filter((need) => need.missing === 0).length + contextualNeeds.filter((need) => need.missing === 0).length;
  const needScore = clamp((satisfiedNeeds / Math.max(1, missingNeeds.length + contextualNeeds.length)) * 10, 0, 10);
  const hasAssignments = (value?: Partial<Record<Role, string>>): value is Partial<Record<Role, string>> =>
    Boolean(value && Object.values(value).some(Boolean));
  const assignments = hasAssignments(context.assignments)
    ? context.assignments
    : resolveRoleAssignments(context.championIds, context.roster);
  const enemyRoster = context.enemyRoster ?? {};
  const enemyAssignments = hasAssignments(context.enemyAssignments)
    ? context.enemyAssignments
    : resolveRoleAssignments(context.enemyChampionIds, enemyRoster);
  const unavailable = context.unavailableChampionIds
    ? new Set([...context.unavailableChampionIds, ...context.enemyChampionIds])
    : null;
  const synergyScore = evaluatePairSynergy(context.championIds, context.enemyChampionIds, assignments, context.roster, unavailable);
  const counterScore = evaluateCounterScore(assignments, enemyAssignments, context.roster, enemyRoster);
  const interactionScore = evaluateInteractionScore(
    context.championIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion)),
    context.enemyChampionIds.map(getChampionById).filter((champion): champion is Champion => Boolean(champion))
  );
  const phasePowerScore = evaluatePhasePowerScore(assignments, enemyAssignments);
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
  const executionDifficultyPenalty = evaluateExecutionDifficultyPenalty(assignments, context.roster, context.playersById);
  const compIdentity = inferCompIdentity(context.championIds, assignments);
  const accessScore = evaluateAccessScore(context.championIds);
  const threatScore = evaluateThreatScore(context.championIds);
  const roleProfileScore = getRoleProfileScore(context.championIds);
  const teamIdentity = evaluateTeamIdentityScore(context, compIdentity);
  const teamIdentityScore = teamIdentity.score;

  // DRAFT_SIM_ALIGNMENT §3.3: aceeași măsură de meta ca simularea (championMetaPower pe rolul atribuit).
  const metaScore = average(ROLE_ORDER.filter((role) => assignments[role]).map((role) => championMetaPower(assignments[role]!, role)));
  const comfortValues: number[] = [];
  const fitValues: number[] = [];

  for (const role of ROLE_ORDER) {
    const playerId = context.roster[role];
    // DRAFT_SIM_ALIGNMENT §1: campionul atribuit pe rol (nu primul care poate juca rolul — greșit la flex).
    const championId = assignments[role];
    if (!playerId || !championId) continue;
    const player = context.playersById.get(playerId) ?? null;
    const champion = getChampionById(championId);
    if (!player || !champion) continue;
    comfortValues.push(getComfortScore(player, champion));
    fitValues.push(getHistoryAdjustedDraftFit(getProjectedPlayerChampionFitScore(player, champion, role), player.id, champion.id));
  }

  const comfortScore = average(comfortValues);
  const playerFitScore = average(fitValues);
  // DRAFT_SIM_ALIGNMENT §1: rolurile reale (nu ordinea pick-urilor).
  const rosterExecutionScore = evaluatePlayerPower(context.roster, assignments);
  const choiceFitScore = evaluateChoiceFit(
    context.roster,
    assignments,
    context.playersById,
    new Set([...(context.unavailableChampionIds ?? []), ...context.enemyChampionIds])
  );

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
      compIdentity,
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

  const W = DRAFT_THINKING_CONFIG.draftEvaluation.weights;
  const draftPower = clamp(
    // DRAFT_SIM_ALIGNMENT §2.1: choiceFitScore în locul playerFit × 0.14 + comfort × 0.10 (nivelul jucătorului);
    // rosterExecutionScore × 0.045 a ieșit (tot nivelul jucătorilor). §3: counterScore pe lane, puterea pe faze, meta 0.10 → 0.04.
    metaScore * W.meta + choiceFitScore * W.choiceFit + synergyScore * 0.11 + needScore * 0.08 + counterScore * W.counter +
    phasePowerScore * W.phasePower + interactionScore * DRAFT_THINKING_CONFIG.draftEvaluation.interactionWeight +
    engageScore * 0.045 + frontlineScore * 0.045 + damageBalanceScore * W.damageBalance + executionEaseScore * 0.03 + protectionScore * 0.04 +
    antiDiveScore * 0.03 + primaryEngageScore * 0.025 + followUpScore * 0.02 + rangeProfileScore * 0.02 + accessScore * 0.05 + threatScore * 0.05 +
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
    choiceFitScore,
    interactionScore,
    phasePowerScore,
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
    ...(contextualNeeds.length ? { contextualNeeds } : {}),
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
