import { createChampion } from "./_helpers";

export const zilean = createChampion({
  id: "zilean",
  name: "Zilean",
  image: "/champions/zilean.png",
  roles: ["support", "mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "olaf", score: 5 },
    { championId: "darius", score: 5 },
    { championId: "caitlyn", score: 4 },
    { championId: "volibear", score: 4 },
    { championId: "vayne", score: 4 },
    { championId: "zeri", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "kaisa", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 4 },
    { type: "disengage", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 0,
    bans: 0,
    presence: 0,
    prioScore: 0,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: null,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 60.66,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "pyke", level: 2, phase: "all", note: "R salvează aliatul de execute" },
      ],
      stats: null,
    },
    mid: {
      goodVs: [],
      stats: null,
    },
  },
});
