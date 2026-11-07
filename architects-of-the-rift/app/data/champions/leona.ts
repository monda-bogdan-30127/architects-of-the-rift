import { createChampion } from "./_helpers";

export const leona = createChampion({
  id: "leona",
  name: "Leona",
  image: "/champions/leona.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "miss-fortune", score: 4 },
    { championId: "ezreal", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "draven", score: 3 },
    { championId: "corki", score: 3 },
    { championId: "ivern", score: 3 },
    { championId: "vi", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "reliableCC", strength: 5 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 1,
    presence: 5,
    prioScore: 4,
    wins: 2,
    losses: 2,
    proWinRate: 50,
    kda: 2.4,
    avgBanTurn: 7,
    avgPickRound: 2.5,
    blindPickRate: 0,
    averageGameTime: "29:47",
    csPerMinute: 1,
    damagePerMinute: 155,
    goldPerMinute: 263,
    csDiffAt15: -2.2,
    goldDiffAt15: -362,
    xpDiffAt15: -192,
    soloqKrChallengerWinRate: 57.33,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "lulu", level: 2, phase: "lane" },
        { championId: "nami", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "milio", level: 2, phase: "all", note: "ult-ul curăță CC-ul lui Leona" },
        { championId: "poppy", level: 2, phase: "all", note: "W oprește E-ul lui Leona" },
        { championId: "bard", level: 2, phase: "lane" },
        { championId: "neeko", level: 2, phase: "lane" },
        { championId: "rakan", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
