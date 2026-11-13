// PLAYER_TRAITS §1.3 / §2 — trait-urile unui jucător (manual din `playerProfileOverrides`, altfel derivate din
// stats) și Team Fit (cum se potrivesc trait-urile celor 5 titulari).
//
// Notă: `players.ts` importă derivarea de aici, iar `computeTeamFit` citește `players` doar la apel (nu la încărcarea
// modulului), ca ciclul de import să nu conteze.

import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import type { Player, PlayerHiddenTraits, PlayerPlaystyleProfile } from "@/app/types/player";
import {
  ACTIVE_TRAIT_FAMILIES,
  LOW_RESOURCE_TRAITS,
  MAX_PLAYER_TRAITS,
  PLAYER_TRAIT_INFO,
  isTraitAllowedOnRole,
  type PlayerTrait,
  type PlayerTraitFamily,
  type PlayerTraitId,
} from "@/app/types/playerTraits";
import { DRAFT_THINKING_CONFIG } from "@/app/draft-engine/draftThinkingConfig";

/**
 * PLAYER_TRAITS §1.3 — derivarea familiei Resources, relativă la rol: pragurile absolute descriau rolul, nu
 * jucătorul (aproape toți ADC-ii erau Resource Hog, aproape toți junglerii Weakside Ready). Pentru fiecare rol se ia
 * percentila lui `carryResourceUsage` printre jucătorii de pe acel rol; la resource_hog, în plus, `greed ≥ 50`.
 * weakside_ready / enabler nu au filtru: `styleFlex` / `utilityComfort` sunt corelate cu cererea mică de resurse,
 * deci orice filtru pe ele îi tăia tocmai pe cei căutați.
 * `share` = fracția din rol peste (high) / sub (low) prag. Intensity 2: treimea de sus a celor care au primit
 * trait-ul pe rol, după cât de departe sunt de prag. resource_hog la jungle e doar manual: greed-ul mare al
 * junglerilor descrie stilul, nu cererea de gold.
 */
export const TRAIT_DERIVATION = {
  resource_hog: {
    direction: "high",
    share: { top: 0.2, mid: 0.3, adc: 0.35 } as Partial<Record<Role, number>>,
    filter: (source: TraitSource) => source.hiddenTraits.greed >= 50,
    filterLabel: "greed ≥ 50",
  },
  weakside_ready: {
    direction: "low",
    share: { top: 0.25, adc: 0.15 } as Partial<Record<Role, number>>,
    filter: () => true,
    filterLabel: "fără filtru",
  },
  enabler: {
    direction: "low",
    share: { jungle: 0.25, mid: 0.15 } as Partial<Record<Role, number>>,
    filter: () => true,
    filterLabel: "fără filtru",
  },
} as const;


/** Fracția celor cu trait-ul (pe rol) care primesc intensity 2. */
export const TRAIT_STRONG_SHARE = 1 / 3;

export type ManualTraitInput = { id: PlayerTraitId; intensity?: 1 | 2 };
export type TraitOverride = { traits?: ManualTraitInput[]; noDerivedTraits?: PlayerTraitId[] };

type TraitSource = { id: string; role: Role; playstyle: PlayerPlaystyleProfile; hiddenTraits: PlayerHiddenTraits };

/**
 * Trait-urile derivate pentru toată liga (playerId → trait-uri, cu scorul de derivare = distanța de prag).
 * Ținta pe rol (`share`) e totală: cota derivată = ținta − jucătorii setați manual cu trait-ul pe acel rol, iar
 * jucătorii cu un trait manual din aceeași familie nu mai intră în derivare.
 */
export function deriveLeagueTraits(
  sources: TraitSource[],
  manual: ReadonlyMap<string, readonly PlayerTraitId[]> = new Map(),
): Map<string, { trait: PlayerTrait; score: number }[]> {
  const result = new Map<string, { trait: PlayerTrait; score: number }[]>();
  for (const [id, rule] of Object.entries(TRAIT_DERIVATION) as [PlayerTraitId, (typeof TRAIT_DERIVATION)[keyof typeof TRAIT_DERIVATION]][]) {
    const family = PLAYER_TRAIT_INFO[id].family;
    for (const [role, share] of Object.entries(rule.share) as [Role, number][]) {
      const inRole = sources.filter((source) => source.role === role);
      const manualIds = (source: TraitSource) => manual.get(source.id) ?? [];
      const manualCount = inRole.filter((source) => manualIds(source).includes(id)).length;
      const quota = Math.max(0, Math.ceil(share * inRole.length) - manualCount);
      const ranked = inRole
        .filter((source) => !manualIds(source).some((other) => PLAYER_TRAIT_INFO[other]?.family === family))
        .sort((a, b) => (rule.direction === "high" ? b.playstyle.carryResourceUsage - a.playstyle.carryResourceUsage : a.playstyle.carryResourceUsage - b.playstyle.carryResourceUsage))
        .slice(0, quota);
      const threshold = ranked[ranked.length - 1]?.playstyle.carryResourceUsage ?? 0;
      const recipients = ranked
        .map((source) => ({ source, score: rule.direction === "high" ? source.playstyle.carryResourceUsage - threshold : threshold - source.playstyle.carryResourceUsage }))
        .filter((entry) => rule.filter(entry.source))
        .sort((a, b) => b.score - a.score);
      const strong = Math.ceil(recipients.length * TRAIT_STRONG_SHARE);
      recipients.forEach((entry, index) => {
        const list = result.get(entry.source.id) ?? [];
        list.push({ trait: { id, intensity: index < strong ? 2 : 1, source: "derived" }, score: entry.score });
        result.set(entry.source.id, list);
      });
    }
  }
  return result;
}

