import { createChampion } from "./_helpers";

export const taric = createChampion({
  id: "taric",
  name: "Taric",
  image: "/champions/taric.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "lucian", score: 5 },
    { championId: "sivir", score: 5 },
    { championId: "tristana", score: 5 },
    { championId: "caitlyn", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "zeri", score: 4 },
    { championId: "khazix", score: 3 },
    { championId: "maokai", score: 3 },
  ],

  offers: [
    { type: "antiDive", strength: 5 },
    { type: "peel", strength: 4 },
    { type: "frontline", strength: 3 },
    { type: "followUp", strength: 2 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "pick", severity: 2 }
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 64.62,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "karma", level: 2, phase: "lane" },
        { championId: "lulu", level: 2, phase: "lane" },
        { championId: "tahm-kench", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "senna", level: 2, phase: "late" },
        { championId: "leona", level: 2, phase: "lane" },
        { championId: "rakan", level: 2, phase: "lane" },
        { championId: "thresh", level: 2, phase: "lane" },
        { championId: "yuumi", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
