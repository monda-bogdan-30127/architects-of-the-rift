import { createChampion } from "./_helpers";

export const yuumi = createChampion({
  id: "yuumi",
  name: "Yuumi",
  image: "/champions/yuumi.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "zeri", score: 5 },
    { championId: "sivir", score: 5 },
    { championId: "kogmaw", score: 4 },
    { championId: "vayne", score: 4 },
    { championId: "twitch", score: 4 },
    { championId: "lucian", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "ezreal", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 4 },
    { type: "disengage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 3,
    bans: 0,
    presence: 3,
    prioScore: 3,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 11.7,
    avgBanTurn: null,
    avgPickRound: 1.67,
    blindPickRate: 0,
    averageGameTime: "32:40",
    csPerMinute: 0.4,
    damagePerMinute: 311,
    goldPerMinute: 268,
    csDiffAt15: -10,
    goldDiffAt15: 95,
    xpDiffAt15: 446,
    soloqKrChallengerWinRate: 44.85,
  },

  roleData: {
    support: {
      goodVs: [],
      stats: {
        picks: 4,
        bans: null,
        presence: 4,
        prioScore: 3,
        wins: 2,
        losses: 2,
        proWinRate: 50,
        kda: 10.3,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "33:41",
        csPerMinute: 0.5,
        damagePerMinute: 302,
        goldPerMinute: 260,
        csDiffAt15: -9.2,
        goldDiffAt15: 168,
        xpDiffAt15: 480,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
