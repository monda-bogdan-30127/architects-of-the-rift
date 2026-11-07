import { createChampion } from "./_helpers";

export const gragas = createChampion({
  id: "gragas",
  name: "Gragas",
  image: "/champions/gragas.png",
  roles: ["top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "yasuo", score: 5 },
    { championId: "orianna", score: 5 },
    { championId: "diana", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "miss-fortune", score: 3 },
    { championId: "samira", score: 3 },
    { championId: "kaisa", score: 3 },
  ],

  offers: [
    { type: "disengage", strength: 5 },
    { type: "engage", strength: 3 },
    { type: "burstDamage", strength: 3 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 }
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 57.92,
  },

  roleData: {
    top: {
      goodVs: [],
      stats: null,
    },
  },
});
