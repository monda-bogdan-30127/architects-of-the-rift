import { createChampion } from "./_helpers";

export const tahmKench = createChampion({
  id: "tahm-kench",
  name: "Tahm Kench",
  image: "/champions/tahm-kench.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "melee",

  synergyWith: [
    { championId: "senna", score: 5 },
    { championId: "varus", score: 5 },
    { championId: "ashe", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "miss-fortune", score: 4 },
    { championId: "sejuani", score: 4 },
    { championId: "twitch", score: 4 }
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 5 },
    { type: "disengage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 8.5,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "47:29",
    csPerMinute: 0.8,
    damagePerMinute: 215,
    goldPerMinute: 267,
    csDiffAt15: 4,
    goldDiffAt15: 522,
    xpDiffAt15: 1522,
    soloqKrChallengerWinRate: 50.5,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "blitzcrank", level: 2, phase: "all", note: "devour salvează aliatul prins de hook" },
        { championId: "pyke", level: 2, phase: "all", note: "devour salvează aliatul de execute" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 1,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 8.5,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "47:29",
        csPerMinute: 0.8,
        damagePerMinute: 215,
        goldPerMinute: 267,
        csDiffAt15: 4,
        goldDiffAt15: 522,
        xpDiffAt15: 1522,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
