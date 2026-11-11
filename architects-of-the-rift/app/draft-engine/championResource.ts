// COMP_ATTRIBUTES_EXPANSION §2 — cererea de resurse a unui campion pe un rol (gold, XP, atenția junglerului).
// 5 hyper carry · 4 carry · 3 neutru · 2 weakside · 1 nu vrea resurse. Lipsa valorii = 3 (neutru): cu 3 peste
// tot, nimic din ce depinde de ea nu se activează.

import { championsById } from "@/app/data/champions";
import type { Role } from "@/app/types/champion";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { ROLE_ORDER } from "./draftTypes";

export const NEUTRAL_RESOURCE_DEMAND = 3;

export function getResourceDemand(championId: string, role: Role | null | undefined): number {
  if (!role) return NEUTRAL_RESOURCE_DEMAND;
  return championsById[championId]?.roleData[role]?.resourceDemand ?? NEUTRAL_RESOURCE_DEMAND;
}

const ATTRS = DRAFT_THINKING_CONFIG.attributes;

/** Carry-urile care vor gold (cerere ≥ highDemandMin) dintr-o compoziție (rol → campion), în ordinea rolurilor. */
export function getHighDemandPicks(assignments: Partial<Record<Role, string>>): { championId: string; role: Role }[] {
  return ROLE_ORDER.flatMap((role) => {
    const championId = assignments[role];
    return championId && getResourceDemand(championId, role) >= ATTRS.highDemandMin ? [{ championId, role }] : [];
  });
}

/** Câte carry-uri sunt peste `maxHighDemand` (0 = fără conflict). */
export function getResourceConflictExcess(assignments: Partial<Record<Role, string>>): number {
  return Math.max(0, getHighDemandPicks(assignments).length - ATTRS.maxHighDemand);
}

/** §2.2 — „Resource conflict: 3 carries want gold (Jayce, Azir, Kalista)”. */
export function describeResourceConflict(picks: { championId: string }[]): string {
  const names = picks.map((entry) => championsById[entry.championId]?.name ?? entry.championId);
  return `Resource conflict: ${picks.length} carries want gold (${names.join(", ")})`;
}
