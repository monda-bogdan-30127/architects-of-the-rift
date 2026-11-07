import { createChampion } from "./_helpers";

export const kled = createChampion({
  id: "kled",
  name: "Kled",
  image: "/champions/kled.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "twisted-fate", score: 5 },
    { championId: "taliyah", score: 5 },
    { championId: "nocturne", score: 4 },
    { championId: "pantheon", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "burstDamage", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 3,
    bans: 1,
    presence: 4,
    prioScore: 4,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 3,
    avgBanTurn: 8,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "37:58",
    csPerMinute: 7.6,
    damagePerMinute: 424,
    goldPerMinute: 362,
    csDiffAt15: -4.7,
    goldDiffAt15: 123,
    xpDiffAt15: -108,
    soloqKrChallengerWinRate: 57.02,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "aatrox", score: 2 },
        { championId: "dr-mundo", score: 2 },
        { championId: "renekton", score: 1 },
      ],
      weakVs: [
        { championId: "sion", score: 3 },
        { championId: "gangplank", score: 2 },
        { championId: "gnar", score: 2 },
        { championId: "rumble", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
