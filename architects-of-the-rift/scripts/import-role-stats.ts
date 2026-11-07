// Importă statisticile pe rol din tabelele gol.gg (TSV) în `roleData[rol].stats`.
//
//   npx tsx scripts/import-role-stats.ts [folder]      (implicit data-sources/worlds-2026)
//
// Folderul conține top.tsv, jungle.tsv, mid.tsv, adc.tsv, support.tsv, cu coloanele:
//   Champion Picks Bans PrioScore Wins Losses Winrate KDA "Avg BT" "Avg RP" BP% GT CSM DPM GPM CSD@15 GD@15 XPD@15
// Reguli:
//   - `bans` și `avgBanTurn` rămân null (ban-urile nu au rol → se folosește valoarea globală);
//   - `presence` = pick-uri pe rol + ban-uri;
//   - `soloqKrChallengerWinRate` nu e în sursă → null;
//   - "-" → null;
//   - un campion jucat pe un rol care nu e în `roles` primește rolul (la final) și o
//     intrare goală în `roleData`.
// Rescrie doar `roles` și blocul `stats` al rolului; restul fișierului rămâne neatins.

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { champions } from "@/app/data/champions";
import type { ChampionStats, Role } from "@/app/types/champion";

const folder = process.argv[2] ?? "data-sources/worlds-2026";
const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];
const FIELDS: (keyof ChampionStats)[] = [
  "picks", "bans", "presence", "prioScore", "wins", "losses", "proWinRate", "kda", "avgBanTurn",
  "avgPickRound", "blindPickRate", "averageGameTime", "csPerMinute", "damagePerMinute", "goldPerMinute",
  "csDiffAt15", "goldDiffAt15", "xpDiffAt15", "soloqKrChallengerWinRate",
];

const norm = (text: string) => text.toLowerCase().replace(/[^a-z]/g, "");
const byName = new Map<string, (typeof champions)[number]>();
for (const champion of champions) {
  byName.set(norm(champion.name), champion);
  byName.set(norm(champion.id), champion);
}

function num(text: string): number | null {
  const clean = text.trim().replace("%", "");
  if (clean === "" || clean === "-") return null;
  const value = Number(clean);
  if (!Number.isFinite(value)) throw new Error(`valoare numerică invalidă: "${text}"`);
  return value;
}

/** gol.gg dublează numele („Renata Glasc Renata Glasc”) — prima jumătate. */
function championName(cell: string) {
  const words = cell.trim().split(/\s+/);
  const half = words.length / 2;
  return Number.isInteger(half) && words.slice(0, half).join(" ") === words.slice(half).join(" ")
    ? words.slice(0, half).join(" ")
    : cell.trim();
}

type RoleStats = Record<keyof ChampionStats, number | string | null>;
const imported = new Map<string, Map<Role, RoleStats>>();
const rolePicks = new Map<string, number>();

