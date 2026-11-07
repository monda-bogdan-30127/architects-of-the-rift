// Validează championRoleMatchups (DRAFT_REWORK §6).
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

console.log(`\nINFO — relații explicite în fișier: ${result.explicitRelationCount}`);
console.log("Relații efective (explicit + derivat) pe notă, per rol:");
console.log(`  ${"rol".padEnd(8)} ${"goodVs 1/2/3/4/5".padEnd(24)} weakVs 1/2/3/4/5`);
for (const [role, counts] of Object.entries(result.gradeCountsByRole)) {
  const format = (grades: Record<number, number>) => [1, 2, 3, 4, 5].map((grade) => grades[grade]).join(" / ");
  console.log(`  ${role.padEnd(8)} ${format(counts.goodVs).padEnd(24)} ${format(counts.weakVs)}`);
}

console.log(
  `\n${result.ok ? "OK" : "EȘUAT"} — ${result.errorCount} erori, ${result.warningCount} warnings`,
);
process.exit(result.ok ? 0 : 1);
