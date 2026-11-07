import { createChampion } from "./_helpers";

export const velkoz = createChampion({
  id: "velkoz",
  name: "Vel'Koz",
  image: "/champions/vel'koz.png",
  roles: ["mid", "support"],
  damageProfile: ["AP", "TRUE"],

  offers: [
    { type: "poke", strength: 5 },
    { type: "waveclear", strength: 4 },
    { type: "burstDamage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 4,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: null,
    averageGameTime: "35:10",
    csPerMinute: 0.9,
    damagePerMinute: 374,
    goldPerMinute: 267,
    csDiffAt15: -8,
    goldDiffAt15: -406,
    xpDiffAt15: -1221,
    soloqKrChallengerWinRate: 59.45,
  },

  roleData: {
    mid: {
      goodVs: [],
      stats: null,
    },
    support: {
      goodVs: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 1,
        wins: 1,
        losses: 0,
        proWinRate: 100,
        kda: 4,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: null,
        averageGameTime: "35:10",
        csPerMinute: 0.9,
        damagePerMinute: 374,
        goldPerMinute: 267,
        csDiffAt15: -8,
        goldDiffAt15: -406,
        xpDiffAt15: -1221,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
