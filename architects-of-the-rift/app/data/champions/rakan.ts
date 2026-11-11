import { createChampion } from "./_helpers";

export const rakan = createChampion({
  id: "rakan",
  name: "Rakan",
  image: "/champions/rakan.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "kaisa", score: 4 },
    { championId: "zeri", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "aphelios", score: 3 },
    { championId: "yasuo", score: 3 },
    { championId: "wukong", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "followUp", strength: 4 },
    { type: "disengage", strength: 3 },
    { type: "reliableCC", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 5, iq: 4 },

  stats: {
    picks: 9,
    bans: 2,
    presence: 11,
    prioScore: 10,
    wins: 4,
    losses: 5,
    proWinRate: 44,
    kda: 3.8,
    avgBanTurn: 8,
    avgPickRound: 2,
    blindPickRate: 44.4,
    averageGameTime: "33:18",
    csPerMinute: 1.2,
    damagePerMinute: 167,
    goldPerMinute: 259,
    csDiffAt15: 3.1,
    goldDiffAt15: 27,
    xpDiffAt15: -65,
    soloqKrChallengerWinRate: 56.49,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "heimerdinger", level: 2, phase: "lane" },
        { championId: "sona", level: 2, phase: "lane" },
        { championId: "soraka", level: 2, phase: "lane" },
        { championId: "alistar", level: 2, phase: "all" },
      ],
      mustWith: ["xayah"],
      stats: {
        picks: 11,
        bans: null,
        presence: 14,
        prioScore: 11,
        wins: 5,
        losses: 6,
        proWinRate: 45,
        kda: 3.4,
        avgBanTurn: null,
        avgPickRound: 2.27,
        blindPickRate: 45.5,
        averageGameTime: "33:30",
        csPerMinute: 1.1,
        damagePerMinute: 161,
        goldPerMinute: 258,
        csDiffAt15: 1.4,
        goldDiffAt15: -13,
        xpDiffAt15: -208,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
