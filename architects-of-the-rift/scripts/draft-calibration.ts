// Calibrare draft (DRAFT_REWORK §4.9): rulează N jocuri AI vs AI deterministe
// și raportează influența counter-urilor în draft și în simulare.
//
//   npx tsx scripts/draft-calibration.ts [numărJocuri=50] [out.json]
//
// Seed-urile depind doar de seriesId, deci rulările înainte/după sunt comparabile.

import { writeFileSync } from "fs";
import { teams } from "@/app/data/teams";
import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import {
  commitActionToGame,
  createInitialSeries,
  evaluateDraftGame,
  getAiChoice,
  getCurrentGameUnavailableChampionIds,
  getCurrentStep,
  resolveFinishedDraftAssignments,
  simulateDraftResult,
} from "@/app/draft-engine/draftEngine";
import { scoreDraftCandidate } from "@/app/draft-engine/draftAI";
import {
  getCompletedMustWithPairs,
  getUnavailableChampionIds,
  isProtectedOwnPartner,
} from "@/app/draft-engine/mustWithPriority";
import type { DraftGameState, DraftSave } from "@/app/draft-engine/draftTypes";

// Rosterele originale ale echipelor, construite ca în pagina de draft.
const updatedTeamRosters: Record<string, Record<Role, string>> = {};
for (const team of teams) {
  const roster = { top: "", jungle: "", mid: "", adc: "", support: "" } as Record<Role, string>;
  for (const player of players) if (player.teamId === team.id) roster[player.role] = player.id;
  updatedTeamRosters[team.id] = roster;
}
const save: DraftSave = {
  region: "all",
  controlledTeamSlug: "__none__",
  budget: 0,
  roster: { top: "", jungle: "", mid: "", adc: "", support: "" },
  updatedTeamRosters,
  playerTeamAssignments: {},
  freeAgentPlayerIds: [],
};

const gameCount = Number(process.argv[2] ?? 50);
const outFile = process.argv[3];

const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
const std = (values: number[]) => {
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
};

const chosenCounter: number[] = [];
const candidateCounter: number[] = [];
let blueWins = 0;
let evalEdgeGames = 0;
let evalEdgeWins = 0;
let draftEdgeGames = 0;
let draftEdgeWins = 0;
const counterScoreDiffs: number[] = [];
const games: unknown[] = [];
const compIdentities: Record<string, number> = {};
const mustWith = { locks: 0, botPairs: 0, otherPairs: 0, ownPartnerBans: 0 };
const bluePhaseWins = { early: 0, mid: 0, late: 0 };

