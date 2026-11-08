import { createChampion } from "./_helpers";

export const rengar = createChampion({
  id: "rengar",
  name: "Rengar",
  image: "/champions/rengar.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "ivern", score: 5 },
    { championId: "leblanc", score: 4 },
    { championId: "qiyana", score: 4 },
    { championId: "orianna", score: 4 },
    { championId: "naafiri", score: 3 },
    { championId: "pyke", score: 3 },
    { championId: "ashe", score: 2 },
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "burstDamage", strength: 5 },
    { type: "backlineAccess", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
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
    soloqKrChallengerWinRate: 59.66,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "teemo", level: 2, phase: "lane" },
        { championId: "vayne", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
