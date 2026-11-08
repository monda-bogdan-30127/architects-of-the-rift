// Anti-sinergii între campioni (BAD_SYNERGY_TO_CHAMPIONS §2, §4).
//
// Singurul loc (în afară de validator) care citește `champion.badSynergyWith`
// (fișierele din app/data/champions/). O pereche e scrisă o singură dată, într-unul
// dintre cele două fișiere, și se aplică simetric. Indexul se construiește o
// singură dată, la primul acces.

import { champions, championsById } from "@/app/data/champions";
import type { BadSynergyLevel, BadSynergyRelation } from "@/app/types/champion";

/** Penalizarea brută pe `level` (aleasă ca datele migrate să dea exact valorile vechi). */
export const BAD_SYNERGY_PENALTY: Record<BadSynergyLevel, number> = { 5: 4.0, 4: 3.5, 3: 3.0, 2: 2.5, 1: 2.0 };

export const BAD_SYNERGY_LEVELS: readonly BadSynergyLevel[] = [5, 4, 3, 2, 1];

export function isBadSynergyLevel(value: unknown): value is BadSynergyLevel {
  return typeof value === "number" && (BAD_SYNERGY_LEVELS as readonly number[]).includes(value);
}

/** O pereche din index: `ownerId` = fișierul în care e scrisă. */
export type BadSynergyPair = BadSynergyRelation & { ownerId: string };

export type BadSynergyIssue = { level: "error"; key: string; message: string };

type BadSynergyIndex = {
  byPair: Map<string, BadSynergyPair>;
  pairs: BadSynergyPair[];
  issues: BadSynergyIssue[];
};

let cachedIndex: BadSynergyIndex | null = null;

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

function buildIndex(): BadSynergyIndex {
  const byPair = new Map<string, BadSynergyPair>();
  const pairs: BadSynergyPair[] = [];
  const issues: BadSynergyIssue[] = [];
  for (const champion of champions) {
    for (const relation of champion.badSynergyWith ?? []) {
      // Intrările invalide sunt ignorate aici și raportate de validator.
      if (!championsById[relation.championId] || relation.championId === champion.id) continue;
      if (!isBadSynergyLevel(relation.level)) continue;
      const key = pairKey(champion.id, relation.championId);
      const existing = byPair.get(key);
      if (existing) {
        issues.push({
          level: "error",
          key: champion.id,
          message:
            existing.ownerId === champion.id
              ? `badSynergyWith ${relation.championId}: duplicat`
              : `badSynergyWith ${relation.championId}: perechea e scrisă și în ${existing.ownerId}.ts — scrie-o o singură dată`,
        });
        continue;
      }
      const pair = { ...relation, ownerId: champion.id };
      byPair.set(key, pair);
      pairs.push(pair);
    }
  }
  return { byPair, pairs, issues };
}

function getIndex(): BadSynergyIndex {
  cachedIndex ??= buildIndex();
  return cachedIndex;
}

/** Relația de anti-sinergie dintre doi campioni (simetric), dacă există. */
export function getBadSynergy(championIdA: string, championIdB: string): BadSynergyPair | undefined {
  return getIndex().byPair.get(pairKey(championIdA, championIdB));
}

/** Penalizarea brută dintre doi campioni (0 dacă nu au anti-sinergie). */
export function getBadSynergyPenalty(championIdA: string, championIdB: string): number {
  const relation = getBadSynergy(championIdA, championIdB);
  return relation ? BAD_SYNERGY_PENALTY[relation.level] : 0;
}

/** Penalizarea totală a candidatului față de pick-urile existente. */
export function getTotalBadSynergy(candidateId: string, existingPicks: readonly string[]): number {
  let total = 0;
  for (const pickedId of existingPicks) total += getBadSynergyPenalty(candidateId, pickedId);
  return total;
}

/** Toate perechile, în ordinea fișierelor. */
export function getAllBadSynergies(): readonly BadSynergyPair[] {
  return getIndex().pairs;
}

/** Perechi scrise în ambele fișiere / duplicate — pentru validator. */
export function getBadSynergyIssues(): readonly BadSynergyIssue[] {
  return getIndex().issues;
}
