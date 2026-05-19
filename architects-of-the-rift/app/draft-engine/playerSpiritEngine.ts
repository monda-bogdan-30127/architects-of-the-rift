// ═══════════════════════════════════════════════════════════════════════════
// Player Spirit Engine
//
// Pure logic layer.  Given a completed-series context, computes per-player
// spirit deltas and updated streak state.  Does NOT perform I/O — the caller
// (accumulator → applySpiritDeltas) is responsible for persistence.
//
// FILE: app/draft-engine/playerSpiritEngine.ts
// ═══════════════════════════════════════════════════════════════════════════

import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { getChampionGrade } from "@/app/utils/championMasteryUtils";
import {
  SPIRIT_INITIAL_VALUE,
  SPIRIT_MIN,
  SPIRIT_MAX,
} from "./playerSpiritStorage";
import type {
  SpiritEvent,
  SpiritReason,
  PlayerStreaks,
} from "@/app/types/spirit";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";

// ─── Tunables (collected here for easy iteration) ───────────────────────────
//
// REBALANCE NOTES:
// • Positive deltas reduced — winning shouldn't trivially pin you at 100.
// • Negative deltas amplified — losses + slumps should hurt more.
// • Series result is the bedrock; everything else is modulation.
//
// ────────────────────────────────────────────────────────────────────────────

const DELTA_SERIES_WIN          = +3;
const DELTA_SERIES_LOSS         = -6;
const DELTA_SWEEP_WIN           = +5;   // replaces series_win, not additive
const DELTA_SWEEP_LOSS          = -10;  // replaces series_loss, not additive
const DELTA_HIGH_SCORE          = +3;   // ≥ 7.5 in ≥ 2 games
const DELTA_LOW_SCORE           = -5;   // ≤ 4.5 in ≥ 2 games
const DELTA_GAME_MVP            = +1;   // per occurrence
const DELTA_SERIES_MVP          = +4;
const DELTA_COMFORT_PICKS       = +2;   // 2+ games on SS/S/A
const DELTA_OFF_COMFORT         = -5;   // 2+ games on C/D in this series
const DELTA_OFF_COMFORT_STREAK  = -8;   // 3 consecutive games on C/D cross-series
const DELTA_RESILIENCE_WIN      = +2;   // win on a C/D champion
const DELTA_POOL_PRESSURE_SOFT  = -3;   // ≤ 2 A+ champions available after bans
const DELTA_POOL_PRESSURE_HARD  = -5;   // 0 A+ champions available after bans
const DELTA_LEADERSHIP_BOOST    = +2;
const DELTA_LEADERSHIP_DRAIN    = -2;
const DELTA_WIN_STREAK_3        = +5;
const DELTA_LOSS_STREAK_3       = -5;

// New deltas for added mechanics:
const DELTA_UNDERPERFORM_SIGNATURE = -2;  // ≥1 game with score ≤4.5 on SS/S/A champ
const DELTA_OVERPERFORM_OFF_COMFORT = +2; // ≥1 game with score ≥7.5 on C/D champ
const DELTA_CLOSE_LOSS_CUSHION = +2;      // applied on close losses (1-2 in Bo3, 2-3 in Bo5)
const DELTA_CARRIED_ALONE_LOST = -3;      // personal ≥7 avg in loss, teammates avg ≤5.5
const DELTA_MVP_LOSS_CUSHION   = +3;      // Series MVP in a lost series — soften the loss

const HIGH_SCORE_THRESHOLD = 7.5;
const LOW_SCORE_THRESHOLD  = 4.5;
const HIGH_LOW_GAMES_NEEDED = 2;
const CARRIED_ALONE_PERSONAL_THRESHOLD = 7.0;
const CARRIED_ALONE_TEAMMATES_THRESHOLD = 5.5;

const COMFORT_GAMES_NEEDED = 2;       // games on SS/S/A or C/D within a series
const OFF_COMFORT_STREAK_LIMIT = 3;   // consecutive C/D games (cross-series)
const POOL_PRESSURE_A_PLUS_SOFT_THRESHOLD = 2;   // ≤2 A+ → soft penalty
const POOL_PRESSURE_A_PLUS_HARD_THRESHOLD = 0;   // 0 A+ → hard penalty

