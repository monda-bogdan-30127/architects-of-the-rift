// ═══════════════════════════════════════════════════════════════════════════
// KDA Generator (v3 — budget-safe, score-influenced)
//
// Principles:
//   1) Team kills are a hard budget.
//   2) Enemy deaths are the exact same hard budget.
//   3) Player score influences distribution, but never rewrites kills/deaths.
//   4) Bad individual games can naturally produce sub-1.0 KDA.
//   5) Role identity still matters (ADC/MID get more kills, SUPPORT more assists).
//
// IMPORTANT INVARIANT:
//   blue kills === red deaths
//   red kills  === blue deaths
// ═══════════════════════════════════════════════════════════════════════════

import type { Role } from "@/app/types/champion";
import type { PlayerGameScore, MatchProfile } from "./matchSimulationTypes";
import { getChampionByIdSafe, clamp, seededNoise } from "./matchSimulationUtils";

// ─── Role expectations ───────────────────────────────────────────────────────
// Weights add up roughly to 1.0 but are normalized again during allocation.
const ROLE_PROFILE: Record<
  Role,
  {
    killWeight: number;
    deathWeight: number;
    assistBase: number;
  }
> = {
  top:     { killWeight: 0.15, deathWeight: 0.21, assistBase: 0.42 },
  jungle:  { killWeight: 0.19, deathWeight: 0.19, assistBase: 0.60 },
  mid:     { killWeight: 0.27, deathWeight: 0.19, assistBase: 0.50 },
  adc:     { killWeight: 0.31, deathWeight: 0.18, assistBase: 0.47 },
  support: { killWeight: 0.08, deathWeight: 0.23, assistBase: 0.74 },
};

// ─── Exact integer budget allocator ─────────────────────────────────────────
// Uses largest-remainder allocation:
// - every allocation is >= 0
// - sum(result) is ALWAYS exactly total
// - no post-allocation "fix" can create/delete kills or deaths
function allocateIntegerBudget(args: {
  total: number;
  weights: number[];
  seedKeys: string[];
}): number[] {
  const total = Math.max(0, Math.floor(args.total));
  if (args.weights.length === 0) return [];

  const safeWeights = args.weights.map((weight) =>
    Number.isFinite(weight) ? Math.max(0.0001, weight) : 0.0001
  );
  const weightSum = safeWeights.reduce((sum, weight) => sum + weight, 0);

  const raw = safeWeights.map((weight) => (total * weight) / weightSum);
  const allocated = raw.map((value) => Math.floor(value));

  let remaining = total - allocated.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({
      index,
      fraction: value - Math.floor(value),
      tieBreak: seededNoise(`${args.seedKeys[index]}:budget-tiebreak`, 1),
    }))
    .sort((a, b) => {
      const fractionDiff = b.fraction - a.fraction;
      if (Math.abs(fractionDiff) > 1e-9) return fractionDiff;
      return b.tieBreak - a.tieBreak;
    });

  for (let i = 0; i < remaining; i += 1) {
    allocated[order[i % order.length].index] += 1;
  }

  return allocated;
}

// ─── Team total kills ────────────────────────────────────────────────────────
function generateTeamKills(args: {
  isWinner: boolean;
  matchProfile: MatchProfile;
  closeness: number;
  seed: string;
}): number {
  const rng = seededNoise(`${args.seed}:team-kills`, 1) * 0.5 + 0.5;

  let base: number;
  switch (args.matchProfile) {
    case "snowball":
      base = args.isWinner ? 22 : 7;
      break;
    case "scaling":
      base = args.isWinner ? 14 : 10;
      break;
    default:
      base = args.isWinner ? 17 : 11;
      break;
  }

  // Close games converge. Stomps separate more strongly.
  if (args.closeness >= 0.7) {
    if (args.isWinner) base -= 1;
    else base += 2;
  } else if (args.closeness <= 0.3) {
    if (args.isWinner) base += 3;
    else base -= 2;
  }

  const variance = Math.round((rng - 0.5) * 6);
  return Math.max(2, Math.round(base + variance));
}

function recalculateKda(player: PlayerGameScore) {
  if (player.deaths === 0) {
    player.kda = Math.min(
      99,
      Math.round((player.kills + player.assists) * 10) / 10
    );
    return;
  }

  player.kda =
    Math.round(((player.kills + player.assists) / player.deaths) * 10) / 10;
}

