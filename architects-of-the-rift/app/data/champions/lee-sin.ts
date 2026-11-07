import { createChampion } from "./_helpers";

export const leeSin = createChampion({
  id: "lee-sin",
  name: "Lee Sin",
  image: "/champions/lee-sin.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "leblanc", score: 5 },
    { championId: "renekton", score: 4 },
    { championId: "twisted-fate", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "sylas", score: 3 },
    { championId: "pyke", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rakan", score: 2 },
  ],

  offers: [
    { type: "earlyPrio", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "dive", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 24,
    bans: 19,
    presence: 43,
    prioScore: 51,
    wins: 12,
    losses: 12,
    proWinRate: 50,
    kda: 3.6,
    avgBanTurn: 5.2,
    avgPickRound: 1.29,
    blindPickRate: 66.7,
    averageGameTime: "34:29",
    csPerMinute: 7.3,
    damagePerMinute: 385,
    goldPerMinute: 390,
    csDiffAt15: 1.6,
    goldDiffAt15: -49,
    xpDiffAt15: 208,
    soloqKrChallengerWinRate: 57.05,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "trundle", level: 2, phase: "lane" },
        { championId: "xin-zhao", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește Q2 și insec-ul" },
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
        { championId: "qiyana", level: 1, phase: "all" },
        { championId: "wukong", level: 1, phase: "all" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
