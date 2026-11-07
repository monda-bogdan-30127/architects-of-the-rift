import { createChampion } from "./_helpers";

export const zoe = createChampion({
  id: "zoe",
  name: "Zoe",
  image: "/champions/zoe.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "nidalee", score: 5 },
    { championId: "elise", score: 5 },
    { championId: "lee-sin", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "dr-mundo", score: 3 },
    { championId: "lux", score: 3 },
    { championId: "jayce", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "burstDamage", strength: 5 },
    { type: "poke", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 3, clt: 3, iq: 4 },

  stats: {
    picks: 0,
    bans: 0,
    presence: 0,
    prioScore: 0,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: null,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 56.32,
  },

  roleData: {
    mid: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
