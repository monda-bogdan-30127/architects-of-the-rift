import type { Champion } from "@/app/types/champion";
import { countOpenEnemyAnswers } from "./draftInformation";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";

const CONTESTABLE_IDS = new Set(["poppy", "jarvan-iv", "braum", "galio"]);

function getGenericAnswerIds(candidate: Champion) {
  const ids = new Set<string>();

  if (candidate.id === "jarvan-iv") {
    ["ezreal", "corki", "xayah", "poppy", "braum", "bard", "renata-glasc"].forEach((id) => ids.add(id));
  }

  if (candidate.id === "poppy") {
    ["ezreal", "corki", "xayah", "jinx", "aphelios", "renata-glasc", "taliyah"].forEach((id) => ids.add(id));
  }

  if (candidate.id === "vi") {
    ["xayah", "ezreal", "poppy", "braum", "renata-glasc"].forEach((id) => ids.add(id));
  }

  if (candidate.roles.includes("support")) {
    ["seraphine", "bard", "rakan", "lulu"].forEach((id) => ids.add(id));
  }

  return Array.from(ids);
}

export function getContestabilityPenalty(args: {
  candidate: Champion;
  side: Side;
  game: DraftGameState;
  series: ActiveDraftSeries;
  allyChampionIds: string[];
  enemyChampionIds: string[];
}) {
  const { candidate, game, series, allyChampionIds, enemyChampionIds } = args;
  const pickNumber = allyChampionIds.length + 1;
  const answerIds = getGenericAnswerIds(candidate);

  let penalty = 0;

  if (CONTESTABLE_IDS.has(candidate.id)) penalty += 2.6;
  if (pickNumber <= 2 && candidate.roles.length === 1) penalty += 1.1;
  if (candidate.mustWith.length > 0 && pickNumber <= 2) penalty += 0.8;
  if (pickNumber <= 2 && enemyChampionIds.length === 0 && candidate.roles.includes("jungle")) penalty += 0.55;

  if (answerIds.length > 0) {
    const openAnswers = countOpenEnemyAnswers(game, series, answerIds);
    penalty += openAnswers * (pickNumber <= 2 ? 0.38 : 0.22);
  }

  if (enemyChampionIds.length === 0 && candidate.id === "poppy") penalty += 0.9;
  if (enemyChampionIds.length === 0 && candidate.id === "jarvan-iv") penalty += 0.7;

  return Math.min(penalty, 8.5);
}