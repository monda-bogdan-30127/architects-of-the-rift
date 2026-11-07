import { createChampion } from "./_helpers";

export const riven = createChampion({
  id: "riven",
  name: "Riven",
  image: "/champions/riven.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "nidalee", score: 5 },
    { championId: "yasuo", score: 5 },
    { championId: "lee-sin", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "akali", score: 3 },
    { championId: "yone", score: 3 },
    { championId: "irelia", score: 3 },
  ],

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "splitpush", strength: 4 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "siege", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 3, con: 3, iq: 2 },

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
    soloqKrChallengerWinRate: 56.31,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "gnar", score: 2 },
        { championId: "ornn", score: 2 },
        { championId: "vladimir", score: 2 },
      ],
      weakVs: [
        { championId: "camille", score: 3 },
        { championId: "gwen", score: 3 },
        { championId: "aatrox", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
