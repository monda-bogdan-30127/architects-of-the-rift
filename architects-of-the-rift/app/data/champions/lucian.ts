import { createChampion } from "./_helpers";

export const lucian = createChampion({
  id: "lucian",
  name: "Lucian",
  image: "/champions/lucian.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "nami", score: 5 },
    { championId: "braum", score: 4 },
    { championId: "milio", score: 4 },
    { championId: "nautilus", score: 4 },
    { championId: "karma", score: 3 },
    { championId: "lulu", score: 3 },
    { championId: "yuumi", score: 3 },
    { championId: "leona", score: 2 },
  ],

  offers: [
    { type: "earlyPrio", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "peel", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

  stats: {
    picks: 15,
    bans: 5,
    presence: 20,
    prioScore: 17,
    wins: 7,
    losses: 8,
    proWinRate: 47,
    kda: 3.2,
    avgBanTurn: 5,
    avgPickRound: 2.2,
    blindPickRate: 50,
    averageGameTime: "33:05",
    csPerMinute: 10.2,
    damagePerMinute: 818,
    goldPerMinute: 469,
    csDiffAt15: 8.5,
    goldDiffAt15: 216,
    xpDiffAt15: 172,
    soloqKrChallengerWinRate: 57.47,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "aphelios", level: 2, phase: "lane" },
        { championId: "jhin", level: 2, phase: "lane" },
        { championId: "jinx", level: 2, phase: "lane" },
        { championId: "kaisa", level: 2, phase: "lane" },
        { championId: "kogmaw", level: 2, phase: "lane" },
        { championId: "nilah", level: 2, phase: "lane" },
        { championId: "smolder", level: 2, phase: "lane" },
        { championId: "xayah", level: 2, phase: "lane" },
        { championId: "yunara", level: 2, phase: "lane" },
        { championId: "ezreal", level: 1, phase: "all" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 16,
        bans: null,
        presence: 23,
        prioScore: 18,
        wins: 8,
        losses: 8,
        proWinRate: 50,
        kda: 3.5,
        avgBanTurn: null,
        avgPickRound: 2.25,
        blindPickRate: 53.3,
        averageGameTime: "33:04",
        csPerMinute: 10.2,
        damagePerMinute: 817,
        goldPerMinute: 470,
        csDiffAt15: 10.6,
        goldDiffAt15: 268,
        xpDiffAt15: 244,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
