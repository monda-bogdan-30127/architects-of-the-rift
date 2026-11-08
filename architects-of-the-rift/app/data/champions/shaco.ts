import { createChampion } from "./_helpers";

export const shaco = createChampion({
  id: "shaco",
  name: "Shaco",
  image: "/champions/shaco.png",
  roles: ["jungle"],
  damageProfile: ["AD", "AP"],
  attackType: "melee",

  offers: [
    { type: "pick", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "zoneControl", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
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
    soloqKrChallengerWinRate: 64.69,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "karthus", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
