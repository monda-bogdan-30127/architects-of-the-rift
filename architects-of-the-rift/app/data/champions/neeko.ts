import { createChampion } from "./_helpers";

export const neeko = createChampion({
  id: "neeko",
  name: "Neeko",
  image: "/champions/neeko.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "caitlyn", score: 3 },
    { championId: "kaisa", score: 5 },
    { championId: "jhin", score: 4 },
    { championId: "kalista", score: 3 },
    { championId: "miss-fortune", score: 4 },
    { championId: "orianna", score: 3 },
    { championId: "yunara", score: 2 }
  ],

  offers: [
    { type: "engage", strength: 4 },
    { type: "reliableCC", strength: 5 },
    { type: "followUp", strength: 4 },
    { type: "burstDamage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 4, con: 3, iq: 4 },

  stats: {
    picks: 2,
    bans: 1,
    presence: 3,
    prioScore: 4,
    wins: 0,
    losses: 2,
    proWinRate: 0,
    kda: 2,
    avgBanTurn: 7,
    avgPickRound: 1,
    blindPickRate: 0,
    averageGameTime: "37:24",
    csPerMinute: 1.4,
    damagePerMinute: 215,
    goldPerMinute: 247,
    csDiffAt15: -1.5,
    goldDiffAt15: 31,
    xpDiffAt15: -304,
    soloqKrChallengerWinRate: 56.7,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "soraka", level: 2, phase: "lane" },
        { championId: "yuumi", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 3,
        bans: null,
        presence: 4,
        prioScore: 4,
        wins: 1,
        losses: 2,
        proWinRate: 33,
        kda: 5.5,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "36:41",
        csPerMinute: 1.4,
        damagePerMinute: 273,
        goldPerMinute: 266,
        csDiffAt15: 0,
        goldDiffAt15: 169,
        xpDiffAt15: 112,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
