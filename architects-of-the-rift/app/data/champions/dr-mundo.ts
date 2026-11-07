import { createChampion } from "./_helpers";

export const drMundo = createChampion({
  id: "dr-mundo",
  name: "Dr. Mundo",
  image: "/champions/dr.-mundo.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "nami", score: 4 },
    { championId: "seraphine", score: 4 },
    { championId: "karma", score: 3 },
    { championId: "lulu", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "aphelios", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "sideLanePressure", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 4, con: 4, iq: 4 },

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
    soloqKrChallengerWinRate: 53,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "lillia", score: 3 },
        { championId: "viego", score: 3 },
        { championId: "xin-zhao", score: 3 },
      ],
      weakVs: [
        { championId: "aatrox", score: 2 },
        { championId: "jarvan-iv", score: 2 },
        { championId: "nocturne", score: 2 },
        { championId: "pantheon", score: 2 },
        { championId: "vi", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [],
      weakVs: [
        { championId: "aatrox", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
