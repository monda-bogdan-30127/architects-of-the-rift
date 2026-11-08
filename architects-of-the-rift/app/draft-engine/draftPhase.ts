export type DraftPhase = "early" | "mid" | "late";

export function getDraftPhase(pickNumber: number): DraftPhase {
  if (pickNumber <= 3) return "early";
  if (pickNumber <= 7) return "mid";
  return "late";
}

export function getPhaseBias(phase: DraftPhase) {
  switch (phase) {
    case "early":
      return {
        metaWeight: 1.2,
        blindSafety: 1.4,
        elasticity: 1.3,
        counter: 0.7,
        compIdentity: 0.85,
        execution: 0.85,
      };
    case "mid":
      return {
        metaWeight: 1.0,
        blindSafety: 1.0,
        elasticity: 1.0,
        counter: 1.0,
        compIdentity: 1.2,
        execution: 1.0,
      };
    case "late":
      return {
        metaWeight: 0.82,
        blindSafety: 0.8,
        elasticity: 0.8,
        counter: 1.45,
        compIdentity: 1.15,
        execution: 1.15,
      };
  }
}

// ─── DRAFT_REALISM §5: faza după indexul din DRAFT_SEQUENCE ─────────────────
export type DraftPhaseId = "ban1" | "pick1-open" | "pick1-close" | "ban2" | "pick2" | "last-pick";

export const DRAFT_PHASE_IDS: DraftPhaseId[] = ["ban1", "pick1-open", "pick1-close", "ban2", "pick2", "last-pick"];

/** B1–R3 ban (0–5) · B1 R1 R2 (6–8) · B2 B3 R3 (9–11) · R4–B5 ban (12–15) · R4 B4 B5 (16–18) · R5 (19). */
export function getDraftPhaseId(stepIndex: number): DraftPhaseId {
  if (stepIndex <= 5) return "ban1";
  if (stepIndex <= 8) return "pick1-open";
  if (stepIndex <= 11) return "pick1-close";
  if (stepIndex <= 15) return "ban2";
  if (stepIndex <= 18) return "pick2";
  return "last-pick";
}
