import { createChampion } from "./_helpers";

export const lucian = createChampion({
  id: "lucian",
  name: "Lucian",
  image: "/champions/lucian.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "yuumi", score: 3 },
    { championId: "lulu", score: 3 },
    { championId: "karma", score: 3 },
    { championId: "leona", score: 2 },
    { championId: "nautilus", score: 2 },
  ],

  offers: [
    { type: "earlyPrio", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "peel", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

  stats: {
    picks: 15,
    bans: 5,
    presence: 20,
    prioScore: 17,
    wins: 7,
    losses: 8,
    proWinRate: 47,
    kda: 3.2,
    avgBanTurn: 5,
    avgPickRound: 2.2,
    blindPickRate: 50,
    averageGameTime: "33:05",
    csPerMinute: 10.2,
    damagePerMinute: 818,
    goldPerMinute: 469,
    csDiffAt15: 8.5,
    goldDiffAt15: 216,
    xpDiffAt15: 172,
    soloqKrChallengerWinRate: 57.47,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "jhin", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "senna", level: 2, phase: "late" },
        { championId: "xayah", level: 2, phase: "late" },
        { championId: "yunara", level: 2, phase: "late" },
        { championId: "draven", level: 2, phase: "lane" },
        { championId: "kalista", level: 2, phase: "lane" },
      ],
      mustWith: ["nami", "milio", "braum"],
      stats: null,
    },
  },
});
