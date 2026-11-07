import { createChampion } from "./_helpers";

export const kassadin = createChampion({
  id: "kassadin",
  name: "Kassadin",
  image: "/champions/kassadin.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "sejuani", score: 5 },
    { championId: "maokai", score: 5 },
    { championId: "ivern", score: 4 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "renata-glasc", score: 3 },
  ],

  offers: [
    { type: "scaling", strength: 5 },
    { type: "backlineAccess", strength: 4 },
    { type: "burstDamage", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
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
    soloqKrChallengerWinRate: 54.52,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "galio", score: 3 },
        { championId: "orianna", score: 3 },
        { championId: "syndra", score: 3 },
      ],
      weakVs: [
        { championId: "cassiopeia", score: 5, note: "W-ul îl ține pe loc și anulează ult-ul" },
        { championId: "lissandra", score: 4, note: "CC point-click și burst înainte de nivelul 6" },
        { championId: "ryze", score: 2 },
        { championId: "vladimir", score: 2 },
        { championId: "zoe", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
