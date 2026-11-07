import { createChampion } from "./_helpers";

export const kaisa = createChampion({
  id: "kaisa",
  name: "Kai'Sa",
  image: "/champions/kai'sa.png",
  roles: ["adc"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "rell", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "leona", score: 3 },
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
        { championId: "ezreal", score: 3 },
        { championId: "samira", score: 1 },
      ],
      weakVs: [
        { championId: "aphelios", score: 2 },
        { championId: "kalista", score: 2 },
        { championId: "lucian", score: 2 },
        { championId: "jinx", score: 1 },
        { championId: "zeri", score: 1 },
      ],
      mustWith: ["nautilus", "neeko", "alistar"],
      stats: null,
    },
  },
});
