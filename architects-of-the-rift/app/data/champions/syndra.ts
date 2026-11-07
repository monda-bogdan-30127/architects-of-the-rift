import { createChampion } from "./_helpers";

export const syndra = createChampion({
  id: "syndra",
  name: "Syndra",
  image: "/champions/syndra.png",
  roles: ["mid", "adc"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "sejuani", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "lee-sin", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rakan", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "pick", strength: 3 },
    { type: "waveclear", strength: 4 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 20,
    bans: 25,
    presence: 45,
    prioScore: 56,
    wins: 12,
    losses: 8,
    proWinRate: 60,
    kda: 4,
    avgBanTurn: 3.7,
    avgPickRound: 1.25,
    blindPickRate: 84.2,
    averageGameTime: "32:29",
    csPerMinute: 8.9,
    damagePerMinute: 640,
    goldPerMinute: 408,
    csDiffAt15: 4.4,
    goldDiffAt15: 223,
    xpDiffAt15: 174,
    soloqKrChallengerWinRate: 54.74,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "azir", level: 2, phase: "lane" },
        { championId: "kogmaw", level: 2, phase: "lane" },
        { championId: "orianna", level: 2, phase: "lane" },
        { championId: "ryze", level: 2, phase: "lane" },
        { championId: "viktor", level: 2, phase: "lane" },
        { championId: "ahri", level: 1, phase: "all" },
      ],
      stats: {
        picks: 21,
        bans: null,
        presence: 52,
        prioScore: 57,
        wins: 12,
        losses: 9,
        proWinRate: 57,
        kda: 3.7,
        avgBanTurn: null,
        avgPickRound: 1.24,
        blindPickRate: 85,
        averageGameTime: "32:38",
        csPerMinute: 8.9,
        damagePerMinute: 633,
        goldPerMinute: 408,
        csDiffAt15: 4.8,
        goldDiffAt15: 242,
        xpDiffAt15: 181,
        soloqKrChallengerWinRate: null,
      },
    },
    adc: {
      goodVs: [
        { championId: "jinx", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
