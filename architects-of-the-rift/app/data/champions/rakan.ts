import { createChampion } from "./_helpers";

export const rakan = createChampion({
  id: "rakan",
  name: "Rakan",
  image: "/champions/rakan.png",
  roles: ["support"],
  damageProfile: ["AP"],

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
        { championId: "lulu", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește dash-urile lui Rakan" },
        { championId: "bard", level: 2, phase: "lane" },
        { championId: "neeko", level: 2, phase: "lane" },
        { championId: "renata-glasc", level: 2, phase: "lane" },
        { championId: "seraphine", level: 2, phase: "lane" },
      ],
      mustWith: ["xayah"],
      stats: null,
    },
  },
});
