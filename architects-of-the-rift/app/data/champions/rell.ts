import { createChampion } from "./_helpers";

export const rell = createChampion({
  id: "rell",
  name: "Rell",
  image: "/champions/rell.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "kaisa", score: 4 },
    { championId: "kalista", score: 4 },
    { championId: "miss-fortune", score: 3 },
    { championId: "varus", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "sivir", score: 3 },
    { championId: "wukong", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "followUp", strength: 4 },
    { type: "reliableCC", strength: 4 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

  stats: {
    picks: 3,
    bans: 0,
    presence: 3,
    prioScore: 2,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 2.8,
    avgBanTurn: null,
    avgPickRound: 3.33,
    blindPickRate: 33.3,
    averageGameTime: "30:20",
    csPerMinute: 1.1,
    damagePerMinute: 126,
    goldPerMinute: 255,
    csDiffAt15: -1,
    goldDiffAt15: -35,
    xpDiffAt15: 106,
    soloqKrChallengerWinRate: 59.93,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "seraphine", score: 2 },
        { championId: "leona", score: 1 },
      ],
      weakVs: [
        { championId: "milio", score: 4, note: "ult-ul curăță CC-ul lui Rell" },
        { championId: "poppy", score: 4, note: "W oprește W-ul lui Rell" },
        { championId: "bard", score: 2 },
        { championId: "lulu", score: 2 },
        { championId: "neeko", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
