import { createChampion } from "./_helpers";

export const morgana = createChampion({
  id: "morgana",
  name: "Morgana",
  image: "/champions/morgana.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "caitlyn", score: 5 },
    { championId: "jinx", score: 5 },
    { championId: "varus", score: 4 },
    { championId: "ezreal", score: 4 },
    { championId: "jhin", score: 4 },
    { championId: "ashe", score: 3 },
    { championId: "miss-fortune", score: 3 },
    { championId: "aphelios", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "antiDive", strength: 4 },
    { type: "zoneControl", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
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
    soloqKrChallengerWinRate: 51.7,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "blitzcrank", level: 3, phase: "all", note: "black shield anulează complet hook-ul" },
        { championId: "galio", level: 2, phase: "all", vsRole: "mid", note: "black shield anulează CC-ul lui Galio pe aliat" },
        { championId: "leona", level: 2, phase: "all", note: "black shield anulează CC-ul lui Leona" },
        { championId: "nautilus", level: 2, phase: "all", note: "black shield anulează hook-ul și R-ul" },
        { championId: "pyke", level: 2, phase: "all", note: "black shield anulează hook-ul și stun-ul" },
        { championId: "thresh", level: 2, phase: "all", note: "black shield anulează hook-ul și flay-ul" },
        { championId: "vi", level: 2, phase: "all", vsRole: "jungle", note: "black shield anulează CC-ul ult-ului lui Vi pe aliat" },
      ],
      stats: null,
    },
  },
});
