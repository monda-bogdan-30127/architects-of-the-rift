import { championsById } from "@/app/data/champions";
import type { DraftCandidateBreakdown, DraftPillarReport, TeamDraftEvaluation } from "./draftTypes";
import { describeMatchupDetailed } from "./matchupGrades";
import { getMatchupRelations } from "./championMatchups";

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
  if (tags.has("combo-potential")) lines.push("Combo potential: an eligible mustWith partner on bot lane");
  // DRAFT_THINKING §2: liniile concrete (duo, ancoră orfană, fallback) sunt deja în `explanation`;
  // explainDraftCandidate le adaugă pe toate, fără duplicate.
  if (tags.has("mustwith-partner")) lines.push("mustWith: completes the pair of one of our picks");
  if (tags.has("mustwith-deny")) {
    lines.push(
      breakdown.action === "ban"
        ? "mustWith deny: bans the free partner of their anchor"
        : "mustWith deny: takes the free partner of their anchor",
    );
  }
  return lines;
}

/** „Braum would move Poppy to top (Zeus: F): rejected” (DRAFT_THINKING §1.4). */
export function describeReassignment(
  candidateId: string,
  entry: { championId: string; toRole: string; playerId: string | null; grade: string | null },
  rejected: boolean,
): string {
  const who = entry.playerId ? ` (${entry.playerId}: ${entry.grade ?? "?"})` : "";
  return `${championName(candidateId)} would move ${championName(entry.championId)} to ${entry.toRole}${who}${rejected ? ": rejected" : ""}`;
}

/** „Plan: dive, built around Vi (B1)” (DRAFT_THINKING §4). */
export function describePlanAnchor(planType: string, anchorId: string, side: "blue" | "red", lockedAtPick?: number): string {
  const locked = lockedAtPick ? ", locked" : "";
  return `Plan: ${planType}, built around ${championName(anchorId)} (${side === "blue" ? "B1" : "R1"}${locked})`;
}

/** DRAFT_THINKING §7.4: „Ban Olaf: G2 is 6–1 with it this season”. */
export function describeSeasonBan(teamName: string, championId: string, wins: number, games: number): string {
  return `Ban ${championName(championId)}: ${teamName} is ${wins}–${games - wins} with it this season`;
}

/** „Leaving Olaf open: we have Poppy (A) as an answer”. */
export function describeSeasonPlan(championId: string, counterId: string, grade: string | undefined): string {
  return `Leaving ${championName(championId)} open: we have ${championName(counterId)}${grade ? ` (${grade})` : ""} as an answer`;
}

/** „Counter to their Olaf (6–1 this season)”. */
export function describeSeasonCounter(championId: string, wins: number, games: number): string {
  return `Counter to their ${championName(championId)} (${wins}–${games - wins} this season)`;
}

/** „Zeus doesn't play Poppy (F): excluded” (§1.5). */
export function describeMasteryBlock(playerId: string, championId: string, grade: string): string {
  return grade === "F"
    ? `${playerId} doesn't play ${championName(championId)} (F): excluded`
    : `${playerId} has ${championName(championId)} at grade ${grade}: penalized`;
}

/** „Pool emptied by bans / fearless: Zeus on Poppy, outside their pool, the only option” (§1.5). */
export function describeForcedOffPool(playerId: string | null, championId: string): string {
  return `Pool emptied by bans / fearless: ${playerId ?? "the player"} on ${championName(championId)}, outside their pool, the only option`;
}

/** „Anti-synergy with Pyke (Pyke roams, Kog'Maw is left alone in lane)”, din `note`. */
export function describeBadSynergy(entry: { partnerId: string; note: string }): string {
  return `Anti-synergy with ${championName(entry.partnerId)} (${entry.note})`;
}

function explainBadSynergy(breakdown: DraftCandidateBreakdown): string[] {
  return (breakdown.badSynergies ?? []).map(describeBadSynergy);
}

/** Cele mai importante două matchup-uri ale candidatului: „Counter in lane vs Jax: <motiv>” (§4.3). */
function explainMatchups(breakdown: DraftCandidateBreakdown): string[] {
  return [...(breakdown.matchupDetails ?? [])]
    .filter((detail) => Math.abs(detail.value) >= 0.9)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 2)
    .map((detail) => {
      const role = breakdown.projectedRole ?? null;
      const relations = role ? getMatchupRelations(breakdown.championId, role, detail.enemyId, detail.enemyRole) : {};
      const note = (detail.kind === "good" ? relations.good : relations.weak)?.note;
      const { label, reason } = describeMatchupDetailed({ championId: detail.enemyId, level: detail.level, phase: detail.phase, note }, detail.kind);
      return `${label}: ${reason}`;
    });
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

  // DRAFT_THINKING §9: liniile concrete ale tag-urilor noi (mastery, duo, plan, split, tunnel vision,
  // linii pierdute, sezon) stau deja în `explanation`, scrise de draftAI — le refolosim, fără duplicate.
  const lines = [...explainMustWith(breakdown), ...explainBadSynergy(breakdown)];
  for (const line of breakdown.explanation ?? []) if (!lines.includes(line)) lines.push(line);
  return [
    ...lines,
    ...explainMatchups(breakdown),
    ...reasons.map(({ label, value }) => `${label}: ${value >= 0 ? "+" : ""}${value.toFixed(1)}`),
  ];
}

/** Etichetele pilonilor din raport (FEEDBACK_FIXES §5.1), în ordinea din UI. */
export const PILLAR_LABELS: { key: "composition" | "lanes" | "players" | "preparation"; label: string }[] = [
  { key: "composition", label: "Composition" },
  { key: "lanes", label: "Lanes" },
  { key: "players", label: "Players" },
  { key: "preparation", label: "Preparation" },
];

/** „Draft edge: +0.4 (yours)” / „Draft edge: −0.6 (theirs)”: scorul de draft din simulare, al nostru − al lor. */
export function describeDraftEdge(edge: number): string {
  const sign = edge > 0 ? "+" : edge < 0 ? "−" : "±";
  const owner = edge > 0.05 ? " (yours)" : edge < -0.05 ? " (theirs)" : " (even)";
  return `Draft edge: ${sign}${Math.abs(edge).toFixed(1)}${owner}`;
}

export function summarizeTeamDraftEvaluation(evaluation: TeamDraftEvaluation, report?: DraftPillarReport | null): string[] {
  const notes: string[] = [];
  // §8: cu raportul pe piloni, notele vin din el (nu se duplică).
  if (report) {
    if (typeof report.draftEdge === "number") notes.push(describeDraftEdge(report.draftEdge));
    for (const { key, label } of PILLAR_LABELS) {
      notes.push(`${label} ${report[key].grade}${report[key].notes[0] ? `: ${report[key].notes[0]}` : ""}`);
    }
    notes.push(`power: ${evaluation.draftPower.toFixed(1)}`);
    return notes;
  }
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
