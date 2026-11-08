import { createChampion } from "./_helpers";

export const draven = createChampion({
  id: "draven",
  name: "Draven",
  image: "/champions/draven.png",
  roles: ["adc"],
  damageProfile: ["AD"],
  attackType: "ranged",

  synergyWith: [
    { championId: "nautilus", score: 5 },
    { championId: "leona", score: 5 },
    { championId: "blitzcrank", score: 4 },
    { championId: "pyke", score: 4 },
    { championId: "thresh", score: 4 },
    { championId: "rell", score: 3 },
    { championId: "alistar", score: 3 },
    { championId: "pantheon", score: 3 },
  ],

  offers: [
    { type: "earlyPrio", strength: 5 },
    { type: "sustainedDamage", strength: 5 },
    { type: "burstDamage", strength: 4 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "peel", severity: 2 }
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 1,
    bans: 5,
    presence: 6,
    prioScore: 8,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 7,
    avgBanTurn: 7.4,
    avgPickRound: 1,
    blindPickRate: 0,
    averageGameTime: "30:14",
    csPerMinute: 10,
    damagePerMinute: 444,
    goldPerMinute: 504,
    csDiffAt15: -11,
    goldDiffAt15: -280,
    xpDiffAt15: 50,
    soloqKrChallengerWinRate: 55.06,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "aphelios", level: 2, phase: "lane" },
        { championId: "ezreal", level: 2, phase: "lane" },
        { championId: "jhin", level: 2, phase: "lane" },
        { championId: "jinx", level: 2, phase: "lane" },
        { championId: "kaisa", level: 2, phase: "lane" },
        { championId: "smolder", level: 2, phase: "lane" },
        { championId: "yunara", level: 2, phase: "lane" },
        { championId: "zeri", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 6,
        prioScore: 7,
        wins: 1,
        losses: 0,
        proWinRate: 100,
        kda: 7,
        avgBanTurn: null,
        avgPickRound: 1,
        blindPickRate: 0,
        averageGameTime: "30:14",
        csPerMinute: 10,
        damagePerMinute: 444,
        goldPerMinute: 504,
        csDiffAt15: -11,
        goldDiffAt15: -280,
        xpDiffAt15: 50,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
