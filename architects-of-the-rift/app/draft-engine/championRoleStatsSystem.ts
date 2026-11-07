// Statistici pe rol cu fallback pe statistica globală (DRAFT_REWORK §3).
//
// Sursa: `champion.roleData[rol].stats` (fișierele din app/data/champions/).
// Câmp cu câmp: valoarea de pe rol dacă nu e `null`, altfel `champion.stats`.
// `stats: null` pe rol (sau rol necunoscut / nejucat) → chiar obiectul `champion.stats`.

import type { Champion, ChampionRoleKey, ChampionRoleStats, ChampionStats, Role } from "@/app/types/champion";

const mergedCache = new Map<ChampionRoleKey, { base: ChampionStats; merged: ChampionStats }>();

function mergeRoleStats(base: ChampionStats, roleStats: ChampionRoleStats | null | undefined): ChampionStats {
  if (!roleStats) return base;

  let merged: ChampionStats | null = null;
  for (const key of Object.keys(roleStats) as (keyof ChampionStats)[]) {
    const value = roleStats[key];
    if (value === null || value === undefined) continue;
    merged ??= { ...base };
    (merged as Record<keyof ChampionStats, unknown>)[key] = value;
  }
  return merged ?? base;
}

export function getChampionStatsForRole(champion: Champion, role: Role | null | undefined): ChampionStats {
  if (!role || !champion.roles.includes(role)) return champion.stats;

  const key: ChampionRoleKey = `${champion.id}:${role}`;
  const cached = mergedCache.get(key);
  if (cached && cached.base === champion.stats) return cached.merged;

  const merged = mergeRoleStats(champion.stats, champion.roleData[role]?.stats);
  mergedCache.set(key, { base: champion.stats, merged });
  return merged;
}
