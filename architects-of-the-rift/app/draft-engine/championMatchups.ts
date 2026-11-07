// Citirea matchup-urilor și a mustWith pe rol (DRAFT_REWORK §2.3–2.4).
//
// Singurul loc (în afară de validator) care citește matchup-urile și mustWith din
// `champion.roleData` (fișierele din app/data/champions/). Datele explicite sunt
// completate cu relațiile derivate în ambele sensuri:
//   A:rA weakVs B (g) → B:rB goodVs A (g, vsRole rA)
//   A:rA goodVs B (g) → B:rB weakVs A (g, vsRole rA)
// Intrarea explicită câștigă mereu pe cea derivată. Totul se calculează o
// singură dată, la primul acces.

import { champions, championsById } from "@/app/data/champions";
import type {
  ChampionRoleKey,
  ChampionRoleMatchups,
  MatchupRelation,
  Role,
} from "@/app/types/champion";
import { getRelationStrength, isMatchupLevel, isMatchupPhase } from "./matchupGrades";

const isUsableRelation = (relation: MatchupRelation) => isMatchupLevel(relation.level) && isMatchupPhase(relation.phase);


type MatchupListKey = "goodVs" | "weakVs";

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
  /** anchorId → campionii care au ancora în `mustWith`, cu rolul pe care o au. */
  reverseMustWith: Map<string, { championId: string; role: Role }[]>;
  issues: MatchupDerivationIssue[];
};

let cachedIndex: MatchupIndex | null = null;

function buildIndex(): MatchupIndex {
  const issues: MatchupDerivationIssue[] = [];
  // Datele explicite, în ordinea campionilor și a rolurilor din `roleData`.
  const explicit: Partial<Record<ChampionRoleKey, ChampionRoleMatchups>> = {};
  for (const champion of champions) {
    for (const [role, data] of Object.entries(champion.roleData)) {
      if (!data) continue;
      // Relațiile cu level / phase invalid sunt ignorate aici și raportate de validator.
      explicit[getRoleKey(champion.id, role as Role)] = {
        goodVs: data.goodVs.filter(isUsableRelation),
        weakVs: data.weakVs.filter(isUsableRelation),
        mustWith: data.mustWith,
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
        weakVs: entry ? [...entry.weakVs] : [],
        mustWith: entry ? [...entry.mustWith] : [],
      });
    }
  }

  const derivedLists: [MatchupListKey, MatchupListKey][] = [
    ["weakVs", "goodVs"],
    ["goodVs", "weakVs"],
  ];

  for (const [sourceKey, entry] of Object.entries(explicit) as [ChampionRoleKey, ChampionRoleMatchups][]) {
    const separator = sourceKey.lastIndexOf(":");
    const sourceId = sourceKey.slice(0, separator);
    const sourceRole = sourceKey.slice(separator + 1) as Role;

    for (const [fromList, toList] of derivedLists) {
      for (const relation of entry[fromList]) {
        const targetId = relation.championId;
        if (!championsById[targetId]) continue; // id inexistent — raportat de validator
        const targetRole = resolveDerivedRole(targetId, sourceRole, relation.vsRole);
        if (!targetRole) {
          issues.push({
            level: "warning",
            key: sourceKey,
            message: `${fromList} ${targetId}: nu se poate deriva — ${targetId} nu joacă ${relation.vsRole ?? sourceRole}`,
          });
          continue;
        }

        const target = byKey.get(getRoleKey(targetId, targetRole));
        if (!target) continue;

        const explicitTarget = explicit[getRoleKey(targetId, targetRole)]?.[toList] ?? [];
        const explicitMatch = explicitTarget.find(
          (other) =>
            other.championId === sourceId && relationAppliesToEnemyRole(other, targetRole, sourceRole),
        );
        if (explicitMatch) {
          // Contradicția se vede din ambele sensuri — raportată o singură dată.
          const differs = explicitMatch.level !== relation.level || explicitMatch.phase !== relation.phase;
          if (differs && sourceKey < getRoleKey(targetId, targetRole)) {
            issues.push({
              level: "error",
              key: sourceKey,
              message:
                `contradicție: ${sourceKey} ${fromList} ${targetId} ${describeLevelPhase(relation)}, ` +
                `dar ${targetId}:${targetRole} ${toList} ${sourceId} ${describeLevelPhase(explicitMatch)}`,
            });
          }
          continue; // explicitul câștigă
        }

        const existing = target[toList].find(
          (other) => other.championId === sourceId && other.vsRole === sourceRole,
        );
        if (existing) {
          if (getRelationStrength(relation) > getRelationStrength(existing)) {
            existing.level = relation.level;
            existing.phase = relation.phase;
          }
          continue;
        }

        target[toList].push({
          championId: sourceId,
          level: relation.level,
          phase: relation.phase,
          vsRole: sourceRole,
          ...(relation.note ? { note: relation.note } : {}),
        });
      }
    }
  }

  const reverseMustWith = new Map<string, { championId: string; role: Role }[]>();
  for (const [key, entry] of byKey) {
    const separator = key.lastIndexOf(":");
    const championId = key.slice(0, separator);
    const role = key.slice(separator + 1) as Role;
    for (const anchorId of entry.mustWith) {
      const list = reverseMustWith.get(anchorId) ?? [];
      list.push({ championId, role });
      reverseMustWith.set(anchorId, list);
    }
  }

  return { byKey, reverseMustWith, issues };
}

function getIndex(): MatchupIndex {
  cachedIndex ??= buildIndex();
  return cachedIndex;
}

/** Matchup-urile campionului pe rol: explicite + derivate. Rol nejucat → liste goale. */
export function getRoleMatchups(championId: string, role: Role): ChampionRoleMatchups {
  return getIndex().byKey.get(getRoleKey(championId, role)) ?? EMPTY_MATCHUPS;
}

function describeLevelPhase(relation: Pick<MatchupRelation, "level" | "phase">) {
  return `level ${relation.level}/${relation.phase}`;
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
 * Partenerii mustWith ai ancorei: întâi lista ancorei, apoi campionii care au
 * ancora în `mustWith` pe rolul complementar (bot: celălalt rol bot; altfel:
 * orice rol diferit de al ancorei).
 */
export function getMustWithPartners(anchorId: string, anchorRole: Role): string[] {
  const partners = getMustWith(anchorId, anchorRole);
  const botComplement = getComplementaryBotRole(anchorRole);

  for (const { championId, role } of getIndex().reverseMustWith.get(anchorId) ?? []) {
    if (championId === anchorId || partners.includes(championId)) continue;
    const complementary = botComplement ? role === botComplement : role !== anchorRole;
    if (complementary) partners.push(championId);
  }
  return partners;
}

/** Warning-uri și erori găsite la derivare — pentru validator (§6). */
export function getMatchupDerivationIssues(): readonly MatchupDerivationIssue[] {
  return getIndex().issues;
}
