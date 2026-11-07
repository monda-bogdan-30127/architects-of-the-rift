import { createChampion } from "./_helpers";

export const kalista = createChampion({
  id: "kalista",
  name: "Kalista",
  image: "/champions/kalista.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "leona", score: 5 },
    { championId: "nautilus", score: 5 },
    { championId: "renata-glasc", score: 5 },
    { championId: "alistar", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "blitzcrank", score: 3 },
    { championId: "taric", score: 3 },
    { championId: "thresh", score: 3 },
  ],

  offers: [
    { type: "earlyPrio", strength: 5 },
    { type: "objectiveControl", strength: 4 },
    { type: "followUp", strength: 3 },
    { type: "engage", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

  stats: {
    picks: 16,
    bans: 2,
    presence: 18,
    prioScore: 19,
    wins: 8,
    losses: 8,
    proWinRate: 50,
    kda: 3,
    avgBanTurn: 7,
    avgPickRound: 1.5,
    blindPickRate: 66.7,
    averageGameTime: "36:36",
    csPerMinute: 10.2,
    damagePerMinute: 548,
    goldPerMinute: 471,
    csDiffAt15: -0.7,
    goldDiffAt15: -278,
    xpDiffAt15: -324,
    soloqKrChallengerWinRate: 52.87,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "ashe", level: 2, phase: "lane" },
        { championId: "yunara", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 16,
        bans: null,
        presence: 18,
        prioScore: 17,
        wins: 8,
        losses: 8,
        proWinRate: 50,
        kda: 3,
        avgBanTurn: null,
        avgPickRound: 1.5,
        blindPickRate: 66.7,
        averageGameTime: "36:36",
        csPerMinute: 10.2,
        damagePerMinute: 548,
        goldPerMinute: 471,
        csDiffAt15: -0.7,
        goldDiffAt15: -278,
        xpDiffAt15: -324,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
