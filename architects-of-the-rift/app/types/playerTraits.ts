// PLAYER_TRAITS — trăsături de jucător cu efect (înlocuiesc `displayTags`, care erau doar afișate).
// Cel mult un trait pe familie și cel mult 3 în total. Un trait nu ascunde informație: schimbă cât contează
// informația vizibilă (grade-uri, `resourceDemand`) pentru jucătorul respectiv.

import type { Role } from "./champion";

export const PLAYER_TRAIT_IDS = [
  // faza 1
  "resource_hog", "weakside_ready", "enabler",
  // fazele 2–4 se adaugă când se implementează
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
    excludes: ["resource_hog"],
    roles: ["top", "adc"],
  },
  // Un jungler / mid cu puține resurse face setup pentru alții: aceleași efecte de resurse, fără efectul de lane.
  enabler: {
    family: "resources",
    label: "Enabler",
    description: "Happy on low-resource picks that set up others: tanks, engage, utility.",
    excludes: ["resource_hog"],
    roles: ["jungle", "mid"],
  },
};

/** Trait-ul poate exista pe rol? */
export const isTraitAllowedOnRole = (id: PlayerTraitId, role: Role) => !PLAYER_TRAIT_INFO[id].roles || PLAYER_TRAIT_INFO[id].roles!.includes(role);

/** Trait-urile care se bucură de resurse puține (aceleași efecte de resurse în draft, simulare, Spirit). */
export const LOW_RESOURCE_TRAITS: readonly PlayerTraitId[] = ["weakside_ready", "enabler"];

/** Cel mult atâtea trait-uri pe jucător. */
export const MAX_PLAYER_TRAITS = 3;

/** §3 — se afișează doar trait-urile din familiile cu efecte implementate. */
export const ACTIVE_TRAIT_FAMILIES: readonly PlayerTraitFamily[] = ["resources"];

export const isActiveTrait = (trait: PlayerTrait) => ACTIVE_TRAIT_FAMILIES.includes(PLAYER_TRAIT_INFO[trait.id].family);
