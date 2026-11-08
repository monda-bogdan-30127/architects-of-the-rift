import { createChampion } from "./_helpers";

export const thresh = createChampion({
  id: "thresh",
  name: "Thresh",
  image: "/champions/thresh.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "draven", score: 5 },
    { championId: "jhin", score: 5 },
    { championId: "caitlyn", score: 4 },
    { championId: "lucian", score: 4 },
    { championId: "aphelios", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "varus", score: 3 },
    { championId: "tristana", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "peel", strength: 3 },
    { type: "reliableCC", strength: 4 },
    { type: "disengage", strength: 2 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 0,
    bans: 0,
    presence: 0,
    prioScore: 0,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: null,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 58.57,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "sona", level: 2, phase: "lane" },
        { championId: "soraka", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 0,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 2,
        avgBanTurn: null,
        avgPickRound: 3,
        blindPickRate: 0,
        averageGameTime: "32:36",
        csPerMinute: 1,
        damagePerMinute: 108,
        goldPerMinute: 242,
        csDiffAt15: 10,
        goldDiffAt15: -152,
        xpDiffAt15: 263,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
