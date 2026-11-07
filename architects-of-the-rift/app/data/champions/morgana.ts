import { createChampion } from "./_helpers";

export const morgana = createChampion({
  id: "morgana",
  name: "Morgana",
  image: "/champions/morgana.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "caitlyn", score: 5 },
    { championId: "jinx", score: 5 },
    { championId: "varus", score: 4 },
    { championId: "ezreal", score: 4 },
    { championId: "jhin", score: 4 },
    { championId: "ashe", score: 3 },
    { championId: "miss-fortune", score: 3 },
    { championId: "aphelios", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "zoneControl", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
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
    soloqKrChallengerWinRate: 51.7,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "galio", score: 4, vsRole: "mid", note: "black shield anulează CC-ul lui Galio pe aliat" },
        { championId: "vi", score: 4, vsRole: "jungle", note: "black shield anulează CC-ul ult-ului lui Vi pe aliat" },
        { championId: "nami", score: 2 },
        { championId: "soraka", score: 2 },
      ],
      weakVs: [
        { championId: "bard", score: 2 },
        { championId: "lulu", score: 2 },
        { championId: "pyke", score: 2 },
        { championId: "shen", score: 2 },
        { championId: "tahm-kench", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
