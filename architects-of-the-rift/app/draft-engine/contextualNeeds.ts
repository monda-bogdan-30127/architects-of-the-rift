// COMP_ATTRIBUTES_EXPANSION §3 — nevoi contextuale: nevoi care apar din compoziția ADVERSARULUI (ei au trei
// tancuri → ai nevoie de anti-tank; dacă n-au, nu). Nevoile fixe (`champion.needs`) rămân ce îi trebuie echipei
// unui campion; acestea depind de ce a draftat celălalt.
//
// Se activează de la `attributes.contextualMinEnemyPicks` pick-uri ale adversarului, pe pragurile din
// `attributes.thresholds` aplicate vectorului lor. Tot mecanismul stă în spatele `attributes.contextualNeedsEnabled`
// (oprit până se completează datele noilor atribute); testele îl pornesc cu `setContextualNeedsOverride`.

import { championsById } from "@/app/data/champions";
import type { Champion } from "@/app/types/champion";
import { COMP_ATTRIBUTE_INFO, type CompAttribute } from "@/app/types/compAttributes";
import { buildCompVector, getNeedRequirement } from "./draftEvaluator";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";

const ATTRS = DRAFT_THINKING_CONFIG.attributes;

export type ContextualNeedId = "vs-frontline" | "vs-cc" | "vs-poke" | "vs-sidelane";

export type ContextualNeed = {
  id: ContextualNeedId;
  priority: 1 | 2 | 3;
  /** Atributele care satisfac nevoia, cu ponderea lor. */
  accepts: Partial<Record<CompAttribute, number>>;
  /** Atributul principal (cel cu pondere 1): eticheta „Needs anti-tank”. */
  primary: CompAttribute;
  /** Ce răspunde nevoia, în engleză: „their frontline (3 tanks)”. */
  subject: string;
  /** Engleză, pentru raport / UI. */
  reason: string;
};

export type ContextualNeedStatus = ContextualNeed & { current: number; required: number; missing: number };

let override: boolean | null = null;

/** Doar pentru teste / calibrare: pornește sau oprește mecanismul peste config (null = config). */
export function setContextualNeedsOverride(enabled: boolean | null) {
  override = enabled;
  statusCache.clear();
}

export function isContextualNeedsEnabled(): boolean {
  return override ?? ATTRS.contextualNeedsEnabled;
}

const priorityFrom = (value: number, [low, high]: readonly number[], base: 1 | 2): 1 | 2 | 3 | null =>
  value >= high ? ((base + 1) as 2 | 3) : value >= low ? base : null;

function countWith(championIds: string[], attribute: CompAttribute, minStrength: number) {
  return championIds.filter((id) => (championsById[id]?.offers ?? []).some((offer) => offer.type === attribute && offer.strength >= minStrength)).length;
}

/** Nevoile pe care compoziția adversarului le creează (goală sub pragul de pick-uri sau cu mecanismul oprit). */
export function getContextualNeeds(enemyPicks: string[]): ContextualNeed[] {
  if (!isContextualNeedsEnabled() || enemyPicks.length < ATTRS.contextualMinEnemyPicks) return [];
  const vector = buildCompVector(enemyPicks) as unknown as Record<string, number>;
  const value = (...keys: string[]) => keys.reduce((sum, key) => sum + (vector[key] ?? 0), 0);
  const needs: ContextualNeed[] = [];

  const frontline = priorityFrom(value("frontline"), ATTRS.thresholds.frontline, 2);
  if (frontline) {
    const tanks = countWith(enemyPicks, "frontline", 3);
    const subject = `their frontline${tanks >= 2 ? ` (${tanks} tanks)` : ""}`;
    needs.push({ id: "vs-frontline", priority: frontline, accepts: { antiTank: 1, sustainedDamage: 0.5 }, primary: "antiTank", subject, reason: `Needs anti-tank into ${subject}` });
  }
  const cc = priorityFrom(value("engage", "reliableCC", "pick"), ATTRS.thresholds.cc, 1);
  if (cc) {
    const subject = "their engage and CC";
    needs.push({ id: "vs-cc", priority: cc, accepts: { antiCC: 1, disengage: 0.5 }, primary: "antiCC", subject, reason: `Needs anti-CC into ${subject}` });
  }
  const poke = priorityFrom(value("poke"), ATTRS.thresholds.poke, 1);
  if (poke) {
    const subject = "their poke";
    needs.push({ id: "vs-poke", priority: poke, accepts: { sustain: 1, engage: 0.7, dive: 0.7 }, primary: "sustain", subject, reason: `Needs sustain or engage into ${subject}` });
  }
  const sidelane = priorityFrom(value("splitpush", "sideLanePressure"), ATTRS.thresholds.sidelane, 1);
  if (sidelane) {
    const subject = "their side lanes";
    needs.push({ id: "vs-sidelane", priority: 1, accepts: { globalPressure: 1, waveclear: 0.5, sideLanePressure: 0.7 }, primary: "globalPressure", subject, reason: `Needs global pressure into ${subject}` });
  }
  return needs;
}

