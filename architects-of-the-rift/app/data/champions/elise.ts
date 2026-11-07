import { createChampion } from "./_helpers";

export const elise = createChampion({
  id: "elise",
  name: "Elise",
  image: "/champions/elise.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "draven", score: 5 },
    { championId: "caitlyn", score: 5 },
    { championId: "jhin", score: 3 },
    { championId: "varus", score: 3 }
  ],

  offers: [
    { type: "burstDamage", strength: 4 },
    { type: "pick", strength: 4 },
    { type: "poke", strength: 3 },
    { type: "zoneControl", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 5,
    avgBanTurn: null,
    avgPickRound: 1,
    blindPickRate: 0,
    averageGameTime: "40:04",
    csPerMinute: 1.4,
    damagePerMinute: 288,
    goldPerMinute: 281,
    csDiffAt15: 4,
    goldDiffAt15: 731,
    xpDiffAt15: 208,
    soloqKrChallengerWinRate: 60.58,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "leona", score: 2 },
        { championId: "lulu", score: 2 },
        { championId: "poppy", score: 2 },
        { championId: "rakan", score: 2 },
        { championId: "renata-glasc", score: 2 },
      ],
      weakVs: [
        { championId: "alistar", score: 2 },
        { championId: "karma", score: 2 },
        { championId: "nautilus", score: 2 },
        { championId: "neeko", score: 2 },
        { championId: "rell", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
