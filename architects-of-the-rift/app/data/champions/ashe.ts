import { createChampion } from "./_helpers";

export const ashe = createChampion({
  id: "ashe",
  name: "Ashe",
  image: "/champions/ashe.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "braum", score: 3 },
    { championId: "karma", score: 2 },
    { championId: "lulu", score: 2 },
    { championId: "bard", score: 2 },
    { championId: "jax", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "sejuani", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "poke", strength: 3 },
    { type: "engage", strength: 2 },
    { type: "siege", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

  stats: {
    picks: 11,
    bans: 3,
    presence: 14,
    prioScore: 15,
    wins: 7,
    losses: 4,
    proWinRate: 64,
    kda: 3.5,
    avgBanTurn: 6,
    avgPickRound: 1.55,
    blindPickRate: 72.7,
    averageGameTime: "33:21",
    csPerMinute: 10,
    damagePerMinute: 582,
    goldPerMinute: 479,
    csDiffAt15: 3,
    goldDiffAt15: 14,
    xpDiffAt15: -205,
    soloqKrChallengerWinRate: 58.82,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "lucian", score: 3 },
        { championId: "corki", score: 2 },
        { championId: "jinx", score: 2 },
      ],
      weakVs: [
        { championId: "aphelios", score: 3 },
        { championId: "caitlyn", score: 2 },
        { championId: "kalista", score: 2 },
        { championId: "varus", score: 2 },
        { championId: "ezreal", score: 1 },
      ],
      mustWith: ["seraphine"],
      stats: null,
    },
  },
});
