// DRAFT_REALISM §3.1 — contextul unei acțiuni de draft, calculat o singură dată
// (nu per candidat). Câmpurile per echipă vin din funcțiile existente.

import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type { Team } from "@/app/types/team";
import type { ActiveDraftSeries, DraftAiConfig, DraftGameState, DraftSave, DraftStep, Side } from "./draftTypes";
import { DRAFT_SEQUENCE, ROLE_ORDER } from "./draftTypes";
import { getOpenRolesForPickedChampions, resolveRoleAssignments, type LockedRoles } from "./draftRoleResolver";
import { readCompIdentity, type CompIdentityReading } from "./compIdentity";
import { getWinCondition, type WinCondition } from "./winCondition";
import { getClutchContext } from "./championMasteryAdvanced";
import { getDraftPhaseId, type DraftPhaseId } from "./draftPhase";
import {
  getCachedMustWithState,
  getCachedPlan,
  getCachedSeasonState,
  getLockedRoles,
  getTeamRosterFromSources,
  isAiSide,
  type MustWithTurnState,
  type SeasonTurnState,
} from "./draftAI";
import type { DraftPlan } from "./draftPlanSystem";
import { getBotFocus, type BotFocus } from "./botDuoPlan";
import { champions } from "@/app/data/champions";
import type { Champion } from "@/app/types/champion";
import { createPriorityLookup, type PriorityValue } from "./priorityValue";

export type TeamDraftState = {
  side: Side;
  teamSlug: string;
  team: Team | null;
  /** Echipa e AI (nu userul): doar atunci îi folosim rolurile blocate (intenția userului nu o știm). */
  isAi: boolean;
  picks: string[];
  bans: string[];
  roster: Partial<Record<Role, string>>;
  /** Rolurile blocate la pick (DRAFT_THINKING §1.2). Pentru adversar: doar dacă e AI. */
  lockedRoles: LockedRoles | undefined;
  /** `resolveRoleAssignments(picks, roster, lockedRoles)`. */
  assignments: Partial<Record<Role, string>>;
  openRoles: Role[];
  identity: CompIdentityReading;
};

export type DraftLookahead = {
  /** Pick-uri ale adversarului de acum până la următorul nostru pick. */
  enemyPicksBeforeOurNext: number;
  enemyBansBeforeOurNext: number;
  /** Pick-urile noastre rămase, inclusiv cel curent dacă acțiunea e pick. */
  ourPicksLeft: number;
  /** Pick-urile adversarului rămase după pasul curent. */
  enemyPicksRemaining: number;
};

export type DraftContext = {
  step: DraftStep;
  stepIndex: number;
  side: Side;
  phase: DraftPhaseId;
  game: DraftGameState;
  series: ActiveDraftSeries;
  save: DraftSave | null;
  config: DraftAiConfig;
  own: TeamDraftState;
  enemy: TeamDraftState;
  /** Ban-uri, pick-uri, fearless (`getUnavailableChampionIds`). */
  unavailable: ReadonlySet<string>;
  mustWith: MustWithTurnState;
  season: SeasonTurnState;
  plan: DraftPlan | null;
  ownWinCondition: WinCondition | null;
  /** FEEDBACK_FIXES §10.3 — „jucăm prin bot?” (doar cu ambele roluri bot libere contează). */
  botFocus: BotFocus;
  /** DRAFT_REALISM §6 — priority value din perspectiva echipei care draftează (cache pe acțiune). */
  priorityOf: (champion: Champion) => PriorityValue;
  /** Campionul disponibil cu cel mai mare priority value folosibil de noi (calculat la cerere). */
  topOwnUsablePriority: () => { championId: string; priority: PriorityValue } | null;
  /** Același lucru din perspectiva adversarului (pentru red la ban 1, §6.1). */
  enemyPriorityOf: (champion: Champion) => PriorityValue;
  lookahead: DraftLookahead;
  seriesPressure: { eliminationGame: boolean; leading: boolean };
};

export function getLookahead(stepIndex: number, side: Side): DraftLookahead {
  const enemySide: Side = side === "blue" ? "red" : "blue";
  let enemyPicksBeforeOurNext = 0;
  let enemyBansBeforeOurNext = 0;
  for (let index = stepIndex + 1; index < DRAFT_SEQUENCE.length; index += 1) {
    const entry = DRAFT_SEQUENCE[index];
    if (entry.side === side && entry.action === "pick") break;
    if (entry.side === enemySide && entry.action === "pick") enemyPicksBeforeOurNext += 1;
    if (entry.side === enemySide && entry.action === "ban") enemyBansBeforeOurNext += 1;
  }
  const remaining = DRAFT_SEQUENCE.slice(stepIndex);
  return {
    enemyPicksBeforeOurNext,
    enemyBansBeforeOurNext,
    ourPicksLeft: remaining.filter((entry) => entry.side === side && entry.action === "pick").length,
    enemyPicksRemaining: DRAFT_SEQUENCE.slice(stepIndex + 1).filter((entry) => entry.side === enemySide && entry.action === "pick").length,
  };
}

