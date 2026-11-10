// Calibrare draft (DRAFT_REALISM §14.2): drafturi AI vs AI deterministe pe perechi de echipe
// din regiuni diferite, cu seed-uri fixe, și raportul de realism.
//
//   npx tsx scripts/draft-calibration.ts --games 300 --out scripts/.calibration/<nume>.json
//   npx tsx scripts/draft-calibration.ts --games 300 --out scripts/.calibration/b.json --compare scripts/.calibration/a.json
//
// --seeds K (implicit 3): fiecare pereche se joacă cu K seed-uri (seriesId diferit), pentru diversitate.
// --compare: tabelul de diferențe față de o rulare anterioară + verificarea „decizii identice” (§4.4).
// Seed-urile depind doar de seriesId, deci rulările înainte/după sunt comparabile.

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { teams } from "@/app/data/teams";
import { champions } from "@/app/data/champions";
import type { Role } from "@/app/types/champion";
import {
  evaluateDraftGame,
  resolveFinishedDraftAssignments,
  simulateDraftResult,
} from "@/app/draft-engine/draftEngine";
import { getBotPairTier, getCompletedMustWithPairs, isExplicitBotPair } from "@/app/draft-engine/mustWithPriority";
import { readCompIdentity } from "@/app/draft-engine/compIdentity";
import { buildDraftPillarReport } from "@/app/draft-engine/draftPillarReport";
import { hasThinPool } from "@/app/draft-engine/draftMasteryGate";
import { DRAFT_PHASE_IDS, type DraftPhaseId } from "@/app/draft-engine/draftPhase";
import { ROLE_ORDER, type Side } from "@/app/draft-engine/draftTypes";
import { getChampionGrade } from "@/app/utils/championMasteryUtils";
import {
  getProRoleCount,
  makeSave,
  newAiSeries,
  parseArgs,
  playersById,
  runTracedDraft,
  teamsBySlug,
  type TracedAction,
} from "./draftHarness";

const { named, positional } = parseArgs(process.argv.slice(2));
const gameCount = Number(named.games ?? positional[0] ?? 300);
const seedsPerPair = Math.max(1, Number(named.seeds ?? 3));
const outFile = named.out ?? positional[1];
const compareFile = named.compare;

const save = makeSave();
const championsById = new Map(champions.map((champion) => [champion.id, champion]));

// ─── Perechi din regiuni diferite ────────────────────────────────────────────
const crossPairs: [string, string][] = [];
for (let i = 0; i < teams.length; i += 1) {
  for (let j = i + 1; j < teams.length; j += 1) {
    if (teams[i].region !== teams[j].region) crossPairs.push([teams[i].slug, teams[j].slug]);
  }
}
const pairCount = Math.max(1, Math.ceil(gameCount / seedsPerPair));
const stride = Math.max(1, Math.floor(crossPairs.length / pairCount));
const schedule: { blue: string; red: string; seed: number; pair: number }[] = [];
for (let pair = 0; pair < pairCount && schedule.length < gameCount; pair += 1) {
  const [a, b] = crossPairs[(pair * stride) % crossPairs.length];
  const [blue, red] = pair % 2 === 0 ? [a, b] : [b, a];
  for (let seed = 0; seed < seedsPerPair && schedule.length < gameCount; seed += 1) {
    schedule.push({ blue, red, seed, pair });
  }
}

// ─── Rulare ──────────────────────────────────────────────────────────────────
type CompactAction = {
  i: number;
  s: Side;
  a: "pick" | "ban";
  c: string;
  r: Role | null;
  sc: number;
  rk: number | null;
  it: string | null;
  t: string[];
  top: [string, number][];
};
type GameRecord = {
  seriesId: string;
  pair: number;
  seed: number;
  blue: string;
  red: string;
  winner: Side | null;
  assignmentsBlue: Partial<Record<Role, string>>;
  assignmentsRed: Partial<Record<Role, string>>;
  compIdentityBlue: string;
  compIdentityRed: string;
  /** `readCompIdentity` pe asignările finale (dominant + strength), per side. */
  readingBlue: { dominant: string | null; strength: number; split: boolean };
  readingRed: { dominant: string | null; strength: number; split: boolean };
  /** Notele pe piloni (`buildDraftPillarReport`), per side. */
  pillarsBlue: Record<string, string>;
  pillarsRed: Record<string, string>;
  /** Campioni asignați pe un rol care nu e în `roles` lor. */
  offRole: string[];
  actions: CompactAction[];
};

