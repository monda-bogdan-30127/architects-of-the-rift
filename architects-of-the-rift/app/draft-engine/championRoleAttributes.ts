// FRONTLINE_SIDELANE_NEEDS §3.2 — offers / needs / weaknesses pe rol. `roleData[rol].offers` (etc.), dacă există,
// înlocuiesc lista globală pe acel rol; fără rol sau fără override, lista globală.
//
// Cache: doar „are rolul override pentru lista asta?” (structura datelor e statică). Lista se citește mereu din
// obiect, nu se ține o referință: scenariile înlocuiesc temporar `champion.offers` și trebuie să vadă lista nouă.

import type { Champion, ChampionNeed, ChampionOffer, ChampionWeakness, Role } from "@/app/types/champion";

type AttributeKey = "offers" | "needs" | "weaknesses";
type AttributeList<K extends AttributeKey> = K extends "offers" ? ChampionOffer[] : K extends "needs" ? ChampionNeed[] : ChampionWeakness[];

const hasOverride = new Map<string, boolean>();

function resolve<K extends AttributeKey>(champion: Champion, role: Role | null | undefined, key: K): AttributeList<K> {
  if (role) {
    const cacheKey = `${champion.id}:${role}:${key}`;
    let overridden = hasOverride.get(cacheKey);
    if (overridden === undefined) {
      overridden = Boolean(champion.roleData?.[role]?.[key]);
      hasOverride.set(cacheKey, overridden);
    }
    if (overridden) return champion.roleData[role]![key] as AttributeList<K>;
  }
  return champion[key] as AttributeList<K>;
}

export const getOffers = (champion: Champion, role?: Role | null): ChampionOffer[] => resolve(champion, role, "offers");
export const getNeeds = (champion: Champion, role?: Role | null): ChampionNeed[] => resolve(champion, role, "needs");
export const getWeaknesses = (champion: Champion, role?: Role | null): ChampionWeakness[] => resolve(champion, role, "weaknesses");

/** Rolul unui campion într-o asignare rol → campion (null dacă nu e asignat). */
export function roleIn(assignments: Partial<Record<Role, string>> | null | undefined, championId: string): Role | null {
  if (!assignments) return null;
  for (const [role, id] of Object.entries(assignments) as [Role, string | undefined][]) if (id === championId) return role;
  return null;
}
