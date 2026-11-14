// Cât contează draftul (DRAFT_SIM_ALIGNMENT §0, §6): test controlat draft bun contra draft slab, corelațiile
// evaluatorului cu rezultatul și din ce factori ai simulării vine diferența de scor.
//
//   npx tsx scripts/draft-importance.ts --quick --out c1-quick
//   npx tsx scripts/draft-importance.ts --out c1 --compare c0
//   npx tsx scripts/draft-importance.ts --out c3 --records   (+ diferențele pe joc, pentru calibrarea ponderilor)
//
// Rezultatele: scripts/.calibration/draft-importance-<out>.{md,json}. --compare <nume> pune coloana „înainte”.
//
// Părți:
//  - weak: perechi de echipe cu nivel aproape egal (|Δ media rosterPoints| < 0.3). O parte draftează cu AI-ul
//    normal, cealaltă slab: `random` = candidat valid aleator; `noisy` = aleator din primele 8 opțiuni ale AI-ului.
//    Fiecare pereche joacă 4 jocuri: fiecare echipă și cu draft bun, și cu slab, pe blue și pe red.
//  - normal: AI vs AI pe perechi din regiuni diferite: corelațiile componentelor evaluatorului cu victoria
//    (toate jocurile și la nivel egal) și descompunerea varianței diferenței de total pe factorii simulării.
// --quick: 40 de perechi × 4 jocuri pentru fiecare draft slab și 400 de jocuri normale (verificări între pași).
// Seed-urile depind doar de seriesId, deci rulările sunt comparabile între commit-uri.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { teams } from "@/app/data/teams";
import { champions } from "@/app/data/champions";
import {
  commitActionToGame,
  evaluateDraftGame,
  getAiChoice,
  getCurrentStep,
  resolveFinishedDraftAssignments,
  simulateDraftResult,
} from "@/app/draft-engine/draftEngine";
import { setDraftDecisionObserver, type DraftDecisionObservation } from "@/app/draft-engine/draftDecision";
import { ROLE_ORDER, type ActiveDraftSeries, type DraftGameState, type Side, type TeamDraftEvaluation } from "@/app/draft-engine/draftTypes";
import { DRAFT_THINKING_CONFIG } from "@/app/draft-engine/draftThinkingConfig";
import { makeSave, newAiSeries, parseArgs, playersById, teamsBySlug } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const quick = named.quick === "true";
const outName = named.out ?? (quick ? "quick" : "full");
const compareName = named.compare;
// --champion-phase-scale X / --lane-matchup-scale Y: valorile din config pentru rularea asta (grila §9).
const simulationConfig = DRAFT_THINKING_CONFIG.simulation as { championPhaseScale: number; laneMatchupScale: number };
if (named["champion-phase-scale"]) simulationConfig.championPhaseScale = Number(named["champion-phase-scale"]);
if (named["lane-matchup-scale"]) simulationConfig.laneMatchupScale = Number(named["lane-matchup-scale"]);
const DIR = "scripts/.calibration";
const save = makeSave();
const championsById = new Map(champions.map((champion) => [champion.id, champion]));

const roster = (slug: string) => save.updatedTeamRosters[teamsBySlug.get(slug)?.id ?? slug] ?? {};
/** Media rosterPoints a titularilor (nivelul echipei). */
const strength = (slug: string) => {
  const values = Object.values(roster(slug)).map((id) => playersById.get(id ?? "")?.rosterPoints).filter((value): value is number => typeof value === "number");
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
};

function unitHash(text: string) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0) / 4294967296;
}

type WeakKind = "random" | "noisy";

/** Un draft complet; partea `weakSide` alege aleator din lista scorată de AI (doar candidați valizi). */
function runDraft(series: ActiveDraftSeries, weakSide: Side | null, weakKind: WeakKind) {
  let game: DraftGameState = series.games[0];
  let last: DraftDecisionObservation | null = null;
  setDraftDecisionObserver((observation) => {
    last = observation;
  });
  try {
    for (let step = getCurrentStep(game); step; step = getCurrentStep(game)) {
      last = null;
      const choice = getAiChoice(series, game, step, save);
      if (!choice) break;
      let picked = choice;
      const observed = last as DraftDecisionObservation | null;
      if (step.side === weakSide && observed?.ranked?.length) {
        const pool = weakKind === "noisy" ? observed.ranked.slice(0, 8) : observed.ranked;
        picked = pool[Math.floor(unitHash(`${series.seriesId}:${game.phaseIndex}`) * pool.length)];
      }
      game = commitActionToGame(game, picked.championId, step.side, step.action, picked.projectedRole);
    }
  } finally {
    setDraftDecisionObserver(null);
  }
  return game;
}

