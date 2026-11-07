import { createChampion } from "./_helpers";

export const khazix = createChampion({
  id: "khazix",
  name: "Kha'Zix",
  image: "/champions/kha'zix.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "pyke", score: 5 },
    { championId: "nautilus", score: 5 },
    { championId: "leona", score: 5 },
    { championId: "rakan", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "orianna", score: 5 },
    { championId: "qiyana", score: 4 },
    { championId: "shen", score: 4 }
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

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 0,
    bans: 2,
    presence: 2,
    prioScore: 3,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: 7,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 54.55,
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
