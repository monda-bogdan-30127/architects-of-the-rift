// ═══════════════════════════════════════════════════════════════════════════
// Player Spirit Storage
//
// Pure I/O layer: read/write/init/reset.  No business logic — that lives in
// playerSpiritEngine.ts.  History is capped at 150 events.
//
// FILE: app/draft-engine/playerSpiritStorage.ts
// ═══════════════════════════════════════════════════════════════════════════

import {
  SPIRIT_SCORE_MODIFIERS,
  SPIRIT_VARIANCE_FACTORS,
  SPIRIT_LABELS,
  type PlayerSpiritStore,
  type SpiritEvent,
  type PlayerStreaks,
  type SpiritLabel,
  type SpiritLabelConfig,
} from "@/app/types/spirit";

// ─── Constants ──────────────────────────────────────────────────────────────

export const SPIRIT_STORAGE_KEY = "rift-player-spirit";
export const SPIRIT_HISTORY_CAP = 150;
export const SPIRIT_INITIAL_VALUE = 65;
export const SPIRIT_MIN = 10;
export const SPIRIT_MAX = 100;

// ─── Defaults ───────────────────────────────────────────────────────────────

function emptyStreaks(): PlayerStreaks {
  return {
    offComfortGames: 0,
    seriesWins: 0,
    seriesLosses: 0,
  };
}

function emptyStore(): PlayerSpiritStore {
  return {
    version: 1,
    spirits: {},
    history: [],
    streaks: {},
    leadershipCycleCounter: 0,
    lastUpdatedAt: 0,
  };
}

// ─── Normalization (defensive parse) ─────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeStreaks(raw: unknown): PlayerStreaks {
  if (!raw || typeof raw !== "object") return emptyStreaks();
  const r = raw as Partial<PlayerStreaks>;
  return {
    offComfortGames: isFiniteNumber(r.offComfortGames) ? r.offComfortGames : 0,
    seriesWins:      isFiniteNumber(r.seriesWins)      ? r.seriesWins      : 0,
    seriesLosses:    isFiniteNumber(r.seriesLosses)    ? r.seriesLosses    : 0,
  };
}

function normalizeEvent(raw: unknown): SpiritEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<SpiritEvent>;

  if (typeof r.playerId !== "string" || !r.playerId) return null;
  if (!isFiniteNumber(r.delta)) return null;
  if (!isFiniteNumber(r.newValue)) return null;
  if (!isFiniteNumber(r.timestamp)) return null;
  if (typeof r.reason !== "string") return null;

  return {
    timestamp: r.timestamp,
    playerId:  r.playerId,
    delta:     r.delta,
    newValue:  r.newValue,
    reason:    r.reason as SpiritEvent["reason"],
    seriesId:  typeof r.seriesId === "string" ? r.seriesId : undefined,
    details:   typeof r.details  === "string" ? r.details  : undefined,
  };
}

export function normalizeSpiritStore(raw: unknown): PlayerSpiritStore {
  if (!raw || typeof raw !== "object") return emptyStore();
  const r = raw as Partial<PlayerSpiritStore>;

  // Spirits map
  const spirits: Record<string, number> = {};
  if (r.spirits && typeof r.spirits === "object") {
    for (const [playerId, value] of Object.entries(r.spirits)) {
      if (typeof playerId === "string" && isFiniteNumber(value)) {
        spirits[playerId] = clamp(Math.round(value), SPIRIT_MIN, SPIRIT_MAX);
      }
    }
  }

  // History (capped at SPIRIT_HISTORY_CAP)
  const history: SpiritEvent[] = [];
  if (Array.isArray(r.history)) {
    for (const entry of r.history) {
      const event = normalizeEvent(entry);
      if (event) history.push(event);
    }
  }
  if (history.length > SPIRIT_HISTORY_CAP) {
    history.splice(0, history.length - SPIRIT_HISTORY_CAP);
  }

  // Streaks map
  const streaks: Record<string, PlayerStreaks> = {};
  if (r.streaks && typeof r.streaks === "object") {
    for (const [playerId, value] of Object.entries(r.streaks)) {
      if (typeof playerId === "string") {
        streaks[playerId] = normalizeStreaks(value);
      }
    }
  }

  return {
    version: 1,
    spirits,
    history,
    streaks,
    leadershipCycleCounter: isFiniteNumber(r.leadershipCycleCounter) ? r.leadershipCycleCounter : 0,
    lastUpdatedAt:          isFiniteNumber(r.lastUpdatedAt)          ? r.lastUpdatedAt          : 0,
  };
}

// ─── Storage I/O ────────────────────────────────────────────────────────────

function getLocalStorageSafe(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
}