// ─── Componentele evaluatorului ──────────────────────────────────────────────
/** Toate câmpurile numerice din TeamDraftEvaluation, plus câteva derivate. */
function components(evaluation: TeamDraftEvaluation): Record<string, number> {
  const values: Record<string, number> = {};
  for (const [key, value] of Object.entries(evaluation)) if (typeof value === "number") values[key] = value;
  values.missingNeeds = -evaluation.missingNeeds.reduce((sum, need) => sum + need.missing, 0);
  values.contextualUnmet = -(evaluation.contextualNeeds ?? []).filter((need) => need.missing > 0).reduce((sum, need) => sum + need.priority, 0);
  return values;
}

type GameRecord = {
  blue: string;
  red: string;
  weakSide: Side | null;
  winner: Side | null;
  strengthBlue: number;
  strengthRed: number;
  /** blue − red, pe fiecare componentă a evaluatorului. */
  evalDiff: Record<string, number>;
  compositeDiff: number;
  totalDiff: number;
  /** Contribuția fiecărui factor al simulării la diferența de total (blue − red). */
  factorEdges: Record<string, number>;
  offRole: number;
};

function play(prefix: string, blue: string, red: string, weakSide: Side | null, weakKind: WeakKind): GameRecord {
  const series = newAiSeries(prefix, blue, red);
  const game = runDraft(series, weakSide, weakKind);
  const resolved = resolveFinishedDraftAssignments(game, series, save);
  const simulation = simulateDraftResult(resolved, series, save);
  const { evaluationBlue, evaluationRed } = evaluateDraftGame(resolved, series, save);
  const blueValues = components(evaluationBlue);
  const redValues = components(evaluationRed);
  const evalDiff = Object.fromEntries(Object.keys(blueValues).map((key) => [key, blueValues[key] - (redValues[key] ?? 0)]));
  let offRole = 0;
  for (const assignments of [resolved.assignmentsBlue, resolved.assignmentsRed]) {
    for (const role of ROLE_ORDER) {
      const champion = assignments[role] ? championsById.get(assignments[role]!) : undefined;
      if (!champion || !champion.roles.includes(role)) offRole += 1;
    }
  }
  return {
    blue,
    red,
    weakSide,
    winner: simulation.winnerSide,
    strengthBlue: strength(blue),
    strengthRed: strength(red),
    evalDiff,
    compositeDiff: simulation.blueDraftScore - simulation.redDraftScore,
    totalDiff: simulation.blueTotal - simulation.redTotal,
    factorEdges: Object.fromEntries((simulation.outcomeFactors ?? []).map((factor) => [factor.key, factor.edgeBlue])),
    offRole,
  };
}

// ─── Rulare ──────────────────────────────────────────────────────────────────
const started = Date.now();
const balancedPairs: [string, string][] = [];
const crossPairs: [string, string][] = [];
for (let i = 0; i < teams.length; i += 1) {
  for (let j = i + 1; j < teams.length; j += 1) {
    const [a, b] = [teams[i].slug, teams[j].slug];
    if (Math.abs(strength(a) - strength(b)) < 0.3) balancedPairs.push([a, b]);
    if (teams[i].region !== teams[j].region) crossPairs.push([a, b]);
  }
}

/** Fiecare pereche: 4 jocuri (A bun / B slab și invers, A pe blue și pe red), `seeds` runde. */
function runWeak(kind: WeakKind) {
  const pairs = quick ? balancedPairs.filter((_, index) => index % Math.max(1, Math.floor(balancedPairs.length / 40)) === 0).slice(0, 40) : balancedPairs;
  const seeds = quick ? 1 : 2;
  const list: GameRecord[] = [];
  for (let seed = 0; seed < seeds; seed += 1) {
    for (const [a, b] of pairs) {
      for (const [blue, red] of [[a, b], [b, a]] as const) {
        for (const weakSide of ["red", "blue"] as Side[]) list.push(play(`imp${kind}${seed}w${weakSide}`, blue, red, weakSide, kind));
      }
    }
  }
  return list;
}

