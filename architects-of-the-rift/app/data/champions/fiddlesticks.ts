import { createChampion } from "./_helpers";

export const fiddlesticks = createChampion({
  id: "fiddlesticks",
  name: "Fiddlesticks",
  image: "/champions/fiddlesticks.png",
  roles: ["jungle"],
  damageProfile: ["AP"],

  offers: [
    { type: "engage", strength: 4 },
    { type: "followUp", strength: 5 },
    { type: "zoneControl", strength: 3 },
    { type: "burstDamage", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 5, iq: 4 },

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
    soloqKrChallengerWinRate: 57.72,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
