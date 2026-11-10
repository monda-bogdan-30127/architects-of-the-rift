// Raportul de draft pe piloni (DRAFT_THINKING §8): priority, coeziune, matchup-uri,
// mastery, pregătirea pentru favoriții de sezon ai adversarului. Note scurte, concrete.

import { championsById } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getMatchupRelations } from "./championMatchups";
import { COMP_COUNTER_MATRIX, getCandidateIdentityFit, readCompIdentity } from "./compIdentity";
import { getDirectOpponents } from "./compCounter";
import { getMetaPriorityScore } from "./draftEvaluator";
import { isPriorityPick } from "./draftPlanSystem";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import type { ActiveDraftSeries, DraftGameState, DraftPillarReport, DraftSave, PillarGrade, Side } from "./draftTypes";
import { ROLE_ORDER } from "./draftTypes";
import { isLaneCounter, isStrongCounter } from "./matchupGrades";
import { getMatchupValue } from "./matchupScoring";
import { getSeasonFavorites, isSeasonFavorite } from "./seasonThreatSystem";
import { getWinCondition } from "./winCondition";

const playersById = new Map(players.map((player) => [player.id, player]));
const name = (championId: string) => championsById[championId]?.name ?? championId;
type Assignments = Partial<Record<Role, string>>;

function grade(score: number, thresholds: [number, number, number]): PillarGrade {
  if (score >= thresholds[0]) return "A";
  if (score >= thresholds[1]) return "B";
  if (score >= thresholds[2]) return "C";
  return "D";
}

const roleOf = (assignments: Assignments, championId: string) =>
  (ROLE_ORDER.find((role) => assignments[role] === championId) ?? null) as Role | null;

function priorityPillar(
  ownPicks: string[], enemyPicks: string[], ownAssignments: Assignments, enemyAssignments: Assignments,
  roster: Assignments, teamSlug: string, side: Side,
): DraftPillarReport["priority"] {
  const notes: string[] = [];
  const first = ownPicks[0];
  const firstIsPriority = first
    ? isPriorityPick(first, roleOf(ownAssignments, first), roster, (id) => isSeasonFavorite(teamSlug, id, roster))
    : false;
  if (first) notes.push(firstIsPriority ? `Priority pick: ${name(first)} (${side === "blue" ? "B1" : "R1"})` : `First pick (${name(first)}) is not a priority pick`);
  const isMetaPriority = (id: string, assignments: Assignments) => {
    const champion = championsById[id];
    return champion ? getMetaPriorityScore(champion, roleOf(assignments, id)) >= DRAFT_THINKING_CONFIG.plan.priorityMetaMin : false;
  };
  const own = ownPicks.filter((id) => isMetaPriority(id, ownAssignments));
  const theirs = enemyPicks.filter((id) => isMetaPriority(id, enemyAssignments));
  if (theirs.length) notes.push(`The enemy took ${theirs.length} priority picks: ${theirs.map(name).join(", ")}`);
  else if (own.length) notes.push(`Priority picks taken: ${own.map(name).join(", ")}`);
  return { grade: grade((firstIsPriority ? 1 : 0) + own.length - theirs.length * 0.5, [2, 1, 0]), notes };
}

function cohesionPillar(ownPicks: string[], ownAssignments: Assignments, roster: Assignments): DraftPillarReport["cohesion"] {
  const reading = readCompIdentity(ownPicks, ownAssignments);
  const notes: string[] = [];
  let pillarGrade: PillarGrade;
  if (reading.split && reading.dominant && reading.runnerUp) {
    const lead = (identity: NonNullable<typeof reading.dominant>) =>
      [...ownPicks].sort((a, b) =>
        getCandidateIdentityFit(championsById[b]!, roleOf(ownAssignments, b), identity) -
        getCandidateIdentityFit(championsById[a]!, roleOf(ownAssignments, a), identity))[0];
    notes.push(`Split identity: ${reading.dominant} (${name(lead(reading.dominant))}) + ${reading.runnerUp} (${name(lead(reading.runnerUp))})`);
    pillarGrade = "D";
  } else if (!reading.dominant) {
    notes.push("No clear identity (balanced)");
    pillarGrade = "C";
  } else {
    const clarity = reading.strength >= 0.6 ? "clear" : reading.strength >= 0.4 ? "medium" : "weak";
    notes.push(`Identity: ${reading.dominant} (${clarity})`);
    pillarGrade = grade(reading.strength, [0.6, 0.4, 0]);
  }
  const winCondition = getWinCondition(ownPicks, ownAssignments, reading, roster);
  if (winCondition) notes.push(`Win condition: ${name(winCondition.championId)} (${winCondition.kind})`);
  return { grade: pillarGrade, notes };
}