for (const role of ROLES) {
  const path = join(folder, `${role}.tsv`);
  if (!existsSync(path)) continue;
  const [header, ...rows] = readFileSync(path, "utf8").replace(/\r\n/g, "\n").trim().split("\n");
  const columns = header.split("\t");
  const col = (cells: string[], name: string) => {
    const index = columns.indexOf(name);
    if (index < 0) throw new Error(`${role}.tsv: lipsește coloana ${name}`);
    return cells[index] ?? "";
  };
  for (const row of rows) {
    const cells = row.split("\t");
    const name = championName(cells[0]);
    const champion = byName.get(norm(name));
    if (!champion) throw new Error(`${role}.tsv: campion necunoscut "${name}"`);
    const picks = num(col(cells, "Picks")) ?? 0;
    const bans = num(col(cells, "Bans")) ?? 0;
    const gt = col(cells, "GT").trim();
    const stats: RoleStats = {
      picks,
      bans: null,
      presence: picks + bans,
      prioScore: num(col(cells, "PrioScore")),
      wins: num(col(cells, "Wins")),
      losses: num(col(cells, "Losses")),
      proWinRate: num(col(cells, "Winrate")),
      kda: num(col(cells, "KDA")),
      avgBanTurn: null,
      avgPickRound: num(col(cells, "Avg RP")),
      blindPickRate: num(col(cells, "BP%")),
      averageGameTime: gt && gt !== "-" ? gt : null,
      csPerMinute: num(col(cells, "CSM")),
      damagePerMinute: num(col(cells, "DPM")),
      goldPerMinute: num(col(cells, "GPM")),
      csDiffAt15: num(col(cells, "CSD@15")),
      goldDiffAt15: num(col(cells, "GD@15")),
      xpDiffAt15: num(col(cells, "XPD@15")),
      soloqKrChallengerWinRate: null,
    };
    const byRole = imported.get(champion.id) ?? new Map<Role, RoleStats>();
    byRole.set(role, stats);
    imported.set(champion.id, byRole);
    rolePicks.set(champion.id, (rolePicks.get(champion.id) ?? 0) + picks);
  }
}

const statsBlock = (stats: RoleStats) =>
  ["      stats: {", ...FIELDS.map((field) => `        ${field}: ${JSON.stringify(stats[field])},`), "      },"];

const addedRoles: string[] = [];
let updated = 0;
for (const [id, byRole] of imported) {
  const path = `app/data/champions/${id}.ts`;
  const lines = readFileSync(path, "utf8").replace(/\r\n/g, "\n").split("\n");
  const champion = champions.find((entry) => entry.id === id)!;

  // Roluri noi: în `roles` (la final) + intrare goală în roleData (la final).
  const newRoles = ROLES.filter((role) => byRole.has(role) && !champion.roles.includes(role));
  if (newRoles.length) {
    const rolesIndex = lines.findIndex((line) => /^  roles: \[/.test(line));
    const roles = [...champion.roles, ...newRoles];
    lines[rolesIndex] = `  roles: [${roles.map((role) => JSON.stringify(role)).join(", ")}],`;
    const roleDataStart = lines.findIndex((line) => line === "  roleData: {");
    const roleDataEnd = lines.findIndex((line, index) => index > roleDataStart && line === "  },");
    lines.splice(
      roleDataEnd,
      0,
      ...newRoles.flatMap((role) => [`    ${role}: {`, "      goodVs: [],", "      stats: null,", "    },"]),
    );
    addedRoles.push(...newRoles.map((role) => `${id}:${role}`));
  }

  // Blocul `stats` al fiecărui rol importat.
  const roleDataStart = lines.findIndex((line) => line === "  roleData: {");
  for (const [role, stats] of byRole) {
    const roleStart = lines.findIndex((line, index) => index > roleDataStart && line === `    ${role}: {`);
    const statsStart = lines.findIndex((line, index) => index > roleStart && /^      stats: /.test(line));
    if (roleStart < 0 || statsStart < 0) throw new Error(`${id}:${role}: nu găsesc blocul stats`);
    const statsEnd = lines[statsStart] === "      stats: null," ? statsStart : lines.findIndex((line, index) => index > statsStart && line === "      },");
    lines.splice(statsStart, statsEnd - statsStart + 1, ...statsBlock(stats));
    updated += 1;
  }
  writeFileSync(path, lines.join("\n"));
}

// Consistență: pick-urile pe rol trebuie să dea pick-urile globale (același eșantion).
const mismatched = [...rolePicks]
  .map(([id, picks]) => ({ id, rolePicks: picks, globalPicks: champions.find((c) => c.id === id)!.stats.picks }))
  .filter((entry) => entry.rolePicks !== entry.globalPicks);
console.log({ statsUpdated: updated, champions: imported.size, addedRoles });
console.log(mismatched.length ? { picksMismatch: mismatched } : "pick-urile pe rol = pick-urile globale pentru toți campionii importați");
