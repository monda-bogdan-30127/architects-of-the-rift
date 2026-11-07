import { createChampion } from "./_helpers";

export const blitzcrank = createChampion({
  id: "blitzcrank",
  name: "Blitzcrank",
  image: "/champions/blitzcrank.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "draven", score: 5 },
    { championId: "samira", score: 5 },
    { championId: "jhin", score: 4 },
    { championId: "miss-fortune", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "tristana", score: 3 },
    { championId: "caitlyn", score: 3 },
    { championId: "twitch", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "reliableCC", strength: 4 },
    { type: "roamPressure", strength: 2 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mec: 3, mac: 4, clt: 4, iq: 4 },

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
    soloqKrChallengerWinRate: 57.25,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "karma", score: 2 },
      ],
      weakVs: [
        { championId: "alistar", score: 2 },
        { championId: "ashe", score: 2 },
        { championId: "leona", score: 2 },
        { championId: "nautilus", score: 2 },
        { championId: "rakan", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
