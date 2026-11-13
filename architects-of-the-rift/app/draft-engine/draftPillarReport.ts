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
import { buildCompVector } from "./draftEvaluator";
import { evaluateContextualNeedStatuses, getBestCoverAttribute, getContextualCover } from "./contextualNeeds";
import { describeResourceConflict, getHighDemandPicks, getResourceConflictExcess, getResourceDemand } from "./championResource";
import { getActiveTrait, hasTrait } from "@/app/utils/playerTraitUtils";
import { getLaneOrder, type LaneOrder } from "./laneOrder";
import { COMP_ATTRIBUTE_INFO } from "@/app/types/compAttributes";
import { getOpenRolesForPickedChampions } from "./draftRoleResolver";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import type { ActiveDraftSeries, DraftGameState, DraftPillar, DraftPillarReport, DraftSave, PillarGrade, Side } from "./draftTypes";
import { DRAFT_SEQUENCE, ROLE_ORDER } from "./draftTypes";
import { describeMatchupDetailed, getWeaknessCoverage, isLaneCounter, isStrongCounter, WEAKNESS_COVER_CONFIG } from "./matchupGrades";
import { getMatchupValue } from "./matchupScoring";
import { getSeasonFavorites } from "./seasonThreatSystem";
import { createPriorityLookup } from "./priorityValue";
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

