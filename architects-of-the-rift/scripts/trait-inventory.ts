// PLAYER_TRAITS §1.4 — inventarul trait-urilor de jucător: distribuția pe trait, rol și regiune (manual vs derivat),
// titularii fiecărei echipe cu trait-urile lor și Team Fit, plus echipele cu ≥ 3 resource_hog și cele fără niciun
// trait de resurse. Doar raportează.
//
//   npx tsx scripts/trait-inventory.ts [--out scripts/.calibration/trait-inventory.md]

import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { players } from "@/app/data/players";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { PLAYER_TRAIT_IDS, PLAYER_TRAIT_INFO, isTraitAllowedOnRole, type PlayerTraitId } from "@/app/types/playerTraits";
import { TRAIT_DERIVATION, computeTeamFit } from "@/app/utils/playerTraitUtils";
import { parseArgs } from "./draftHarness";

const { named } = parseArgs(process.argv.slice(2));
const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];
const teamById = new Map(teams.map((team) => [team.id, team]));
const regionOf = (player: Player) => teamById.get(player.teamId)?.region ?? "—";
const regions = [...new Set(players.map(regionOf))].sort();
const pct = (count: number, total: number) => (total ? `${((count / total) * 100).toFixed(0)}%` : "—");
const traitLabel = (player: Player) =>
  player.traits.length
    ? player.traits.map((trait) => `${PLAYER_TRAIT_INFO[trait.id].label}${trait.intensity === 2 ? " ●" : ""}${trait.source === "manual" ? " (m)" : ""}`).join(", ")
    : "—";

// ─── Distribuția ─────────────────────────────────────────────────────────────
const lines: string[] = [`# Inventar trait-uri de jucător (${players.length} jucători)`, ""];
lines.push("● = intensity 2 · (m) = manual (playerProfileOverrides), restul derivate.", "");

lines.push(
  "## Distribuție",
  "",
  "Pe rol: cu trait / jucători pe rol (țintă din TRAIT_DERIVATION.share, înainte de filtrul absolut). Manual = din playerProfileOverrides.",
  "",
  "| Trait | Total | Manual | Intensity 2 | " + ROLES.join(" | ") + " |",
  "|---|---|---|---|" + ROLES.map(() => "---|").join(""),
);
for (const id of PLAYER_TRAIT_IDS) {
  const withTrait = players.filter((player) => player.traits.some((trait) => trait.id === id));
  const share = TRAIT_DERIVATION[id].share as Partial<Record<Role, number>>;
  const byRole = ROLES.map((role) => {
    if (!isTraitAllowedOnRole(id, role)) return "—";
    const total = players.filter((player) => player.role === role).length;
    const count = withTrait.filter((player) => player.role === role).length;
    return `${count}/${total} (${pct(count, total)}${share[role] ? `, țintă ${Math.round(share[role]! * 100)}%` : ""})`;
  });
  lines.push(
    `| ${PLAYER_TRAIT_INFO[id].label} | ${withTrait.length} | ${withTrait.filter((p) => p.traits.some((t) => t.id === id && t.source === "manual")).length} | ${withTrait.filter((p) => p.traits.some((t) => t.id === id && t.intensity === 2)).length} | ${byRole.join(" | ")} |`,
  );
}
lines.push("", "| Regiune | Jucători | " + PLAYER_TRAIT_IDS.map((id) => PLAYER_TRAIT_INFO[id].label).join(" | ") + " |", "|---|---|" + PLAYER_TRAIT_IDS.map(() => "---|").join(""));
for (const region of regions) {
  const list = players.filter((player) => regionOf(player) === region);
  const count = (id: PlayerTraitId) => list.filter((player) => player.traits.some((trait) => trait.id === id)).length;
  lines.push(`| ${region} | ${list.length} | ${PLAYER_TRAIT_IDS.map(count).join(" | ")} |`);
}
lines.push(
  "",
  "Filtre absolute: " + PLAYER_TRAIT_IDS.map((id) => `${id}: ${TRAIT_DERIVATION[id].filterLabel}`).join("; ") + ". Intensity 2: treimea de sus a celor cu trait-ul pe rol (după distanța de prag).",
);

// ─── Pe echipă: titularii (rosterul de bază) și Team Fit ─────────────────────
const rosterOf = (teamId: string) => {
  const roster: Partial<Record<Role, string>> = {};
  for (const player of players) if (player.teamId === teamId && !roster[player.role]) roster[player.role] = player.id;
  return roster;
};
const playersById = new Map(players.map((player) => [player.id, player]));
const manyHogs: string[] = [];
const noResourceTraits: string[] = [];
const noHog: string[] = [];
const noLowResource: string[] = [];
lines.push("", "## Pe echipă (titularii)", "", "| Echipă | Top | Jungle | Mid | ADC | Support | Team Fit |", "|---|---|---|---|---|---|---|");
for (const team of [...teams].sort((a, b) => a.region.localeCompare(b.region) || a.sortOrder - b.sortOrder)) {
  const roster = rosterOf(team.id);
  const fit = computeTeamFit(roster);
  const cell = (role: Role) => {
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    return player ? `${player.name}: ${traitLabel(player)}` : "—";
  };
  if (fit.hogs.length >= 3) manyHogs.push(`${team.abbreviation} (${fit.hogs.length})`);
  if (fit.hogs.length === 0 && fit.weakside.length === 0 && fit.enablers.length === 0) noResourceTraits.push(team.abbreviation);
  if (fit.hogs.length === 0) noHog.push(team.abbreviation);
  if (fit.weakside.length === 0 && fit.enablers.length === 0) noLowResource.push(team.abbreviation);
  lines.push(`| ${team.abbreviation} (${team.region}) | ${ROLES.map(cell).join(" | ")} | ${[...fit.warnings.map((w) => `⚠ ${w}`), ...fit.notes].join("<br>")} |`);
}
lines.push(
  "",
  `Echipe cu ≥ 3 Resource Hog titulari (${manyHogs.length}): ${manyHogs.join(", ") || "—"}`,
  "",
  `Echipe fără niciun trait de resurse (${noResourceTraits.length}): ${noResourceTraits.join(", ") || "—"}`,
  "",
  `Echipe fără Resource Hog (${noHog.length}): ${noHog.join(", ") || "—"}`,
  "",
  `Echipe fără Weakside Ready și fără Enabler (${noLowResource.length}): ${noLowResource.join(", ") || "—"}`,
  "",
);

const markdown = lines.join("\n");
console.log(markdown);
if (named.out) {
  mkdirSync(dirname(named.out), { recursive: true });
  writeFileSync(named.out, markdown);
}
