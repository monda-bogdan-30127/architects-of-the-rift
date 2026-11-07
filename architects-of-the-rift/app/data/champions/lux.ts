import { createChampion } from "./_helpers";

export const lux = createChampion({
  id: "lux",
  name: "Lux",
  image: "/champions/lux.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "caitlyn", score: 5 },
    { championId: "jhin", score: 5 },
    { championId: "ezreal", score: 4 },
    { championId: "varus", score: 4 },
    { championId: "xerath", score: 3 },
    { championId: "nidalee", score: 3 },
    { championId: "jayce", score: 3 },
    { championId: "ziggs", score: 3 },
  ],

  offers: [
    { type: "poke", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "pick", strength: 3 },
    { type: "siege", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "peel", severity: 1 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 0,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 3.5,
    avgBanTurn: null,
    avgPickRound: 3,
    blindPickRate: 0,
    averageGameTime: "23:59",
    csPerMinute: 1.5,
    damagePerMinute: 193,
    goldPerMinute: 282,
    csDiffAt15: 1,
    goldDiffAt15: 127,
    xpDiffAt15: 174,
    soloqKrChallengerWinRate: 55.59,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "lulu", score: 2 },
        { championId: "nami", score: 2 },
        { championId: "yuumi", score: 2 },
      ],
      weakVs: [
        { championId: "blitzcrank", score: 4, note: "hook pe un support imobil" },
        { championId: "leona", score: 4, note: "engage pe un support imobil" },
        { championId: "nautilus", score: 4, note: "hook și CC point-click pe un support imobil" },
        { championId: "alistar", score: 2 },
        { championId: "braum", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
