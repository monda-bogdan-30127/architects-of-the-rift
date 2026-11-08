import { createChampion } from "./_helpers";

export const talon = createChampion({
  id: "talon",
  name: "Talon",
  image: "/champions/talon.png",
  roles: ["mid", "jungle"],
  damageProfile: ["AD"],
  attackType: "melee",

  offers: [
    { type: "roamPressure", strength: 5 },
    { type: "burstDamage", strength: 5 },
    { type: "backlineAccess", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 58.06,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "kassadin", level: 2, phase: "lane" },
        { championId: "twisted-fate", level: 2, phase: "lane" },
      ],
      stats: null,
    },
    jungle: {
      goodVs: [
        { championId: "karthus", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
