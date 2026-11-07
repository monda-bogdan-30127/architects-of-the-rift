import { createChampion } from "./_helpers";

export const orianna = createChampion({
  id: "orianna",
  name: "Orianna",
  image: "/champions/orianna.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "vi", score: 5 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "rell", score: 3 },
    { championId: "ambessa", score: 3 }
  ],

  offers: [
    { type: "waveclear", strength: 4 },
    { type: "zoneControl", strength: 5 },
    { type: "followUp", strength: 5 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 5, con: 4, iq: 5 },

  stats: {
    picks: 19,
    bans: 20,
    presence: 39,
    prioScore: 45,
    wins: 14,
    losses: 5,
    proWinRate: 74,
    kda: 5.2,
    avgBanTurn: 5.9,
    avgPickRound: 1.58,
    blindPickRate: 94.7,
    averageGameTime: "34:37",
    csPerMinute: 8.9,
    damagePerMinute: 687,
    goldPerMinute: 410,
    csDiffAt15: 6.9,
    goldDiffAt15: 221,
    xpDiffAt15: 169,
    soloqKrChallengerWinRate: 53.4,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "taliyah", level: 2, phase: "late" },
        { championId: "azir", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "akali", level: 2, phase: "lane" },
        { championId: "leblanc", level: 2, phase: "lane" },
        { championId: "yone", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
