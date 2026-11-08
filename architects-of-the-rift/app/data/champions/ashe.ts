import { createChampion } from "./_helpers";

export const ashe = createChampion({
  id: "ashe",
  name: "Ashe",
  image: "/champions/ashe.png",
  roles: ["adc"],
  damageProfile: ["AD"],
  attackType: "ranged",

  synergyWith: [
    { championId: "seraphine", score: 5 },
    { championId: "azir", score: 3 },
    { championId: "braum", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "jax", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "sejuani", score: 3 },
    { championId: "bard", score: 2 },
    { championId: "karma", score: 2 },
    { championId: "lulu", score: 2 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "poke", strength: 3 },
    { type: "engage", strength: 2 },
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
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

  stats: {
    picks: 11,
    bans: 3,
    presence: 14,
    prioScore: 15,
    wins: 7,
    losses: 4,
    proWinRate: 64,
    kda: 3.5,
    avgBanTurn: 6,
    avgPickRound: 1.55,
    blindPickRate: 72.7,
    averageGameTime: "33:21",
    csPerMinute: 10,
    damagePerMinute: 582,
    goldPerMinute: 479,
    csDiffAt15: 3,
    goldDiffAt15: 14,
    xpDiffAt15: -205,
    soloqKrChallengerWinRate: 58.82,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "samira", level: 2, phase: "all", note: "slow constant și R opresc dive-ul Samirei" },
        { championId: "kaisa", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 13,
        bans: null,
        presence: 16,
        prioScore: 14,
        wins: 9,
        losses: 4,
        proWinRate: 69,
        kda: 4,
        avgBanTurn: null,
        avgPickRound: 1.69,
        blindPickRate: 76.9,
        averageGameTime: "33:05",
        csPerMinute: 10,
        damagePerMinute: 578,
        goldPerMinute: 492,
        csDiffAt15: 1.2,
        goldDiffAt15: 138,
        xpDiffAt15: -161,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
