import type { DraftCandidateBreakdown, TeamDraftEvaluation } from "./draftTypes";

function topReasonEntries(reasonMap: Array<[string, number]>) {
  return reasonMap
    .filter(([, value]) => Math.abs(value) >= 0.9)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));
}

export function explainDraftCandidate(breakdown: DraftCandidateBreakdown): string[] {
  const reasons = topReasonEntries([
    ["meta priority", breakdown.metaPriority],
    ["comfort", breakdown.comfortScore],
    ["player fit", breakdown.playerFitScore],
    ["comp synergy", breakdown.compSynergy],
    ["need fill", breakdown.needFill],
    ["counter value", breakdown.counterValue],
    ["weakness penalty", -Math.abs(breakdown.weaknessPenalty)],
    ["team identity bias", breakdown.teamIdentityBias ?? 0],
    ["simulation fit", breakdown.simulatedFitValue ?? 0],
    ["access value", breakdown.accessValue ?? 0],
    ["threat value", breakdown.threatValue ?? 0],
  ]);

  return reasons.map(({ label, value }) => `${label}: ${value >= 0 ? "+" : ""}${value.toFixed(1)}`);
}

export function summarizeTeamDraftEvaluation(evaluation: TeamDraftEvaluation): string[] {
  const notes: string[] = [];
  notes.push(`identity: ${evaluation.compIdentity}`);
  notes.push(`power: ${evaluation.draftPower.toFixed(1)}`);
  if (evaluation.simulationRisks?.length) {
    notes.push(`risks: ${evaluation.simulationRisks.slice(0, 3).join(" | ")}`);
  }
  if (evaluation.identityNote) {
    notes.push(`identity note: ${evaluation.identityNote}`);
  }
  return notes;
}
