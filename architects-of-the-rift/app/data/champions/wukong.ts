import { createChampion } from "./_helpers";

export const wukong = createChampion({
  id: "wukong",
  name: "Wukong",
  image: "/champions/wukong.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "orianna", score: 4 },
    { championId: "azir", score: 4 },
    { championId: "neeko", score: 4 },
    { championId: "miss-fortune", score: 4 },
    { championId: "ahri", score: 4 },
    { championId: "sylas", score: 2 },
    { championId: "viktor", score: 3 },
    { championId: "akali", score: 4 },
    { championId: "renata-glasc", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 4 },
    { type: "dive", strength: 4 },
    { type: "followUp", strength: 4 },
    { type: "reliableCC", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 3, mac: 4, tfg: 5, iq: 4 },

  stats: {
    picks: 11,
    bans: 15,
    presence: 26,
    prioScore: 29,
    wins: 5,
    losses: 6,
    proWinRate: 45,
    kda: 3.8,
    avgBanTurn: 6.1,
    avgPickRound: 1.82,
    blindPickRate: 30,
    averageGameTime: "36:23",
    csPerMinute: 7.1,
    damagePerMinute: 353,
    goldPerMinute: 377,
    csDiffAt15: 5.3,
    goldDiffAt15: 194,
    xpDiffAt15: 230,
    soloqKrChallengerWinRate: 57.39,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "dr-mundo", score: 2 },
        { championId: "lillia", score: 2 },
        { championId: "viego", score: 2 },
        { championId: "nocturne", score: 1 },
      ],
      weakVs: [
        { championId: "poppy", score: 4, note: "W oprește Nimbus Strike" },
        { championId: "maokai", score: 3 },
        { championId: "skarner", score: 2 },
        { championId: "vi", score: 2 },
        { championId: "qiyana", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
