import { derivePlayerPhaseProfile } from "./playerProfileSystem";
import { getChampionRoleProfile } from "./championProfileSystem";
import type { PlayerPhaseSnapshot } from "@/app/types/player";
import type { Role } from "@/app/types/champion";
// (Note: Role might already be imported — check before duplicating)
import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Champion } from "@/app/types/champion";
import type { Player, PlayerStats } from "@/app/types/player";
import { legacyStatScore } from "@/app/utils/legacyStats";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { getComfortScore, getMetaPriorityScore, getPlayerChampionFitScore } from "./draftEvaluator";
import { getChampionStatsForRole } from "./championRoleStatsSystem";
import { countStrongCounters, getMatchupValue, type MatchupContext } from "./matchupScoring";
import type { GamePhase } from "./matchupGrades";
import { 
  getHistoryAdjustedDraftFit, 
  getPlayerChampionMatchupHistoryBonus,
} from "./playerHistoryEvaluator";

const championMap = new Map(champions.map((champion) => [champion.id, champion]));
const playersById = new Map(players.map((player) => [player.id, player]));

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getChampionByIdSafe(championId: string | null | undefined) {
  if (!championId) return null;
  return championMap.get(championId) ?? null;
}

export function getPlayerByIdSafe(playerId: string | null | undefined) {
  if (!playerId) return null;
  return playersById.get(playerId) ?? null;
}

/** Un stat vechi pe scala 0–10 (stats-urile vechi sunt pe 10–100, vezi legacyStats.ts). */
export function statOf(player: Player | null, statKey: string, fallback = 5) {
  if (!player) return fallback;
  return legacyStatScore(player, statKey as keyof PlayerStats, fallback);
}

// ─── Scorurile de jucător relativ la ligă ────────────────────────────────────

export type SkillKind = "clutch" | "execution" | "macro" | "laning" | "teamfight" | "consistency" | "star";
const skillMedians = new Map<SkillKind, number>();

/**
 * Scorul unui jucător relativ la mediana ligii, la nivelul de bază de dinainte: 10 + (scor − mediana) × playerSkillScale.
 * Cât timp scorurile erau plafonate, toți jucătorii erau la 10: pragurile și ponderile din simulare sunt calibrate pe
 * acel nivel, iar acum contează doar diferența față de jucătorul median.
 */
export function skillAtLegacyBaseline(kind: SkillKind, value: number, raw: (player: Player) => number): number {
  let median = skillMedians.get(kind);
  if (median === undefined) {
    const values = players.map(raw).sort((a, b) => a - b);
    median = values[Math.floor(values.length / 2)] ?? 7.5;
    skillMedians.set(kind, median);
  }
  return 10 + (value - median) * DRAFT_THINKING_CONFIG.simulation.playerSkillScale;
}

const RAW_SKILL: Record<Exclude<SkillKind, "star">, (playerId: string | null) => number> = {
  clutch: (playerId) => playerClutchScore(playerId),
  execution: (playerId) => playerExecutionScore(playerId),
  macro: (playerId) => playerMacroScore(playerId),
  laning: (playerId) => playerLaningScore(playerId),
  teamfight: (playerId) => playerTeamfightScore(playerId),
  consistency: (playerId) => playerConsistencyScore(playerId),
};

/** Scorul jucătorului relativ la ligă (vezi skillAtLegacyBaseline); fără jucător, 10 (nivelul de bază). */
export function playerSkill(kind: Exclude<SkillKind, "star">, playerId: string | null, rawValue?: number): number {
  if (!playerId || !getPlayerByIdSafe(playerId)) return 10;
  return skillAtLegacyBaseline(kind, rawValue ?? RAW_SKILL[kind](playerId), (player) => RAW_SKILL[kind](player.id));
}

export function smoothWinRate(champion: Champion | null, role?: Role | null) {
  if (!champion) return 0.5;
  const stats = getChampionStatsForRole(champion, role);
  const wins = stats.wins ?? 0;
  const losses = stats.losses ?? 0;
  const games = wins + losses;
  return (wins + 8) / (games + 16);
}

/** Matchup-ul aliatului contra inamicului într-o fază (−5..5). */
export function matchupPowerAgainst(
  allyChampionId: string | null,
  allyRole: Role,
  enemyChampionId: string | null,
  enemyRole: Role | null,
  phase: GamePhase,
  ctx: MatchupContext = {}
) {
  if (!allyChampionId || !enemyChampionId) return 0;
  return clamp(getMatchupValue(allyChampionId, allyRole, enemyChampionId, enemyRole, { ...ctx, phase }), -5, 5);
}

