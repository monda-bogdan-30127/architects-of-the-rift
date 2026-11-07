import { createChampion } from "./_helpers";

export const ornn = createChampion({
  id: "ornn",
  name: "Ornn",
  image: "/champions/ornn.png",
  roles: ["top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "pantheon", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "orianna", score: 4 },
    { championId: "azir", score: 3 },
    { championId: "jinx", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "engage", strength: 4 },
    { type: "reliableCC", strength: 4 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 4, con: 5, iq: 4 },

  stats: {
    picks: 8,
    bans: 1,
    presence: 9,
    prioScore: 8,
    wins: 5,
    losses: 3,
    proWinRate: 63,
    kda: 2.4,
    avgBanTurn: 8,
    avgPickRound: 1.75,
    blindPickRate: 12.5,
    averageGameTime: "30:51",
    csPerMinute: 7.8,
    damagePerMinute: 356,
    goldPerMinute: 343,
    csDiffAt15: -7.2,
    goldDiffAt15: -561,
    xpDiffAt15: -368,
    soloqKrChallengerWinRate: 59.4,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "aatrox", score: 3 },
        { championId: "gnar", score: 1 },
        { championId: "ksante", score: 1 },
        { championId: "volibear", score: 1 },
      ],
      weakVs: [
        { championId: "gwen", score: 4, note: "damage pe %HP contra tank-ului" },
        { championId: "jax", score: 3 },
        { championId: "jayce", score: 2 },
        { championId: "poppy", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
