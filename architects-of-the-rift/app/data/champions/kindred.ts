import { createChampion } from "./_helpers";

export const kindred = createChampion({
  id: "kindred",
  name: "Kindred",
  image: "/champions/kindred.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "galio", score: 5 },
    { championId: "twisted-fate", score: 5 },
    { championId: "lissandra", score: 4 },
    { championId: "renekton", score: 4 },
    { championId: "nautilus", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "thresh", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 4 },
    { type: "objectiveControl", strength: 4 },
    { type: "antiDive", strength: 3 },
    { type: "scaling", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "earlyPrio", severity: 1 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 0,
    bans: 1,
    presence: 1,
    prioScore: 1,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: 10,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 57.09,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "wukong", score: 3 },
        { championId: "sejuani", score: 2 },
      ],
      weakVs: [
        { championId: "lillia", score: 2 },
        { championId: "nidalee", score: 2 },
        { championId: "poppy", score: 2 },
        { championId: "xin-zhao", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
