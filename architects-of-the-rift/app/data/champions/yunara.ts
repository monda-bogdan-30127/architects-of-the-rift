import { createChampion } from "./_helpers";

export const yunara = createChampion({
  id: "yunara",
  name: "Yunara",
  image: "/champions/yunara.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "nautilus", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "alistar", score: 3 },
    { championId: "renata-glasc", score: 3 },
    { championId: "karma", score: 3 },
    { championId: "thresh", score: 3 },
    { championId: "jarvan-iv", score: 3 }
  ],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "scaling", strength: 5 },
    { type: "siege", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 3 },
    { type: "peel", priority: 3 },
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "engage", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 15,
    bans: 3,
    presence: 18,
    prioScore: 16,
    wins: 8,
    losses: 7,
    proWinRate: 53,
    kda: 3,
    avgBanTurn: 8,
    avgPickRound: 1.87,
    blindPickRate: 66.7,
    averageGameTime: "35:02",
    csPerMinute: 10.6,
    damagePerMinute: 736,
    goldPerMinute: 491,
    csDiffAt15: -14.7,
    goldDiffAt15: -511,
    xpDiffAt15: -332,
    soloqKrChallengerWinRate: 56,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "jinx", score: 1 },
        { championId: "kaisa", score: 1 },
        { championId: "smolder", score: 1 },
      ],
      weakVs: [
        { championId: "ashe", score: 2 },
        { championId: "caitlyn", score: 2 },
        { championId: "miss-fortune", score: 2 },
        { championId: "ezreal", score: 1 },
      ],
      mustWith: ["lulu", "milio", "nami"],
      stats: null,
    },
  },
});
