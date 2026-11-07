import { createChampion } from "./_helpers";

export const qiyana = createChampion({
  id: "qiyana",
  name: "Qiyana",
  image: "/champions/qiyana.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "twisted-fate", score: 5 },
    { championId: "galio", score: 5 },
    { championId: "pantheon", score: 4 },
    { championId: "pyke", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "renekton", score: 2 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "backlineAccess", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 18,
    bans: 28,
    presence: 46,
    prioScore: 56,
    wins: 9,
    losses: 9,
    proWinRate: 50,
    kda: 3.1,
    avgBanTurn: 3.8,
    avgPickRound: 1.44,
    blindPickRate: 55.6,
    averageGameTime: "33:08",
    csPerMinute: 7.9,
    damagePerMinute: 554,
    goldPerMinute: 452,
    csDiffAt15: 5.1,
    goldDiffAt15: 630,
    xpDiffAt15: 287,
    soloqKrChallengerWinRate: 58.1,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "xin-zhao", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "nocturne", level: 2, phase: "lane" },
        { championId: "pantheon", level: 2, phase: "lane" },
        { championId: "trundle", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
