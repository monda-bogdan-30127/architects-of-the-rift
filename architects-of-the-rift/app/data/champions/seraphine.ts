import { createChampion } from "./_helpers";

export const seraphine = createChampion({
  id: "seraphine",
  name: "Seraphine",
  image: "/champions/seraphine.png",
  roles: ["support", "adc"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "ezreal", score: 4 },
    { championId: "jhin", score: 4 },
    { championId: "xin-zhao", score: 4 },
    { championId: "dr-mundo", score: 3 },
    { championId: "vi", score: 3 },
    { championId: "ornn", score: 3 },
    { championId: "nocturne", score: 2 },
  ],

  offers: [
    { type: "waveclear", strength: 4 },
    { type: "disengage", strength: 4 },
    { type: "peel", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "zoneControl", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 }
  ],

  playerScaling: { mac: 4, tfg: 5, con: 3, iq: 4 },

  stats: {
    picks: 13,
    bans: 18,
    presence: 31,
    prioScore: 35,
    wins: 8,
    losses: 5,
    proWinRate: 62,
    kda: 4.1,
    avgBanTurn: 4.3,
    avgPickRound: 1.69,
    blindPickRate: 69.2,
    averageGameTime: "32:59",
    csPerMinute: 1.1,
    damagePerMinute: 240,
    goldPerMinute: 268,
    csDiffAt15: 2.5,
    goldDiffAt15: 120,
    xpDiffAt15: 273,
    soloqKrChallengerWinRate: 55.53,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "karma", score: 2 },
        { championId: "lulu", score: 2 },
      ],
      weakVs: [
        { championId: "bard", score: 2 },
        { championId: "braum", score: 2 },
        { championId: "leona", score: 2 },
        { championId: "nautilus", score: 2 },
        { championId: "thresh", score: 2 },
      ],
      mustWith: ["ashe"],
      stats: null,
    },
    adc: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
