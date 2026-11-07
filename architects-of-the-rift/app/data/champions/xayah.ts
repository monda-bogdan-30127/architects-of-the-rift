import { createChampion } from "./_helpers";

export const xayah = createChampion({
  id: "xayah",
  name: "Xayah",
  image: "/champions/xayah.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "nautilus", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "alistar", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "wukong", score: 3 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "siege", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 5, clt: 3, con: 4 },

  stats: {
    picks: 7,
    bans: 1,
    presence: 8,
    prioScore: 6,
    wins: 4,
    losses: 3,
    proWinRate: 57,
    kda: 3,
    avgBanTurn: 3,
    avgPickRound: 2.29,
    blindPickRate: 28.6,
    averageGameTime: "35:46",
    csPerMinute: 10.5,
    damagePerMinute: 657,
    goldPerMinute: 509,
    csDiffAt15: 3.4,
    goldDiffAt15: 607,
    xpDiffAt15: 360,
    soloqKrChallengerWinRate: 58.35,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "samira", level: 2, phase: "all", note: "R (untargetable) anulează all-in-ul Samirei" },
        { championId: "ziggs", level: 2, phase: "lane" },
        { championId: "kaisa", level: 1, phase: "all" },
      ],
      mustWith: ["rakan"],
      stats: {
        picks: 9,
        bans: null,
        presence: 11,
        prioScore: 7,
        wins: 5,
        losses: 4,
        proWinRate: 56,
        kda: 3,
        avgBanTurn: null,
        avgPickRound: 2.56,
        blindPickRate: 44.4,
        averageGameTime: "35:27",
        csPerMinute: 10.5,
        damagePerMinute: 658,
        goldPerMinute: 507,
        csDiffAt15: 1.4,
        goldDiffAt15: 362,
        xpDiffAt15: 307,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
