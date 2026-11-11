// COMP_ATTRIBUTES_EXPANSION §2 — cererea de resurse a unui campion pe un rol (gold, XP, atenția junglerului).
// 5 hyper carry · 4 carry · 3 neutru · 2 weakside · 1 nu vrea resurse. Lipsa valorii = 3 (neutru): cu 3 peste
// tot, nimic din ce depinde de ea nu se activează.

import { championsById } from "@/app/data/champions";
import type { Role } from "@/app/types/champion";

export const NEUTRAL_RESOURCE_DEMAND = 3;

export function getResourceDemand(championId: string, role: Role | null | undefined): number {
  if (!role) return NEUTRAL_RESOURCE_DEMAND;
  return championsById[championId]?.roleData[role]?.resourceDemand ?? NEUTRAL_RESOURCE_DEMAND;
}
