import { createChampion } from "./_helpers";

export const varus = createChampion({
  id: "varus",
  name: "Varus",
  image: "/champions/varus.png",
  roles: ["adc"],
  damageProfile: ["AD", "AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "nautilus", score: 4 },
    { championId: "karma", score: 4 },
    { championId: "renata-glasc", score: 3 },
    { championId: "braum", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "alistar", score: 3 },
    { championId: "orianna", score: 3 },
  ],

  offers: [
    { type: "poke", strength: 5 },
    { type: "objectiveControl", strength: 4 },
    { type: "siege", strength: 4 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "peel", priority: 2 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 3, con: 4 },

  stats: {
    picks: 2,
    bans: 1,
    presence: 3,
    prioScore: 3,
    wins: 2,
    losses: 0,
    proWinRate: 100,
    kda: 6.3,
    avgBanTurn: 10,
    avgPickRound: 1.5,
    blindPickRate: 0,
    averageGameTime: "35:27",
    csPerMinute: 10.2,
    damagePerMinute: 789,
    goldPerMinute: 524,
    csDiffAt15: -11.5,
    goldDiffAt15: -974,
    xpDiffAt15: 268,
    soloqKrChallengerWinRate: 55,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "jinx", level: 2, phase: "lane" },
        { championId: "kaisa", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 2,
        bans: null,
        presence: 3,
        prioScore: 3,
        wins: 2,
        losses: 0,
        proWinRate: 100,
        kda: 6.3,
        avgBanTurn: null,
        avgPickRound: 1.5,
        blindPickRate: 0,
        averageGameTime: "35:27",
        csPerMinute: 10.2,
        damagePerMinute: 789,
        goldPerMinute: 524,
        csDiffAt15: -11.5,
        goldDiffAt15: -974,
        xpDiffAt15: 268,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