export function championBlindSafety(champion: Champion | null, role?: Role | null) {
  if (!champion) return 5;
  const blindRate = clamp((getChampionStatsForRole(champion, role).blindPickRate ?? 50) / 100, 0, 1);
  // Doar counterii reali (nota ≥ 4) pe rol, nu toată lista weakVs.
  const counterRole = role && champion.roles.includes(role) ? role : champion.roles[0];
  const hardCounters = Math.min(counterRole ? countStrongCounters(champion.id, counterRole) : 0, 6) / 6;
  return clamp((blindRate * 0.75 + (1 - hardCounters) * 0.25) * 10, 0, 10);
}

export function championReliability(champion: Champion | null, role?: Role | null) {
  if (!champion) return 5;
  const stats = getChampionStatsForRole(champion, role);
  const wr = smoothWinRate(champion, role);
  const games = (stats.wins ?? 0) + (stats.losses ?? 0);
  const sampleConfidence = clamp(games / 40, 0, 1);
  return clamp((wr * 0.7 + sampleConfidence * 0.3) * 10, 0, 10);
}

export function championExecutionDifficulty(champion: Champion | null) {
  if (!champion) return 5;
  const scaling = champion.playerScaling ?? {};
  const values = Object.values(scaling);
  if (values.length === 0) return 5;
  const avg = average(values as number[]);
  return clamp(avg * 1.5, 1, 10);
}

export function championMetaPower(championId: string | null, role?: Role | null) {
  const champion = getChampionByIdSafe(championId);
  if (!champion) return 5;

  const meta = getMetaPriorityScore(champion, role);
  const winRate = smoothWinRate(champion, role) * 10;
  const reliability = championReliability(champion, role);
  const blind = championBlindSafety(champion, role);
  // 4.8: media matchup-urilor fără context nu mai are sens; ponderea ei a trecut pe `blind`.
  return clamp(
    meta * 0.35 + winRate * 0.25 + reliability * 0.15 + blind * 0.25,
    0,
    10
  );
}

function primaryStatScore(player: Player | null, key: keyof Player["advancedProfile"]["primary"], fallback = 5) {
  if (!player) return fallback;
  const value = player.advancedProfile?.primary?.[key];
  return typeof value === "number" ? clamp(value / 10, 0, 10) : fallback;
}

function playstyleScore(player: Player | null, key: keyof Player["advancedProfile"]["playstyle"], fallback = 5) {
  if (!player) return fallback;
  const value = player.advancedProfile?.playstyle?.[key];
  return typeof value === "number" ? clamp(value / 10, 0, 10) : fallback;
}

function tendenciesScore(player: Player | null, key: keyof Player["advancedProfile"]["tendencies"], fallback = 5) {
  if (!player) return fallback;
  const value = player.advancedProfile?.tendencies?.[key];
  return typeof value === "number" ? clamp(value / 10, 0, 10) : fallback;
}

function offerDemand(champion: Champion | null, offerTypes: string[]) {
  if (!champion) return 0;
  return champion.offers
    .filter((offer) => offerTypes.includes(offer.type))
    .reduce((sum, offer) => sum + offer.strength, 0);
}

export function playerChampionArchetypeFit(playerId: string | null, championId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const champion = getChampionByIdSafe(championId);
  if (!player || !champion) return 5;

  const carryDemand = offerDemand(champion, ["burst", "sustainedDamage", "backlineAccess", "dive"]);
  const utilityDemand = offerDemand(champion, ["peel", "antiDive", "disengage", "frontline", "reliableCC"]);
  const playmakingDemand = offerDemand(champion, ["engage", "pick", "roamPressure", "followUp"]);
  const scalingDemand = offerDemand(champion, ["frontToBack", "siege", "waveclear"]);
  const laneDemand = offerDemand(champion, ["earlyPrio", "roamPressure", "waveclear"]);
  const objectiveDemand = offerDemand(champion, ["objectiveControl", "zoneControl", "siege"]);

  const carryReadiness = average([
    primaryStatScore(player, "mechanics"),
    primaryStatScore(player, "skirmishing"),
    playstyleScore(player, "carryResourceUsage"),
  ]);
  const utilityReadiness = average([
    primaryStatScore(player, "discipline"),
    primaryStatScore(player, "positioning"),
    playstyleScore(player, "utilityComfort"),
  ]);
  const playmakingReadiness = average([
    primaryStatScore(player, "skirmishing"),
    primaryStatScore(player, "rotationTiming"),
    playstyleScore(player, "playmakingIntent"),
  ]);
  const scalingReadiness = average([
    primaryStatScore(player, "teamfighting"),
    primaryStatScore(player, "riskManagement"),
    playstyleScore(player, "scalingOrientation"),
  ]);
  const laneReadiness = average([
    primaryStatScore(player, "laning"),
    primaryStatScore(player, "mechanics"),
    playstyleScore(player, "laneControlBias"),
  ]);
  const objectiveReadiness = average([
    primaryStatScore(player, "mapAwareness"),
    primaryStatScore(player, "objectiveControl"),
    tendenciesScore(player, "objectiveContestBias"),
  ]);

  const demandTotal = Math.max(1, carryDemand + utilityDemand + playmakingDemand + scalingDemand + laneDemand + objectiveDemand);
  const weightedFit = (
    carryReadiness * carryDemand +
    utilityReadiness * utilityDemand +
    playmakingReadiness * playmakingDemand +
    scalingReadiness * scalingDemand +
    laneReadiness * laneDemand +
    objectiveReadiness * objectiveDemand
  ) / demandTotal;

  return clamp(weightedFit || average([
    carryReadiness,
    utilityReadiness,
    playmakingReadiness,
    scalingReadiness,
    laneReadiness,
    objectiveReadiness,
  ]), 0, 10);
}

