// Raportul de draft pe piloni (DRAFT_THINKING §8, refăcut în FEEDBACK_FIXES §5):
// Composition, Lanes, Players, Preparation. Note scurte, concrete, în engleză (apar în joc);
// `reasons` pune explicația unui matchup pe a doua linie (§4.3).

import { championsById } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getMatchupRelations } from "./championMatchups";
import { COMP_COUNTER_MATRIX, getCandidateIdentityFit, isCompatible, readCompIdentity } from "./compIdentity";
import { getDirectOpponents } from "./compCounter";
import { buildCompVector, getMetaPriorityScore } from "./draftEvaluator";
import { getOpenRolesForPickedChampions } from "./draftRoleResolver";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import type { ActiveDraftSeries, DraftGameState, DraftPillar, DraftPillarReport, DraftSave, PillarGrade, Side } from "./draftTypes";
import { DRAFT_SEQUENCE, ROLE_ORDER } from "./draftTypes";
import { describeMatchupDetailed, getWeaknessCoverage, isLaneCounter, isStrongCounter, WEAKNESS_COVER_CONFIG } from "./matchupGrades";
import { getMatchupValue } from "./matchupScoring";
import { getSeasonFavorites, isSeasonFavorite } from "./seasonThreatSystem";
import { getWinCondition } from "./winCondition";

const playersById = new Map(players.map((player) => [player.id, player]));
const name = (championId: string) => championsById[championId]?.name ?? championId;
type Assignments = Partial<Record<Role, string>>;
const REPORT = DRAFT_THINKING_CONFIG.report;

function grade(score: number, thresholds: readonly [number, number, number]): PillarGrade {
  if (score >= thresholds[0]) return "A";
  if (score >= thresholds[1]) return "B";
  if (score >= thresholds[2]) return "C";
  return "D";
}

const roleOf = (assignments: Assignments, championId: string) =>
  (ROLE_ORDER.find((role) => assignments[role] === championId) ?? null) as Role | null;

/** Note + explicații pe același index. */
class Notes {
  notes: string[] = [];
  reasons: (string | null)[] = [];
  add(note: string, reason: string | null = null) {
    this.notes.push(note);
    this.reasons.push(reason);
  }
  pillar(pillarGrade: PillarGrade): DraftPillar {
    return this.reasons.some(Boolean)
      ? { grade: pillarGrade, notes: this.notes, reasons: this.reasons }
      : { grade: pillarGrade, notes: this.notes };
  }
}

/** Contraatacul nostru pe linia unui campion inamic (counter puternic / de linie), cu explicația. */
function findLaneAnswer(enemyChampionId: string, enemyRole: Role, ownAssignments: Assignments) {
  for (const own of getDirectOpponents(enemyRole, ownAssignments)) {
    const relation = getMatchupRelations(own.id, own.role, enemyChampionId, enemyRole).good;
    if (relation && (isStrongCounter(relation) || isLaneCounter(relation))) {
      return { id: own.id, detail: describeMatchupDetailed(relation, "good") };
    }
  }
  return null;
}

// ─── Composition ─────────────────────────────────────────────────────────────

type DamageKind = "AD" | "AP" | "mixed";
function mainDamage(champion: Champion): DamageKind {
  const profile = champion.damageProfile ?? [];
  const ad = profile.includes("AD");
  const ap = profile.includes("AP");
  return ad && !ap ? "AD" : ap && !ad ? "AP" : "mixed";
}

