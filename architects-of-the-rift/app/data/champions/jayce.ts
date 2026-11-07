import { createChampion } from "./_helpers";

export const jayce = createChampion({
  id: "jayce",
  name: "Jayce",
  image: "/champions/jayce.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "nidalee", score: 4 },
    { championId: "caitlyn", score: 3 },
    { championId: "lee-sin", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "karma", score: 3 },
    { championId: "maokai", score: 4 },
  ],

  offers: [
    { type: "poke", strength: 5 },
    { type: "siege", strength: 4 },
    { type: "earlyPrio", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 3, con: 3, iq: 3 },

  stats: {
    picks: 13,
    bans: 25,
    presence: 38,
    prioScore: 45,
    wins: 8,
    losses: 5,
    proWinRate: 62,
    kda: 3.4,
    avgBanTurn: 4.5,
    avgPickRound: 1.69,
    blindPickRate: 83.3,
    averageGameTime: "32:07",
    csPerMinute: 9.5,
    damagePerMinute: 777,
    goldPerMinute: 446,
    csDiffAt15: 12.7,
    goldDiffAt15: 562,
    xpDiffAt15: 326,
    soloqKrChallengerWinRate: 56.92,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "kennen", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "aatrox", level: 2, phase: "late" },
        { championId: "yorick", level: 2, phase: "late" },
        { championId: "gragas", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["ranged", "ad", "poke", "lane-priority", "siege"],
        abilities: [
          { key: "q", name: "Shock Blast / To the Skies!", effects: [{ type: "poke", subtype: "accelerated-blast", strength: 9, reliability: 7, priority: 9 }, { type: "burst", strength: 7, reliability: 7, priority: 7 }] },
          { key: "e", name: "Thundering Blow / Acceleration Gate", effects: [{ type: "displacement", subtype: "self-peel-knockback", strength: 6, reliability: 8, priority: 6 }, { type: "setup", subtype: "poke-enable", strength: 8, reliability: 9, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 1 },
        accessProfile: { engageRange: 8, targetAccess: 6, stickiness: 4 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 6, pickThreat: 5, zoneThreat: 7, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
        conditions: { requiresFrontline: true, requiresPeel: true },
        comboDependency: { needsEngage: 0, needsFrontline: 5, needsPeel: 4 },
      },
    },
  },
});