const weak = { random: runWeak("random"), noisy: runWeak("noisy") };
const normalCount = quick ? 400 : 2000;
const normal: GameRecord[] = [];
for (let n = 0; n < normalCount; n += 1) {
  const [a, b] = crossPairs[(n * 7) % crossPairs.length];
  const seed = Math.floor((n * 7) / crossPairs.length);
  const [blue, red] = n % 2 ? [a, b] : [b, a];
  normal.push(play(`impn${seed}`, blue, red, null, "random"));
}
const seconds = Math.round((Date.now() - started) / 1000);

// ─── Statistici ──────────────────────────────────────────────────────────────
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const sd = (values: number[]) => Math.sqrt(mean(values.map((value) => (value - mean(values)) ** 2)));
function corr(x: number[], y: number[]) {
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i += 1) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}
const share = (part: number, whole: number) => part / Math.max(1, whole);
const blueWon = (record: GameRecord) => (record.winner === "blue" ? 1 : 0);

function weakSummary(list: GameRecord[]) {
  const decided = list.filter((record) => record.winner);
  const toGood = (record: GameRecord, value: number) => (record.weakSide === "red" ? value : -value);
  return {
    games: decided.length,
    goodWins: share(decided.filter((record) => record.winner !== record.weakSide).length, decided.length),
    draftPowerGap: mean(decided.map((record) => toGood(record, record.evalDiff.draftPower))),
    totalGap: mean(decided.map((record) => toGood(record, record.totalDiff))),
    offRole: list.reduce((sum, record) => sum + record.offRole, 0),
    factorGap: Object.fromEntries(Object.keys(decided[0]?.factorEdges ?? {}).map((key) => [key, mean(decided.map((record) => toGood(record, record.factorEdges[key])))])),
  };
}

const decided = normal.filter((record) => record.winner);
const wins = decided.map(blueWon);
const strengthDiff = decided.map((record) => record.strengthBlue - record.strengthRed);
const totals = decided.map((record) => record.totalDiff);
const unequal = decided.filter((record) => record.strengthBlue !== record.strengthRed);
const even = decided.filter((record) => Math.abs(record.strengthBlue - record.strengthRed) < 0.5 && record.evalDiff.draftPower !== 0);
const evenWins = even.map(blueWon);
const betterDraftWins = (list: GameRecord[]) => share(list.filter((record) => (record.winner === "blue") === (record.evalDiff.draftPower > 0)).length, list.length);
const componentKeys = Object.keys(decided[0]?.evalDiff ?? {});
/** v fără partea explicată liniar de s (regresie simplă). */
function residualize(values: number[], by: number[]) {
  const mv = mean(values);
  const mb = mean(by);
  const varB = mean(by.map((value) => (value - mb) ** 2));
  const slope = varB ? mean(values.map((value, i) => (value - mv) * (by[i] - mb))) / varB : 0;
  return values.map((value, i) => value - mv - slope * (by[i] - mb));
}
// Măsura necirculară: draftPower intră în simulare prin compozit, deci corelația lui cu victoria e parțial
// auto-indusă. `simRewards` = diferența de total fără contribuția compozitului (categoria draft + partea din faze,
// ≈ 0.40 × (0.08 × 0.30 + 0.14 × 0.35 + 0.12 × 0.35) pe profilul standard), cu nivelul jucătorilor scos (parțial).
// --records: salvează și diferențele pe joc, pentru calibrarea ponderilor offline.
const COMPOSITE_PHASE_FACTOR = 0.4 * (0.08 * 0.3 + 0.14 * 0.35 + 0.12 * 0.35);
// Nivelul jucătorilor = puterea lor din simulare (factorul `players`), mai fidelă decât media rosterPoints.
const playerEdge = decided.map((record) => record.factorEdges.players ?? 0);
const simRewards = residualize(
  decided.map((record) => record.totalDiff - (record.factorEdges.draft ?? 0) - record.compositeDiff * COMPOSITE_PHASE_FACTOR),
  playerEdge,
);
const varianceTotal = sd(totals) ** 2;

