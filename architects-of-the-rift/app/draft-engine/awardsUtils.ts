import { readPlayerSeasonStore } from "./playerSeasonStorage";
import { players } from "@/app/data/players";
import { getPlayerGameMvpCount } from "./mvpStorage";
import { getPlayerAverageKda } from "./kdaStorage";

export type AwardEntry = {
  playerId: string;
  name: string;
  team: string;       // team slug (kept for backwards compat with page.tsx)
  role: string;
  avgScore: number;
  last5: number;
  winRate: number;
  games: number;
  record: string;
  awardScore: number;
  // ── NEW fields exposed for the awards UI ────────────────────────────────
  gameMvps: number;
  kda: number;
};

const MIN_GAMES = 4;

// ── Weights for the new award score ────────────────────────────────────────
//   30% team win rate
//   30% avg score
//   20% Game MVPs
//   20% KDA ratio
const W_WINRATE = 0.30;
const W_SCORE   = 0.30;
const W_MVPS    = 0.20;
const W_KDA     = 0.20;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Normalize an array of values to 0..1 by dividing by the pool max.
 * If max is 0 (no data), every entry maps to 0.
 */
function normalizeAgainstMax(values: number[]): number[] {
  const max = values.reduce((m, v) => (v > m ? v : m), 0);
  if (max <= 0) return values.map(() => 0);
  return values.map((v) => clamp(v / max, 0, 1));
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

  // ── First pass: collect raw per-player metrics ────────────────────────────
  type RawEntry = {
    playerId: string;
    name: string;
    team: string;
    role: string;
    avgScore: number;
    last5: number;
    winRate: number;       // 0..1
    games: number;
    wins: number;
    losses: number;
    gameMvps: number;
    kda: number;
  };

  const raw: RawEntry[] = [];

  for (const [playerId, playerLogs] of grouped.entries()) {
    if (playerLogs.length < MIN_GAMES) continue;

    const player = players.find((p) => p.id === playerId);
    if (!player) continue;

    const team       = playerLogs[playerLogs.length - 1]?.teamSlug ?? player.teamId;
    const roleValue  = playerLogs[playerLogs.length - 1]?.role     ?? player.role;
    const wins       = playerLogs.filter((log) => log.result === "win").length;
    const losses     = playerLogs.length - wins;
    const scores     = playerLogs.map((log) => log.score);
    const recent     = playerLogs.slice(-5).map((log) => log.score);

    const avgScore   = average(scores);
    const last5      = average(recent);
    const winRate    = wins / Math.max(1, playerLogs.length);
    const gameMvps   = getPlayerGameMvpCount(playerId);
    const kda        = getPlayerAverageKda(playerId) ?? 0;

    raw.push({
      playerId,
      name: player.name,
      team,
      role: roleValue,
      avgScore,
      last5,
      winRate,
      games: playerLogs.length,
      wins,
      losses,
      gameMvps,
      kda,
    });
  }

  if (raw.length === 0) return [];

  // ── Second pass: normalize each metric against the pool max ──────────────
  const winRates = normalizeAgainstMax(raw.map((e) => e.winRate));
  const scores   = normalizeAgainstMax(raw.map((e) => e.avgScore));
  const mvps     = normalizeAgainstMax(raw.map((e) => e.gameMvps));
  const kdas     = normalizeAgainstMax(raw.map((e) => e.kda));

  // ── Third pass: produce final entries with composite award score ─────────
  const entries: AwardEntry[] = raw.map((e, i) => {
    const composite =
      W_WINRATE * winRates[i] +
      W_SCORE   * scores[i] +
      W_MVPS    * mvps[i] +
      W_KDA     * kdas[i];

    // Tiny sample bonus to reward sustained presence (max +0.05)
    const sampleBonus = clamp(Math.log2(e.games + 1) * 0.012, 0, 0.05);

    return {
      playerId:   e.playerId,
      name:       e.name,
      team:       e.team,
      role:       e.role,
      avgScore:   Number(e.avgScore.toFixed(2)),
      last5:      Number(e.last5.toFixed(2)),
      winRate:    Number((e.winRate * 100).toFixed(1)),
      games:      e.games,
      record:     `${e.wins}-${e.losses}`,
      gameMvps:   e.gameMvps,
      kda:        Number(e.kda.toFixed(2)),
      awardScore: Number((composite + sampleBonus).toFixed(4)),
    };
  });

  return entries.sort((a, b) => b.awardScore - a.awardScore);
}

export const getMvpRace     = () => buildEntries().slice(0, 3);
export const getBestTop     = () => buildEntries("top").slice(0, 3);
export const getBestJungle  = () => buildEntries("jungle").slice(0, 3);
export const getBestMid     = () => buildEntries("mid").slice(0, 3);
export const getBestAdc     = () => buildEntries("adc").slice(0, 3);
export const getBestSupport = () => buildEntries("support").slice(0, 3);