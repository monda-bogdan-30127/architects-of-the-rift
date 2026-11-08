import { createChampion } from "./_helpers";

export const leona = createChampion({
  id: "leona",
  name: "Leona",
  image: "/champions/leona.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "melee",

  synergyWith: [
    { championId: "miss-fortune", score: 4 },
    { championId: "ezreal", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "draven", score: 3 },
    { championId: "corki", score: 3 },
    { championId: "ivern", score: 3 },
    { championId: "vi", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "reliableCC", strength: 5 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 1,
    presence: 5,
    prioScore: 4,
    wins: 2,
    losses: 2,
    proWinRate: 50,
    kda: 2.4,
    avgBanTurn: 7,
    avgPickRound: 2.5,
    blindPickRate: 0,
    averageGameTime: "29:47",
    csPerMinute: 1,
    damagePerMinute: 155,
    goldPerMinute: 263,
    csDiffAt15: -2.2,
    goldDiffAt15: -362,
    xpDiffAt15: -192,
    soloqKrChallengerWinRate: 57.33,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "heimerdinger", level: 2, phase: "lane" },
        { championId: "lux", level: 2, phase: "lane" },
        { championId: "seraphine", level: 2, phase: "lane" },
        { championId: "sona", level: 2, phase: "lane" },
        { championId: "soraka", level: 2, phase: "lane" },
        { championId: "yuumi", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 7,
        bans: null,
        presence: 8,
        prioScore: 6,
        wins: 4,
        losses: 3,
        proWinRate: 57,
        kda: 1.9,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "31:19",
        csPerMinute: 1,
        damagePerMinute: 138,
        goldPerMinute: 255,
        csDiffAt15: -2.7,
        goldDiffAt15: -425,
        xpDiffAt15: -423,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
