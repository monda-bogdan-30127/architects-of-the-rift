import { createChampion } from "./_helpers";

export const warwick = createChampion({
  id: "warwick",
  name: "Warwick",
  image: "/champions/warwick.png",
  roles: ["top", "jungle"],
  damageProfile: ["AD", "AP"],

  offers: [
    { type: "pick", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "frontline", strength: 2 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

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
    soloqKrChallengerWinRate: 51.7,
  },

  roleData: {
    top: {
      goodVs: [],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește ult-ul lui Warwick" },
        { championId: "gnar", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: {
      goodVs: [
        { championId: "karthus", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește ult-ul lui Warwick" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
