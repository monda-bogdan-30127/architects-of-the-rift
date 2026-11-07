import { createChampion } from "./_helpers";

export const locke = createChampion({
  id: "locke",
  name: "Locke",
  image: "/champions/locke.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "sejuani", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "nami", score: 4 },
    { championId: "braum", score: 4 },
    { championId: "milio", score: 4 },
    { championId: "sivir", score: 4 },
    { championId: "lee-sin", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "backlineAccess", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "pick", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 3 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 }
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 11,
    bans: 25,
    presence: 36,
    prioScore: 43,
    wins: 6,
    losses: 5,
    proWinRate: 55,
    kda: 3.2,
    avgBanTurn: 6.2,
    avgPickRound: 1.73,
    blindPickRate: 27.3,
    averageGameTime: "32:07",
    csPerMinute: 8.3,
    damagePerMinute: 529,
    goldPerMinute: 418,
    csDiffAt15: -13,
    goldDiffAt15: -190,
    xpDiffAt15: -291,
    soloqKrChallengerWinRate: null,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "aurora", level: 2, phase: "lane" },
        { championId: "hwei", level: 2, phase: "lane" },
        { championId: "orianna", level: 2, phase: "lane" },
        { championId: "syndra", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "lissandra", level: 2, phase: "all", note: "CC point-click pe un asasin" },
        { championId: "ahri", level: 2, phase: "lane" },
        { championId: "leblanc", level: 2, phase: "lane" },
        { championId: "viktor", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: {
        picks: 11,
        bans: null,
        presence: 42,
        prioScore: 45,
        wins: 6,
        losses: 5,
        proWinRate: 55,
        kda: 3.2,
        avgBanTurn: null,
        avgPickRound: 1.73,
        blindPickRate: 27.3,
        averageGameTime: "32:07",
        csPerMinute: 8.3,
        damagePerMinute: 529,
        goldPerMinute: 418,
        csDiffAt15: -13,
        goldDiffAt15: -190,
        xpDiffAt15: -291,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
