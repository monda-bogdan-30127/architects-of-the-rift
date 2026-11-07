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
        { championId: "seraphine", level: 2, phase: "lane" },
        { championId: "leona", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "milio", level: 2, phase: "all", note: "ult-ul curăță CC-ul lui Rell" },
        { championId: "poppy", level: 2, phase: "all", note: "W oprește W-ul lui Rell" },
        { championId: "bard", level: 2, phase: "lane" },
        { championId: "lulu", level: 2, phase: "lane" },
        { championId: "neeko", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