const LEADERSHIP_TRAIT_THRESHOLD     = 80;
const LEADERSHIP_BOOST_SPIRIT_FLOOR  = 65;
const LEADERSHIP_DRAIN_SPIRIT_CEIL   = 45;
const LEADERSHIP_CYCLE_INTERVAL      = 2;   // every 2 controlled-team series
// TODO(calendar-feature): switch to per-week cycle when calendar is added

const STREAK_LIMIT = 3;

// ─── Hidden-trait modulation ────────────────────────────────────────────────
//
// composure ≥ 80 → all deltas × 0.8  (stoic, hard to rattle)
// volatility ≥ 80 → all deltas × 1.3 (reactive, swings hard)
// Both flags may apply simultaneously; effects multiply.

const COMPOSURE_THRESHOLD = 80;
const VOLATILITY_THRESHOLD = 80;
const COMPOSURE_MULTIPLIER = 0.8;
const VOLATILITY_MULTIPLIER = 1.3;

// ─── Asymmetric per-series cap ──────────────────────────────────────────────
//
// Diminishing returns at high spirit; cushioned floor at low spirit.
// Goal: hard to STAY at 100, hard to STAY at 10.  Recovery from low is
// possible but slow; collapse from high is fast and dramatic.
//
// Spirit range  | Positive cap | Negative cap
// ──────────────┼──────────────┼──────────────
// 90–100        | +5           | -15
// 80–89         | +8           | -15
// 65–79         | +12          | -15
// 50–64         | +15          | -12
// 35–49         | +15          | -10
// 10–34         | +15          |  -8
// ────────────────────────────────────────────────────────────────────────────

type CapBand = { min: number; max: number; positive: number; negative: number };

const CAP_BANDS: CapBand[] = [
  { min: 90, max: 100, positive: +5,  negative: -15 },
  { min: 80, max:  89, positive: +8,  negative: -15 },
  { min: 65, max:  79, positive: +12, negative: -15 },
  { min: 50, max:  64, positive: +15, negative: -12 },
  { min: 35, max:  49, positive: +15, negative: -10 },
  { min: 10, max:  34, positive: +15, negative:  -8 },
];

// ─── Mastery grade helpers ──────────────────────────────────────────────────

const COMFORT_GRADES: ChampionMasteryGrade[] = ["SS", "S", "A"];
const OFF_COMFORT_GRADES: ChampionMasteryGrade[] = ["C", "D"];
const A_PLUS_GRADES: ChampionMasteryGrade[] = ["SS", "S", "A"];

function isComfortGrade(grade: ChampionMasteryGrade): boolean {
  return COMFORT_GRADES.includes(grade);
}
function isOffComfortGrade(grade: ChampionMasteryGrade): boolean {
  return OFF_COMFORT_GRADES.includes(grade);
}
function isAPlus(grade: ChampionMasteryGrade): boolean {
  return A_PLUS_GRADES.includes(grade);
}

// ─── Engine input types ─────────────────────────────────────────────────────

export type SpiritGameSnapshot = {
  gameNumber: number;
  winnerSide: "blue" | "red";
  controlledSide: "blue" | "red";
  /** Bans across both sides — needed for pool pressure check. */
  bans: string[];
  /** Per-player score result for this game. */
  playerEntries: Array<{
    playerId: string;
    score: number;
    championId: string | null;
    role: Role;
    side: "blue" | "red";
    isGameMvp: boolean;
  }>;
};

export type SpiritSeriesContext = {
  seriesId: string;
  controlledTeamSlug: string;
  controlledRoster: Partial<Record<Role, string>>;
  playersById: Map<string, Player>;
  bo: 3 | 5;
  games: SpiritGameSnapshot[];
  seriesMvpPlayerId: string | null;
  /** From storage — current spirits per controlled-team player. */
  currentSpirits: Record<string, number>;
  /** From storage — current streak state per controlled-team player. */
  currentStreaks: Record<string, PlayerStreaks>;
  /** From storage — increments by 1 each time controlled team plays a series. */
  leadershipCycleCounter: number;
};

