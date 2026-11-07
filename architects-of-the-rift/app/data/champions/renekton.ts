import { createChampion } from "./_helpers";

export const renekton = createChampion({
  id: "renekton",
  name: "Renekton",
  image: "/champions/renekton.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "nidalee", score: 4 },
    { championId: "elise", score: 4 },
    { championId: "lee-sin", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "ahri", score: 3 },
    { championId: "akali", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "renata-glasc", score: 3 },
  ],

  offers: [
    { type: "earlyPrio", strength: 5 },
    { type: "engage", strength: 3 },
    { type: "burstDamage", strength: 3 },
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

  playerScaling: { mec: 3, tfg: 3, con: 4, iq: 2 },

  stats: {
    picks: 7,
    bans: 13,
    presence: 20,
    prioScore: 22,
    wins: 5,
    losses: 2,
    proWinRate: 71,
    kda: 3.2,
    avgBanTurn: 9.8,
    avgPickRound: 2.43,
    blindPickRate: 42.9,
    averageGameTime: "37:31",
    csPerMinute: 8.8,
    damagePerMinute: 480,
    goldPerMinute: 402,
    csDiffAt15: 6.1,
    goldDiffAt15: 309,
    xpDiffAt15: 1,
    soloqKrChallengerWinRate: 59.18,
  },

  roleData: {
    top: {
      goodVs: [],
      weakVs: [
        { championId: "camille", score: 3 },
        { championId: "ornn", score: 3 },
        { championId: "vayne", score: 3 },
        { championId: "gnar", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
