import { createChampion } from "./_helpers";

export const twistedFate = createChampion({
  id: "twisted-fate",
  name: "Twisted Fate",
  image: "/champions/twisted-fate.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "camille", score: 5 },
    { championId: "jax", score: 5 },
    { championId: "renekton", score: 4 },
    { championId: "nocturne", score: 4 },
    { championId: "pantheon", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "lee-sin", score: 3 },
    { championId: "elise", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 5 },
    { type: "sideLanePressure", strength: 3 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, con: 4, iq: 4 },

  stats: {
    picks: 3,
    bans: 5,
    presence: 8,
    prioScore: 8,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 4.5,
    avgBanTurn: 9.2,
    avgPickRound: 3,
    blindPickRate: 33.3,
    averageGameTime: "32:38",
    csPerMinute: 8.6,
    damagePerMinute: 364,
    goldPerMinute: 431,
    csDiffAt15: 9,
    goldDiffAt15: 660,
    xpDiffAt15: 166,
    soloqKrChallengerWinRate: 55.97,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurora", score: 2 },
        { championId: "leblanc", score: 2 },
      ],
      weakVs: [
        { championId: "ahri", score: 2 },
        { championId: "cassiopeia", score: 2 },
        { championId: "lissandra", score: 2 },
        { championId: "taliyah", score: 2 },
        { championId: "zoe", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
