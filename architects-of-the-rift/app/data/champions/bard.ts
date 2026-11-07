import { createChampion } from "./_helpers";

export const bard = createChampion({
  id: "bard",
  name: "Bard",
  image: "/champions/bard.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "ezreal", score: 4 },
    { championId: "caitlyn", score: 3 },
    { championId: "skarner", score: 3 },
    { championId: "sivir", score: 3 },
    { championId: "pantheon", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "ryze", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 5 },
    { type: "disengage", strength: 4 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mec: 3, mac: 5, tfg: 3, iq: 5 },

  stats: {
    picks: 3,
    bans: 2,
    presence: 5,
    prioScore: 5,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 16,
    avgBanTurn: 5.5,
    avgPickRound: 2,
    blindPickRate: 33.3,
    averageGameTime: "29:17",
    csPerMinute: 1.1,
    damagePerMinute: 262,
    goldPerMinute: 291,
    csDiffAt15: -2.3,
    goldDiffAt15: 368,
    xpDiffAt15: 158,
    soloqKrChallengerWinRate: 58,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "lulu", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "janna", level: 2, phase: "lane" },
        { championId: "karma", level: 2, phase: "lane" },
        { championId: "nami", level: 2, phase: "lane" },
        { championId: "renata-glasc", level: 2, phase: "lane" },
        { championId: "yuumi", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
