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