import { createChampion } from "./_helpers";

export const hwei = createChampion({
  id: "hwei",
  name: "Hwei",
  image: "/champions/hwei.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "sejuani", score: 5 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "ornn", score: 3 },
    { championId: "maokai", score: 3 },
    { championId: "malphite", score: 3 },
  ],

  offers: [
    { type: "waveclear", strength: 5 },
    { type: "poke", strength: 4 },
    { type: "zoneControl", strength: 4 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 0.2,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "27:26",
    csPerMinute: 9.1,
    damagePerMinute: 576,
    goldPerMinute: 347,
    csDiffAt15: -10,
    goldDiffAt15: -1438,
    xpDiffAt15: -753,
    soloqKrChallengerWinRate: 52.85,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "akali", score: 2 },
        { championId: "aurora", score: 2 },
        { championId: "viktor", score: 2 },
      ],
      weakVs: [
        { championId: "galio", score: 4, note: "MR și engage pe un mage imobil" },
        { championId: "aurelion-sol", score: 3 },
        { championId: "ahri", score: 2 },
        { championId: "twisted-fate", score: 2 },
        { championId: "yone", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
