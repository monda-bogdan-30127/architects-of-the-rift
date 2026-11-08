import { createChampion } from "./_helpers";

export const zed = createChampion({
  id: "zed",
  name: "Zed",
  image: "/champions/zed.png",
  roles: ["mid"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "elise", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "lee-sin", score: 4 },
    { championId: "reksai", score: 4 },
    { championId: "nocturne", score: 4 },
    { championId: "pyke", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "nautilus", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "backlineAccess", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "earlyPrio", strength: 3 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 60.15,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurelion-sol", level: 2, phase: "lane" },
        { championId: "galio", level: 2, phase: "lane" },
        { championId: "hwei", level: 2, phase: "lane" },
        { championId: "kassadin", level: 2, phase: "lane" },
        { championId: "smolder", level: 2, phase: "lane" },
        { championId: "twisted-fate", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
