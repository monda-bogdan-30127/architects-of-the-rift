import { createChampion } from "./_helpers";

export const yone = createChampion({
  id: "yone",
  name: "Yone",
  image: "/champions/yone.png",
  roles: ["mid", "top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "malphite", score: 5 },
    { championId: "wukong", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "neeko", score: 4 },
    { championId: "rumble", score: 3 },
    { championId: "rakan", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "amumu", score: 4 },
  ],

  offers: [
    { type: "splitpush", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "siege", severity: 1 }
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 6,
    presence: 10,
    prioScore: 9,
    wins: 0,
    losses: 4,
    proWinRate: 0,
    kda: 0.9,
    avgBanTurn: 7.3,
    avgPickRound: 3.5,
    blindPickRate: 50,
    averageGameTime: "28:52",
    csPerMinute: 8.9,
    damagePerMinute: 442,
    goldPerMinute: 373,
    csDiffAt15: -8.8,
    goldDiffAt15: -704,
    xpDiffAt15: -565,
    soloqKrChallengerWinRate: 54.63,
  },

  roleData: {
    mid: {
      goodVs: [],
      stats: {
        picks: 3,
        bans: null,
        presence: 10,
        prioScore: 9,
        wins: 0,
        losses: 3,
        proWinRate: 0,
        kda: 0.7,
        avgBanTurn: null,
        avgPickRound: 3.67,
        blindPickRate: 33.3,
        averageGameTime: "29:33",
        csPerMinute: 9,
        damagePerMinute: 343,
        goldPerMinute: 373,
        csDiffAt15: -17.7,
        goldDiffAt15: -930,
        xpDiffAt15: -878,
        soloqKrChallengerWinRate: null,
      },
    },
    top: {
      goodVs: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 8,
        prioScore: 8,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 1.5,
        avgBanTurn: null,
        avgPickRound: 3,
        blindPickRate: 100,
        averageGameTime: "26:51",
        csPerMinute: 8.8,
        damagePerMinute: 737,
        goldPerMinute: 370,
        csDiffAt15: 18,
        goldDiffAt15: -27,
        xpDiffAt15: 372,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
