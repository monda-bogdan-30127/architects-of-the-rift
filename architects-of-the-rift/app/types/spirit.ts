// ═══════════════════════════════════════════════════════════════════════════
// Player Spirit System — Types
//
// Spirit represents the morale / mental state of each player on the
// user's controlled team.  Range 10–100, initial 65.
//
// FILE: app/types/spirit.ts
// ═══════════════════════════════════════════════════════════════════════════

// ─── Spirit event reasons ───────────────────────────────────────────────────

export type SpiritReason =
  | "series_win"
  | "series_loss"
  | "sweep_win"          // 2-0 in Bo3 or 3-0 in Bo5
  | "sweep_loss"         // 0-2 in Bo3 or 0-3 in Bo5
  | "high_score"         // ≥ 7.5 in ≥ 2 games
  | "low_score"          // ≤ 4.5 in ≥ 2 games
  | "game_mvp"           // awarded Game MVP in a game
  | "series_mvp"         // awarded Series MVP
  | "comfort_picks"      // 2+ games on SS/S/A champion
  | "off_comfort"        // 2+ games on C/D champion (in-series)
  | "off_comfort_streak" // 3 games consecutive on C/D (cross-series)
  | "resilience_win"     // won on a C/D champion
  | "pool_pressure"      // ≤ 1 champion A+ available after bans
  | "leadership_boost"   // team leader spirit ≥ 65 → +2
  | "leadership_drain"   // team leader spirit < 45 → -2
  | "win_streak_3"       // 3 consecutive series wins
  | "loss_streak_3";     // 3 consecutive series losses

// ─── Spirit label ───────────────────────────────────────────────────────────

export type SpiritLabel =
  | "Motivated"
  | "Stable"
  | "Frustrated"
  | "Unhappy"
  | "On Edge";

// ─── Spirit event (history entry) ───────────────────────────────────────────

export type SpiritEvent = {
  timestamp: number;
  playerId: string;
  delta: number;
  newValue: number;
  reason: SpiritReason;
  seriesId?: string;
  details?: string;       // human-readable, e.g. "Won series 2-0 (sweep)"
};

// ─── Cross-series streak tracking ───────────────────────────────────────────

export type PlayerStreaks = {
  offComfortGames: number;   // consecutive C/D games (cross-series)
  seriesWins: number;        // consecutive series wins
  seriesLosses: number;      // consecutive series losses
};

// ─── Persisted store ────────────────────────────────────────────────────────

export type PlayerSpiritStore = {
  version: 1;
  spirits: Record<string, number>;       // playerId → spirit value
  history: SpiritEvent[];                 // capped at 150
  streaks: Record<string, PlayerStreaks>; // playerId → cross-series state
  leadershipCycleCounter: number;         // incremented per controlled-team series
  lastUpdatedAt: number;
};

// ─── Spirit modifier lookup (applied in matchSimulator) ─────────────────────

export const SPIRIT_SCORE_MODIFIERS: { min: number; max: number; mod: number }[] = [
  { min: 80, max: 100, mod: +0.40 },
  { min: 65, max:  79, mod: +0.15 },
  { min: 50, max:  64, mod:  0.00 },
  { min: 35, max:  49, mod: -0.30 },
  { min: 10, max:  34, mod: -0.60 },
];

// ─── Spirit variance factors (multiplied with mastery variance) ─────────────

export const SPIRIT_VARIANCE_FACTORS: { min: number; max: number; factor: number }[] = [
  { min: 80, max: 100, factor: 0.95 },
  { min: 65, max:  79, factor: 1.00 },
  { min: 50, max:  64, factor: 1.03 },
  { min: 35, max:  49, factor: 1.08 },
  { min: 10, max:  34, factor: 1.15 },
];

// ─── Spirit label config ────────────────────────────────────────────────────

export type SpiritLabelConfig = {
  min: number;
  max: number;
  label: SpiritLabel;
  color: string;
};

export const SPIRIT_LABELS: SpiritLabelConfig[] = [
  { min: 80, max: 100, label: "Motivated",  color: "#4CAF50" },
  { min: 60, max:  79, label: "Stable",     color: "#B0B0B0" },
  { min: 40, max:  59, label: "Frustrated", color: "#FFC107" },
  { min: 20, max:  39, label: "Unhappy",    color: "#FF9800" },
  { min: 10, max:  19, label: "On Edge",    color: "#F44336" },
];
