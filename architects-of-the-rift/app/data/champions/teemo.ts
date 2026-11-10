import { createChampion } from "./_helpers";

export const teemo = createChampion({
  id: "teemo",
  name: "Teemo",
  image: "/champions/teemo.png",
  roles: ["top"],
  damageProfile: ["AP"],
  attackType: "ranged",

  offers: [
    { type: "zoneControl", strength: 4 },
    { type: "sideLanePressure", strength: 3 },
    { type: "poke", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

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
    soloqKrChallengerWinRate: 54.47,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "tryndamere", level: 2, phase: "all", note: "The blind negates Tryndamere's autos" },
        { championId: "darius", level: 2, phase: "lane" },
        { championId: "jax", level: 2, phase: "lane" },
        { championId: "nasus", level: 2, phase: "lane" },
        { championId: "olaf", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