const started = Date.now();
for (let index = 0; index < gameCount; index += 1) {
  const blue = teams[index % teams.length].slug;
  const red = teams[(index * 7 + 3) % teams.length].slug;
  if (blue === red) continue;
  const series = createInitialSeries(`cal${index}-${blue}-${red}`, "__none__");
  series.userSide = "__ai__" as never; // ambele echipe sunt AI

  let game: DraftGameState = series.games[0];
  const draftCounter = { blue: 0, red: 0 };
  for (let step = getCurrentStep(game); step; step = getCurrentStep(game)) {
    if (step.action === "pick") {
      const unavailable = getCurrentGameUnavailableChampionIds(series, game);
      const pool = champions
        .filter((champion) => !unavailable.has(champion.id))
        .sort((a, b) => (b.stats.prioScore + b.stats.presence * 0.5) - (a.stats.prioScore + a.stats.presence * 0.5))
        .slice(0, 50);
      for (const candidate of pool) {
        const breakdown = scoreDraftCandidate(candidate, step, game, series, save);
        if (!breakdown.reasonTags?.includes("invalid-role-map")) candidateCounter.push(breakdown.counterValue);
      }
    }
    const choice = getAiChoice(series, game, step, save);
    if (!choice) break;
    if (choice.reasonTags?.includes("mustwith-lock")) mustWith.locks += 1;
    if (step.action === "ban") {
      const teamSlug = step.side === "blue" ? series.blueTeamSlug : series.redTeamSlug;
      const ctx = {
        ownPicks: step.side === "blue" ? game.picksBlue : game.picksRed,
        roster: updatedTeamRosters[teamSlug] ?? {},
        unavailable: getUnavailableChampionIds(series, game),
      };
      if (isProtectedOwnPartner(choice.championId, ctx)) mustWith.ownPartnerBans += 1;
    }
    if (step.action === "pick") {
      chosenCounter.push(choice.counterValue);
      draftCounter[step.side] += choice.counterValue - 5;
    }
    game = commitActionToGame(game, choice.championId, step.side, step.action, choice.projectedRole);
  }

  const resolved = resolveFinishedDraftAssignments(game, series, save);
  const simulation = simulateDraftResult(resolved, series, save);
  const { evaluationBlue, evaluationRed } = evaluateDraftGame(resolved, series, save);
  const winner = simulation.winnerSide;
  if (winner === "blue") blueWins += 1;
  for (const phase of ["early", "mid", "late"] as const) {
    if (simulation.bluePhaseScores.phases[phase].phaseTotal > simulation.redPhaseScores.phases[phase].phaseTotal) bluePhaseWins[phase] += 1;
  }
  for (const assignments of [resolved.assignmentsBlue, resolved.assignmentsRed]) {
    for (const pair of getCompletedMustWithPairs(assignments)) {
      if (pair.isBotPair) mustWith.botPairs += 1;
      else mustWith.otherPairs += 1;
    }
  }

  const counterDiff = evaluationBlue.counterScore - evaluationRed.counterScore;
  counterScoreDiffs.push(counterDiff);
  if (Math.abs(counterDiff) > 0.05) {
    evalEdgeGames += 1;
    if ((counterDiff > 0) === (winner === "blue")) evalEdgeWins += 1;
  }
  const draftDiff = draftCounter.blue - draftCounter.red;
  if (Math.abs(draftDiff) > 0.05) {
    draftEdgeGames += 1;
    if ((draftDiff > 0) === (winner === "blue")) draftEdgeWins += 1;
  }
  games.push({
    seriesId: series.seriesId,
    picksBlue: resolved.assignmentsBlue,
    picksRed: resolved.assignmentsRed,
    winner,
    counterScoreBlue: evaluationBlue.counterScore,
    counterScoreRed: evaluationRed.counterScore,
    compIdentityBlue: evaluationBlue.compIdentity,
    compIdentityRed: evaluationRed.compIdentity,
  });
  for (const identity of [evaluationBlue.compIdentity, evaluationRed.compIdentity]) {
    compIdentities[identity] = (compIdentities[identity] ?? 0) + 1;
  }
}

const report = {
  games: games.length,
  seconds: Math.round((Date.now() - started) / 1000),
  counterValue: {
    chosen: { mean: +mean(chosenCounter).toFixed(3), std: +std(chosenCounter).toFixed(3), n: chosenCounter.length },
    candidates: { mean: +mean(candidateCounter).toFixed(3), std: +std(candidateCounter).toFixed(3), n: candidateCounter.length },
  },
  evaluatorCounterScoreDiff: { meanAbs: +mean(counterScoreDiffs.map(Math.abs)).toFixed(3), std: +std(counterScoreDiffs).toFixed(3) },
  winrate: {
    blue: +(blueWins / Math.max(1, games.length)).toFixed(3),
    sideWithEvaluatorCounterEdge: +(evalEdgeWins / Math.max(1, evalEdgeGames)).toFixed(3),
    sideWithDraftCounterEdge: +(draftEdgeWins / Math.max(1, draftEdgeGames)).toFixed(3),
    bluePhase: {
      early: +(bluePhaseWins.early / Math.max(1, games.length)).toFixed(3),
      mid: +(bluePhaseWins.mid / Math.max(1, games.length)).toFixed(3),
      late: +(bluePhaseWins.late / Math.max(1, games.length)).toFixed(3),
    },
  },
  mustWith,
  /** Distribuția identității finale a compozițiilor (evaluator), pe echipe. */
  compIdentities,
};
console.log(JSON.stringify(report, null, 2));
if (outFile) writeFileSync(outFile, JSON.stringify({ report, games }, null, 2));
