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
        { championId: "aurora", level: 2, phase: "lane" },
        { championId: "galio", level: 2, phase: "lane" },
        { championId: "yone", level: 2, phase: "lane" },
        { championId: "annie", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "akali", level: 2, phase: "lane" },
        { championId: "azir", level: 2, phase: "lane" },
        { championId: "hwei", level: 2, phase: "lane" },
        { championId: "ryze", level: 2, phase: "lane" },
        { championId: "syndra", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    adc: {
      goodVs: [],
      weakVs: [
        { championId: "syndra", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
