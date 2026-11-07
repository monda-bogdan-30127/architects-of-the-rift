import { createChampion } from "./_helpers";

export const nidalee = createChampion({
  id: "nidalee",
  name: "Nidalee",
  image: "/champions/nidalee.png",
  roles: ["jungle"],
  damageProfile: ["AP"],

  // Fost mustWith (scor 3) — pereche fără sens real de „must” (DRAFT_REWORK §2.5).
  synergyWith: [
    { championId: "camille", score: 3 },
  ],

  offers: [
    { type: "poke", strength: 4 },
    { type: "earlyPrio", strength: 5 },
    { type: "roamPressure", strength: 4 },
    { type: "objectiveControl", strength: 3 },
    { type: "burstDamage", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 58.11,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "nunu", level: 2, phase: "lane" },
        { championId: "sejuani", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: ["renekton", "twisted-fate"],
      stats: null,
    },
  },
});
