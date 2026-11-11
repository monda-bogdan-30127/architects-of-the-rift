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
