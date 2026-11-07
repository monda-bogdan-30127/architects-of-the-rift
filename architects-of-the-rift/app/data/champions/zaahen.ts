import { createChampion } from "./_helpers";

export const zaahen = createChampion({
  id: "zaahen",
  name: "Zaahen",
  image: "/champions/zaahen.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "sejuani", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "xayah", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
  ],

  offers: [
    { type: "dive", strength: 4 },
    { type: "backlineAccess", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 5,
    bans: 0,
    presence: 5,
    prioScore: 3,
    wins: 3,
    losses: 2,
    proWinRate: 60,
    kda: 3.1,
    avgBanTurn: null,
    avgPickRound: 2.6,
    blindPickRate: 0,
    averageGameTime: "32:15",
    csPerMinute: 8.2,
    damagePerMinute: 598,
    goldPerMinute: 404,
    csDiffAt15: 3.4,
    goldDiffAt15: 418,
    xpDiffAt15: 724,
    soloqKrChallengerWinRate: 56.4,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "vi", level: 2, phase: "lane" },
        { championId: "wukong", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "xin-zhao", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "ksante", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "gnar", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
