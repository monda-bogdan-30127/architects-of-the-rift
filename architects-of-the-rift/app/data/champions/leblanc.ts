import { createChampion } from "./_helpers";

export const leblanc = createChampion({
  id: "leblanc",
  name: "LeBlanc",
  image: "/champions/leblanc.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "nocturne", score: 4 },
    { championId: "xin-zhao", score: 4 },
    { championId: "lee-sin", score: 3 },
    { championId: "jarvan-iv", score: 3 }
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "burstDamage", strength: 5 },
    { type: "roamPressure", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 3, clt: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 5,
    presence: 9,
    prioScore: 10,
    wins: 1,
    losses: 3,
    proWinRate: 25,
    kda: 8.7,
    avgBanTurn: 8.2,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "33:17",
    csPerMinute: 9.3,
    damagePerMinute: 695,
    goldPerMinute: 412,
    csDiffAt15: 1,
    goldDiffAt15: 200,
    xpDiffAt15: 238,
    soloqKrChallengerWinRate: 53.23,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "azir", score: 2 },
        { championId: "cassiopeia", score: 2 },
        { championId: "ziggs", score: 2 },
      ],
      weakVs: [
        { championId: "galio", score: 4, note: "pasivul de MR și taunt-ul anulează burst-ul" },
        { championId: "lissandra", score: 4, note: "CC point-click pe LeBlanc" },
        { championId: "malzahar", score: 4, note: "spell shield și ult point-click" },
        { championId: "vex", score: 4, note: "pasivul pedepsește dash-urile" },
        { championId: "kassadin", score: 3 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
