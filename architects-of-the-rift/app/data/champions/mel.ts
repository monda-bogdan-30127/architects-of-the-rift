import { createChampion } from "./_helpers";

export const mel = createChampion({
  id: "mel",
  name: "Mel",
  image: "/champions/mel.png",
  roles: ["mid", "adc"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "ornn", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "vi", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "poke", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "waveclear", strength: 3 },
    { type: "scaling", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 }
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 0,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 1,
    avgBanTurn: null,
    avgPickRound: 3,
    blindPickRate: 0,
    averageGameTime: "36:15",
    csPerMinute: 8.8,
    damagePerMinute: 530,
    goldPerMinute: 382,
    csDiffAt15: 20,
    goldDiffAt15: 832,
    xpDiffAt15: 666,
    soloqKrChallengerWinRate: 50.98,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurora", score: 2 },
        { championId: "galio", score: 2 },
        { championId: "yone", score: 2 },
        { championId: "annie", score: 1 },
      ],
      weakVs: [
        { championId: "akali", score: 2 },
        { championId: "azir", score: 2 },
        { championId: "hwei", score: 2 },
        { championId: "ryze", score: 2 },
        { championId: "syndra", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    adc: {
      goodVs: [],
      weakVs: [
        { championId: "syndra", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
