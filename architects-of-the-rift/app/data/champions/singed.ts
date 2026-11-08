import { createChampion } from "./_helpers";

export const singed = createChampion({
  id: "singed",
  name: "Singed",
  image: "/champions/singed.png",
  roles: ["top"],
  damageProfile: ["AP"],
  attackType: "melee",

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "engage", strength: 3 },
    { type: "disengage", strength: 3 },
    { type: "zoneControl", strength: 3 },
    { type: "frontline", strength: 2 }
  ],

  needs: [
    { type: "followUp", priority: 1 },
    { type: "sustainedDamage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 1 }
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
    soloqKrChallengerWinRate: 58.2,
  },

  roleData: {
    top: {
      goodVs: [],
      stats: null,
    },
  },
});
