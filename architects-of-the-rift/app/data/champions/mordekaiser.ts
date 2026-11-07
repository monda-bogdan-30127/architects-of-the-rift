import { createChampion } from "./_helpers";

export const mordekaiser = createChampion({
  id: "mordekaiser",
  name: "Mordekaiser",
  image: "/champions/mordekaiser.png",
  roles: ["top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "sejuani", score: 5 },
    { championId: "vi", score: 4 },
    { championId: "nocturne", score: 4 },
    { championId: "taliyah", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "frontline", strength: 2 }
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
    soloqKrChallengerWinRate: 51.52,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "shen", level: 2, phase: "late" },
        { championId: "yorick", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "gangplank", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "ornn", level: 1, phase: "all" },
        { championId: "sett", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
