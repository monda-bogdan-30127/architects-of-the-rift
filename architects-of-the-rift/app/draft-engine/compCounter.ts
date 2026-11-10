// Pilonul 3: comp counter + matchup-uri, fără tunnel vision (DRAFT_THINKING §6).
//
//   - comp vs comp: `COMP_COUNTER_MATRIX[identitatea noastră cu candidatul][a lor] × strength`;
//   - tunnel vision: candidatul contrează comp-ul, dar pierde linia → bonus redus și −1;
//   - „still losing matchups”: pierdem deja liniile → nu mai lua încă o linie pierdută.

import type { Champion, Role } from "@/app/types/champion";
import { getChampionById } from "./draftEvaluator";
import { COMP_COUNTER_MATRIX, getCandidateIdentityFit, readCompIdentity, type CompIdentity } from "./compIdentity";
import { getMatchupRelations, isBotRole } from "./championMatchups";
import { isLaneCounter, isStrongCounter } from "./matchupGrades";
import { getMatchupValue } from "./matchupScoring";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { ROLE_ORDER } from "./draftTypes";

const CC = DRAFT_THINKING_CONFIG.compCounter;
const name = (championId: string) => getChampionById(championId)?.name ?? championId;

type Assignments = Partial<Record<Role, string>>;

/** Adversarii direcți ai rolului: același rol; botlane = 2v2 (adc + support). */
export function getDirectOpponents(role: Role, enemyAssignments: Assignments): { id: string; role: Role }[] {
  const roles: Role[] = isBotRole(role) ? ["adc", "support"] : [role];
  return roles.filter((entry) => enemyAssignments[entry]).map((entry) => ({ id: enemyAssignments[entry]!, role: entry }));
}

export type CompCounterResult = {
  value: number;
  ours: CompIdentity | null;
  theirs: CompIdentity | null;
  /** Tunnel vision: candidatul pierde linia contra adversarului direct. */
  tunnelVision: { opponentId: string } | null;
  lines: string[];
};

/**
 * §6.1 / §6.2 — valoarea de comp counter a candidatului (doar cu ≥ 2 pick-uri inamice),
 * redusă la `tunnelVisionFactor` și −1 dacă pierde linia (weakVs isLaneCounter / isStrongCounter).
 */
export function getCompCounterValue(args: {
  candidate: Champion;
  role: Role | null;
  ownPicks: readonly string[];
  ownAssignmentsWithCandidate: Assignments;
  enemyPicks: readonly string[];
  enemyAssignments: Assignments;
}): CompCounterResult {
  const none: CompCounterResult = { value: 0, ours: null, theirs: null, tunnelVision: null, lines: [] };
  if (args.enemyPicks.length < CC.minEnemyPicks) return none;
  const theirs = readCompIdentity([...args.enemyPicks], args.enemyAssignments);
  const ours = readCompIdentity([...args.ownPicks, args.candidate.id], args.ownAssignmentsWithCandidate);
  if (!theirs.dominant || !ours.dominant) return { ...none, ours: ours.dominant, theirs: theirs.dominant };

  let value = COMP_COUNTER_MATRIX[ours.dominant][theirs.dominant] * theirs.strength * CC.weight;
  const lines: string[] = [];
  let tunnelVision: CompCounterResult["tunnelVision"] = null;

  if (value > 0 && args.role) {
    const loses = getDirectOpponents(args.role, args.enemyAssignments).find(({ id, role }) => {
      const weak = getMatchupRelations(args.candidate.id, args.role!, id, role).weak;
      return Boolean(weak && (isLaneCounter(weak) || isStrongCounter(weak)));
    });
    if (loses) {
      value = value * CC.tunnelVisionFactor - CC.tunnelVisionPenalty;
      tunnelVision = { opponentId: loses.id };
      lines.push(`${args.candidate.name} counters their comp, but loses lane vs ${name(loses.id)}: avoided`);
    }
  }
  if (!tunnelVision && value >= CC.explainMin) {
    lines.push(`Comp counter: ${ours.dominant} vs ${theirs.dominant} (+${value.toFixed(1)})`);
  }
  return { value, ours: ours.dominant, theirs: theirs.dominant, tunnelVision, lines };
}

/** Valoarea pe linie (faza early) a unui campion contra adversarilor direcți deja aleși. */
function laneValue(championId: string, role: Role, enemyAssignments: Assignments): { value: number; opponents: string[] } {
  const opponents = getDirectOpponents(role, enemyAssignments);
  const value = opponents.reduce((sum, { id, role: enemyRole }) => sum + getMatchupValue(championId, role, id, enemyRole, { phase: "early" }), 0);
  return { value, opponents: opponents.map(({ id }) => id) };
}

export type LosingLanesResult = { bonus: number; tag: "losing-lanes" | null; balance: number; line: string | null };

/**
 * §6.3 — bilanțul liniilor proprii (early) vs adversarii direcți. Bilanț ≤ −3 și
 * candidatul pierde și el linia → −1.25; bilanț negativ și candidatul câștigă linia → +0.75.
 */
export function getLosingLanesEffect(args: {
  candidate: Champion;
  role: Role | null;
  ownAssignments: Assignments;
  enemyAssignments: Assignments;
}): LosingLanesResult {
  const none: LosingLanesResult = { bonus: 0, tag: null, balance: 0, line: null };
  if (!args.role) return none;
  let balance = 0;
  for (const role of ROLE_ORDER) {
    const championId = args.ownAssignments[role];
    if (!championId || championId === args.candidate.id) continue;
    balance += laneValue(championId, role, args.enemyAssignments).value;
  }
  const own = laneValue(args.candidate.id, args.role, args.enemyAssignments);
  if (!own.opponents.length || balance >= 0) return { ...none, balance };

  const vs = own.opponents.map(name).join(" / ");
  if (balance <= CC.losingLanesThreshold && own.value < 0) {
    return {
      bonus: -CC.losingLanesPenalty,
      tag: "losing-lanes",
      balance,
      line: `Already losing lanes (${balance.toFixed(1)}), and ${args.candidate.name} also loses vs ${vs}`,
    };
  }
  if (own.value > 0) {
    return { bonus: CC.balancingBonus, tag: null, balance, line: `${args.candidate.name} wins lane vs ${vs}: balances the lanes (${balance.toFixed(1)})` };
  }
  return { ...none, balance };
}

/**
 * §6.1 (ban) — banează campionii care ar întări cel mai mult identitatea inamicului,
 * mai ales când identitatea lor o bate pe a noastră.
 */
export function getEnemyIdentityBanBonus(
  candidate: Champion,
  enemyIdentity: { dominant: CompIdentity | null; strength: number },
  ourIdentity: CompIdentity | null,
): number {
  if (!enemyIdentity.dominant) return 0;
  const fit = Math.max(0, getCandidateIdentityFit(candidate, null, enemyIdentity.dominant));
  if (fit <= 0) return 0;
  const edge = ourIdentity ? Math.max(0, COMP_COUNTER_MATRIX[enemyIdentity.dominant][ourIdentity]) : 0;
  return Math.min(CC.banCap, fit * (CC.banBase + edge) * enemyIdentity.strength * CC.banWeight);
}
