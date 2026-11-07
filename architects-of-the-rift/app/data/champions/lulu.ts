import { createChampion } from "./_helpers";

export const lulu = createChampion({
  id: "lulu",
  name: "Lulu",
  image: "/champions/lulu.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "kogmaw", score: 4 },
    { championId: "zeri", score: 4 },
    { championId: "jinx", score: 4 },
    { championId: "aphelios", score: 3 },
    { championId: "yunara", score: 3 },
    { championId: "vayne", score: 3 },
    { championId: "corki", score: 3 },
    { championId: "xin-zhao", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 5 },
    { type: "disengage", strength: 3 },
    { type: "scaling", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 }
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 5 },

  stats: {
    picks: 20,
    bans: 9,
    presence: 29,
    prioScore: 29,
    wins: 11,
    losses: 9,
    proWinRate: 55,
    kda: 6.2,
    avgBanTurn: 7.8,
    avgPickRound: 1.8,
    blindPickRate: 68.4,
    averageGameTime: "33:42",
    csPerMinute: 1,
    damagePerMinute: 161,
    goldPerMinute: 258,
    csDiffAt15: 0.4,
    goldDiffAt15: -109,
    xpDiffAt15: -55,
    soloqKrChallengerWinRate: 51.7,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "neeko", score: 2 },
        { championId: "braum", score: 1 },
        { championId: "karma", score: 1 },
      ],
      weakVs: [
        { championId: "blitzcrank", score: 2 },
        { championId: "nami", score: 2 },
        { championId: "nautilus", score: 2 },
        { championId: "thresh", score: 2 },
        { championId: "milio", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
