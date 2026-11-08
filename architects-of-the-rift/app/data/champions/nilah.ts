import { createChampion } from "./_helpers";

export const nilah = createChampion({
  id: "nilah",
  name: "Nilah",
  image: "/champions/nilah.png",
  roles: ["adc"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "senna", score: 5 },
    { championId: "xin-zhao", score: 5 },
    { championId: "viktor", score: 5 },
    { championId: "jax", score: 4 },
    { championId: "alistar", score: 4 },
    { championId: "ahri", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "ksante", score: 3 },
  ],

  offers: [
    { type: "dive", strength: 4 },
    { type: "followUp", strength: 4 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 3 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

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
    soloqKrChallengerWinRate: 49.23,
  },

  roleData: {
    adc: {
      goodVs: [],
      stats: null,
    },
  },
});
