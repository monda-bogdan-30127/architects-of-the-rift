// COMP_ATTRIBUTES_EXPANSION §5.2.1 — inventarul tag-urilor de campion (`championTags` și `roleData[rol].profile.tags`):
// de câte ori apare fiecare manual în date, dacă e generat în `championProfileSystem.ts` (tag-uri derivate) și unde
// apare ca literal în cod (app/ fără app/data, components/). Doar raportează; nu modifică nimic.
//
//   npx tsx scripts/tag-inventory.ts [--out scripts/.calibration/tag-inventory.md]
//
// „Citit în cod” e o căutare de literal (`"tag"` / `'tag'`) pe liniile de cod, fără comentarii și fără tag-urile de
// motiv ale draftului (`reasonTags`, `result.tags.push`). Un tag care e și numele unui atribut sau al unei identități
// (`engage`, `dive`, `poke`) apare și în locuri unde literalul e atributul: coloana „ambiguu” le marchează.

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { dirname, join, relative } from "path";
import { champions } from "@/app/data/champions";
import { teams } from "@/app/data/teams";
import { COMP_ATTRIBUTE_ORDER } from "@/app/types/compAttributes";
import { COMP_IDENTITIES } from "@/app/draft-engine/compIdentity";
import { parseArgs } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const ROOT = process.cwd();

// ─── Date: aparițiile manuale ────────────────────────────────────────────────
type Usage = { championTags: string[]; profileTags: string[] };
const usage = new Map<string, Usage>();
const usageOf = (tag: string) => {
  let entry = usage.get(tag);
  if (!entry) usage.set(tag, (entry = { championTags: [], profileTags: [] }));
  return entry;
};
for (const champion of champions) {
  for (const tag of champion.championTags ?? []) usageOf(tag).championTags.push(champion.id);
  for (const [role, entry] of Object.entries(champion.roleData ?? {})) {
    for (const tag of entry?.profile?.tags ?? []) usageOf(tag).profileTags.push(`${champion.id}:${role}`);
  }
}

