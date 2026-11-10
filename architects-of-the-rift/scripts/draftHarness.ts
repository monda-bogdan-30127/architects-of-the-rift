// Infrastructura comună pentru scripts/draft-trace.ts și scripts/draft-calibration.ts
// (DRAFT_REALISM §14). Draft AI vs AI determinist: seed-ul vine din seriesId.

import { teams } from "@/app/data/teams";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import {
  commitActionToGame,
  createInitialSeries,
  getAiChoice,
  getCurrentStep,
} from "@/app/draft-engine/draftEngine";
import { setDraftDecisionObserver, type DraftDecisionObservation } from "@/app/draft-engine/draftDecision";
import { getDraftPhaseId, type DraftPhaseId } from "@/app/draft-engine/draftPhase";
import type {
  ActiveDraftSeries,
  DraftAction,
  DraftCandidateBreakdown,
  DraftGameState,
  DraftSave,
  Side,
} from "@/app/draft-engine/draftTypes";

export const playersById = new Map(players.map((player) => [player.id, player]));
export const teamsBySlug = new Map(teams.map((team) => [team.slug, team]));

// Rosterele originale ale echipelor, construite ca în pagina de draft.
export const baseRosters: Record<string, Record<Role, string>> = {};
for (const team of teams) {
  const roster = { top: "", jungle: "", mid: "", adc: "", support: "" } as Record<Role, string>;
  for (const player of players) if (player.teamId === team.id) roster[player.role] = player.id;
  baseRosters[team.id] = roster;
}

export function makeSave(overrides: Record<string, Partial<Record<Role, string>>> = {}): DraftSave {
  const updatedTeamRosters: Record<string, Record<Role, string>> = {};
  for (const [teamId, roster] of Object.entries(baseRosters)) {
    updatedTeamRosters[teamId] = { ...roster, ...(overrides[teamId] ?? {}) };
  }
  return {
    region: "all",
    controlledTeamSlug: "__none__",
    budget: 0,
    roster: { top: "", jungle: "", mid: "", adc: "", support: "" },
    updatedTeamRosters,
    playerTeamAssignments: {},
    freeAgentPlayerIds: [],
  };
}

export function newAiSeries(prefix: string, blue: string, red: string): ActiveDraftSeries {
  const series = createInitialSeries(`${prefix}-${blue}-${red}`, "__none__");
  return series;
}

export type TracedAction = {
  stepIndex: number;
  label: string;
  side: Side;
  action: DraftAction;
  phase: DraftPhaseId;
  championId: string;
  chosen: DraftCandidateBreakdown;
  /** Candidații scorați, sortați (gol la acțiunile forțate înainte de scorare). */
  ranked: DraftCandidateBreakdown[];
};

/** Un draft AI vs AI complet (un joc), cu lista scorată la fiecare acțiune. */
export function runTracedDraft(series: ActiveDraftSeries, save: DraftSave) {
  let game: DraftGameState = series.games[0];
  const actions: TracedAction[] = [];
  let last: DraftDecisionObservation | null = null;
  setDraftDecisionObserver((observation) => {
    last = observation;
  });
  try {
    for (let step = getCurrentStep(game); step; step = getCurrentStep(game)) {
      last = null;
      const stepIndex = game.phaseIndex;
      const choice = getAiChoice(series, game, step, save);
      if (!choice) break;
      const observed = last as DraftDecisionObservation | null;
      actions.push({
        stepIndex,
        label: step.label,
        side: step.side,
        action: step.action,
        phase: getDraftPhaseId(stepIndex),
        championId: choice.championId,
        chosen: choice,
        ranked: observed?.ranked ?? [],
      });
      game = commitActionToGame(game, choice.championId, step.side, step.action, choice.projectedRole);
    }
  } finally {
    setDraftDecisionObserver(null);
  }
  return { game, actions };
}

/** Roluri cu date reale de pro (`roleData[rol].stats` ne-null, presence > 0). */
export function getProRoleCount(champion: Champion): number {
  return Object.values(champion.roleData).filter((data) => data?.stats && (data.stats.presence ?? 0) > 0).length;
}

export function parseArgs(argv: string[]) {
  const named: Record<string, string> = {};
  const positional: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg.startsWith("--")) {
      const next = argv[index + 1];
      if (next !== undefined && !next.startsWith("--")) {
        named[arg.slice(2)] = next;
        index += 1;
      } else named[arg.slice(2)] = "true";
    } else positional.push(arg);
  }
  return { named, positional };
}
