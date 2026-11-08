import { createChampion } from "./_helpers";

export const yasuo = createChampion({
  id: "yasuo",
  name: "Yasuo",
  image: "/champions/yasuo.png",
  roles: ["mid", "top"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "malphite", score: 5 },
    { championId: "wukong", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "diana", score: 4 },
    { championId: "gragas", score: 4 },
    { championId: "rakan", score: 4 },
    { championId: "alistar", score: 4 }
  ],

  offers: [
    { type: "followUp", strength: 4 },
    { type: "dive", strength: 3 },
    { type: "sustainedDamage", strength: 3 },
    { type: "sideLanePressure", strength: 2 }
  ],

  needs: [
    { type: "engage", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "poke", severity: 2 }
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 55.14,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "xerath", level: 2, phase: "lane" },
        { championId: "ziggs", level: 2, phase: "lane" },
      ],
      stats: null,
      profile: {
        comboDependency: { needsKnockup: 9 },
      },
    },
    top: {
      goodVs: [
        { championId: "gnar", level: 1, phase: "all" },
      ],
      stats: null,
      profile: {
        comboDependency: { needsKnockup: 9 },
      },
    },
  },
});
