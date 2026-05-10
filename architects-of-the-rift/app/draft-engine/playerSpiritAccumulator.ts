// ═══════════════════════════════════════════════════════════════════════════
// Player Spirit Accumulator
//
// Bridges per-game data (recorded as each game in a series completes) into
// the series-level engine input.  Persists in localStorage so a mid-series
// crash doesn't lose progress.
//
// Pattern mirrors mvpStorage's SeriesProgressStore.  At series-completion
// time the caller invokes `flushSeriesToSpiritEngine`, which loads the
// accumulated games, runs the engine, applies deltas, and clears the
// accumulator entry.
//
// FILE: app/draft-engine/playerSpiritAccumulator.ts
// ═══════════════════════════════════════════════════════════════════════════

import type { Role } from "@/app/types/champion";
import { players } from "@/app/data/players";
import {
  computeSeriesSpiritDeltas,
  type SpiritGameSnapshot,
  type SpiritSeriesContext,
} from "./playerSpiritEngine";
import {
  applySpiritDeltas,
  readSpiritStore,
  type SpiritDeltaInput,
} from "./playerSpiritStorage";

const SPIRIT_ACCUMULATOR_KEY = "rift-spirit-accumulator";

type AccumulatedSeriesEntry = {
  bo: 3 | 5;
  controlledTeamSlug: string;
  controlledRoster: Partial<Record<Role, string>>;
  games: SpiritGameSnapshot[];
};

type AccumulatorStore = Record<string, AccumulatedSeriesEntry>;

// ─── I/O ────────────────────────────────────────────────────────────────────

function getLocalStorageSafe(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
}

function readAccumulator(): AccumulatorStore {
  const storage = getLocalStorageSafe();
  if (!storage) return {};

  const raw = storage.getItem(SPIRIT_ACCUMULATOR_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed as AccumulatorStore : {};
  } catch {
    return {};
  }
}

function writeAccumulator(store: AccumulatorStore): void {
  const storage = getLocalStorageSafe();
  if (!storage) return;
  storage.setItem(SPIRIT_ACCUMULATOR_KEY, JSON.stringify(store));
}

function clearSeriesEntry(seriesId: string): void {
  const storage = getLocalStorageSafe();
  if (!storage) return;
  const store = readAccumulator();
  if (store[seriesId]) {
    delete store[seriesId];
    writeAccumulator(store);
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Append a single game's snapshot to the accumulator for this series.
 *
 * Caller (matchSimulator) only invokes this when the controlled team is
 * involved.  Otherwise spirit doesn't apply and there's nothing to record.
 *
 * If `bo` or `controlledTeamSlug` change between calls (shouldn't happen in
 * normal flow), the latest values overwrite the previous ones.
 */
export function appendGameToSpiritAccumulator(args: {
  seriesId: string;
  bo: 3 | 5;
  controlledTeamSlug: string;
  controlledRoster: Partial<Record<Role, string>>;
  snapshot: SpiritGameSnapshot;
}): void {
  if (!args.seriesId || !args.controlledTeamSlug) return;

  const store = readAccumulator();
  const existing = store[args.seriesId];

  const next: AccumulatedSeriesEntry = {
    bo: args.bo,
    controlledTeamSlug: args.controlledTeamSlug,
    controlledRoster: args.controlledRoster,
    games: existing
      ? [...existing.games.filter((g) => g.gameNumber !== args.snapshot.gameNumber), args.snapshot]
      : [args.snapshot],
  };

  // Keep games ordered by number for determinism.
  next.games.sort((a, b) => a.gameNumber - b.gameNumber);

  store[args.seriesId] = next;
  writeAccumulator(store);
}

/**
 * Flush the accumulator for a completed series:
 *   1. read accumulated games + current spirit state
 *   2. run the engine
 *   3. persist deltas via applySpiritDeltas
 *   4. clear the accumulator entry
 *
 * Safe to call even if the controlled team wasn't involved — it'll be a no-op.
 */
export function flushSeriesToSpiritEngine(args: {
  seriesId: string;
  seriesMvpPlayerId: string | null;
}): void {
  if (!args.seriesId) return;

  const accStore = readAccumulator();
  const entry = accStore[args.seriesId];
  if (!entry) return;
  if (!entry.controlledTeamSlug) {
    clearSeriesEntry(args.seriesId);
    return;
  }
  if (entry.games.length === 0) {
    clearSeriesEntry(args.seriesId);
    return;
  }

  const spiritStore = readSpiritStore();
  const playersById = new Map(players.map((p) => [p.id, p]));

  const ctx: SpiritSeriesContext = {
    seriesId:               args.seriesId,
    controlledTeamSlug:     entry.controlledTeamSlug,
    controlledRoster:       entry.controlledRoster,
    playersById,
    bo:                     entry.bo,
    games:                  entry.games,
    seriesMvpPlayerId:      args.seriesMvpPlayerId,
    currentSpirits:         spiritStore.spirits,
    currentStreaks:         spiritStore.streaks,
    leadershipCycleCounter: spiritStore.leadershipCycleCounter,
  };

  const deltaResults = computeSeriesSpiritDeltas(ctx);

  // Convert engine output to storage input.
  const inputs: SpiritDeltaInput[] = deltaResults
    .filter((r) => r.events.length > 0)   // skip players with zero events
    .map((r) => ({
      playerId:        r.playerId,
      events:          r.events,
      newSpiritValue:  r.newValue,
      newStreaks:      r.newStreaks,
    }));

  // Even if no events fired, the controlled team played a series so the
  // leadership cycle counter advances.
  applySpiritDeltas(inputs, true);

  clearSeriesEntry(args.seriesId);
}

/**
 * Discard any accumulated spirit progress for a series — used as a defensive
 * cleanup when starting a fresh series with the same id.
 */
export function discardSpiritAccumulatorForSeries(seriesId: string): void {
  clearSeriesEntry(seriesId);
}

/**
 * Wipe the entire accumulator — called from the new-game reset flow.
 */
export function resetSpiritAccumulator(): void {
  const storage = getLocalStorageSafe();
  if (!storage) return;
  storage.removeItem(SPIRIT_ACCUMULATOR_KEY);
}
