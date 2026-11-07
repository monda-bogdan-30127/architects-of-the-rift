import { createChampion } from "./_helpers";

export const sett = createChampion({
  id: "sett",
  name: "Sett",
  image: "/champions/sett.png",
  roles: ["top"],
  damageProfile: ["AD", "TRUE"],

  synergyWith: [
    { championId: "sejuani", score: 5 },
    { championId: "maokai", score: 5 },
    { championId: "vi", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 3 },
    { type: "engage", strength: 3 },
    { type: "reliableCC", strength: 3 },
    { type: "antiDive", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 },
    { type: "backlineAccess", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 }
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
    soloqKrChallengerWinRate: 51.18,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "volibear", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
