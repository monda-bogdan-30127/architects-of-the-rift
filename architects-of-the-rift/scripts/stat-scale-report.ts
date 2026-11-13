// Raport: funcțiile care amestecă stats-urile vechi (`player.stats`, scala 10–100) cu scoruri pe 0–10. Pentru fiecare:
// distribuția pe cei 225 de jucători (min / mediană / max), câți lovesc plafonul de 10 și distribuția după normalizarea
// stats-urilor vechi la 0–10 (aceeași formulă, cu stat / 10). Doar raportează.
//
//   npx tsx scripts/stat-scale-report.ts

import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Player, PlayerStats } from "@/app/types/player";
import {
  playerClutchScore,
  playerConsistencyScore,
  playerExecutionScore,
  playerLaningScore,
  playerMacroScore,
  playerTeamfightScore,
} from "@/app/draft-engine/matchSimulationUtils";
import { getPlayerChampionFitScore } from "@/app/draft-engine/draftEvaluator";

const clamp = (value: number) => Math.max(0, Math.min(10, value));
const championsById = new Map(champions.map((champion) => [champion.id, champion]));
const p = (player: Player, key: keyof Player["advancedProfile"]["primary"]) => clamp(player.advancedProfile.primary[key] / 10);
const ps = (player: Player, key: keyof Player["advancedProfile"]["playstyle"]) => clamp(player.advancedProfile.playstyle[key] / 10);
const s = (player: Player, key: keyof PlayerStats) => player.stats[key] / 10;
const avg = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

// Aceleași formule ca în matchSimulationUtils, cu stats-urile vechi împărțite la 10.
const fixed: Record<string, (player: Player) => number> = {
  playerClutchScore: (pl) => clamp((s(pl, "con") * 0.38 + s(pl, "iq") * 0.28 + s(pl, "tfg") * 0.34) * 0.45 + avg([p(pl, "clutchFactor"), p(pl, "currentForm"), p(pl, "discipline")]) * 0.55),
  playerExecutionScore: (pl) => clamp((s(pl, "mec") * 0.42 + s(pl, "mac") * 0.33 + s(pl, "clt") * 0.25) * 0.42 + avg([p(pl, "mechanics"), p(pl, "skirmishing"), p(pl, "positioning")]) * 0.58),
  playerMacroScore: (pl) => clamp(s(pl, "mac") * 0.34 + p(pl, "mapAwareness") * 0.28 + p(pl, "objectiveControl") * 0.22 + p(pl, "rotationTiming") * 0.16),
  playerLaningScore: (pl) => clamp(s(pl, "mec") * 0.25 + p(pl, "laning") * 0.42 + p(pl, "mechanics") * 0.2 + ps(pl, "laneControlBias") * 0.13),
  playerTeamfightScore: (pl) => clamp(s(pl, "tfg") * 0.34 + p(pl, "teamfighting") * 0.4 + p(pl, "positioning") * 0.16 + ps(pl, "setupDependence") * 0.1),
  playerConsistencyScore: (pl) => clamp(s(pl, "con") * 0.42 + p(pl, "consistency") * 0.36 + p(pl, "discipline") * 0.22),
};
const current: Record<string, (player: Player) => number> = {
  playerClutchScore: (pl) => playerClutchScore(pl.id),
  playerExecutionScore: (pl) => playerExecutionScore(pl.id),
  playerMacroScore: (pl) => playerMacroScore(pl.id),
  playerLaningScore: (pl) => playerLaningScore(pl.id),
  playerTeamfightScore: (pl) => playerTeamfightScore(pl.id),
  playerConsistencyScore: (pl) => playerConsistencyScore(pl.id),
};

const stats = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const capped = values.filter((value) => value >= 10 - 1e-9).length;
  return `${sorted[0].toFixed(2)} / ${sorted[Math.floor(sorted.length / 2)].toFixed(2)} / ${sorted[sorted.length - 1].toFixed(2)} | ${capped}`;
};

const lines = [
  `# Stats vechi (10–100) amestecate cu scoruri 0–10: ${players.length} jucători`,
  "",
  "| Funcție | Acum: min / mediană / max \\| la plafon 10 | Normalizat: min / mediană / max \\| la plafon 10 |",
  "|---|---|---|",
];
for (const name of Object.keys(current)) {
  lines.push(`| ${name} | ${stats(players.map(current[name]))} | ${stats(players.map(fixed[name]))} |`);
}

// getPlayerChampionFitScore(player.stats, champion.playerScaling): pe fiecare jucător × campionii lui de bază.
const fitNow: number[] = [];
const fitFixed: number[] = [];
for (const player of players) {
  for (const championId of player.bestChampions) {
    const champion = championsById.get(championId);
    if (!champion) continue;
    fitNow.push(getPlayerChampionFitScore(player.stats, champion.playerScaling));
    const scaled = Object.fromEntries(Object.entries(player.stats).map(([key, value]) => [key, value / 10])) as PlayerStats;
    fitFixed.push(getPlayerChampionFitScore(scaled, champion.playerScaling));
  }
}
lines.push(`| getPlayerChampionFitScore (jucător × bestChampions, ${fitNow.length}) | ${stats(fitNow)} | ${stats(fitFixed)} |`);

// computeStarPower (matchSimulator): legacyStar e o sumă ponderată pe 10–100, amestecată 0.38 / 0.62 cu advancedStar (0–10).
const legacyStar = (pl: Player) => pl.stats.mec * 0.2 + pl.stats.mac * 0.15 + pl.stats.tfg * 0.15 + pl.stats.con * 0.15 + pl.stats.iq * 0.15 + pl.stats.clt * 0.2;
const advancedStar = (pl: Player) => {
  const a = pl.advancedProfile.primary;
  return (a.mechanics * 0.14 + a.teamfighting * 0.16 + a.mapAwareness * 0.12 + a.clutchFactor * 0.2 + a.currentForm * 0.18 + a.metaReadiness * 0.2) / 10;
};
lines.push(`| computeStarPower | ${stats(players.map((pl) => clamp(legacyStar(pl) * 0.38 + advancedStar(pl) * 0.62)))} | ${stats(players.map((pl) => clamp((legacyStar(pl) / 10) * 0.38 + advancedStar(pl) * 0.62)))} |`);

lines.push(
  "",
  "Stats-urile vechi pe jucători: " +
    (["mec", "mac", "tfg", "clt", "con", "iq"] as (keyof PlayerStats)[])
      .map((key) => {
        const values = players.map((pl) => pl.stats[key]).sort((a, b) => a - b);
        return `${key} ${values[0]}–${values[values.length - 1]}`;
      })
      .join(", "),
);
console.log(lines.join("\n"));
