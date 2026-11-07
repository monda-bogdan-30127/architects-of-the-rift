import { createChampion } from "./_helpers";

export const galio = createChampion({
  id: "galio",
  name: "Galio",
  image: "/champions/galio.png",
  roles: ["mid", "top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "nocturne", score: 4 },
    { championId: "camille", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "kindred", score: 4 },
    { championId: "wukong", score: 3 },
    { championId: "seraphine", score: 3 },
    { championId: "bard", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 4 },
    { type: "followUp", strength: 4 },
    { type: "antiDive", strength: 3 },
    { type: "frontline", strength: 4 },
    { type: "roamPressure", strength: 4 }
  ],

  needs: [
    { type: "sustainedDamage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 4, con: 4 },

  stats: {
    picks: 12,
    bans: 14,
    presence: 26,
    prioScore: 30,
    wins: 8,
    losses: 4,
    proWinRate: 67,
    kda: 5,
    avgBanTurn: 5.1,
    avgPickRound: 1.58,
    blindPickRate: 33.3,
    averageGameTime: "32:43",
    csPerMinute: 8.3,
    damagePerMinute: 452,
    goldPerMinute: 372,
    csDiffAt15: -5.3,
    goldDiffAt15: -304,
    xpDiffAt15: 1,
    soloqKrChallengerWinRate: 55.99,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "sylas", level: 2, phase: "all", note: "pasivul de MR contra burst-ului AP" },
        { championId: "viktor", level: 2, phase: "all", note: "pasivul de MR și engage pe un mage imobil" },
      ],
      weakVs: [
        { championId: "ahri", level: 2, phase: "lane" },
        { championId: "annie", level: 2, phase: "lane" },
        { championId: "orianna", level: 2, phase: "lane" },
        { championId: "taliyah", level: 2, phase: "lane" },
        { championId: "yone", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
