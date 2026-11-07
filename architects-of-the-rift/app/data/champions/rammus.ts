import { createChampion } from "./_helpers";

export const rammus = createChampion({
  id: "rammus",
  name: "Rammus",
  image: "/champions/rammus.png",
  roles: ["jungle"],
  damageProfile: ["AP"],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "antiDive", strength: 4 },
    { type: "engage", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "sideLanePressure", severity: 1 },
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
    soloqKrChallengerWinRate: 52.6,
  },

  roleData: {
    jungle: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
