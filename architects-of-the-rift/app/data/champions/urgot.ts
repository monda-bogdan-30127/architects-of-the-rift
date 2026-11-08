import { createChampion } from "./_helpers";

export const urgot = createChampion({
  id: "urgot",
  name: "Urgot",
  image: "/champions/urgot.png",
  roles: ["top"],
  damageProfile: ["AD"],
  attackType: "ranged",

  synergyWith: [
    { championId: "skarner", score: 5 },
    { championId: "sejuani", score: 5 },
    { championId: "sylas", score: 4 },
    { championId: "cassiopeia", score: 4 },
    { championId: "sivir", score: 4 },
    { championId: "varus", score: 3 },
    { championId: "thresh", score: 3 },
    { championId: "rakan", score: 3 },
  ],

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "siege", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

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
    soloqKrChallengerWinRate: 57.89,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "gangplank", level: 2, phase: "lane" },
        { championId: "ksante", level: 1, phase: "all" },
      ],
      stats: null,
    },
  },
});
