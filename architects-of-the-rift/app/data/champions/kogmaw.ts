import { createChampion } from "./_helpers";

export const kogmaw = createChampion({
  id: "kogmaw",
  name: "Kog'Maw",
  image: "/champions/kog'maw.png",
  roles: ["adc"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "nami", score: 5 },
    { championId: "tahm-kench", score: 3 },
    { championId: "janna", score: 4 }
  ],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "scaling", strength: 5 },
    { type: "siege", strength: 4 }
  ],

  needs: [
    { type: "peel", priority: 3 },
    { type: "frontline", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 4, con: 4 },

  stats: {
    picks: 3,
    bans: 1,
    presence: 4,
    prioScore: 3,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 3.2,
    avgBanTurn: 7,
    avgPickRound: 2.67,
    blindPickRate: 66.7,
    averageGameTime: "30:13",
    csPerMinute: 8.8,
    damagePerMinute: 1138,
    goldPerMinute: 445,
    csDiffAt15: 0.3,
    goldDiffAt15: 234,
    xpDiffAt15: -248,
    soloqKrChallengerWinRate: 56.98,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "caitlyn", score: 3 },
        { championId: "sivir", score: 3 },
        { championId: "tristana", score: 3 },
      ],
      weakVs: [
        { championId: "aphelios", score: 2 },
        { championId: "ezreal", score: 2 },
        { championId: "lucian", score: 2 },
        { championId: "xayah", score: 2 },
        { championId: "jinx", score: 1 },
      ],
      mustWith: ["lulu", "braum", "milio"],
      stats: null,
    },
  },
});
