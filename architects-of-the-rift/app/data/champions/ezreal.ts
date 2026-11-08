import { createChampion } from "./_helpers";

export const ezreal = createChampion({
  id: "ezreal",
  name: "Ezreal",
  image: "/champions/ezreal.png",
  roles: ["adc"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "karma", score: 5 },
    { championId: "bard", score: 4 },
    { championId: "yuumi", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "braum", score: 3 },
    { championId: "jayce", score: 3 },
    { championId: "thresh", score: 3 }
  ],

  badSynergyWith: [
    { championId: "lulu", level: 4, note: "Ambii sunt defensivi: fără engage și fără win condition în teamfight" },
  ],

  offers: [
    { type: "poke", strength: 5 },
    { type: "siege", strength: 3 },
    { type: "scaling", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

  stats: {
    picks: 23,
    bans: 19,
    presence: 42,
    prioScore: 49,
    wins: 10,
    losses: 13,
    proWinRate: 43,
    kda: 3,
    avgBanTurn: 4.5,
    avgPickRound: 1.43,
    blindPickRate: 81.8,
    averageGameTime: "32:09",
    csPerMinute: 10,
    damagePerMinute: 821,
    goldPerMinute: 466,
    csDiffAt15: 1,
    goldDiffAt15: -68,
    xpDiffAt15: 16,
    soloqKrChallengerWinRate: 54.8,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "kogmaw", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 26,
        bans: null,
        presence: 46,
        prioScore: 48,
        wins: 11,
        losses: 15,
        proWinRate: 42,
        kda: 2.9,
        avgBanTurn: null,
        avgPickRound: 1.42,
        blindPickRate: 84,
        averageGameTime: "32:17",
        csPerMinute: 10.1,
        damagePerMinute: 817,
        goldPerMinute: 469,
        csDiffAt15: 2.2,
        goldDiffAt15: 36,
        xpDiffAt15: 102,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
