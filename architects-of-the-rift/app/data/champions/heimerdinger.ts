import { createChampion } from "./_helpers";

export const heimerdinger = createChampion({
  id: "heimerdinger",
  name: "Heimerdinger",
  image: "/champions/heimerdinger.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "ezreal", score: 4 },
    { championId: "xin-zhao", score: 4 },
    { championId: "tristana", score: 4 },
    { championId: "trundle", score: 3 },
    { championId: "jayce", score: 4 },
    { championId: "caitlyn", score: 3 },
    { championId: "sivir", score: 3 },
    { championId: "varus", score: 3 },
  ],

  offers: [
    { type: "zoneControl", strength: 5 },
    { type: "siege", strength: 4 },
    { type: "waveclear", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "engage", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 49.7,
  },

  roleData: {
    support: {
      goodVs: [],
      stats: null,
    },
  },
});
