import { createChampion } from "./_helpers";

export const swain = createChampion({
  id: "swain",
  name: "Swain",
  image: "/champions/swain.png",
  roles: ["mid", "top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "amumu", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "rakan", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 3 },
    { type: "sustainedDamage", strength: 4 },
    { type: "zoneControl", strength: 3 }
  ],

  needs: [
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, con: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: null,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "26:12",
    csPerMinute: 9.4,
    damagePerMinute: 876,
    goldPerMinute: 393,
    csDiffAt15: -2,
    goldDiffAt15: 282,
    xpDiffAt15: -584,
    soloqKrChallengerWinRate: 60.61,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "galio", level: 2, phase: "late" },
        { championId: "sylas", level: 2, phase: "lane" },
        { championId: "taliyah", level: 2, phase: "lane" },
        { championId: "viktor", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "akali", level: 2, phase: "lane" },
        { championId: "azir", level: 2, phase: "lane" },
        { championId: "cassiopeia", level: 2, phase: "lane" },
        { championId: "ryze", level: 2, phase: "lane" },
        { championId: "syndra", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 1,
        wins: 1,
        losses: 0,
        proWinRate: 100,
        kda: null,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "26:12",
        csPerMinute: 9.4,
        damagePerMinute: 876,
        goldPerMinute: 393,
        csDiffAt15: -2,
        goldDiffAt15: 282,
        xpDiffAt15: -584,
        soloqKrChallengerWinRate: null,
      },
    },
    top: {
      goodVs: [
        { championId: "galio", level: 2, phase: "late" },
      ],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
