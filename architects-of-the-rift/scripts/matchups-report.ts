// Raport de matchup-uri pe campion (MATCHUP_FORMAT_CLEANUP §5).
//
//   npm run matchups -- jax              un campion, toate rolurile
//   npm run matchups -- jax top          un singur rol
//   npm run matchups -- --uncountered    combinațiile campion × rol fără niciun counter
//
// Arată listele EFECTIVE, cum le vede engine-ul: „Bate” = goodVs din fișierul
// campionului, „E bătut de” = weakVs derivat din goodVs-ul celorlalți, cu
// fișierul din care vine fiecare relație (acolo o modifici).

import { champions, championsById } from "@/app/data/champions";
import { getMustWith, getRoleMatchups } from "@/app/draft-engine/championMatchups";
import { getRelationStrength } from "@/app/draft-engine/matchupGrades";
import { getChampionStatsForRole } from "@/app/draft-engine/championRoleStatsSystem";
import type { Champion, MatchupRelation, Role } from "@/app/types/champion";

const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];
const args = process.argv.slice(2);

const presenceOf = (champion: Champion, role: Role) => getChampionStatsForRole(champion, role).presence ?? 0;
const byStrength = (a: MatchupRelation, b: MatchupRelation) =>
  getRelationStrength(b) - getRelationStrength(a) || a.championId.localeCompare(b.championId);

function formatRelation(relation: MatchupRelation, source?: string): string {
  const parts = [
    relation.championId.padEnd(16),
    `L${relation.level}`,
    relation.phase.padEnd(4),
    (relation.vsRole ? `vs ${relation.vsRole}` : "").padEnd(10),
  ];
  if (source) parts.push(source.padEnd(28));
  if (relation.note) parts.push(`„${relation.note}”`);
  return `    ${parts.join(" ").trimEnd()}`;
}

function findChampion(query: string): Champion {
  const needle = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  const champion =
    championsById[query.toLowerCase()] ??
    champions.find((entry) => entry.id.replace(/-/g, "") === needle || entry.name.toLowerCase().replace(/[^a-z0-9]/g, "") === needle);
  if (champion) return champion;
  const similar = champions.filter((entry) => entry.id.includes(needle.slice(0, 3))).map((entry) => entry.id);
  console.error(`Campion necunoscut: "${query}"${similar.length ? ` — poate: ${similar.slice(0, 8).join(", ")}` : ""}`);
  process.exit(1);
}

function printRole(champion: Champion, role: Role) {
  const matchups = getRoleMatchups(champion.id, role);
  console.log(`\n── ${champion.name} · ${role}  (presence ${presenceOf(champion, role)}) ${"─".repeat(Math.max(0, 40 - champion.name.length - role.length))}`);

  console.log(`  Bate (${matchups.goodVs.length})  ← ${champion.id}.ts (${role})`);
  for (const relation of [...matchups.goodVs].sort(byStrength)) console.log(formatRelation(relation));

  console.log(`  E bătut de (${matchups.weakVs.length})`);
  for (const relation of [...matchups.weakVs].sort(byStrength)) {
    // weakVs e derivat: sursa e goodVs-ul adversarului, pe rolul din vsRole.
    console.log(formatRelation(relation, `← ${relation.championId}.ts (${relation.vsRole ?? role})`));
  }

  const mustWith = getMustWith(champion.id, role);
  console.log(`  mustWith: ${mustWith.length ? mustWith.join(", ") : "—"}`);
}

function printSynergy(champion: Champion) {
  const entries = [...champion.synergyWith].sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.championId.localeCompare(b.championId));
  console.log(`\n  synergyWith (toate rolurile): ${entries.length ? entries.map((entry) => `${entry.championId} ${entry.score ?? "?"}`).join(", ") : "—"}`);
}

if (args[0] === "--uncountered") {
  const rows = champions
    .flatMap((champion) => champion.roles.map((role) => ({ champion, role })))
    .filter(({ champion, role }) => getRoleMatchups(champion.id, role).weakVs.length === 0)
    .map(({ champion, role }) => ({ key: `${champion.id}:${role}`, presence: presenceOf(champion, role), goodVs: getRoleMatchups(champion.id, role).goodVs.length }))
    .sort((a, b) => b.presence - a.presence || a.key.localeCompare(b.key));
  console.log(`Fără niciun counter (weakVs efectiv gol): ${rows.length} combinații, după presence (cei mai jucați primii).`);
  console.log("Pentru engine sunt blind pick-uri perfect sigure: scrie goodVs <campion> în fișierul unui counter.\n");
  console.log(`  ${"campion:rol".padEnd(26)} ${"presence".padStart(8)}  bate`);
  for (const row of rows) console.log(`  ${row.key.padEnd(26)} ${String(row.presence).padStart(8)}  ${row.goodVs}`);
} else if (args[0]) {
  const champion = findChampion(args[0]);
  const roleArg = args[1]?.toLowerCase();
  if (roleArg && !(ROLES as string[]).includes(roleArg)) {
    console.error(`Rol invalid: "${args[1]}" (top / jungle / mid / adc / support)`);
    process.exit(1);
  }
  const roles = roleArg ? [roleArg as Role] : champion.roles;
  if (roleArg && !champion.roles.includes(roleArg as Role)) {
    console.error(`${champion.id} nu joacă ${roleArg} (roluri: ${champion.roles.join(", ")})`);
    process.exit(1);
  }
  console.log(`${champion.name} (${champion.id}.ts) — roluri: ${champion.roles.join(", ")}`);
  for (const role of roles) printRole(champion, role);
  printSynergy(champion);
} else {
  console.log("Folosire:\n  npm run matchups -- <campion> [rol]\n  npm run matchups -- --uncountered");
  process.exit(1);
}
