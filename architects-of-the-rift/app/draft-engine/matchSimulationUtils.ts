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

export function playerChampionDraftFit(playerId: string | null, championId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const champion = getChampionByIdSafe(championId);
  if (!player || !champion) return 5;

  const fit = getPlayerChampionFitScore(player.stats, champion.playerScaling);
  const comfort = getComfortScore(player, champion);
  const baseFit = clamp(fit * 0.58 + comfort * 0.42, 0, 10);
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
  const con = statOf(player, "con", 5);
  const iq = statOf(player, "iq", 5);
  const tfg = statOf(player, "tfg", 5);
  return clamp(con * 0.4 + iq * 0.3 + tfg * 0.3, 0, 10);
}

export function playerExecutionScore(playerId: string | null) {
  const player = getPlayerByIdSafe(playerId);
  const mec = statOf(player, "mec", 5);
  const mac = statOf(player, "mac", 5);
  const clt = statOf(player, "clt", 5);
  return clamp(mec * 0.4 + mac * 0.35 + clt * 0.25, 0, 10);
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
