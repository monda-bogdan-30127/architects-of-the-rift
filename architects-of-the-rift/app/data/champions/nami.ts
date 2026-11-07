import { createChampion } from "./_helpers";

export const nami = createChampion({
  id: "nami",
  name: "Nami",
  image: "/champions/nami.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "lucian", score: 5 },
    { championId: "caitlyn", score: 4 },
    { championId: "corki", score: 4 },
    { championId: "jhin", score: 4 },
    { championId: "ezreal", score: 3 },
    { championId: "varus", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 4 },
    { type: "disengage", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mec: 3, mac: 4, con: 4, iq: 4 },

  stats: {
    picks: 3,
    bans: 0,
    presence: 3,
    prioScore: 2,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 6.8,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 66.7,
    averageGameTime: "36:21",
    csPerMinute: 0.8,
    damagePerMinute: 236,
    goldPerMinute: 262,
    csDiffAt15: -4.7,
    goldDiffAt15: 109,
    xpDiffAt15: 15,
    soloqKrChallengerWinRate: 56.07,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "yuumi", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 3,
        bans: null,
        presence: 3,
        prioScore: 2,
        wins: 2,
        losses: 1,
        proWinRate: 67,
        kda: 6.8,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 66.7,
        averageGameTime: "36:21",
        csPerMinute: 0.8,
        damagePerMinute: 236,
        goldPerMinute: 262,
        csDiffAt15: -4.7,
        goldDiffAt15: 109,
        xpDiffAt15: 15,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
