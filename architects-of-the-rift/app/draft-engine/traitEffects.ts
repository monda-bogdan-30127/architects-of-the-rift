// PLAYER_TRAITS §7.4 (commit 7) — efectele de echipă și de serie ale trait-urilor Draft & Series:
//   needs_setup / self_sufficient: cât setup (engage, followUp, peel, reliableCC) îi dau ceilalți 4;
//   series_adapter / fast_starter: cum evoluează jucătorul de la un joc la altul într-o serie.

import { championsById } from "@/app/data/champions";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { getActiveTrait } from "@/app/utils/playerTraitUtils";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import type { ActiveDraftSeries, DraftGameState } from "./draftTypes";

const T = DRAFT_THINKING_CONFIG.traits;
export const SETUP_ATTRIBUTES = ["engage", "followUp", "peel", "reliableCC"];

/** Setup-ul unui campion: suma ofertelor engage / followUp / peel / reliableCC. */
export function championSetup(championId: string | null | undefined): number {
  const champion = championId ? championsById[championId] : undefined;
  return (champion?.offers ?? []).filter((offer) => SETUP_ATTRIBUTES.includes(String(offer.type))).reduce((sum, offer) => sum + offer.strength, 0);
}

/** Setup-ul echipei fără campionul jucătorului (ceilalți 4). */
export function teamSetupFor(picks: readonly (string | null | undefined)[], ownChampionId: string | null | undefined): number {
  return picks.filter((id) => id && id !== ownChampionId).reduce((sum, id) => sum + championSetup(id), 0);
}

export type SetupLevel = "low" | "high" | "normal";
export const setupLevel = (setup: number): SetupLevel => (setup <= T.setupLow ? "low" : setup >= T.setupHigh ? "high" : "normal");

/**
 * Rating: needs_setup cu setup ≥ setupHigh → + needsSetupHighBonus × intensity; ≤ setupLow → − needsSetupLowPenalty
 * × intensity. self_sufficient nu are niciun efect aici (doar nu pierde termenul condiționat din teamfight, vezi
 * `setupDependenceFactor`).
 */
export function getSetupRatingEffect(player: Player | null | undefined, setup: number): number {
  const needs = getActiveTrait(player, "needs_setup");
  if (!needs) return 0;
  const level = setupLevel(setup);
  return level === "high" ? T.needsSetupHighBonus * needs.intensity : level === "low" ? -T.needsSetupLowPenalty * needs.intensity : 0;
}

/**
 * Factorul termenului `setupDependence` din teamfight când e condiționat de setup (flag conditionalSetupTermEnabled):
 * 0 la setup ≤ setupLow, 1 la ≥ setupHigh, liniar între. Un self_sufficient păstrează termenul întreg.
 */
export function setupDependenceFactor(player: Player | null | undefined, setup: number): number {
  if (getActiveTrait(player, "self_sufficient")) return 1;
  return Math.max(0, Math.min(1, (setup - T.setupLow) / Math.max(1, T.setupHigh - T.setupLow)));
}

/**
 * Rating, evoluția în serie (toate seriile sunt fearless: campionii jucați nu mai pot fi aleși):
 *   series_adapter: + (seriesAdapterPerGame × intensity + seriesAdapterFearlessExtra) pe fiecare joc după primul, plafonat
 *     la seriesAdapterMax (fearless inclus);
 *   fast_starter: + fastStarterGame1 × intensity în game 1, 0 în game 2, − fastStarterLatePerGame × intensity pe joc de la
 *     game 3, plafonat la fastStarterLateMax (indiferent de intensity).
 * Un singur joc (fără serie) → 0.
 */
export function getSeriesRatingEffect(player: Player | null | undefined, gameNumber: number, bo: number): number {
  if (bo <= 1) return 0;
  const adapter = getActiveTrait(player, "series_adapter");
  if (adapter) {
    const games = Math.max(0, gameNumber - 1);
    return Math.min(T.seriesAdapterMax, games * (T.seriesAdapterPerGame * adapter.intensity + T.seriesAdapterFearlessExtra));
  }
  const starter = getActiveTrait(player, "fast_starter");
  if (starter) {
    if (gameNumber === 1) return T.fastStarterGame1 * starter.intensity;
    if (gameNumber === 2) return 0;
    return -Math.min(T.fastStarterLateMax, (gameNumber - 2) * T.fastStarterLatePerGame * starter.intensity);
  }
  return 0;
}

/**
 * series_adapter: a pierdut lane-ul în jocul anterior contra aceluiași jucător (scorul lui de lane sub al adversarului)?
 * Atunci termenul negativ de matchup din jocul curent se reduce (vezi laneEvaluator).
 */
export function lostLaneLastGameVs(series: ActiveDraftSeries, game: DraftGameState, playerId: string, opponentId: string | null): boolean {
  if (!opponentId) return false;
  const previous = series.games.find((entry) => entry.number === game.number - 1);
  const roles = previous?.simulation?.lane?.roles ?? [];
  for (const role of roles) {
    if (role.bluePlayerId === playerId && role.redPlayerId === opponentId) return role.blueScore < role.redScore;
    if (role.redPlayerId === playerId && role.bluePlayerId === opponentId) return role.redScore < role.blueScore;
  }
  return false;
}

/** Rolul pe care un jucător e în rosterul dat. */
export const roleOfPlayer = (roster: Partial<Record<Role, string>>, playerId: string) =>
  (Object.entries(roster) as [Role, string][]).find(([, id]) => id === playerId)?.[0] ?? null;
