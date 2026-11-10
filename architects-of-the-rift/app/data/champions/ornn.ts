import { createChampion } from "./_helpers";

export const ornn = createChampion({
  id: "ornn",
  name: "Ornn",
  image: "/champions/ornn.png",
  roles: ["top"],
  damageProfile: ["AP"],
  attackType: "melee",

  synergyWith: [
    { championId: "pantheon", score: 4 },
    { championId: "vi", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "orianna", score: 4 },
    { championId: "azir", score: 3 },
    { championId: "jinx", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "engage", strength: 4 },
    { type: "reliableCC", strength: 4 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 4, con: 5, iq: 4 },

  stats: {
    picks: 8,
    bans: 1,
    presence: 9,
    prioScore: 8,
    wins: 5,
    losses: 3,
    proWinRate: 63,
    kda: 2.4,
    avgBanTurn: 8,
    avgPickRound: 1.75,
    blindPickRate: 12.5,
    averageGameTime: "30:51",
    csPerMinute: 7.8,
    damagePerMinute: 356,
    goldPerMinute: 343,
    csDiffAt15: -7.2,
    goldDiffAt15: -561,
    xpDiffAt15: -368,
    soloqKrChallengerWinRate: 59.4,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "irelia", level: 2, phase: "all", note: "Too tanky to all-in, and the CC stops Irelia's stacks" },
        { championId: "jayce", level: 2, phase: "late" },
        { championId: "kled", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "late" },
        { championId: "aatrox", level: 1, phase: "all" },
        { championId: "riven", level: 1, phase: "all" },
      ],
      stats: {
        picks: 9,
        bans: null,
        presence: 10,
        prioScore: 8,
        wins: 6,
        losses: 3,
        proWinRate: 67,
        kda: 2.6,
        avgBanTurn: null,
        avgPickRound: 1.67,
        blindPickRate: 11.1,
        averageGameTime: "31:23",
        csPerMinute: 7.8,
        damagePerMinute: 361,
        goldPerMinute: 344,
        csDiffAt15: -8.7,
        goldDiffAt15: -637,
        xpDiffAt15: -437,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "frontline", "engage", "tank", "teamfight", "weakside"],
        abilities: [
          { key: "q", name: "Volcanic Rupture", effects: [{ type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "zone-control", subtype: "pillar", strength: 5, reliability: 7, priority: 5 }] },
          { key: "e", name: "Searing Charge", effects: [{ type: "dash", strength: 5, reliability: 7, priority: 5 }, { type: "knockup", subtype: "terrain-combo", strength: 8, reliability: 7, priority: 8 }] },
          { key: "r", name: "Call of the Forge God", effects: [{ type: "knockup", subtype: "long-range-engage", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "teamfight-start", strength: 9, reliability: 8, priority: 9 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 1 },
        accessProfile: { engageRange: 8, targetAccess: 5, stickiness: 5 },
        threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 6, zoneThreat: 6, antiDiveThreat: 7 },
        phaseIdentity: { earlyRole: "tank", midRole: "setup", lateRole: "tank" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
      },
    },
  },
});
