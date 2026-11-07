import { createChampion } from "./_helpers";

export const yorick = createChampion({
  id: "yorick",
  name: "Yorick",
  image: "/champions/yorick.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "maokai", score: 5 },
    { championId: "sejuani", score: 5 },
    { championId: "ivern", score: 4 },
    { championId: "amumu", score: 4 },
    { championId: "skarner", score: 4 },
    { championId: "taliyah", score: 3 },
    { championId: "veigar", score: 3 },
    { championId: "ziggs", score: 3 },
  ],

  offers: [
    { type: "splitpush", strength: 5 },
    { type: "sideLanePressure", strength: 5 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 },
    { type: "waveclear", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 2,
    bans: 0,
    presence: 2,
    prioScore: 2,
    wins: 0,
    losses: 2,
    proWinRate: 0,
    kda: 0.3,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "32:21",
    csPerMinute: 9.4,
    damagePerMinute: 354,
    goldPerMinute: 391,
    csDiffAt15: -20,
    goldDiffAt15: -1410,
    xpDiffAt15: -1722,
    soloqKrChallengerWinRate: 50.0,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ornn", level: 2, phase: "late" },
        { championId: "jax", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "gangplank", level: 2, phase: "all", note: "butoaiele curăță ghoul-ii" },
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "sion", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
