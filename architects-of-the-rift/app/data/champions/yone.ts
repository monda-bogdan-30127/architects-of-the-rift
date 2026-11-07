import { createChampion } from "./_helpers";

export const yone = createChampion({
  id: "yone",
  name: "Yone",
  image: "/champions/yone.png",
  roles: ["mid"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "malphite", score: 5 },
    { championId: "wukong", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "neeko", score: 4 },
    { championId: "rumble", score: 3 },
    { championId: "rakan", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "amumu", score: 4 },
  ],

  offers: [
    { type: "splitpush", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "siege", severity: 1 }
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 6,
    presence: 10,
    prioScore: 9,
    wins: 0,
    losses: 4,
    proWinRate: 0,
    kda: 0.9,
    avgBanTurn: 7.3,
    avgPickRound: 3.5,
    blindPickRate: 50,
    averageGameTime: "28:52",
    csPerMinute: 8.9,
    damagePerMinute: 442,
    goldPerMinute: 373,
    csDiffAt15: -8.8,
    goldDiffAt15: -704,
    xpDiffAt15: -565,
    soloqKrChallengerWinRate: 54.63,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "leblanc", level: 2, phase: "lane" },
        { championId: "sylas", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "annie", level: 2, phase: "lane" },
        { championId: "aurora", level: 2, phase: "lane" },
        { championId: "ryze", level: 2, phase: "lane" },
        { championId: "swain", level: 2, phase: "lane" },
        { championId: "twisted-fate", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
