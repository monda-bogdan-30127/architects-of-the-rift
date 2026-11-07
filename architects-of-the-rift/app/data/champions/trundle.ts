import { createChampion } from "./_helpers";

export const trundle = createChampion({
  id: "trundle",
  name: "Trundle",
  image: "/champions/trundle.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "anivia", score: 5 },
    { championId: "orianna", score: 4 },
    { championId: "azir", score: 4 },
    { championId: "cassiopeia", score: 3 },
    { championId: "syndra", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "xayah", score: 2 },
    { championId: "miss-fortune", score: 2 },
  ],

  offers: [
    { type: "frontline", strength: 3 },
    { type: "objectiveControl", strength: 4 },
    { type: "sideLanePressure", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 1 },
    { exposedTo: "earlyPrio", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 8,
    bans: 7,
    presence: 15,
    prioScore: 16,
    wins: 5,
    losses: 3,
    proWinRate: 63,
    kda: 7.5,
    avgBanTurn: 6.9,
    avgPickRound: 2.25,
    blindPickRate: 25,
    averageGameTime: "32:23",
    csPerMinute: 7.2,
    damagePerMinute: 395,
    goldPerMinute: 400,
    csDiffAt15: -1.9,
    goldDiffAt15: 236,
    xpDiffAt15: 200,
    soloqKrChallengerWinRate: null,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "naafiri", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "khazix", level: 2, phase: "lane" },
        { championId: "kindred", level: 2, phase: "lane" },
        { championId: "lillia", level: 2, phase: "lane" },
        { championId: "nidalee", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