function compositionPillar(ownPicks: string[], ownAssignments: Assignments, roster: Assignments, enemyPicks: string[] = []): DraftPillar {
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
  // COMP_ATTRIBUTES_EXPANSION §2.2 — resursele: prea multe carry-uri care vor gold (−1) sau un weakside asumat
  // (top / jungle / mid cu cerere ≤ 2, lângă cel puțin un carry: resursele merg în altă parte).
  const carries = getHighDemandPicks(ownAssignments);
  if (getResourceConflictExcess(ownAssignments) > 0) {
    points -= 1;
    notes.add(describeResourceConflict(carries), "Gold and jungle attention are split between them");
  } else if (carries.length) {
    for (const role of ["top", "jungle", "mid"] as const) {
      const championId = ownAssignments[role];
      if (championId && getResourceDemand(championId, role) <= DRAFT_THINKING_CONFIG.attributes.weaksideMax) {
        notes.add(`Weakside: ${name(championId)} (${role})`, `Resources go to ${carries.map((entry) => name(entry.championId)).join(", ")}`);
      }
    }
  }
  // PLAYER_TRAITS §4.4 — resource_hog pe un campion cu cerere mică (înfometat) sau mai mulți pe carry-uri.
  const hogsOnCarries: string[] = [];
  for (const role of ROLE_ORDER) {
    const championId = ownAssignments[role];
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    if (!championId || !player || !hasTrait(player, "resource_hog")) continue;
    const demand = getResourceDemand(championId, role);
    if (demand <= DRAFT_THINKING_CONFIG.attributes.weaksideMax) notes.add(`${player.name} (Resource Hog) starved on ${name(championId)}`);
    else if (demand >= DRAFT_THINKING_CONFIG.attributes.highDemandMin) hogsOnCarries.push(player.name);
  }
  if (hogsOnCarries.length >= 2) {
    notes.add(`${hogsOnCarries.length === 2 ? "Two" : hogsOnCarries.length} Resource Hogs on carries: ${hogsOnCarries.join(", ")}`);
  }
  // COMP_ATTRIBUTES_EXPANSION §3.3 — nevoile din compoziția lor: „No answer to their frontline (3 tanks)”
  // (priority ≥ 2 scade nota, ca nevoile de bază) sau cine le răspunde: „Anti-tank: Vayne answers their frontline”.
  for (const need of evaluateContextualNeedStatuses(ownPicks, enemyPicks)) {
    if (need.missing > 0) {
      if (need.priority >= 2) points -= 1;
      notes.add(`No answer to ${need.subject}`, need.reason);
      continue;
    }
    const answerer = [...ownPicks].sort((a, b) => getContextualCover(championsById[b], need) - getContextualCover(championsById[a], need))[0];
    const attribute = answerer ? getBestCoverAttribute(championsById[answerer], need) : null;
    if (answerer && attribute) notes.add(`${COMP_ATTRIBUTE_INFO[attribute].label}: ${name(answerer)} answers ${need.subject.replace(/ \(.*\)$/, "")}`);
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

function lanesPillar(
  ownPicks: string[],
  enemyPicks: string[],
  ownAssignments: Assignments,
  enemyAssignments: Assignments,
  roster: Assignments = {},
  laneOrder: LaneOrder = {},
): DraftPillar {
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
  // PLAYER_TRAITS §7.4 — trait-urile de lane: „Ruler turned a winning lane into a lead”, „Kiin held a losing lane”…
  for (const role of ROLE_ORDER) {
    const championId = ownAssignments[role];
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    const opponents = role === "support" || !championId ? [] : getDirectOpponents(role, enemyAssignments);
    if (!championId || !player || !opponents.length) continue;
    const value = opponents.reduce((sum, opponent) => sum + getMatchupValue(championId, role, opponent.id, opponent.role, { phase: "early" }), 0);
    const order = laneOrder[role];
    if (value > 0.5 && getActiveTrait(player, "lane_dominator")) notes.add(`${player.name} turned a winning lane into a lead`, "Lane Dominator: winning matchups count more");
    if (value > 0.5 && order === "counter" && getActiveTrait(player, "counter_specialist")) notes.add(`${player.name} counter-picked his lane`, "Counter-Pick Specialist: picked after his lane opponent");
    if (order === "blind" && getActiveTrait(player, "counter_specialist")) notes.add(`${player.name} had to blind-pick`, "Counter-Pick Specialist: weaker when he picks first in his lane");
    if (value < -0.5 && getActiveTrait(player, "matchup_resilient")) notes.add(`${player.name} held a losing lane`, "Matchup Resilient: losing matchups hurt him less");
    else if (value < -0.5 && order === "blind" && getActiveTrait(player, "blind_safe")) notes.add(`${player.name} held a blind pick`, "Blind-Pick Safe: loses little when picking first");
  }
  return notes.pillar(grade(balance / 3 + edge * 1.5, [1.5, 0, -1.5]));
}

// ─── Players ─────────────────────────────────────────────────────────────────

function playersPillar(ownAssignments: Assignments, roster: Assignments, pickRoles: Partial<Record<string, Role>>, isUserTeam: boolean): DraftPillar {
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
  // RESULTS_DIALOG_TABS §3.1: „X moved from A to B” doar la AI (singura echipă cu roluri blocate la pick) și doar
  // dacă mutarea a dus la un grad mai mic. Userul își aranjează campionii la final: un swap nu e o „mutare”.
  for (const [championId, lockedRole] of isUserTeam ? [] : Object.entries(pickRoles)) {
    const finalRole = roleOf(ownAssignments, championId);
    if (!lockedRole || !finalRole || finalRole === lockedRole) continue;
    const lockedPlayer = roster[lockedRole] ? playersById.get(roster[lockedRole]!) : undefined;
    const finalPlayer = roster[finalRole] ? playersById.get(roster[finalRole]!) : undefined;
    if (!lockedPlayer || !finalPlayer) continue;
    const before = GRADE_RANK[getChampionGrade(lockedPlayer, championId)];
    const after = GRADE_RANK[getChampionGrade(finalPlayer, championId)];
    if (after < before) notes.add(`${name(championId)} moved from ${lockedRole} to ${finalRole} (${getChampionGrade(lockedPlayer, championId)} → ${getChampionGrade(finalPlayer, championId)})`);
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

type Contested = {
  championId: string;
  value: number;
  tier: 1 | 2 | 3;
  ownUsable: boolean;
  /** Jucătorul lor care îl voia (cel mai bun grad pe un rol liber de-al lor), pentru note. */
  enemyWanter: { name: string; grade: string } | null;
};

/**
 * Campionii contestați (FEEDBACK_FIXES §5.3, pe priorityValue din DRAFT_REALISM §6 / §12): la fiecare acțiune
 * proprie din faza 1 (ban 1, pick1-open, pick1-close), campionii tier 1–2 disponibili în acel moment
 * (priority calculat cu starea de atunci), pe care adversarul îi voia (enemyWant ≥ 5) sau pe care îi puteam juca.
 * Plus pick-urile proprii din faza 1 (pentru nota „am luat un tier 2 cât un tier 1 a mers la ei”).
 */
function getContestedChampions(
  game: DraftGameState, series: ActiveDraftSeries, side: Side,
  rosters: { own: Assignments; enemy: Assignments }, enemyTeamSlug: string,
) {
  const unavailable = new Set<string>();
  for (const previous of series.games) {
    if (previous.number >= game.number) continue;
    previous.picksBlue.forEach((id) => unavailable.add(id));
    previous.picksRed.forEach((id) => unavailable.add(id));
  }
  const enemySide: Side = side === "blue" ? "red" : "blue";
  const picks: Record<Side, string[]> = { blue: [], red: [] };
  const contested = new Map<string, Contested>();
  const ownPhaseOnePicks: { label: string; championId: string; value: number; tier: number; before: Set<string> }[] = [];
  const minEnemyWant = DRAFT_THINKING_CONFIG.priority.banMinEnemyWant;

  for (const { index, step, championId } of orderedActions(game)) {
    if (index > 11) break; // doar faza 1 (ban 1 + pick-urile din faza 1)
    if (step.side === side) {
      const lookup = createPriorityLookup({
        ownRoster: rosters.own,
        ownOpenRoles: getOpenRolesForPickedChampions(picks[side], rosters.own),
        enemyRoster: rosters.enemy,
        enemyOpenRoles: getOpenRolesForPickedChampions(picks[enemySide], rosters.enemy),
        enemyTeamSlug,
        unavailable,
      });
      const before = new Set(contested.keys());
      for (const champion of Object.values(championsById)) {
        if (!champion || unavailable.has(champion.id) || contested.has(champion.id)) continue;
        const priority = lookup(champion);
        if (priority.tier === 3 || (priority.enemyWant < minEnemyWant && !priority.ownUsable)) continue;
        let enemyWanter: Contested["enemyWanter"] = null;
        for (const role of champion.roles) {
          const player = rosters.enemy[role] ? playersById.get(rosters.enemy[role]!) : undefined;
          if (!player) continue;
          const playerGrade = getChampionGrade(player, champion.id);
          if (!enemyWanter || GRADE_RANK[playerGrade] > GRADE_RANK[enemyWanter.grade as keyof typeof GRADE_RANK]) enemyWanter = { name: player.name, grade: playerGrade };
        }
        contested.set(champion.id, { championId: champion.id, value: priority.value, tier: priority.tier, ownUsable: priority.ownUsable, enemyWanter });
      }
      if (step.action === "pick" && championId) {
        const priority = lookup(championsById[championId]!);
        ownPhaseOnePicks.push({ label: step.label, championId, value: priority.value, tier: priority.tier, before });
      }
    }
    if (championId) {
      unavailable.add(championId);
      if (step.action === "pick") picks[step.side].push(championId);
    }
  }
  return { contested: [...contested.values()].sort((a, b) => b.value - a.value), ownPhaseOnePicks };
}

function preparationPillar(
  game: DraftGameState, series: ActiveDraftSeries, side: Side,
  enemyTeamSlug: string, rosters: { own: Assignments; enemy: Assignments },
  ownPicks: string[], ownBans: string[], enemyPicks: string[],
  ownAssignments: Assignments, enemyAssignments: Assignments,
): DraftPillar {
  const notes = new Notes();
  // Ponderat cu priority value: un tier 1 pierdut contează mai mult decât un tier 2.
  let handled = 0;
  let lost = 0;
  const seen = new Set<string>();
  const lostIds: string[] = [];

  const resolve = (championId: string, label: string, weight: number, context?: Contested) => {
    if (seen.has(championId)) return;
    seen.add(championId);
    const wanter = context?.enemyWanter && GRADE_RANK[context.enemyWanter.grade as keyof typeof GRADE_RANK] >= GRADE_RANK.A
      ? `${context.enemyWanter.name} had it at ${context.enemyWanter.grade}`
      : null;
    if (ownPicks.includes(championId)) {
      handled += weight;
      notes.add(`Secured ${label}`);
      return;
    }
    if (ownBans.includes(championId)) {
      handled += weight;
      notes.add(`Banned ${label}${wanter ? `: ${wanter}` : ""}`);
      return;
    }
    if (!enemyPicks.includes(championId)) return; // nimeni nu l-a luat: nu contează
    const role = roleOf(enemyAssignments, championId);
    const answer = role ? findLaneAnswer(championId, role, ownAssignments) : null;
    if (answer) {
      handled += weight;
      notes.add(`Neutralized ${label} with ${name(answer.id)}`, `${answer.detail.label}: ${answer.detail.reason}`);
    } else {
      lost += weight;
      lostIds.push(championId);
      notes.add(`Left ${label}${wanter ? ` (${wanter})` : ""} without a ban or an answer`);
    }
  };

  // Favoriții de sezon ai adversarului (cu W–L), apoi campionii contestați din faza 1.
  const favorites = getSeasonFavorites(enemyTeamSlug, rosters.enemy, 5).filter(
    (entry) => entry.threat >= DRAFT_THINKING_CONFIG.season.threatThreshold,
  );
  const { contested, ownPhaseOnePicks } = getContestedChampions(game, series, side, rosters, enemyTeamSlug);
  const byId = new Map(contested.map((entry) => [entry.championId, entry]));
  for (const favorite of favorites) {
    const entry = byId.get(favorite.championId);
    resolve(favorite.championId, `${name(favorite.championId)} (${favorite.wins}–${favorite.games - favorite.wins} this season)`, entry?.value ?? REPORT.preparation.favoriteWeight, entry);
  }
  for (const entry of contested) resolve(entry.championId, `${name(entry.championId)} (tier ${entry.tier})`, entry.value, entry);

  // „Took Corki (tier 2) at B1, while Rumble (tier 1) went to them.”
  for (const lostId of lostIds) {
    const lostEntry = byId.get(lostId);
    if (!lostEntry || lostEntry.tier !== 1) continue;
    const lower = ownPhaseOnePicks.find((pick) => pick.before.has(lostId) && pick.tier > 1 && pick.value < lostEntry.value);
    if (lower) notes.add(`Took ${name(lower.championId)} (tier ${lower.tier}) at ${lower.label}, while ${name(lostId)} (tier 1) went to them`);
  }

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
    composition: compositionPillar(ownPicks, ownAssignments, roster, enemyPicks),
    lanes: lanesPillar(ownPicks, enemyPicks, ownAssignments, enemyAssignments, roster, getLaneOrder(game, side)),
    players: playersPillar(ownAssignments, roster, pickRoles, series.userSide === side),
    preparation: preparationPillar(game, series, side, enemyTeamSlug, { own: roster, enemy: enemyRoster }, ownPicks, ownBans, enemyPicks, ownAssignments, enemyAssignments),
  };
}

/** Raportul e în formatul curent (salvările vechi au alți piloni: priority / cohesion / …)? */
export function isCurrentPillarReport(report: unknown): report is DraftPillarReport {
  const value = report as Partial<DraftPillarReport> | null | undefined;
  return Boolean(value?.composition && value.lanes && value.players && value.preparation);
}
