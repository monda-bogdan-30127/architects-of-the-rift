import { readPlayerSeasonStore } from "./playerSeasonStorage";
import { players } from "@/app/data/players";

type AwardEntry = {
  playerId: string;
  name: string;
  team: string;
  role: string;
  avgScore: number;
  last5: number;
  winRate: number;
  games: number;
  record: string;
  awardScore: number;
};

const MIN_GAMES = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildEntries(role?: string): AwardEntry[] {
  const store = readPlayerSeasonStore();
  const logs = (store.logs ?? []).filter((log) => log.bestOf === 3);

  const grouped = new Map<string, typeof logs>();

  for (const log of logs) {
    if (role && log.role !== role) continue;
    const list = grouped.get(log.playerId) ?? [];
    list.push(log);
    grouped.set(log.playerId, list);
  }

  const entries: AwardEntry[] = [];

  for (const [playerId, playerLogs] of grouped.entries()) {
    if (playerLogs.length < MIN_GAMES) continue;

    const player = players.find((p) => p.id === playerId);
    if (!player) continue;

    const team = playerLogs[playerLogs.length - 1]?.teamSlug ?? player.teamId;
    const roleValue = playerLogs[playerLogs.length - 1]?.role ?? player.role;
    const wins = playerLogs.filter((log) => log.result === "win").length;
    const losses = playerLogs.length - wins;
    const scores = playerLogs.map((log) => log.score);
    const recentScores = playerLogs.slice(-5).map((log) => log.score);

    const avgScore = average(scores);
    const last5 = average(recentScores);
    const winRate = wins / Math.max(1, playerLogs.length);

    const recencyBonus = clamp((last5 - avgScore) * 0.35, -0.35, 0.45);
    const sampleBonus = clamp(Math.log2(playerLogs.length + 1) * 0.15, 0, 0.8);
    const awardScore =
      avgScore * 0.64 +
      last5 * 0.18 +
      winRate * 10 * 0.18 +
      recencyBonus +
      sampleBonus;

    entries.push({
      playerId,
      name: player.name,
      team,
      role: roleValue,
      avgScore: Number(avgScore.toFixed(2)),
      last5: Number(last5.toFixed(2)),
      winRate: Number((winRate * 100).toFixed(1)),
      games: playerLogs.length,
      record: `${wins}-${losses}`,
      awardScore: Number(awardScore.toFixed(3)),
    });
  }

  return entries.sort((a, b) => b.awardScore - a.awardScore);
}

export const getMvpRace = () => buildEntries().slice(0, 3);
export const getBestTop = () => buildEntries("top").slice(0, 3);
export const getBestJungle = () => buildEntries("jungle").slice(0, 3);
export const getBestMid = () => buildEntries("mid").slice(0, 3);
export const getBestAdc = () => buildEntries("adc").slice(0, 3);
export const getBestSupport = () => buildEntries("support").slice(0, 3);