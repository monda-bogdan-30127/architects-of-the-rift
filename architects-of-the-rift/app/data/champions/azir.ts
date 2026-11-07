import { createChampion } from "./_helpers";

export const azir = createChampion({
  id: "azir",
  name: "Azir",
  image: "/champions/azir.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "maokai", score: 3 },
    { championId: "nocturne", score: 3 },
    { championId: "vi", score: 4 },
    { championId: "xin-zhao", score: 2 },
    { championId: "lee-sin", score: 3 }
  ],

  offers: [
    { type: "zoneControl", strength: 5 },
    { type: "sustainedDamage", strength: 5 },
    { type: "waveclear", strength: 4 },
    { type: "scaling", strength: 5 },
    { type: "siege", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 5, tfg: 4, con: 4, iq: 4 },

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
    soloqKrChallengerWinRate: 42.44,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurora", level: 2, phase: "late" },
        { championId: "galio", level: 2, phase: "late" },
        { championId: "twisted-fate", level: 2, phase: "late" },
        { championId: "sylas", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "akali", level: 2, phase: "lane" },
        { championId: "cassiopeia", level: 2, phase: "lane" },
        { championId: "yone", level: 2, phase: "lane" },
        { championId: "ziggs", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