export function playerChampionDraftFit(playerId: string | null, championId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const champion = getChampionByIdSafe(championId);
  if (!player || !champion) return 5;

  const fit = getPlayerChampionFitScore(player.stats, champion.playerScaling);
  const comfort = getComfortScore(player, champion);
  const archetypeFit = playerChampionArchetypeFit(playerId, championId);
  const baseFit = clamp(fit * 0.46 + comfort * 0.28 + archetypeFit * 0.26, 0, 10);
  return getHistoryAdjustedDraftFit(baseFit, player.id, champion.id);
}

export function playerChampionMatchupHistoryEdge(
  playerId: string | null,
  championId: string | null,
  enemyChampionId: string | null
) {
  return getPlayerChampionMatchupHistoryBonus(playerId, championId, enemyChampionId);
}

export function playerClutchScore(playerId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const legacyCon = statOf(player, "con", 5);
  const legacyIq = statOf(player, "iq", 5);
  const legacyTfg = statOf(player, "tfg", 5);
  const advanced = average([
    primaryStatScore(player, "clutchFactor", legacyCon),
    primaryStatScore(player, "currentForm", legacyIq),
    primaryStatScore(player, "discipline", legacyTfg),
  ]);
  const legacy = legacyCon * 0.38 + legacyIq * 0.28 + legacyTfg * 0.34;
  return clamp(legacy * 0.45 + advanced * 0.55, 0, 10);
}

export function playerExecutionScore(playerId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const legacyMec = statOf(player, "mec", 5);
  const legacyMac = statOf(player, "mac", 5);
  const legacyClt = statOf(player, "clt", 5);
  const advanced = average([
    primaryStatScore(player, "mechanics", legacyMec),
    primaryStatScore(player, "skirmishing", legacyMac),
    primaryStatScore(player, "positioning", legacyClt),
  ]);
  const legacy = legacyMec * 0.42 + legacyMac * 0.33 + legacyClt * 0.25;
  return clamp(legacy * 0.42 + advanced * 0.58, 0, 10);
}

export function playerMacroScore(playerId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const legacyMac = statOf(player, "mac", 5);
  return clamp(
    legacyMac * 0.34 +
      primaryStatScore(player, "mapAwareness", legacyMac) * 0.28 +
      primaryStatScore(player, "objectiveControl", legacyMac) * 0.22 +
      primaryStatScore(player, "rotationTiming", legacyMac) * 0.16,
    0,
    10
  );
}

export function playerLaningScore(playerId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const legacyMec = statOf(player, "mec", 5);
  return clamp(
    legacyMec * 0.25 +
      primaryStatScore(player, "laning", legacyMec) * 0.42 +
      primaryStatScore(player, "mechanics", legacyMec) * 0.2 +
      playstyleScore(player, "laneControlBias", legacyMec) * 0.13,
    0,
    10
  );
}

/**
 * `setupFactor` (PLAYER_TRAITS §7.4, flag conditionalSetupTermEnabled): termenul setupDependence ajută doar dacă echipa
 * dă setup (0..1, vezi setupDependenceFactor). Lipsă = termenul necondiționat de până acum.
 */
export function playerTeamfightScore(playerId: string | null, setupFactor?: number) {
  const player = getPlayerByIdSafe(playerId);
  const legacyTfg = statOf(player, "tfg", 5);
  return clamp(
    legacyTfg * 0.34 +
      primaryStatScore(player, "teamfighting", legacyTfg) * 0.4 +
      primaryStatScore(player, "positioning", legacyTfg) * 0.16 +
      playstyleScore(player, "setupDependence", 5) * 0.1 * (setupFactor ?? 1),
    0,
    10
  );
}

