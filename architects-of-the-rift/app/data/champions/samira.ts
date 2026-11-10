import { createChampion } from "./_helpers";

export const samira = createChampion({
  id: "samira",
  name: "Samira",
  image: "/champions/samira.png",
  roles: ["adc"],
  damageProfile: ["AD"],
  attackType: "ranged",

  synergyWith: [
    { championId: "alistar", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "rell", score: 4 }
  ],

  offers: [
    { type: "dive", strength: 4 },
    { type: "followUp", strength: 4 },
    { type: "burstDamage", strength: 3 },
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
    soloqKrChallengerWinRate: 56.83,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "jhin", level: 2, phase: "all", note: "Dive on an immobile carry" },
        { championId: "jinx", level: 2, phase: "all", note: "Dive on an immobile carry" },
      ],
      stats: null,
    },
  },
});
