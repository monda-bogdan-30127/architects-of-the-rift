import { createChampion } from "./_helpers";

export const anivia = createChampion({
  id: "anivia",
  name: "Anivia",
  image: "/champions/anivia.png",
  roles: ["mid", "support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "poppy", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "vi", score: 2 },
    { championId: "nocturne", score: 2 },
    { championId: "ezreal", score: 2 },
    { championId: "jhin", score: 2 },
    { championId: "caitlyn", score: 3 }
  ],

  offers: [
    { type: "waveclear", strength: 5 },
    { type: "zoneControl", strength: 5 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 6,
    bans: 4,
    presence: 10,
    prioScore: 11,
    wins: 1,
    losses: 5,
    proWinRate: 17,
    kda: 1.5,
    avgBanTurn: 6.8,
    avgPickRound: 1.5,
    blindPickRate: 50,
    averageGameTime: "34:34",
    csPerMinute: 8.5,
    damagePerMinute: 499,
    goldPerMinute: 362,
    csDiffAt15: 1,
    goldDiffAt15: -226,
    xpDiffAt15: -100,
    soloqKrChallengerWinRate: 62.77,
  },

  roleData: {
    mid: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 8,
        bans: null,
        presence: 12,
        prioScore: 11,
        wins: 2,
        losses: 6,
        proWinRate: 25,
        kda: 2,
        avgBanTurn: null,
        avgPickRound: 1.88,
        blindPickRate: 62.5,
        averageGameTime: "34:42",
        csPerMinute: 8.7,
        damagePerMinute: 499,
        goldPerMinute: 371,
        csDiffAt15: 1,
        goldDiffAt15: -116,
        xpDiffAt15: -93,
        soloqKrChallengerWinRate: null,
      },
    },
    support: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
