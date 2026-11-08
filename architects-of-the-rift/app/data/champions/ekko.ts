import { createChampion } from "./_helpers";

export const ekko = createChampion({
  id: "ekko",
  name: "Ekko",
  image: "/champions/ekko.png",
  roles: ["mid", "jungle"],
  damageProfile: ["AP"],
  attackType: "melee",

  offers: [
    { type: "pick", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "waveclear", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
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
    soloqKrChallengerWinRate: 54.31,
  },

  roleData: {
    mid: {
      goodVs: [],
      stats: null,
    },
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
