import { createChampion } from "./_helpers";

export const nautilus = createChampion({
  id: "nautilus",
  name: "Nautilus",
  image: "/champions/nautilus.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "kaisa", score: 4 },
    { championId: "draven", score: 3 },
    { championId: "miss-fortune", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "taliyah", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "reliableCC", strength: 5 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 5, con: 3, iq: 4 },

  stats: {
    picks: 20,
    bans: 14,
    presence: 34,
    prioScore: 41,
    wins: 13,
    losses: 7,
    proWinRate: 65,
    kda: 2.9,
    avgBanTurn: 6.9,
    avgPickRound: 1.35,
    blindPickRate: 55,
    averageGameTime: "32:55",
    csPerMinute: 1.1,
    damagePerMinute: 140,
    goldPerMinute: 252,
    csDiffAt15: 3,
    goldDiffAt15: -67,
    xpDiffAt15: -155,
    soloqKrChallengerWinRate: 56,
  },

  roleData: {
    support: {
      goodVs: [],
      weakVs: [
        { championId: "morgana", level: 2, phase: "all", note: "black shield anulează hook-ul și ult-ul" },
        { championId: "alistar", level: 1, phase: "all" },
        { championId: "poppy", level: 1, phase: "all" },
        { championId: "rakan", level: 1, phase: "all" },
        { championId: "rell", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
