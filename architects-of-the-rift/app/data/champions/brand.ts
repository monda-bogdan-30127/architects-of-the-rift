import { createChampion } from "./_helpers";

export const brand = createChampion({
  id: "brand",
  name: "Brand",
  image: "/champions/brand.png",
  roles: ["jungle"],
  damageProfile: ["AP"],
  attackType: "ranged",

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "objectiveControl", strength: 4 },
    { type: "zoneControl", strength: 4 },
    { type: "poke", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 },
    { type: "reliableCC", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "earlyPrio", severity: 1 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 }
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 4, iq: 4 },

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
    soloqKrChallengerWinRate: 51.3,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
