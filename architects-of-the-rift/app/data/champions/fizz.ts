import { createChampion } from "./_helpers";

export const fizz = createChampion({
  id: "fizz",
  name: "Fizz",
  image: "/champions/fizz.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "backlineAccess", strength: 4 },
    { type: "pick", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
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
    soloqKrChallengerWinRate: 53.73,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "xerath", level: 2, phase: "all", note: "E îl ferește de skillshot-uri, all-in pe un artillery imobil" },
      ],
      stats: null,
    },
  },
});
