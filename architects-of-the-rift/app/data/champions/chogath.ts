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
        { championId: "jayce", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "late" },
        { championId: "jax", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "dr-mundo", level: 2, phase: "late" },
        { championId: "yorick", level: 2, phase: "late" },
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "kennen", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [],
      weakVs: [
        { championId: "dr-mundo", level: 2, phase: "late" },
        { championId: "aatrox", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: {
        picks: 2,
        bans: null,
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
        soloqKrChallengerWinRate: null,
      },
    },
    mid: {
      goodVs: [
        { championId: "katarina", level: 2, phase: "all", note: "silence-ul și knock-up-ul întrerup ult-ul Katarinei" },
      ],
      weakVs: [
        { championId: "xerath", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
