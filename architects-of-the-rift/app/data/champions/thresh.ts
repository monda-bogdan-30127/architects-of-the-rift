import { createChampion } from "./_helpers";

export const thresh = createChampion({
  id: "thresh",
  name: "Thresh",
  image: "/champions/thresh.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "draven", score: 5 },
    { championId: "jhin", score: 5 },
    { championId: "caitlyn", score: 4 },
    { championId: "lucian", score: 4 },
    { championId: "aphelios", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "varus", score: 3 },
    { championId: "tristana", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "peel", strength: 3 },
    { type: "reliableCC", strength: 4 },
    { type: "disengage", strength: 2 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 0,
    bans: 0,
    presence: 0,
    prioScore: 0,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: null,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 58.57,
  },

  roleData: {
    support: {
      goodVs: [],
      weakVs: [
        { championId: "lux", level: 2, phase: "lane" },
        { championId: "pyke", level: 2, phase: "lane" },
        { championId: "shen", level: 2, phase: "lane" },
        { championId: "rell", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
