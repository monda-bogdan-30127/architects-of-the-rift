import { createChampion } from "./_helpers";

export const corki = createChampion({
  id: "corki",
  name: "Corki",
  image: "/champions/corki.png",
  roles: ["adc"],
  damageProfile: ["AD", "TRUE"],
  attackType: "ranged",

  synergyWith: [
    { championId: "nami", score: 5 },
    { championId: "karma", score: 4 },
    { championId: "bard", score: 4 },
    { championId: "renata-glasc", score: 3 },
    { championId: "braum", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "orianna", score: 3 },
  ],

  offers: [
    { type: "poke", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "waveclear", strength: 3 },
    { type: "siege", strength: 3 }
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
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

  stats: {
    picks: 5,
    bans: 2,
    presence: 7,
    prioScore: 7,
    wins: 4,
    losses: 1,
    proWinRate: 80,
    kda: 8.5,
    avgBanTurn: 8.5,
    avgPickRound: 1.8,
    blindPickRate: 40,
    averageGameTime: "32:26",
    csPerMinute: 10.3,
    damagePerMinute: 694,
    goldPerMinute: 510,
    csDiffAt15: 2.2,
    goldDiffAt15: 144,
    xpDiffAt15: -17,
    soloqKrChallengerWinRate: 57.57,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "kogmaw", level: 2, phase: "lane" },
        { championId: "jhin", level: 1, phase: "lane" },
        { championId: "ezreal", level: 1, phase: "all" },
      ],
      stats: {
        picks: 7,
        bans: null,
        presence: 9,
        prioScore: 8,
        wins: 4,
        losses: 3,
        proWinRate: 57,
        kda: 5.5,
        avgBanTurn: null,
        avgPickRound: 1.86,
        blindPickRate: 28.6,
        averageGameTime: "32:43",
        csPerMinute: 10.1,
        damagePerMinute: 628,
        goldPerMinute: 480,
        csDiffAt15: -0.7,
        goldDiffAt15: -12,
        xpDiffAt15: -80,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
