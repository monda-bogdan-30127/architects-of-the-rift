import { createChampion } from "./_helpers";

export const zilean = createChampion({
  id: "zilean",
  name: "Zilean",
  image: "/champions/zilean.png",
  roles: ["support", "mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "olaf", score: 5 },
    { championId: "darius", score: 5 },
    { championId: "caitlyn", score: 4 },
    { championId: "volibear", score: 4 },
    { championId: "vayne", score: 4 },
    { championId: "zeri", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "kaisa", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 4 },
    { type: "disengage", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 60.66,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "leona", level: 2, phase: "all", note: "ult-ul anulează all-in-ul" },
        { championId: "thresh", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "alistar", level: 2, phase: "lane" },
        { championId: "renata-glasc", level: 2, phase: "lane" },
        { championId: "yuumi", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
    mid: {
      goodVs: [
        { championId: "leblanc", level: 2, phase: "lane" },
        { championId: "malzahar", level: 2, phase: "lane" },
        { championId: "ahri", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "orianna", level: 2, phase: "lane" },
        { championId: "ryze", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
