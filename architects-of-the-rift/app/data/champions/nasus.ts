import { createChampion } from "./_helpers";

export const nasus = createChampion({
  id: "nasus",
  name: "Nasus",
  image: "/champions/nasus.png",
  roles: ["top", "jungle"],
  damageProfile: ["AD"],

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "earlyPrio", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "disengage", severity: 2 }
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 1.3,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "27:24",
    csPerMinute: 6.9,
    damagePerMinute: 238,
    goldPerMinute: 327,
    csDiffAt15: -25,
    goldDiffAt15: -1215,
    xpDiffAt15: -1766,
    soloqKrChallengerWinRate: 51.22,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "chogath", level: 2, phase: "late" },
      ],
      stats: null,
    },
    jungle: {
      goodVs: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 1,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 1.3,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "27:24",
        csPerMinute: 6.9,
        damagePerMinute: 238,
        goldPerMinute: 327,
        csDiffAt15: -25,
        goldDiffAt15: -1215,
        xpDiffAt15: -1766,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
