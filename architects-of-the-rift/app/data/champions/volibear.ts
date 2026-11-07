import { createChampion } from "./_helpers";

export const volibear = createChampion({
  id: "volibear",
  name: "Volibear",
  image: "/champions/volibear.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "orianna", score: 5 },
    { championId: "syndra", score: 5 },
    { championId: "leblanc", score: 4 },
    { championId: "twisted-fate", score: 4 },
    { championId: "renekton", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "dive", strength: 4 },
    { type: "engage", strength: 4 },
    { type: "pick", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "earlyPrio", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 1,
    bans: 1,
    presence: 2,
    prioScore: 2,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 10,
    avgBanTurn: 10,
    avgPickRound: 3,
    blindPickRate: 0,
    averageGameTime: "34:09",
    csPerMinute: 9.7,
    damagePerMinute: 586,
    goldPerMinute: 443,
    csDiffAt15: 20,
    goldDiffAt15: 718,
    xpDiffAt15: 1011,
    soloqKrChallengerWinRate: 57.75,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "aatrox", score: 2 },
        { championId: "sejuani", score: 2 },
        { championId: "viego", score: 2 },
      ],
      weakVs: [
        { championId: "kindred", score: 3 },
        { championId: "poppy", score: 3 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "aatrox", score: 2 },
        { championId: "gangplank", score: 2 },
      ],
      weakVs: [
        { championId: "gnar", score: 4, note: "kite contra juggernaut-ului" },
        { championId: "camille", score: 3 },
        { championId: "jax", score: 3 },
        { championId: "poppy", score: 3 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
