import { createChampion } from "./_helpers";

export const poppy = createChampion({
  id: "poppy",
  name: "Poppy",
  image: "/champions/poppy.png",
  roles: ["support", "jungle", "top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "sivir", score: 4 },
    { championId: "kalista", score: 3 },
    { championId: "anivia", score: 3 },
    { championId: "yunara", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "varus", score: 3 },
  ],

  offers: [
    { type: "antiDive", strength: 5 },
    { type: "pick", strength: 3 },
    { type: "frontline", strength: 4 },
    { type: "disengage", strength: 4 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 1,
    bans: 5,
    presence: 6,
    prioScore: 8,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 6,
    avgBanTurn: 7.4,
    avgPickRound: 1,
    blindPickRate: 0,
    averageGameTime: "32:38",
    csPerMinute: 0.9,
    damagePerMinute: 110,
    goldPerMinute: 250,
    csDiffAt15: 5,
    goldDiffAt15: -540,
    xpDiffAt15: 74,
    soloqKrChallengerWinRate: 59.93,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "camille", level: 2, phase: "all", note: "W oprește E-ul Camillei" },
      ],
      weakVs: [
        { championId: "shen", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [],
      weakVs: [
        { championId: "trundle", level: 2, phase: "late" },
        { championId: "aatrox", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "camille", level: 2, phase: "all", note: "W oprește E-ul Camillei" },
      ],
      weakVs: [
        { championId: "gwen", level: 2, phase: "late" },
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "jayce", level: 2, phase: "lane" },
        { championId: "kennen", level: 2, phase: "lane" },
        { championId: "shen", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