function compositionPillar(ownPicks: string[], ownAssignments: Assignments, roster: Assignments): DraftPillar {
  const config = REPORT.composition;
  const reading = readCompIdentity(ownPicks, ownAssignments);
  const notes = new Notes();
  let points: number;

  if (!reading.dominant) {
    points = config.noDominantPoints;
    notes.add("No clear identity (balanced)");
  } else {
    points = reading.strength >= config.strength[0] ? 3 : reading.strength >= config.strength[1] ? 2 : reading.strength >= config.strength[2] ? 1 : 0;
    const clarity = points >= 3 ? "clear" : points === 2 ? "medium" : "weak";
    const companion =
      reading.runnerUp && !reading.split && reading.signals[reading.runnerUp] >= DRAFT_THINKING_CONFIG.identity.threshold && isCompatible(reading.dominant, reading.runnerUp)
        ? ` + ${reading.runnerUp}`
        : "";
    if (!reading.split) notes.add(`Identity: ${reading.dominant}${companion} (${clarity})`);
  }
  if (reading.split && reading.dominant && reading.runnerUp) {
    const lead = (identity: NonNullable<typeof reading.dominant>) =>
      [...ownPicks].sort(
        (a, b) =>
          getCandidateIdentityFit(championsById[b]!, roleOf(ownAssignments, b), identity) -
          getCandidateIdentityFit(championsById[a]!, roleOf(ownAssignments, a), identity),
      )[0];
    notes.add(`Split identity: ${reading.dominant} (${name(lead(reading.dominant))}) + ${reading.runnerUp} (${name(lead(reading.runnerUp))})`);
  }

  // Win condition-ul are nevoile (priority ≥ 2) acoperite de aliați?
  const winCondition = getWinCondition(ownPicks, ownAssignments, reading, roster);
  if (winCondition) {
    const carry = championsById[winCondition.championId];
    const needs = (carry?.needs ?? []).filter((need) => need.priority >= WEAKNESS_COVER_CONFIG.minNeedPriority);
    const coverage = getWeaknessCoverage(winCondition.championId, ownPicks);
    const kind = winCondition.kind.replace(/-/g, " ");
    const label = `Win condition: ${name(winCondition.championId)} (${kind})`;
    if (!needs.length) {
      points += 1;
      notes.add(`${label}, self-sufficient`);
    } else if (coverage >= 1) {
      points += 1;
      notes.add(`${label}, supported`);
    } else {
      notes.add(`${label}, not supported`, `Needs ${needs.map((need) => need.type).join(", ")} from the team`);
    }
  }

  // Nevoile de bază ale compoziției.
  const vector = buildCompVector(ownPicks) as unknown as Record<string, number>;
  const required = config.baseNeedMin;
  if ((vector.frontline ?? 0) < required) {
    points -= 1;
    notes.add("No frontline");
  }
  if ((vector.engage ?? 0) < required && (vector.disengage ?? 0) < required) {
    points -= 1;
    notes.add("No engage or disengage");
  }
  const kinds = ownPicks.map((id) => championsById[id]).filter((champion): champion is Champion => Boolean(champion)).map(mainDamage);
  for (const kind of ["AD", "AP"] as const) {
    const count = kinds.filter((entry) => entry === kind).length;
    if (count >= config.singleDamageMin) {
      points -= 1;
      notes.add(`Mostly ${kind} damage (${count}/${ownPicks.length})`);
    }
  }

  const pillarGrade = reading.split ? "D" : grade(points, config.grades);
  return notes.pillar(pillarGrade);
}

// ─── Lanes ───────────────────────────────────────────────────────────────────

function lanesPillar(ownPicks: string[], enemyPicks: string[], ownAssignments: Assignments, enemyAssignments: Assignments): DraftPillar {
  const notes = new Notes();
  let balance = 0;
  let won = 0;
  let lost = 0;
  const lostFromDraft: { note: string; reason: string }[] = [];
  for (const role of ROLE_ORDER) {
    const championId = ownAssignments[role];
    if (!championId) continue;
    const opponents = role === "support" ? [] : getDirectOpponents(role, enemyAssignments); // botlane numărat o dată (pe adc)
    if (!opponents.length) continue;
    const value = opponents.reduce((sum, opponent) => sum + getMatchupValue(championId, role, opponent.id, opponent.role, { phase: "early" }), 0);
    balance += value;
    if (value > 0.5) won += 1;
    else if (value < -0.5) lost += 1;
    for (const opponent of opponents) {
      const weak = getMatchupRelations(championId, role, opponent.id, opponent.role).weak;
      if (weak && (isLaneCounter(weak) || isStrongCounter(weak))) {
        const detail = describeMatchupDetailed(weak, "weak");
        lostFromDraft.push({ note: `Lost lane from draft: ${name(championId)}, ${detail.label}`, reason: detail.reason });
        break;
      }
    }
  }
  const ours = readCompIdentity(ownPicks, ownAssignments);
  const theirs = readCompIdentity(enemyPicks, enemyAssignments);
  const edge = ours.dominant && theirs.dominant ? COMP_COUNTER_MATRIX[ours.dominant][theirs.dominant] * theirs.strength : 0;
  const lanes = `you win ${won} ${won === 1 ? "lane" : "lanes"}, lose ${lost}`;
  if (edge > 0.1) {
    notes.add(lost >= 2 ? `You took the comp counter (${ours.dominant} vs ${theirs.dominant}), but lose ${lost} lanes` : `Comp counter: ${ours.dominant} vs ${theirs.dominant}; ${lanes}`);
  } else if (edge < -0.1) notes.add(`Their comp beats yours (${theirs.dominant} vs ${ours.dominant}); ${lanes}`);
  else notes.add(`Lanes: ${lanes}`);
  for (const entry of lostFromDraft) notes.add(entry.note, entry.reason);
  return notes.pillar(grade(balance / 3 + edge * 1.5, [1.5, 0, -1.5]));
}

