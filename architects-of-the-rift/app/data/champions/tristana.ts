import { createChampion } from "./_helpers";

export const tristana = createChampion({
  id: "tristana",
  name: "Tristana",
  image: "/champions/tristana.png",
  roles: ["adc", "mid"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "leona", score: 5 },
    { championId: "nautilus", score: 5 },
    { championId: "rell", score: 5 },
    { championId: "alistar", score: 4 },
    { championId: "thresh", score: 4 },
    { championId: "blitzcrank", score: 3 },
    { championId: "rakan", score: 3 },
    { championId: "pyke", score: 3 },
  ],

  offers: [
    { type: "siege", strength: 4 },
    { type: "burstDamage", strength: 3 },
    { type: "scaling", strength: 3 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 7,
    bans: 0,
    presence: 7,
    prioScore: 6,
    wins: 3,
    losses: 4,
    proWinRate: 43,
    kda: 3.4,
    avgBanTurn: null,
    avgPickRound: 1.86,
    blindPickRate: 14.3,
    averageGameTime: "31:46",
    csPerMinute: 10.6,
    damagePerMinute: 621,
    goldPerMinute: 486,
    csDiffAt15: 8,
    goldDiffAt15: 859,
    xpDiffAt15: 496,
    soloqKrChallengerWinRate: 60.51,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "jhin", level: 2, phase: "all", note: "all-in pe un carry imobil" },
        { championId: "samira", level: 2, phase: "lane" },
        { championId: "ziggs", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "aphelios", level: 2, phase: "late" },
        { championId: "ashe", level: 2, phase: "lane" },
        { championId: "lucian", level: 2, phase: "lane" },
        { championId: "miss-fortune", level: 2, phase: "lane" },
        { championId: "xayah", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    mid: {
      goodVs: [
        { championId: "ziggs", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
