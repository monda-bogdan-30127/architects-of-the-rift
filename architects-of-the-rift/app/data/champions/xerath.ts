import { createChampion } from "./_helpers";

export const xerath = createChampion({
  id: "xerath",
  name: "Xerath",
  image: "/champions/xerath.png",
  roles: ["mid"],
  damageProfile: ["AP"],
  attackType: "ranged",

  offers: [
    { type: "poke", strength: 5 },
    { type: "siege", strength: 4 },
    { type: "waveclear", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 57.04,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "chogath", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
