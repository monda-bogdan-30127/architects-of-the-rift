// Un draft AI vs AI pas cu pas (DRAFT_REALISM §14.1): alegerea, explicația și top 5 candidați.
//
//   npx tsx scripts/draft-trace.ts --blue <slug> --red <slug> --seed <n> [--top 5]

import { champions } from "@/app/data/champions";
import type { DraftCandidateBreakdown } from "@/app/draft-engine/draftTypes";
import { getChampionGrade } from "@/app/utils/championMasteryUtils";
import { makeSave, newAiSeries, parseArgs, playersById, runTracedDraft, teamsBySlug } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const blue = named.blue ?? "t1";
const red = named.red ?? "g2";
const seed = Number(named.seed ?? 0);
const topCount = Number(named.top ?? 5);
if (!teamsBySlug.has(blue) || !teamsBySlug.has(red)) {
  console.error(`Echipe necunoscute: ${blue} / ${red}. Slug-uri: ${[...teamsBySlug.keys()].join(", ")}`);
  process.exit(1);
}

const championName = new Map(champions.map((champion) => [champion.id, champion.name]));
const name = (id: string) => championName.get(id) ?? id;

type Extended = DraftCandidateBreakdown & {
  buckets?: Record<string, number>;
  bucketWeights?: Record<string, number>;
  intents?: { id: string; urgency: number; reason?: string }[];
  decisionLines?: string[];
};

function playerLabel(entry: DraftCandidateBreakdown) {
  const player = entry.projectedPlayerId ? playersById.get(entry.projectedPlayerId) : null;
  if (!player) return "";
  return `, ${player.name ?? player.id} ${getChampionGrade(player, entry.championId)}`;
}

function bucketLine(entry: Extended) {
  if (!entry.buckets) return "";
  const weights = entry.bucketWeights ?? {};
  return Object.entries(entry.buckets)
    .map(([bucket, value]) => [bucket, value * (weights[bucket] ?? 1)] as const)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .map(([bucket, value]) => `${bucket} ${value.toFixed(1)}`)
    .join(" · ");
}

const series = newAiSeries(`trace${seed}`, blue, red);
const { actions } = runTracedDraft(series, makeSave());
console.log(`${teamsBySlug.get(blue)?.name} (blue) vs ${teamsBySlug.get(red)?.name} (red) · seed ${seed} · ${series.seriesId}\n`);

for (const action of actions) {
  const chosen = action.chosen as Extended;
  const role = chosen.projectedRole ? ` (${chosen.projectedRole}${playerLabel(chosen)})` : "";
  const rank = chosen.choiceRank !== undefined ? ` · loc ${chosen.choiceRank + 1}` : " · forțat";
  console.log(`[${action.label} ${action.action} · ${action.phase}] ${name(action.championId)}${role} ${chosen.totalScore.toFixed(2)}${rank}`);
  for (const line of chosen.decisionLines ?? []) console.log(`    ${line}`);
  if (!chosen.decisionLines && chosen.intents?.length) {
    const main = chosen.intents[0];
    console.log(`    Intenție: ${main.id} (${main.urgency.toFixed(1)})${main.reason ? ` — ${main.reason}` : ""}`);
  }
  const buckets = bucketLine(chosen);
  if (buckets && !chosen.decisionLines) console.log(`    ${buckets}`);
  const tags = (chosen.reasonTags ?? []).filter((tag) => !["valid-role-map", "meta-ok", "safe-pick", "single-role"].includes(tag));
  if (tags.length) console.log(`    tags: ${tags.join(", ")}`);
  for (const line of chosen.explanation ?? []) console.log(`    · ${line}`);
  if (action.ranked.length) {
    const top = action.ranked.slice(0, topCount).map((entry) => {
      const extended = entry as Extended;
      const detail = extended.buckets ? ` [${bucketLine(extended)}]` : "";
      return `${name(entry.championId)}${entry.projectedRole ? `/${entry.projectedRole}` : ""} ${entry.totalScore.toFixed(2)}${detail}`;
    });
    console.log(`    top: ${top.join("\n         ")}`);
  }
  console.log("");
}
