import { createChampion } from "./_helpers";

export const jarvanIv = createChampion({
  id: "jarvan-iv",
  name: "Jarvan IV",
  image: "/champions/jarvan-iv.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "orianna", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "rumble", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "miss-fortune", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "neeko", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "dive", strength: 4 },
    { type: "reliableCC", strength: 3 },
    { type: "earlyPrio", strength: 4 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 21,
    bans: 22,
    presence: 43,
    prioScore: 50,
    wins: 12,
    losses: 9,
    proWinRate: 57,
    kda: 4.2,
    avgBanTurn: 5,
    avgPickRound: 1.52,
    blindPickRate: 50,
    averageGameTime: "33:00",
    csPerMinute: 7.3,
    damagePerMinute: 344,
    goldPerMinute: 385,
    csDiffAt15: 3,
    goldDiffAt15: -3,
    xpDiffAt15: 169,
    soloqKrChallengerWinRate: 55,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "xin-zhao", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește combo-ul EQ" },
        { championId: "maokai", level: 2, phase: "late" },
        { championId: "lee-sin", level: 2, phase: "lane" },
        { championId: "qiyana", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
