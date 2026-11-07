// Validează datele pe rol (`roleData`) din app/data/champions/ (DRAFT_REWORK §6).
//
//   npm run validate:matchups        (= npx tsx scripts/validate-matchups.ts)
//
// Iese cu cod 1 dacă există erori.

import { validateChampionRoleMatchups } from "@/app/utils/championMatchupValidation";

const result = validateChampionRoleMatchups();

for (const severity of ["error", "warning"] as const) {
  const list = result.issues.filter((issue) => issue.severity === severity);
  if (list.length === 0) continue;
  console.log(`\n${severity === "error" ? "ERORI" : "WARNINGS"} (${list.length})`);
  for (const issue of list) console.log(`  ${issue.key.padEnd(24)} ${issue.message}`);
}

console.log(`\nINFO — relații explicite în fișiere: ${result.explicitRelationCount}`);
console.log("Relații efective (explicit + derivat), per rol, level × phase (lane / late / all):");
const LEVELS = [3, 2, 1] as const;
const PHASES = ["lane", "late", "all"] as const;
console.log(`  ${"rol".padEnd(8)} ${"level".padEnd(6)} ${"goodVs".padEnd(16)} weakVs`);
for (const [role, counts] of Object.entries(result.levelPhaseCountsByRole)) {
  for (const level of LEVELS) {
    const format = (cells: Record<string, number>) => PHASES.map((phase) => String(cells[phase]).padStart(3)).join(" /");
    console.log(`  ${(level === 3 ? role : "").padEnd(8)} ${String(level).padEnd(6)} ${format(counts.goodVs[level]).padEnd(16)} ${format(counts.weakVs[level])}`);
  }
}

console.log(
  `\n${result.ok ? "OK" : "EȘUAT"} — ${result.errorCount} erori, ${result.warningCount} warnings`,
);
process.exit(result.ok ? 0 : 1);
