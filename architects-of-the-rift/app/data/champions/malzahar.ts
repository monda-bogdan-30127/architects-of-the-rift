import { createChampion } from "./_helpers";

export const malzahar = createChampion({
  id: "malzahar",
  name: "Malzahar",
  image: "/champions/malzahar.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "gangplank", score: 5 },
    { championId: "gragas", score: 5 },
    { championId: "jhin", score: 5 },
    { championId: "khazix", score: 4 },
    { championId: "alistar", score: 4 },
    { championId: "reksai", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "taric", score: 4 },
  ],

  offers: [
    { type: "pick", strength: 5 },
    { type: "reliableCC", strength: 5 },
    { type: "waveclear", strength: 4 },
    { type: "zoneControl", strength: 3 },
    { type: "antiDive", strength: 2 }
  ],

  needs: [
    { type: "followUp", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "waveclear", severity: 1 }
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 56.73,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "galio", level: 2, phase: "lane" },
        { championId: "ryze", level: 2, phase: "lane" },
        { championId: "vladimir", level: 2, phase: "lane" },
        { championId: "zoe", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "veigar", level: 2, phase: "late" },
        { championId: "azir", level: 2, phase: "lane" },
        { championId: "taliyah", level: 2, phase: "lane" },
        { championId: "viktor", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
