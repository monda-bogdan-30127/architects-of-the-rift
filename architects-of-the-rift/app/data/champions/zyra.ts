import { createChampion } from "./_helpers";

export const zyra = createChampion({
  id: "zyra",
  name: "Zyra",
  image: "/champions/zyra.png",
  roles: ["support", "jungle"],
  damageProfile: ["AP"],

  offers: [
    { type: "zoneControl", strength: 5 },
    { type: "objectiveControl", strength: 4 },
    { type: "poke", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "earlyPrio", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 4, con: 3, iq: 4 },

  stats: {
    picks: 0,
    bans: 1,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: 7,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 58.29,
  },

  roleData: {
    support: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