export function playerConsistencyScore(playerId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const legacyCon = statOf(player, "con", 5);
  return clamp(
    legacyCon * 0.42 +
      primaryStatScore(player, "consistency", legacyCon) * 0.36 +
      primaryStatScore(player, "discipline", legacyCon) * 0.22,
    0,
    10
  );
}

export function teamAssignmentQuality(
  roster: Partial<Record<import("@/app/types/champion").Role, string>>,
  assignments: Partial<Record<import("@/app/types/champion").Role, string>>
) {
  const scores = Object.entries(assignments).map(([role, championId]) =>
    playerChampionDraftFit(roster[role as import("@/app/types/champion").Role] ?? null, championId)
  );
  if (scores.length === 0) return 0;
  return clamp(average(scores), 0, 10);
}

export function objectiveControlScore(championIds: string[]) {
  const values = championIds
    .map((id) => getChampionByIdSafe(id))
    .filter((champion): champion is Champion => Boolean(champion))
    .map((champion) => {
      const objective = champion.offers
        .filter((offer) =>
          ["objectiveControl", "zoneControl", "waveclear", "roamPressure", "siege", "engage"].includes(
            offer.type
          )
        )
        .reduce((sum, offer) => sum + offer.strength, 0);
      return objective;
    });

  return clamp(average(values) * 1.6, 0, 10);
}

/** `championRoles[i]` = rolul lui `championIds[i]` (opțional; lipsă → statistica globală). */
export function lateGameScore(championIds: string[], rosterIds: string[], championRoles?: readonly (Role | null)[]) {
  const champScore = average(
    championIds.map((id, index) => {
      const champion = getChampionByIdSafe(id);
      if (!champion) return 5;
      const stats = getChampionStatsForRole(champion, championRoles?.[index]);
      const dpm = stats.damagePerMinute ?? 500;
      const gpm = stats.goldPerMinute ?? 340;
      return clamp((dpm / 80) * 0.6 + (gpm / 50) * 0.4, 0, 10);
    })
  );

  const playerScore = average(rosterIds.map((id) => playerSkill("clutch", id)));
  return clamp(champScore * 0.65 + playerScore * 0.35, 0, 10);
}

export function seededNoise(seed: string, magnitude = 1) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const x = Math.sin(hash) * 10000;
  const unit = x - Math.floor(x);
  return (unit * 2 - 1) * magnitude;
}

export function getPlayerPhaseStrength(
  playerId: string | null,
  phase: "early" | "mid" | "late",
  role: import("@/app/types/champion").Role
): number {
  const player = getPlayerByIdSafe(playerId);
  if (!player) return 5;

  const phaseProfile = derivePlayerPhaseProfile(player);
  const snap: PlayerPhaseSnapshot = phaseProfile[phase];

  switch (role) {
    case "top":
      return clamp(
        snap.laneControl * 0.28 + snap.stability * 0.22 + snap.teamfight * 0.20 +
        snap.mapPlay * 0.15 + snap.clutch * 0.15, 0, 10);
    case "jungle":
      return clamp(
        snap.mapPlay * 0.30 + snap.skirmish * 0.25 + snap.stability * 0.15 +
        snap.teamfight * 0.15 + snap.clutch * 0.15, 0, 10);
    case "mid":
      return clamp(
        snap.laneControl * 0.22 + snap.skirmish * 0.18 + snap.mapPlay * 0.20 +
        snap.teamfight * 0.20 + snap.clutch * 0.20, 0, 10);
    case "adc":
      return clamp(
        snap.stability * 0.25 + snap.teamfight * 0.30 + snap.laneControl * 0.15 +
        snap.clutch * 0.20 + snap.mapPlay * 0.10, 0, 10);
    case "support":
      return clamp(
        snap.mapPlay * 0.30 + snap.teamfight * 0.20 + snap.skirmish * 0.15 +
        snap.stability * 0.20 + snap.clutch * 0.15, 0, 10);
    default:
      return clamp(
        snap.laneControl * 0.2 + snap.skirmish * 0.2 + snap.stability * 0.2 +
        snap.mapPlay * 0.2 + snap.teamfight * 0.1 + snap.clutch * 0.1, 0, 10);
  }
}

