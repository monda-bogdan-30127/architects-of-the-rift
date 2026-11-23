// KDA_WORLDS_2026 §3.4 — KDA-ul generat în meciuri AI vs AI, comparat cu Worlds 2026: pe rol (K / D / A pe joc, KDA
// cumulat și median, KP, cotele de kill / death), pe tip de campion, kill-urile pe echipă și nota medie pe rol.
//
//   npx tsx scripts/kda-calibration.ts --games 600 --seed-tag s1 [--json out.json]

import { writeFileSync } from "fs";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import { getChampionKdaType } from "@/app/draft-engine/championKdaType";
import { resolveFinishedDraftAssignments, simulateDraftResult } from "@/app/draft-engine/draftEngine";
import { ROLE_ORDER } from "@/app/draft-engine/draftTypes";
import { makeSave, newAiSeries, parseArgs, runTracedDraft } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const gameCount = Number(named.games ?? 600);
const seedTag = named["seed-tag"] ?? "";

/** Worlds 2026 Main Event (KDA_WORLDS_2026 §1.1). */
const REAL: Record<Role, { kda: number; kp: number }> = {
  top: { kda: 2.63, kp: 53 },
  jungle: { kda: 3.57, kp: 74 },
  mid: { kda: 3.94, kp: 68 },
  adc: { kda: 3.55, kp: 68 },
  support: { kda: 3.5, kp: 77 },
};

type Acc = { k: number; d: number; a: number; teamKills: number; n: number; score: number; kdas: number[] };
const acc = () => ({ k: 0, d: 0, a: 0, teamKills: 0, n: 0, score: 0, kdas: [] as number[] });
const byRole = Object.fromEntries(ROLE_ORDER.map((role) => [role, acc()])) as Record<Role, Acc>;
const byType = new Map<string, Acc>();
const teamKills = { winner: 0, loser: 0, games: 0 };
const teamDeathsByRole = Object.fromEntries(ROLE_ORDER.map((role) => [role, 0])) as Record<Role, number>;
let totalTeamDeaths = 0;

const save = makeSave();
const pairs: [string, string][] = [];
for (let i = 0; i < teams.length; i += 1) {
  for (let j = i + 1; j < teams.length; j += 1) pairs.push([teams[i].slug, teams[j].slug]);
}
const stride = Math.max(1, Math.floor(pairs.length / gameCount));

for (let index = 0; index < gameCount; index += 1) {
  const [blue, red] = pairs[(index * stride) % pairs.length];
  const series = newAiSeries(`kda${index}${seedTag}`, blue, red);
  const { game } = runTracedDraft(series, save);
  const resolved = resolveFinishedDraftAssignments(game, series, save);
  const result = simulateDraftResult(resolved, series, save);
  const scores = result.playerScores ?? [];
  teamKills.games += 1;
  for (const side of ["blue", "red"] as const) {
    const team = scores.filter((score) => score.side === side);
    const kills = team.reduce((sum, score) => sum + score.kills, 0);
    const deaths = team.reduce((sum, score) => sum + score.deaths, 0);
    if (side === result.winnerSide) teamKills.winner += kills;
    else teamKills.loser += kills;
    totalTeamDeaths += deaths;
    for (const score of team) {
      const role = score.role as Role;
      const type = `${role}:${getChampionKdaType(score.championId, role)}`;
      for (const target of [byRole[role], byType.get(type) ?? (byType.set(type, acc()), byType.get(type)!)]) {
        target.k += score.kills;
        target.d += score.deaths;
        target.a += score.assists;
        target.teamKills += kills;
        target.n += 1;
        target.score += score.score;
        target.kdas.push((score.kills + score.assists) / Math.max(1, score.deaths));
      }
      teamDeathsByRole[role] += score.deaths;
    }
  }
}

const kda = (entry: Acc) => (entry.k + entry.a) / Math.max(1, entry.d);
const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
};
const f = (value: number, digits = 2) => value.toFixed(digits);

console.log(`# KDA generat (${gameCount} jocuri${seedTag ? `, seed ${seedTag}` : ""})\n`);
console.log("| Rol | K / joc | D / joc | A / joc | KDA | KDA real | KDA median (joc) | KP | KP real | Cota kill | Cota death | Nota medie |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|---|");
const totalKills = ROLE_ORDER.reduce((sum, role) => sum + byRole[role].k, 0);
for (const role of ROLE_ORDER) {
  const e = byRole[role];
  console.log(
    `| ${role} | ${f(e.k / e.n)} | ${f(e.d / e.n)} | ${f(e.a / e.n)} | **${f(kda(e))}** | ${f(REAL[role].kda)} | ${f(median(e.kdas))} | ${f((100 * (e.k + e.a)) / e.teamKills, 0)}% | ${REAL[role].kp}% | ${f((100 * e.k) / totalKills, 1)}% | ${f((100 * teamDeathsByRole[role]) / totalTeamDeaths, 1)}% | ${f(e.score / e.n)} |`,
  );
}
const otherScores = (role: Role) => ROLE_ORDER.filter((r) => r !== role).reduce((sum, r) => sum + byRole[r].score / byRole[r].n, 0) / 4;
console.log(`\nNota top față de media celorlalte roluri: ${f(byRole.top.score / byRole.top.n - otherScores("top"))}`);
console.log(`Kill-uri pe echipă și joc: câștigător ${f(teamKills.winner / teamKills.games, 1)}, învins ${f(teamKills.loser / teamKills.games, 1)}, medie ${f((teamKills.winner + teamKills.loser) / (2 * teamKills.games), 1)}`);

console.log("\n| Tip | Jocuri | KDA | Relativ la rol |");
console.log("|---|---|---|---|");
const typeRows = [...byType.entries()].sort(([a], [b]) => a.localeCompare(b));
for (const [type, e] of typeRows) {
  const role = type.split(":")[0] as Role;
  console.log(`| ${type} | ${e.n} | ${f(kda(e))} | ${f(kda(e) / kda(byRole[role]))} |`);
}
const ratio = (a: string, b: string) => {
  const x = byType.get(a);
  const y = byType.get(b);
  return x && y ? kda(x) / kda(y) : NaN;
};
const supportRatio = ratio("support:support-enchanter", "support:support-engage");
const midRatio = ratio("mid:mid-control-mage", "mid:mid-assassin");
console.log(`\nSupport enchanter / engage: ${f(supportRatio)} (țintă 1,4–2,0); mid mage de control / asasin: ${f(midRatio)} (țintă 1,15–1,6)`);

if (named.json) {
  const out = {
    roles: Object.fromEntries(ROLE_ORDER.map((role) => {
      const e = byRole[role];
      return [role, { kda: kda(e), kp: (100 * (e.k + e.a)) / e.teamKills, score: e.score / e.n, killShare: e.k / totalKills, deathShare: teamDeathsByRole[role] / totalTeamDeaths, medianKda: median(e.kdas) }];
    })),
    teamKills: (teamKills.winner + teamKills.loser) / (2 * teamKills.games),
    winnerKills: teamKills.winner / teamKills.games,
    loserKills: teamKills.loser / teamKills.games,
    topScoreGap: byRole.top.score / byRole.top.n - otherScores("top"),
    supportRatio,
    midRatio,
    types: Object.fromEntries(typeRows.map(([type, e]) => [type, { n: e.n, kda: kda(e), rel: kda(e) / kda(byRole[type.split(":")[0] as Role]) }])),
  };
  writeFileSync(named.json, JSON.stringify(out, null, 2));
}
