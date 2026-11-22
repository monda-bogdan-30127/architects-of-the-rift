// NEXT_STEPS 8 — măsurătoarea dedicată pentru Spirit în rezultat: aceleași meciuri (draft AI vs AI), simulate o dată
// cu Spirit neutru (65) pe echipa controlată și o dată cu Spirit injectat. Diferența de winrate a echipei controlate
// față de neutru, pe situații. Plus rata condiționată a greșelilor de macro (AI vs AI): cât de des schimbă
// câștigătorul în jocurile în care apar (macroMistakeScale 0 față de valoarea din config).
//
//   npx tsx scripts/spirit-impact.ts --games 600 --seed-tag s1 [--spirit-scale 4 --macro-scale 4]

import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type { PlayerSpiritStore } from "@/app/types/spirit";
import { resolveFinishedDraftAssignments, simulateDraftResult } from "@/app/draft-engine/draftEngine";
import { DRAFT_THINKING_CONFIG } from "@/app/draft-engine/draftThinkingConfig";
import { ROLE_ORDER, type ActiveDraftSeries, type DraftGameState, type DraftSave } from "@/app/draft-engine/draftTypes";
import { setSpiritStoreOverride } from "@/app/draft-engine/playerSpiritStorage";
import { makeSave, newAiSeries, parseArgs, runTracedDraft } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const gameCount = Number(named.games ?? 400);
const seedTag = named["seed-tag"] ?? "";
// Grilă: --spirit-scale X (spirit.phaseEffectScale), --macro-scale Y (simulation.macroMistakeScale).
if (named["spirit-scale"]) (DRAFT_THINKING_CONFIG.spirit as { phaseEffectScale: number }).phaseEffectScale = Number(named["spirit-scale"]);
if (named["macro-scale"]) (DRAFT_THINKING_CONFIG.simulation as { macroMistakeScale: number }).macroMistakeScale = Number(named["macro-scale"]);

const NEUTRAL = 65;
const MOTIVATED = 90;
const UNHAPPY = 30;
const ON_EDGE = 15;

type Situation = { key: string; label: string; spirit: (role: Role, focusRole: Role) => number };
const SITUATIONS: Situation[] = [
  { key: "one-motivated", label: "un jucător Motivated (90)", spirit: (role, focus) => (role === focus ? MOTIVATED : NEUTRAL) },
  { key: "one-unhappy", label: "un jucător Unhappy (30)", spirit: (role, focus) => (role === focus ? UNHAPPY : NEUTRAL) },
  { key: "all-motivated", label: "toată echipa Motivated (90)", spirit: () => MOTIVATED },
  { key: "all-unhappy", label: "toată echipa Unhappy (30)", spirit: () => UNHAPPY },
  { key: "all-on-edge", label: "toată echipa On Edge (15)", spirit: () => ON_EDGE },
];

const baseSave = makeSave();
const pairs: [string, string][] = [];
for (let i = 0; i < teams.length; i += 1) {
  for (let j = i + 1; j < teams.length; j += 1) pairs.push([teams[i].slug, teams[j].slug]);
}
const stride = Math.max(1, Math.floor(pairs.length / gameCount));

function spiritStore(roster: Partial<Record<Role, string>>, value: (role: Role) => number): PlayerSpiritStore {
  const spirits: Record<string, number> = {};
  for (const role of ROLE_ORDER) if (roster[role]) spirits[roster[role]!] = value(role);
  return { version: 1, spirits, history: [], streaks: {}, leadershipCycleCounter: 0, lastUpdatedAt: 0 };
}

function controlledWins(game: DraftGameState, series: ActiveDraftSeries, save: DraftSave, side: "blue" | "red") {
  return simulateDraftResult(game, series, save).winnerSide === side;
}

const wins: Record<string, number> = { neutral: 0 };
const flips: Record<string, number> = {};
for (const situation of SITUATIONS) {
  wins[situation.key] = 0;
  flips[situation.key] = 0;
}
let macroGames = 0;
let macroFlips = 0;
const macroScale = DRAFT_THINKING_CONFIG.simulation.macroMistakeScale;

for (let index = 0; index < gameCount; index += 1) {
  const [blue, red] = pairs[(index * stride) % pairs.length];
  const series = newAiSeries(`spirit${index}${seedTag}`, blue, red);
  const { game } = runTracedDraft(series, baseSave);
  const resolved = resolveFinishedDraftAssignments(game, series, baseSave);

  // Greșelile de macro, AI vs AI (fără echipă controlată): cu și fără efectul în rezultat.
  setSpiritStoreOverride(null);
  const withMistakes = simulateDraftResult(resolved, series, baseSave);
  const mistakeHappened = withMistakes.playerScores?.some((score) => score.note === "macro mistake" || score.note === "cost the team");
  if (mistakeHappened) {
    (DRAFT_THINKING_CONFIG.simulation as { macroMistakeScale: number }).macroMistakeScale = 0;
    const without = simulateDraftResult(resolved, series, baseSave);
    (DRAFT_THINKING_CONFIG.simulation as { macroMistakeScale: number }).macroMistakeScale = macroScale;
    macroGames += 1;
    if (without.winnerSide !== withMistakes.winnerSide) macroFlips += 1;
  }

  // Echipa controlată: alternativ blue / red; jucătorul „focus” se rotește pe roluri.
  const side: "blue" | "red" = index % 2 === 0 ? "blue" : "red";
  const controlledSlug = side === "blue" ? blue : red;
  const save: DraftSave = { ...baseSave, controlledTeamSlug: controlledSlug };
  const roster = baseSave.updatedTeamRosters[controlledSlug] ?? {};
  const focusRole = ROLE_ORDER[index % ROLE_ORDER.length];

  setSpiritStoreOverride(spiritStore(roster, () => NEUTRAL));
  const neutralWin = controlledWins(resolved, series, save, side);
  if (neutralWin) wins.neutral += 1;
  for (const situation of SITUATIONS) {
    setSpiritStoreOverride(spiritStore(roster, (role) => situation.spirit(role, focusRole)));
    const win = controlledWins(resolved, series, save, side);
    if (win) wins[situation.key] += 1;
    if (win !== neutralWin) flips[situation.key] += 1;
  }
  setSpiritStoreOverride(null);
}

const pct = (value: number) => (100 * value) / gameCount;
console.log(`# Spirit în rezultat (${gameCount} jocuri${seedTag ? `, seed ${seedTag}` : ""})\n`);
console.log(`Echipa controlată, Spirit neutru (65): ${pct(wins.neutral).toFixed(1)}%\n`);
console.log("| Situație | Winrate | Față de neutru | Câștigători schimbați |");
console.log("|---|---|---|---|");
for (const situation of SITUATIONS) {
  const delta = pct(wins[situation.key]) - pct(wins.neutral);
  console.log(`| ${situation.label} | ${pct(wins[situation.key]).toFixed(1)}% | ${delta >= 0 ? "+" : ""}${delta.toFixed(1)} | ${pct(flips[situation.key]).toFixed(1)}% |`);
}
console.log(`\nGreșeli de macro (AI vs AI): apar în ${macroGames} jocuri (${pct(macroGames).toFixed(1)}%); schimbă câștigătorul în ${macroFlips} (${macroGames ? ((100 * macroFlips) / macroGames).toFixed(1) : "0"}% dintre ele).`);
console.log(`DELTA ${JSON.stringify(Object.fromEntries(SITUATIONS.map((s) => [s.key, pct(wins[s.key]) - pct(wins.neutral)])))} MACRO ${macroGames} ${macroFlips}`);
