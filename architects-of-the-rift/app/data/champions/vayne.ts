import { createChampion } from "./_helpers";

export const vayne = createChampion({
  id: "vayne",
  name: "Vayne",
  image: "/champions/vayne.png",
  roles: ["adc", "top"],
  damageProfile: ["AD", "TRUE"],

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
      goodVs: [
        { championId: "sivir", score: 3 },
        { championId: "kogmaw", score: 1 },
      ],
      weakVs: [
        { championId: "ezreal", score: 2 },
        { championId: "kalista", score: 2 },
        { championId: "lucian", score: 2 },
        { championId: "samira", score: 2 },
        { championId: "jinx", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
