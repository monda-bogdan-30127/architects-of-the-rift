import { createChampion } from "./_helpers";

export const maokai = createChampion({
  id: "maokai",
  name: "Maokai",
  image: "/champions/maokai.png",
  roles: ["jungle", "support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "miss-fortune", score: 5 },
    { championId: "jayce", score: 5 },
    { championId: "xayah", score: 4 },
    { championId: "orianna", score: 4 },
    { championId: "yasuo", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "seraphine", score: 3 },
    { championId: "ziggs", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 4 },
    { type: "engage", strength: 4 },
    { type: "zoneControl", strength: 4 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 4,
    bans: 8,
    presence: 12,
    prioScore: 13,
    wins: 0,
    losses: 4,
    proWinRate: 0,
    kda: 1.1,
    avgBanTurn: 7.1,
    avgPickRound: 2.75,
    blindPickRate: 0,
    averageGameTime: "30:14",
    csPerMinute: 6.2,
    damagePerMinute: 507,
    goldPerMinute: 363,
    csDiffAt15: -14.5,
    goldDiffAt15: -584,
    xpDiffAt15: -907,
    soloqKrChallengerWinRate: 56.69,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "lillia", score: 4, note: "CC point-click contra kite-ului" },
        { championId: "poppy", score: 2 },
      ],
      weakVs: [
        { championId: "trundle", score: 4, note: "ult-ul fură rezistențele tank-ului" },
        { championId: "dr-mundo", score: 3 },
        { championId: "kindred", score: 3 },
        { championId: "aatrox", score: 2 },
        { championId: "naafiri", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    support: {
      goodVs: [
        { championId: "alistar", score: 2 },
        { championId: "nautilus", score: 2 },
        { championId: "poppy", score: 2 },
      ],
      weakVs: [
        { championId: "braum", score: 2 },
        { championId: "nami", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