/**
 * Trait-urile finale: cele manuale întâi, apoi cele derivate (după scorul de derivare) care nu sunt blocate
 * (`noDerivedTraits`). Cel mult unul pe familie (până la faza 2), fără excluderi reciproce, doar pe rolurile permise,
 * cel mult MAX_PLAYER_TRAITS. Un trait manual pe un rol nepermis e ignorat aici și raportat de validare.
 */
export function resolvePlayerTraits(
  role: Role,
  derived: { trait: PlayerTrait; score: number }[],
  override?: TraitOverride,
): PlayerTrait[] {
  const result: PlayerTrait[] = [];
  const families = new Set<PlayerTraitFamily>();
  const add = (trait: PlayerTrait) => {
    const info = PLAYER_TRAIT_INFO[trait.id];
    if (!info || !isTraitAllowedOnRole(trait.id, role) || families.has(info.family) || result.length >= MAX_PLAYER_TRAITS) return;
    if (result.some((entry) => info.excludes.includes(entry.id) || PLAYER_TRAIT_INFO[entry.id].excludes.includes(trait.id))) return;
    families.add(info.family);
    result.push(trait);
  };
  for (const manual of override?.traits ?? []) add({ id: manual.id, intensity: manual.intensity ?? 1, source: "manual" });
  const blocked = new Set(override?.noDerivedTraits ?? []);
  const active = derived.filter((entry) => ACTIVE_TRAIT_FAMILIES.includes(PLAYER_TRAIT_INFO[entry.trait.id].family));
  for (const entry of [...active].sort((a, b) => b.score - a.score)) {
    if (!blocked.has(entry.trait.id)) add(entry.trait);
  }
  return result;
}

/** Atribuie trait-urile întregii ligi (după ce toți jucătorii există: pragurile sunt percentile pe rol). */
export function assignPlayerTraits(list: Player[], overrides: Record<string, TraitOverride | undefined>) {
  const manual = new Map(
    Object.entries(overrides).map(([playerId, override]) => [playerId, (override?.traits ?? []).map((entry) => entry.id)] as const),
  );
  const derived = deriveLeagueTraits(
    list.map((player) => ({ id: player.id, role: player.role, playstyle: player.advancedProfile.playstyle, hiddenTraits: player.advancedProfile.hiddenTraits })),
    manual,
  );
  for (const player of list) player.traits = resolvePlayerTraits(player.role, derived.get(player.id) ?? [], overrides[player.id]);
}

/** §1.1 — override-uri invalide: trait pe un rol nepermis, trait-uri care se exclud, id-uri necunoscute. */
export function validatePlayerTraitOverrides(
  list: Pick<Player, "id" | "role" | "name">[],
  overrides: Record<string, TraitOverride | undefined>,
): string[] {
  const errors: string[] = [];
  const byId = new Map(list.map((player) => [player.id, player]));
  for (const [playerId, override] of Object.entries(overrides)) {
    if (!override?.traits?.length && !override?.noDerivedTraits?.length) continue;
    const player = byId.get(playerId);
    if (!player) {
      errors.push(`${playerId}: override de trait-uri pentru un jucător inexistent`);
      continue;
    }
    const ids = override.traits?.map((entry) => entry.id) ?? [];
    for (const id of [...ids, ...(override.noDerivedTraits ?? [])]) {
      if (!PLAYER_TRAIT_INFO[id]) errors.push(`${playerId}: trait necunoscut "${id}"`);
    }
    for (const id of ids) {
      if (PLAYER_TRAIT_INFO[id] && !isTraitAllowedOnRole(id, player.role)) errors.push(`${playerId}: ${id} nu poate exista pe ${player.role}`);
      if (PLAYER_TRAIT_INFO[id]?.excludes.some((other) => ids.includes(other))) errors.push(`${playerId}: ${id} se exclude cu alt trait manual`);
    }
  }
  return errors;
}

export const hasTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  Boolean(player?.traits?.some((trait) => trait.id === id));

export const getTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  player?.traits?.find((trait) => trait.id === id) ?? null;

