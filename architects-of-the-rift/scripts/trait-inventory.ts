// PLAYER_TRAITS §1.4 — inventarul trait-urilor de jucător: distribuția pe trait, rol și regiune (manual vs derivat),
// titularii fiecărei echipe cu trait-urile lor și Team Fit, plus cazurile-limită pe familii. Include și familiile încă
// inactive (fără efecte, ascunse în UI), ca să le vedem înainte de commit-ul cu efecte. Doar raportează.
//
//   npx tsx scripts/trait-inventory.ts [--out scripts/.calibration/trait-inventory.md]

import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { players } from "@/app/data/players";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { PLAYER_TRAIT_IDS, PLAYER_TRAIT_INFO, isTraitAllowedOnRole, type PlayerTraitId } from "@/app/types/playerTraits";
import { DRAFT_TRAIT_DERIVATION, TRAIT_DERIVATION, computeTeamFit } from "@/app/utils/playerTraitUtils";
// Grade-urile (signature_player) se înregistrează la încărcarea lui championMasteryUtils.
import "@/app/utils/championMasteryUtils";
import { ACTIVE_TRAIT_FAMILIES } from "@/app/types/playerTraits";
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
lines.push("● = intensity 2 · (m) = manual (playerProfileOverrides), restul derivate · [inactiv] = familie fără efecte încă (ascunsă în UI).", "");

lines.push(
  "## Distribuție",
  "",
  "Pe rol: cu trait / jucători pe rol (țintă pe rol, totală: manual + derivat). Manual = din playerProfileOverrides.",
  "",
  "| Trait | Familie | Total | Manual | Intensity 2 | " + ROLES.join(" | ") + " |",
  "|---|---|---|---|---|" + ROLES.map(() => "---|").join(""),
);
const shareOf = (id: PlayerTraitId): Partial<Record<Role, number>> => {
  if (id in TRAIT_DERIVATION) return TRAIT_DERIVATION[id as keyof typeof TRAIT_DERIVATION].share;
  const rule = DRAFT_TRAIT_DERIVATION[id];
  return rule ? Object.fromEntries(ROLES.filter((role) => isTraitAllowedOnRole(id, role)).map((role) => [role, rule.share])) : {};
};
for (const id of PLAYER_TRAIT_IDS) {
  const withTrait = players.filter((player) => player.traits.some((trait) => trait.id === id));
  const share = shareOf(id);
  const family = PLAYER_TRAIT_INFO[id].family;
  const byRole = ROLES.map((role) => {
    if (!isTraitAllowedOnRole(id, role)) return "—";
    const total = players.filter((player) => player.role === role).length;
    const count = withTrait.filter((player) => player.role === role).length;
    return `${count}/${total} (${pct(count, total)}${share[role] ? `, țintă ${Math.round(share[role]! * 100)}%` : ""})`;
  });
  lines.push(
    `| ${PLAYER_TRAIT_INFO[id].label} | ${family}${ACTIVE_TRAIT_FAMILIES.includes(family) ? "" : " [inactiv]"} | ${withTrait.length} | ${withTrait.filter((p) => p.traits.some((t) => t.id === id && t.source === "manual")).length} | ${withTrait.filter((p) => p.traits.some((t) => t.id === id && t.intensity === 2)).length} | ${byRole.join(" | ")} |`,
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
  "Reguli: " +
    [
      ...Object.entries(TRAIT_DERIVATION).map(([id, rule]) => `${id}: percentila carryResourceUsage, ${rule.filterLabel}`),
      ...Object.entries(DRAFT_TRAIT_DERIVATION).map(([id, rule]) => `${id}: ${rule!.label}`),
    ].join("; ") +
    ". Intensity 2: treimea de sus a celor cu trait-ul pe rol. Cel mult un trait derivat din familia Draft pe jucător.",
);
const traitCount = players.map((player) => player.traits.length);
lines.push("", `Trait-uri pe jucător: ${[0, 1, 2, 3].map((n) => `${n}: ${traitCount.filter((count) => count === n).length}`).join(" · ")}`);

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
  const fit = computeTeamFit(roster, undefined, { includeInactive: true });
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

// ─── Cazuri-limită, faza 2 (Draft & Series) ───────────────────────────────────
const teamsWith = (id: PlayerTraitId, min: number) =>
  teams.filter((team) => {
    const roster = rosterOf(team.id);
    return Object.values(roster).filter((playerId) => playersById.get(playerId!)?.traits.some((trait) => trait.id === id)).length >= min;
  }).map((team) => team.abbreviation);
lines.push(
  "## Cazuri-limită, Draft & Series",
  "",
  `≥ 2 Counter-Pick Specialist: ${teamsWith("counter_specialist", 2).join(", ") || "—"}`,
  "",
  `≥ 2 Needs Setup: ${teamsWith("needs_setup", 2).join(", ") || "—"}`,
  "",
  `≥ 3 Signature Player: ${teamsWith("signature_player", 3).join(", ") || "—"}`,
  "",
  `≥ 2 Fast Starter: ${teamsWith("fast_starter", 2).join(", ") || "—"} · ≥ 2 Series Adapter: ${teamsWith("series_adapter", 2).join(", ") || "—"}`,
  "",
);

const markdown = lines.join("\n");
console.log(markdown);
if (named.out) {
  mkdirSync(dirname(named.out), { recursive: true });
  writeFileSync(named.out, markdown);
}
