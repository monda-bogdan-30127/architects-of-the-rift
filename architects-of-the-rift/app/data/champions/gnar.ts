import { createChampion } from "./_helpers";

export const gnar = createChampion({
  id: "gnar",
  name: "Gnar",
  image: "/champions/gnar.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "lee-sin", score: 3 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "ambessa", score: 2 },
    { championId: "xin-zhao", score: 2 },
    { championId: "rell", score: 3 },
    { championId: "anivia", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "nocturne", score: 4 }
  ],

  offers: [
    { type: "sideLanePressure", strength: 3 },
    { type: "poke", strength: 3 },
    { type: "disengage", strength: 3 },
    { type: "engage", strength: 3 },
    { type: "reliableCC", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 1 }
  ],

  playerScaling: { mec: 4, tfg: 4, con: 3, iq: 2 },

  stats: {
    picks: 10,
    bans: 7,
    presence: 17,
    prioScore: 19,
    wins: 7,
    losses: 3,
    proWinRate: 70,
    kda: 3.4,
    avgBanTurn: 8.3,
    avgPickRound: 1.5,
    blindPickRate: 50,
    averageGameTime: "36:17",
    csPerMinute: 8.8,
    damagePerMinute: 476,
    goldPerMinute: 397,
    csDiffAt15: 4.8,
    goldDiffAt15: 187,
    xpDiffAt15: 125,
    soloqKrChallengerWinRate: 56.48,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ksante", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "jax", level: 2, phase: "late" },
        { championId: "vayne", level: 2, phase: "late" },
        { championId: "jayce", level: 2, phase: "lane" },
        { championId: "kennen", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
