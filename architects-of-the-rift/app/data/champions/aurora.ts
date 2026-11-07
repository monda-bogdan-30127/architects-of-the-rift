import { createChampion } from "./_helpers";

export const aurora = createChampion({
  id: "aurora",
  name: "Aurora",
  image: "/champions/aurora.png",
  roles: ["mid", "top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "sejuani", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "alistar", score: 3 },
    { championId: "vi", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "zoneControl", strength: 3 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, con: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 3,
    presence: 7,
    prioScore: 8,
    wins: 2,
    losses: 2,
    proWinRate: 50,
    kda: 3.4,
    avgBanTurn: 8.7,
    avgPickRound: 1.75,
    blindPickRate: 50,
    averageGameTime: "29:49",
    csPerMinute: 8.9,
    damagePerMinute: 746,
    goldPerMinute: 406,
    csDiffAt15: 0,
    goldDiffAt15: 438,
    xpDiffAt15: 156,
    soloqKrChallengerWinRate: 53.81,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "viktor", score: 2 },
      ],
      weakVs: [
        { championId: "galio", score: 4, note: "pasivul de MR și engage-ul anulează burst-ul" },
        { championId: "annie", score: 2 },
        { championId: "orianna", score: 2 },
        { championId: "taliyah", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [],
      weakVs: [
        { championId: "galio", score: 4, note: "pasivul de MR și engage-ul anulează burst-ul" },
        { championId: "gnar", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
