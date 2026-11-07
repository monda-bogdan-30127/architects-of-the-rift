import { createChampion } from "./_helpers";

export const naafiri = createChampion({
  id: "naafiri",
  name: "Naafiri",
  image: "/champions/naafiri.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "galio", score: 4 },
    { championId: "twisted-fate", score: 4 },
    { championId: "ahri", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "pyke", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "orianna", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 4 },
    { type: "dive", strength: 4 },
    { type: "pick", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "earlyPrio", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 5,
    bans: 5,
    presence: 10,
    prioScore: 9,
    wins: 2,
    losses: 3,
    proWinRate: 40,
    kda: 2.3,
    avgBanTurn: 7.4,
    avgPickRound: 3.2,
    blindPickRate: 60,
    averageGameTime: "31:22",
    csPerMinute: 7.5,
    damagePerMinute: 625,
    goldPerMinute: 402,
    csDiffAt15: -4.2,
    goldDiffAt15: -41,
    xpDiffAt15: -117,
    soloqKrChallengerWinRate: 53.9,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "lillia", level: 2, phase: "lane" },
        { championId: "xin-zhao", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește dash-ul" },
        { championId: "jarvan-iv", level: 2, phase: "lane" },
        { championId: "nocturne", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
        { championId: "wukong", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
