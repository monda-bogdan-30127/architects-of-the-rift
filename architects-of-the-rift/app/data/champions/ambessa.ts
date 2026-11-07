import { createChampion } from "./_helpers";

export const ambessa = createChampion({
  id: "ambessa",
  name: "Ambessa",
  image: "/champions/ambessa.png",
  roles: ["top", "jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "orianna", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "alistar", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "ahri", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  //mustWith: [{ championId: "jarvan-iv", score: 5 }],
  offers: [
    { type: "dive", strength: 4 },
    { type: "backlineAccess", strength: 4 },
    { type: "sustainedDamage", strength: 3 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 20,
    bans: 8,
    presence: 28,
    prioScore: 31,
    wins: 9,
    losses: 11,
    proWinRate: 45,
    kda: 2.5,
    avgBanTurn: 7.6,
    avgPickRound: 1.55,
    blindPickRate: 60,
    averageGameTime: "32:26",
    csPerMinute: 8.6,
    damagePerMinute: 479,
    goldPerMinute: 368,
    csDiffAt15: -3,
    goldDiffAt15: -309,
    xpDiffAt15: -14,
    soloqKrChallengerWinRate: 56,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ornn", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește dash-urile Ambessei" },
        { championId: "gwen", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [
        { championId: "wukong", level: 1, phase: "all" },
      ],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește dash-urile Ambessei" },
        { championId: "jarvan-iv", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
