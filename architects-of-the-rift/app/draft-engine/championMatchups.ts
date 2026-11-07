// Citirea matchup-urilor și a mustWith pe rol (DRAFT_REWORK §2.3–2.4).
//
// Singurul loc (în afară de validator) care citește matchup-urile și mustWith din
// `champion.roleData` (fișierele din app/data/champions/). Fișierele au doar
// `goodVs` („pe cine bat eu”); `weakVs` se generează integral din `goodVs`-ul
// celorlalți:
//   A:rA goodVs B (g) → B:rB weakVs A (g, vsRole rA)
// Totul se calculează o singură dată, la primul acces.

import { champions, championsById } from "@/app/data/champions";
import type {
  ChampionRoleKey,
  ChampionRoleMatchups,
  MatchupRelation,
  Role,
} from "@/app/types/champion";
import { getRelationStrength, isMatchupLevel, isMatchupPhase } from "./matchupGrades";

const isUsableRelation = (relation: MatchupRelation) => isMatchupLevel(relation.level) && isMatchupPhase(relation.phase);


export type MatchupDerivationIssue = {
  level: "warning" | "error";
  key: ChampionRoleKey;
  message: string;
};

const EMPTY_MATCHUPS: ChampionRoleMatchups = Object.freeze({
  goodVs: Object.freeze([]) as unknown as MatchupRelation[],
  weakVs: Object.freeze([]) as unknown as MatchupRelation[],
  mustWith: Object.freeze([]) as unknown as string[],
});

export function getRoleKey(championId: string, role: Role): ChampionRoleKey {
  return `${championId}:${role}`;
}

export function isBotRole(role: Role | null | undefined): role is "adc" | "support" {
  return role === "adc" || role === "support";
}

export function getComplementaryBotRole(role: Role): Role | null {
  if (role === "adc") return "support";
  if (role === "support") return "adc";
  return null;
}

function canPlayRole(championId: string, role: Role): boolean {
  return championsById[championId]?.roles.includes(role) ?? false;
}

/**
 * Se aplică relația când inamicul e pe `enemyRole`? (§2.3)
 * - rol inamic necunoscut → da (fallback permisiv);
 * - `vsRole` explicit → doar pe acel rol;
 * - `adc`/`support` → botlane 2v2 (inamicul pe `adc` sau `support`);
 * - altfel → același rol ca al nostru.
 */
export function relationAppliesToEnemyRole(
  relation: Pick<MatchupRelation, "vsRole">,
  ownRole: Role,
  enemyRole: Role | null | undefined,
): boolean {
  if (!enemyRole) return true;
  if (relation.vsRole) return relation.vsRole === enemyRole;
  if (isBotRole(ownRole)) return isBotRole(enemyRole);
  return enemyRole === ownRole;
}

/** rB: `vsRole` dacă e setat; altfel rA dacă B îl poate juca; altfel rolul bot complementar. */
function resolveDerivedRole(targetId: string, sourceRole: Role, vsRole: Role | undefined): Role | null {
  if (vsRole) return canPlayRole(targetId, vsRole) ? vsRole : null;
  if (canPlayRole(targetId, sourceRole)) return sourceRole;
  const botRole = getComplementaryBotRole(sourceRole);
  if (botRole && canPlayRole(targetId, botRole)) return botRole;
  return null;
}

type MatchupIndex = {
  byKey: Map<ChampionRoleKey, ChampionRoleMatchups>;
  issues: MatchupDerivationIssue[];
};

let cachedIndex: MatchupIndex | null = null;

