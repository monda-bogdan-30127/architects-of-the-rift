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
        { championId: "jhin", score: 4, note: "all-in pe un carry imobil" },
        { championId: "samira", score: 2 },
        { championId: "ziggs", score: 2 },
      ],
      weakVs: [
        { championId: "aphelios", score: 3 },
        { championId: "ashe", score: 2 },
        { championId: "lucian", score: 2 },
        { championId: "miss-fortune", score: 2 },
        { championId: "xayah", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    mid: {
      goodVs: [
        { championId: "ziggs", score: 2 },
      ],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
