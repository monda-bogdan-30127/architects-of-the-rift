import { createChampion } from "./_helpers";

export const diana = createChampion({
  id: "diana",
  name: "Diana",
  image: "/champions/diana.png",
  roles: ["jungle", "mid"],
  damageProfile: ["AP"],
  attackType: "melee",

  synergyWith: [
    { championId: "yasuo", score: 5 },
    { championId: "malphite", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "orianna", score: 4 },
    { championId: "yone", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 4 },
    { type: "followUp", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "dive", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 0.8,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "25:10",
    csPerMinute: 8.5,
    damagePerMinute: 436,
    goldPerMinute: 378,
    csDiffAt15: -9,
    goldDiffAt15: -1977,
    xpDiffAt15: -684,
    soloqKrChallengerWinRate: 52.38,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "karthus", level: 2, phase: "lane" },
      ],
      stats: null,
    },
    mid: {
      goodVs: [
        { championId: "xerath", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 1,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 0.8,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "25:10",
        csPerMinute: 8.5,
        damagePerMinute: 436,
        goldPerMinute: 378,
        csDiffAt15: -9,
        goldDiffAt15: -1977,
        xpDiffAt15: -684,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
