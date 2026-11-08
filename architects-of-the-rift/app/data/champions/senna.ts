import { createChampion } from "./_helpers";

export const senna = createChampion({
  id: "senna",
  name: "Senna",
  image: "/champions/senna.png",
  roles: ["support", "adc"],
  damageProfile: ["AD"],
  attackType: "ranged",

  synergyWith: [
    { championId: "nautilus", score: 5 },
    { championId: "taric", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "tahm-kench", score: 4 },
    { championId: "maokai", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "xin-zhao", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  offers: [
    { type: "poke", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "siege", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 56.57,
  },

  roleData: {
    support: {
      goodVs: [],
      stats: null,
    },
    adc: {
      goodVs: [
        { championId: "kalista", level: 2, phase: "late" },
      ],
      stats: null,
    },
  },
});
