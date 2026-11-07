import { createChampion } from "./_helpers";

export const darius = createChampion({
  id: "darius",
  name: "Darius",
  image: "/champions/darius.png",
  roles: ["top"],
  damageProfile: ["AD", "TRUE"],

  synergyWith: [
    { championId: "sejuani", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "maokai", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "nautilus", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "thresh", score: 3 },
  ],

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "frontline", strength: 2 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
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
    soloqKrChallengerWinRate: 59.86,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "camille", level: 2, phase: "lane" },
        { championId: "galio", level: 2, phase: "lane" },
        { championId: "garen", level: 2, phase: "lane" },
        { championId: "gragas", level: 2, phase: "lane" },
        { championId: "kayle", level: 2, phase: "lane" },
        { championId: "nasus", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
