import { teams } from "@/app/data/teams";
import type { Champion } from "@/app/types/champion";
import type {
  ActiveDraftSeries,
  DraftAiConfig,
  DraftCandidateBreakdown,
  DraftGameState,
  DraftSave,
  DraftStep,
} from "./draftTypes";
import { DEFAULT_AI_CONFIG } from "./draftTypes";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTeamSlugForSide(series: ActiveDraftSeries, side: "blue" | "red") {
  return side === "blue" ? series.blueTeamSlug : series.redTeamSlug;
}

function getIdentityBias(teamSlug: string, champion: Champion) {
  const team = teams.find((entry) => entry.slug === teamSlug);
  const identity = team?.identity;
  if (!identity) return 0;

  let bias = 0;
  const tagSet = new Set(champion.championTags ?? []);

  if ((identity.flexBias ?? 0) >= 7 && champion.roles.length >= 2) bias += 1.4;
  if ((identity.earlyPriorityBias ?? 0) >= 7 && (champion.stats?.prioScore ?? 0) >= 65) bias += 1.2;
  if ((identity.counterpickBias ?? 0) >= 7 && champion.roles.length === 1) bias += 0.4;
  if ((identity.creativity ?? 0) >= 7 && champion.roles.length >= 2) bias += 0.6;

  for (const tag of identity.preferredTags ?? []) {
    if (tagSet.has(tag)) bias += 0.45;
  }

  for (const tag of identity.avoidTags ?? []) {
    if (tagSet.has(tag)) bias -= 0.6;
  }

  return clamp(bias, -3, 4);
}

function scoreChampion(
  champion: Champion,
  step: DraftStep,
  series: ActiveDraftSeries
) {
  const stats = champion.stats ?? ({} as Record<string, number>);
  const metaPriority = clamp(((stats.prioScore ?? 50) as number) / 10, 0, 10);
  const presence = clamp((((stats.presence ?? 0) as number) / 10), 0, 10);
  const blindPick = clamp((((stats.blindPickRate ?? 40) as number) / 10), 0, 10);
  const flexValue = champion.roles.length >= 2 ? 2.5 : 0.5;

  const teamSlug = getTeamSlugForSide(series, step.side);
  const identityBias = getIdentityBias(teamSlug, champion);

  const totalScore =
    metaPriority * 1.35 +
    presence * 0.55 +
    blindPick * (step.action === "pick" ? 0.28 : 0.1) +
    flexValue +
    identityBias;

  return {
    totalScore,
    metaPriority,
    identityBias,
    blindPick,
  };
}

export function scoreDraftCandidate(
  candidate: Champion,
  step: DraftStep,
  _game: DraftGameState,
  series: ActiveDraftSeries,
  _save: DraftSave | null,
  _config: DraftAiConfig = DEFAULT_AI_CONFIG
): DraftCandidateBreakdown {
  const scored = scoreChampion(candidate, step, series);

  return {
    championId: candidate.id,
    action: step.action,
    side: step.side,
    metaPriority: scored.metaPriority,
    comfortScore: 5,
    playerFitScore: 5,
    compSynergy: 5,
    needFill: 5,
    counterValue: step.action === "ban" ? scored.metaPriority : 5,
    weaknessPenalty: Math.max(0, 6 - scored.blindPick),
    teamIdentityBias: scored.identityBias,
    totalScore: scored.totalScore,
    reasonTags: [
      step.action === "pick" ? "safe-pick-ai" : "safe-ban-ai",
      candidate.roles.length >= 2 ? "flex" : "single-role",
    ],
    explanation: [
      `meta priority: ${scored.metaPriority.toFixed(2)}`,
      `identity bias: ${scored.identityBias.toFixed(2)}`,
      `blind score: ${scored.blindPick.toFixed(2)}`,
    ],
  } as DraftCandidateBreakdown;
}

export function chooseAiAction(
  pool: Champion[],
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig = DEFAULT_AI_CONFIG
): DraftCandidateBreakdown | null {
  if (!pool.length) return null;

  const ranked = pool
    .map((candidate) => scoreDraftCandidate(candidate, step, game, series, save, config))
    .sort((a, b) => b.totalScore - a.totalScore);

  return ranked[0] ?? null;
}
