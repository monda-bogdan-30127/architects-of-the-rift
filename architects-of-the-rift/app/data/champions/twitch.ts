import { createChampion } from "./_helpers";

export const twitch = createChampion({
  id: "twitch",
  name: "Twitch",
  image: "/champions/twitch.png",
  roles: ["adc"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "janna", score: 5 },
    { championId: "yuumi", score: 5 },
    { championId: "tahm-kench", score: 5 },
    { championId: "lulu", score: 4 },
    { championId: "sejuani", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "cassiopeia", score: 4 },
    { championId: "twisted-fate", score: 3 },
  ],

  offers: [
    { type: "scaling", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "sustainedDamage", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "peel", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 0,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 0.8,
    avgBanTurn: null,
    avgPickRound: 3,
    blindPickRate: 0,
    averageGameTime: "26:51",
    csPerMinute: 8.6,
    damagePerMinute: 379,
    goldPerMinute: 346,
    csDiffAt15: -29,
    goldDiffAt15: -1700,
    xpDiffAt15: -1972,
    soloqKrChallengerWinRate: 51.8,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "lucian", level: 2, phase: "late" },
        { championId: "xayah", level: 2, phase: "lane" },
        { championId: "jinx", level: 1, phase: "all" },
        { championId: "kogmaw", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "aphelios", level: 2, phase: "lane" },
        { championId: "jhin", level: 2, phase: "lane" },
        { championId: "varus", level: 2, phase: "lane" },
        { championId: "zeri", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 0,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 0.8,
        avgBanTurn: null,
        avgPickRound: 3,
        blindPickRate: 0,
        averageGameTime: "26:51",
        csPerMinute: 8.6,
        damagePerMinute: 379,
        goldPerMinute: 346,
        csDiffAt15: -29,
        goldDiffAt15: -1700,
        xpDiffAt15: -1972,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
