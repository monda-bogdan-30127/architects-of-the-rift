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
import { getChampionStatsForRole } from "./championRoleStatsSystem";
import { getChampionKdaType, KDA_TYPE_FACTOR } from "./championKdaType";
import { champions } from "@/app/data/champions";

// ─── KDA_WORLDS_2026: constantele generatorului ─────────────────────────────
// KDA-ul se generează după rezultat (nu decide meciul), deci constantele stau aici, nu în draftThinkingConfig.
export const KDA_CONFIG = {
  /**
   * Cotele pe rol: pornite de la Worlds 2026 Main Event (§1.2: cota din kill-urile / death-urile echipei și
   * asist-uri / (kill-urile echipei − kill-urile proprii)), apoi ajustate ca REZULTATUL (după nota jucătorului,
   * factorul de campion și zgomot) să iasă pe valorile reale (scripts/kda-calibration.ts). Normalizate la alocare.
   */
  roleProfile: {
    top:     { killWeight: 0.200, deathWeight: 0.193, assistBase: 0.425 },
    jungle:  { killWeight: 0.205, deathWeight: 0.222, assistBase: 0.605 },
    mid:     { killWeight: 0.257, deathWeight: 0.193, assistBase: 0.522 },
    adc:     { killWeight: 0.290, deathWeight: 0.204, assistBase: 0.507 },
    support: { killWeight: 0.049, deathWeight: 0.194, assistBase: 0.741 },
  } as Record<Role, { killWeight: number; deathWeight: number; assistBase: number }>,
  /** Factorul de campion (§3.2): death-uri × f^(−deathExponent), participare × f^assistExponent, kill-uri × f^killExponent. */
  deathExponent: 1,
  assistExponent: 0.25,
  killExponent: 0.3,
  /** shrink = pick-uri / (pick-uri + shrinkPicks) între KDA-ul de pro relativ și factorul pe tip. */
  shrinkPicks: 15,
  factorMin: 0.7,
  factorMax: 1.4,
};

const ROLE_PROFILE = KDA_CONFIG.roleProfile;

// ─── Factorul de campion (§3.2) ─────────────────────────────────────────────
/** Mediana KDA-ului de pro pe rol, pe campionii cu pick-uri pe acel rol (o dată). */
const roleKdaMedians = new Map<Role, number>();
function roleKdaMedian(role: Role): number {
  const cached = roleKdaMedians.get(role);
  if (cached !== undefined) return cached;
  const values = champions
    .filter((champion) => champion.roles.includes(role))
    .map((champion) => getChampionStatsForRole(champion, role))
    .filter((stats) => (stats.picks ?? 0) > 0 && typeof stats.kda === "number")
    .map((stats) => stats.kda as number)
    .sort((a, b) => a - b);
  const median = values.length ? values[Math.floor(values.length / 2)] : 3;
  roleKdaMedians.set(role, median);
  return median;
}

const kdaFactorCache = new Map<string, number>();
/**
 * 1 = media rolului. Din KDA-ul de pro relativ la mediana rolului, micșorat spre factorul pe tip după numărul de
 * pick-uri (shrink = pick-uri / (pick-uri + 15)); fără pick-uri, doar tipul. Limitat la 0,7–1,4.
 */
export function getChampionKdaFactor(championId: string, role: Role): number {
  const key = `${championId}:${role}`;
  const cached = kdaFactorCache.get(key);
  if (cached !== undefined) return cached;
  const champion = getChampionByIdSafe(championId);
  const typeFactor = KDA_TYPE_FACTOR[getChampionKdaType(championId, role)];
  let factor = typeFactor;
  if (champion) {
    const stats = getChampionStatsForRole(champion, role);
    const picks = stats.picks ?? 0;
    if (picks > 0 && typeof stats.kda === "number") {
      const shrink = picks / (picks + KDA_CONFIG.shrinkPicks);
      factor = shrink * (stats.kda / roleKdaMedian(role)) + (1 - shrink) * typeFactor;
    }
  }
  const result = clamp(factor, KDA_CONFIG.factorMin, KDA_CONFIG.factorMax);
  kdaFactorCache.set(key, result);
  return result;
}

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

  const remaining = total - allocated.reduce((sum, value) => sum + value, 0);

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
      base = args.isWinner ? 21 : 6;
      break;
    case "scaling":
      base = args.isWinner ? 13 : 9;
      break;
    default:
      // KDA_WORLDS_2026 §3.3: −1 pe ambele (media ~14,2 → ~13,2 kill-uri pe echipă, ca la Worlds 2026).
      base = args.isWinner ? 16 : 10;
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

      // §3.2: factorul de campion (KDA de pro / tip), înlocuiește vechiul multiplicator doar pe kill-uri.
      const championMultiplier = Math.pow(getChampionKdaFactor(player.championId, player.role), KDA_CONFIG.killExponent);

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

      // §3.2: campionii cu KDA mare mor mai rar (engage mai des, enchanterii / mage-urile de control mai rar).
      const championDeathFactor = Math.pow(getChampionKdaFactor(player.championId, player.role), -KDA_CONFIG.deathExponent);

      return (
        roleProfile.deathWeight *
        scoreMultiplier *
        championDeathFactor *
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
        (roleProfile.assistBase +
          (scoreNorm - 0.5) * 0.24 +
          participationVariance) *
          Math.pow(getChampionKdaFactor(player.championId, player.role), KDA_CONFIG.assistExponent),
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
