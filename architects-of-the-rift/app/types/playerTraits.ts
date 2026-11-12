// PLAYER_TRAITS — trăsături de jucător cu efect (înlocuiesc `displayTags`, care erau doar afișate).
// Cel mult un trait pe familie și cel mult 3 în total. Un trait nu ascunde informație: schimbă cât contează
// informația vizibilă (grade-uri, `resourceDemand`) pentru jucătorul respectiv.

export const PLAYER_TRAIT_IDS = ["resource_hog", "weakside_ready"] as const; // se extinde pe familii
export type PlayerTraitId = (typeof PLAYER_TRAIT_IDS)[number];
export type PlayerTraitFamily = "resources" | "macro" | "draft" | "mental";

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
  }
> = {
  resource_hog: {
    family: "resources",
    label: "Resource Hog",
    description: "Wants gold, levels and jungle attention. Higher ceiling on carries, unhappy when starved.",
    excludes: ["weakside_ready"],
  },
  weakside_ready: {
    family: "resources",
    label: "Weakside Ready",
    description: "Plays well with few resources and no jungle help. Happy to enable others.",
    excludes: ["resource_hog"],
  },
};

/** Cel mult atâtea trait-uri pe jucător. */
export const MAX_PLAYER_TRAITS = 3;

/** §3 — se afișează doar trait-urile din familiile cu efecte implementate. */
export const ACTIVE_TRAIT_FAMILIES: readonly PlayerTraitFamily[] = ["resources"];

export const isActiveTrait = (trait: PlayerTrait) => ACTIVE_TRAIT_FAMILIES.includes(PLAYER_TRAIT_INFO[trait.id].family);
