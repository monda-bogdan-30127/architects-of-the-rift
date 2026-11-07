import { createChampion } from "./_helpers";

export const xinZhao = createChampion({
  id: "xin-zhao",
  name: "Xin Zhao",
  image: "/champions/xin-zhao.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "sivir", score: 4 },
    { championId: "karma", score: 4 },
    { championId: "seraphine", score: 4 },
    { championId: "annie", score: 3 },
    { championId: "lulu", score: 3 }
  ],

  offers: [
    { type: "earlyPrio", strength: 4 },
    { type: "dive", strength: 4 },
    { type: "objectiveControl", strength: 3 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 3, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 6,
    bans: 5,
    presence: 11,
    prioScore: 11,
    wins: 4,
    losses: 2,
    proWinRate: 67,
    kda: 6.6,
    avgBanTurn: 8,
    avgPickRound: 1.83,
    blindPickRate: 16.7,
    averageGameTime: "34:17",
    csPerMinute: 7.5,
    damagePerMinute: 384,
    goldPerMinute: 394,
    csDiffAt15: -2.8,
    goldDiffAt15: 147,
    xpDiffAt15: -103,
    soloqKrChallengerWinRate: 59.6,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "nocturne", score: 2 },
        { championId: "pantheon", score: 2 },
      ],
      weakVs: [
        { championId: "poppy", score: 4, note: "W oprește E-ul lui Xin" },
        { championId: "ambessa", score: 2 },
        { championId: "khazix", score: 2 },
        { championId: "skarner", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