export function readSpiritStore(): PlayerSpiritStore {
  const storage = getLocalStorageSafe();
  if (!storage) return emptyStore();

  const raw = storage.getItem(SPIRIT_STORAGE_KEY);
  if (!raw) return emptyStore();

  try {
    return normalizeSpiritStore(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

export function writeSpiritStore(store: PlayerSpiritStore): void {
  const storage = getLocalStorageSafe();
  if (!storage) return;

  const normalized = normalizeSpiritStore({
    ...store,
    lastUpdatedAt: Date.now(),
  });

  storage.setItem(SPIRIT_STORAGE_KEY, JSON.stringify(normalized));
}

export function resetSpiritStore(): void {
  const storage = getLocalStorageSafe();
  if (!storage) return;
  storage.removeItem(SPIRIT_STORAGE_KEY);
}

// ─── Read helpers ───────────────────────────────────────────────────────────

/**
 * Returns the current spirit value for a player.
 * Returns SPIRIT_INITIAL_VALUE (65) if the player has no recorded spirit yet.
 *
 * NOTE: this is a lazy-init read.  Spirits are seeded as they're queried,
 * so newly added players (e.g. through a future transfer window) will start
 * at 65 automatically without needing an explicit init pass.
 */
export function getSpirit(playerId: string): number {
  if (!playerId) return SPIRIT_INITIAL_VALUE;
  const store = readSpiritStore();
  const value = store.spirits[playerId];
  return isFiniteNumber(value) ? value : SPIRIT_INITIAL_VALUE;
}

/**
 * Returns the spirit score modifier (added to the simulated player score
 * in matchSimulator's buildPlayerScores).
 *
 * Returns 0 if controlledTeamSlug is empty / mismatch — spirit only affects
 * players on the user-controlled team.
 */
export function getSpiritScoreModifier(
  playerId: string,
  side: "blue" | "red",
  blueTeamSlug: string,
  redTeamSlug: string,
  controlledTeamSlug: string,
): number {
  if (!controlledTeamSlug) return 0;

  const playerTeamSlug = side === "blue" ? blueTeamSlug : redTeamSlug;
  if (playerTeamSlug !== controlledTeamSlug) return 0;

  const spirit = getSpirit(playerId);

  for (const range of SPIRIT_SCORE_MODIFIERS) {
    if (spirit >= range.min && spirit <= range.max) return range.mod;
  }
  return 0;
}

/**
 * Returns the spirit variance factor (multiplied with mastery variance).
 *
 * Returns 1.0 if not on controlled team.
 */
export function getSpiritVarianceFactor(
  playerId: string,
  side: "blue" | "red",
  blueTeamSlug: string,
  redTeamSlug: string,
  controlledTeamSlug: string,
): number {
  if (!controlledTeamSlug) return 1.0;

  const playerTeamSlug = side === "blue" ? blueTeamSlug : redTeamSlug;
  if (playerTeamSlug !== controlledTeamSlug) return 1.0;

  const spirit = getSpirit(playerId);

  for (const range of SPIRIT_VARIANCE_FACTORS) {
    if (spirit >= range.min && spirit <= range.max) return range.factor;
  }
  return 1.0;
}

// ─── Label helpers ──────────────────────────────────────────────────────────

export function getSpiritLabel(spirit: number): SpiritLabel {
  for (const cfg of SPIRIT_LABELS) {
    if (spirit >= cfg.min && spirit <= cfg.max) return cfg.label;
  }
  return "Stable";
}

export function getSpiritLabelConfig(spirit: number): SpiritLabelConfig {
  for (const cfg of SPIRIT_LABELS) {
    if (spirit >= cfg.min && spirit <= cfg.max) return cfg;
  }
  return SPIRIT_LABELS[1]; // Stable fallback
}

// "Feels Motivated" / "Feels Stable" / etc. — used in UI per design.
export function getSpiritFeelsLabel(spirit: number): string {
  return `Feels ${getSpiritLabel(spirit)}`;
}

// ─── Streak helpers ─────────────────────────────────────────────────────────

export function getStreaks(playerId: string): PlayerStreaks {
  const store = readSpiritStore();
  return store.streaks[playerId] ?? emptyStreaks();
}

// ─── Apply deltas (atomic batch write) ──────────────────────────────────────

export type SpiritDeltaInput = {
  playerId: string;
  events: SpiritEvent[];          // events to append (already enriched)
  newSpiritValue: number;          // post-clamp value
  newStreaks: PlayerStreaks;       // updated streak state
};

/**
 * Atomic application of a batch of deltas.  Used by the engine after a series
 * concludes — all players' spirit changes are persisted in a single write.
 *
 * The `leadershipCycleIncrement` flag should be true if the controlled team
 * was involved in the series, so the cycle counter advances.
 */
export function applySpiritDeltas(
  inputs: SpiritDeltaInput[],
  leadershipCycleIncrement: boolean,
): void {
  if (inputs.length === 0 && !leadershipCycleIncrement) return;

  const store = readSpiritStore();

  for (const input of inputs) {
    store.spirits[input.playerId] = clamp(input.newSpiritValue, SPIRIT_MIN, SPIRIT_MAX);
    store.streaks[input.playerId] = input.newStreaks;
    for (const event of input.events) {
      store.history.push(event);
    }
  }

  if (leadershipCycleIncrement) {
    store.leadershipCycleCounter += 1;
  }

  // Cap history at SPIRIT_HISTORY_CAP — drop oldest first.
  if (store.history.length > SPIRIT_HISTORY_CAP) {
    store.history.splice(0, store.history.length - SPIRIT_HISTORY_CAP);
  }

  writeSpiritStore(store);
}

// ─── Roster init (idempotent, optional) ─────────────────────────────────────

/**
 * Ensures every player in `playerIds` has a spirit value seeded.
 * Idempotent — players already in the store are left untouched.
 *
 * Generally not needed since `getSpirit` lazy-inits, but useful for
 * the Spirit Log tab so the seeded value persists from the first view.
 */
export function ensureSpiritsForPlayers(playerIds: string[]): void {
  if (playerIds.length === 0) return;
  const store = readSpiritStore();
  let mutated = false;

  for (const id of playerIds) {
    if (!isFiniteNumber(store.spirits[id])) {
      store.spirits[id] = SPIRIT_INITIAL_VALUE;
      mutated = true;
    }
  }

  if (mutated) writeSpiritStore(store);
}

// ─── History readers (UI helpers) ───────────────────────────────────────────

export function getSpiritHistoryForPlayer(playerId: string): SpiritEvent[] {
  const store = readSpiritStore();
  return store.history.filter((event) => event.playerId === playerId);
}

export function getLeadershipCycleCounter(): number {
  return readSpiritStore().leadershipCycleCounter;
}
