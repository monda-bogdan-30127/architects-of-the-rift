import { createChampion } from "./_helpers";

export const quinn = createChampion({
  id: "quinn",
  name: "Quinn",
  image: "/champions/quinn.png",
  roles: ["top"],
  damageProfile: ["AD"],
  attackType: "ranged",

  synergyWith: [
    { championId: "thresh", score: 5 },
    { championId: "twisted-fate", score: 5 },
    { championId: "leblanc", score: 5 },
    { championId: "alistar", score: 5 },
    { championId: "lee-sin", score: 4 },
    { championId: "nidalee", score: 4 },
    { championId: "rakan", score: 4 },
    { championId: "kaisa", score: 4 },
  ],

  offers: [
    { type: "roamPressure", strength: 5 },
    { type: "sideLanePressure", strength: 4 },
    { type: "earlyPrio", strength: 4 },
    { type: "pick", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 2 },
    { exposedTo: "scaling", severity: 2 },
    { exposedTo: "poke", severity: 1 }
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

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
    soloqKrChallengerWinRate: 55.28,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "darius", level: 2, phase: "all", note: "Kites; Darius can't catch her" },
        { championId: "fiora", level: 2, phase: "lane" },
        { championId: "garen", level: 2, phase: "lane" },
        { championId: "gnar", level: 2, phase: "lane" },
        { championId: "gwen", level: 2, phase: "lane" },
        { championId: "jax", level: 2, phase: "lane" },
        { championId: "kayle", level: 2, phase: "lane" },
        { championId: "kled", level: 2, phase: "lane" },
        { championId: "nasus", level: 2, phase: "lane" },
        { championId: "olaf", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "sett", level: 2, phase: "lane" },
        { championId: "singed", level: 2, phase: "lane" },
      ],
      stats: null,
    },
  },
});
