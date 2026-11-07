import { createChampion } from "./_helpers";

export const jhin = createChampion({
  id: "jhin",
  name: "Jhin",
  image: "/champions/jhin.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "karma", score: 3 },
    { championId: "thresh", score: 3 },
    { championId: "bard", score: 4 },
    { championId: "nautilus", score: 2 },
    { championId: "nami", score: 3 }
  ],

  offers: [
    { type: "pick", strength: 3 },
    { type: "burstDamage", strength: 3 },
    { type: "siege", strength: 3 },
    { type: "followUp", strength: 2 }
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

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

  stats: {
    picks: 17,
    bans: 13,
    presence: 30,
    prioScore: 34,
    wins: 9,
    losses: 8,
    proWinRate: 53,
    kda: 8.5,
    avgBanTurn: 7.7,
    avgPickRound: 1.59,
    blindPickRate: 58.8,
    averageGameTime: "30:17",
    csPerMinute: 10.1,
    damagePerMinute: 629,
    goldPerMinute: 476,
    csDiffAt15: 1.7,
    goldDiffAt15: -81,
    xpDiffAt15: 190,
    soloqKrChallengerWinRate: 53.43,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "aphelios", level: 2, phase: "lane" },
        { championId: "kogmaw", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "jinx", level: 2, phase: "late" },
        { championId: "xayah", level: 2, phase: "late" },
        { championId: "caitlyn", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
