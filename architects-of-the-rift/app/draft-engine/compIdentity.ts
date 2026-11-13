// Identitatea compoziției — o singură sursă (DRAFT_THINKING §3).
//
// Înlocuiește cele cinci clasificatoare de dinainte (planul AI, coerența win
// condition-ului, identitatea finală din evaluator, planul dedus al userului și
// tag-urile hardcodate din advancedDraftReading). Semnalele combină `offers`
// (vectorul de compoziție, aceleași seturi ca vechiul `inferCompIdentity`) cu
// tag-urile din profilul pe rol, într-o singură tabelă.

import type { Champion, Role } from "@/app/types/champion";
import { getChampionRoleProfile } from "./championProfileSystem";
import { getCarryArchetype } from "./draftArchetypes";
import { buildCompVector, getChampionById } from "./draftEvaluator";
import { resolveRoleAssignments } from "./draftRoleResolver";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { ROLE_ORDER } from "./draftTypes";

export type CompIdentity = "dive" | "poke" | "pick" | "front-to-back" | "teamfight" | "protect-carry";

export const COMP_IDENTITIES: readonly CompIdentity[] = ["dive", "poke", "pick", "front-to-back", "teamfight", "protect-carry"];

export type CompIdentityReading = {
  /** 0..10, normalizat la o compoziție de 5. */
  signals: Record<CompIdentity, number>;
  /** null = încă neclar („balanced”). */
  dominant: CompIdentity | null;
  /** 0..1 — cât de clar e dominantul. */
  strength: number;
  runnerUp: CompIdentity | null;
  /** Două identități incompatibile, aproape egale (§5.2). */
  split: boolean;
};

type IdentityDefinition = {
  /** Atribute din vectorul de compoziție (`offers`, cu `strength`). */
  offers: string[];
  /** Tag-uri din profilul pe rol: +1 fiecare la fit, `tagWeight` la semnal. */
  desired: string[];
  /** Tag-uri care trag în sens opus. */
  avoid: string[];
};

/** Tabela unică: vechile `PLAN_DESIRED_TAGS` / `PLAN_AVOID_TAGS`, seturile din coerență și atributele din evaluator. */
const IDENTITY_TABLE: Record<CompIdentity, IdentityDefinition> = {
  "dive": {
    offers: ["dive", "backlineAccess", "engage", "roamPressure"],
    desired: ["dive", "engage", "follow-up", "burst", "backlineAccess"],
    avoid: ["poke", "warden"],
  },
  "poke": {
    offers: ["poke", "siege", "waveclear"],
    desired: ["poke", "zone-control", "disengage", "waveclear", "ranged"],
    avoid: ["dive", "melee"],
  },
  "pick": {
    offers: ["pick", "reliableCC", "roamPressure", "burstDamage"],
    desired: ["pick", "burst", "reliableCC", "roamPressure"],
    avoid: ["warden"],
  },
  "front-to-back": {
    offers: ["frontline", "peel", "disengage"],
    desired: ["frontline", "peel", "dps", "sustainedDamage", "warden"],
    avoid: ["dive", "burst"],
  },
  "teamfight": {
    offers: ["engage", "followUp", "frontline", "peel"],
    desired: ["engage", "follow-up", "frontline", "peel", "dps"],
    avoid: [],
  },
  "protect-carry": {
    offers: ["peel", "antiDive", "disengage"],
    desired: ["peel", "warden", "enchanter", "frontline", "dps", "anti-dive"],
    avoid: ["dive", "poke"],
  },
};

const CONFIG = DRAFT_THINKING_CONFIG.identity;

export function getIdentityTags(identity: CompIdentity): { desired: string[]; avoid: string[] } {
  const { desired, avoid } = IDENTITY_TABLE[identity];
  return { desired: [...desired], avoid: [...avoid] };
}

/** Atributele din `offers` care definesc identitatea (pentru departajări continue, ex. win condition). */
export function getIdentityOffers(identity: CompIdentity): readonly string[] {
  return IDENTITY_TABLE[identity].offers;
}

function profileTags(champion: Champion, role: Role | null): Set<string> {
  const profile = role ? getChampionRoleProfile(champion, role) : getChampionRoleProfile(champion);
  return new Set(profile?.tags ?? []);
}

function tagScore(tags: Set<string>, identity: CompIdentity): number {
  const { desired, avoid } = IDENTITY_TABLE[identity];
  let score = 0;
  for (const tag of desired) if (tags.has(tag)) score += 1;
  for (const tag of avoid) if (tags.has(tag)) score -= CONFIG.avoidTagWeight;
  return score;
}

/**
 * Cât de bine se potrivește un campion (pe rol) cu o identitate: −3..+3.
 * Tag-urile dorite +1, cele evitate −1.2 (ca vechiul `scoreChampionForPlan`),
 * plus `offers` din identitate × `fitOfferWeight` (0 acum: doar tag-uri).
 */
export function getCandidateIdentityFit(candidate: Champion, role: Role | null, identity: CompIdentity): number {
  const tags = profileTags(candidate, role);
  let score = tagScore(tags, identity);
  const offers = IDENTITY_TABLE[identity].offers;
  for (const offer of candidate.offers ?? []) {
    if (offers.includes(String(offer.type))) score += offer.strength * CONFIG.fitOfferWeight;
  }
  if (identity === "protect-carry" && getCarryArchetype(candidate.id) === "hard-protect") score += 1;
  return Math.max(-3, Math.min(3, score));
}

