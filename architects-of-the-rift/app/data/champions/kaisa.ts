import { createChampion } from "./_helpers";

export const kaisa = createChampion({
  id: "kaisa",
  name: "Kai'Sa",
  image: "/champions/kai'sa.png",
  roles: ["adc"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "nautilus", score: 5 },
    { championId: "alistar", score: 4 },
    { championId: "neeko", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "wukong", score: 3 },
  ],

  badSynergyWith: [
    { championId: "lulu", level: 3, note: "Kai'Sa vrea engage pentru all-in și R; Lulu nu oferă engage sau follow-up" },
    { championId: "karma", level: 3, note: "Kai'Sa vrea engage pentru all-in și R; Karma nu oferă engage sau follow-up" },
    { championId: "seraphine", level: 3, note: "Kai'Sa vrea engage pentru all-in și R; Seraphine nu oferă engage sau follow-up" },
  ],

  offers: [
    { type: "dive", strength: 4 },
    { type: "backlineAccess", strength: 4 },
    { type: "burstDamage", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 3 },
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

  stats: {
    picks: 10,
    bans: 3,
    presence: 13,
    prioScore: 15,
    wins: 5,
    losses: 5,
    proWinRate: 50,
    kda: 4.3,
    avgBanTurn: 7.3,
    avgPickRound: 1.6,
    blindPickRate: 20,
    averageGameTime: "32:12",
    csPerMinute: 10.4,
    damagePerMinute: 576,
    goldPerMinute: 502,
    csDiffAt15: -9.3,
    goldDiffAt15: -33,
    xpDiffAt15: -62,
    soloqKrChallengerWinRate: 52.99,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "senna", level: 2, phase: "all", note: "dive pe un carry imobil" },
        { championId: "ziggs", level: 2, phase: "all", note: "dive pe un mage imobil" },
        { championId: "caitlyn", level: 2, phase: "late" },
      ],
      stats: {
        picks: 11,
        bans: null,
        presence: 15,
        prioScore: 15,
        wins: 6,
        losses: 5,
        proWinRate: 55,
        kda: 4.9,
        avgBanTurn: null,
        avgPickRound: 1.64,
        blindPickRate: 27.3,
        averageGameTime: "31:58",
        csPerMinute: 10.5,
        damagePerMinute: 586,
        goldPerMinute: 512,
        csDiffAt15: -5.4,
        goldDiffAt15: 157,
        xpDiffAt15: 50,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
