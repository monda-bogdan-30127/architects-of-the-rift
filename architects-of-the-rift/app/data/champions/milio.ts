import { createChampion } from "./_helpers";

export const milio = createChampion({
  id: "milio",
  name: "Milio",
  image: "/champions/milio.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "jinx", score: 5 },
    { championId: "zeri", score: 5 },
    { championId: "kogmaw", score: 4 },
    { championId: "twitch", score: 4 },
    { championId: "aphelios", score: 4 },
    { championId: "caitlyn", score: 3 },
    { championId: "tristana", score: 3 }
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 4 },
    { type: "disengage", strength: 4 },
    { type: "scaling", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 }
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 12,
    bans: 0,
    presence: 12,
    prioScore: 9,
    wins: 5,
    losses: 7,
    proWinRate: 42,
    kda: 6.4,
    avgBanTurn: null,
    avgPickRound: 2.25,
    blindPickRate: 45.5,
    averageGameTime: "32:16",
    csPerMinute: 1,
    damagePerMinute: 131,
    goldPerMinute: 261,
    csDiffAt15: -3,
    goldDiffAt15: 167,
    xpDiffAt15: 98,
    soloqKrChallengerWinRate: 53.13,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "leona", level: 2, phase: "all", note: "R curăță CC-ul și reface lupta" },
        { championId: "nautilus", level: 2, phase: "all", note: "R curăță CC-ul și reface lupta" },
      ],
      stats: {
        picks: 13,
        bans: null,
        presence: 13,
        prioScore: 8,
        wins: 6,
        losses: 7,
        proWinRate: 46,
        kda: 7,
        avgBanTurn: null,
        avgPickRound: 2.31,
        blindPickRate: 50,
        averageGameTime: "32:18",
        csPerMinute: 1,
        damagePerMinute: 131,
        goldPerMinute: 263,
        csDiffAt15: -3.5,
        goldDiffAt15: 166,
        xpDiffAt15: 70,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
