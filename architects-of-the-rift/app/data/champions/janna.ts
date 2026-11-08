import { createChampion } from "./_helpers";

export const janna = createChampion({
  id: "janna",
  name: "Janna",
  image: "/champions/janna.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "corki", score: 5 },     // extrem de mare winrate (probabil sample mic dar clar best)
    { championId: "sivir", score: 5 },
    { championId: "lucian", score: 4 },
    { championId: "jinx", score: 4 },
    { championId: "kogmaw", score: 4 },
    { championId: "twitch", score: 4 },
    { championId: "aphelios", score: 3 },
    { championId: "xayah", score: 2 },
  ],

  offers: [
    { type: "disengage", strength: 5 },
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 5 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 2 }
  ],

  playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 55.58,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "alistar", level: 2, phase: "all", note: "disengage anulează combo-ul W-Q" },
        { championId: "leona", level: 2, phase: "all", note: "disengage anulează engage-ul" },
        { championId: "nautilus", level: 2, phase: "all", note: "disengage anulează engage-ul" },
        { championId: "rakan", level: 2, phase: "all", note: "disengage anulează engage-ul" },
        { championId: "rell", level: 2, phase: "all", note: "disengage anulează engage-ul" },
      ],
      stats: null,
    },
  },
});
