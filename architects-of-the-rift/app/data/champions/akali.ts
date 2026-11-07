import { createChampion } from "./_helpers";

export const akali = createChampion({
  id: "akali",
  name: "Akali",
  image: "/champions/akali.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "sejuani", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "zaahen", score: 3 },
    { championId: "samira", score: 3 },
    { championId: "vi", score: 3 },
  ],

  offers: [
    { type: "backlineAccess", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 3, clt: 3, iq: 4 },

  stats: {
    picks: 12,
    bans: 27,
    presence: 39,
    prioScore: 48,
    wins: 3,
    losses: 9,
    proWinRate: 25,
    kda: 1.9,
    avgBanTurn: 5.9,
    avgPickRound: 1.33,
    blindPickRate: 36.4,
    averageGameTime: "34:59",
    csPerMinute: 8.4,
    damagePerMinute: 504,
    goldPerMinute: 383,
    csDiffAt15: -6.1,
    goldDiffAt15: -260,
    xpDiffAt15: -27,
    soloqKrChallengerWinRate: 49.5,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurora", score: 2 },
      ],
      weakVs: [
        { championId: "lissandra", score: 4, note: "ult point-click și W care o prind în shroud" },
        { championId: "ahri", score: 2 },
        { championId: "annie", score: 2 },
        { championId: "twisted-fate", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
