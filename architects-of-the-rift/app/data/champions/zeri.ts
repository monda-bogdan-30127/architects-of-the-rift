import { createChampion } from "./_helpers";

export const zeri = createChampion({
  id: "zeri",
  name: "Zeri",
  image: "/champions/zeri.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "milio", score: 4 },
    { championId: "renata-glasc", score: 4 },
    { championId: "nami", score: 4 },
    { championId: "rakan", score: 3 },
    { championId: "maokai", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "scaling", strength: 5 },
    { type: "poke", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 3 },
    { type: "peel", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 3,
    bans: 0,
    presence: 3,
    prioScore: 3,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 3.3,
    avgBanTurn: null,
    avgPickRound: 1.67,
    blindPickRate: 0,
    averageGameTime: "32:40",
    csPerMinute: 10.9,
    damagePerMinute: 726,
    goldPerMinute: 506,
    csDiffAt15: 3,
    goldDiffAt15: 305,
    xpDiffAt15: -219,
    soloqKrChallengerWinRate: 61.17,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "jhin", score: 3 },
        { championId: "ziggs", score: 2 },
      ],
      weakVs: [
        { championId: "caitlyn", score: 2 },
        { championId: "nilah", score: 2 },
        { championId: "senna", score: 2 },
        { championId: "seraphine", score: 2 },
        { championId: "xayah", score: 2 },
      ],
      mustWith: ["lulu", "yuumi"],
      stats: null,
    },
  },
});
