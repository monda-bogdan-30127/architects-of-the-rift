import { createChampion } from "./_helpers";

export const ezreal = createChampion({
  id: "ezreal",
  name: "Ezreal",
  image: "/champions/ezreal.png",
  roles: ["adc"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "karma", score: 5 },
    { championId: "bard", score: 4 },
    { championId: "yuumi", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "braum", score: 3 },
    { championId: "jayce", score: 3 },
    { championId: "thresh", score: 3 }
  ],

  offers: [
    { type: "poke", strength: 5 },
    { type: "siege", strength: 3 },
    { type: "scaling", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

  stats: {
    picks: 23,
    bans: 19,
    presence: 42,
    prioScore: 49,
    wins: 10,
    losses: 13,
    proWinRate: 43,
    kda: 3,
    avgBanTurn: 4.5,
    avgPickRound: 1.43,
    blindPickRate: 81.8,
    averageGameTime: "32:09",
    csPerMinute: 10,
    damagePerMinute: 821,
    goldPerMinute: 466,
    csDiffAt15: 1,
    goldDiffAt15: -68,
    xpDiffAt15: 16,
    soloqKrChallengerWinRate: 54.8,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "miss-fortune", level: 2, phase: "lane" },
        { championId: "ziggs", level: 2, phase: "lane" },
        { championId: "corki", level: 1, phase: "all" },
        { championId: "jhin", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "sivir", level: 2, phase: "late" },
        { championId: "draven", level: 2, phase: "lane" },
        { championId: "kalista", level: 2, phase: "lane" },
        { championId: "lucian", level: 2, phase: "lane" },
        { championId: "xayah", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
