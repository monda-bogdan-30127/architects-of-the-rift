import { createChampion } from "./_helpers";

export const xinZhao = createChampion({
  id: "xin-zhao",
  name: "Xin Zhao",
  image: "/champions/xin-zhao.png",
  roles: ["jungle"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "sivir", score: 4 },
    { championId: "karma", score: 4 },
    { championId: "seraphine", score: 4 },
    { championId: "annie", score: 3 },
    { championId: "lulu", score: 3 }
  ],

  offers: [
    { type: "earlyPrio", strength: 4 },
    { type: "dive", strength: 4 },
    { type: "objectiveControl", strength: 3 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 3, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 6,
    bans: 5,
    presence: 11,
    prioScore: 11,
    wins: 4,
    losses: 2,
    proWinRate: 67,
    kda: 6.6,
    avgBanTurn: 8,
    avgPickRound: 1.83,
    blindPickRate: 16.7,
    averageGameTime: "34:17",
    csPerMinute: 7.5,
    damagePerMinute: 384,
    goldPerMinute: 394,
    csDiffAt15: -2.8,
    goldDiffAt15: 147,
    xpDiffAt15: -103,
    soloqKrChallengerWinRate: 59.6,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "belveth", level: 2, phase: "lane" },
        { championId: "brand", level: 2, phase: "lane" },
        { championId: "fiddlesticks", level: 2, phase: "lane" },
        { championId: "ivern", level: 2, phase: "lane" },
        { championId: "karthus", level: 2, phase: "lane" },
        { championId: "kindred", level: 2, phase: "lane" },
        { championId: "lillia", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 7,
        bans: null,
        presence: 13,
        prioScore: 12,
        wins: 5,
        losses: 2,
        proWinRate: 71,
        kda: 7.2,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 28.6,
        averageGameTime: "34:38",
        csPerMinute: 7.5,
        damagePerMinute: 395,
        goldPerMinute: 396,
        csDiffAt15: -2,
        goldDiffAt15: 119,
        xpDiffAt15: -48,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "dive", "burst", "skirmish", "primary-carry", "ad"],
        abilities: [
          { key: "q", name: "Three Talon Strike", effects: [{ type: "dps", strength: 6, reliability: 8, priority: 6 }, { type: "knockup", subtype: "3-hit-conditional", strength: 7, reliability: 7, priority: 7 }] },
          { key: "e", name: "Audacious Charge", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "setup", subtype: "backline-entry", strength: 7, reliability: 8, priority: 7 }] },
          { key: "r", name: "Crescent Guard", effects: [{ type: "zone-control", subtype: "carry-space-creation", strength: 8, reliability: 8, priority: 8 }, { type: "anti-engage", subtype: "outer-threat-denial", strength: 7, reliability: 7, priority: 7 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 5, visionControl: 4 },
        accessProfile: { engageRange: 7, targetAccess: 9, stickiness: 8 },
        threatProfile: { backlineThreat: 9, frontlineThreat: 6, pickThreat: 7, zoneThreat: 5, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "utility" },
        conditions: { requiresPeel: true },
        comboDependency: { needsEnchanter: 7, needsPeel: 6 },
        synergy: {
          goodWith: [
            { id: "xin-enchanter-shell", type: "ally", targetTags: ["enchanter", "shielding", "healing"], effect: { score: 6, reason: "Protection extends commit windows" } },
          ],
        },
      },
    },
  },
});
