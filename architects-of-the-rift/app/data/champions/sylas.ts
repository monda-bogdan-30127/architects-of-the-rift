import { createChampion } from "./_helpers";

export const sylas = createChampion({
  id: "sylas",
  name: "Sylas",
  image: "/champions/sylas.png",
  roles: ["mid", "jungle"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "sejuani", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "vi", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "xayah", score: 2 },
    { championId: "renata-glasc", score: 2 },
  ],

  offers: [
    { type: "earlyPrio", strength: 3 },
    { type: "objectiveControl", strength: 3 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 3 },
    { exposedTo: "poke", severity: 3 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 3, iq: 4 },

  stats: {
    picks: 5,
    bans: 9,
    presence: 14,
    prioScore: 17,
    wins: 1,
    losses: 4,
    proWinRate: 20,
    kda: 1.7,
    avgBanTurn: 8.6,
    avgPickRound: 1.8,
    blindPickRate: 0,
    averageGameTime: "33:49",
    csPerMinute: 8,
    damagePerMinute: 434,
    goldPerMinute: 350,
    csDiffAt15: -10,
    goldDiffAt15: -589,
    xpDiffAt15: -649,
    soloqKrChallengerWinRate: 54.38,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "leblanc", score: 2 },
      ],
      weakVs: [
        { championId: "kassadin", score: 3 },
        { championId: "aurora", score: 2 },
        { championId: "hwei", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [
        { championId: "sejuani", score: 3 },
        { championId: "xin-zhao", score: 3 },
      ],
      weakVs: [
        { championId: "lee-sin", score: 2 },
        { championId: "skarner", score: 2 },
        { championId: "trundle", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
