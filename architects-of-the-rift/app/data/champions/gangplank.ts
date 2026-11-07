import { createChampion } from "./_helpers";

export const gangplank = createChampion({
  id: "gangplank",
  name: "Gangplank",
  image: "/champions/gangplank.png",
  roles: ["top"],
  damageProfile: ["AD"],

  offers: [
    { type: "waveclear", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "siege", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 2 },

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
    soloqKrChallengerWinRate: 57.35,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "yorick", level: 2, phase: "all", note: "butoaiele curăță ghoul-ii" },
        { championId: "jax", level: 2, phase: "lane" },
        { championId: "kled", level: 2, phase: "lane" },
        { championId: "shen", level: 2, phase: "lane" },
        { championId: "ornn", level: 2, phase: "late" },
        { championId: "quinn", level: 2, phase: "late" },
        { championId: "sion", level: 2, phase: "late" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 0,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 1.2,
        avgBanTurn: null,
        avgPickRound: 3,
        blindPickRate: 0,
        averageGameTime: "33:29",
        csPerMinute: 7.9,
        damagePerMinute: 693,
        goldPerMinute: 386,
        csDiffAt15: -37,
        goldDiffAt15: -944,
        xpDiffAt15: -614,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
