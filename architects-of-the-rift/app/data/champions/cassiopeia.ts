import { createChampion } from "./_helpers";

export const cassiopeia = createChampion({
  id: "cassiopeia",
  name: "Cassiopeia",
  image: "/champions/cassiopeia.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "skarner", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "vi", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "lulu", score: 3 },
    { championId: "wukong", score: 2 },
    { championId: "qiyana", score: 2 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "zoneControl", strength: 4 },
    { type: "scaling", strength: 5 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 13,
    bans: 38,
    presence: 51,
    prioScore: 66,
    wins: 8,
    losses: 5,
    proWinRate: 62,
    kda: 4.1,
    avgBanTurn: 3.9,
    avgPickRound: 1.08,
    blindPickRate: 72.7,
    averageGameTime: "34:09",
    csPerMinute: 8.7,
    damagePerMinute: 573,
    goldPerMinute: 405,
    csDiffAt15: 8.2,
    goldDiffAt15: 233,
    xpDiffAt15: 81,
    soloqKrChallengerWinRate: 57.03,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurora", score: 2 },
        { championId: "yone", score: 2 },
      ],
      weakVs: [
        { championId: "galio", score: 4, note: "pasivul de MR și engage pe un mage imobil" },
        { championId: "aurelion-sol", score: 3 },
        { championId: "anivia", score: 2 },
        { championId: "malzahar", score: 2 },
        { championId: "yasuo", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
