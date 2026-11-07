import { createChampion } from "./_helpers";

export const twistedFate = createChampion({
  id: "twisted-fate",
  name: "Twisted Fate",
  image: "/champions/twisted-fate.png",
  roles: ["mid", "top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "camille", score: 5 },
    { championId: "jax", score: 5 },
    { championId: "renekton", score: 4 },
    { championId: "nocturne", score: 4 },
    { championId: "pantheon", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "lee-sin", score: 3 },
    { championId: "elise", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 5 },
    { type: "sideLanePressure", strength: 3 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, con: 4, iq: 4 },

  stats: {
    picks: 3,
    bans: 5,
    presence: 8,
    prioScore: 8,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 4.5,
    avgBanTurn: 9.2,
    avgPickRound: 3,
    blindPickRate: 33.3,
    averageGameTime: "32:38",
    csPerMinute: 8.6,
    damagePerMinute: 364,
    goldPerMinute: 431,
    csDiffAt15: 9,
    goldDiffAt15: 660,
    xpDiffAt15: 166,
    soloqKrChallengerWinRate: 55.97,
  },

  roleData: {
    mid: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 2,
        bans: null,
        presence: 7,
        prioScore: 6,
        wins: 2,
        losses: 0,
        proWinRate: 100,
        kda: null,
        avgBanTurn: null,
        avgPickRound: 3.5,
        blindPickRate: 50,
        averageGameTime: "32:26",
        csPerMinute: 8.8,
        damagePerMinute: 425,
        goldPerMinute: 431,
        csDiffAt15: 2,
        goldDiffAt15: -120,
        xpDiffAt15: -135,
        soloqKrChallengerWinRate: null,
      },
    },
    top: {
      goodVs: [
        { championId: "sion", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 6,
        prioScore: 6,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 1,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "33:03",
        csPerMinute: 8.3,
        damagePerMinute: 242,
        goldPerMinute: 431,
        csDiffAt15: 23,
        goldDiffAt15: 2220,
        xpDiffAt15: 769,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
