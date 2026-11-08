import { championsById } from "@/app/data/champions";
import type { DraftCandidateBreakdown, TeamDraftEvaluation } from "./draftTypes";
import { describeMatchup } from "./matchupGrades";

function championName(championId: string) {
  return championsById[championId]?.name ?? championId;
}

/** „Combo botlane: Xayah → Rakan (mastery A)” (DRAFT_REWORK §5.2). */
export function describeMustWithLock(
  lock: NonNullable<DraftCandidateBreakdown["mustWithLock"]>,
  isBotPair: boolean,
): string {
  const label = isBotPair ? "Combo botlane" : "Combo mustWith";
  const mastery = lock.grade ? ` (mastery ${lock.grade})` : "";
  return `${label}: ${championName(lock.anchorId)} → ${championName(lock.partnerId)}${mastery}`;
}

/** Linii pentru bonusurile mustWith din breakdown (lock, combo potential, deny). */
function explainMustWith(breakdown: DraftCandidateBreakdown): string[] {
  const tags = new Set(breakdown.reasonTags ?? []);
  const lines: string[] = [];
  if (tags.has("mustwith-lock") && breakdown.mustWithLock) {
    lines.push(
      breakdown.explanation?.find((line) => line.startsWith("Combo")) ??
        describeMustWithLock(breakdown.mustWithLock, true),
    );
  }
  if (tags.has("combo-potential")) lines.push("combo potential: partener mustWith eligibil pe botlane");
  // DRAFT_THINKING §2: liniile concrete (duo, ancoră orfană, fallback) sunt în `explanation`.
  for (const tag of ["duo-plan", "orphan-anchor", "duo-fallback"]) {
    if (!tags.has(tag)) continue;
    const line = breakdown.explanation?.find((entry) => entry.includes("Duo:") || entry.includes("→") || entry.includes("evitat"));
    if (line && !lines.includes(line)) lines.push(line);
  }
  if (tags.has("mustwith-partner")) lines.push("mustWith: completează perechea unui pick propriu");
  if (tags.has("mustwith-deny")) {
    lines.push(
      breakdown.action === "ban"
        ? "mustWith deny: banează partenerul liber al ancorei inamice"
        : "mustWith deny: ia partenerul liber al ancorei inamice",
    );
  }
  return lines;
}

/** „Braum ar muta Poppy pe top (Zeus: F) — respins” (DRAFT_THINKING §1.4). */
export function describeReassignment(
  candidateId: string,
  entry: { championId: string; toRole: string; playerId: string | null; grade: string | null },
  rejected: boolean,
): string {
  const who = entry.playerId ? ` (${entry.playerId}: ${entry.grade ?? "?"})` : "";
  return `${championName(candidateId)} ar muta ${championName(entry.championId)} pe ${entry.toRole}${who}${rejected ? " — respins" : ""}`;
}

/** „Plan: dive, construit în jurul lui Vi (B1)” (DRAFT_THINKING §4). */
export function describePlanAnchor(planType: string, anchorId: string, side: "blue" | "red", lockedAtPick?: number): string {
  const locked = lockedAtPick ? ", blocat" : "";
  return `Plan: ${planType}, construit în jurul lui ${championName(anchorId)} (${side === "blue" ? "B1" : "R1"}${locked})`;
}

/** „Zeus nu joacă Poppy (F) — exclus” (§1.5). */
export function describeMasteryBlock(playerId: string, championId: string, grade: string): string {
  return grade === "F"
    ? `${playerId} nu joacă ${championName(championId)} (F) — exclus`
    : `${playerId} are ${championName(championId)} la grad ${grade} — penalizat`;
}

/** „Pool golit de ban-uri / fearless: Zeus pe Poppy (F), singura variantă” (§1.5). */
export function describeForcedOffPool(playerId: string | null, championId: string): string {
  return `Pool golit (ban-uri / fearless): ${playerId ?? "jucătorul"} pe ${championName(championId)} în afara pool-ului, singura variantă`;
}

/** „Anti-sinergie cu Pyke (Pyke roamează, Kog'Maw rămâne singur în lane, fără peel)”, din `note`. */
export function describeBadSynergy(entry: { partnerId: string; note: string }): string {
  return `Anti-sinergie cu ${championName(entry.partnerId)} (${entry.note})`;
}

function explainBadSynergy(breakdown: DraftCandidateBreakdown): string[] {
  return (breakdown.badSynergies ?? []).map(describeBadSynergy);
}

/** Cele mai importante două matchup-uri ale candidatului, în cuvinte („Counter pe linie vs Jax”). */
function explainMatchups(breakdown: DraftCandidateBreakdown): string[] {
  return [...(breakdown.matchupDetails ?? [])]
    .filter((detail) => Math.abs(detail.value) >= 0.9)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 2)
    .map((detail) => describeMatchup({ championId: detail.enemyId, level: detail.level, phase: detail.phase }, detail.kind));
}

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

  return [
    ...explainMustWith(breakdown),
    ...explainBadSynergy(breakdown),
    ...explainMatchups(breakdown),
    ...reasons.map(({ label, value }) => `${label}: ${value >= 0 ? "+" : ""}${value.toFixed(1)}`),
  ];
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
