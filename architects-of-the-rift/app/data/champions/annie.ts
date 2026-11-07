import { createChampion } from "./_helpers";

export const annie = createChampion({
  id: "annie",
  name: "Annie",
  image: "/champions/annie.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "nocturne", score: 4 },
    { championId: "xin-zhao", score: 3 },
    { championId: "lee-sin", score: 3 },
    { championId: "ambessa", score: 3 },
    { championId: "jarvan-iv", score: 2 }
  ],

  offers: [
    { type: "burstDamage", strength: 4 },
    { type: "pick", strength: 4 },
    { type: "followUp", strength: 3 },
    { type: "reliableCC", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 5,
    bans: 2,
    presence: 7,
    prioScore: 6,
    wins: 3,
    losses: 2,
    proWinRate: 60,
    kda: 6.1,
    avgBanTurn: 9.5,
    avgPickRound: 2.2,
    blindPickRate: 80,
    averageGameTime: "36:17",
    csPerMinute: 7.8,
    damagePerMinute: 746,
    goldPerMinute: 386,
    csDiffAt15: 2.4,
    goldDiffAt15: 102,
    xpDiffAt15: -95,
    soloqKrChallengerWinRate: 63.99,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "hwei", score: 2 },
        { championId: "leblanc", score: 2 },
      ],
      weakVs: [
        { championId: "ryze", score: 3 },
        { championId: "ahri", score: 2 },
        { championId: "cassiopeia", score: 2 },
        { championId: "lissandra", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
