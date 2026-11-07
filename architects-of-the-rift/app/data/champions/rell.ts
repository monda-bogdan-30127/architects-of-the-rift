import { createChampion } from "./_helpers";

export const rell = createChampion({
  id: "rell",
  name: "Rell",
  image: "/champions/rell.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "kaisa", score: 4 },
    { championId: "kalista", score: 4 },
    { championId: "miss-fortune", score: 3 },
    { championId: "varus", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "sivir", score: 3 },
    { championId: "wukong", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "followUp", strength: 4 },
    { type: "reliableCC", strength: 4 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

  stats: {
    picks: 3,
    bans: 0,
    presence: 3,
    prioScore: 2,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 2.8,
    avgBanTurn: null,
    avgPickRound: 3.33,
    blindPickRate: 33.3,
    averageGameTime: "30:20",
    csPerMinute: 1.1,
    damagePerMinute: 126,
    goldPerMinute: 255,
    csDiffAt15: -1,
    goldDiffAt15: -35,
    xpDiffAt15: 106,
    soloqKrChallengerWinRate: 59.93,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "lux", level: 2, phase: "lane" },
        { championId: "sona", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 5,
        bans: null,
        presence: 5,
        prioScore: 3,
        wins: 2,
        losses: 3,
        proWinRate: 40,
        kda: 2.1,
        avgBanTurn: null,
        avgPickRound: 2.6,
        blindPickRate: 20,
        averageGameTime: "30:48",
        csPerMinute: 1.1,
        damagePerMinute: 129,
        goldPerMinute: 251,
        csDiffAt15: 1,
        goldDiffAt15: -124,
        xpDiffAt15: -69,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
