import { createChampion } from "./_helpers";

export const zac = createChampion({
  id: "zac",
  name: "Zac",
  image: "/champions/zac.png",
  roles: ["top", "jungle"],
  damageProfile: ["AP"],
  attackType: "melee",

  synergyWith: [
    { championId: "leblanc", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "renekton", score: 5 },
    { championId: "morgana", score: 5 },
    { championId: "thresh", score: 4 },
    { championId: "gangplank", score: 4 },
    { championId: "camille", score: 4 },
    { championId: "taric", score: 4 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "frontline", strength: 4 },
    { type: "followUp", strength: 4 },
    { type: "reliableCC", strength: 3 }
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

  playerScaling: { mec: 3, mac: 4, tfg: 3, con: 3 },

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
    soloqKrChallengerWinRate: 58.13,
  },

  roleData: {
    top: {
      goodVs: [],
      stats: null,
    },
    jungle: {
      goodVs: [],
      stats: null,
    },
  },
});