const LEGACY_INTENTS = new Set(["power", "synergy", "deny", "counter", "comfort", "plan-fill"]);
const KEPT_TAGS = new Set(["mustwith-lock", "forced-off-pool", "mastery-d", "season-ban", "season-counter", "split-identity"]);
const round4 = (value: number) => Math.round(value * 10000) / 10000;

function intentOf(action: TracedAction): string | null {
  const intents = (action.chosen as { intents?: { id: string }[] }).intents;
  if (intents?.length) return intents[0].id;
  return action.chosen.reasonTags?.find((tag) => LEGACY_INTENTS.has(tag)) ?? null;
}

const roster = (slug: string) => save.updatedTeamRosters[teamsBySlug.get(slug)?.id ?? slug] ?? {};
const started = Date.now();
const records: GameRecord[] = [];
const rawActions: TracedAction[][] = [];
let blueWins = 0;
const compIdentities: Record<string, number> = {};
const mustWith = { locks: 0, botPairs: 0, otherPairs: 0 };
const chosenCounter: number[] = [];

for (const entry of schedule) {
  const series = newAiSeries(`cal${entry.pair}s${entry.seed}`, entry.blue, entry.red);
  const { game, actions } = runTracedDraft(series, save);
  const resolved = resolveFinishedDraftAssignments(game, series, save);
  const pillarRosters = { blue: roster(entry.blue), red: roster(entry.red) };
  const pillarGrades = (side: Side) =>
    Object.fromEntries(
      Object.entries(buildDraftPillarReport(resolved, side, series, save, pillarRosters)).map(([key, pillar]) => [key, (pillar as { grade: string }).grade]),
    );
  const reading = (picks: string[], assignments: Partial<Record<Role, string>>) => {
    const value = readCompIdentity(picks, assignments);
    return { dominant: value.dominant, strength: round4(value.strength), split: value.split };
  };
  const offRole: string[] = [];
  for (const assignments of [resolved.assignmentsBlue, resolved.assignmentsRed]) {
    for (const role of ROLE_ORDER) {
      const championId = assignments[role];
      const champion = championId ? championsById.get(championId) : undefined;
      if (champion && !champion.roles.includes(role)) offRole.push(`${champion.id}:${role}`);
    }
  }
  const simulation = simulateDraftResult(resolved, series, save);
  const { evaluationBlue, evaluationRed } = evaluateDraftGame(resolved, series, save);
  if (simulation.winnerSide === "blue") blueWins += 1;
  for (const assignments of [resolved.assignmentsBlue, resolved.assignmentsRed]) {
    for (const pair of getCompletedMustWithPairs(assignments)) {
      if (pair.isBotPair) mustWith.botPairs += 1;
      else mustWith.otherPairs += 1;
    }
  }
  for (const identity of [evaluationBlue.compIdentity, evaluationRed.compIdentity]) {
    compIdentities[identity] = (compIdentities[identity] ?? 0) + 1;
  }
  for (const action of actions) {
    if (action.chosen.reasonTags?.includes("mustwith-lock")) mustWith.locks += 1;
    if (action.action === "pick") chosenCounter.push(action.chosen.counterValue);
  }
  rawActions.push(actions);
  records.push({
    seriesId: series.seriesId,
    pair: entry.pair,
    seed: entry.seed,
    blue: entry.blue,
    red: entry.red,
    winner: simulation.winnerSide,
    assignmentsBlue: resolved.assignmentsBlue,
    assignmentsRed: resolved.assignmentsRed,
    compIdentityBlue: evaluationBlue.compIdentity,
    compIdentityRed: evaluationRed.compIdentity,
    readingBlue: reading(resolved.picksBlue, resolved.assignmentsBlue),
    readingRed: reading(resolved.picksRed, resolved.assignmentsRed),
    pillarsBlue: pillarGrades("blue"),
    pillarsRed: pillarGrades("red"),
    offRole,
    actions: actions.map((action) => ({
      i: action.stepIndex,
      s: action.side,
      a: action.action,
      c: action.championId,
      r: action.chosen.projectedRole ?? null,
      sc: round4(action.chosen.totalScore),
      rk: action.chosen.choiceRank ?? null,
      it: intentOf(action),
      t: (action.chosen.reasonTags ?? []).filter((tag) => KEPT_TAGS.has(tag)),
      top: action.ranked.slice(0, 5).map((candidate) => [candidate.championId, round4(candidate.totalScore)] as [string, number]),
    })),
  });
}

