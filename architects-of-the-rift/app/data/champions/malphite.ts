import { createChampion } from "./_helpers";

export const malphite = createChampion({
  id: "malphite",
  name: "Malphite",
  image: "/champions/malphite.png",
  roles: ["jungle", "top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "yasuo", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "miss-fortune", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "wukong", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "engage", strength: 4 },
    { type: "reliableCC", strength: 4 },
    { type: "earlyPrio", strength: 3 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 5, iq: 4 },

  stats: {
    picks: 1,
    bans: 0,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 1,
    proWinRate: 0,
    kda: 0.3,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "27:26",
    csPerMinute: 6.2,
    damagePerMinute: 188,
    goldPerMinute: 312,
    csDiffAt15: -29,
    goldDiffAt15: -3054,
    xpDiffAt15: -1736,
    soloqKrChallengerWinRate: 56.47,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "xin-zhao", score: 3 },
      ],
      weakVs: [
        { championId: "aatrox", score: 2 },
        { championId: "jarvan-iv", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "tryndamere", score: 5, note: "armura și ult-ul anulează complet Tryndamere" },
        { championId: "gangplank", score: 4, note: "armura și ult-ul anulează GP-ul AD" },
        { championId: "jayce", score: 4, note: "armura anulează poke-ul AD" },
        { championId: "gnar", score: 1 },
      ],
      weakVs: [
        { championId: "gwen", score: 4, note: "damage AP și true damage contra tank-ului de armură" },
        { championId: "camille", score: 3 },
        { championId: "aatrox", score: 2 },
        { championId: "gragas", score: 2 },
        { championId: "ornn", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
