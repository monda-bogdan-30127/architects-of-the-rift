import { createChampion } from "./_helpers";

export const pyke = createChampion({
  id: "pyke",
  name: "Pyke",
  image: "/champions/pyke.png",
  roles: ["support"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "mel", score: 3 },
    { championId: "samira", score: 5 },
    { championId: "jhin", score: 4 },
    { championId: "lucian", score: 4 },
    { championId: "caitlyn", score: 3 },
    { championId: "varus", score: 3 },
    { championId: "tristana", score: 3 },
    { championId: "kaisa", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "roamPressure", strength: 5 },
    { type: "burstDamage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 5, mac: 4, clt: 4, iq: 4 },

  stats: {
    picks: 1,
    bans: 3,
    presence: 4,
    prioScore: 5,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 1,
    avgBanTurn: 2.7,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "33:03",
    csPerMinute: 1.3,
    damagePerMinute: 164,
    goldPerMinute: 252,
    csDiffAt15: -4,
    goldDiffAt15: -631,
    xpDiffAt15: -657,
    soloqKrChallengerWinRate: 55.06,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "braum", score: 2 },
        { championId: "karma", score: 2 },
      ],
      weakVs: [
        { championId: "tahm-kench", score: 4, note: "devour salvează aliatul de execute" },
        { championId: "bard", score: 2 },
        { championId: "lulu", score: 2 },
        { championId: "lux", score: 2 },
        { championId: "shen", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
