import { createChampion } from "./_helpers";

export const masterYi = createChampion({
  id: "master-yi",
  name: "Master Yi",
  image: "/champions/master-yi.png",
  roles: ["jungle"],
  damageProfile: ["AD", "TRUE"],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "scaling", strength: 4 },
    { type: "objectiveControl", strength: 4 },
    { type: "dive", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "antiDive", severity: 3 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "earlyPrio", severity: 1 }
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
    soloqKrChallengerWinRate: 58.81,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
