import { createChampion } from "./_helpers";

export const akshan = createChampion({
  id: "akshan",
  name: "Akshan",
  image: "/champions/akshan.png",
  roles: ["mid", "top"],
  damageProfile: ["AD"],

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "burstDamage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
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
    soloqKrChallengerWinRate: 59.17,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "velkoz", level: 2, phase: "lane" },
        { championId: "xerath", level: 2, phase: "lane" },
      ],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "ornn", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
