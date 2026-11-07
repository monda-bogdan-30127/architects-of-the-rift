import { createChampion } from "./_helpers";

export const lillia = createChampion({
  id: "lillia",
  name: "Lillia",
  image: "/champions/lillia.png",
  roles: ["jungle"],
  damageProfile: ["AP"],

  offers: [
    { type: "sustainedDamage", strength: 4 },
    { type: "zoneControl", strength: 3 },
    { type: "objectiveControl", strength: 3 },
    { type: "scaling", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "earlyPrio", severity: 1 }
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 0,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 0.8,
    avgBanTurn: null,
    avgPickRound: 5,
    blindPickRate: 0,
    averageGameTime: "31:21",
    csPerMinute: 8.3,
    damagePerMinute: 420,
    goldPerMinute: 349,
    csDiffAt15: 10,
    goldDiffAt15: -141,
    xpDiffAt15: -105,
    soloqKrChallengerWinRate: 48.02,
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
