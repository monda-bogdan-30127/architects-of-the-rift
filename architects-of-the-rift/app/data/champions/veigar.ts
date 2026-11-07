import { createChampion } from "./_helpers";

export const veigar = createChampion({
  id: "veigar",
  name: "Veigar",
  image: "/champions/veigar.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "amumu", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "sejuani", score: 4 },
    { championId: "malphite", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "zoneControl", strength: 4 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 49.46,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "orianna", level: 2, phase: "late" },
        { championId: "taliyah", level: 2, phase: "late" },
        { championId: "akali", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "sylas", level: 2, phase: "all", note: "fură ult-ul lui Veigar" },
        { championId: "ahri", level: 2, phase: "lane" },
        { championId: "ryze", level: 2, phase: "lane" },
        { championId: "viktor", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
