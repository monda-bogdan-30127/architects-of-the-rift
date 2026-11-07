import { createChampion } from "./_helpers";

export const kennen = createChampion({
  id: "kennen",
  name: "Kennen",
  image: "/champions/kennen.png",
  roles: ["top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "amumu", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "rakan", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "galio", score: 3 },
    { championId: "yone", score: 3 },
    { championId: "orianna", score: 3 },
  ],

  offers: [
    { type: "sideLanePressure", strength: 2 },
    { type: "burstDamage", strength: 3 },
    { type: "earlyPrio", strength: 1 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 }
  ],

  playerScaling: { mec: 4, tfg: 5, clt: 3, con: 3 },

  stats: {
    picks: 2,
    bans: 0,
    presence: 2,
    prioScore: 1,
    wins: 2,
    losses: 0,
    proWinRate: 100,
    kda: 5.3,
    avgBanTurn: null,
    avgPickRound: 2.5,
    blindPickRate: 50,
    averageGameTime: "36:48",
    csPerMinute: 10.6,
    damagePerMinute: 929,
    goldPerMinute: 491,
    csDiffAt15: 21,
    goldDiffAt15: 946,
    xpDiffAt15: 958,
    soloqKrChallengerWinRate: 55.84,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "malphite", score: 4, note: "AP la distanță, armura nu ajută" },
        { championId: "ksante", score: 2 },
      ],
      weakVs: [
        { championId: "galio", score: 5, note: "pasivul de MR al lui W anulează burst-ul AP" },
        { championId: "ornn", score: 3 },
        { championId: "camille", score: 2 },
        { championId: "gwen", score: 2 },
        { championId: "rumble", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
