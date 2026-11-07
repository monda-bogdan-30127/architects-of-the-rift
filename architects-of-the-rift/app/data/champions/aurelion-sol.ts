import { createChampion } from "./_helpers";

export const aurelionSol = createChampion({
  id: "aurelion-sol",
  name: "Aurelion Sol",
  image: "/champions/aurelion-sol.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "wukong", score: 5 },
    { championId: "alistar", score: 5 },
    { championId: "malphite", score: 5 },
    { championId: "rakan", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 4 },
  ],

  offers: [
    { type: "scaling", strength: 5 },
    { type: "waveclear", strength: 4 },
    { type: "zoneControl", strength: 4 },
    { type: "sustainedDamage", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
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
    soloqKrChallengerWinRate: 55.48,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "orianna", score: 3 },
        { championId: "ryze", score: 3 },
        { championId: "veigar", score: 3 },
        { championId: "viktor", score: 3 },
      ],
      weakVs: [
        { championId: "annie", score: 2 },
        { championId: "azir", score: 2 },
        { championId: "syndra", score: 2 },
        { championId: "taliyah", score: 2 },
        { championId: "yone", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
