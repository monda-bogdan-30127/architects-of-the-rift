import { createChampion } from "./_helpers";

export const shen = createChampion({
  id: "shen",
  name: "Shen",
  image: "/champions/shen.png",
  roles: ["support", "top"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "nocturne", score: 5 },
    { championId: "twisted-fate", score: 5 },
    { championId: "galio", score: 5 },
    { championId: "taliyah", score: 4 },
    { championId: "lee-sin", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "xayah", score: 3 },
    { championId: "tristana", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "sideLanePressure", strength: 3 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "engage", severity: 1 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

  stats: {
    picks: 7,
    bans: 1,
    presence: 8,
    prioScore: 8,
    wins: 2,
    losses: 5,
    proWinRate: 29,
    kda: 2.9,
    avgBanTurn: 9,
    avgPickRound: 2.14,
    blindPickRate: 28.6,
    averageGameTime: "30:52",
    csPerMinute: 5.1,
    damagePerMinute: 297,
    goldPerMinute: 313,
    csDiffAt15: -11.6,
    goldDiffAt15: -194,
    xpDiffAt15: -346,
    soloqKrChallengerWinRate: 54.06,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "leona", score: 2 },
      ],
      weakVs: [
        { championId: "braum", score: 2 },
        { championId: "nautilus", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "gnar", score: 3 },
        { championId: "kennen", score: 1 },
        { championId: "ksante", score: 1 },
      ],
      weakVs: [
        { championId: "jax", score: 3 },
        { championId: "aatrox", score: 2 },
        { championId: "kled", score: 2 },
        { championId: "renekton", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
