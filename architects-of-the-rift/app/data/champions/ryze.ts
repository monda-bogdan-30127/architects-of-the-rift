import { createChampion } from "./_helpers";

export const ryze = createChampion({
  id: "ryze",
  name: "Ryze",
  image: "/champions/ryze.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "pantheon", score: 5 },
    { championId: "vi", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "renata-glasc", score: 3 },
    { championId: "xayah", score: 3 }
  ],

  offers: [
    { type: "waveclear", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 4, mac: 4, con: 4, iq: 5 },

  stats: {
    picks: 7,
    bans: 4,
    presence: 11,
    prioScore: 10,
    wins: 2,
    losses: 5,
    proWinRate: 29,
    kda: 3.2,
    avgBanTurn: 7.8,
    avgPickRound: 2.29,
    blindPickRate: 71.4,
    averageGameTime: "30:04",
    csPerMinute: 9.3,
    damagePerMinute: 479,
    goldPerMinute: 399,
    csDiffAt15: -2.1,
    goldDiffAt15: 158,
    xpDiffAt15: -82,
    soloqKrChallengerWinRate: 52,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurora", level: 2, phase: "late" },
        { championId: "galio", level: 2, phase: "late" },
        { championId: "taliyah", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "akali", level: 2, phase: "lane" },
        { championId: "anivia", level: 2, phase: "lane" },
        { championId: "cassiopeia", level: 2, phase: "lane" },
        { championId: "twisted-fate", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 8,
        bans: null,
        presence: 13,
        prioScore: 11,
        wins: 2,
        losses: 6,
        proWinRate: 25,
        kda: 3.3,
        avgBanTurn: null,
        avgPickRound: 2.25,
        blindPickRate: 62.5,
        averageGameTime: "30:20",
        csPerMinute: 9.3,
        damagePerMinute: 472,
        goldPerMinute: 397,
        csDiffAt15: -3,
        goldDiffAt15: 152,
        xpDiffAt15: -110,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
