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
import { PLAYER_TRAIT_IDS, PLAYER_TRAIT_INFO, type PlayerTraitId } from "@/app/types/playerTraits";
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

const eligible: Record<PlayerTraitId, (player: Player) => boolean> = {
  resource_hog: (player) => player.role !== "support",
  weakside_ready: (player) => TRAIT_DERIVATION.weaksideReady.roles.includes(player.role),
};
lines.push("## Distribuție", "", "| Trait | Total | Din eligibili | Țintă | Manual | Intensity 2 | " + ROLES.join(" | ") + " |", "|---|---|---|---|---|---|" + ROLES.map(() => "---|").join(""));
const targets: Record<PlayerTraitId, string> = { resource_hog: "20–30% din non-support", weakside_ready: "15–25% din top / jungle / adc" };
for (const id of PLAYER_TRAIT_IDS) {
  const withTrait = players.filter((player) => player.traits.some((trait) => trait.id === id));
  const pool = players.filter(eligible[id]);
  const byRole = ROLES.map((role) => {
    const total = players.filter((player) => player.role === role).length;
    const count = withTrait.filter((player) => player.role === role).length;
    return `${count}/${total}`;
  });
  lines.push(
    `| ${PLAYER_TRAIT_INFO[id].label} | ${withTrait.length} | ${pct(withTrait.length, pool.length)} (${withTrait.length}/${pool.length}) | ${targets[id]} | ${withTrait.filter((p) => p.traits.some((t) => t.id === id && t.source === "manual")).length} | ${withTrait.filter((p) => p.traits.some((t) => t.id === id && t.intensity === 2)).length} | ${byRole.join(" | ")} |`,
  );
}
lines.push("", "| Regiune | Jucători | Resource Hog | Weakside Ready |", "|---|---|---|---|");
for (const region of regions) {
  const list = players.filter((player) => regionOf(player) === region);
  const count = (id: PlayerTraitId) => list.filter((player) => player.traits.some((trait) => trait.id === id)).length;
  lines.push(`| ${region} | ${list.length} | ${count("resource_hog")} | ${count("weakside_ready")} |`);
}

// Percentilele câmpurilor din care se derivă (pentru calibrarea pragurilor).
const quantiles = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p: number) => sorted[Math.floor(p * (sorted.length - 1))]?.toFixed(0);
  return `p25 ${q(0.25)} · p50 ${q(0.5)} · p75 ${q(0.75)} · p90 ${q(0.9)}`;
};
const nonSupport = players.filter((player) => player.role !== "support");
lines.push(
  "",
  "Câmpurile din care se derivă:",
  `- carryResourceUsage (non-support): ${quantiles(nonSupport.map((p) => p.advancedProfile.playstyle.carryResourceUsage))}`,
  `- greed (non-support): ${quantiles(nonSupport.map((p) => p.advancedProfile.hiddenTraits.greed))}`,
  `- styleFlex (top / jungle / adc): ${quantiles(players.filter(eligible.weakside_ready).map((p) => p.advancedProfile.playstyle.styleFlex))}`,
  `- praguri: resource_hog carryResourceUsage ≥ ${TRAIT_DERIVATION.resourceHog.minCarryUsage} și greed ≥ ${TRAIT_DERIVATION.resourceHog.minGreed}; weakside_ready carryResourceUsage ≤ ${TRAIT_DERIVATION.weaksideReady.maxCarryUsage} și styleFlex ≥ ${TRAIT_DERIVATION.weaksideReady.minStyleFlex}`,
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
lines.push("", "## Pe echipă (titularii)", "", "| Echipă | Top | Jungle | Mid | ADC | Support | Team Fit |", "|---|---|---|---|---|---|---|");
for (const team of [...teams].sort((a, b) => a.region.localeCompare(b.region) || a.sortOrder - b.sortOrder)) {
  const roster = rosterOf(team.id);
  const fit = computeTeamFit(roster);
  const cell = (role: Role) => {
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    return player ? `${player.name}: ${traitLabel(player)}` : "—";
  };
  if (fit.hogs.length >= 3) manyHogs.push(`${team.abbreviation} (${fit.hogs.length})`);
  if (fit.hogs.length === 0 && fit.weakside.length === 0) noResourceTraits.push(team.abbreviation);
  lines.push(`| ${team.abbreviation} (${team.region}) | ${ROLES.map(cell).join(" | ")} | ${[...fit.warnings.map((w) => `⚠ ${w}`), ...fit.notes].join("<br>")} |`);
}
lines.push(
  "",
  `Echipe cu ≥ 3 Resource Hog titulari (${manyHogs.length}): ${manyHogs.join(", ") || "—"}`,
  "",
  `Echipe fără Resource Hog și fără Weakside Ready (${noResourceTraits.length}): ${noResourceTraits.join(", ") || "—"}`,
  "",
);

const markdown = lines.join("\n");
console.log(markdown);
if (named.out) {
  mkdirSync(dirname(named.out), { recursive: true });
  writeFileSync(named.out, markdown);
}
