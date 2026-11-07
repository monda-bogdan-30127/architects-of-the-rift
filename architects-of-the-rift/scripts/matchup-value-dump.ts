// Dump al valorilor de matchup (MATCHUP_LEVEL_PHASE §9).
//
//   npx tsx scripts/matchup-value-dump.ts [out.json]      (implicit scripts/.matchup-values-before.json)
//   npx tsx scripts/matchup-value-dump.ts --compare before.json after.json
//
// Pentru fiecare campion × rol × adversar cu relație (efectivă, explicit + derivat):
// valorile early / mid / late din `getMatchupValue`, în context neutru (fără
// coverage, fără jucători), plus detaliile relațiilor. `--compare` raportează
// diferențele dintre două dump-uri.

import { readFileSync, writeFileSync } from "fs";
import { champions } from "@/app/data/champions";
import { getRoleMatchups } from "@/app/draft-engine/championMatchups";
import { getMatchupDetails, getMatchupValue } from "@/app/draft-engine/matchupScoring";
import type { Role } from "@/app/types/champion";

type Entry = {
  key: string;
  early: number;
  mid: number;
  late: number;
  /** Relațiile care au contribuit (format liber, depinde de versiunea engine-ului). */
  details: Record<string, unknown>[];
};

const round = (value: number) => Math.round(value * 1e6) / 1e6;

function dump(): Entry[] {
  const entries: Entry[] = [];
  for (const champion of champions) {
    for (const role of champion.roles) {
      const matchups = getRoleMatchups(champion.id, role);
      const seen = new Set<string>();
      for (const relation of [...matchups.goodVs, ...matchups.weakVs]) {
        const enemyRole: Role = relation.vsRole ?? role;
        const key = `${champion.id}:${role}>${relation.championId}@${enemyRole}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const value = (phase: "early" | "mid" | "late") =>
          round(getMatchupValue(champion.id, role, relation.championId, enemyRole, { phase }));
        entries.push({
          key,
          early: value("early"),
          mid: value("mid"),
          late: value("late"),
          details: getMatchupDetails(champion.id, role, relation.championId, enemyRole).map((detail) => {
            const rest: Record<string, unknown> = { ...detail };
            delete rest.value;
            delete rest.enemyId;
            delete rest.enemyRole;
            return rest;
          }),
        });
      }
    }
  }
  return entries;
}

if (process.argv[2] === "--compare") {
  const before = JSON.parse(readFileSync(process.argv[3], "utf8")) as Entry[];
  const after = new Map((JSON.parse(readFileSync(process.argv[4], "utf8")) as Entry[]).map((entry) => [entry.key, entry]));
  const missing = before.filter((entry) => !after.has(entry.key)).map((entry) => entry.key);
  const extra = [...after.keys()].filter((key) => !before.some((entry) => entry.key === key));
  const byOld = new Map<string, { count: number; maxDiff: Record<string, number> }>();
  for (const entry of before) {
    const next = after.get(entry.key);
    if (!next) continue;
    const label = entry.details.map((detail) => `${detail.kind}:${JSON.stringify(detail.grade ?? [detail.level, detail.phase])}`).join("+");
    const bucket = byOld.get(label) ?? { count: 0, maxDiff: { early: 0, mid: 0, late: 0 } };
    bucket.count += 1;
    for (const phase of ["early", "mid", "late"] as const) {
      const diff = round(next[phase] - entry[phase]);
      if (Math.abs(diff) > Math.abs(bucket.maxDiff[phase])) bucket.maxDiff[phase] = diff;
    }
    byOld.set(label, bucket);
  }
  console.log({ entries: before.length, missing: missing.length, extra: extra.length });
  console.log("diferența maximă per tip de relație veche (după − înainte):");
  for (const [label, bucket] of [...byOld].sort()) console.log(`  ${label.padEnd(28)} ×${String(bucket.count).padEnd(5)}`, bucket.maxDiff);
  if (missing.length || extra.length) console.log({ missing: missing.slice(0, 10), extra: extra.slice(0, 10) });
} else {
  const outFile = process.argv[2] ?? "scripts/.matchup-values-before.json";
  const entries = dump();
  writeFileSync(outFile, JSON.stringify(entries, null, 1));
  console.log(`dump: ${entries.length} relații campion×rol×adversar → ${outFile}`);
}
