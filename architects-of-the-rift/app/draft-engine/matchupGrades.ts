// Matchup-uri: `level` (cât de tare) + `phase` (când) — sursa unică de adevăr
// (MATCHUP_LEVEL_PHASE.md; înlocuiește scala 1–5 din DRAFT_REWORK §1).
//
//   level 3 = hard counter (mereu), 2 = counter (adversarul se poate juca dacă
//   echipa îi acoperă slăbiciunile), 1 = skill matchup (decide jucătorul)
//   phase "lane" = avantaj în lane phase, "late" = din mid game încolo, "all" = tot jocul
// Simetrie: `A weakVs B {level, phase}` ⇔ `B goodVs A {level, phase}`.
//
// Fișierul conține doar definiții și factori puri. Combinarea lor într-o
// valoare numerică pentru draft / simulare se face într-un singur loc:
// `matchupScoring.ts`.

import { championsById } from "@/app/data/champions";
import type { MatchupLevel, MatchupPhase, MatchupRelation, Phase } from "@/app/types/champion";

export type { MatchupLevel, MatchupPhase };
export type MatchupKind = "good" | "weak";
/** Faza jocului în simulare (early / mid / late) — alta decât `MatchupPhase`. */
export type GamePhase = Phase;
export type MatchupPhaseWeights = Record<GamePhase, number>;

export const MATCHUP_LEVELS: readonly MatchupLevel[] = [3, 2, 1];
export const MATCHUP_PHASES: readonly MatchupPhase[] = ["lane", "late", "all"];

export function isMatchupLevel(value: unknown): value is MatchupLevel {
  return value === 1 || value === 2 || value === 3;
}

export function isMatchupPhase(value: unknown): value is MatchupPhase {
  return value === "lane" || value === "late" || value === "all";
}

type Info = { label: string; description: string };

export const GOOD_VS_LEVEL_INFO: Record<MatchupLevel, Info> = {
  3: { label: "Hard counter", description: "Îl bate mereu, indiferent de context." },
  2: {
    label: "Counter",
    description: "Îl bate, dar adversarul se poate juca dacă slăbiciunile îi sunt acoperite de echipă.",
  },
  1: { label: "Skill matchup, ușor avantaj", description: "Decide în mare parte jucătorul." },
};

export const WEAK_VS_LEVEL_INFO: Record<MatchupLevel, Info> = {
  3: { label: "Hard countered", description: "Pierde mereu, indiferent de context." },
  2: { label: "Countered", description: "Pierde, dar poate câștiga dacă echipa îi acoperă slăbiciunile." },
  1: { label: "Skill matchup, ușor dezavantaj", description: "Decide în mare parte jucătorul." },
};

export const MATCHUP_PHASE_INFO: Record<MatchupPhase, Info> = {
  lane: { label: "pe linie", description: "Avantajul e în lane phase, se egalizează după." },
  late: { label: "late", description: "Linia e egală, avantajul vine din mid game încolo." },
  all: { label: "tot jocul", description: "Avantajul ține tot jocul." },
};

// ─── Ponderi și curbe ────────────────────────────────────────────────────────

/**
 * Greutatea de bază a unui level. Spec-ul propune 3.0 / 2.2 / 0.5 pe scala de
 * pornire din DRAFT_REWORK; aici sunt echivalentele calibrate (×~3.15, vezi
 * calibrarea din DRAFT_REWORK §4.9), ca datele migrate să dea aceleași valori.
 */
export const MATCHUP_LEVEL_WEIGHT: Record<MatchupLevel, number> = { 3: 9.5, 2: 6.9, 1: 1.6 };

/** Cât din greutate se manifestă în fiecare fază a jocului. */
export const MATCHUP_PHASE_CURVE: Record<MatchupPhase, MatchupPhaseWeights> = {
  lane: { early: 0.55, mid: 0.25, late: 0.1 },
  late: { early: 0.1, mid: 0.6, late: 0.65 },
  all: { early: 1.0, mid: 1.0, late: 1.0 },
};

/** Level 1 + "all": curba vechii note 1 (0.6 pe fază), ca valoarea să rămână aceeași. */
export const SKILL_ALL_PHASE_CURVE: MatchupPhaseWeights = { early: 0.6, mid: 0.6, late: 0.6 };

export function getPhaseCurve(level: MatchupLevel, phase: MatchupPhase): MatchupPhaseWeights {
  return level === 1 && phase === "all" ? SKILL_ALL_PHASE_CURVE : MATCHUP_PHASE_CURVE[phase];
}

/** Greutăți egale — folosite când planul compoziției nu se poate determina. */
export const EVEN_PHASE_WEIGHTS: MatchupPhaseWeights = { early: 1, mid: 1, late: 1 };

/**
 * Combină componentele pe faze:
 * - `phase` dat (simulare): componenta acelei faze;
 * - `weights` date (draft): media ponderată după planul compoziției;
 * - nimic: media celor 3 faze.
 */
export function combinePhases(
  components: MatchupPhaseWeights,
  options: { phase?: GamePhase; weights?: MatchupPhaseWeights | null } = {},
): number {
  if (options.phase) return components[options.phase];
  const weights = options.weights ?? EVEN_PHASE_WEIGHTS;
  const early = Math.max(0, weights.early);
  const mid = Math.max(0, weights.mid);
  const late = Math.max(0, weights.late);
  const total = early + mid + late;
  if (total <= 0) return (components.early + components.mid + components.late) / 3;
  return (components.early * early + components.mid * mid + components.late * late) / total;
}

