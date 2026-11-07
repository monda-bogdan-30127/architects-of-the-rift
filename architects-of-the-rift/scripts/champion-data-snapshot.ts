// Snapshot al datelor de campioni așa cum le vede engine-ul (CHAMPION_FILES_RESTRUCTURE §0 / §7).
//
//   npx tsx scripts/champion-data-snapshot.ts [out.json]
//   (implicit scripts/.snapshot-before.json)
//
// Conține, în ordinea din `champions`:
//   - fiecare campion (fără `roleData`, care e doar sursa datelor pe rol);
//   - pentru fiecare campion × rol: getRoleMatchups, getMustWith,
//     getMustWithPartners, getChampionStatsForRole.
// Cheile obiectelor sunt sortate, ca ordinea câmpurilor din fișiere să nu conteze;
// ordinea listelor (campioni, relații) se păstrează.
//
// Compară două snapshot-uri: `cmp scripts/.snapshot-before.json scripts/.snapshot-after.json`

import { writeFileSync } from "fs";
import { champions } from "@/app/data/champions";
import { getMustWith, getMustWithPartners, getRoleMatchups } from "@/app/draft-engine/championMatchups";
import { getChampionStatsForRole } from "@/app/draft-engine/championRoleStatsSystem";

const outFile = process.argv[2] ?? "scripts/.snapshot-before.json";

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .filter((key) => (value as Record<string, unknown>)[key] !== undefined)
        .map((key) => [key, canonical((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}

const snapshot = {
  championOrder: champions.map((champion) => champion.id),
  champions: champions.map((champion) => {
    const rest: Record<string, unknown> = { ...champion };
    delete rest.roleData;
    return rest;
  }),
  roles: champions.flatMap((champion) =>
    champion.roles.map((role) => ({
      key: `${champion.id}:${role}`,
      matchups: getRoleMatchups(champion.id, role),
      mustWith: getMustWith(champion.id, role),
      mustWithPartners: getMustWithPartners(champion.id, role),
      stats: getChampionStatsForRole(champion, role),
    })),
  ),
};

writeFileSync(outFile, JSON.stringify(canonical(snapshot), null, 1));
console.log(`snapshot: ${snapshot.championOrder.length} campioni, ${snapshot.roles.length} campion×rol → ${outFile}`);
