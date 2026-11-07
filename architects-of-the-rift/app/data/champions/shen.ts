import { createChampion } from "./_helpers";

export const shen = createChampion({
  id: "shen",
  name: "Shen",
  image: "/champions/shen.png",
  roles: ["support", "top"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "nocturne", score: 5 },
    { championId: "twisted-fate", score: 5 },
    { championId: "galio", score: 5 },
    { championId: "taliyah", score: 4 },
    { championId: "lee-sin", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "xayah", score: 3 },
    { championId: "tristana", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "sideLanePressure", strength: 3 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "engage", severity: 1 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 7,
    bans: 1,
    presence: 8,
    prioScore: 8,
    wins: 2,
    losses: 5,
    proWinRate: 29,
    kda: 2.9,
    avgBanTurn: 9,
    avgPickRound: 2.14,
    blindPickRate: 28.6,
    averageGameTime: "30:52",
    csPerMinute: 5.1,
    damagePerMinute: 297,
    goldPerMinute: 313,
    csDiffAt15: -11.6,
    goldDiffAt15: -194,
    xpDiffAt15: -346,
    soloqKrChallengerWinRate: 54.06,
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
        presence: 4,
        prioScore: 3,
        wins: 2,
        losses: 1,
        proWinRate: 67,
        kda: 5.3,
        avgBanTurn: null,
        avgPickRound: 3.33,
        blindPickRate: 33.3,
        averageGameTime: "27:47",
        csPerMinute: 1.3,
        damagePerMinute: 202,
        goldPerMinute: 271,
        csDiffAt15: 3.3,
        goldDiffAt15: 198,
        xpDiffAt15: 80,
        soloqKrChallengerWinRate: null,
      },
    },
    top: {
      goodVs: [
        { championId: "tryndamere", level: 2, phase: "all", note: "W blochează autoatacurile, R salvează carry-ul" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 4,
        bans: null,
        presence: 5,
        prioScore: 5,
        wins: 0,
        losses: 4,
        proWinRate: 0,
        kda: 1.6,
        avgBanTurn: null,
        avgPickRound: 1.25,
        blindPickRate: 25,
        averageGameTime: "33:10",
        csPerMinute: 7.9,
        damagePerMinute: 368,
        goldPerMinute: 345,
        csDiffAt15: -22.8,
        goldDiffAt15: -488,
        xpDiffAt15: -666,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