// ─── Tag-uri derivate (championProfileSystem.ts, toTags) ─────────────────────
const profileSource = readFileSync(join(ROOT, "app/draft-engine/championProfileSystem.ts"), "utf8");
const derived = new Set<string>();
for (const match of profileSource.matchAll(/tags\.add\(([^;]*?)\);/g)) {
  for (const literal of match[1].matchAll(/["']([a-zA-Z-]+)["']/g)) derived.add(literal[1]);
}
for (const tag of derived) usageOf(tag);

// ─── Echipe: preferredTags / avoidTags (comparate cu championTags în draftAI) ─
const teamTags = new Map<string, number>();
for (const team of teams) {
  const identity = team.identity;
  for (const tag of [...(identity?.preferredTags ?? []), ...(identity?.avoidTags ?? [])]) teamTags.set(tag, (teamTags.get(tag) ?? 0) + 1);
}

// ─── Cod: unde e citit ca tag ────────────────────────────────────────────────
// Un loc „citește tag-ul” dacă literalul apare:
//   - ca argument al unui `.has(…)` / `.includes(…)` pe o colecție de tag-uri (numele conține „tag”);
//   - ca cheie în `bannedTags["…"]`;
//   - într-o listă de tag-uri: `desired:` / `avoid:` / `targetTags:` sau un bloc numit `…Tags` / `tagMap` /
//     `planCounters` (până se închide paranteza).
// Restul aparițiilor literalului (alt sens: tipuri de rol, profil de meci, atribut) sunt numărate separat.
function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "node_modules" || name === "data" ? [] : listFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}
type CodeLine = { file: string; line: number; text: string; tagList: boolean };
const codeLines: CodeLine[] = [];
const BLOCK_START = /\b(\w*Tags|tagMap|planCounters|targetTags|desired|avoid)\b\s*[:=][^=]/;
for (const file of [...listFiles(join(ROOT, "app")), ...listFiles(join(ROOT, "components"))]) {
  let depth = 0;
  readFileSync(file, "utf8").split(/\r?\n/).forEach((text, index) => {
    const code = text.replace(/\/\/.*$/, "").trim();
    if (!code || code.startsWith("*") || code.startsWith("/*")) return;
    const opens = (code.match(/[[{(]/g) ?? []).length;
    const closes = (code.match(/[\]})]/g) ?? []).length;
    const starts = depth === 0 && BLOCK_START.test(code);
    const tagList = depth > 0 || starts;
    if (starts || depth > 0) depth = Math.max(0, depth + opens - closes);
    if (/reasonTags|result\.tags\.push|tags\.add\(/.test(code)) return;
    codeLines.push({ file: relative(ROOT, file).replace(/\\/g, "/"), line: index + 1, text: code, tagList });
  });
}
const escape = (tag: string) => tag.replace(/[-]/g, "\\-");
function codeSites(tag: string) {
  const literal = new RegExp(`["']${escape(tag)}["']`);
  const read = new RegExp(`(\\w*[Tt]ags?\\w*(\\.\\w+)*\\.(has|includes)\\(\\s*["']${escape(tag)}["']|bannedTags\\[["']${escape(tag)}["']\\])`);
  const reads: CodeLine[] = [];
  let other = 0;
  for (const entry of codeLines) {
    if (!literal.test(entry.text)) continue;
    if (read.test(entry.text) || entry.tagList) reads.push(entry);
    else other += 1;
  }
  return { reads, other };
}

// ─── Tabel ───────────────────────────────────────────────────────────────────
const attributes = new Set<string>(COMP_ATTRIBUTE_ORDER);
const identities = new Set<string>(COMP_IDENTITIES);
const rows = [...usage.entries()].map(([tag, entry]) => {
  const { reads: sites, other } = codeSites(tag);
  const manual = entry.championTags.length + entry.profileTags.length;
  const ambiguous = [attributes.has(tag) ? "atribut" : null, identities.has(tag) ? "identitate" : null].filter(Boolean).join(", ");
  return { tag, manual, entry, derived: derived.has(tag), sites, other, teams: teamTags.get(tag) ?? 0, ambiguous };
});
rows.sort((a, b) => b.manual - a.manual || a.tag.localeCompare(b.tag));

const short = (list: string[], max = 4) => (list.length > max ? `${list.slice(0, max).join(", ")} +${list.length - max}` : list.join(", "));
const siteLabel = (sites: { file: string; line: number }[]) => {
  const byFile = new Map<string, number[]>();
  for (const site of sites) byFile.set(site.file.replace(/^app\/draft-engine\//, ""), [...(byFile.get(site.file.replace(/^app\/draft-engine\//, "")) ?? []), site.line]);
  return [...byFile.entries()].map(([file, lines]) => `${file}:${lines.join(",")}`).join("; ");
};

// `getTeamTagBias` (draftAI) compară preferredTags / avoidTags doar cu `championTags`: fără championTags în date,
// potrivirea cu echipele nu are efect, deci nu contează ca citire.
const championTagCount = rows.reduce((sum, row) => sum + row.entry.championTags.length, 0);
const unread = rows.filter((row) => !row.sites.length && (!row.teams || championTagCount === 0));
const onlyManualUnread = unread.filter((row) => !row.derived);
const lines = [
  `# Inventar tag-uri de campion (${rows.length} tag-uri)`,
  "",
  `Manual = apariții în \`championTags\` (ct, pe campion) + \`roleData[rol].profile.tags\` (pe campion:rol). Derivat = generat în \`championProfileSystem.ts\`. Echipe = în \`preferredTags\` / \`avoidTags\` ale câtor echipe (comparate cu \`championTags\` în draftAI). Citit ca tag = \`.has\` / \`.includes\` pe o colecție de tag-uri sau o listă de tag-uri (desired / avoid / targetTags / planCounters / tagMap). Alt sens = alte apariții ale literalului (tip de rol, profil de meci, atribut). Ambiguu = literalul e și numele unui atribut / al unei identități.`,
  "",
  championTagCount === 0
    ? "**Niciun campion nu are `championTags`** (toate tag-urile manuale sunt în `profile.tags`): `preferredTags` / `avoidTags` ale echipelor (`getTeamTagBias`) nu se potrivesc niciodată, bias-ul e mereu 0."
    : `\`championTags\`: ${championTagCount} apariții.`,
  "",
  "| Tag | Manual | Unde (date) | Derivat | Echipe | Citit ca tag în cod | Alt sens | Ambiguu |",
  "|---|---|---|---|---|---|---|---|",
  ...rows.map((row) =>
    `| \`${row.tag}\` | ${row.manual} | ${short([...row.entry.championTags.map((id) => `${id} (ct)`), ...row.entry.profileTags])} | ${row.derived ? "da" : ""} | ${row.teams || ""} | ${row.sites.length ? siteLabel(row.sites) : "**—**"} | ${row.other || ""} | ${row.ambiguous} |`,
  ),
  "",
  `## Necitite nicăieri în cod (${unread.length})`,
  "",
  unread.map((row) => `\`${row.tag}\` (${row.manual}${row.derived ? ", derivat" : ""})`).join(" · ") || "—",
  "",
  `Dintre ele, scrise doar manual (nederivate): ${onlyManualUnread.length}, cu ${onlyManualUnread.reduce((sum, row) => sum + row.manual, 0)} apariții în date.`,
  "",
];
const markdown = lines.join("\n");
console.log(markdown);
if (named.out) {
  mkdirSync(dirname(named.out), { recursive: true });
  writeFileSync(named.out, markdown);
}
