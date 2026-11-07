import { createChampion } from "./_helpers";

export const soraka = createChampion({
  id: "soraka",
  name: "Soraka",
  image: "/champions/soraka.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jinx", score: 5 },
    { championId: "kogmaw", score: 5 },
    { championId: "vayne", score: 5 },
    { championId: "aphelios", score: 4 },
    { championId: "zeri", score: 4 },
    { championId: "yunara", score: 4 },
    { championId: "varus", score: 3 },
    { championId: "ezreal", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 4 },
    { type: "disengage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "siege", severity: 2 },
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
    soloqKrChallengerWinRate: 59.45,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "leona", level: 2, phase: "lane" },
        { championId: "shen", level: 2, phase: "lane" },
        { championId: "bard", level: 1, phase: "all" },
        { championId: "janna", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "karma", level: 2, phase: "lane" },
        { championId: "nami", level: 2, phase: "lane" },
        { championId: "rakan", level: 2, phase: "lane" },
        { championId: "renata-glasc", level: 2, phase: "lane" },
        { championId: "lulu", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
