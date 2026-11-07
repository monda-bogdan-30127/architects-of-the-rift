// ─── utils/championMatchupValidation.ts ─────────────────────────────────────
//
// Validează datele pe rol din `champion.roleData` (fișierele din app/data/champions/;
// DRAFT_REWORK §6, MATCHUP_LEVEL_PHASE §8). Rulează:
//   npm run validate:matchups
//
// Structura se verifică pe datele explicite; contradicțiile și derivările
// imposibile vin din `championMatchups.ts` (același cod care le folosește în
// joc), iar regula „goodVs + weakVs pe același inamic” se verifică pe listele
// efective (explicit + derivat).
// ─────────────────────────────────────────────────────────────────────────────

import { champions as defaultChampions } from "../data/champions";
import {
  getMatchupDerivationIssues,
  getRoleMatchups,
  relationAppliesToEnemyRole,
} from "../draft-engine/championMatchups";
import { MATCHUP_LEVELS, MATCHUP_PHASES, isMatchupLevel, isMatchupPhase } from "../draft-engine/matchupGrades";
import type {
  Champion,
  ChampionRoleData,
  MatchupLevel,
  MatchupPhase,
  MatchupRelation,
  Role,
} from "../types/champion";

export type MatchupIssueSeverity = "error" | "warning";

export interface MatchupValidationIssue {
  severity: MatchupIssueSeverity;
  key: string;
  message: string;
}

/** Câte relații în fiecare celulă level × phase. */
export type LevelPhaseCounts = Record<MatchupLevel, Record<MatchupPhase, number>>;

export interface MatchupValidationResult {
  issues: MatchupValidationIssue[];
  errorCount: number;
  warningCount: number;
  ok: boolean;
  /** Per rol: relațiile efective (explicit + derivat) pe level × phase. */
  levelPhaseCountsByRole: Record<Role, { goodVs: LevelPhaseCounts; weakVs: LevelPhaseCounts }>;
  /** Totalul relațiilor scrise explicit în fișiere. */
  explicitRelationCount: number;
}

const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];
const LISTS = ["goodVs", "weakVs"] as const;

const emptyCounts = (): LevelPhaseCounts =>
  Object.fromEntries(
    MATCHUP_LEVELS.map((level) => [level, Object.fromEntries(MATCHUP_PHASES.map((phase) => [phase, 0]))]),
  ) as LevelPhaseCounts;

function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

/** Există un rol inamic pe care se aplică ambele relații? */
function overlaps(a: MatchupRelation, b: MatchupRelation, ownRole: Role): boolean {
  return ROLES.some(
    (enemyRole) =>
      relationAppliesToEnemyRole(a, ownRole, enemyRole) && relationAppliesToEnemyRole(b, ownRole, enemyRole),
  );
}

