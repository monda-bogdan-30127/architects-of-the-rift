import { createChampion } from "./_helpers";

export const udyr = createChampion({
  id: "udyr",
  name: "Udyr",
  image: "/champions/udyr.png",
  roles: ["top", "jungle"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "seraphine", score: 5 },
    { championId: "twisted-fate", score: 5 },
    { championId: "tahm-kench", score: 5 },
    { championId: "gragas", score: 4 },
    { championId: "jayce", score: 4 },
    { championId: "alistar", score: 4 },
    { championId: "thresh", score: 4 },
    { championId: "kaisa", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 3 },
    { type: "earlyPrio", strength: 4 },
    { type: "objectiveControl", strength: 3 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "engage", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

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
    soloqKrChallengerWinRate: 56.81,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "aatrox", score: 2 },
        { championId: "jax", score: 1 },
        { championId: "volibear", score: 1 },
      ],
      weakVs: [
        { championId: "gnar", score: 4, note: "kite contra lui Udyr fără gap-closer" },
        { championId: "darius", score: 2 },
        { championId: "ksante", score: 2 },
        { championId: "rumble", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [
        { championId: "aatrox", score: 2 },
        { championId: "graves", score: 2 },
        { championId: "pantheon", score: 2 },
        { championId: "volibear", score: 1 },
      ],
      weakVs: [
        { championId: "jarvan-iv", score: 2 },
        { championId: "wukong", score: 2 },
        { championId: "xin-zhao", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
