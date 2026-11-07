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

console.log(`\nINFO — perechi mustWith (${result.mustWithPairs.length}; direcționale: ancora → partener):`);
for (const pair of result.mustWithPairs) {
  console.log(`  ${pair.anchor.padEnd(24)} → ${pair.partnerId.padEnd(16)} ${pair.reciprocal ? "reciproc" : "într-un sens"}`);
}

const coverage = result.profileCoverage;
console.log("\nINFO — profile manuale (roleData[rol].profile), per rol:");
for (const [role, { withProfile, total }] of Object.entries(coverage.byRole)) {
  console.log(`  ${role.padEnd(8)} ${String(withProfile).padStart(3)} / ${total}`);
}
console.log(`Fără profile manual (${coverage.missing.length}), după presence (cei mai jucați primii):`);
for (let index = 0; index < coverage.missing.length; index += 5) {
  console.log("  " + coverage.missing.slice(index, index + 5).map((entry) => `${entry.key} (${entry.presence})`.padEnd(28)).join(" "));
}

console.log(
  `\n${result.ok ? "OK" : "EȘUAT"} — ${result.errorCount} erori, ${result.warningCount} warnings`,
);
process.exit(result.ok ? 0 : 1);
