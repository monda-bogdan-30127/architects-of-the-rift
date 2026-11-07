import { createChampion } from "./_helpers";

export const viktor = createChampion({
  id: "viktor",
  name: "Viktor",
  image: "/champions/viktor.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "ornn", score: 3 },
    { championId: "renata-glasc", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "waveclear", strength: 5 },
    { type: "zoneControl", strength: 4 },
    { type: "poke", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 }
  ],

  playerScaling: { mec: 4, tfg: 4, con: 5, iq: 4 },

  stats: {
    picks: 15,
    bans: 9,
    presence: 24,
    prioScore: 24,
    wins: 8,
    losses: 7,
    proWinRate: 53,
    kda: 3.6,
    avgBanTurn: 6.8,
    avgPickRound: 1.93,
    blindPickRate: 26.7,
    averageGameTime: "34:34",
    csPerMinute: 8.8,
    damagePerMinute: 735,
    goldPerMinute: 389,
    csDiffAt15: -1.5,
    goldDiffAt15: -195,
    xpDiffAt15: 90,
    soloqKrChallengerWinRate: 55.57,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "cassiopeia", level: 2, phase: "lane" },
        { championId: "kassadin", level: 2, phase: "lane" },
        { championId: "mel", level: 2, phase: "lane" },
        { championId: "xerath", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "akali", level: 2, phase: "lane" },
        { championId: "annie", level: 2, phase: "lane" },
        { championId: "azir", level: 2, phase: "lane" },
        { championId: "leblanc", level: 2, phase: "lane" },
        { championId: "orianna", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 18,
        bans: null,
        presence: 27,
        prioScore: 23,
        wins: 10,
        losses: 8,
        proWinRate: 56,
        kda: 4,
        avgBanTurn: null,
        avgPickRound: 1.94,
        blindPickRate: 27.8,
        averageGameTime: "34:05",
        csPerMinute: 9,
        damagePerMinute: 764,
        goldPerMinute: 399,
        csDiffAt15: 0.9,
        goldDiffAt15: -156,
        xpDiffAt15: 145,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
