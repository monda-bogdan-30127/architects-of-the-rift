import { createChampion } from "./_helpers";

export const jinx = createChampion({
  id: "jinx",
  name: "Jinx",
  image: "/champions/jinx.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "thresh", score: 5 },
    { championId: "nautilus", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "renata-glasc", score: 4 },
    // Fost mustWith (scor 2) — pereche fără sens real de „must” (DRAFT_REWORK §2.5).
    { championId: "braum", score: 2 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "scaling", strength: 5 },
    { type: "siege", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 3 },
    { type: "peel", priority: 3 },
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "engage", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 5, clt: 3, con: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 5.3,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "47:29",
    csPerMinute: 9.8,
    damagePerMinute: 1029,
    goldPerMinute: 459,
    csDiffAt15: -31,
    goldDiffAt15: -1025,
    xpDiffAt15: -1771,
    soloqKrChallengerWinRate: 56.21,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "ezreal", level: 2, phase: "late" },
      ],
      weakVs: [
        { championId: "samira", level: 2, phase: "all", note: "dive pe un carry imobil" },
        { championId: "caitlyn", level: 2, phase: "lane" },
        { championId: "kalista", level: 2, phase: "lane" },
        { championId: "miss-fortune", level: 2, phase: "lane" },
        { championId: "zeri", level: 1, phase: "all" },
      ],
      mustWith: ["lulu", "milio"],
      stats: null,
    },
  },
});