function countWins(series: ActiveDraftSeries, side: Side) {
  return series.games.filter((game) => game.completed && game.number < series.currentGameNumber && game.winnerSide === side).length;
}

function buildTeamState(series: ActiveDraftSeries, game: DraftGameState, side: Side, save: DraftSave | null, ownSide: Side): TeamDraftState {
  const teamSlug = side === "blue" ? series.blueTeamSlug : series.redTeamSlug;
  const picks = side === "blue" ? game.picksBlue : game.picksRed;
  const bans = side === "blue" ? game.bansBlue : game.bansRed;
  const roster = getTeamRosterFromSources({ teamSlug, save });
  const isAi = isAiSide(series, side);
  // Pentru echipa proprie: rolurile blocate mereu; pentru adversar: doar dacă e AI.
  const lockedRoles = side === ownSide || isAi ? getLockedRoles(game, side) : undefined;
  const assignments = resolveRoleAssignments(picks, roster, lockedRoles);
  return {
    side,
    teamSlug,
    team: teams.find((entry) => entry.slug === teamSlug) ?? null,
    isAi,
    picks,
    bans,
    roster,
    lockedRoles,
    assignments,
    openRoles: getOpenRolesForPickedChampions(picks, roster, lockedRoles),
    identity: readCompIdentity(picks, assignments),
  };
}

const contextCache = new Map<string, DraftContext>();

export function buildDraftContext(
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig
): DraftContext {
  const side = step.side;
  const enemySide: Side = side === "blue" ? "red" : "blue";
  // Cheia include starea completă: scenariile refolosesc același seriesId cu alte pick-uri / rostere.
  const own = buildTeamState(series, game, side, save, side);
  const enemy = buildTeamState(series, game, enemySide, save, side);
  const key = [
    series.seriesId,
    series.currentGameNumber,
    game.phaseIndex,
    side,
    step.action,
    game.picksBlue.join(","),
    game.picksRed.join(","),
    game.bansBlue.join(","),
    game.bansRed.join(","),
    ROLE_ORDER.map((role) => own.roster[role] ?? "").join(","),
    ROLE_ORDER.map((role) => enemy.roster[role] ?? "").join(","),
    JSON.stringify(own.lockedRoles ?? {}),
    JSON.stringify(enemy.lockedRoles ?? null),
    series.userSide,
  ].join("|");
  const cached = contextCache.get(key);
  if (cached && cached.config === config && cached.save === save && cached.series === series) return cached;

  const mustWith = getCachedMustWithState(series, game, side, save);
  const plan = getCachedPlan({ side, game, series, save });
  const ownWinCondition = getWinCondition(own.picks, own.assignments, own.identity, own.roster);
  const clutch = getClutchContext(series);
  const unavailableIds = mustWith.own.unavailable;
  const priorityOf = createPriorityLookup({
    ownRoster: own.roster, ownOpenRoles: own.openRoles,
    enemyRoster: enemy.roster, enemyOpenRoles: enemy.openRoles,
    enemyTeamSlug: enemy.teamSlug, unavailable: unavailableIds,
  });
  const enemyPriorityOf = createPriorityLookup({
    ownRoster: enemy.roster, ownOpenRoles: enemy.openRoles,
    enemyRoster: own.roster, enemyOpenRoles: own.openRoles,
    enemyTeamSlug: own.teamSlug, unavailable: unavailableIds,
  });
  let topCache: { championId: string; priority: PriorityValue } | null | undefined;
  const topOwnUsablePriority = () => {
    if (topCache !== undefined) return topCache;
    topCache = null;
    for (const champion of champions) {
      if (unavailableIds.has(champion.id)) continue;
      const priority = priorityOf(champion);
      if (priority.ownUsable && (!topCache || priority.value > topCache.priority.value)) topCache = { championId: champion.id, priority };
    }
    return topCache;
  };
  const ownWins = countWins(series, side);
  const enemyWins = countWins(series, enemySide);
  const ctx: DraftContext = {
    step,
    stepIndex: game.phaseIndex,
    side,
    phase: getDraftPhaseId(game.phaseIndex),
    game,
    series,
    save,
    config,
    own,
    enemy,
    unavailable: mustWith.own.unavailable,
    mustWith,
    season: getCachedSeasonState(series, game, side, save),
    plan,
    ownWinCondition,
    botFocus: getBotFocus({
      ctx: mustWith.own,
      state: mustWith.ownDuo,
      planType: plan?.type ?? null,
      identity: own.identity.dominant,
      winConditionRole: ownWinCondition?.role ?? null,
    }),
    priorityOf,
    enemyPriorityOf,
    topOwnUsablePriority,
    lookahead: getLookahead(game.phaseIndex, side),
    seriesPressure: {
      eliminationGame: side === "blue" ? clutch.blueAtElimination : clutch.redAtElimination,
      leading: ownWins > enemyWins,
    },
  };
  if (contextCache.size > 300) contextCache.clear();
  contextCache.set(key, ctx);
  return ctx;
}
