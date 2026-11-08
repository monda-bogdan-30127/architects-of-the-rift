import { createChampion } from "./_helpers";

export const fiora = createChampion({
  id: "fiora",
  name: "Fiora",
  image: "/champions/fiora.png",
  roles: ["top"],
  damageProfile: ["AD", "TRUE"],
  attackType: "melee",

  synergyWith: [
    { championId: "sejuani", score: 5 },
    { championId: "braum", score: 5 },
    { championId: "lee-sin", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "twisted-fate", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "galio", score: 3 },
  ],

  offers: [
    { type: "splitpush", strength: 5 },
    { type: "sideLanePressure", strength: 5 },
    { type: "sustainedDamage", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "siege", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 3, clt: 3, con: 3 },

  stats: {
    picks: 0,
    bans: 0,
    presence: 0,
    prioScore: 0,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: null,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 58.22,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "aatrox", level: 2, phase: "all", note: "parry pe Q3 și vitals" },
        { championId: "chogath", level: 2, phase: "all", note: "vitals contra tank-ului" },
        { championId: "dr-mundo", level: 2, phase: "all", note: "vitals = true damage pe %HP contra lui Mundo" },
        { championId: "ksante", level: 2, phase: "all", note: "vitals = true damage pe %HP contra tank-ului" },
        { championId: "malphite", level: 2, phase: "all", note: "vitals ignoră armura" },
        { championId: "ornn", level: 2, phase: "all", note: "vitals = true damage pe %HP contra tank-ului" },
        { championId: "sion", level: 2, phase: "all", note: "vitals contra tank-ului" },
        { championId: "darius", level: 1, phase: "all" },
      ],
      stats: null,
    },
  },
});
