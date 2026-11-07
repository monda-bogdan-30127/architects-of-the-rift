import { createChampion } from "./_helpers";

export const aatrox = createChampion({
  id: "aatrox",
  name: "Aatrox",
  image: "/champions/aatrox.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "galio", score: 5 },
    { championId: "aurora", score: 4 },
    { championId: "ahri", score: 5 },
    { championId: "viktor", score: 3 },
    { championId: "wukong", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "lissandra", score: 2 }
  ],

  offers: [
    { type: "earlyPrio", strength: 3 },
    { type: "objectiveControl", strength: 3 },
    { type: "roamPressure", strength: 3 },
    { type: "sideLanePressure", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 4,
    bans: 0,
    presence: 4,
    prioScore: 2,
    wins: 1,
    losses: 3,
    proWinRate: 25,
    kda: 2.6,
    avgBanTurn: null,
    avgPickRound: 3.25,
    blindPickRate: 0,
    averageGameTime: "31:00",
    csPerMinute: 7.9,
    damagePerMinute: 484,
    goldPerMinute: 362,
    csDiffAt15: -0.8,
    goldDiffAt15: -330,
    xpDiffAt15: 244,
    soloqKrChallengerWinRate: 57.14,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "ambessa", score: 2 },
        { championId: "xin-zhao", score: 2 },
      ],
      weakVs: [
        { championId: "jarvan-iv", score: 2 },
        { championId: "pantheon", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
    top: {
      goodVs: [
        { championId: "ambessa", score: 2 },
      ],
      weakVs: [
        { championId: "camille", score: 4, note: "true damage și duel superior în sidelane" },
        { championId: "gwen", score: 3 },
        { championId: "gnar", score: 2 },
        { championId: "renekton", score: 2 },
        { championId: "rumble", score: 2 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
