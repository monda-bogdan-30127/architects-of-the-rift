// FRONTLINE_SIDELANE_NEEDS §1.2 — frontline-ul efectiv al unei echipe: tancurile (offer ≥ tankMinStrength) contează
// întreg, bruiserii (sub prag) × bruiserFactor. Doi bruiseri cu 2 + 2 = 3,2 (~2/3 dintr-un tank cu 5), doi cu 3 + 3 = 4,8.
// Modul separat (re-exportat din draftEvaluator), pentru că teamfightSystem îl folosește, iar draftEvaluator
// importă teamfightSystem: așa nu apare un import circular.

import { championsById } from "@/app/data/champions";
import type { Role } from "@/app/types/champion";
import { getOffers, roleIn } from "./championRoleAttributes";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";

/** `durability` e alias pentru `frontline` (ATTRIBUTE_ALIASES din draftEvaluator). */
const FRONTLINE_TYPES = new Set(["frontline", "durability"]);

/** Contribuția unui campion: suma ofertelor frontline, tancurile întregi, bruiserii × bruiserFactor. */
export function getChampionEffectiveFrontline(championId: string, role: Role | null = null): number {
  const { bruiserFactor, tankMinStrength } = DRAFT_THINKING_CONFIG.frontline;
  const champion = championsById[championId];
  let total = 0;
  for (const offer of champion ? getOffers(champion, role) : []) {
    if (!FRONTLINE_TYPES.has(String(offer.type))) continue;
    total += offer.strength >= tankMinStrength ? offer.strength : offer.strength * bruiserFactor;
  }
  return total;
}

/** `assignments` (rol → campion, opțional): override-urile pe rol (§3.2); fără, listele globale. */
export function getEffectiveFrontline(championIds: string[], assignments?: Partial<Record<Role, string>>): number {
  return championIds.reduce((sum, id) => sum + getChampionEffectiveFrontline(id, roleIn(assignments, id)), 0);
}

/** „Echipa are frontline”: în locul tag-ului `frontline` (offer ≥ 3) folosit ca prezență la nivel de echipă. */
export function hasTeamFrontline(championIds: string[], assignments?: Partial<Record<Role, string>>): boolean {
  return getEffectiveFrontline(championIds, assignments) >= DRAFT_THINKING_CONFIG.frontline.teamPresenceMin;
}
