import { createChampion } from "./_helpers";

export const pantheon = createChampion({
  id: "pantheon",
  name: "Pantheon",
  image: "/champions/pantheon.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "twisted-fate", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "ahri", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "kaisa", score: 4 },
    { championId: "ryze", score: 5 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "engage", strength: 4 },
    { type: "earlyPrio", strength: 5 },
    { type: "roamPressure", strength: 5 },
    { type: "burstDamage", strength: 4 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 12,
    bans: 12,
    presence: 24,
    prioScore: 26,
    wins: 6,
    losses: 6,
    proWinRate: 50,
    kda: 3.5,
    avgBanTurn: 4.9,
    avgPickRound: 1.92,
    blindPickRate: 33.3,
    averageGameTime: "33:29",
    csPerMinute: 6.7,
    damagePerMinute: 394,
    goldPerMinute: 381,
    csDiffAt15: -10,
    goldDiffAt15: 4,
    xpDiffAt15: -338,
    soloqKrChallengerWinRate: 55.2,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "lee-sin", score: 2 },
        { championId: "lillia", score: 2 },
        { championId: "nocturne", score: 2 },
      ],
      weakVs: [
        { championId: "poppy", score: 4, note: "W oprește leap-ul lui W" },
        { championId: "maokai", score: 3 },
        { championId: "sejuani", score: 3 },
        { championId: "skarner", score: 3 },
        { championId: "jarvan-iv", score: 1 },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
