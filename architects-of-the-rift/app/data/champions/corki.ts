import { createChampion } from "./_helpers";

export const corki = createChampion({
  id: "corki",
  name: "Corki",
  image: "/champions/corki.png",
  roles: ["adc"],
  damageProfile: ["AD", "TRUE"],

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
        { championId: "jhin", score: 2 },
        { championId: "jinx", score: 2 },
        { championId: "tristana", score: 2 },
        { championId: "yunara", score: 2 },
        { championId: "zeri", score: 2 },
      ],
      weakVs: [
        { championId: "kaisa", score: 3 },
        { championId: "caitlyn", score: 2 },
        { championId: "kalista", score: 2 },
        { championId: "lucian", score: 2 },
        { championId: "varus", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