const result = {
  name: outName,
  quick,
  seconds,
  weak: { random: weakSummary(weak.random), noisy: weakSummary(weak.noisy) },
  normal: {
    games: decided.length,
    favoriteWins: share(unequal.filter((record) => (record.winner === "blue") === (record.strengthBlue > record.strengthRed)).length, unequal.length),
    betterDraftEven: betterDraftWins(even),
    evenGames: even.length,
    blueWins: share(wins.filter(Boolean).length, wins.length),
    sdTotalDiff: sd(totals),
    compositeCorr: { win: corr(decided.map((record) => record.compositeDiff), wins), withStrength: corr(decided.map((record) => record.compositeDiff), strengthDiff) },
    components: Object.fromEntries(
      componentKeys.map((key) => {
        const x = decided.map((record) => record.evalDiff[key]);
        return [
          key,
          {
            win: corr(x, wins),
            winEven: corr(even.map((record) => record.evalDiff[key]), evenWins),
            total: corr(x, totals),
            withStrength: corr(x, strengthDiff),
            simRewards: corr(residualize(x, playerEdge), simRewards),
            sd: sd(x),
          },
        ];
      }),
    ),
    // share_k = cov(edge_k, D) / var(D): ce parte din diferența de total vine din factorul k (suma ≈ 1).
    varianceShare: Object.fromEntries(
      Object.keys(decided[0]?.factorEdges ?? {}).map((key) => {
        const edges = decided.map((record) => record.factorEdges[key]);
        return [key, (corr(edges, totals) * sd(edges) * sd(totals)) / Math.max(1e-9, varianceTotal)];
      }),
    ),
  },
};
type Result = typeof result;

// ─── Raport ──────────────────────────────────────────────────────────────────
mkdirSync(DIR, { recursive: true });
writeFileSync(`${DIR}/draft-importance-${outName}.json`, JSON.stringify(result, null, 2));
if (named.records === "true") {
  writeFileSync(
    `${DIR}/draft-importance-${outName}-records.json`,
    JSON.stringify(decided.map((record, i) => ({ evalDiff: record.evalDiff, simRewards: simRewards[i], win: blueWon(record), strengthDiff: strengthDiff[i] }))),
  );
}
const before: Result | null = compareName && existsSync(`${DIR}/draft-importance-${compareName}.json`)
  ? JSON.parse(readFileSync(`${DIR}/draft-importance-${compareName}.json`, "utf8"))
  : null;

const pct = (value: number | undefined) => (value === undefined ? "—" : `${(value * 100).toFixed(1)}%`);
const num = (value: number | undefined, digits = 3) => (value === undefined ? "—" : value.toFixed(digits));
const columns = before ? `| Metrică | Țintă | ${compareName} | ${outName} |\n|---|---|---|---|` : `| Metrică | Țintă | ${outName} |\n|---|---|---|`;
const row = (label: string, target: string, now: string, then?: string) => (before ? `| ${label} | ${target} | ${then ?? "—"} | ${now} |` : `| ${label} | ${target} | ${now} |`);

