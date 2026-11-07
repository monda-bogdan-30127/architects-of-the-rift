import { createChampion } from "./_helpers";

export const taliyah = createChampion({
  id: "taliyah",
  name: "Taliyah",
  image: "/champions/taliyah.png",
  roles: ["mid", "adc"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "pantheon", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "sejuani", score: 3 },
    { championId: "kaisa", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "zoneControl", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "waveclear", strength: 4 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "disengage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 6,
    bans: 4,
    presence: 10,
    prioScore: 9,
    wins: 4,
    losses: 2,
    proWinRate: 67,
    kda: 3.7,
    avgBanTurn: 9.3,
    avgPickRound: 2.83,
    blindPickRate: 0,
    averageGameTime: "35:02",
    csPerMinute: 8.8,
    damagePerMinute: 596,
    goldPerMinute: 392,
    csDiffAt15: 0.2,
    goldDiffAt15: 59,
    xpDiffAt15: -94,
    soloqKrChallengerWinRate: 58,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "hwei", level: 2, phase: "lane" },
        { championId: "viktor", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "kassadin", level: 2, phase: "late" },
        { championId: "ziggs", level: 2, phase: "lane" },
        { championId: "leblanc", level: 1, phase: "all" },
        { championId: "yone", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 8,
        bans: null,
        presence: 12,
        prioScore: 8,
        wins: 5,
        losses: 3,
        proWinRate: 63,
        kda: 3.7,
        avgBanTurn: null,
        avgPickRound: 2.88,
        blindPickRate: 0,
        averageGameTime: "35:03",
        csPerMinute: 8.8,
        damagePerMinute: 622,
        goldPerMinute: 395,
        csDiffAt15: -0.1,
        goldDiffAt15: -10,
        xpDiffAt15: -52,
        soloqKrChallengerWinRate: null,
      },
    },
    adc: {
      goodVs: [],
      weakVs: [
        { championId: "ziggs", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
