import { createChampion } from "./_helpers";

export const sion = createChampion({
  id: "sion",
  name: "Sion",
  image: "/champions/sion.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "pantheon", score: 4 },
    { championId: "seraphine", score: 4 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "aphelios", score: 3 },
    { championId: "vi", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "engage", strength: 4 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "sustainedDamage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 5, iq: 3 },

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
    soloqKrChallengerWinRate: 51,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "jayce", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "late" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 1,
        wins: 1,
        losses: 0,
        proWinRate: 100,
        kda: null,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "26:32",
        csPerMinute: 7.8,
        damagePerMinute: 603,
        goldPerMinute: 397,
        csDiffAt15: -1,
        goldDiffAt15: -110,
        xpDiffAt15: 556,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "frontline", "tank", "engage", "weakside", "waveclear"],
        abilities: [
          { key: "q", name: "Decimating Smash", effects: [{ type: "knockup", subtype: "charged-aoe", strength: 8, reliability: 6, priority: 8 }, { type: "burst", strength: 6, reliability: 6, priority: 6 }] },
          { key: "e", name: "Roar of the Slayer", effects: [{ type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "poke", strength: 4, reliability: 7, priority: 4 }] },
          { key: "r", name: "Unstoppable Onslaught", effects: [{ type: "unstoppable", strength: 9, reliability: 8, priority: 9 }, { type: "knockup", subtype: "long-range-engage", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "fight-start", strength: 9, reliability: 8, priority: 9 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 1 },
        accessProfile: { engageRange: 9, targetAccess: 5, stickiness: 4 },
        threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 6, zoneThreat: 6, antiDiveThreat: 7 },
        phaseIdentity: { earlyRole: "tank", midRole: "setup", lateRole: "tank" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
      },
    },
  },
});
