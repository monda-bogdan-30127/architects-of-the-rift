import { createChampion } from "./_helpers";

export const braum = createChampion({
  id: "braum",
  name: "Braum",
  image: "/champions/braum.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "lucian", score: 5 },
    { championId: "aphelios", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "zeri", score: 3 },
    { championId: "ashe", score: 3 },
    { championId: "azir", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 5 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 }
  ],

  playerScaling: { mac: 4, tfg: 4, con: 5, iq: 4 },

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
    soloqKrChallengerWinRate: 54.78,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "poppy", level: 2, phase: "lane" },
        { championId: "soraka", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "alistar", level: 2, phase: "lane" },
        { championId: "bard", level: 2, phase: "lane" },
        { championId: "nami", level: 2, phase: "lane" },
        { championId: "rakan", level: 2, phase: "lane" },
        { championId: "rell", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
