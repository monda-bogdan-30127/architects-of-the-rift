// Champion mastery în draft (DRAFT_THINKING §1): nu draftăm ce nu știm juca.
//
//   - gate pe candidat: F pe jucătorul proiectat = exclus, D = penalizat (§1.5);
//   - costul reasignării: candidatul care mută un pick propriu pe un jucător
//     cu F e respins, cu D sau cu grad mult mai mic e penalizat (§1.4);
//   - pool subțire: dacă jucătorul are prea puțini campioni pe rolul lui, gate-ul
//     nu se aplică (date incomplete).

import { players } from "@/app/data/players";
import { championsById } from "@/app/data/champions";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { GRADE_RANK, getChampionGrade, getResolvedChampionPool } from "@/app/utils/championMasteryUtils";
import { canPickChampionIntoUniqueRoles, resolveRoleAssignments, type LockedRoles } from "./draftRoleResolver";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";

const MASTERY = DRAFT_THINKING_CONFIG.mastery;
const playersById = new Map(players.map((player) => [player.id, player]));

const thinPoolCache = new Map<string, boolean>();
const warnedThinPool = new Set<string>();

/** Jucătorul are sub `thinPoolMinEntries` campioni (≠ F) care pot juca `role`? */
export function hasThinPool(player: Player, role: Role): boolean {
  const key = `${player.id}:${role}`;
  let thin = thinPoolCache.get(key);
  if (thin === undefined) {
    const entries = getResolvedChampionPool(player).filter((entry) => championsById[entry.champion]?.roles.includes(role));
    thin = entries.length < MASTERY.thinPoolMinEntries;
    thinPoolCache.set(key, thin);
    if (thin && !warnedThinPool.has(key)) {
      warnedThinPool.add(key);
      console.warn(`[draft] ${player.id} are doar ${entries.length} campioni pe ${role} în pool: gate-ul de mastery nu se aplică`);
    }
  }
  return thin;
}

export type MasteryGate = {
  grade: ChampionMasteryGrade | null;
  /** F pe jucătorul proiectat (și pool-ul lui nu e subțire). */
  blocked: boolean;
  /** D: penalizare în scor + intră în shortlist doar pe primul loc. */
  soft: boolean;
  penalty: number;
};

export function getMasteryGate(player: Player | null, championId: string, role: Role | null): MasteryGate {
  if (!player || !role) return { grade: null, blocked: false, soft: false, penalty: 0 };
  const grade = getChampionGrade(player, championId);
  if (hasThinPool(player, role)) return { grade, blocked: false, soft: false, penalty: 0 };
  const rank = GRADE_RANK[grade];
  const blocked = rank <= MASTERY.hardBlockRank;
  const soft = !blocked && rank <= MASTERY.softBlockRank;
  return { grade, blocked, soft, penalty: soft ? MASTERY.dPenalty : 0 };
}

export type ReassignmentEntry = {
  championId: string;
  fromRole: Role;
  toRole: Role;
  playerId: string | null;
  grade: ChampionMasteryGrade | null;
};

export type ReassignmentCheck = {
  entries: ReassignmentEntry[];
  /** Candidatul ar muta un pick propriu pe un jucător cu F (sau rolul blocat nu-l lasă să încapă). */
  breaksOwnPick: boolean;
  penalty: number;
};

function roleOf(assignments: Partial<Record<Role, string>>, championId: string): Role | null {
  return ((Object.entries(assignments) as [Role, string | undefined][]).find(([, id]) => id === championId)?.[0] ?? null);
}

/**
 * §1.4 — ce pick-uri proprii își schimbă rolul dacă luăm candidatul.
 * Cu roluri blocate, un candidat care încape doar mutând un pick blocat pe un
 * jucător sub C e respins (`breaksOwnPick`); entries vin din asignarea fără blocări.
 */
export function getReassignmentCheck(
  ownPicks: readonly string[],
  candidateId: string,
  roster: Partial<Record<Role, string>>,
  lockedRoles: LockedRoles,
): ReassignmentCheck {
  const none: ReassignmentCheck = { entries: [], breaksOwnPick: false, penalty: 0 };
  if (ownPicks.length === 0) return none;

  const fitsLocked = canPickChampionIntoUniqueRoles([...ownPicks], candidateId, roster, lockedRoles);
  const fitsFree = fitsLocked || canPickChampionIntoUniqueRoles([...ownPicks], candidateId, roster);
  if (!fitsFree) return none; // nu încape deloc: `invalid-role-map` obișnuit

  const before = resolveRoleAssignments([...ownPicks], roster, lockedRoles);
  const after = resolveRoleAssignments([...ownPicks, candidateId], roster, fitsLocked ? lockedRoles : undefined);

  const entries: ReassignmentEntry[] = [];
  let breaksOwnPick = !fitsLocked;
  let penalty = 0;
  for (const championId of ownPicks) {
    const fromRole = roleOf(before, championId);
    const toRole = roleOf(after, championId);
    if (!fromRole || !toRole || fromRole === toRole) continue;
    const fromPlayer = roster[fromRole] ? playersById.get(roster[fromRole]!) ?? null : null;
    const toPlayer = roster[toRole] ? playersById.get(roster[toRole]!) ?? null : null;
    const grade = toPlayer ? getChampionGrade(toPlayer, championId) : null;
    entries.push({ championId, fromRole, toRole, playerId: toPlayer?.id ?? null, grade });
    if (!grade) continue;
    if (grade === "F" && !hasThinPool(toPlayer!, toRole)) {
      breaksOwnPick = true;
    } else if (grade === "D") {
      penalty += MASTERY.reassignDPenalty;
    } else if (fromPlayer) {
      const drop = GRADE_RANK[getChampionGrade(fromPlayer, championId)] - GRADE_RANK[grade];
      if (drop >= 2) penalty += MASTERY.reassignDropPenalty * drop;
    }
  }
  return { entries, breaksOwnPick, penalty };
}

/** Gradul minim B+ al vreunui jucător de pe rolurile libere pe care le poate juca campionul (§1.5 pct. 3). */
export function getBestOpenRoleGradeRank(
  championId: string,
  openRoles: readonly Role[],
  roster: Partial<Record<Role, string>>,
): { bestRank: number; allBlocked: boolean } {
  const champion = championsById[championId];
  let bestRank = -1;
  let allBlocked = true;
  let anyRole = false;
  for (const role of openRoles) {
    if (!champion?.roles.includes(role)) continue;
    anyRole = true;
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    if (!player) {
      allBlocked = false;
      bestRank = Math.max(bestRank, GRADE_RANK.C);
      continue;
    }
    const rank = GRADE_RANK[getChampionGrade(player, championId)];
    bestRank = Math.max(bestRank, rank);
    if (rank > MASTERY.hardBlockRank || hasThinPool(player, role)) allBlocked = false;
  }
  return { bestRank, allBlocked: anyRole && allBlocked };
}