// ─── Metrici ─────────────────────────────────────────────────────────────────
const games = records.length;
const pct = (count: number, total: number) => (total ? count / total : 0);
const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

function pearson(xs: number[], ys: number[]) {
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let index = 0; index < xs.length; index += 1) {
    num += (xs[index] - mx) * (ys[index] - my);
    dx += (xs[index] - mx) ** 2;
    dy += (ys[index] - my) ** 2;
  }
  return dx && dy ? num / Math.sqrt(dx * dy) : 0;
}


// Mastery pe asignările finale.
let totalPicks = 0;
let fPicks = 0;
let fThinPool = 0;
let dPicks = 0;
const fExamples: string[] = [];
// Runda de pick (pick-ul propriu 1..5) pe campion:rol.
const pickRounds = new Map<string, number[]>();
const simPresence = new Map<string, number>();
let r5Total = 0;
let r5Solo = 0;
const flexByPhase: Record<string, { flex: number; total: number }> = {};
let splitComps = 0;
let explicitBotPairs = 0;
let botCombos = 0;
let botTier3 = 0;
let styleGames = 0;
let styleHits = 0;
let styleStrictGames = 0;
let styleStrictHits = 0;
const rankByCreativity: Record<number, { first: number; total: number }> = {};
const intentByPhase: Record<string, Record<string, number>> = {};

records.forEach((record, gameIndex) => {
  const actions = rawActions[gameIndex];
  const seen = new Set<string>();
  for (const action of actions) seen.add(action.championId);
  for (const championId of seen) simPresence.set(championId, (simPresence.get(championId) ?? 0) + 1);

  for (const side of ["blue", "red"] as Side[]) {
    const slug = side === "blue" ? record.blue : record.red;
    const assignments = side === "blue" ? record.assignmentsBlue : record.assignmentsRed;
    const teamRoster = roster(slug);
    const pickActions = actions.filter((action) => action.side === side && action.action === "pick");
    const forced = new Set(pickActions.filter((action) => action.chosen.reasonTags?.includes("forced-off-pool")).map((action) => action.championId));

    for (const role of ROLE_ORDER) {
      const championId = assignments[role];
      const player = playersById.get(teamRoster[role] ?? "");
      if (!championId || !player) continue;
      totalPicks += 1;
      const grade = getChampionGrade(player, championId);
      if (grade === "F" && !forced.has(championId)) {
        if (hasThinPool(player, role)) fThinPool += 1;
        else {
          fPicks += 1;
          if (fExamples.length < 8) fExamples.push(`${record.seriesId} ${player.id}/${role}: ${championId}`);
        }
      }
      if (grade === "D") dPicks += 1;
    }

    pickActions.forEach((action, index) => {
      const role = (ROLE_ORDER.find((entry) => assignments[entry] === action.championId) ?? null) as Role | null;
      if (!role) return;
      const key = `${action.championId}:${role}`;
      const list = pickRounds.get(key) ?? [];
      list.push(index + 1);
      pickRounds.set(key, list);
      if (action.label === "R5" && side === "red") {
        r5Total += 1;
        if (role === "top" || role === "mid") r5Solo += 1;
      }
      const champion = championsById.get(action.championId);
      const bucket = (flexByPhase[action.phase] ??= { flex: 0, total: 0 });
      bucket.total += 1;
      if (champion && getProRoleCount(champion) >= 2) bucket.flex += 1;
    });

    const picks = pickActions.map((action) => action.championId);
    if (readCompIdentity(picks, assignments).split) splitComps += 1;
    if (isExplicitBotPair(assignments.adc, assignments.support)) explicitBotPairs += 1;
    const tier = getBotPairTier(assignments.adc, assignments.support);
    if (tier === 1 || tier === 2) botCombos += 1;
    if (tier === 3) botTier3 += 1;

    const identity = side === "blue" ? record.compIdentityBlue : record.compIdentityRed;
    const styles = teamsBySlug.get(slug)?.identity?.preferredStyles ?? [];
    if (styles.length) {
      styleGames += 1;
      if ((styles as string[]).includes(identity)) styleHits += 1;
      const strict = styles.filter((style) => style !== "balanced");
      if (strict.length) {
        styleStrictGames += 1;
        if ((strict as string[]).includes(identity)) styleStrictHits += 1;
      }
    }
  }

  for (const action of actions) {
    const slug = action.side === "blue" ? record.blue : record.red;
    if (action.chosen.choiceRank !== undefined) {
      const creativity = teamsBySlug.get(slug)?.identity?.creativity ?? 5;
      const bucket = (rankByCreativity[creativity] ??= { first: 0, total: 0 });
      bucket.total += 1;
      if (action.chosen.choiceRank === 0) bucket.first += 1;
    }
    const intent = record.actions.find((entry) => entry.i === action.stepIndex)?.it ?? "n/a";
    const phase = (intentByPhase[action.phase] ??= {});
    phase[intent] = (phase[intent] ?? 0) + 1;
  }
});

