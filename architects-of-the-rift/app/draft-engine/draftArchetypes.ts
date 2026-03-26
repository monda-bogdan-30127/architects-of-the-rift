import type { Champion } from "@/app/types/champion";

export type CarryArchetype =
  | "hard-protect"
  | "self-sufficient"
  | "dive-follow"
  | "lane-prio"
  | "balanced";

export type SupportArchetype =
  | "hard-engage"
  | "peel-enchant"
  | "roaming-playmaker"
  | "lane-enabler"
  | "balanced";

export const HARD_PROTECT_CARRY_IDS = new Set(["kogmaw", "jinx", "aphelios", "vayne", "yunara"]);
export const SELF_SUFFICIENT_CARRY_IDS = new Set(["ezreal", "corki", "xayah", "kaisa", "lucian", "varus", "zeri"]);
export const DIVE_FOLLOW_CARRY_IDS = new Set(["kaisa", "samira", "kalista", "tristana"]);
export const LANE_PRIO_CARRY_IDS = new Set(["varus", "caitlyn", "lucian", "ashe", "draven"]);

export const ROAMING_SUPPORT_IDS = new Set(["bard", "rakan", "pyke"]);
export const ENCHANT_SUPPORT_IDS = new Set(["lulu", "nami", "renata-glasc", "karma", "seraphine", "milio", "janna"]);
export const HARD_ENGAGE_SUPPORT_IDS = new Set(["nautilus", "leona", "rell", "alistar", "thresh"]);
export const LANE_ENABLE_SUPPORT_IDS = new Set(["karma", "lux", "zyra", "ashe", "neeko"]);

export function getCarryArchetype(championId: string | null | undefined): CarryArchetype {
  if (!championId) return "balanced";
  if (HARD_PROTECT_CARRY_IDS.has(championId)) return "hard-protect";
  if (SELF_SUFFICIENT_CARRY_IDS.has(championId)) return "self-sufficient";
  if (DIVE_FOLLOW_CARRY_IDS.has(championId)) return "dive-follow";
  if (LANE_PRIO_CARRY_IDS.has(championId)) return "lane-prio";
  return "balanced";
}

export function getSupportArchetype(championId: string | null | undefined): SupportArchetype {
  if (!championId) return "balanced";
  if (ENCHANT_SUPPORT_IDS.has(championId)) return "peel-enchant";
  if (ROAMING_SUPPORT_IDS.has(championId)) return "roaming-playmaker";
  if (HARD_ENGAGE_SUPPORT_IDS.has(championId)) return "hard-engage";
  if (LANE_ENABLE_SUPPORT_IDS.has(championId)) return "lane-enabler";
  return "balanced";
}

export function isLikelyCarry(champion: Champion | null) {
  if (!champion) return false;
  return champion.roles.includes("adc") || champion.roles.includes("mid");
}

export function isLikelySupport(champion: Champion | null) {
  if (!champion) return false;
  return champion.roles.includes("support");
}


export type CarrySelfProtectionProfile = {
  selfPeel: number;
  selfSave: number;
  mobilitySafety: number;
};

const DEFAULT_CARRY_PROFILE: CarrySelfProtectionProfile = {
  selfPeel: 1,
  selfSave: 0,
  mobilitySafety: 1,
};

export function getCarrySelfProtectionProfile(champion: Champion | string | null | undefined): CarrySelfProtectionProfile {
  if (!champion) return DEFAULT_CARRY_PROFILE;
  const championId = typeof champion === "string" ? champion : champion.id;
  const championData = typeof champion === "string" ? null : champion;
  const explicit = championData?.carryProfile;
  if (explicit) {
    return {
      selfPeel: explicit.selfPeel ?? DEFAULT_CARRY_PROFILE.selfPeel,
      selfSave: explicit.selfSave ?? DEFAULT_CARRY_PROFILE.selfSave,
      mobilitySafety: explicit.mobilitySafety ?? DEFAULT_CARRY_PROFILE.mobilitySafety,
    };
  }

  if (HARD_PROTECT_CARRY_IDS.has(championId)) return { selfPeel: 1, selfSave: 0, mobilitySafety: 0 };
  if (SELF_SUFFICIENT_CARRY_IDS.has(championId)) return { selfPeel: 2, selfSave: 2, mobilitySafety: 3 };
  if (DIVE_FOLLOW_CARRY_IDS.has(championId)) return { selfPeel: 2, selfSave: 1, mobilitySafety: 2 };
  if (LANE_PRIO_CARRY_IDS.has(championId)) return { selfPeel: 1, selfSave: 0, mobilitySafety: 1 };
  return DEFAULT_CARRY_PROFILE;
}

export function getCarrySelfProtectionScore(champion: Champion | string | null | undefined) {
  const profile = getCarrySelfProtectionProfile(champion);
  return profile.selfPeel * 0.34 + profile.selfSave * 0.38 + profile.mobilitySafety * 0.28;
}

export function isHighSelfProtectionCarry(champion: Champion | string | null | undefined) {
  return getCarrySelfProtectionScore(champion) >= 3.2;
}
