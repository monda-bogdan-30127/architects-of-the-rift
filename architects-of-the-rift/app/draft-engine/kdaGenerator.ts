// ═══════════════════════════════════════════════════════════════════════════
// KDA Generator (v2 — score-driven)
//
// KEY PRINCIPLE: Player score DRIVES KDA, not the other way around.
// A player with 9.5 score MUST have a good KDA (many kills, few deaths).
// A player with 5.0 score MUST have a bad KDA (few kills, many deaths).
//
// Based on real pro match data patterns:
//   - High score + carry role = many kills, few deaths
//   - High score + support = few kills, MANY assists, few deaths
//   - Low score = few kills, many deaths regardless of role
//   - Deaths are the strongest score correlator (more deaths = lower score)
//   - Kill participation matters (supports with 90%+ KP score high)
//
// Also generates game length based on match profile + closeness.
// ═══════════════════════════════════════════════════════════════════════════

import type { Role } from "@/app/types/champion";
import type { PlayerGameScore, MatchProfile } from "./matchSimulationTypes";
import { getChampionByIdSafe, clamp, seededNoise } from "./matchSimulationUtils";

// ─── Role-based baseline expectations ───────────────────────────────────────
// How each role typically converts score → kills/deaths/assists
const ROLE_PROFILE: Record<Role, {
  killWeight: number;    // How much of the "kill budget" this role gets
  deathWeight: number;   // How much of the "death budget" this role gets  
  assistBase: number;    // Base assist participation rate (0-1)
}> = {
  top:     { killWeight: 0.16, deathWeight: 0.20, assistBase: 0.40 },
  jungle:  { killWeight: 0.18, deathWeight: 0.18, assistBase: 0.62 },
  mid:     { killWeight: 0.28, deathWeight: 0.20, assistBase: 0.52 },
  adc:     { killWeight: 0.30, deathWeight: 0.18, assistBase: 0.50 },
  support: { killWeight: 0.06, deathWeight: 0.24, assistBase: 0.80 },
};