/** Perechile de identități incompatibile (§5.2). */
function isIncompatible(a: CompIdentity, b: CompIdentity): boolean {
  return DRAFT_THINKING_CONFIG.cohesion.incompatiblePairs.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
}

/** Perechile de identități compatibile (FEEDBACK_FIXES §5.2): se întăresc reciproc. */
export function isCompatible(a: CompIdentity, b: CompIdentity): boolean {
  return DRAFT_THINKING_CONFIG.cohesion.compatiblePairs.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
}

const vectorValue = (vector: Record<string, number>, key: string) => vector[key] ?? 0;

/**
 * Identitatea compoziției din pick-uri (și rolurile lor, dacă se știu).
 * Semnal = (Σ offers din identitate + tagWeight × Σ fit de tag-uri) × 5 / nr. pick-uri / signalScale.
 */
export function readCompIdentity(championIds: string[], roles?: Partial<Record<Role, string>>): CompIdentityReading {
  const ids = championIds.filter(Boolean);
  const empty = Object.fromEntries(COMP_IDENTITIES.map((identity) => [identity, 0])) as Record<CompIdentity, number>;
  if (!ids.length) return { signals: empty, dominant: null, strength: 0, runnerUp: null, split: false };

  const assignments = roles ?? resolveRoleAssignments(ids, {});
  const roleOf = new Map<string, Role>();
  for (const role of ROLE_ORDER) if (assignments[role]) roleOf.set(assignments[role]!, role);

  const vector = buildCompVector(ids) as unknown as Record<string, number>;
  const champions = ids.map((id) => getChampionById(id)).filter((champion): champion is Champion => Boolean(champion));
  const tagSets = champions.map((champion) => profileTags(champion, roleOf.get(champion.id) ?? null));
  const hasHardProtectCarry = champions.some((champion) => getCarryArchetype(champion.id) === "hard-protect");

  const signals = { ...empty };
  for (const identity of COMP_IDENTITIES) {
    let raw = IDENTITY_TABLE[identity].offers.reduce((sum, key) => sum + vectorValue(vector, key), 0);
    raw += CONFIG.tagWeight * tagSets.reduce((sum, tags) => sum + tagScore(tags, identity), 0);
    if (identity === "protect-carry" && hasHardProtectCarry) raw += CONFIG.hardProtectCarryBonus;
    signals[identity] = Math.max(0, Math.min(10, (raw * 5) / ids.length / CONFIG.signalScale));
  }

  const ranked = [...COMP_IDENTITIES].sort((a, b) => signals[b] - signals[a]);
  const [first, second] = ranked;
  const top = signals[first];
  const runner = signals[second];
  const dominant = top >= CONFIG.threshold ? first : null;
  // FEEDBACK_FIXES §5.2: identitățile compatibile se întăresc, nu se diluează. `clarity` se măsoară
  // doar față de cea mai puternică identitate necompatibilă (sau neînrudită) cu dominantul.
  const maxNonCompatible = Math.max(
    0,
    ...ranked.filter((identity) => identity !== first && !isCompatible(first, identity)).map((identity) => signals[identity]),
  );
  const clarity = top > 0 ? 1 - maxNonCompatible / top : 0;
  const compatibleRunnerBonus =
    runner >= CONFIG.threshold && isCompatible(first, second) ? CONFIG.compatibleRunnerBonus : 0;
  const strength = Math.max(
    0,
    Math.min(1, (top / CONFIG.fullStrengthSignal) * (CONFIG.strengthBase + (1 - CONFIG.strengthBase) * clarity) + compatibleRunnerBonus),
  );
  const split =
    dominant !== null &&
    runner >= CONFIG.threshold &&
    runner >= DRAFT_THINKING_CONFIG.cohesion.splitRatio * top &&
    isIncompatible(first, second);

  return { signals, dominant, strength, runnerUp: runner > 0 ? second : null, split };
}

/**
 * Matricea comp vs comp (§6.1): valoare pozitivă = rândul o bate pe coloană (−1..+1).
 * Completată simetric: dacă A bate B cu x, B pierde cu −x.
 */
const COMP_COUNTER_BASE: Record<CompIdentity, Partial<Record<CompIdentity, number>>> = {
  "dive":          { "poke": 1.0, "front-to-back": 0.3, "protect-carry": -0.8 },
  "poke":          { "front-to-back": 0.8, "teamfight": 0.5, "dive": -1.0 },
  "pick":          { "poke": 0.6, "protect-carry": 0.4, "front-to-back": -0.5 },
  "front-to-back": { "pick": 0.5, "dive": -0.3, "poke": -0.8 },
  "teamfight":     { "pick": 0.5, "poke": -0.5 },
  "protect-carry": { "dive": 0.8, "pick": -0.4 },
};

export const COMP_COUNTER_MATRIX: Record<CompIdentity, Record<CompIdentity, number>> = (() => {
  const matrix = Object.fromEntries(
    COMP_IDENTITIES.map((row) => [row, Object.fromEntries(COMP_IDENTITIES.map((col) => [col, 0]))]),
  ) as Record<CompIdentity, Record<CompIdentity, number>>;
  for (const row of COMP_IDENTITIES) {
    for (const [col, value] of Object.entries(COMP_COUNTER_BASE[row]) as [CompIdentity, number][]) {
      matrix[row][col] = value;
      if (!COMP_COUNTER_BASE[col]?.[row]) matrix[col][row] = -value;
    }
  }
  return matrix;
})();
