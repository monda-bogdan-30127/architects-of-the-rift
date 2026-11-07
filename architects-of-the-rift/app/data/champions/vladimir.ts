import { createChampion } from "./_helpers";

export const vladimir = createChampion({
  id: "vladimir",
  name: "Vladimir",
  image: "/champions/vladimir.png",
  roles: ["mid", "top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "skarner", score: 5 },
    { championId: "thresh", score: 5 },
    { championId: "nami", score: 5 },
    { championId: "reksai", score: 4 },
    { championId: "sivir", score: 4 },
    { championId: "kalista", score: 4 },
    { championId: "renekton", score: 4 },
    { championId: "rumble", score: 4 },
  ],

  offers: [
    { type: "scaling", strength: 5 },
    { type: "sustainedDamage", strength: 4 },
    { type: "backlineAccess", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 56.55,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "azir", score: 3 },
        { championId: "viktor", score: 3 },
        { championId: "yasuo", score: 2 },
      ],
      weakVs: [
        { championId: "ahri", score: 2 },
        { championId: "anivia", score: 2 },
        { championId: "syndra", score: 2 },
        { championId: "zoe", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "poppy", score: 3 },
        { championId: "yasuo", score: 2 },
      ],
      weakVs: [
        { championId: "aatrox", score: 2 },
        { championId: "renekton", score: 2 },
        { championId: "urgot", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
