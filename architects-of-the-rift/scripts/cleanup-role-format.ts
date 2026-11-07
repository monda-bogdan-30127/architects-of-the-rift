// Migrare de o singură folosință (MATCHUP_FORMAT_CLEANUP §4), rulată o dată pe
// toate fișierele; păstrată doar ca referință.
//   npx tsx scripts/cleanup-role-format.ts
//
// Pentru fiecare app/data/champions/<id>.ts, în `roleData`:
// - șterge liniile `weakVs: [],` (weakVs e derivat din goodVs);
// - șterge liniile `mustWith: [],` (lipsă = fără partener);
// - se oprește cu eroare, fără să scrie nimic, dacă găsește un `weakVs` nevid;
// - comentariile (ex. `//mustWith` din ambessa.ts) rămân neatinse.

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DIR = "app/data/champions";
const EMPTY_WEAK = /^\s*weakVs: \[\],\s*$/;
const EMPTY_MUST = /^\s*mustWith: \[\],\s*$/;
const ANY_WEAK = /^\s*weakVs\s*:/;

const files = readdirSync(DIR).filter((name) => name.endsWith(".ts") && name !== "index.ts");
const nonEmpty: string[] = [];
const updates: { path: string; text: string }[] = [];
let removedWeak = 0;
let removedMust = 0;

for (const name of files) {
  const path = join(DIR, name);
  const original = readFileSync(path, "utf8");
  const eol = original.includes("\r\n") ? "\r\n" : "\n";
  const lines = original.split(/\r?\n/);
  const kept = lines.filter((line, index) => {
    if (EMPTY_WEAK.test(line)) return (removedWeak += 1), false;
    if (EMPTY_MUST.test(line)) return (removedMust += 1), false;
    if (ANY_WEAK.test(line)) nonEmpty.push(`${path}:${index + 1}: ${line.trim()}`);
    return true;
  });
  if (kept.length !== lines.length) updates.push({ path, text: kept.join(eol) });
}

if (nonEmpty.length) {
  console.error("weakVs nevid găsit — nu s-a modificat nimic. Mută relațiile manual ca goodVs:");
  for (const entry of nonEmpty) console.error(`  ${entry}`);
  process.exit(1);
}

for (const { path, text } of updates) writeFileSync(path, text);
console.log({ files: files.length, updated: updates.length, removedWeak, removedMust });
