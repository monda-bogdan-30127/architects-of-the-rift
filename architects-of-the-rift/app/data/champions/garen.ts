import { createChampion } from "./_helpers";

export const garen = createChampion({
  id: "garen",
  name: "Garen",
  image: "/champions/garen.png",
  roles: ["top"],
  damageProfile: ["AD", "TRUE"],
  attackType: "melee",

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 3 },
    { type: "frontline", strength: 2 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
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
    soloqKrChallengerWinRate: 57.86,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ksante", level: 1, phase: "all" },
      ],
      stats: null,
    },
  },
});
