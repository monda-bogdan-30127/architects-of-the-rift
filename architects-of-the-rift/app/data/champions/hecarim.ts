import { createChampion } from "./_helpers";

export const hecarim = createChampion({
  id: "hecarim",
  name: "Hecarim",
  image: "/champions/hecarim.png",
  roles: ["jungle"],
  damageProfile: ["AD"],
  attackType: "melee",

  offers: [
    { type: "engage", strength: 4 },
    { type: "dive", strength: 4 },
    { type: "backlineAccess", strength: 4 },
    { type: "objectiveControl", strength: 3 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "earlyPrio", severity: 1 }
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
    soloqKrChallengerWinRate: 58.82,
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
