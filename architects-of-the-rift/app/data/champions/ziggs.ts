import { createChampion } from "./_helpers";

export const ziggs = createChampion({
  id: "ziggs",
  name: "Ziggs",
  image: "/champions/ziggs.png",
  roles: ["adc", "mid"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "amumu", score: 5 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "bard", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "orianna", score: 3 },
  ],

  badSynergyWith: [
    { championId: "lulu", level: 3, note: "Lulu's buffs (W, E) are for auto-attackers; Ziggs is a mage" },
  ],

  offers: [
    { type: "poke", strength: 4 },
    { type: "scaling", strength: 4 },
    { type: "siege", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "waveclear", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 5,
    bans: 1,
    presence: 6,
    prioScore: 5,
    wins: 1,
    losses: 4,
    proWinRate: 20,
    kda: 1.7,
    avgBanTurn: 8,
    avgPickRound: 2.8,
    blindPickRate: 60,
    averageGameTime: "31:44",
    csPerMinute: 9.8,
    damagePerMinute: 633,
    goldPerMinute: 411,
    csDiffAt15: 2.8,
    goldDiffAt15: -258,
    xpDiffAt15: 145,
    soloqKrChallengerWinRate: 59.75,
  },

  roleData: {
    adc: {
      goodVs: [],
      stats: {
        picks: 5,
        bans: null,
        presence: 6,
        prioScore: 4,
        wins: 1,
        losses: 4,
        proWinRate: 20,
        kda: 1.7,
        avgBanTurn: null,
        avgPickRound: 2.8,
        blindPickRate: 60,
        averageGameTime: "31:44",
        csPerMinute: 9.8,
        damagePerMinute: 633,
        goldPerMinute: 411,
        csDiffAt15: 2.8,
        goldDiffAt15: -258,
        xpDiffAt15: 145,
        soloqKrChallengerWinRate: null,
      },
    },
    mid: {
      goodVs: [],
      stats: null,
    },
  },
});
