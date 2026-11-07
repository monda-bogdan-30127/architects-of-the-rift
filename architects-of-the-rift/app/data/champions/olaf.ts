import { createChampion } from "./_helpers";

export const olaf = createChampion({
  id: "olaf",
  name: "Olaf",
  image: "/champions/olaf.png",
  roles: ["top"],
  damageProfile: ["AD", "TRUE"],

  synergyWith: [
    { championId: "yuumi", score: 5 },
    { championId: "lulu", score: 5 },
    { championId: "karma", score: 4 },
    { championId: "seraphine", score: 4 },
    { championId: "zilean", score: 4 },
    { championId: "ivern", score: 4 },
    { championId: "renata-glasc", score: 3 },
    { championId: "senna", score: 3 },
  ],

  offers: [
    { type: "earlyPrio", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "dive", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 13,
    bans: 36,
    presence: 49,
    prioScore: 59,
    wins: 8,
    losses: 5,
    proWinRate: 62,
    kda: 2.1,
    avgBanTurn: 4.2,
    avgPickRound: 1.69,
    blindPickRate: 92.3,
    averageGameTime: "34:20",
    csPerMinute: 8.1,
    damagePerMinute: 511,
    goldPerMinute: 377,
    csDiffAt15: -3.5,
    goldDiffAt15: -477,
    xpDiffAt15: -298,
    soloqKrChallengerWinRate: 61.9,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ornn", level: 2, phase: "all", note: "true damage și imunitate la CC în ult" },
        { championId: "gnar", level: 2, phase: "lane" },
        { championId: "ksante", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "kennen", level: 2, phase: "all", note: "kite la distanță contra juggernaut-ului" },
        { championId: "fiora", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
        { championId: "udyr", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 16,
        bans: null,
        presence: 54,
        prioScore: 57,
        wins: 10,
        losses: 6,
        proWinRate: 63,
        kda: 2.1,
        avgBanTurn: null,
        avgPickRound: 1.75,
        blindPickRate: 93.8,
        averageGameTime: "33:48",
        csPerMinute: 8.3,
        damagePerMinute: 507,
        goldPerMinute: 385,
        csDiffAt15: 1.4,
        goldDiffAt15: -335,
        xpDiffAt15: -147,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
