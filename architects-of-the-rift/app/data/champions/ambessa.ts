import { createChampion } from "./_helpers";

export const ambessa = createChampion({
  id: "ambessa",
  name: "Ambessa",
  image: "/champions/ambessa.png",
  roles: ["top", "jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "orianna", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "alistar", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "ahri", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  //mustWith: [{ championId: "jarvan-iv", score: 5 }],
  offers: [
    { type: "dive", strength: 4 },
    { type: "backlineAccess", strength: 4 },
    { type: "sustainedDamage", strength: 3 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 20,
    bans: 8,
    presence: 28,
    prioScore: 31,
    wins: 9,
    losses: 11,
    proWinRate: 45,
    kda: 2.5,
    avgBanTurn: 7.6,
    avgPickRound: 1.55,
    blindPickRate: 60,
    averageGameTime: "32:26",
    csPerMinute: 8.6,
    damagePerMinute: 479,
    goldPerMinute: 368,
    csDiffAt15: -3,
    goldDiffAt15: -309,
    xpDiffAt15: -14,
    soloqKrChallengerWinRate: 56,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ornn", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
        { championId: "yorick", level: 2, phase: "lane" },
        { championId: "aatrox", level: 1, phase: "all" },
        { championId: "ksante", level: 1, phase: "all" },
      ],
      stats: {
        picks: 22,
        bans: null,
        presence: 31,
        prioScore: 30,
        wins: 10,
        losses: 12,
        proWinRate: 45,
        kda: 2.4,
        avgBanTurn: null,
        avgPickRound: 1.55,
        blindPickRate: 54.5,
        averageGameTime: "32:21",
        csPerMinute: 8.6,
        damagePerMinute: 489,
        goldPerMinute: 373,
        csDiffAt15: -2.9,
        goldDiffAt15: -245,
        xpDiffAt15: 0,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "diver", "carry", "skirmish", "snowball"],
        abilities: [
          { key: "q", name: "Cunning Sweep / Sundering Slam", effects: [{ type: "burst", strength: 7, reliability: 7, priority: 7 }, { type: "slow", strength: 4, reliability: 7, priority: 4 }] },
          { key: "e", name: "Public Execution", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "mobility", subtype: "target-stick", strength: 8, reliability: 8, priority: 8 }] },
          { key: "r", name: "Shadow Hunt", effects: [{ type: "dash", subtype: "backline-commit", strength: 10, reliability: 8, priority: 10 }, { type: "burst", subtype: "carry-assassination-window", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "dive-start", strength: 7, reliability: 7, priority: 7 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 2, visionControl: 1 },
        accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 8 },
        threatProfile: { backlineThreat: 9, frontlineThreat: 7, pickThreat: 6, zoneThreat: 4, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
        conditions: { requiresFrontline: true, requiresPeel: true, requiresFollowUp: true },
        comboDependency: { needsFrontline: 6, needsPeel: 5, needsEngage: 0 },
      },
    },
    jungle: {
      goodVs: [],
      stats: null,
      profile: {
        tags: ["melee", "diver", "carry", "skirmish", "snowball"],
        abilities: [
          { key: "q", name: "Cunning Sweep / Sundering Slam", effects: [{ type: "burst", strength: 7, reliability: 7, priority: 7 }, { type: "slow", strength: 4, reliability: 7, priority: 4 }] },
          { key: "e", name: "Public Execution", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "mobility", subtype: "target-stick", strength: 8, reliability: 8, priority: 8 }] },
          { key: "r", name: "Shadow Hunt", effects: [{ type: "dash", subtype: "backline-commit", strength: 10, reliability: 8, priority: 10 }, { type: "burst", subtype: "carry-assassination-window", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "dive-start", strength: 7, reliability: 7, priority: 7 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 2, visionControl: 1 },
        accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 8 },
        threatProfile: { backlineThreat: 9, frontlineThreat: 7, pickThreat: 6, zoneThreat: 4, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
        conditions: { requiresFrontline: true, requiresPeel: true, requiresFollowUp: true },
        comboDependency: { needsFrontline: 6, needsPeel: 5 },
      },
    },
  },
});
