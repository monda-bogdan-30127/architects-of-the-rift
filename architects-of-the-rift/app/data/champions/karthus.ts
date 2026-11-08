import { createChampion } from "./_helpers";

export const karthus = createChampion({
  id: "karthus",
  name: "Karthus",
  image: "/champions/karthus.png",
  roles: ["jungle"],
  damageProfile: ["AP"],
  attackType: "ranged",

  offers: [
    { type: "scaling", strength: 5 },
    { type: "sustainedDamage", strength: 5 },
    { type: "objectiveControl", strength: 4 },
    { type: "zoneControl", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "earlyPrio", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "engage", severity: 1 }
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 53.73,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
