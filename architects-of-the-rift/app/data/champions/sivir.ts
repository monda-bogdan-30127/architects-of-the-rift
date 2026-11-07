import { createChampion } from "./_helpers";

export const sivir = createChampion({
  id: "sivir",
  name: "Sivir",
  image: "/champions/sivir.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "xin-zhao", score: 4 },
    { championId: "lulu", score: 4 },
    { championId: "karma", score: 4 },
    { championId: "renata-glasc", score: 3 },
    { championId: "bard", score: 3 },
    { championId: "nami", score: 3 },
  ],

  offers: [
    { type: "waveclear", strength: 5 },
    { type: "siege", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "scaling", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 3 },

  stats: {
    picks: 3,
    bans: 3,
    presence: 6,
    prioScore: 5,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 4,
    avgBanTurn: 7.7,
    avgPickRound: 3,
    blindPickRate: 0,
    averageGameTime: "29:29",
    csPerMinute: 10.2,
    damagePerMinute: 839,
    goldPerMinute: 504,
    csDiffAt15: -10.7,
    goldDiffAt15: -373,
    xpDiffAt15: -241,
    soloqKrChallengerWinRate: 54.26,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "ashe", level: 2, phase: "late" },
        { championId: "jhin", level: 2, phase: "late" },
        { championId: "zeri", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "yunara", level: 2, phase: "late" },
        { championId: "caitlyn", level: 2, phase: "lane" },
        { championId: "lucian", level: 2, phase: "lane" },
        { championId: "tristana", level: 2, phase: "lane" },
        { championId: "kaisa", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