function buildIndex(): MatchupIndex {
  const issues: MatchupDerivationIssue[] = [];
  // Datele explicite, în ordinea campionilor și a rolurilor din `roleData`.
  const explicit: Partial<Record<ChampionRoleKey, Pick<ChampionRoleMatchups, "goodVs" | "mustWith">>> = {};
  for (const champion of champions) {
    for (const [role, data] of Object.entries(champion.roleData)) {
      if (!data) continue;
      // Relațiile cu level / phase invalid sunt ignorate aici și raportate de validator.
      explicit[getRoleKey(champion.id, role as Role)] = {
        goodVs: data.goodVs.filter(isUsableRelation),
        mustWith: data.mustWith ?? [],
      };
    }
  }
  const byKey = new Map<ChampionRoleKey, ChampionRoleMatchups>();

  for (const champion of champions) {
    for (const role of champion.roles) {
      const key = getRoleKey(champion.id, role);
      const entry = explicit[key];
      byKey.set(key, {
        goodVs: entry ? [...entry.goodVs] : [],
        weakVs: [],
        mustWith: entry ? [...entry.mustWith] : [],
      });
    }
  }

  for (const [sourceKey, entry] of Object.entries(explicit) as [ChampionRoleKey, Pick<ChampionRoleMatchups, "goodVs">][]) {
    const separator = sourceKey.lastIndexOf(":");
    const sourceId = sourceKey.slice(0, separator);
    const sourceRole = sourceKey.slice(separator + 1) as Role;

    for (const relation of entry.goodVs) {
      const targetId = relation.championId;
      if (!championsById[targetId]) continue; // id inexistent — raportat de validator
      const targetRole = resolveDerivedRole(targetId, sourceRole, relation.vsRole);
      if (!targetRole) {
        issues.push({
          level: "warning",
          key: sourceKey,
          message: `goodVs ${targetId}: nu se poate deriva — ${targetId} nu joacă ${relation.vsRole ?? sourceRole}`,
        });
        continue;
      }

      const target = byKey.get(getRoleKey(targetId, targetRole));
      if (!target) continue;

      // Același sursă:rol scris de două ori spre aceeași țintă (ex. cu și fără vsRole) → cea mai puternică.
      const existing = target.weakVs.find(
        (other) => other.championId === sourceId && other.vsRole === sourceRole,
      );
      if (existing) {
        if (getRelationStrength(relation) > getRelationStrength(existing)) {
          existing.level = relation.level;
          existing.phase = relation.phase;
        }
        continue;
      }

      target.weakVs.push({
        championId: sourceId,
        level: relation.level,
        phase: relation.phase,
        vsRole: sourceRole,
        ...(relation.note ? { note: relation.note } : {}),
      });
    }
  }

  return { byKey, issues };
}

function getIndex(): MatchupIndex {
  cachedIndex ??= buildIndex();
  return cachedIndex;
}

/** Matchup-urile campionului pe rol: `goodVs` din fișier, `weakVs` derivat. Rol nejucat → liste goale. */
export function getRoleMatchups(championId: string, role: Role): ChampionRoleMatchups {
  return getIndex().byKey.get(getRoleKey(championId, role)) ?? EMPTY_MATCHUPS;
}

function strongestApplicable(
  relations: readonly MatchupRelation[],
  ownRole: Role,
  enemyId: string,
  enemyRole: Role | null | undefined,
): MatchupRelation | undefined {
  let best: MatchupRelation | undefined;
  for (const relation of relations) {
    if (relation.championId !== enemyId) continue;
    if (!relationAppliesToEnemyRole(relation, ownRole, enemyRole)) continue;
    if (!best || getRelationStrength(relation) > getRelationStrength(best)) best = relation;
  }
  return best;
}

/**
 * Relațiile campionului (pe `role`) contra `enemyId` (pe `enemyRole`, dacă se știe);
 * din mai multe aplicabile pe aceeași listă se ia cea mai puternică.
 * Pot exista ambele (permis doar lane + late: câștigă pe linie, pierde late).
 */
export function getMatchupRelations(
  championId: string,
  role: Role,
  enemyId: string,
  enemyRole?: Role | null,
): { good?: MatchupRelation; weak?: MatchupRelation } {
  const matchups = getRoleMatchups(championId, role);
  const good = strongestApplicable(matchups.goodVs, role, enemyId, enemyRole);
  const weak = strongestApplicable(matchups.weakVs, role, enemyId, enemyRole);
  return {
    ...(good ? { good } : {}),
    ...(weak ? { weak } : {}),
  };
}

export function getMustWith(championId: string, role: Role): string[] {
  return [...getRoleMatchups(championId, role).mustWith];
}

/**
 * Partenerii mustWith ai ancorei — DOAR lista ancorei. `mustWith` e direcțional:
 * „X e construit în jurul lui Y” (Kog'Maw → Lulu) nu face din Lulu o ancoră
 * pentru Kog'Maw. Perechile reciproce (Xayah ↔ Rakan) se scriu în ambele fișiere.
 */
export function getMustWithPartners(anchorId: string, anchorRole: Role): string[] {
  return getMustWith(anchorId, anchorRole);
}

/** Derivările imposibile (rol pe care ținta nu-l joacă) — pentru validator. */
export function getMatchupDerivationIssues(): readonly MatchupDerivationIssue[] {
  return getIndex().issues;
}