// Corelația runda medie de pick ↔ avgPickRound real pe rol (doar date reale pe rol, ≥ 5 pick-uri în simulare).
const corrX: number[] = [];
const corrY: number[] = [];
for (const [key, rounds] of pickRounds) {
  if (rounds.length < 5) continue;
  const [championId, role] = key.split(":") as [string, Role];
  const champion = championsById.get(championId);
  const real = champion?.roleData[role]?.stats?.avgPickRound ?? null;
  if (real === null || real === undefined) continue;
  corrX.push(mean(rounds));
  corrY.push(real);
}
const pickRoundCorrelation = pearson(corrX, corrY);

// Presence: primii 20 după presence real; real = presence / jocuri pro (Σ picks / 10).
const totalProGames = champions.reduce((sum, champion) => sum + (champion.stats.picks ?? 0), 0) / 10;
const top20 = [...champions].sort((a, b) => b.stats.presence - a.stats.presence).slice(0, 20);
const top20Rows = top20.map((champion) => ({
  id: champion.id,
  real: champion.stats.presence / totalProGames,
  sim: (simPresence.get(champion.id) ?? 0) / Math.max(1, games),
}));
const presenceRatio = top20Rows.reduce((sum, row) => sum + row.sim, 0) / Math.max(1e-9, top20Rows.reduce((sum, row) => sum + row.real, 0));

// Diversitate: aceeași pereche, seed-uri diferite, secvența celor 20 de acțiuni identică.
const byPair = new Map<number, GameRecord[]>();
for (const record of records) byPair.set(record.pair, [...(byPair.get(record.pair) ?? []), record]);
let seedComparisons = 0;
let identicalDrafts = 0;
for (const group of byPair.values()) {
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      seedComparisons += 1;
      if (group[i].actions.map((a) => a.c).join(",") === group[j].actions.map((a) => a.c).join(",")) identicalDrafts += 1;
    }
  }
}

const lowCreativity = Object.entries(rankByCreativity)
  .filter(([creativity]) => Number(creativity) <= 3)
  .reduce((acc, [, bucket]) => ({ first: acc.first + bucket.first, total: acc.total + bucket.total }), { first: 0, total: 0 });

const flexRate = (phase: DraftPhaseId) => pct(flexByPhase[phase]?.flex ?? 0, flexByPhase[phase]?.total ?? 0);

const offRolePicks = records.reduce((sum, record) => sum + record.offRole.length, 0);