/** weakside_ready sau enabler (aceleași efecte de resurse): trait-ul jucătorului, dacă îl are. */
export const getLowResourceTrait = (player: Pick<Player, "traits"> | null | undefined) =>
  player?.traits?.find((trait) => LOW_RESOURCE_TRAITS.includes(trait.id)) ?? null;

// ─── §2 Team Fit ─────────────────────────────────────────────────────────────

export type TeamFit = {
  hogs: { playerId: string; role: Role }[];
  weakside: { playerId: string; role: Role }[];
  enablers: { playerId: string; role: Role }[];
  /** Engleză. */
  warnings: string[];
  /** Engleză, pozitive. */
  notes: string[];
};

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];

/** „Chovy and Ruler”, „A, B and C”. */
const joinNames = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0] ?? "");

export function computeTeamFit(roster: Partial<Record<Role, string>>, lookup?: (playerId: string) => Player | undefined): TeamFit {
  const find = lookup ?? ((playerId: string) => players.find((player) => player.id === playerId));
  const fit: TeamFit = { hogs: [], weakside: [], enablers: [], warnings: [], notes: [] };
  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const player = playerId ? find(playerId) : undefined;
    if (!playerId || !player) continue;
    if (hasTrait(player, "resource_hog")) fit.hogs.push({ playerId, role });
    if (hasTrait(player, "weakside_ready")) fit.weakside.push({ playerId, role });
    if (hasTrait(player, "enabler")) fit.enablers.push({ playerId, role });
  }
  const names = (list: { playerId: string }[]) => list.map((entry) => find(entry.playerId)?.name ?? entry.playerId);

  if (fit.hogs.length > DRAFT_THINKING_CONFIG.attributes.maxHighDemand) {
    fit.warnings.push(`${fit.hogs.length} players want resources (${names(fit.hogs).join(", ")})`);
  }
  if (fit.hogs.length === 2 && !fit.hogs.some((entry) => entry.role === "adc") && roster.adc && !fit.weakside.some((entry) => entry.role === "adc")) {
    fit.warnings.push("Two carries off bot lane: the ADC will be starved");
  }
  if (fit.hogs.length >= 1 && fit.weakside.length + fit.enablers.length >= 1) {
    const parts = [`${joinNames(names(fit.hogs))} ${fit.hogs.length > 1 ? "carry" : "carries"}`];
    if (fit.weakside.length) parts.push(`${joinNames(names(fit.weakside))} ${fit.weakside.length > 1 ? "play" : "plays"} weakside`);
    if (fit.enablers.length) parts.push(`${joinNames(names(fit.enablers))} ${fit.enablers.length > 1 ? "enable" : "enables"}`);
    fit.notes.push(`Clear resource split: ${parts.join(", ")}`);
  }
  if (fit.hogs.length === 0) fit.notes.push("No resource-hungry carry: flexible, but no obvious win condition");
  return fit;
}

// ─── §3 Colorarea pe draftul de campioni ─────────────────────────────────────

export type TraitTone = "good" | "bad" | "neutral";

/** Cum se potrivește trait-ul cu un campion de cererea dată (resource_hog: ≥ 4 verde, ≤ 2 roșu; low-resource: ≤ 2 verde). */
export function getTraitTone(id: PlayerTraitId, demand: number | null): TraitTone {
  if (demand === null) return "neutral";
  const { highDemandMin, weaksideMax } = DRAFT_THINKING_CONFIG.attributes;
  if (id === "resource_hog") return demand >= highDemandMin ? "good" : demand <= weaksideMax ? "bad" : "neutral";
  if (LOW_RESOURCE_TRAITS.includes(id)) return demand <= weaksideMax ? "good" : "neutral";
  return "neutral";
}

// ─── §3.1 Comunicarea (roster view, tooltip) ─────────────────────────────────

export type CommsLevel = "Poor" | "Average" | "Good" | "Elite";
export const COMMS_TOOLTIP = "How well he talks and coordinates with the team. Affects teamfights and clutch moments.";
/** Pragul de leadership de la care jucătorul e marcat „Leader” (ca LEADERSHIP_TRAIT_THRESHOLD din Spirit), până la trait-ul shotcaller. */
export const LEADER_THRESHOLD = 80;

/** `hiddenTraits.communication` ca nivel: < 45 Poor, 45–59 Average, 60–74 Good, ≥ 75 Elite. */
export function getCommsInfo(player: Pick<Player, "advancedProfile">): { level: CommsLevel; leader: boolean } {
  const communication = player.advancedProfile?.hiddenTraits?.communication ?? 50;
  const leadership = player.advancedProfile?.hiddenTraits?.leadership ?? 0;
  const level: CommsLevel = communication >= 75 ? "Elite" : communication >= 60 ? "Good" : communication >= 45 ? "Average" : "Poor";
  return { level, leader: leadership >= LEADER_THRESHOLD };
}
