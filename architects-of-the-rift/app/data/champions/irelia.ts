import { createChampion } from "./_helpers";

export const irelia = createChampion({
  id: "irelia",
  name: "Irelia",
  image: "/champions/irelia.png",
  roles: ["top", "mid"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "sejuani", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "vi", score: 4 },
    { championId: "xin-zhao", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "yasuo", score: 3 },
    { championId: "leblanc", score: 3 },
    { championId: "nautilus", score: 3 },
  ],

  offers: [
    { type: "dive", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "splitpush", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
  ],

  playerScaling: { mec: 5, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 1.7,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "25:10",
    csPerMinute: 10,
    damagePerMinute: 285,
    goldPerMinute: 415,
    csDiffAt15: 10,
    goldDiffAt15: 667,
    xpDiffAt15: -630,
    soloqKrChallengerWinRate: 53.01,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "gnar", score: 2 },
        { championId: "jayce", score: 2 },
        { championId: "kennen", score: 2 },
        { championId: "shen", score: 2 },
        { championId: "poppy", score: 1 },
      ],
      weakVs: [
        { championId: "ornn", score: 4, note: "prea tanky pentru all-in, CC care oprește stack-urile" },
        { championId: "sion", score: 3 },
        { championId: "renekton", score: 2 },
        { championId: "camille", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
    mid: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
