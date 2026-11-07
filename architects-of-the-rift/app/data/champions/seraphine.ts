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
        { championId: "sona", level: 2, phase: "lane" },
        { championId: "yuumi", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: ["ashe"],
      stats: {
        picks: 15,
        bans: null,
        presence: 34,
        prioScore: 33,
        wins: 10,
        losses: 5,
        proWinRate: 67,
        kda: 4.4,
        avgBanTurn: null,
        avgPickRound: 1.8,
        blindPickRate: 73.3,
        averageGameTime: "32:48",
        csPerMinute: 1.1,
        damagePerMinute: 234,
        goldPerMinute: 270,
        csDiffAt15: 2.4,
        goldDiffAt15: 136,
        xpDiffAt15: 205,
        soloqKrChallengerWinRate: null,
      },
    },
    adc: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
