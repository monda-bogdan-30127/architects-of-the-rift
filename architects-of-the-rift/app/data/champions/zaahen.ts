import { createChampion } from "./_helpers";

export const zaahen = createChampion({
  id: "zaahen",
  name: "Zaahen",
  image: "/champions/zaahen.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "sejuani", score: 4 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "wukong", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "xayah", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
  ],

  offers: [
    { type: "dive", strength: 4 },
    { type: "backlineAccess", strength: 4 },
    { type: "sustainedDamage", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 5,
    bans: 0,
    presence: 5,
    prioScore: 3,
    wins: 3,
    losses: 2,
    proWinRate: 60,
    kda: 3.1,
    avgBanTurn: null,
    avgPickRound: 2.6,
    blindPickRate: 0,
    averageGameTime: "32:15",
    csPerMinute: 8.2,
    damagePerMinute: 598,
    goldPerMinute: 404,
    csDiffAt15: 3.4,
    goldDiffAt15: 418,
    xpDiffAt15: 724,
    soloqKrChallengerWinRate: 56.4,
  },

  roleData: {
    jungle: {
      goodVs: [],
      stats: null,
      profile: {
        tags: ["melee", "fighter", "assassin", "snowball", "skirmish"],
        abilities: [
          { key: "passive", name: "Cultivation of War", effects: [{ type: "heal", subtype: "revive-at-max-stacks", strength: 8, reliability: 6, priority: 8 }] },
          { key: "q", name: "The Darkin Glaive", effects: [{ type: "heal", strength: 6, reliability: 8, priority: 6 }, { type: "knockup", subtype: "recast", strength: 6, reliability: 7, priority: 7 }] },
          { key: "w", name: "Dreaded Return", effects: [{ type: "displacement", subtype: "pull", strength: 7, reliability: 6, priority: 7 }] },
          { key: "e", name: "Aureate Rush", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }] },
          { key: "r", name: "Grim Deliverance", effects: [{ type: "unstoppable", subtype: "cc-immune", strength: 9, reliability: 9, priority: 9 }, { type: "heal", subtype: "per-champion-hit", strength: 7, reliability: 8, priority: 7 }] },
        ],
        ccProfile: { hard: 5, pick: 4, lockdown: 4 },
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 1 },
        accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 8 },
        threatProfile: { backlineThreat: 9, frontlineThreat: 7, pickThreat: 7, zoneThreat: 3, antiDiveThreat: 2 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "carry" },
        conditions: { requiresFrontline: true, requiresPeel: true },
        comboDependency: { needsFrontline: 6, needsPeel: 5 },
      },
    },
    top: {
      goodVs: [
        { championId: "sion", level: 2, phase: "late" },
        { championId: "gwen", level: 1, phase: "all" },
        { championId: "ksante", level: 1, phase: "all" },
      ],
      stats: {
        picks: 5,
        bans: null,
        presence: 5,
        prioScore: 3,
        wins: 3,
        losses: 2,
        proWinRate: 60,
        kda: 3.1,
        avgBanTurn: null,
        avgPickRound: 2.6,
        blindPickRate: 0,
        averageGameTime: "32:15",
        csPerMinute: 8.2,
        damagePerMinute: 598,
        goldPerMinute: 404,
        csDiffAt15: 3.4,
        goldDiffAt15: 418,
        xpDiffAt15: 724,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "fighter", "assassin", "snowball", "skirmish"],
        abilities: [
          { key: "passive", name: "Cultivation of War", effects: [{ type: "heal", subtype: "revive-at-max-stacks", strength: 8, reliability: 6, priority: 8 }] },
          { key: "q", name: "The Darkin Glaive", effects: [{ type: "heal", strength: 6, reliability: 8, priority: 6 }, { type: "knockup", subtype: "recast", strength: 6, reliability: 7, priority: 7 }] },
          { key: "w", name: "Dreaded Return", effects: [{ type: "displacement", subtype: "pull", strength: 7, reliability: 6, priority: 7 }] },
          { key: "e", name: "Aureate Rush", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }] },
          { key: "r", name: "Grim Deliverance", effects: [{ type: "unstoppable", subtype: "cc-immune", strength: 9, reliability: 9, priority: 9 }, { type: "heal", subtype: "per-champion-hit", strength: 7, reliability: 8, priority: 7 }] },
        ],
        ccProfile: { hard: 5, pick: 4, lockdown: 4 },
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 1 },
        accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 8 },
        threatProfile: { backlineThreat: 9, frontlineThreat: 7, pickThreat: 7, zoneThreat: 3, antiDiveThreat: 2 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "carry" },
        conditions: { requiresFrontline: true, requiresPeel: true },
        comboDependency: { needsFrontline: 6, needsPeel: 5, needsEngage: 0 },
      },
    },
  },
});
