// Migrează relațiile de matchup din `score` (1–5) în `level` + `phase` (MATCHUP_LEVEL_PHASE §4).
//
//   npx tsx scripts/migrate-matchups-to-level-phase.ts [folder]   (implicit app/data/champions)
//
// Rescrie doar câmpul `score` din relațiile aflate în `roleData` (după linia
// `roleData: {`); `synergyWith` și restul formatării rămân neatinse. Idempotent:
// o a doua rulare nu mai găsește nimic de schimbat.
//
//   score 5 → level 3, "all"    score 4 → level 2, "all"    score 3 → level 2, "late"
//   score 2 → level 2, "lane"   score 1 → level 1, "all"

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const folder = process.argv[2] ?? "app/data/champions";
const SKIP = new Set(["index.ts", "_helpers.ts"]);
const MAP: Record<string, string> = {
  "5": 'level: 3, phase: "all"',
  "4": 'level: 2, phase: "all"',
  "3": 'level: 2, phase: "late"',
  "2": 'level: 2, phase: "lane"',
  "1": 'level: 1, phase: "all"',
};

let files = 0;
let relations = 0;
for (const name of readdirSync(folder).filter((file) => file.endsWith(".ts") && !SKIP.has(file)).sort()) {
  const path = join(folder, name);
  const text = readFileSync(path, "utf8");
  const start = text.search(/^\s*roleData: \{/m);
  if (start < 0) throw new Error(`${name}: lipsește roleData`);

  let count = 0;
  const roleData = text.slice(start).replace(/(\{ championId: "[^"]+", )score: ([1-5])/g, (_, head: string, score: string) => {
    count += 1;
    return `${head}${MAP[score]}`;
  });
  if (/\bscore:/.test(roleData)) throw new Error(`${name}: a rămas un \`score\` necunoscut în roleData`);
  if (count > 0) {
    writeFileSync(path, text.slice(0, start) + roleData);
    files += 1;
    relations += count;
  }
}
console.log(`migrate: ${relations} relații în ${files} fișiere`);
