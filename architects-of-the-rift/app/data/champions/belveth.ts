import { createChampion } from "./_helpers";

export const belveth = createChampion({
  id: "belveth",
  name: "Bel'Veth",
  image: "/champions/bel'veth.png",
  roles: ["jungle"],
  damageProfile: ["AD", "TRUE"],

  synergyWith: [
    { championId: "rumble", score: 5 },
    { championId: "renata-glasc", score: 5 },
    { championId: "kalista", score: 5 },
    { championId: "neeko", score: 3 },
    { championId: "ahri", score: 5 },
    { championId: "rell", score: 4 },
    { championId: "akali", score: 4 },
    { championId: "rakan", score: 4 },
  ],

  offers: [
    { type: "objectiveControl", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "splitpush", strength: 3 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "earlyPrio", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 53.85,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "jarvan-iv", level: 2, phase: "late" },
        { championId: "lee-sin", level: 2, phase: "late" },
        { championId: "vi", level: 2, phase: "late" },
        { championId: "xin-zhao", level: 2, phase: "late" },
      ],
      weakVs: [],
      mustWith: [],
      stats: null,
    },
  },
});