const lines: string[] = [
  `# Draft importance — ${outName}${quick ? " (quick)" : ""}`,
  "",
  `${result.weak.random.games + result.weak.noisy.games} jocuri draft bun / slab, ${result.normal.games} AI vs AI, ${seconds}s.`,
  "",
  "## Ținte (DRAFT_SIM_ALIGNMENT §0)",
  "",
  columns,
  row("Draft bun contra „top 8 aleator”", "~63–66%", pct(result.weak.noisy.goodWins), pct(before?.weak.noisy.goodWins)),
  row("Draft bun contra draft complet aleator", "~70–78%", pct(result.weak.random.goodWins), pct(before?.weak.random.goodWins)),
  row(`Nivel egal: câștigă draftul mai bun (${result.normal.evenGames} jocuri)`, "~60%", pct(result.normal.betterDraftEven), pct(before?.normal.betterDraftEven)),
  row("Corelația draftPower ↔ victorie, nivel egal", "≥ 0.25", num(result.normal.components.draftPower?.winEven), num(before?.normal.components.draftPower?.winEven)),
  row("Corelația playerFit ↔ nivelul jucătorilor", "≤ 0.5", num(result.normal.components.playerFitScore?.withStrength), num(before?.normal.components.playerFitScore?.withStrength)),
  ...(result.normal.components.choiceFitScore
    ? [row("Corelația choiceFit ↔ nivelul jucătorilor", "≤ 0.5", num(result.normal.components.choiceFitScore.withStrength), num(before?.normal.components.choiceFitScore?.withStrength))]
    : []),
  row("Favoritul câștigă", "65–72%", pct(result.normal.favoriteWins), pct(before?.normal.favoriteWins)),
  row("Winrate blue", "≤ 53%", pct(result.normal.blueWins), pct(before?.normal.blueWins)),
  row("Diferența medie de draftPower (bun − top 8 aleator)", "raportat", num(result.weak.noisy.draftPowerGap, 2), num(before?.weak.noisy.draftPowerGap, 2)),
  row("Diferența medie de draftPower (bun − aleator)", "raportat", num(result.weak.random.draftPowerGap, 2), num(before?.weak.random.draftPowerGap, 2)),
  row("Campioni pe rol greșit (jocurile bun / slab)", "0", String(result.weak.random.offRole + result.weak.noisy.offRole), before ? String(before.weak.random.offRole + before.weak.noisy.offRole) : undefined),
  "",
  "## Corelațiile componentelor evaluatorului (diferența blue − red)",
  "",
  "`win` = cu victoria, toate jocurile; `winEven` = la nivel egal (< 0.5 rosterPoints); `withStrength` = cu diferența de nivel; `simRewards` = cu diferența de total fără contribuția compozitului de draft, nivelul jucătorilor scos din ambele (măsura necirculară).",
  "",
  before ? "| Componentă | win | winEven | withStrength | sd | winEven înainte | withStrength înainte |\n|---|---|---|---|---|---|---|" : "| Componentă | win | winEven | withStrength | sd |\n|---|---|---|---|---|",
  ...Object.entries(result.normal.components)
    .sort((a, b) => Math.abs(b[1].winEven) - Math.abs(a[1].winEven))
    .map(([key, value]) => {
      const old = before?.normal.components[key];
      const base = `| ${key} | ${num(value.win)} | ${num(value.winEven)} | ${num(value.withStrength)} | ${num(value.simRewards)} | ${num(value.sd, 2)} |`;
      return before ? `${base} ${num(old?.winEven)} | ${num(old?.withStrength)} | ${num(old?.simRewards)} |` : base;
    }),
  `| *compozitul de draft (simulare)* | ${num(result.normal.compositeCorr.win)} | — | ${num(result.normal.compositeCorr.withStrength)} | — | — |${before ? " — | — | — |" : ""}`,
  "",
  "## De unde vine diferența de total (AI vs AI)",
  "",
  "`share` = cov(contribuția factorului, diferența de total) / var(diferența de total).",
  "",
  before ? "| Factor | share | înainte |\n|---|---|---|" : "| Factor | share |\n|---|---|",
  ...Object.entries(result.normal.varianceShare).map(([key, value]) => (before ? `| ${key} | ${pct(value)} | ${pct(before.normal.varianceShare[key])} |` : `| ${key} | ${pct(value)} |`)),
  "",
  "## Avantajul draftului bun pe factori (media contribuției, orientată spre draftul bun)",
  "",
  "| Factor | contra aleator | contra top 8 aleator |\n|---|---|---|",
  ...Object.keys(result.weak.random.factorGap).map((key) => `| ${key} | ${num(result.weak.random.factorGap[key])} | ${num(result.weak.noisy.factorGap[key])} |`),
  `| **total** | ${num(result.weak.random.totalGap)} | ${num(result.weak.noisy.totalGap)} |`,
  "",
];
writeFileSync(`${DIR}/draft-importance-${outName}.md`, lines.join("\n"));
console.log(lines.slice(0, 22).join("\n"));
console.log(`\n→ ${DIR}/draft-importance-${outName}.md`);
