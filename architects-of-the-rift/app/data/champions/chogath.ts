import { createChampion } from "./_helpers";

export const chogath = createChampion({
  id: "chogath",
  name: "Cho'Gath",
  image: "/champions/cho'gath.png",
  roles: ["top", "jungle", "mid"],
  damageProfile: ["AP", "TRUE"],

  synergyWith: [
    { championId: "janna", score: 4 },
    { championId: "xayah", score: 5 },
    { championId: "rakan", score: 5 },
    { championId: "zac", score: 4 },
    { championId: "maokai", score: 4 },
    { championId: "cassiopeia", score: 4 },
    { championId: "ashe", score: 4 },
    { championId: "vi", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "pick", strength: 3 },
    { type: "zoneControl", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 2,
    bans: 0,
    presence: 2,
    prioScore: 1,
    wins: 1,
    losses: 1,
    proWinRate: 50,
    kda: 3,
    avgBanTurn: null,
    avgPickRound: 3,
    blindPickRate: 0,
    averageGameTime: "35:26",
    csPerMinute: 7.1,
    damagePerMinute: 414,
    goldPerMinute: 392,
    csDiffAt15: -10,
    goldDiffAt15: -630,
    xpDiffAt15: -488,
    soloqKrChallengerWinRate: 53.39,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "jayce", score: 3 },
        { championId: "renekton", score: 3 },
        { championId: "jax", score: 2 },
      ],
      weakVs: [
        { championId: "dr-mundo", score: 3 },
        { championId: "yorick", score: 3 },
        { championId: "aatrox", score: 2 },
        { championId: "kennen", score: 2 },
        { championId: "rumble", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [],
      weakVs: [
        { championId: "dr-mundo", score: 3 },
        { championId: "aatrox", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    mid: {
      goodVs: [
        { championId: "katarina", score: 4, note: "silence-ul și knock-up-ul întrerup ult-ul Katarinei" },
      ],
      weakVs: [
        { championId: "xerath", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
