import { createChampion } from "./_helpers";

export const sion = createChampion({
  id: "sion",
  name: "Sion",
  image: "/champions/sion.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "pantheon", score: 4 },
    { championId: "seraphine", score: 4 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "aphelios", score: 3 },
    { championId: "vi", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "engage", strength: 4 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "sustainedDamage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 5, iq: 3 },

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
    soloqKrChallengerWinRate: 51,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "aurora", score: 3 },
        { championId: "jayce", score: 3 },
        { championId: "renekton", score: 3 },
        { championId: "volibear", score: 3 },
      ],
      weakVs: [
        { championId: "gwen", score: 4, note: "damage pe %HP contra tank-ului" },
        { championId: "mordekaiser", score: 4, note: "ult-ul și damage-ul contra tank-urilor" },
        { championId: "camille", score: 3 },
        { championId: "aatrox", score: 2 },
        { championId: "kennen", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
