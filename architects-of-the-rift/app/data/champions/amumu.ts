import { createChampion } from "./_helpers";

export const amumu = createChampion({
  id: "amumu",
  name: "Amumu",
  image: "/champions/amumu.png",
  roles: ["jungle"],
  damageProfile: ["AP"],
  attackType: "melee",

  offers: [
    { type: "engage", strength: 5 },
    { type: "followUp", strength: 5 },
    { type: "reliableCC", strength: 4 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "peel", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 5, iq: 4 },

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
    soloqKrChallengerWinRate: 50.4,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "master-yi", level: 2, phase: "all", note: "CC în lanț pe un campion de autoatacuri" },
      ],
      stats: null,
    },
  },
});
