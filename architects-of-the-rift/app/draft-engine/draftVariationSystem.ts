import type { Champion } from "@/app/types/champion";
import type { ActiveDraftSeries, DraftAiConfig, DraftCandidateBreakdown, DraftGameState, Side } from "./draftTypes";

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function roll(seed: string) {
  return (hashString(seed) % 10000) / 10000;
}

export function applyVariationBonus(args: {
  candidate: Champion;
  series: ActiveDraftSeries;
  game: DraftGameState;
  side: Side;
  config: DraftAiConfig;
  roleCoverageBonus: number;
  flexBonus: number;
}) {
  const { candidate, series, game, side, config, roleCoverageBonus, flexBonus } = args;
  const variability = typeof config.varietyWeight === "number" ? config.varietyWeight : 1;
  const seed = `${series.seriesId}:${series.currentGameNumber}:${game.phaseIndex}:${side}:${candidate.id}`;
  const noise = (roll(seed) - 0.5) * 2.2 * variability;
  const flexNoise = candidate.roles.length >= 2 ? 0.35 + flexBonus * 0.08 : 0;
  const roleSafetyNoise = roleCoverageBonus > 0 ? 0.25 : -0.35;
  return noise + flexNoise + roleSafetyNoise;
}

export function chooseFromAdaptiveShortlist(ranked: DraftCandidateBreakdown[], seed: string) {
  if (!ranked.length) return null;
  if (ranked.length === 1) return ranked[0] ?? null;
  const best = ranked[0]?.totalScore ?? 0;
  const shortlist = ranked.filter((entry) => entry.totalScore >= best - 5.5).slice(0, 6);
  if (shortlist.length <= 1) return shortlist[0] ?? ranked[0] ?? null;
  const selector = roll(seed);
  const index = Math.min(shortlist.length - 1, Math.floor(selector * shortlist.length));
  return shortlist[index] ?? shortlist[0] ?? null;
}
