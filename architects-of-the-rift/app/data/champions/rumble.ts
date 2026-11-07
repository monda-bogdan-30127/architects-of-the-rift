import { createChampion } from "./_helpers";

export const rumble = createChampion({
  id: "rumble",
  name: "Rumble",
  image: "/champions/rumble.png",
  roles: ["top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 4 },
    { championId: "orianna", score: 4 },
    { championId: "sejuani", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "neeko", score: 3 },
    { championId: "alistar", score: 3 },
    { championId: "wukong", score: 3 },
  ],

  offers: [
    { type: "zoneControl", strength: 5 },
    { type: "waveclear", strength: 3 },
    { type: "burstDamage", strength: 3 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "reliableCC", priority: 1 },
    { type: "frontline", priority: 1 },
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mec: 3, tfg: 5, con: 3, iq: 4 },

  stats: {
    picks: 22,
    bans: 19,
    presence: 41,
    prioScore: 48,
    wins: 6,
    losses: 16,
    proWinRate: 27,
    kda: 2.4,
    avgBanTurn: 6.1,
    avgPickRound: 1.41,
    blindPickRate: 95.5,
    averageGameTime: "32:40",
    csPerMinute: 8.1,
    damagePerMinute: 604,
    goldPerMinute: 361,
    csDiffAt15: -0.6,
    goldDiffAt15: 119,
    xpDiffAt15: 208,
    soloqKrChallengerWinRate: 60,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "yorick", score: 4, note: "AoE care curăță ghoul-ii și Maiden-ul" },
        { championId: "ornn", score: 2 },
      ],
      weakVs: [
        { championId: "gwen", score: 3 },
        { championId: "aurora", score: 2 },
        { championId: "gnar", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