// ─── Players ─────────────────────────────────────────────────────────────────

function playersPillar(ownAssignments: Assignments, roster: Assignments, pickRoles: Partial<Record<string, Role>>): DraftPillar {
  const notes = new Notes();
  const ranks: number[] = [];
  let worst: "F" | "D" | null = null;
  for (const role of ROLE_ORDER) {
    const championId = ownAssignments[role];
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    if (!championId || !player) continue;
    const playerGrade = getChampionGrade(player, championId);
    ranks.push(GRADE_RANK[playerGrade]);
    if (playerGrade === "F" || playerGrade === "D") {
      notes.add(
        `${player.name} on ${name(championId)} (${playerGrade})`,
        playerGrade === "F" ? "Doesn't play it: no contribution in the simulation" : "Reduced performance",
      );
      if (playerGrade === "F") worst = "F";
      else if (worst !== "F") worst = "D";
    }
  }
  for (const [championId, lockedRole] of Object.entries(pickRoles)) {
    const finalRole = roleOf(ownAssignments, championId);
    if (lockedRole && finalRole && finalRole !== lockedRole) notes.add(`${name(championId)} moved from ${lockedRole} to ${finalRole}`);
  }
  const average = ranks.length ? ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length : 0;
  const labels = ["F", "D", "C", "B", "A", "S", "SS"];
  if (!notes.notes.length && ranks.length) notes.add(`Average grade: ${labels[Math.floor(average)]} (${average.toFixed(1)} / 6)`);
  return notes.pillar(worst === "F" ? "D" : worst === "D" ? "C" : grade(average, [4, 3, 0]));
}

// ─── Preparation ─────────────────────────────────────────────────────────────

/** Acțiunile draftului în ordinea din DRAFT_SEQUENCE (campionul fiecărui pas). */
function orderedActions(game: DraftGameState) {
  const counters = { "blue:ban": 0, "red:ban": 0, "blue:pick": 0, "red:pick": 0 };
  const lists = { "blue:ban": game.bansBlue, "red:ban": game.bansRed, "blue:pick": game.picksBlue, "red:pick": game.picksRed };
  return DRAFT_SEQUENCE.map((step, index) => {
    const key = `${step.side}:${step.action}` as keyof typeof counters;
    const championId = lists[key][counters[key]] ?? null;
    counters[key] += 1;
    return { index, step, championId };
  });
}

/**
 * Campionii contestați (§5.3): meta ≥ priorityMetaMin, disponibili la o acțiune proprie din faza 1
 * (ban 1, pick-urile din faza 1), pe care adversarul îi voia (un jucător pe un rol liber îi are ≥ A,
 * sau sunt favoriți de sezon ai lor).
 */
function getContestedChampions(
  game: DraftGameState, series: ActiveDraftSeries, side: Side,
  enemyRoster: Assignments, enemyTeamSlug: string,
): Set<string> {
  const unavailable = new Set<string>();
  for (const previous of series.games) {
    if (previous.number >= game.number) continue;
    previous.picksBlue.forEach((id) => unavailable.add(id));
    previous.picksRed.forEach((id) => unavailable.add(id));
  }
  const enemySide: Side = side === "blue" ? "red" : "blue";
  const enemyPicks: string[] = [];
  const contested = new Set<string>();
  const metaMin = DRAFT_THINKING_CONFIG.plan.priorityMetaMin;
  const wantRank = REPORT.preparation.enemyWantMinRank;

  for (const { index, step, championId } of orderedActions(game)) {
    if (index > 11) break; // doar faza 1 (ban 1 + pick-urile din faza 1)
    if (step.side === side) {
      const openEnemyRoles = getOpenRolesForPickedChampions(enemyPicks, enemyRoster);
      for (const champion of Object.values(championsById)) {
        if (!champion || unavailable.has(champion.id) || contested.has(champion.id)) continue;
        const meta = Math.max(...champion.roles.map((role) => getMetaPriorityScore(champion, role)));
        if (meta < metaMin) continue;
        const wanted =
          champion.roles.some((role) => {
            if (!openEnemyRoles.includes(role)) return false;
            const player = enemyRoster[role] ? playersById.get(enemyRoster[role]!) : undefined;
            return Boolean(player && GRADE_RANK[getChampionGrade(player, champion.id)] >= wantRank);
          }) || isSeasonFavorite(enemyTeamSlug, champion.id, enemyRoster);
        if (wanted) contested.add(champion.id);
      }
    }
    if (championId) {
      unavailable.add(championId);
      if (step.side === enemySide && step.action === "pick") enemyPicks.push(championId);
    }
  }
  return contested;
}

