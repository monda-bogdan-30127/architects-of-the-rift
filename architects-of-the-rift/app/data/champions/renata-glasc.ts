import { createChampion } from "./_helpers";

export const renataGlasc = createChampion({
  id: "renata-glasc",
  name: "Renata Glasc",
  image: "/champions/renata-glasc.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "aphelios", score: 5 },
    { championId: "jinx", score: 5 },
    { championId: "kogmaw", score: 5 },
    { championId: "vayne", score: 4 },
    { championId: "twitch", score: 4 },
    { championId: "zeri", score: 4 },
    { championId: "kaisa", score: 3 },
    { championId: "xayah", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 4 },
    { type: "disengage", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 2 }
  ],

  playerScaling: { mac: 4, tfg: 4, clt: 4, iq: 5 },

  stats: {
    picks: 16,
    bans: 37,
    presence: 53,
    prioScore: 65,
    wins: 8,
    losses: 8,
    proWinRate: 50,
    kda: 3.5,
    avgBanTurn: 3.1,
    avgPickRound: 1.5,
    blindPickRate: 80,
    averageGameTime: "36:36",
    csPerMinute: 1.1,
    damagePerMinute: 166,
    goldPerMinute: 260,
    csDiffAt15: 1.3,
    goldDiffAt15: -93,
    xpDiffAt15: 157,
    soloqKrChallengerWinRate: 62.26,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "lulu", level: 2, phase: "lane" },
        { championId: "seraphine", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "blitzcrank", level: 2, phase: "lane" },
        { championId: "maokai", level: 2, phase: "lane" },
        { championId: "neeko", level: 2, phase: "lane" },
        { championId: "thresh", level: 2, phase: "lane" },
        { championId: "yuumi", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
