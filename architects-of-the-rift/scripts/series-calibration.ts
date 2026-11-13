// PLAYER_TRAITS §7.4 — calibrare pe serii: serii AI vs AI Bo3 / Bo5 (determinist, seed din seriesId), winrate-ul pe
// numărul jocului pentru echipa cu mai mulți Series Adapters decât adversarul, față de cea cu mai mulți Fast Starters,
// plus valorile efectului de rating pe joc (plafonul). Doar raportează.
//
//   npx tsx scripts/series-calibration.ts [--bo3 300] [--bo5 200]

import { players } from "@/app/data/players";
import { teams } from "@/app/data/teams";
import { simulateAiVsAiSeries } from "@/app/draft-engine/aiSeriesSimulator";
import { getSeriesRatingEffect } from "@/app/draft-engine/traitEffects";
import type { PlayerTrait } from "@/app/types/playerTraits";
import { getActiveTrait } from "@/app/utils/playerTraitUtils";
import "@/app/utils/championMasteryUtils";
import { makeSave, newAiSeries, parseArgs } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const counts = { 3: Number(named.bo3 ?? 300), 5: Number(named.bo5 ?? 200) } as const;
const save = makeSave();

const starters = (slug: string) => {
  const team = teams.find((entry) => entry.slug === slug)!;
  return players.filter((player) => player.teamId === team.id);
};
const traitCount = (slug: string, id: "series_adapter" | "fast_starter") =>
  starters(slug).filter((player) => getActiveTrait(player, id)).length;

type Bucket = Record<number, { games: number; wins: number }>;
const buckets: Record<string, Bucket> = { adapters: {}, starters: {} };
const add = (bucket: Bucket, game: number, won: boolean) => {
  bucket[game] ??= { games: 0, wins: 0 };
  bucket[game].games += 1;
  if (won) bucket[game].wins += 1;
};

const pairs: [string, string][] = [];
for (let i = 0; i < teams.length; i += 1) for (let j = i + 1; j < teams.length; j += 1) pairs.push([teams[i].slug, teams[j].slug]);

let seriesCount = 0;
let gamesCount = 0;
for (const bo of [3, 5] as const) {
  const stride = Math.max(1, Math.floor(pairs.length / counts[bo]));
  for (let index = 0; index < counts[bo]; index += 1) {
    const [left, right] = pairs[(index * stride) % pairs.length];
    const adapterDiff = traitCount(left, "series_adapter") - traitCount(right, "series_adapter");
    const starterDiff = traitCount(left, "fast_starter") - traitCount(right, "fast_starter");
    if (adapterDiff === 0 && starterDiff === 0) continue;
    const series = { ...newAiSeries(`sc${bo}-${index}`, left, right), bo };
    const { series: done } = simulateAiVsAiSeries(series, save);
    seriesCount += 1;
    for (const game of done.games) {
      const simulation = game.simulation;
      if (!simulation || !game.completed) continue;
      gamesCount += 1;
      const winnerSlug = simulation.winnerSide === "blue" ? simulation.blueTeamSlug : simulation.redTeamSlug;
      if (adapterDiff !== 0) add(buckets.adapters, game.number, winnerSlug === (adapterDiff > 0 ? left : right));
      if (starterDiff !== 0) add(buckets.starters, game.number, winnerSlug === (starterDiff > 0 ? left : right));
    }
  }
}

const row = (label: string, bucket: Bucket) =>
  `| ${label} | ${[1, 2, 3, 4, 5].map((game) => (bucket[game] ? `${((bucket[game].wins / bucket[game].games) * 100).toFixed(1)}% (${bucket[game].games})` : "—")).join(" | ")} |`;

const effect = (id: PlayerTrait["id"], intensity: 1 | 2) =>
  [1, 2, 3, 4, 5].map((game) => getSeriesRatingEffect({ traits: [{ id, intensity, source: "manual" }] } as never, game, 5).toFixed(2)).join(" / ");

console.log(
  [
    `# Calibrare pe serii: ${seriesCount} serii (Bo3 + Bo5 cu diferență de trait-uri), ${gamesCount} jocuri`,
    "",
    "Winrate pe numărul jocului (în paranteză: jocuri):",
    "",
    "| Echipa cu mai mulți… | Game 1 | Game 2 | Game 3 | Game 4 | Game 5 |",
    "|---|---|---|---|---|---|",
    row("Series Adapters", buckets.adapters),
    row("Fast Starters", buckets.starters),
    "",
    "Efectul de rating pe joc (game 1 / 2 / 3 / 4 / 5):",
    `- Series Adapter: intensity 1 ${effect("series_adapter", 1)}; intensity 2 ${effect("series_adapter", 2)}`,
    `- Fast Starter: intensity 1 ${effect("fast_starter", 1)}; intensity 2 ${effect("fast_starter", 2)}`,
    "",
  ].join("\n"),
);
