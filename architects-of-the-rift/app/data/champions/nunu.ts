import { createChampion } from "./_helpers";

export const nunu = createChampion({
  id: "nunu",
  name: "Nunu",
  image: "/champions/nunu.png",
  roles: ["jungle"],
  damageProfile: ["AP"],
  attackType: "melee",

  synergyWith: [
    { championId: "yasuo", score: 5 },
    { championId: "yone", score: 5 },
    { championId: "syndra", score: 4 },
    { championId: "orianna", score: 4 },
    { championId: "veigar", score: 4 },
    { championId: "miss-fortune", score: 3 },
    { championId: "samira", score: 3 },
    { championId: "kennen", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 3 },
    { type: "objectiveControl", strength: 4 },
    { type: "frontline", strength: 3 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "earlyPrio", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 54.9,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
