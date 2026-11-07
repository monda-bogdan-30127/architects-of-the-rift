import { createChampion } from "./_helpers";

export const graves = createChampion({
  id: "graves",
  name: "Graves",
  image: "/champions/graves.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "renekton", score: 5 },
    { championId: "leblanc", score: 5 },
    { championId: "lucian", score: 4 },
    { championId: "syndra", score: 4 },
    { championId: "ahri", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "earlyPrio", strength: 4 },
    { type: "objectiveControl", strength: 4 },
    { type: "burstDamage", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 },
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "scaling", severity: 1 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 1 }
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 58.55,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "jarvan-iv", score: 2 },
        { championId: "sejuani", score: 2 },
        { championId: "wukong", score: 2 },
        { championId: "xin-zhao", score: 2 },
      ],
      weakVs: [
        { championId: "khazix", score: 2 },
        { championId: "lee-sin", score: 2 },
        { championId: "nidalee", score: 2 },
        { championId: "nocturne", score: 2 },
        { championId: "pantheon", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
