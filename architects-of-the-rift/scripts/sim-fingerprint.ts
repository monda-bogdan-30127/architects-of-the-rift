// Amprenta deterministă a drafturilor AI vs AI și a simulării (COMP_ATTRIBUTES_EXPANSION §6.2): pentru fiecare joc,
// un hash pe acțiuni (alegere + scor + top 5), pe evaluarea draftului și pe rezultatul complet al simulării.
// Două rulări cu aceleași date și același cod dau fișiere identice; după o schimbare „fără efecte”, la fel.
//
//   npx tsx scripts/sim-fingerprint.ts --games 120 --out scripts/.calibration/fp-a.txt
//   npx tsx scripts/sim-fingerprint.ts --games 120 --out scripts/.calibration/fp-b.txt --compare scripts/.calibration/fp-a.txt

import { createHash } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { teams } from "@/app/data/teams";
import { evaluateDraftGame, resolveFinishedDraftAssignments, simulateDraftResult } from "@/app/draft-engine/draftEngine";
import { makeSave, newAiSeries, parseArgs, runTracedDraft } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const gameCount = Number(named.games ?? 120);
const outFile = named.out;
const compareFile = named.compare;

const save = makeSave();
const pairs: [string, string][] = [];
for (let i = 0; i < teams.length; i += 1) {
  for (let j = i + 1; j < teams.length; j += 1) pairs.push([teams[i].slug, teams[j].slug]);
}
const stride = Math.max(1, Math.floor(pairs.length / gameCount));

const hash = (value: unknown) => createHash("sha1").update(JSON.stringify(value)).digest("hex").slice(0, 12);
// Câmpurile care depind de ceas, nu de logică. Într-un vector de compoziție (are `frontline` și `scaling`),
// valorile 0 se omit: un atribut nou, gol în date, nu schimbă comportamentul, doar forma obiectului.
const isCompVector = (entry: unknown): entry is Record<string, number> =>
  Boolean(entry && typeof entry === "object" && !Array.isArray(entry) && "frontline" in entry && "scaling" in entry);
const stripVolatile = (value: unknown): unknown =>
  JSON.parse(
    JSON.stringify(value, (key, entry) => {
      if (key === "completedAt" || key === "timestamp") return undefined;
      if (isCompVector(entry)) return Object.fromEntries(Object.entries(entry).filter(([, amount]) => amount !== 0));
      return entry;
    }),
  );

const lines: string[] = [];
for (let index = 0; index < gameCount; index += 1) {
  const [blue, red] = pairs[(index * stride) % pairs.length];
  const series = newAiSeries(`fp${index}`, blue, red);
  const { game, actions } = runTracedDraft(series, save);
  const resolved = resolveFinishedDraftAssignments(game, series, save);
  const evaluation = evaluateDraftGame(resolved, series, save);
  const simulation = simulateDraftResult(resolved, series, save);
  const draft = actions.map((action) => [
    action.chosen.championId,
    Math.round(action.chosen.totalScore * 1e6),
    action.ranked.slice(0, 5).map((entry) => [entry.championId, Math.round(entry.totalScore * 1e6)]),
  ]);
  lines.push(`${series.seriesId} draft=${hash(draft)} eval=${hash(stripVolatile(evaluation))} sim=${hash(stripVolatile(simulation))} winner=${simulation.winnerSide}`);
}

const output = lines.join("\n") + "\n";
if (outFile) {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, output);
}
if (compareFile) {
  const base = readFileSync(compareFile, "utf8").trim().split("\n");
  const diff = { draft: 0, eval: 0, sim: 0 };
  base.forEach((line, i) => {
    const [, ...fields] = line.split(" ");
    const [, ...now] = (lines[i] ?? "").split(" ");
    if (fields[0] !== now[0]) diff.draft += 1;
    if (fields[1] !== now[1]) diff.eval += 1;
    if (fields[2] !== now[2]) diff.sim += 1;
  });
  console.log(`${lines.length} jocuri; diferențe față de ${compareFile}: draft ${diff.draft}, evaluare ${diff.eval}, simulare ${diff.sim}`);
  if (diff.draft || diff.eval || diff.sim) process.exitCode = 1;
} else {
  console.log(`${lines.length} jocuri → ${outFile ?? "stdout"}`);
  if (!outFile) process.stdout.write(output);
}