// ─── Main KDA generation ────────────────────────────────────────────────────
export function generatePlayerKDAs(args: {
  playerScores: PlayerGameScore[];
  winnerSide: "blue" | "red";
  matchProfile: MatchProfile;
  closeness: number;
  scoreDiff: number;
  seriesId: string;
  gameNumber: number;
}): void {
  const { playerScores, winnerSide, matchProfile, closeness } = args;
  const seedBase = `${args.seriesId}:g${args.gameNumber}`;
  const blueIsWinner = winnerSide === "blue";

  const blueTeamKills = generateTeamKills({
    isWinner: blueIsWinner,
    matchProfile,
    closeness,
    seed: `${seedBase}:blue`,
  });

  const redTeamKills = generateTeamKills({
    isWinner: !blueIsWinner,
    matchProfile,
    closeness,
    seed: `${seedBase}:red`,
  });

  for (const side of ["blue", "red"] as const) {
    const sidePlayers = playerScores.filter((player) => player.side === side);
    if (sidePlayers.length === 0) continue;

    const teamKills = side === "blue" ? blueTeamKills : redTeamKills;
    const teamDeaths = side === "blue" ? redTeamKills : blueTeamKills;

    // ─── KILLS ──────────────────────────────────────────────────────────────
    // Score matters, but the curve is intentionally not quadratic.
    // A mediocre game can still contain kills, and a great game does not
    // automatically absorb the whole team's kill budget.
    const killWeights = sidePlayers.map((player) => {
      const roleProfile = ROLE_PROFILE[player.role] ?? ROLE_PROFILE.mid;
      const scoreNorm = clamp((player.score - 4) / 6, 0, 1);

      const championKda =
        getChampionByIdSafe(player.championId)?.stats.kda ?? 3;
      const championMultiplier = clamp(
        1 + (championKda - 3) * 0.04,
        0.88,
        1.15
      );

      const playerVariance =
        1 +
        seededNoise(
          `${seedBase}:${side}:${player.role}:${player.playerId}:kills`,
          0.16
        );

      // Roughly 0.65x → 1.60x across the score range.
      const scoreMultiplier = 0.65 + scoreNorm * 0.95;

      return (
        roleProfile.killWeight *
        scoreMultiplier *
        championMultiplier *
        playerVariance
      );
    });

    const kills = allocateIntegerBudget({
      total: teamKills,
      weights: killWeights,
      seedKeys: sidePlayers.map(
        (player) =>
          `${seedBase}:${side}:${player.role}:${player.playerId}:kills`
      ),
    });

    sidePlayers.forEach((player, index) => {
      player.kills = kills[index] ?? 0;
    });

    // ─── DEATHS ─────────────────────────────────────────────────────────────
    // This is a hard team budget equal to enemy kills.
    // Lower scores are more likely to receive deaths, but NEVER by mutating
    // the budget after allocation.
    const deathWeights = sidePlayers.map((player) => {
      const roleProfile = ROLE_PROFILE[player.role] ?? ROLE_PROFILE.mid;
      const scoreNorm = clamp((player.score - 4) / 6, 0, 1);
      const inverseScore = 1 - scoreNorm;

      const playerVariance =
        1 +
        seededNoise(
          `${seedBase}:${side}:${player.role}:${player.playerId}:deaths`,
          0.16
        );

      // 0.62x → 1.67x. Strong enough to show bad games, not so steep
      // that one player absorbs nearly every death.
      const scoreMultiplier = 0.62 + inverseScore * 1.05;

      return (
        roleProfile.deathWeight *
        scoreMultiplier *
        playerVariance
      );
    });

    const deaths = allocateIntegerBudget({
      total: teamDeaths,
      weights: deathWeights,
      seedKeys: sidePlayers.map(
        (player) =>
          `${seedBase}:${side}:${player.role}:${player.playerId}:deaths`
      ),
    });

    sidePlayers.forEach((player, index) => {
      player.deaths = deaths[index] ?? 0;
    });

    // ─── ASSISTS ────────────────────────────────────────────────────────────
    // Assists are not a conserved team budget in League, so they can be
    // generated per player. Low-score players lose participation naturally;
    // therefore 0.x KDAs can occur in legitimately poor games.
    for (const player of sidePlayers) {
      const roleProfile = ROLE_PROFILE[player.role] ?? ROLE_PROFILE.mid;
      const scoreNorm = clamp((player.score - 4) / 6, 0, 1);

      const participationVariance = seededNoise(
        `${seedBase}:${side}:${player.role}:${player.playerId}:assists`,
        0.08
      );

      const participationRate = clamp(
        roleProfile.assistBase +
          (scoreNorm - 0.5) * 0.24 +
          participationVariance,
        0.08,
        0.92
      );

      const assistableKills = Math.max(0, teamKills - player.kills);
      player.assists = Math.max(
        0,
        Math.round(assistableKills * participationRate)
      );

      recalculateKda(player);
    }
  }

  // Invariant check. This never mutates the result; it only warns if a future
  // code change somehow breaks the hard kill/death budget.
  {
    const bluePlayers = playerScores.filter((player) => player.side === "blue");
    const redPlayers = playerScores.filter((player) => player.side === "red");

    const blueKills = bluePlayers.reduce((sum, player) => sum + player.kills, 0);
    const redKills = redPlayers.reduce((sum, player) => sum + player.kills, 0);
    const blueDeaths = bluePlayers.reduce(
      (sum, player) => sum + player.deaths,
      0
    );
    const redDeaths = redPlayers.reduce(
      (sum, player) => sum + player.deaths,
      0
    );

    if (blueKills !== redDeaths || redKills !== blueDeaths) {
      console.warn("[KDA invariant failed]", {
        blueKills,
        redDeaths,
        redKills,
        blueDeaths,
        seriesId: args.seriesId,
        gameNumber: args.gameNumber,
      });
    }
  }
}

// ─── Game length generation ─────────────────────────────────────────────────
export function generateGameLength(args: {
  matchProfile: MatchProfile;
  closeness: number;
  seriesId: string;
  gameNumber: number;
}): string {
  const rng =
    seededNoise(`${args.seriesId}:g${args.gameNumber}:gamelength`, 1) * 0.5 +
    0.5;

  let baseMinutes: number;
  switch (args.matchProfile) {
    case "snowball":
      baseMinutes = 25;
      break;
    case "scaling":
      baseMinutes = 35;
      break;
    default:
      baseMinutes = 30;
  }

  if (args.closeness >= 0.7) baseMinutes += 3;
  else if (args.closeness <= 0.3) baseMinutes -= 3;

  const variance = (rng - 0.5) * 8;
  const totalMinutes = clamp(baseMinutes + variance, 20, 45);

  const minutes = Math.floor(totalMinutes);
  const seconds = Math.floor((totalMinutes - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