function preparationPillar(
  game: DraftGameState, series: ActiveDraftSeries, side: Side,
  enemyTeamSlug: string, enemyRoster: Assignments,
  ownPicks: string[], ownBans: string[], enemyPicks: string[],
  ownAssignments: Assignments, enemyAssignments: Assignments,
): DraftPillar {
  const notes = new Notes();
  let handled = 0;
  let lost = 0;
  const seen = new Set<string>();

  const resolve = (championId: string, label: string) => {
    if (seen.has(championId)) return;
    seen.add(championId);
    if (ownPicks.includes(championId)) {
      handled += 1;
      notes.add(`Took ${label}`);
      return;
    }
    if (ownBans.includes(championId)) {
      handled += 1;
      notes.add(`Banned ${label}`);
      return;
    }
    if (!enemyPicks.includes(championId)) return; // nimeni nu l-a luat: nu contează
    const role = roleOf(enemyAssignments, championId);
    const answer = role ? findLaneAnswer(championId, role, ownAssignments) : null;
    if (answer) {
      handled += 1;
      notes.add(`Answered ${label} with ${name(answer.id)}`, `${answer.detail.label}: ${answer.detail.reason}`);
    } else {
      lost += 1;
      notes.add(`${label} went to them unanswered`);
    }
  };

  // Favoriții de sezon ai adversarului (cu W–L), apoi campionii contestați din faza 1.
  const favorites = getSeasonFavorites(enemyTeamSlug, enemyRoster, 5).filter(
    (entry) => entry.threat >= DRAFT_THINKING_CONFIG.season.threatThreshold,
  );
  for (const favorite of favorites) {
    resolve(favorite.championId, `${name(favorite.championId)} (${favorite.wins}–${favorite.games - favorite.wins} this season)`);
  }
  const contested = getContestedChampions(game, series, side, enemyRoster, enemyTeamSlug);
  for (const championId of contested) resolve(championId, `${name(championId)} (contested)`);

  if (handled + lost === 0) {
    notes.add("Nothing contested");
    return notes.pillar("A");
  }
  return notes.pillar(grade(handled / (handled + lost), REPORT.preparation.grades));
}

/** Raportul pe piloni pentru o echipă (draft încheiat, cu asignări rezolvate). */
export function buildDraftPillarReport(
  game: DraftGameState,
  side: Side,
  series: ActiveDraftSeries,
  _save: DraftSave | null,
  rosters: { blue: Assignments; red: Assignments },
): DraftPillarReport {
  const enemySide: Side = side === "blue" ? "red" : "blue";
  const ownPicks = side === "blue" ? game.picksBlue : game.picksRed;
  const enemyPicks = side === "blue" ? game.picksRed : game.picksBlue;
  const ownAssignments = side === "blue" ? game.assignmentsBlue : game.assignmentsRed;
  const enemyAssignments = side === "blue" ? game.assignmentsRed : game.assignmentsBlue;
  const ownBans = side === "blue" ? game.bansBlue : game.bansRed;
  const pickRoles = (side === "blue" ? game.pickRolesBlue : game.pickRolesRed) ?? {};
  const enemyTeamSlug = enemySide === "blue" ? series.blueTeamSlug : series.redTeamSlug;
  const roster = rosters[side];
  const enemyRoster = rosters[enemySide];
  return {
    composition: compositionPillar(ownPicks, ownAssignments, roster),
    lanes: lanesPillar(ownPicks, enemyPicks, ownAssignments, enemyAssignments),
    players: playersPillar(ownAssignments, roster, pickRoles),
    preparation: preparationPillar(game, series, side, enemyTeamSlug, enemyRoster, ownPicks, ownBans, enemyPicks, ownAssignments, enemyAssignments),
  };
}

/** Raportul e în formatul curent (salvările vechi au alți piloni: priority / cohesion / …)? */
export function isCurrentPillarReport(report: unknown): report is DraftPillarReport {
  const value = report as Partial<DraftPillarReport> | null | undefined;
  return Boolean(value?.composition && value.lanes && value.players && value.preparation);
}
