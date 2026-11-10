import { createChampion } from "./_helpers";

export const leblanc = createChampion({
  id: "leblanc",
  name: "LeBlanc",
  image: "/champions/leblanc.png",
  roles: ["mid"],
  damageProfile: ["AP"],
  attackType: "ranged",

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
        { championId: "xerath", level: 2, phase: "all", note: "Burst and W on an immobile artillery mage" },
        { championId: "aurelion-sol", level: 2, phase: "lane" },
        { championId: "kassadin", level: 2, phase: "lane" },
        { championId: "kogmaw", level: 2, phase: "lane" },
        { championId: "orianna", level: 2, phase: "lane" },
        { championId: "smolder", level: 2, phase: "lane" },
        { championId: "viktor", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 4,
        bans: null,
        presence: 9,
        prioScore: 8,
        wins: 1,
        losses: 3,
        proWinRate: 25,
        kda: 8.7,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "33:17",
        csPerMinute: 9.3,
        damagePerMinute: 695,
        goldPerMinute: 412,
        csDiffAt15: 1,
        goldDiffAt15: 200,
        xpDiffAt15: 238,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
