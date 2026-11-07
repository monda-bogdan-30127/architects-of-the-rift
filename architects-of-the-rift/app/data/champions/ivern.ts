import { createChampion } from "./_helpers";

export const ivern = createChampion({
  id: "ivern",
  name: "Ivern",
  image: "/champions/ivern.png",
  roles: ["jungle"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "yone", score: 5 },
    { championId: "rakan", score: 5 },
    { championId: "xayah", score: 5 },
    { championId: "rumble", score: 5 },
    { championId: "rell", score: 5 },
    { championId: "kalista", score: 4 },
    { championId: "gwen", score: 4 },
    { championId: "jinx", score: 4 },
  ],

  offers: [
    { type: "peel", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "disengage", strength: 3 },
    { type: "frontline", strength: 2 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "pick", severity: 2 }
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
    soloqKrChallengerWinRate: 63.3,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