// Identitate (readCompIdentity) și strength, pe echipe.
const readings = records.flatMap((record) => [record.readingBlue, record.readingRed]);
const readingDistribution: Record<string, number> = {};
for (const entry of readings) readingDistribution[entry.dominant ?? "balanced"] = (readingDistribution[entry.dominant ?? "balanced"] ?? 0) + 1;
const strengthBuckets = { "< 0.2": 0, "0.2–0.35": 0, "0.35–0.55": 0, "≥ 0.55": 0 };
for (const entry of readings) {
  const value = entry.strength;
  if (value >= 0.55) strengthBuckets["≥ 0.55"] += 1;
  else if (value >= 0.35) strengthBuckets["0.35–0.55"] += 1;
  else if (value >= 0.2) strengthBuckets["0.2–0.35"] += 1;
  else strengthBuckets["< 0.2"] += 1;
}
const strengthMean = mean(readings.map((entry) => entry.strength));

// Notele pe piloni, pe echipe.
const pillarDistribution: Record<string, Record<string, number>> = {};
for (const record of records) {
  for (const grades of [record.pillarsBlue, record.pillarsRed]) {
    for (const [pillar, value] of Object.entries(grades)) {
      const bucket = (pillarDistribution[pillar] ??= { A: 0, B: 0, C: 0, D: 0 });
      bucket[value] = (bucket[value] ?? 0) + 1;
    }
  }
}

type Metric = { id: string; label: string; value: number; target: string; ok: boolean | null; format: "int" | "pct" | "num" };
const metrics: Metric[] = [
  { id: "offRole", label: "Campioni pe roluri care nu sunt în `roles`", value: offRolePicks, target: "0", ok: offRolePicks === 0, format: "int" },
  { id: "fPicks", label: "Pick-uri cu F (fără forced-off-pool / pool subțire)", value: fPicks, target: "0", ok: fPicks === 0, format: "int" },
  { id: "fThinPool", label: "Pick-uri cu F pe pool subțire (gate inactiv)", value: fThinPool, target: "raportat", ok: null, format: "int" },
  { id: "dPicks", label: "Pick-uri cu D", value: pct(dPicks, totalPicks), target: "< 3%", ok: pct(dPicks, totalPicks) < 0.03, format: "pct" },
  { id: "pickRoundCorr", label: `Corelație rundă pick ↔ avgPickRound real (${corrX.length} campion:rol)`, value: pickRoundCorrelation, target: "≥ 0.5", ok: pickRoundCorrelation >= 0.5, format: "num" },
  { id: "presenceTop20", label: "Presence top 20 real: simulare / real", value: presenceRatio, target: "≥ 60%", ok: presenceRatio >= 0.6, format: "pct" },
  { id: "r5Solo", label: "R5 pe top/mid", value: pct(r5Solo, r5Total), target: "raportat (pro: majoritar)", ok: null, format: "pct" },
  { id: "flexPick1Open", label: "Pick-uri flex în pick1-open", value: flexRate("pick1-open"), target: "> pick2", ok: flexRate("pick1-open") > flexRate("pick2"), format: "pct" },
  { id: "flexPick2", label: "Pick-uri flex în pick2", value: flexRate("pick2"), target: "raportat", ok: null, format: "pct" },
  { id: "split", label: "Comp-uri split", value: pct(splitComps, games * 2), target: "< 15%", ok: pct(splitComps, games * 2) < 0.15, format: "pct" },
  { id: "explicitBotPairs", label: "Perechi bot explicite (mustWith / synergy ≥ 4)", value: pct(explicitBotPairs, games * 2), target: "raportat", ok: null, format: "pct" },
  { id: "botCombos", label: "Combo-uri bot (tier 1–2: mustWith / synergy 5)", value: pct(botCombos, games * 2), target: "raportat", ok: null, format: "pct" },
  { id: "botTier3", label: "Perechi bot tier 3 (synergy 4)", value: pct(botTier3, games * 2), target: "raportat", ok: null, format: "pct" },
  { id: "blueWinrate", label: "Winrate blue", value: pct(blueWins, games), target: "45–55%", ok: pct(blueWins, games) >= 0.45 && pct(blueWins, games) <= 0.55, format: "pct" },
  { id: "preferredStyles", label: "Draftează un stil din preferredStyles (cu balanced)", value: pct(styleHits, styleGames), target: "≥ 40%", ok: pct(styleHits, styleGames) >= 0.4, format: "pct" },
  { id: "preferredStylesStrict", label: "… fără balanced", value: pct(styleStrictHits, styleStrictGames), target: "raportat", ok: null, format: "pct" },
  { id: "identicalDrafts", label: "Drafturi identice, aceeași pereche, seed-uri diferite", value: pct(identicalDrafts, seedComparisons), target: "< 10%", ok: pct(identicalDrafts, seedComparisons) < 0.1, format: "pct" },
  { id: "lowCreativityFirst", label: "creativity ≤ 3: aleg primul candidat", value: pct(lowCreativity.first, lowCreativity.total), target: "≥ 80%", ok: pct(lowCreativity.first, lowCreativity.total) >= 0.8, format: "pct" },
];

