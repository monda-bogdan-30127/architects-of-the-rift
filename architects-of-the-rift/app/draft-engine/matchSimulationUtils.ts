import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Champion } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { getComfortScore, getMetaPriorityScore, getPlayerChampionFitScore } from "./draftEvaluator";
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

export function statOf(player: Player | null, statKey: string, fallback = 5) {
  if (!player) return fallback;
  const value = (player.stats as Record<string, number | undefined>)[statKey];
  return typeof value === "number" ? value : fallback;
}

export function smoothWinRate(champion: Champion | null) {
  if (!champion) return 0.5;
  const wins = champion.stats.wins ?? 0;
  const losses = champion.stats.losses ?? 0;
  const games = wins + losses;
  return (wins + 8) / (games + 16);
}

export function matchupPowerAgainst(allyChampionId: string | null, enemyChampionId: string | null) {
  const ally = getChampionByIdSafe(allyChampionId);
  if (!ally || !enemyChampionId) return 0;

  let score = 0;
  for (const relation of ally.goodVs) {
    if (relation.championId === enemyChampionId) score += relation.score ?? 3;
  }
  for (const relation of ally.weakVs) {
    if (relation.championId === enemyChampionId) score -= relation.score ?? 3;
  }

  return clamp(score, -5, 5);
}

export function championBlindSafety(champion: Champion | null) {
  if (!champion) return 5;
  const blindRate = clamp((champion.stats.blindPickRate ?? 50) / 100, 0, 1);
  const hardCounters = Math.min(champion.weakVs.length, 6) / 6;
  return clamp((blindRate * 0.75 + (1 - hardCounters) * 0.25) * 10, 0, 10);
}

export function championReliability(champion: Champion | null) {
  if (!champion) return 5;
  const wr = smoothWinRate(champion);
  const games = (champion.stats.wins ?? 0) + (champion.stats.losses ?? 0);
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

export function championMetaPower(championId: string | null) {
  const champion = getChampionByIdSafe(championId);
  if (!champion) return 5;

  const meta = getMetaPriorityScore(champion);
  const winRate = smoothWinRate(champion) * 10;
  const reliability = championReliability(champion);
  const blind = championBlindSafety(champion);
  const matchupValues = [
    ...champion.goodVs.map((entry) => clamp((entry.score ?? 3) / 5, 0, 1) * 10),
    ...champion.weakVs.map((entry) => 10 - clamp((entry.score ?? 3) / 5, 0, 1) * 10),
  ];
  const matchupSample = matchupValues.length > 0 ? average(matchupValues) : 5;

  return clamp(
    meta * 0.35 + winRate * 0.25 + reliability * 0.15 + blind * 0.1 + matchupSample * 0.15,
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

export function playerTeamfightScore(playerId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const legacyTfg = statOf(player, "tfg", 5);
  return clamp(
    legacyTfg * 0.34 +
      primaryStatScore(player, "teamfighting", legacyTfg) * 0.4 +
      primaryStatScore(player, "positioning", legacyTfg) * 0.16 +
      playstyleScore(player, "setupDependence", 5) * 0.1,
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

export function lateGameScore(championIds: string[], rosterIds: string[]) {
  const champScore = average(
    championIds.map((id) => {
      const champion = getChampionByIdSafe(id);
      if (!champion) return 5;
      const dpm = champion.stats.damagePerMinute ?? 500;
      const gpm = champion.stats.goldPerMinute ?? 340;
      return clamp((dpm / 80) * 0.6 + (gpm / 50) * 0.4, 0, 10);
    })
  );

  const playerScore = average(rosterIds.map((id) => playerClutchScore(id)));
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
