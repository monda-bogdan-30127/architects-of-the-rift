import { createChampion } from "./_helpers";

export const vex = createChampion({
  id: "vex",
  name: "Vex",
  image: "/champions/vex.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "vi", score: 5 },
    { championId: "sejuani", score: 4 },
    { championId: "nocturne", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "pick", strength: 3 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 1 }
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 63.5,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "akali", level: 2, phase: "all", note: "pasivul pedepsește fiecare dash" },
        { championId: "ekko", level: 2, phase: "all", note: "pasivul pedepsește dash-urile" },
        { championId: "kassadin", level: 2, phase: "all", note: "pasivul pedepsește R-ul (blink) lui Kassadin" },
        { championId: "leblanc", level: 2, phase: "all", note: "pasivul pedepsește dash-urile din W" },
        { championId: "yasuo", level: 2, phase: "all", note: "pasivul pedepsește dash-urile" },
        { championId: "yone", level: 2, phase: "all", note: "pasivul pedepsește dash-urile" },
      ],
      stats: null,
    },
  },
});
