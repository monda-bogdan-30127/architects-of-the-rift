import { createChampion } from "./_helpers";

export const jayce = createChampion({
  id: "jayce",
  name: "Jayce",
  image: "/champions/jayce.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "nidalee", score: 4 },
    { championId: "caitlyn", score: 3 },
    { championId: "lee-sin", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "karma", score: 3 },
    { championId: "maokai", score: 4 },
  ],

  offers: [
    { type: "poke", strength: 5 },
    { type: "siege", strength: 4 },
    { type: "earlyPrio", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 3, con: 3, iq: 3 },

  stats: {
    picks: 13,
    bans: 25,
    presence: 38,
    prioScore: 45,
    wins: 8,
    losses: 5,
    proWinRate: 62,
    kda: 3.4,
    avgBanTurn: 4.5,
    avgPickRound: 1.69,
    blindPickRate: 83.3,
    averageGameTime: "32:07",
    csPerMinute: 9.5,
    damagePerMinute: 777,
    goldPerMinute: 446,
    csDiffAt15: 12.7,
    goldDiffAt15: 562,
    xpDiffAt15: 326,
    soloqKrChallengerWinRate: 56.92,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ambessa", score: 2 },
        { championId: "kennen", score: 2 },
      ],
      weakVs: [
        { championId: "aatrox", score: 3 },
        { championId: "yorick", score: 3 },
        { championId: "gragas", score: 2 },
        { championId: "renekton", score: 2 },
        { championId: "rumble", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