const formatValue = (metric: Pick<Metric, "format">, value: number) =>
  metric.format === "int" ? String(value) : metric.format === "pct" ? `${(value * 100).toFixed(1)}%` : value.toFixed(3);

// ─── Comparare (§14.3) ───────────────────────────────────────────────────────
type Saved = { report: { metrics: Metric[] }; games: GameRecord[] };
let compareSection = "";
let identity: { games: number; identicalGames: number; actions: number; differentChoices: number; scoreDiffs: number; maxScoreDiff: number } | null = null;
if (compareFile) {
  const base = JSON.parse(readFileSync(compareFile, "utf8")) as Saved;
  const baseById = new Map(base.games.map((game) => [game.seriesId, game]));
  identity = { games: 0, identicalGames: 0, actions: 0, differentChoices: 0, scoreDiffs: 0, maxScoreDiff: 0 };
  for (const record of records) {
    const other = baseById.get(record.seriesId);
    if (!other) continue;
    identity.games += 1;
    let same = true;
    record.actions.forEach((action, index) => {
      const otherAction = other.actions[index];
      identity!.actions += 1;
      if (!otherAction || otherAction.c !== action.c) {
        identity!.differentChoices += 1;
        same = false;
        return;
      }
      // Alegerea și primii 5 candidați: același campion, același scor (± 0.001).
      const pairs: [number, number][] = [[otherAction.sc, action.sc]];
      action.top.forEach((candidate, rank) => {
        const before = otherAction.top[rank];
        if (!before || before[0] !== candidate[0]) pairs.push([Infinity, 0]);
        else pairs.push([before[1], candidate[1]]);
      });
      const diff = Math.max(...pairs.map(([a, b]) => Math.abs(a - b)));
      if (diff > 0.001) identity!.scoreDiffs += 1;
      if (Number.isFinite(diff)) identity!.maxScoreDiff = Math.max(identity!.maxScoreDiff, diff);
    });
    if (same) identity.identicalGames += 1;
  }
  const baseMetrics = new Map(base.report.metrics.map((metric) => [metric.id, metric]));
  const rows = metrics.map((metric) => {
    const before = baseMetrics.get(metric.id);
    const delta = before ? metric.value - before.value : null;
    const deltaText =
      delta === null ? "–" : metric.format === "pct" ? `${delta >= 0 ? "+" : ""}${(delta * 100).toFixed(1)} pp` : `${delta >= 0 ? "+" : ""}${metric.format === "int" ? delta : delta.toFixed(3)}`;
    return `| ${metric.label} | ${before ? formatValue(metric, before.value) : "–"} | ${formatValue(metric, metric.value)} | ${deltaText} |`;
  });
  compareSection = [
    `## Comparație cu \`${compareFile}\``,
    "",
    `Jocuri comune: ${identity.games} · identice (aceleași 20 de acțiuni): ${identity.identicalGames} · alegeri diferite: ${identity.differentChoices}/${identity.actions} · scor diferit (> 0.001) sau alt top 5 pe aceeași alegere: ${identity.scoreDiffs} · diferența maximă: ${identity.maxScoreDiff.toFixed(4)}`,
    "",
    "| Metrică | Înainte | Acum | Δ |",
    "|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
}

// ─── Raport ──────────────────────────────────────────────────────────────────
const statusMark = (ok: boolean | null) => (ok === null ? "·" : ok ? "ok" : "**NU**");
const intentTable = DRAFT_PHASE_IDS.map((phase) => {
  const counts = intentByPhase[phase] ?? {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([intent, count]) => `${intent} ${(pct(count, total) * 100).toFixed(0)}%`)
    .join(", ");
  return `| ${phase} | ${top} |`;
});
const creativityTable = Object.entries(rankByCreativity)
  .sort((a, b) => Number(a[0]) - Number(b[0]))
  .map(([creativity, bucket]) => `| ${creativity} | ${(pct(bucket.first, bucket.total) * 100).toFixed(1)}% | ${bucket.total} |`);

const markdown = [
  `# Calibrare draft: ${games} jocuri (${byPair.size} perechi × ${seedsPerPair} seed-uri), ${Math.round((Date.now() - started) / 1000)} s`,
  "",
  "| Metrică | Valoare | Țintă | |",
  "|---|---|---|---|",
  ...metrics.map((metric) => `| ${metric.label} | ${formatValue(metric, metric.value)} | ${metric.target} | ${statusMark(metric.ok)} |`),
  "",
  compareSection,
  "## Intenția principală pe fază",
  "",
  "| Faza | Distribuție |",
  "|---|---|",
  ...intentTable,
  "",
  "## Identitate (readCompIdentity) și strength",
  "",
  `Identități: ${Object.entries(readingDistribution).sort((a, b) => b[1] - a[1]).map(([id, count]) => `${id} ${(pct(count, readings.length) * 100).toFixed(1)}%`).join(", ")}`,
  "",
  `Strength (medie ${strengthMean.toFixed(3)}): ${Object.entries(strengthBuckets).map(([label, count]) => `${label} ${(pct(count, readings.length) * 100).toFixed(1)}%`).join(" · ")}`,
  "",
  "## Note pe piloni",
  "",
  "| Pilon | A | B | C | D |",
  "|---|---|---|---|---|",
  ...Object.entries(pillarDistribution).map(([pillar, counts]) => {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return `| ${pillar} | ${["A", "B", "C", "D"].map((g) => `${(pct(counts[g] ?? 0, total) * 100).toFixed(1)}%`).join(" | ")} |`;
  }),
  "",
  "## Primul candidat ales, pe creativity",
  "",
  "| creativity | primul | acțiuni |",
  "|---|---|---|",
  ...creativityTable,
  "",
  "## Presence top 20 (real vs simulare)",
  "",
  top20Rows.map((row) => `${row.id} ${(row.real * 100).toFixed(0)}→${(row.sim * 100).toFixed(0)}%`).join(" · "),
  "",
  `Identități finale: ${Object.entries(compIdentities).sort((a, b) => b[1] - a[1]).map(([id, count]) => `${id} ${count}`).join(", ")}`,
  `mustWith: lock-uri ${mustWith.locks}, perechi bot ${mustWith.botPairs}, alte perechi ${mustWith.otherPairs} · counterValue mediu ales ${mean(chosenCounter).toFixed(3)}`,
  ...(fExamples.length ? ["", `Exemple F: ${fExamples.join("; ")}`] : []),
  "",
].join("\n");

console.log(markdown);
if (outFile) {
  mkdirSync(dirname(outFile), { recursive: true });
  const report = { games, seedsPerPair, metrics, compIdentities, mustWith, intentByPhase, rankByCreativity, identity, readingDistribution, strengthBuckets, strengthMean, pillarDistribution };
  writeFileSync(outFile, JSON.stringify({ report, games: records }));
  writeFileSync(outFile.replace(/\.json$/, "") + ".md", markdown);
}
if (identity && named["expect-identical"] === "true" && (identity.differentChoices > 0 || identity.scoreDiffs > 0)) {
  console.error("Deciziile NU sunt identice cu rularea de bază.");
  process.exit(1);
}
