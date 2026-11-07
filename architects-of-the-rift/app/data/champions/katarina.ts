import { createChampion } from "./_helpers";

export const katarina = createChampion({
  id: "katarina",
  name: "Katarina",
  image: "/champions/katarina.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  offers: [
    { type: "backlineAccess", strength: 5 },
    { type: "burstDamage", strength: 5 },
    { type: "dive", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "followUp", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "reliableCC", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "antiDive", severity: 3 },
    { exposedTo: "peel", severity: 3 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 }
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
    soloqKrChallengerWinRate: 60.61,
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
