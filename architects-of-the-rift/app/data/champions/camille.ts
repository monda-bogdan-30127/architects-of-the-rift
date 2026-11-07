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
        { championId: "ksante", level: 2, phase: "late" },
        { championId: "ornn", level: 2, phase: "late" },
      ],
      weakVs: [
        { championId: "olaf", level: 2, phase: "all", note: "ult-ul ignoră stun-ul și ult-ul Camillei" },
        { championId: "gwen", level: 2, phase: "late" },
        { championId: "jax", level: 2, phase: "late" },
        { championId: "vladimir", level: 2, phase: "late" },
        { championId: "shen", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 9,
        bans: null,
        presence: 20,
        prioScore: 20,
        wins: 5,
        losses: 4,
        proWinRate: 56,
        kda: 3.1,
        avgBanTurn: null,
        avgPickRound: 1.89,
        blindPickRate: 42.9,
        averageGameTime: "33:30",
        csPerMinute: 8.2,
        damagePerMinute: 561,
        goldPerMinute: 409,
        csDiffAt15: -13.9,
        goldDiffAt15: -496,
        xpDiffAt15: -727,
        soloqKrChallengerWinRate: null,
      },
    },
    support: {
      goodVs: [],
      weakVs: [
        { championId: "shen", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 2,
        bans: null,
        presence: 13,
        prioScore: 13,
        wins: 1,
        losses: 1,
        proWinRate: 50,
        kda: 2,
        avgBanTurn: null,
        avgPickRound: 3,
        blindPickRate: 100,
        averageGameTime: "26:57",
        csPerMinute: 1.1,
        damagePerMinute: 330,
        goldPerMinute: 308,
        csDiffAt15: 0,
        goldDiffAt15: 106,
        xpDiffAt15: -244,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