const statusCache = new Map<string, ContextualNeedStatus[]>();

/** Nevoile contextuale cu cât le acoperă deja compoziția noastră (suma ponderată a atributelor acceptate). */
export function evaluateContextualNeedStatuses(ownPicks: string[], enemyPicks: string[]): ContextualNeedStatus[] {
  if (!isContextualNeedsEnabled()) return [];
  const key = `${ownPicks.join(",")}|${enemyPicks.join(",")}`;
  const cached = statusCache.get(key);
  if (cached) return cached;
  const vector = buildCompVector(ownPicks) as unknown as Record<string, number>;
  const statuses = getContextualNeeds(enemyPicks).map((need) => {
    const current = Object.entries(need.accepts).reduce((sum, [attribute, weight]) => sum + (vector[attribute] ?? 0) * (weight ?? 0), 0);
    const required = getNeedRequirement(need.priority);
    return { ...need, current, required, missing: Math.max(0, required - current) };
  });
  if (statusCache.size > 2000) statusCache.clear();
  statusCache.set(key, statuses);
  return statuses;
}

/** Cât acoperă un campion dintr-o nevoie (suma ponderată a ofertelor lui acceptate). */
export function getContextualCover(champion: Champion | null | undefined, need: ContextualNeed): number {
  if (!champion) return 0;
  return (champion.offers ?? []).reduce((sum, offer) => sum + offer.strength * (need.accepts[offer.type] ?? 0), 0);
}

/** Atributul prin care campionul acoperă cel mai mult nevoia (pentru „Anti-tank: Vayne answers …”). */
export function getBestCoverAttribute(champion: Champion | null | undefined, need: ContextualNeed): CompAttribute | null {
  let best: CompAttribute | null = null;
  let bestValue = 0;
  for (const offer of champion?.offers ?? []) {
    const value = offer.strength * (need.accepts[offer.type] ?? 0);
    if (value > bestValue) {
      best = offer.type;
      bestValue = value;
    }
  }
  return best;
}

/** §3.3 — termenul de draft: cât din `missing` acoperă candidatul (ca `needFill`), 0..10. */
export function getContextualNeedFill(statuses: readonly ContextualNeedStatus[], candidate: Champion): { value: number; answered: ContextualNeedStatus | null } {
  let value = 0;
  let answered: ContextualNeedStatus | null = null;
  let answeredValue = 0;
  for (const status of statuses) {
    if (status.missing <= 0) continue;
    const covered = Math.min(status.missing, getContextualCover(candidate, status));
    value += covered * 1.6;
    if (covered > answeredValue) {
      answered = status;
      answeredValue = covered;
    }
  }
  return { value: Math.min(10, value), answered };
}

/** Eticheta scurtă a atributului principal: „anti-tank”. */
export function contextualNeedLabel(need: ContextualNeed): string {
  return COMP_ATTRIBUTE_INFO[need.primary].label.toLowerCase().replace("anti-cc", "anti-CC");
}
