import { createChampion } from "./_helpers";

export const aphelios = createChampion({
  id: "aphelios",
  name: "Aphelios",
  image: "/champions/aphelios.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "thresh", score: 4 },
    { championId: "lulu", score: 4 },
    { championId: "braum", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "milio", score: 3 },
    { championId: "renata-glasc", score: 3 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "scaling", strength: 5 },
    { type: "siege", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 3 },
    { type: "peel", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 5, clt: 3, con: 4 },

  stats: {
    picks: 1,
    bans: 2,
    presence: 3,
    prioScore: 4,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 9,
    avgBanTurn: 7.5,
    avgPickRound: 1,
    blindPickRate: 0,
    averageGameTime: "37:32",
    csPerMinute: 10.3,
    damagePerMinute: 672,
    goldPerMinute: 495,
    csDiffAt15: -24,
    goldDiffAt15: -471,
    xpDiffAt15: -462,
    soloqKrChallengerWinRate: 53.17,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "ezreal", level: 2, phase: "late" },
      ],
      weakVs: [
        { championId: "caitlyn", level: 2, phase: "lane" },
        { championId: "lucian", level: 2, phase: "lane" },
        { championId: "sivir", level: 2, phase: "lane" },
        { championId: "yunara", level: 1, phase: "all" },
        { championId: "zeri", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 2,
        bans: null,
        presence: 4,
        prioScore: 4,
        wins: 1,
        losses: 1,
        proWinRate: 50,
        kda: 1.8,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "35:04",
        csPerMinute: 9.6,
        damagePerMinute: 589,
        goldPerMinute: 461,
        csDiffAt15: -33.5,
        goldDiffAt15: -756,
        xpDiffAt15: -894,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
