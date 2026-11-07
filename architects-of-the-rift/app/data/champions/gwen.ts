import { createChampion } from "./_helpers";

export const gwen = createChampion({
  id: "gwen",
  name: "Gwen",
  image: "/champions/gwen.png",
  roles: ["top"],
  damageProfile: ["AP", "TRUE"],

  synergyWith: [
    { championId: "sejuani", score: 4 },
    { championId: "maokai", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "yone", score: 3 },
    { championId: "pantheon", score: 3 },
  ],

  offers: [
    { type: "splitpush", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 4 }
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

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 3 },

  stats: {
    picks: 1,
    bans: 2,
    presence: 3,
    prioScore: 3,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: null,
    avgBanTurn: 9.5,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "25:43",
    csPerMinute: 10.4,
    damagePerMinute: 691,
    goldPerMinute: 487,
    csDiffAt15: 29,
    goldDiffAt15: 1332,
    xpDiffAt15: 469,
    soloqKrChallengerWinRate: 54.82,
  },

  roleData: {
    top: {
      goodVs: [],
      weakVs: [
        { championId: "aurora", level: 2, phase: "lane" },
        { championId: "jayce", level: 2, phase: "lane" },
        { championId: "zaahen", level: 2, phase: "lane" },
        { championId: "jax", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
