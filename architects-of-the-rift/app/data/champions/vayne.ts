import { createChampion } from "./_helpers";

export const vayne = createChampion({
  id: "vayne",
  name: "Vayne",
  image: "/champions/vayne.png",
  roles: ["adc", "top"],
  damageProfile: ["AD", "TRUE"],
  attackType: "ranged",

  synergyWith: [
    { championId: "lulu", score: 5 },
    { championId: "yuumi", score: 5 },
    { championId: "milio", score: 5 },
    { championId: "janna", score: 4 },
    { championId: "braum", score: 4 },
    { championId: "taric", score: 4 },
    { championId: "renata-glasc", score: 3 },
    { championId: "karma", score: 3 },
  ],

  badSynergyWith: [
    { championId: "pyke", level: 4, note: "Pyke roams; Vayne needs farm and protection in lane" },
  ],

  offers: [
    { type: "sustainedDamage", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 3 },
    { type: "peel", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 1,
    bans: 9,
    presence: 10,
    prioScore: 12,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 1,
    avgBanTurn: 8.2,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "47:09",
    csPerMinute: 7.7,
    damagePerMinute: 666,
    goldPerMinute: 346,
    csDiffAt15: -5,
    goldDiffAt15: 405,
    xpDiffAt15: -844,
    soloqKrChallengerWinRate: 57.79,
  },

  roleData: {
    adc: {
      goodVs: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "chogath", level: 2, phase: "all", note: "True damage and kiting vs the tank" },
        { championId: "dr-mundo", level: 2, phase: "all", note: "%HP true damage vs Mundo" },
        { championId: "illaoi", level: 2, phase: "all", note: "Kites outside the tentacles" },
        { championId: "ksante", level: 2, phase: "all", note: "True damage and kiting vs the tank" },
        { championId: "mordekaiser", level: 2, phase: "all", note: "Kites Mordekaiser, who has no gap closer" },
        { championId: "ornn", level: 2, phase: "all", note: "True damage and kiting vs the tank" },
        { championId: "sion", level: 2, phase: "all", note: "True damage and kiting vs the tank" },
        { championId: "zac", level: 2, phase: "all", note: "True damage and kiting vs the tank" },
        { championId: "darius", level: 2, phase: "late" },
        { championId: "garen", level: 2, phase: "late" },
        { championId: "gnar", level: 2, phase: "late" },
        { championId: "olaf", level: 2, phase: "late" },
        { championId: "urgot", level: 2, phase: "late" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 11,
        prioScore: 12,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 1,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "47:09",
        csPerMinute: 7.7,
        damagePerMinute: 666,
        goldPerMinute: 346,
        csDiffAt15: -5,
        goldDiffAt15: 405,
        xpDiffAt15: -844,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
