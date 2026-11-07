import { createChampion } from "./_helpers";

export const kayle = createChampion({
  id: "kayle",
  name: "Kayle",
  image: "/champions/kayle.png",
  roles: ["top"],
  damageProfile: ["AD", "AP", "TRUE"],

  synergyWith: [
    { championId: "ivern", score: 5 },
    { championId: "lulu", score: 5 },
    { championId: "yuumi", score: 5 },
    { championId: "karma", score: 4 },
    { championId: "milio", score: 4 },
    { championId: "sejuani", score: 4 },
    { championId: "maokai", score: 3 },
    { championId: "ornn", score: 3 },
  ],

  offers: [
    { type: "scaling", strength: 5 },
    { type: "sustainedDamage", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 3 },
    { type: "peel", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "engage", severity: 1 },
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
    soloqKrChallengerWinRate: 62.87,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ksante", level: 2, phase: "late" },
        { championId: "olaf", level: 2, phase: "late" },
        { championId: "ornn", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "late" },
        { championId: "sion", level: 2, phase: "late" },
        { championId: "zaahen", level: 2, phase: "late" },
      ],
      stats: null,
    },
  },
});
