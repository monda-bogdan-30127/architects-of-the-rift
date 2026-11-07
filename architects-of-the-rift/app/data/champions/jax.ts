import { createChampion } from "./_helpers";

export const jax = createChampion({
  id: "jax",
  name: "Jax",
  image: "/champions/jax.png",
  roles: ["top"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "sejuani", score: 4 },     // melee proc + lockdown
    { championId: "jarvan-iv", score: 4 },   // trap + free DPS
    { championId: "nocturne", score: 3 },    // dive follow-up
    { championId: "orianna", score: 4 },     // ball delivery
    { championId: "lulu", score: 3 },        // hypercarry enable
    { championId: "karma", score: 3 },       // mobility + shields
    { championId: "senna", score: 3 },       // scaling comp synergy
  ],

  offers: [
    { type: "splitpush", strength: 5 },
    { type: "sideLanePressure", strength: 5 },
    { type: "sustainedDamage", strength: 4 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, clt: 3, con: 3 },

  stats: {
    picks: 5,
    bans: 8,
    presence: 13,
    prioScore: 14,
    wins: 2,
    losses: 3,
    proWinRate: 40,
    kda: 1.8,
    avgBanTurn: 8.8,
    avgPickRound: 2.4,
    blindPickRate: 40,
    averageGameTime: "32:34",
    csPerMinute: 8.5,
    damagePerMinute: 519,
    goldPerMinute: 401,
    csDiffAt15: -3.6,
    goldDiffAt15: 279,
    xpDiffAt15: -223,
    soloqKrChallengerWinRate: 56.29,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "aatrox", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "late" },
      ],
      weakVs: [
        { championId: "gangplank", level: 2, phase: "lane" },
        { championId: "gragas", level: 2, phase: "lane" },
        { championId: "kennen", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
        { championId: "ambessa", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
