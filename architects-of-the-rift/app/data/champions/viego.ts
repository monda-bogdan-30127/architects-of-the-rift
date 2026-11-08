import { createChampion } from "./_helpers";

export const viego = createChampion({
  id: "viego",
  name: "Viego",
  image: "/champions/viego.png",
  roles: ["jungle"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "galio", score: 5 },
    { championId: "lissandra", score: 5 },
    { championId: "twisted-fate", score: 4 },
    { championId: "camille", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 4 },
    { type: "dive", strength: 3 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "peel", severity: 2 }
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 55.74,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "karthus", level: 2, phase: "lane" },
        { championId: "kindred", level: 1, phase: "all" },
      ],
      stats: null,
    },
  },
});