export type SpiritDeltaResult = {
  playerId: string;
  events: SpiritEvent[];
  totalDelta: number;
  newValue: number;
  newStreaks: PlayerStreaks;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function emptyStreaks(): PlayerStreaks {
  return { offComfortGames: 0, seriesWins: 0, seriesLosses: 0 };
}

function buildEvent(
  playerId: string,
  delta: number,
  reason: SpiritReason,
  details: string,
  seriesId: string,
): SpiritEvent {
  return {
    timestamp: Date.now(),
    playerId,
    delta,
    newValue: 0,           // filled in after cap & cumulation
    reason,
    seriesId,
    details,
  };
}

// ─── Per-controlled-player computation ──────────────────────────────────────

type PlayerGameRow = {
  gameNumber: number;
  score: number;
  championId: string | null;
  grade: ChampionMasteryGrade;
  isWinner: boolean;
  isGameMvp: boolean;
};

function buildPlayerGameRows(
  ctx: SpiritSeriesContext,
  playerId: string,
  player: Player,
): PlayerGameRow[] {
  const rows: PlayerGameRow[] = [];

  for (const game of ctx.games) {
    // Find the entry for this player in this game.  Players who didn't play
    // that game (e.g. role-swap or substitution paths) get skipped.
    const entry = game.playerEntries.find((e) => e.playerId === playerId);
    if (!entry || !entry.championId) continue;

    rows.push({
      gameNumber: game.gameNumber,
      score: entry.score,
      championId: entry.championId,
      grade: getChampionGrade(player, entry.championId),
      isWinner: entry.side === game.winnerSide,
      isGameMvp: entry.isGameMvp,
    });
  }

  return rows.sort((a, b) => a.gameNumber - b.gameNumber);
}

// ─── Trigger: series win/loss ───────────────────────────────────────────────

function applySeriesResult(
  events: SpiritEvent[],
  playerId: string,
  rows: PlayerGameRow[],
  seriesId: string,
  bo: 3 | 5,
): { wins: number; losses: number; isSweep: boolean; isWin: boolean; isLoss: boolean; isCloseLoss: boolean } {
  const wins = rows.filter((r) => r.isWinner).length;
  const losses = rows.filter((r) => !r.isWinner).length;
  const winsToClinch = Math.ceil(bo / 2);

  // Did THIS player's team win the series?  If the player played all decisive
  // games, wins >= winsToClinch implies a series win for them.
  const isWin = wins >= winsToClinch;
  const isLoss = losses >= winsToClinch;
  const isSweep =
    (isWin && losses === 0 && wins === winsToClinch) ||
    (isLoss && wins === 0 && losses === winsToClinch);
  // "Close loss" = lost by exactly 1 game (Bo3 1-2, Bo5 2-3) — fought hard,
  // shouldn't sting as much as a sweep.  Cushion event added below.
  const isCloseLoss = isLoss && !isSweep && (winsToClinch - wins) === 1;

  if (isWin && isSweep) {
    events.push(buildEvent(playerId, DELTA_SWEEP_WIN, "sweep_win", `Series sweep ${wins}-0`, seriesId));
  } else if (isWin) {
    events.push(buildEvent(playerId, DELTA_SERIES_WIN, "series_win", `Won series ${wins}-${losses}`, seriesId));
  } else if (isLoss && isSweep) {
    events.push(buildEvent(playerId, DELTA_SWEEP_LOSS, "sweep_loss", `Series sweep loss 0-${losses}`, seriesId));
  } else if (isLoss) {
    events.push(buildEvent(playerId, DELTA_SERIES_LOSS, "series_loss", `Lost series ${wins}-${losses}`, seriesId));
  }

  // Close-loss cushion — softens the sting of fighting through to the final game.
  if (isCloseLoss) {
    events.push(buildEvent(
      playerId, DELTA_CLOSE_LOSS_CUSHION, "close_loss_cushion",
      "Fought hard through every game",
      seriesId,
    ));
  }

  return { wins, losses, isSweep, isWin, isLoss, isCloseLoss };
}

// ─── Trigger: score thresholds ──────────────────────────────────────────────

function applyScoreTriggers(
  events: SpiritEvent[],
  playerId: string,
  rows: PlayerGameRow[],
  seriesId: string,
): void {
  const highCount = rows.filter((r) => r.score >= HIGH_SCORE_THRESHOLD).length;
  const lowCount  = rows.filter((r) => r.score <= LOW_SCORE_THRESHOLD).length;

  if (highCount >= HIGH_LOW_GAMES_NEEDED) {
    events.push(buildEvent(
      playerId, DELTA_HIGH_SCORE, "high_score",
      `Strong scores in ${highCount} games`,
      seriesId,
    ));
  }
  if (lowCount >= HIGH_LOW_GAMES_NEEDED) {
    events.push(buildEvent(
      playerId, DELTA_LOW_SCORE, "low_score",
      `Weak scores in ${lowCount} games`,
      seriesId,
    ));
  }
}

// ─── Trigger: MVPs ──────────────────────────────────────────────────────────

function applyMvpTriggers(
  events: SpiritEvent[],
  playerId: string,
  rows: PlayerGameRow[],
  seriesMvpId: string | null,
  seriesId: string,
  isLoss: boolean,
): void {
  const gameMvpCount = rows.filter((r) => r.isGameMvp).length;
  if (gameMvpCount > 0) {
    events.push(buildEvent(
      playerId, DELTA_GAME_MVP * gameMvpCount, "game_mvp",
      gameMvpCount === 1 ? "Game MVP" : `Game MVP x${gameMvpCount}`,
      seriesId,
    ));
  }
  if (seriesMvpId === playerId) {
    events.push(buildEvent(playerId, DELTA_SERIES_MVP, "series_mvp", "Series MVP", seriesId));
    // Series MVP in a lost series — soften the loss penalty.  Player performed,
    // team failed around them; psychological hit shouldn't be net-negative.
    if (isLoss) {
      events.push(buildEvent(
        playerId, DELTA_MVP_LOSS_CUSHION, "mvp_loss_cushion",
        "Carried the series despite the loss",
        seriesId,
      ));
    }
  }
}

// ─── Trigger: champion comfort/discomfort (in-series) ───────────────────────

function applyComfortTriggers(
  events: SpiritEvent[],
  playerId: string,
  rows: PlayerGameRow[],
  seriesId: string,
): void {
  const comfortCount    = rows.filter((r) => isComfortGrade(r.grade)).length;
  const offComfortCount = rows.filter((r) => isOffComfortGrade(r.grade)).length;

  if (comfortCount >= COMFORT_GAMES_NEEDED) {
    events.push(buildEvent(
      playerId, DELTA_COMFORT_PICKS, "comfort_picks",
      `${comfortCount} games on signature picks`,
      seriesId,
    ));
  }
  if (offComfortCount >= COMFORT_GAMES_NEEDED) {
    events.push(buildEvent(
      playerId, DELTA_OFF_COMFORT, "off_comfort",
      `${offComfortCount} games on off-comfort picks`,
      seriesId,
    ));
  }

  // Resilience win — won at least once on a C/D champion.
  const resilienceWins = rows.filter((r) => isOffComfortGrade(r.grade) && r.isWinner).length;
  if (resilienceWins > 0) {
    events.push(buildEvent(
      playerId, DELTA_RESILIENCE_WIN, "resilience_win",
      resilienceWins === 1
        ? "Won on an off-comfort champion"
        : `Won on ${resilienceWins} off-comfort champions`,
      seriesId,
    ));
  }

  // Underperformance on signature — score ≤4.5 on SS/S/A champion hits harder
  // because the player expected to dominate on their best champ.
  const underperformSignature = rows.filter(
    (r) => isComfortGrade(r.grade) && r.score <= LOW_SCORE_THRESHOLD,
  ).length;
  if (underperformSignature > 0) {
    events.push(buildEvent(
      playerId, DELTA_UNDERPERFORM_SIGNATURE, "underperform_signature",
      underperformSignature === 1
        ? "Slumped on a signature pick"
        : `Slumped on ${underperformSignature} signature picks`,
      seriesId,
    ));
  }

  // Overperformance on off-comfort — score ≥7.5 on C/D champion feels great
  // because the player exceeded expectations on a stretch champion.
  const overperformOffComfort = rows.filter(
    (r) => isOffComfortGrade(r.grade) && r.score >= HIGH_SCORE_THRESHOLD,
  ).length;
  if (overperformOffComfort > 0) {
    events.push(buildEvent(
      playerId, DELTA_OVERPERFORM_OFF_COMFORT, "overperform_off_comfort",
      overperformOffComfort === 1
        ? "Excelled on an off-comfort champion"
        : `Excelled on ${overperformOffComfort} off-comfort champions`,
      seriesId,
    ));
  }
}

// ─── Trigger: cross-series off-comfort streak ───────────────────────────────

function updateOffComfortStreakAndApply(
  events: SpiritEvent[],
  playerId: string,
  rows: PlayerGameRow[],
  prevStreak: number,
  seriesId: string,
): number {
  // Walk games in order: each off-comfort game increments, others reset.
  let streak = prevStreak;
  let triggeredAt = -1;

  for (const row of rows) {
    if (isOffComfortGrade(row.grade)) {
      streak += 1;
      // Trigger fires the first time we hit the limit *during this series*.
      if (streak >= OFF_COMFORT_STREAK_LIMIT && triggeredAt < 0) {
        triggeredAt = row.gameNumber;
      }
    } else {
      streak = 0;
    }
  }

  if (triggeredAt >= 0) {
    events.push(buildEvent(
      playerId, DELTA_OFF_COMFORT_STREAK, "off_comfort_streak",
      `${OFF_COMFORT_STREAK_LIMIT} consecutive off-comfort games`,
      seriesId,
    ));
  }

  return streak;
}

// ─── Trigger: pool pressure (post-ban A+ availability) ──────────────────────

function applyPoolPressureTrigger(
  events: SpiritEvent[],
  playerId: string,
  player: Player,
  ctx: SpiritSeriesContext,
): void {
  // Aggregate bans across all games of the series.
  const allBans = new Set<string>();
  for (const game of ctx.games) {
    for (const championId of game.bans) allBans.add(championId);
  }

  // Count remaining A+ champions for the player after bans.
  let aPlusRemaining = 0;
  // We iterate the player's resolved pool: any champion they have an explicit
  // grade for, including A+ tiers.  Since we don't have a pool list here,
  // we rely on the override map via getChampionGrade against the bestChampions
  // and championPool union.
  const pool = new Set<string>([
    ...player.bestChampions,
    ...(player.comfortChampions ?? []),
    ...(player.championPool ?? []),
  ]);

  for (const championId of pool) {
    if (allBans.has(championId)) continue;
    const grade = getChampionGrade(player, championId);
    if (isAPlus(grade)) aPlusRemaining += 1;
  }

  if (aPlusRemaining <= POOL_PRESSURE_A_PLUS_HARD_THRESHOLD) {
    events.push(buildEvent(
      playerId, DELTA_POOL_PRESSURE_HARD, "pool_pressure",
      "No signature champions available",
      ctx.seriesId,
    ));
  } else if (aPlusRemaining <= POOL_PRESSURE_A_PLUS_SOFT_THRESHOLD) {
    events.push(buildEvent(
      playerId, DELTA_POOL_PRESSURE_SOFT, "pool_pressure",
      `Only ${aPlusRemaining} signature champion${aPlusRemaining === 1 ? "" : "s"} available`,
      ctx.seriesId,
    ));
  }
}

// ─── Trigger: leadership influence (every 2 series) ─────────────────────────

function applyLeadershipTriggers(
  perPlayerEvents: Map<string, SpiritEvent[]>,
  ctx: SpiritSeriesContext,
): void {
  // Cycle gate — only fire on every Nth series involving the controlled team.
  const cycleAfterIncrement = ctx.leadershipCycleCounter + 1;
  if (cycleAfterIncrement % LEADERSHIP_CYCLE_INTERVAL !== 0) return;

  // Find best leader (highest leadership trait) on the controlled roster.
  let bestLeaderId: string | null = null;
  let bestLeaderScore = -Infinity;

  for (const role of ["top", "jungle", "mid", "adc", "support"] as Role[]) {
    const playerId = ctx.controlledRoster[role];
    if (!playerId) continue;
    const player = ctx.playersById.get(playerId);
    if (!player) continue;
    const leadership = player.advancedProfile?.hiddenTraits?.leadership ?? 50;
    if (leadership > bestLeaderScore) {
      bestLeaderScore = leadership;
      bestLeaderId = playerId;
    }
  }

  if (!bestLeaderId || bestLeaderScore < LEADERSHIP_TRAIT_THRESHOLD) return;

  const leaderSpirit = ctx.currentSpirits[bestLeaderId] ?? SPIRIT_INITIAL_VALUE;

  let delta = 0;
  let reason: SpiritReason = "leadership_boost";
  let details = "";

  if (leaderSpirit >= LEADERSHIP_BOOST_SPIRIT_FLOOR) {
    delta = DELTA_LEADERSHIP_BOOST;
    reason = "leadership_boost";
    details = "Team leader is motivated";
  } else if (leaderSpirit < LEADERSHIP_DRAIN_SPIRIT_CEIL) {
    delta = DELTA_LEADERSHIP_DRAIN;
    reason = "leadership_drain";
    details = "Team leader is struggling";
  } else {
    return; // neutral leader spirit → no influence
  }

  // Apply to every controlled-team player (including the leader themselves).
  for (const role of ["top", "jungle", "mid", "adc", "support"] as Role[]) {
    const playerId = ctx.controlledRoster[role];
    if (!playerId) continue;
    const events = perPlayerEvents.get(playerId) ?? [];
    events.push(buildEvent(playerId, delta, reason, details, ctx.seriesId));
    perPlayerEvents.set(playerId, events);
  }
}

// ─── Streak triggers (3-series win/loss) ────────────────────────────────────

function applyStreakBonus(
  events: SpiritEvent[],
  playerId: string,
  newSeriesWins: number,
  newSeriesLosses: number,
  seriesId: string,
): void {
  if (newSeriesWins === STREAK_LIMIT) {
    events.push(buildEvent(
      playerId, DELTA_WIN_STREAK_3, "win_streak_3",
      `${STREAK_LIMIT}-series win streak`,
      seriesId,
    ));
  }
  if (newSeriesLosses === STREAK_LIMIT) {
    events.push(buildEvent(
      playerId, DELTA_LOSS_STREAK_3, "loss_streak_3",
      `${STREAK_LIMIT}-series loss streak`,
      seriesId,
    ));
  }
}

// ─── Trigger: carried alone, lost ──────────────────────────────────────────
//
// If this player averaged ≥7 in a lost series while teammates averaged ≤5.5,
// the player carried but the team failed.  Distinct frustration profile.

function applyCarriedAloneTrigger(
  events: SpiritEvent[],
  playerId: string,
  rows: PlayerGameRow[],
  isLoss: boolean,
  ctx: SpiritSeriesContext,
): void {
  if (!isLoss || rows.length === 0) return;

  const personalAvg = rows.reduce((s, r) => s + r.score, 0) / rows.length;
  if (personalAvg < CARRIED_ALONE_PERSONAL_THRESHOLD) return;

  // Collect teammate scores from all games of the controlled side this player
  // played in.  A "teammate" is anyone on the same side, in the same game,
  // who is NOT this player.
  const teammateScores: number[] = [];
  for (const game of ctx.games) {
    const playerEntry = game.playerEntries.find((e) => e.playerId === playerId);
    if (!playerEntry) continue;
    const playerSide = playerEntry.side;
    for (const entry of game.playerEntries) {
      if (entry.playerId === playerId) continue;
      if (entry.side !== playerSide) continue;
      teammateScores.push(entry.score);
    }
  }
  if (teammateScores.length === 0) return;

  const teammateAvg = teammateScores.reduce((s, v) => s + v, 0) / teammateScores.length;
  if (teammateAvg > CARRIED_ALONE_TEAMMATES_THRESHOLD) return;

  events.push(buildEvent(
    playerId, DELTA_CARRIED_ALONE_LOST, "carried_alone_lost",
    "Carried alone — team couldn't follow",
    ctx.seriesId,
  ));
}

// ─── Hidden-trait multiplier (composure / volatility) ──────────────────────
//
// Modulate the magnitude (not sign) of every delta event for a player
// based on their personality.  Stoic players (composure ≥ 80) absorb hits
// and highs more calmly; volatile players (volatility ≥ 80) swing harder.
//
// Both effects can compound (a stoic but volatile player → 0.8 × 1.3 = 1.04,
// nearly neutral, which makes intuitive sense — emotional control offsets
// reactivity).

function applyTraitMultiplier(events: SpiritEvent[], player: Player): SpiritEvent[] {
  const composure  = player.advancedProfile?.hiddenTraits?.composure  ?? 50;
  const volatility = player.advancedProfile?.hiddenTraits?.volatility ?? 50;

  let multiplier = 1.0;
  if (composure  >= COMPOSURE_THRESHOLD)  multiplier *= COMPOSURE_MULTIPLIER;
  if (volatility >= VOLATILITY_THRESHOLD) multiplier *= VOLATILITY_MULTIPLIER;

  if (multiplier === 1.0) return events;

  return events.map((event) => ({
    ...event,
    delta: Math.round(event.delta * multiplier),
  }));
}

// ─── Asymmetric cap & event reconciliation ──────────────────────────────────

function getEffectiveCaps(currentSpirit: number): { positive: number; negative: number } {
  for (const band of CAP_BANDS) {
    if (currentSpirit >= band.min && currentSpirit <= band.max) {
      return { positive: band.positive, negative: band.negative };
    }
  }
  // Defensive fallback (shouldn't hit — spirit is always clamped to [10,100]).
  return { positive: +12, negative: -15 };
}

/**
 * Caps the cumulative delta and adjusts the last event accordingly.
 * Event order is preserved.  If the cap clips, the last event's delta is
 * reduced and its details get a "(capped)" suffix; events are NOT removed.
 */
function applyCapToEvents(
  events: SpiritEvent[],
  currentSpirit: number,
): { totalDelta: number; events: SpiritEvent[] } {
  if (events.length === 0) return { totalDelta: 0, events: [] };

  const sumRaw = events.reduce((s, e) => s + e.delta, 0);
  const { positive, negative } = getEffectiveCaps(currentSpirit);
  const cappedTotal = clamp(sumRaw, negative, positive);

  if (cappedTotal === sumRaw) {
    return { totalDelta: cappedTotal, events };
  }

  // Distribute the cap by proportionally clipping the last event.
  const overflow = sumRaw - cappedTotal;
  const lastIndex = events.length - 1;
  const lastEvent = events[lastIndex];

  const adjustedLast: SpiritEvent = {
    ...lastEvent,
    delta: lastEvent.delta - overflow,
    details: lastEvent.details
      ? `${lastEvent.details} (capped)`
      : "(capped)",
  };

  const adjustedEvents = events.map((e, i) => (i === lastIndex ? adjustedLast : e));
  return { totalDelta: cappedTotal, events: adjustedEvents };
}

// ─── Streak update helper ───────────────────────────────────────────────────

function updateSeriesStreaks(
  prev: PlayerStreaks,
  isWin: boolean,
  isLoss: boolean,
  newOffComfortGames: number,
): PlayerStreaks {
  return {
    offComfortGames: newOffComfortGames,
    seriesWins:   isWin  ? prev.seriesWins + 1   : 0,
    seriesLosses: isLoss ? prev.seriesLosses + 1 : 0,
  };
}

// ─── Main entry: compute deltas for the entire series ───────────────────────

export function computeSeriesSpiritDeltas(
  ctx: SpiritSeriesContext,
): SpiritDeltaResult[] {
  const perPlayerEvents = new Map<string, SpiritEvent[]>();
  const perPlayerStreakUpdate = new Map<string, PlayerStreaks>();

  // ── Per-player triggers (everything except leadership) ───────────────────
  for (const role of ["top", "jungle", "mid", "adc", "support"] as Role[]) {
    const playerId = ctx.controlledRoster[role];
    if (!playerId) continue;
    const player = ctx.playersById.get(playerId);
    if (!player) continue;

    const events: SpiritEvent[] = [];
    const rows = buildPlayerGameRows(ctx, playerId, player);

    if (rows.length === 0) {
      // Player didn't appear in this series — skip (substitution / role-swap).
      perPlayerEvents.set(playerId, events);
      perPlayerStreakUpdate.set(playerId, ctx.currentStreaks[playerId] ?? emptyStreaks());
      continue;
    }

    const { isWin, isLoss } = applySeriesResult(events, playerId, rows, ctx.seriesId, ctx.bo);

    applyScoreTriggers(events, playerId, rows, ctx.seriesId);
    applyMvpTriggers(events, playerId, rows, ctx.seriesMvpPlayerId, ctx.seriesId, isLoss);
    applyComfortTriggers(events, playerId, rows, ctx.seriesId);
    applyCarriedAloneTrigger(events, playerId, rows, isLoss, ctx);

    const prevStreaks = ctx.currentStreaks[playerId] ?? emptyStreaks();
    const newOffComfort = updateOffComfortStreakAndApply(
      events, playerId, rows, prevStreaks.offComfortGames, ctx.seriesId,
    );

    applyPoolPressureTrigger(events, playerId, player, ctx);

    // Update streaks (apply BEFORE streak bonuses so we know post-update values).
    const newStreaks = updateSeriesStreaks(
      prevStreaks, isWin, isLoss, newOffComfort,
    );
    applyStreakBonus(events, playerId, newStreaks.seriesWins, newStreaks.seriesLosses, ctx.seriesId);

    // Apply hidden-trait multiplier AFTER all triggers have produced raw
    // events but BEFORE the cap (so the cap evaluates personality-adjusted
    // magnitudes).  Leadership events are not yet present here — they are
    // intentionally exempt from trait multiplier (leadership is external).
    const traitAdjusted = applyTraitMultiplier(events, player);
    perPlayerEvents.set(playerId, traitAdjusted);
    perPlayerStreakUpdate.set(playerId, newStreaks);
  }

  // ── Leadership influence (post player triggers, every 2 cycles) ──────────
  applyLeadershipTriggers(perPlayerEvents, ctx);

  // ── Apply asymmetric caps & build result ─────────────────────────────────
  const results: SpiritDeltaResult[] = [];

  for (const [playerId, events] of perPlayerEvents.entries()) {
    const currentSpirit = ctx.currentSpirits[playerId] ?? SPIRIT_INITIAL_VALUE;
    const { totalDelta, events: cappedEvents } = applyCapToEvents(events, currentSpirit);

    const newValue = clamp(currentSpirit + totalDelta, SPIRIT_MIN, SPIRIT_MAX);

    // Stamp newValue progressively across events so the UI can show the
    // running total if desired.
    let running = currentSpirit;
    const stampedEvents = cappedEvents.map((event) => {
      running = clamp(running + event.delta, SPIRIT_MIN, SPIRIT_MAX);
      return { ...event, newValue: running };
    });

    results.push({
      playerId,
      events: stampedEvents,
      totalDelta,
      newValue,
      newStreaks: perPlayerStreakUpdate.get(playerId) ?? emptyStreaks(),
    });
  }

  return results;
}