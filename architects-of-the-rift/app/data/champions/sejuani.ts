import { createChampion } from "./_helpers";

export const sejuani = createChampion({
  id: "sejuani",
  name: "Sejuani",
  image: "/champions/sejuani.png",
  roles: ["jungle"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "yasuo", score: 5 },
    { championId: "yone", score: 5 },
    { championId: "sylas", score: 5 },
    { championId: "irelia", score: 4 },
    { championId: "akali", score: 4 },
    { championId: "leblanc", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "aphelios", score: 3 },
    { championId: "azir", score: 4 },
    { championId: "renekton", score: 4 },
    { championId: "gwen", score: 3 }
  ],

  offers: [
    { type: "frontline", strength: 4 },
    { type: "engage", strength: 4 },
    { type: "reliableCC", strength: 4 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "sustainedDamage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 5,
    bans: 0,
    presence: 5,
    prioScore: 4,
    wins: 1,
    losses: 4,
    proWinRate: 20,
    kda: 3.3,
    avgBanTurn: null,
    avgPickRound: 2.2,
    blindPickRate: 0,
    averageGameTime: "38:22",
    csPerMinute: 6,
    damagePerMinute: 362,
    goldPerMinute: 343,
    csDiffAt15: -7.4,
    goldDiffAt15: -546,
    xpDiffAt15: -457,
    soloqKrChallengerWinRate: 50,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "aatrox", score: 3 },
        { championId: "naafiri", score: 3 },
        { championId: "viego", score: 3 },
        { championId: "wukong", score: 3 },
      ],
      weakVs: [
        { championId: "trundle", score: 4, note: "ult-ul fură rezistențele tank-ului" },
        { championId: "dr-mundo", score: 3 },
        { championId: "jarvan-iv", score: 2 },
        { championId: "khazix", score: 2 },
        { championId: "xin-zhao", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
