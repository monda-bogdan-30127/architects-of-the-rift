import { createChampion } from "./_helpers";

export const karma = createChampion({
  id: "karma",
  name: "Karma",
  image: "/champions/karma.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "ezreal", score: 4 },
    { championId: "caitlyn", score: 4 },
    { championId: "varus", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "zeri", score: 3 },
    { championId: "tristana", score: 3 },
    { championId: "nidalee", score: 3 },
    { championId: "jayce", score: 3 },
  ],

  offers: [
    { type: "poke", strength: 4 },
    { type: "peel", strength: 4 },
    { type: "earlyPrio", strength: 4 },
    { type: "disengage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 14,
    bans: 6,
    presence: 20,
    prioScore: 21,
    wins: 5,
    losses: 9,
    proWinRate: 36,
    kda: 4.4,
    avgBanTurn: 4.7,
    avgPickRound: 1.57,
    blindPickRate: 50,
    averageGameTime: "34:48",
    csPerMinute: 1.1,
    damagePerMinute: 233,
    goldPerMinute: 260,
    csDiffAt15: -2.7,
    goldDiffAt15: 209,
    xpDiffAt15: -120,
    soloqKrChallengerWinRate: 55,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "braum", level: 2, phase: "lane" },
        { championId: "nami", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "alistar", level: 2, phase: "lane" },
        { championId: "leona", level: 2, phase: "lane" },
        { championId: "nautilus", level: 2, phase: "lane" },
        { championId: "rakan", level: 2, phase: "lane" },
        { championId: "thresh", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
