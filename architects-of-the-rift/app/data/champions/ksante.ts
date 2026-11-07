import { createChampion } from "./_helpers";

export const ksante = createChampion({
  id: "ksante",
  name: "K'Sante",
  image: "/champions/k'sante.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "milio", score: 4 },
    { championId: "zeri", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "sejuani", score: 3 },
    { championId: "vi", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "peel", strength: 3 },
    { type: "reliableCC", strength: 3 },
    { type: "sideLanePressure", strength: 2 }
  ],

  needs: [
    { type: "sustainedDamage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "pick", severity: 2 }
  ],

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 2 },

  stats: {
    picks: 20,
    bans: 16,
    presence: 36,
    prioScore: 38,
    wins: 7,
    losses: 13,
    proWinRate: 35,
    kda: 1.8,
    avgBanTurn: 6.7,
    avgPickRound: 2,
    blindPickRate: 35,
    averageGameTime: "31:37",
    csPerMinute: 8,
    damagePerMinute: 381,
    goldPerMinute: 354,
    csDiffAt15: 0.9,
    goldDiffAt15: -14,
    xpDiffAt15: 43,
    soloqKrChallengerWinRate: 51,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "jayce", level: 2, phase: "late" },
        { championId: "aurora", level: 1, phase: "all" },
        { championId: "jax", level: 1, phase: "all" },
        { championId: "sion", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "vayne", level: 2, phase: "all", note: "true damage și kite contra tank-ului" },
        { championId: "yorick", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
        { championId: "ambessa", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
