import { createChampion } from "./_helpers";

export const missFortune = createChampion({
  id: "miss-fortune",
  name: "Miss Fortune",
  image: "/champions/miss-fortune.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "leona", score: 5 },
    { championId: "nautilus", score: 5 },
    { championId: "amumu", score: 5 },
    { championId: "rell", score: 4 },
    { championId: "alistar", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "malphite", score: 4 }
  ],

  offers: [
    { type: "scaling", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "earlyPrio", strength: 3 },
    { type: "siege", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 5,
    bans: 0,
    presence: 5,
    prioScore: 4,
    wins: 2,
    losses: 3,
    proWinRate: 40,
    kda: 3.2,
    avgBanTurn: null,
    avgPickRound: 2.2,
    blindPickRate: 20,
    averageGameTime: "34:06",
    csPerMinute: 10.1,
    damagePerMinute: 672,
    goldPerMinute: 496,
    csDiffAt15: -2.2,
    goldDiffAt15: 164,
    xpDiffAt15: 170,
    soloqKrChallengerWinRate: 55.26,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "corki", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "aphelios", level: 2, phase: "late" },
        { championId: "zeri", level: 2, phase: "late" },
        { championId: "caitlyn", level: 2, phase: "lane" },
        { championId: "kalista", level: 2, phase: "lane" },
        { championId: "varus", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