export function getTeamPhaseStrength(
  roster: Partial<Record<import("@/app/types/champion").Role, string>>,
  assignments: Partial<Record<import("@/app/types/champion").Role, string>>,
  phase: "early" | "mid" | "late"
): number {
  const roles: import("@/app/types/champion").Role[] = ["top", "jungle", "mid", "adc", "support"];
  const scores = roles.map((role) => getPlayerPhaseStrength(roster[role] ?? null, phase, role));
  return round1(average(scores));
}

export function getChampionPhasePower(
  championId: string | null,
  role: import("@/app/types/champion").Role | null,
  phase: "early" | "mid" | "late"
): number {
  const champion = getChampionByIdSafe(championId);
  if (!champion) return 5;

  const profile = getChampionRoleProfile(champion, role);
  if (!profile) return 5;

  const phaseData = profile.scaling[phase];
  if (!phaseData) return 5;

  return clamp(phaseData.power * 0.78 + (10 - phaseData.execution) * 0.22, 0, 10);
}

/** Mediana getChampionPhasePower pe rol și fază, pe toți campionii care pot juca rolul (calculată o dată). */
const phasePowerMedians = new Map<string, number>();
export function championPhasePowerMedian(role: Role, phase: "early" | "mid" | "late") {
  const key = `${role}:${phase}`;
  let value = phasePowerMedians.get(key);
  if (value === undefined) {
    const sorted = champions
      .filter((champion) => champion.roles.includes(role))
      .map((champion) => getChampionPhasePower(champion.id, role, phase))
      .sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    value = sorted.length === 0 ? 5 : sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    phasePowerMedians.set(key, value);
  }
  return value;
}

/**
 * DRAFT_SIM_ALIGNMENT §9 — puterea campionului pe fază relativ la rol: 5 = campionul median pe rol și fază;
 * simulation.championPhaseScale lărgește diferențele. Fără campion, 5 (neutru).
 */
export function championPhasePowerScaled(championId: string | null, role: Role, phase: "early" | "mid" | "late") {
  if (!championId || !getChampionByIdSafe(championId)) return 5;
  const scale = DRAFT_THINKING_CONFIG.simulation.championPhaseScale;
  return clamp(5 + (getChampionPhasePower(championId, role, phase) - championPhasePowerMedian(role, phase)) * scale, 0, 10);
}

/**
 * Puterea campionilor echipei pe fază (simularea). §9: din valorile scalate, cu nivelul readus la media medianelor
 * vechi (pragurile absolute din faze nu se mișcă; la championPhaseScale = 1 rezultatul e cel de dinainte).
 */
export function getTeamChampionPhasePower(
  assignments: Partial<Record<import("@/app/types/champion").Role, string>>,
  phase: "early" | "mid" | "late"
): number {
  const roles: import("@/app/types/champion").Role[] = ["top", "jungle", "mid", "adc", "support"];
  const scaled = roles.map((role) => championPhasePowerScaled(assignments[role] ?? null, role, phase));
  const baseline = average(roles.map((role) => championPhasePowerMedian(role, phase)));
  return round1(average(scaled) - 5 + baseline);
}

export function getPhaseIdentityAlignment(
  playerId: string | null,
  championId: string | null,
  role: import("@/app/types/champion").Role,
  phase: "early" | "mid" | "late"
): number {
  const player = getPlayerByIdSafe(playerId);
  const champion = getChampionByIdSafe(championId);
  if (!player || !champion) return 0;

  const profile = getChampionRoleProfile(champion, role);
  if (!profile?.phaseIdentity) return 0;

  const phaseProfile = derivePlayerPhaseProfile(player);
  const snap = phaseProfile[phase];

  const phaseKey = phase === "early" ? "earlyRole" : phase === "mid" ? "midRole" : "lateRole";
  const identity = profile.phaseIdentity[phaseKey];

  switch (identity) {
    case "carry":
      return clamp((snap.teamfight + snap.clutch) / 2 - 5, -2, 2);
    case "secondary-carry":
      return clamp((snap.stability + snap.teamfight) / 2 - 5, -1.5, 1.5);
    case "setup":
      return clamp((snap.mapPlay + snap.skirmish) / 2 - 5, -1.5, 1.5);
    case "utility":
      return clamp((snap.mapPlay + snap.stability) / 2 - 5, -1, 1);
    case "tank":
      return clamp((snap.stability + snap.teamfight) / 2 - 5, -1, 1);
    case "pick":
      return clamp((snap.skirmish + snap.mapPlay) / 2 - 5, -1.5, 1.5);
    case "zone-control":
      return clamp((snap.mapPlay + snap.stability) / 2 - 5, -1, 1);
    case "peel":
      return clamp((snap.teamfight + snap.stability) / 2 - 5, -1, 1);
    default:
      return 0;
  }
}
