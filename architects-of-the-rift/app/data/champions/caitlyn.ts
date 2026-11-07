import { createChampion } from "./_helpers";

export const caitlyn = createChampion({
  id: "caitlyn",
  name: "Caitlyn",
  image: "/champions/caitlyn.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "karma", score: 4 },
    { championId: "lux", score: 4 },
    { championId: "morgana", score: 3 },
    { championId: "renata-glasc", score: 3 },
    { championId: "milio", score: 3 },
    { championId: "nidalee", score: 3 },
    { championId: "jayce", score: 3 },
  ],

  offers: [
    { type: "siege", strength: 5 },
    { type: "poke", strength: 4 },
    { type: "earlyPrio", strength: 4 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "peel", priority: 2 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 3, con: 5 },

  stats: {
    picks: 8,
    bans: 12,
    presence: 20,
    prioScore: 22,
    wins: 2,
    losses: 6,
    proWinRate: 25,
    kda: 2.5,
    avgBanTurn: 5.4,
    avgPickRound: 1.88,
    blindPickRate: 12.5,
    averageGameTime: "35:21",
    csPerMinute: 11,
    damagePerMinute: 643,
    goldPerMinute: 491,
    csDiffAt15: 23.5,
    goldDiffAt15: 1247,
    xpDiffAt15: 734,
    soloqKrChallengerWinRate: 59.4,
  },

  roleData: {
    adc: {
      goodVs: [],
      weakVs: [
        { championId: "kaisa", level: 2, phase: "late" },
        { championId: "xayah", level: 2, phase: "late" },
        { championId: "draven", level: 2, phase: "lane" },
        { championId: "kalista", level: 2, phase: "lane" },
        { championId: "lucian", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