// ─── Team total kills from match profile ────────────────────────────────────
function generateTeamKills(args: {
  isWinner: boolean;
  matchProfile: MatchProfile;
  closeness: number;
  seed: string;
}): number {
  const rng = seededNoise(`${args.seed}:team-kills`, 1) * 0.5 + 0.5;

  let base: number;
  switch (args.matchProfile) {
    case "snowball": base = args.isWinner ? 23 : 9; break;
    case "scaling":  base = args.isWinner ? 15 : 11; break;
    default:         base = args.isWinner ? 18 : 12;
  }

  // Close games: kill totals converge
  if (args.closeness >= 0.7) {
    if (!args.isWinner) base += 3;
    if (args.isWinner) base -= 1;
  } else if (args.closeness <= 0.3) {
    if (args.isWinner) base += 4;
    if (!args.isWinner) base -= 3;
  }

  const variance = Math.round((rng - 0.5) * 6);
  return Math.max(3, Math.round(base + variance));
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
    isWinner: blueIsWinner, matchProfile, closeness, seed: `${seedBase}:blue`,
  });
  const redTeamKills = generateTeamKills({
    isWinner: !blueIsWinner, matchProfile, closeness, seed: `${seedBase}:red`,
  });

  for (const side of ["blue", "red"] as const) {
    const sidePlayers = playerScores.filter((p) => p.side === side);
    const teamKills = side === "blue" ? blueTeamKills : redTeamKills;
    const teamDeaths = side === "blue" ? redTeamKills : blueTeamKills;

    if (sidePlayers.length === 0) continue;

    // ─── KILLS: Score-weighted distribution ──────────────────────
    // Higher score = more kills. Score influences kill share heavily.
    const killWeights: number[] = [];
    for (const player of sidePlayers) {
      const roleProfile = ROLE_PROFILE[player.role] ?? ROLE_PROFILE.mid;
      const rng = seededNoise(`${seedBase}:${side}:${player.role}:kills`, 1);

      // Score-driven: normalize player score to 0-1 range (scores 4-10)
      const scoreNorm = clamp((player.score - 4) / 6, 0, 1);

      // Champion KDA hint
      const champKda = getChampionByIdSafe(player.championId)?.stats.kda ?? 3;
      const champMod = clamp((champKda - 3) * 0.03, -0.05, 0.08);

      // Kill weight = role base × score multiplier
      // Score 9.5 → multiplier ~3.1x, Score 5.0 → multiplier ~0.3x
      // Steeper curve = more variance within team (carries get more kills)
      const scoreMult = 0.15 + scoreNorm * scoreNorm * 2.95;
      const weight = roleProfile.killWeight * scoreMult + champMod + rng * 0.03;

      killWeights.push(Math.max(0.01, weight));
    }

    const totalKillWeight = killWeights.reduce((s, w) => s + w, 0);
    let killsRemaining = teamKills;

    for (let i = 0; i < sidePlayers.length; i++) {
      const share = totalKillWeight > 0 ? killWeights[i] / totalKillWeight : 0.2;
      const kills = Math.max(0, Math.round(teamKills * share));
      sidePlayers[i].kills = kills;
      killsRemaining -= kills;
    }

    // Distribute rounding remainder to highest score player
    if (killsRemaining !== 0) {
      const sorted = [...sidePlayers].sort((a, b) => b.score - a.score);
      sorted[0].kills = Math.max(0, sorted[0].kills + killsRemaining);
    }

    // ─── DEATHS: Inverse score-weighted ──────────────────────────
    // Lower score = more deaths. This is the strongest correlator.
    // In real data: 0 deaths → high score, 6+ deaths → low score
    const deathWeights: number[] = [];
    for (const player of sidePlayers) {
      const roleProfile = ROLE_PROFILE[player.role] ?? ROLE_PROFILE.mid;
      const rng = seededNoise(`${seedBase}:${side}:${player.role}:deaths`, 1);

      // INVERSE score: low score → high death share
      const scoreNorm = clamp((player.score - 4) / 6, 0, 1);
      const inverseScore = 1 - scoreNorm; // High score → 0, low score → 1

      // Death weight = role base × inverse score multiplier
      // Score 5.0 → multiplier ~3.1x (lots of deaths)
      // Score 9.5 → multiplier ~0.15x (barely dies)
      // Quadratic curve: dying is strongly correlated with low scores
      const deathMult = 0.15 + inverseScore * inverseScore * 2.95;
      const weight = roleProfile.deathWeight * deathMult + rng * 0.03;

      deathWeights.push(Math.max(0.01, weight));
    }

    const totalDeathWeight = deathWeights.reduce((s, w) => s + w, 0);
    let deathsRemaining = teamDeaths;

    for (let i = 0; i < sidePlayers.length; i++) {
      const share = totalDeathWeight > 0 ? deathWeights[i] / totalDeathWeight : 0.2;
      const deaths = Math.max(0, Math.round(teamDeaths * share));
      sidePlayers[i].deaths = deaths;
      deathsRemaining -= deaths;
    }

    if (deathsRemaining !== 0) {
      const sorted = [...sidePlayers].sort((a, b) => a.score - b.score);
      sorted[0].deaths = Math.max(0, sorted[0].deaths + deathsRemaining);
    }

    // ─── ASSISTS: Role base + score-adjusted participation ───────
    // Supports always high. Carries scale with score.
    // High score = higher kill participation = more assists.
    for (const player of sidePlayers) {
      const roleProfile = ROLE_PROFILE[player.role] ?? ROLE_PROFILE.mid;
      const rng = seededNoise(`${seedBase}:${side}:${player.role}:assists`, 1);

      const scoreNorm = clamp((player.score - 4) / 6, 0, 1);

      // Participation rate: role base adjusted by score
      // High score → +15% KP, low score → -15% KP
      const participationRate = clamp(
        roleProfile.assistBase + (scoreNorm - 0.5) * 0.30 + rng * 0.06,
        0.10,
        0.95
      );

      const assistableKills = Math.max(0, teamKills - player.kills);
      player.assists = Math.max(0, Math.round(assistableKills * participationRate));
    }

    // ─── KDA ratio ───────────────────────────────────────────────
    for (const player of sidePlayers) {
      if (player.deaths === 0) {
        player.kda = Math.min(99, Math.round((player.kills + player.assists) * 10) / 10);
      } else {
        player.kda = Math.round(((player.kills + player.assists) / player.deaths) * 10) / 10;
      }
    }

    // ─── Score↔KDA consistency enforcement ───────────────────────
    // High-scoring players MUST have a KDA that matches their score.
    // If a 9.0 player somehow got 5 deaths from bad RNG, reduce deaths
    // until KDA meets the floor. This prevents jarring mismatches.
    const SCORE_KDA_FLOORS: Array<{ minScore: number; minKda: number }> = [
      { minScore: 9.0, minKda: 5.0 },
      { minScore: 8.5, minKda: 3.8 },
      { minScore: 8.0, minKda: 3.0 },
      { minScore: 7.5, minKda: 2.4 },
    ];

    // Also enforce a ceiling: low-scoring players shouldn't have amazing KDAs
    const SCORE_KDA_CEILINGS: Array<{ maxScore: number; maxKda: number }> = [
      { maxScore: 5.0, maxKda: 2.5 },
      { maxScore: 4.5, maxKda: 1.8 },
      { maxScore: 4.0, maxKda: 1.2 },
    ];

    for (const player of sidePlayers) {
      // ── Floor enforcement (reduce deaths if KDA too low for score) ──
      for (const { minScore, minKda } of SCORE_KDA_FLOORS) {
        if (player.score >= minScore && player.kda < minKda && player.deaths > 0) {
          // Reduce deaths until KDA meets floor (minimum 0 deaths)
          while (player.deaths > 0) {
            player.deaths -= 1;
            player.kda = player.deaths === 0
              ? Math.min(99, Math.round((player.kills + player.assists) * 10) / 10)
              : Math.round(((player.kills + player.assists) / player.deaths) * 10) / 10;
            if (player.kda >= minKda) break;
          }
          break; // Only apply the first (strictest) matching floor
        }
      }

      // ── Ceiling enforcement (add deaths if KDA too high for low score) ──
      for (const { maxScore, maxKda } of SCORE_KDA_CEILINGS) {
        if (player.score <= maxScore && player.kda > maxKda) {
          while (player.kda > maxKda && player.deaths < 12) {
            player.deaths += 1;
            player.kda = Math.round(((player.kills + player.assists) / player.deaths) * 10) / 10;
          }
          break;
        }
      }
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
  const rng = seededNoise(`${args.seriesId}:g${args.gameNumber}:gamelength`, 1) * 0.5 + 0.5;

  let baseMinutes: number;
  switch (args.matchProfile) {
    case "snowball": baseMinutes = 25; break;
    case "scaling":  baseMinutes = 35; break;
    default:         baseMinutes = 30;
  }

  if (args.closeness >= 0.7) baseMinutes += 3;
  else if (args.closeness <= 0.3) baseMinutes -= 3;

  const variance = (rng - 0.5) * 8;
  const totalMinutes = clamp(baseMinutes + variance, 20, 45);

  const minutes = Math.floor(totalMinutes);
  const seconds = Math.floor((totalMinutes - minutes) * 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}