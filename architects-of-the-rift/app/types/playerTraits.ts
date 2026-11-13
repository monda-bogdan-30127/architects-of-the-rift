// PLAYER_TRAITS — trăsături de jucător cu efect (înlocuiesc `displayTags`, care erau doar afișate).
// Cel mult 2 trait-uri din aceeași familie și cel mult 3 în total. Un trait nu ascunde informație: schimbă cât contează
// informația vizibilă (grade-uri, `resourceDemand`) pentru jucătorul respectiv.

import type { Role } from "./champion";

export const PLAYER_TRAIT_IDS = [
  // faza 1: Resources
  "resource_hog", "weakside_ready", "enabler",
  // faza 2: Draft & Series
  "blind_safe", "counter_specialist", "signature_player", "needs_setup", "self_sufficient",
  "series_adapter", "fast_starter", "matchup_resilient", "lane_dominator",
  // fazele 3–4 se adaugă când se implementează
] as const;
export type PlayerTraitId = (typeof PLAYER_TRAIT_IDS)[number];
export type PlayerTraitFamily = "resources" | "draft" | "macro" | "mental";

export type PlayerTrait = {
  id: PlayerTraitId;
  /** 1 = normal, 2 = puternic (multiplică efectele). */
  intensity: 1 | 2;
  /** De unde vine: setat manual sau derivat din stats. Doar pentru debug și pentru scriptul de inventar. */
  source: "manual" | "derived";
};

export const PLAYER_TRAIT_INFO: Record<
  PlayerTraitId,
  {
    family: PlayerTraitFamily;
    /** Engleză, pentru UI. */
    label: string;
    /** Engleză, o propoziție, pentru tooltip. */
    description: string;
    /** Trait-uri care nu pot sta împreună. */
    excludes: PlayerTraitId[];
    /** Rolurile pe care trait-ul poate exista (și manual, și derivat). Lipsă = toate. */
    roles?: Role[];
  }
> = {
  resource_hog: {
    family: "resources",
    label: "Resource Hog",
    description: "Wants gold, levels and jungle attention. Higher ceiling on carries, unhappy when starved.",
    excludes: ["weakside_ready", "enabler"],
    roles: ["top", "jungle", "mid", "adc"],
  },
  // „Weakside” e un concept de lane (partea pentru care junglerul nu joacă): doar top și botlane.
  weakside_ready: {
    family: "resources",
    label: "Weakside Ready",
    description: "Holds his lane alone with few resources and no jungle help.",
    excludes: ["resource_hog", "needs_setup"],
    roles: ["top", "adc"],
  },
  // Un jungler / mid cu puține resurse face setup pentru alții: aceleași efecte de resurse, fără efectul de lane.
  enabler: {
    family: "resources",
    label: "Enabler",
    description: "Happy on low-resource picks that set up others: tanks, engage, utility.",
    excludes: ["resource_hog", "needs_setup"],
    roles: ["jungle", "mid"],
  },

  // ─── Faza 2: Draft & Series (ordinea de pick, dependența de echipă, evoluția în serie, matchup-ul) ───
  blind_safe: {
    family: "draft",
    label: "Blind-Pick Safe",
    description: "Loses little when picking first in his lane.",
    excludes: ["counter_specialist"],
    roles: ["top", "mid", "adc", "support"],
  },
  counter_specialist: {
    family: "draft",
    label: "Counter-Pick Specialist",
    description: "Shines when he picks after his lane opponent, struggles when he has to blind.",
    excludes: ["blind_safe"],
    roles: ["top", "mid", "adc", "support"],
  },
  signature_player: {
    family: "draft",
    label: "Signature Player",
    description: "Elite on his very best champions, noticeably weaker off them.",
    excludes: [],
  },
  needs_setup: {
    family: "draft",
    label: "Needs Setup",
    description: "A carry who thrives when the team engages and peels for him, fades when left alone.",
    // „Are nevoie de echipă” contrazice „se descurcă singur pe weakside” / „face setup pentru alții”.
    excludes: ["self_sufficient", "weakside_ready", "enabler"],
    roles: ["top", "jungle", "mid", "adc"],
  },
  self_sufficient: {
    family: "draft",
    label: "Self-Sufficient",
    description: "Makes his own plays. Doesn't need engage or peel around him.",
    excludes: ["needs_setup"],
    roles: ["top", "jungle", "mid", "adc"],
  },
  series_adapter: {
    family: "draft",
    label: "Series Adapter",
    description: "Reads opponents fast: gets better from game to game in a series.",
    excludes: ["fast_starter"],
  },
  fast_starter: {
    family: "draft",
    label: "Fast Starter",
    description: "Hits hardest in game 1, opponents adjust to him as the series goes on.",
    excludes: ["series_adapter"],
  },
  matchup_resilient: {
    family: "draft",
    label: "Matchup Resilient",
    description: "Losing matchups hurt him much less.",
    excludes: ["lane_dominator"],
    roles: ["top", "mid", "adc", "support"],
  },
  lane_dominator: {
    family: "draft",
    label: "Lane Dominator",
    description: "Turns winning matchups into big leads.",
    excludes: ["matchup_resilient"],
    roles: ["top", "mid", "adc", "support"],
  },
};

/** Trait-ul poate exista pe rol? */
export const isTraitAllowedOnRole = (id: PlayerTraitId, role: Role) => !PLAYER_TRAIT_INFO[id].roles || PLAYER_TRAIT_INFO[id].roles!.includes(role);

/** Trait-urile care se bucură de resurse puține (aceleași efecte de resurse în draft, simulare, Spirit). */
export const LOW_RESOURCE_TRAITS: readonly PlayerTraitId[] = ["weakside_ready", "enabler"];

/** Cel mult atâtea trait-uri pe jucător și cel mult atâtea din aceeași familie (§1.1). */
export const MAX_PLAYER_TRAITS = 3;
export const MAX_TRAITS_PER_FAMILY = 2;

/**
 * §3 — se afișează (și au efect) doar trait-urile din familiile cu efecte implementate. Trait-urile celorlalte familii
 * se derivă și se păstrează pe jucător (pentru inventar), dar nu se văd și nu au efect.
 */
export const ACTIVE_TRAIT_FAMILIES: readonly PlayerTraitFamily[] = ["resources", "draft"];

/**
 * Trait-uri dintr-o familie activă ale căror efecte vin într-un commit ulterior (faza 2, commit 7): până atunci nu se
 * afișează și nu au efect, ca să nu repetăm etichetele fără efect.
 */
export const PENDING_TRAITS: readonly PlayerTraitId[] = [];

export const isActiveTraitId = (id: PlayerTraitId) => ACTIVE_TRAIT_FAMILIES.includes(PLAYER_TRAIT_INFO[id].family) && !PENDING_TRAITS.includes(id);
export const isActiveTrait = (trait: PlayerTrait) => isActiveTraitId(trait.id);
