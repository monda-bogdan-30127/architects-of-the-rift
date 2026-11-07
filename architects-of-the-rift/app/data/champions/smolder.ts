import { createChampion } from "./_helpers";

export const smolder = createChampion({
  id: "smolder",
  name: "Smolder",
  image: "/champions/smolder.png",
  roles: ["adc", "mid"],
  damageProfile: ["AD", "TRUE"],

  synergyWith: [
    { championId: "lulu", score: 5 },
    { championId: "yuumi", score: 5 },
    { championId: "milio", score: 4 },
    { championId: "renata-glasc", score: 4 },
    { championId: "nami", score: 4 },
    { championId: "karma", score: 3 },
    { championId: "maokai", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  offers: [
    { type: "scaling", strength: 5 },
    { type: "poke", strength: 3 },
    { type: "waveclear", strength: 4 },
    { type: "sustainedDamage", strength: 4 }
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

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

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
    soloqKrChallengerWinRate: 59.49,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "corki", score: 3 },
        { championId: "senna", score: 3 },
        { championId: "xayah", score: 3 },
        { championId: "zeri", score: 3 },
        { championId: "jinx", score: 1 },
      ],
      weakVs: [
        { championId: "ashe", score: 2 },
        { championId: "ezreal", score: 2 },
        { championId: "jhin", score: 2 },
        { championId: "kalista", score: 2 },
        { championId: "varus", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    mid: {
      goodVs: [],
      weakVs: [
        { championId: "leblanc", score: 2 },
        { championId: "zed", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
