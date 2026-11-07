import { createChampion } from "./_helpers";

export const ahri = createChampion({
  id: "ahri",
  name: "Ahri",
  image: "/champions/ahri.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "vi", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "sejuani", score: 3 },
    { championId: "kaisa", score: 4 },
    { championId: "xayah", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 3, tfg: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 4,
    presence: 8,
    prioScore: 9,
    wins: 3,
    losses: 1,
    proWinRate: 75,
    kda: 6,
    avgBanTurn: 7.8,
    avgPickRound: 2.25,
    blindPickRate: 0,
    averageGameTime: "35:00",
    csPerMinute: 8.9,
    damagePerMinute: 599,
    goldPerMinute: 413,
    csDiffAt15: 14.2,
    goldDiffAt15: 599,
    xpDiffAt15: 524,
    soloqKrChallengerWinRate: 59,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "vladimir", level: 2, phase: "lane" },
        { championId: "zoe", level: 1, phase: "all" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 6,
        bans: null,
        presence: 11,
        prioScore: 10,
        wins: 4,
        losses: 2,
        proWinRate: 67,
        kda: 5.5,
        avgBanTurn: null,
        avgPickRound: 2.67,
        blindPickRate: 16.7,
        averageGameTime: "34:39",
        csPerMinute: 8.9,
        damagePerMinute: 595,
        goldPerMinute: 402,
        csDiffAt15: 4.3,
        goldDiffAt15: 399,
        xpDiffAt15: 153,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