/** Tăria medie a unei relații (pentru a alege relația cea mai puternică dintre mai multe). */
export function getRelationStrength(relation: Pick<MatchupRelation, "level" | "phase">): number {
  return MATCHUP_LEVEL_WEIGHT[relation.level] * combinePhases(getPhaseCurve(relation.level, relation.phase));
}

// ─── Criterii (folosite în draft engine în locul vechilor `grade >= 4` etc.) ─

type LevelPhase = Pick<MatchupRelation, "level" | "phase">;

/** Level 3, orice fază. */
export const isHardCounter = (relation: LevelPhase) => relation.level === 3;
/** Level 3, sau level 2 pe tot jocul — echivalentul vechiului „notă ≥ 4”. */
export const isStrongCounter = (relation: LevelPhase) =>
  relation.level === 3 || (relation.level === 2 && relation.phase === "all");
/** Contează pe linie: phase "lane" sau "all", level ≥ 2. */
export const isLaneCounter = (relation: LevelPhase) =>
  relation.level >= 2 && (relation.phase === "lane" || relation.phase === "all");

// ─── Text pentru explainer ───────────────────────────────────────────────────

/** „Hard counter vs Azir”, „Counter pe linie vs Jax”, „Pierde late vs Gwen (condiționat)”. */
export function describeMatchup(relation: Pick<MatchupRelation, "championId" | "level" | "phase">, kind: MatchupKind): string {
  const enemy = championsById[relation.championId]?.name ?? relation.championId;
  const base =
    kind === "good"
      ? GOOD_VS_LEVEL_INFO[relation.level].label
      : relation.level === 2
        ? "Pierde"
        : WEAK_VS_LEVEL_INFO[relation.level].label;
  const phase = relation.phase === "all" || relation.level === 1 ? "" : ` ${MATCHUP_PHASE_INFO[relation.phase].label}`;
  // Level 2 e condiționat de slăbiciunile acoperite — contează pe mid/late, nu pe linie.
  const conditional = relation.level === 2 && relation.phase !== "lane" ? " (condiționat)" : "";
  return `${base}${phase} vs ${enemy}${conditional}`;
}

// ─── Level 2: slăbiciuni acoperite (doar pe mid / late) ─────────────────────

export const WEAKNESS_COVER_CONFIG = {
  /** Doar nevoile cu prioritate cel puțin atât contează ca „slăbiciuni”. */
  minNeedPriority: 2,
  /** Un aliat acoperă o nevoie doar cu un offer de cel puțin atât, același `type`. */
  minOfferStrength: 3,
  partialThreshold: 0.5,
  partialMultiplier: 0.5,
  fullMultiplier: 0.3,
} as const;

/**
 * Procentul (0..1) din slăbiciunile campionului (`needs` cu `priority >= 2`)
 * acoperite de `offers` ale aliaților lui (`strength >= 3`, același `type`).
 * Un campion fără astfel de nevoi nu are ce acoperi → 0 (efect întreg).
 */
export function getWeaknessCoverage(championId: string, allyIds: readonly string[]): number {
  const champion = championsById[championId];
  if (!champion) return 0;

  const weaknesses = new Set(
    champion.needs
      .filter((need) => need.priority >= WEAKNESS_COVER_CONFIG.minNeedPriority)
      .map((need) => need.type),
  );
  if (weaknesses.size === 0) return 0;

  const covered = new Set<string>();
  for (const allyId of allyIds) {
    if (allyId === championId) continue;
    const ally = championsById[allyId];
    if (!ally) continue;
    for (const offer of ally.offers) {
      if (offer.strength >= WEAKNESS_COVER_CONFIG.minOfferStrength && weaknesses.has(offer.type)) {
        covered.add(offer.type);
      }
    }
  }
  return covered.size / weaknesses.size;
}

/** coverage === 1 → ×0.3; coverage >= 0.5 → ×0.5; altfel ×1. */
export function getWeaknessCoverMultiplier(coverage: number): number {
  if (coverage >= 1) return WEAKNESS_COVER_CONFIG.fullMultiplier;
  if (coverage >= WEAKNESS_COVER_CONFIG.partialThreshold) return WEAKNESS_COVER_CONFIG.partialMultiplier;
  return 1;
}

// ─── Level 1: skill matchup ──────────────────────────────────────────────────

export const SKILL_MATCHUP_CONFIG = {
  /**
   * Diferența de `mec` (scara reală 10..100; jucătorii actuali sunt ~57..95,
   * p10–p90 ≈ 62–86) la care avantajul de level 1 dispare complet. Echivalentul
   * lui „2 puncte” pe o scală 1..10, raportat la răspândirea reală.
   */
  mecDiffForZero: 15,
  minMultiplier: -0.25,
  maxMultiplier: 1.5,
} as const;

/**
 * Factorul de level 1, din perspectiva campionului FAVORIZAT de matchup
 * (cel cu goodVs). Dacă jucătorul defavorizat e mult mai bun mecanic,
 * avantajul ajunge la 0 sau devine ușor negativ; dacă favoritul e mai bun,
 * avantajul crește. Jucători necunoscuți → 1 (efect normal).
 */
export function getSkillMatchupMultiplier(
  favoredMec: number | null | undefined,
  unfavoredMec: number | null | undefined,
): number {
  if (typeof favoredMec !== "number" || typeof unfavoredMec !== "number") return 1;
  const { mecDiffForZero, minMultiplier, maxMultiplier } = SKILL_MATCHUP_CONFIG;
  const multiplier = 1 + (favoredMec - unfavoredMec) / mecDiffForZero;
  return Math.max(minMultiplier, Math.min(maxMultiplier, multiplier));
}
