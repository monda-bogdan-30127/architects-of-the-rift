import { createChampion } from "./_helpers";

export const camille = createChampion({
  id: "camille",
  name: "Camille",
  image: "/champions/camille.png",
  roles: ["top", "support"],
  damageProfile: ["AD", "TRUE"],

  synergyWith: [
    { championId: "galio", score: 5 },
    { championId: "taliyah", score: 5 },
    { championId: "twisted-fate", score: 5 },
    { championId: "nocturne", score: 4 },
    { championId: "shen", score: 4 },
    { championId: "sylas", score: 3 },
    { championId: "ahri", score: 3 },
    { championId: "leblanc", score: 3 },
  ],

  offers: [
    { type: "backlineAccess", strength: 5 },
    { type: "dive", strength: 5 },
    { type: "splitpush", strength: 4 },
    { type: "sideLanePressure", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 2 },
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
  ],

  playerScaling: { mec: 5, tfg: 3, clt: 3, con: 3 },

  stats: {
    picks: 10,
    bans: 10,
    presence: 20,
    prioScore: 21,
    wins: 5,
    losses: 5,
    proWinRate: 50,
    kda: 2.8,
    avgBanTurn: 7.5,
    avgPickRound: 1.9,
    blindPickRate: 50,
    averageGameTime: "32:00",
    csPerMinute: 6.9,
    damagePerMinute: 525,
    goldPerMinute: 393,
    csDiffAt15: -9.1,
    goldDiffAt15: -287,
    xpDiffAt15: -559,
    soloqKrChallengerWinRate: 55.22,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ksante", score: 3 },
        { championId: "ornn", score: 3 },
      ],
      weakVs: [
        { championId: "olaf", score: 4, note: "ult-ul ignoră stun-ul și ult-ul Camillei" },
        { championId: "gwen", score: 3 },
        { championId: "jax", score: 3 },
        { championId: "vladimir", score: 3 },
        { championId: "shen", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
    support: {
      goodVs: [],
      weakVs: [
        { championId: "shen", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