function matchupsPillar(
  ownPicks: string[], enemyPicks: string[], ownAssignments: Assignments, enemyAssignments: Assignments,
): DraftPillarReport["matchups"] {
  const notes: string[] = [];
  let balance = 0;
  let won = 0;
  let lost = 0;
  const tunnel: string[] = [];
  for (const role of ROLE_ORDER) {
    const championId = ownAssignments[role];
    if (!championId) continue;
    const opponents = role === "support" ? [] : getDirectOpponents(role, enemyAssignments); // botlane numărat o dată (pe adc)
    if (!opponents.length) continue;
    const value = opponents.reduce((sum, opponent) => sum + getMatchupValue(championId, role, opponent.id, opponent.role, { phase: "early" }), 0);
    balance += value;
    if (value > 0.5) won += 1;
    else if (value < -0.5) lost += 1;
    const loses = opponents.find((opponent) => {
      const weak = getMatchupRelations(championId, role, opponent.id, opponent.role).weak;
      return Boolean(weak && (isLaneCounter(weak) || isStrongCounter(weak)));
    });
    if (loses) tunnel.push(`${name(championId)} vs ${name(loses.id)}`);
  }
  const ours = readCompIdentity(ownPicks, ownAssignments);
  const theirs = readCompIdentity(enemyPicks, enemyAssignments);
  const edge = ours.dominant && theirs.dominant ? COMP_COUNTER_MATRIX[ours.dominant][theirs.dominant] * theirs.strength : 0;
  const lanes = `you win ${won} ${won === 1 ? "lane" : "lanes"}, lose ${lost}`;
  if (edge > 0.1) notes.push(lost >= 2 ? `You took the comp counter (${ours.dominant} vs ${theirs.dominant}), but lose ${lost} lanes` : `Comp counter: ${ours.dominant} vs ${theirs.dominant}; ${lanes}`);
  else if (edge < -0.1) notes.push(`Their comp beats yours (${theirs.dominant} vs ${ours.dominant}); ${lanes}`);
  else notes.push(`Lanes: ${lanes}`);
  if (tunnel.length) notes.push(`Lost lanes from draft: ${tunnel.join(", ")}`);
  return { grade: grade(balance / 3 + edge * 1.5, [1.5, 0, -1.5]), notes };
}

function masteryPillar(ownAssignments: Assignments, roster: Assignments, pickRoles: Partial<Record<string, Role>>): DraftPillarReport["mastery"] {
  const notes: string[] = [];
  const ranks: number[] = [];
  let worst: "F" | "D" | null = null;
  for (const role of ROLE_ORDER) {
    const championId = ownAssignments[role];
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    if (!championId || !player) continue;
    const playerGrade = getChampionGrade(player, championId);
    ranks.push(GRADE_RANK[playerGrade]);
    if (playerGrade === "F" || playerGrade === "D") {
      notes.push(`${player.name} on ${name(championId)} (${playerGrade})`);
      if (playerGrade === "F") worst = "F";
      else if (worst !== "F") worst = "D";
    }
  }
  for (const [championId, lockedRole] of Object.entries(pickRoles)) {
    const finalRole = roleOf(ownAssignments, championId);
    if (lockedRole && finalRole && finalRole !== lockedRole) notes.push(`${name(championId)} moved from ${lockedRole} to ${finalRole}`);
  }
  const average = ranks.length ? ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length : 0;
  const labels = ["F", "D", "C", "B", "A", "S", "SS"];
  if (!notes.length && ranks.length) notes.push(`Average grade: ${labels[Math.floor(average)]} (${average.toFixed(1)} / 6)`);
  const pillarGrade: PillarGrade = worst === "F" ? "D" : worst === "D" ? "C" : grade(average, [4, 3, 0]);
  return { grade: pillarGrade, notes };
}

function seasonPrepPillar(
  enemyTeamSlug: string, enemyRoster: Assignments, ownBans: string[], enemyPicks: string[],
  ownAssignments: Assignments, enemyAssignments: Assignments,
): DraftPillarReport["seasonPrep"] {
  const favorites = getSeasonFavorites(enemyTeamSlug, enemyRoster, 5).filter(
    (entry) => entry.threat >= DRAFT_THINKING_CONFIG.season.threatThreshold,
  );
  if (!favorites.length) return { grade: "A", notes: ["The enemy has no season favorites"] };
  const notes: string[] = [];
  let good = 0;
  let bad = 0;
  for (const favorite of favorites) {
    const record = `${favorite.wins}–${favorite.games - favorite.wins} this season`;
    if (ownBans.includes(favorite.championId)) {
      good += 1;
      notes.push(`Banned ${name(favorite.championId)} (${record})`);
      continue;
    }
    if (!enemyPicks.includes(favorite.championId)) continue;
    const role = roleOf(enemyAssignments, favorite.championId);
    const answer = role
      ? getDirectOpponents(role, ownAssignments).find((own) => {
          const relation = getMatchupRelations(own.id, own.role, favorite.championId, role).good;
          return Boolean(relation && (isStrongCounter(relation) || isLaneCounter(relation)));
        })
      : undefined;
    if (answer) {
      good += 1;
      notes.push(`Answer to ${name(favorite.championId)} (${record}): ${name(answer.id)}`);
    } else {
      bad += 1;
      notes.push(`${name(favorite.championId)} (${record}) left open without a counter`);
    }
  }
  if (!notes.length) notes.push("Their season favorites weren't played");
  const pillarGrade: PillarGrade = bad === 0 ? (good > 0 ? "A" : "B") : good > 0 ? "C" : "D";
  return { grade: pillarGrade, notes };
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
  const teamSlug = side === "blue" ? series.blueTeamSlug : series.redTeamSlug;
  const enemyTeamSlug = enemySide === "blue" ? series.blueTeamSlug : series.redTeamSlug;
  const roster = rosters[side];
  const enemyRoster = rosters[enemySide];
  return {
    priority: priorityPillar(ownPicks, enemyPicks, ownAssignments, enemyAssignments, roster, teamSlug, side),
    cohesion: cohesionPillar(ownPicks, ownAssignments, roster),
    matchups: matchupsPillar(ownPicks, enemyPicks, ownAssignments, enemyAssignments),
    mastery: masteryPillar(ownAssignments, roster, pickRoles),
    seasonPrep: seasonPrepPillar(enemyTeamSlug, enemyRoster, ownBans, enemyPicks, ownAssignments, enemyAssignments),
  };
}
