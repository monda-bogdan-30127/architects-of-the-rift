// PLAYER_TRAITS §1.3 / §2 — trait-urile unui jucător (manual din `playerProfileOverrides`, altfel derivate din
// stats) și Team Fit (cum se potrivesc trait-urile celor 5 titulari).
//
// Notă: `players.ts` importă derivarea de aici, iar `computeTeamFit` citește `players` doar la apel (nu la încărcarea
// modulului), ca ciclul de import să nu conteze.

import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import type { Player, PlayerHiddenTraits, PlayerPlaystyleProfile } from "@/app/types/player";
import {
  MAX_PLAYER_TRAITS,
  PLAYER_TRAIT_INFO,
  type PlayerTrait,
  type PlayerTraitFamily,
  type PlayerTraitId,
} from "@/app/types/playerTraits";
import { DRAFT_THINKING_CONFIG } from "@/app/draft-engine/draftThinkingConfig";

/**
 * Pragurile de derivare (§1.3). Ținta: resource_hog ~20–30% din non-support, weakside_ready ~15–25% din top / jungle / adc.
 * Calibrate cu scripts/trait-inventory.ts: pragurile de pornire din spec (72 / 60, 48 / 55) dădeau 6% și 7%
 * (greed are p90 = 61, deci „greed ≥ 72” pentru intensity 2 nu apărea niciodată).
 */
export const TRAIT_DERIVATION = {
  resourceHog: { minCarryUsage: 70, minGreed: 52, strongCarryUsage: 84, strongGreed: 56 },
  weaksideReady: { roles: ["top", "jungle", "adc"] as readonly Role[], maxCarryUsage: 55, minStyleFlex: 55, strongCarryUsage: 48 },
} as const;

export type ManualTraitInput = { id: PlayerTraitId; intensity?: 1 | 2 };

type TraitSource = { role: Role; playstyle: PlayerPlaystyleProfile; hiddenTraits: PlayerHiddenTraits };

/** Trait-urile derivate din stats (fallback, doar pe familiile fără trait manual). */
export function derivePlayerTraits({ role, playstyle, hiddenTraits }: TraitSource): PlayerTrait[] {
  const traits: PlayerTrait[] = [];
  const hog = TRAIT_DERIVATION.resourceHog;
  const weak = TRAIT_DERIVATION.weaksideReady;
  const carry = playstyle.carryResourceUsage;
  if (role !== "support" && carry >= hog.minCarryUsage && hiddenTraits.greed >= hog.minGreed) {
    traits.push({ id: "resource_hog", intensity: carry >= hog.strongCarryUsage && hiddenTraits.greed >= hog.strongGreed ? 2 : 1, source: "derived" });
  } else if (weak.roles.includes(role) && carry <= weak.maxCarryUsage && playstyle.styleFlex >= weak.minStyleFlex) {
    traits.push({ id: "weakside_ready", intensity: carry <= weak.strongCarryUsage ? 2 : 1, source: "derived" });
  }
  return traits;
}

/**
 * Trait-urile finale: cele manuale întâi (cel mult unul pe familie), apoi cele derivate pe familiile fără trait
 * manual și neblocate (`noDerivedTraits`). Fără excluderi reciproce, cel mult MAX_PLAYER_TRAITS.
 */
export function resolvePlayerTraits(
  source: TraitSource,
  override?: { traits?: ManualTraitInput[]; noDerivedTraits?: PlayerTraitFamily[] },
): PlayerTrait[] {
  const result: PlayerTrait[] = [];
  const families = new Set<PlayerTraitFamily>();
  const add = (trait: PlayerTrait) => {
    const info = PLAYER_TRAIT_INFO[trait.id];
    if (!info || families.has(info.family) || result.length >= MAX_PLAYER_TRAITS) return;
    if (result.some((entry) => info.excludes.includes(entry.id) || PLAYER_TRAIT_INFO[entry.id].excludes.includes(trait.id))) return;
    families.add(info.family);
    result.push(trait);
  };
  for (const manual of override?.traits ?? []) add({ id: manual.id, intensity: manual.intensity ?? 1, source: "manual" });
  const blocked = new Set(override?.noDerivedTraits ?? []);
  for (const derived of derivePlayerTraits(source)) {
    if (!blocked.has(PLAYER_TRAIT_INFO[derived.id].family)) add(derived);
  }
  return result;
}

export const hasTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  Boolean(player?.traits?.some((trait) => trait.id === id));

export const getTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  player?.traits?.find((trait) => trait.id === id) ?? null;

// ─── §2 Team Fit ─────────────────────────────────────────────────────────────

export type TeamFit = {
  hogs: { playerId: string; role: Role }[];
  weakside: { playerId: string; role: Role }[];
  /** Engleză. */
  warnings: string[];
  /** Engleză, pozitive. */
  notes: string[];
};

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];

export function computeTeamFit(roster: Partial<Record<Role, string>>, lookup?: (playerId: string) => Player | undefined): TeamFit {
  const find = lookup ?? ((playerId: string) => players.find((player) => player.id === playerId));
  const fit: TeamFit = { hogs: [], weakside: [], warnings: [], notes: [] };
  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const player = playerId ? find(playerId) : undefined;
    if (!playerId || !player) continue;
    if (hasTrait(player, "resource_hog")) fit.hogs.push({ playerId, role });
    if (hasTrait(player, "weakside_ready")) fit.weakside.push({ playerId, role });
  }
  const name = (playerId: string) => find(playerId)?.name ?? playerId;
  const names = (list: { playerId: string }[]) => list.map((entry) => name(entry.playerId)).join(", ");

  if (fit.hogs.length > DRAFT_THINKING_CONFIG.attributes.maxHighDemand) {
    fit.warnings.push(`${fit.hogs.length} players want resources (${names(fit.hogs)})`);
  }
  const adcId = roster.adc;
  if (fit.hogs.length === 2 && !fit.hogs.some((entry) => entry.role === "adc") && adcId && !fit.weakside.some((entry) => entry.role === "adc")) {
    fit.warnings.push("Two carries off bot lane: the ADC will be starved");
  }
  const split = fit.weakside.filter((entry) => !fit.hogs.some((hog) => hog.role === entry.role));
  if (fit.hogs.length >= 1 && split.length >= 1) {
    fit.notes.push(`Clear resource split: ${names(fit.hogs)} ${fit.hogs.length > 1 ? "carry" : "carries"}, ${names(split)} ${split.length > 1 ? "play" : "plays"} weakside`);
  }
  if (fit.hogs.length === 0) fit.notes.push("No resource-hungry carry: flexible, but no obvious win condition");
  return fit;
}
