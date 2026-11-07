// Snapshot al profilelor pe rol (PROFILE_OVERRIDES_TO_ROLEDATA §2 / §8).
//
//   npx tsx scripts/profile-snapshot.ts [out.json]     (implicit scripts/.profiles-before.json)
//   cmp scripts/.profiles-before.json scripts/.profiles-after.json
//
// Salvează `getChampionRoleProfile(champion, role)` pentru fiecare campion × rol
// din `roles`, în ordinea din `champions`. Cheile obiectelor sunt sortate.

import { writeFileSync } from "fs";
import { champions } from "@/app/data/champions";
import { getChampionRoleProfile } from "@/app/draft-engine/championProfileSystem";

const outFile = process.argv[2] ?? "scripts/.profiles-before.json";

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

const profiles = champions.flatMap((champion) =>
  champion.roles.map((role) => ({ key: `${champion.id}:${role}`, profile: getChampionRoleProfile(champion, role) })),
);

writeFileSync(outFile, JSON.stringify(canonical(profiles), null, 1));
console.log(`profile snapshot: ${profiles.length} campion×rol → ${outFile}`);
