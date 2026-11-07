// Notele de matchup — sursa unică de adevăr (DRAFT_REWORK §1).
//
// O notă descrie CUM se manifestă un matchup, nu doar cât de mare e:
//   5 = mereu, 4 = condiționat de slăbiciunile acoperite, 3 = mid/late,
//   2 = lane phase, 1 = skill matchup.
// Simetrie: `A weakVs B nota g` ⇔ `B goodVs A nota g`.
//
// Fișierul conține doar definiții și factori puri. Combinarea lor într-o
// valoare numerică pentru draft / simulare se face într-un singur loc:
// `matchupScoring.ts` (§4.0).

import { championsById } from "@/app/data/champions";
import type { MatchupGrade } from "@/app/types/champion";

export type { MatchupGrade };
export type MatchupKind = "good" | "weak";
export type MatchupPhase = "early" | "mid" | "late";
export type MatchupPhaseWeights = Record<MatchupPhase, number>;

export const MATCHUP_GRADES: readonly MatchupGrade[] = [5, 4, 3, 2, 1];

export function isMatchupGrade(value: unknown): value is MatchupGrade {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

type GradeInfo = { label: string; description: string };

export const GOOD_VS_GRADE_INFO: Record<MatchupGrade, GradeInfo> = {
  5: { label: "Counter natural", description: "Îl bate tot timpul, indiferent de context." },
  4: {
    label: "Counter condiționat",
    description: "Îl countrează, dar adversarul poate câștiga dacă slăbiciunile lui sunt acoperite de echipă.",
  },
  3: { label: "Câștigă mid/late", description: "Linia e ok/egală, dar îl bate din mid game încolo." },
  2: { label: "Câștigă pe linie", description: "Avantaj clar în lane phase, se egalizează după." },
  1: { label: "Skill matchup, ușor avantaj", description: "Mic avantaj, decide în mare parte jucătorul." },
};

export const WEAK_VS_GRADE_INFO: Record<MatchupGrade, GradeInfo> = {
  5: { label: "Hard countered", description: "Pierde tot timpul, indiferent de context." },
  4: {
    label: "Countered condiționat",
    description: "Pierde, dar poate câștiga dacă slăbiciunile lui sunt acoperite de echipă.",
  },
  3: { label: "Pierde mid/late", description: "Linia e ok/egală, dar pierde din mid game încolo." },
  2: { label: "Pierde pe linie", description: "Dezavantaj clar în lane phase, se egalizează după." },
  1: { label: "Skill matchup, ușor dezavantaj", description: "Mic dezavantaj, decide în mare parte jucătorul." },
};

export function getMatchupGradeInfo(kind: MatchupKind, grade: MatchupGrade): GradeInfo {
  return kind === "good" ? GOOD_VS_GRADE_INFO[grade] : WEAK_VS_GRADE_INFO[grade];
}

export type MatchupGradeEffect = {
  /** Greutatea de bază în draft. */
  draftWeight: number;
  /** 0..1 — cât de mult se manifestă matchup-ul în fiecare fază. */
  phase: MatchupPhaseWeights;
  /** Nota 4: efectul scade dacă slăbiciunile campionului countrat sunt acoperite. */
  conditionalOnWeaknessCover: boolean;
  /** Nota 1: efectul se scalează cu diferența mecanică dintre jucători. */
  skillDependent: boolean;
};

// Calibrare (DRAFT_REWORK §4.9, `npx tsx scripts/draft-calibration.ts 200`):
// valorile de pornire 3.0 / 2.2 / 1.4 / 1.2 / 0.5 înmulțite uniform cu ~3.15
// (ordinea relativă păstrată), ca deviația lui `counterValue` și efectul
// counter-urilor în simulare să rămână în același ordin de mărime ca înainte de
// rework (renotarea a mutat majoritatea relațiilor pe nota 2).
export const MATCHUP_GRADE_EFFECTS: Record<MatchupGrade, MatchupGradeEffect> = {
  5: { draftWeight: 9.5, phase: { early: 1.0, mid: 1.0, late: 1.0 }, conditionalOnWeaknessCover: false, skillDependent: false },
  4: { draftWeight: 6.9, phase: { early: 0.9, mid: 1.0, late: 1.0 }, conditionalOnWeaknessCover: true, skillDependent: false },
  3: { draftWeight: 4.4, phase: { early: 0.2, mid: 0.9, late: 1.0 }, conditionalOnWeaknessCover: false, skillDependent: false },
  2: { draftWeight: 3.8, phase: { early: 1.0, mid: 0.5, late: 0.2 }, conditionalOnWeaknessCover: false, skillDependent: false },
  1: { draftWeight: 1.6, phase: { early: 0.6, mid: 0.6, late: 0.6 }, conditionalOnWeaknessCover: false, skillDependent: true },
};

// ─── Faza (nota 2 vs 3) ──────────────────────────────────────────────────────

/** Greutăți egale — folosite când planul compoziției nu se poate determina. */
export const EVEN_PHASE_WEIGHTS: MatchupPhaseWeights = { early: 1, mid: 1, late: 1 };

/**
 * Factorul de fază al unei note.
 * - `phase` dat (simulare): valoarea notei în acea fază.
 * - `weights` date (draft): media ponderată a fazelor după planul compoziției.
 * - nimic: media celor 3 faze.
 */
export function getPhaseMultiplier(
  grade: MatchupGrade,
  options: { phase?: MatchupPhase; weights?: MatchupPhaseWeights | null } = {},
): number {
  const profile = MATCHUP_GRADE_EFFECTS[grade].phase;
  if (options.phase) return profile[options.phase];

  const weights = options.weights ?? EVEN_PHASE_WEIGHTS;
  const early = Math.max(0, weights.early);
  const mid = Math.max(0, weights.mid);
  const late = Math.max(0, weights.late);
  const total = early + mid + late;
  if (total <= 0) return (profile.early + profile.mid + profile.late) / 3;
  return (profile.early * early + profile.mid * mid + profile.late * late) / total;
}

// ─── Nota 4: slăbiciuni acoperite ────────────────────────────────────────────

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

// ─── Nota 1: skill matchup ───────────────────────────────────────────────────

export const SKILL_MATCHUP_CONFIG = {
  /**
   * Diferența de `mec` (scara reală 10..100; jucătorii actuali sunt ~57..95,
   * p10–p90 ≈ 62–86) la care avantajul notei 1 dispare complet. Echivalentul
   * lui „2 puncte” pe o scală 1..10, raportat la răspândirea reală.
   */
  mecDiffForZero: 15,
  minMultiplier: -0.25,
  maxMultiplier: 1.5,
} as const;

/**
 * Factorul notei 1, din perspectiva campionului FAVORIZAT de matchup
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