export function validateChampionRoleMatchups(champions: Champion[] = defaultChampions): MatchupValidationResult {
  // Verificările pe listele efective (derivare) folosesc indexul din championMatchups,
  // construit din datele reale — rulează doar pentru ele.
  const isRealData = champions === defaultChampions;
  const issues: MatchupValidationIssue[] = [];
  const error = (key: string, message: string) => issues.push({ severity: "error", key, message });
  const warning = (key: string, message: string) => issues.push({ severity: "warning", key, message });
  const byId = new Map(champions.map((champion) => [champion.id, champion]));
  let explicitRelationCount = 0;

  // ── roleData: exact cheile din `roles` ───────────────────────────────────
  for (const owner of champions) {
    const roleKeys = Object.keys(owner.roleData ?? {});
    for (const role of owner.roles) {
      if (!owner.roleData?.[role]) error(`${owner.id}:${role}`, `roleData nu are rolul ${role} din \`roles\``);
    }
    for (const roleKey of roleKeys) {
      if (!isRole(roleKey)) error(`${owner.id}:${roleKey}`, `roleData are o cheie invalidă "${roleKey}"`);
      else if (!owner.roles.includes(roleKey)) error(`${owner.id}:${roleKey}`, `roleData are rolul ${roleKey}, care nu e în \`roles\``);
    }
    for (const [roleKey, entry] of Object.entries(owner.roleData ?? {})) {
      if (entry && isRole(roleKey)) validateRoleEntry(owner, roleKey, entry);
    }
  }

  function validateRoleEntry(owner: Champion, role: Role, entry: ChampionRoleData) {
    const key = `${owner.id}:${role}`;

    // ── Relațiile goodVs / weakVs ──────────────────────────────────────────
    for (const list of LISTS) {
      const seen = new Set<string>();
      for (const relation of entry[list] ?? []) {
        explicitRelationCount += 1;
        const label = `${list} ${relation.championId}`;
        if ("score" in relation) error(key, `${label}: \`score\` încă prezent (formatul vechi; folosește level + phase)`);
        const level: unknown = relation.level;
        const phase: unknown = relation.phase;
        if (level === undefined || level === null) error(key, `${label}: lipsește \`level\``);
        else if (!isMatchupLevel(level)) error(key, `${label}: level ${String(level)} în afara 1..3`);
        if (phase === undefined || phase === null) error(key, `${label}: lipsește \`phase\``);
        else if (!isMatchupPhase(phase)) error(key, `${label}: phase "${String(phase)}" invalid (lane / late / all)`);
        if (level === 1 && phase !== "all") warning(key, `${label}: level 1 cu phase "${String(phase)}" — rar are sens`);
        if (!byId.has(relation.championId)) error(key, `${label}: campion inexistent`);
        if (relation.championId === owner.id) error(key, `${label}: self-reference`);
        if (relation.vsRole !== undefined && !isRole(relation.vsRole)) {
          error(key, `${label}: vsRole invalid "${String(relation.vsRole)}"`);
        }
        const dedupeKey = `${relation.championId}|${relation.vsRole ?? ""}`;
        if (seen.has(dedupeKey)) error(key, `${label}: același adversar de două ori în aceeași listă`);
        seen.add(dedupeKey);
      }
    }

    // ── mustWith ───────────────────────────────────────────────────────────
    const seenPartners = new Set<string>();
    for (const partnerId of entry.mustWith ?? []) {
      const partner = byId.get(partnerId);
      if (!partner) {
        error(key, `mustWith ${partnerId}: campion inexistent`);
        continue;
      }
      if (partnerId === owner.id) error(key, `mustWith ${partnerId}: self-reference`);
      if (seenPartners.has(partnerId)) error(key, `mustWith ${partnerId}: duplicat`);
      seenPartners.add(partnerId);

      if (role === "adc" && !partner.roles.includes("support")) {
        error(key, `mustWith ${partnerId}: partenerul unui adc trebuie să aibă rolul support`);
      } else if (role === "support" && !partner.roles.includes("adc")) {
        error(key, `mustWith ${partnerId}: partenerul unui support trebuie să aibă rolul adc`);
      } else if (role !== "adc" && role !== "support" && !partner.roles.some((partnerRole) => partnerRole !== role)) {
        warning(key, `mustWith ${partnerId}: partenerul nu are niciun rol diferit de ${role}`);
      }
    }

    // ── stats ──────────────────────────────────────────────────────────────
    if (entry.stats !== null && typeof entry.stats !== "object") error(key, "stats trebuie să fie null sau un obiect");
  }

  // ── Contradicții explicite și derivări imposibile (din championMatchups) ─
  if (isRealData) {
    for (const issue of getMatchupDerivationIssues()) {
      issues.push({ severity: issue.level, key: issue.key, message: issue.message });
    }
  }

  // ── Același inamic în goodVs și weakVs: permis doar lane + late ──────────
  const levelPhaseCountsByRole = Object.fromEntries(
    ROLES.map((role) => [role, { goodVs: emptyCounts(), weakVs: emptyCounts() }]),
  ) as MatchupValidationResult["levelPhaseCountsByRole"];

  if (isRealData) {
    const isValid = (relation: MatchupRelation, ownerId: string) =>
      relation.championId !== ownerId && isMatchupLevel(relation.level) && isMatchupPhase(relation.phase);
    const reportedPairs = new Set<string>();
    for (const champion of champions) {
      for (const role of champion.roles) {
        const key = `${champion.id}:${role}`;
        const effective = getRoleMatchups(champion.id, role);
        for (const list of LISTS) {
          for (const relation of effective[list]) {
            if (isValid(relation, champion.id)) levelPhaseCountsByRole[role][list][relation.level][relation.phase] += 1;
          }
        }
        for (const good of effective.goodVs) {
          if (!isValid(good, champion.id)) continue;
          for (const weak of effective.weakVs) {
            if (!isValid(weak, champion.id)) continue;
            if (good.championId !== weak.championId || !overlaps(good, weak, role)) continue;
            // Derivarea oglindește conflictul pe partea cealaltă — raportează o singură dată.
            const pairKey = [champion.id, good.championId].sort().join("|") + `|${role}`;
            if (reportedPairs.has(pairKey)) continue;
            reportedPairs.add(pairKey);
            const phases = [good.phase, weak.phase].sort().join("+");
            if (phases !== "lane+late") {
              error(
                key,
                `${good.championId} e și în goodVs (${good.phase}) și în weakVs (${weak.phase}) — permis doar lane + late`,
              );
            }
          }
        }
      }
    }
  }

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.length - errorCount;
  return {
    issues,
    errorCount,
    warningCount,
    ok: errorCount === 0,
    levelPhaseCountsByRole,
    explicitRelationCount,
  };
}
