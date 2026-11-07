import { createChampion } from "./_helpers";

export const alistar = createChampion({
  id: "alistar",
  name: "Alistar",
  image: "/champions/alistar.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "kaisa", score: 4 },
    { championId: "samira", score: 4 },
    { championId: "sivir", score: 4 },
    { championId: "jhin", score: 3 },
    { championId: "varus", score: 3 },
    { championId: "draven", score: 3 },
    { championId: "xayah", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "frontline", strength: 4 },
    { type: "peel", strength: 3 },
    { type: "disengage", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "peel", severity: 1 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

  stats: {
    picks: 21,
    bans: 1,
    presence: 22,
    prioScore: 24,
    wins: 7,
    losses: 14,
    proWinRate: 33,
    kda: 2.1,
    avgBanTurn: 9,
    avgPickRound: 1.52,
    blindPickRate: 33.3,
    averageGameTime: "31:46",
    csPerMinute: 1,
    damagePerMinute: 108,
    goldPerMinute: 248,
    csDiffAt15: -1,
    goldDiffAt15: -121,
    xpDiffAt15: -67,
    soloqKrChallengerWinRate: 56.97,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "lulu", level: 2, phase: "lane" },
        { championId: "leona", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "janna", level: 2, phase: "all", note: "disengage care anulează combo-ul de engage" },
        { championId: "bard", level: 2, phase: "lane" },
        { championId: "rakan", level: 2, phase: "lane" },
        { championId: "renata-glasc", level: 2, phase: "lane" },
        { championId: "seraphine", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
