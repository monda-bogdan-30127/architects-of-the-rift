import { createChampion } from "./_helpers";

export const evelynn = createChampion({
  id: "evelynn",
  name: "Evelynn",
  image: "/champions/evelynn.png",
  roles: ["jungle"],
  damageProfile: ["AP"],
  attackType: "melee",

  offers: [
    { type: "pick", strength: 5 },
    { type: "burstDamage", strength: 5 },
    { type: "backlineAccess", strength: 4 },
    { type: "roamPressure", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "reliableCC", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "earlyPrio", severity: 3 },
    { exposedTo: "objectiveControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "antiDive", severity: 2 }
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 53,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
