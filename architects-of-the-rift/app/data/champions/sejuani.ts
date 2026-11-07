import { createChampion } from "./_helpers";

export const sejuani = createChampion({
  id: "sejuani",
  name: "Sejuani",
  image: "/champions/sejuani.png",
  roles: ["jungle"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "yasuo", score: 5 },
    { championId: "yone", score: 5 },
    { championId: "sylas", score: 5 },
    { championId: "irelia", score: 4 },
    { championId: "akali", score: 4 },
    { championId: "leblanc", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "aphelios", score: 3 },
    { championId: "azir", score: 4 },
    { championId: "renekton", score: 4 },
    { championId: "gwen", score: 3 }
  ],

  offers: [
    { type: "frontline", strength: 4 },
    { type: "engage", strength: 4 },
    { type: "reliableCC", strength: 4 },
    { type: "followUp", strength: 3 }
  ],

  needs: [
    { type: "sustainedDamage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 5,
    bans: 0,
    presence: 5,
    prioScore: 4,
    wins: 1,
    losses: 4,
    proWinRate: 20,
    kda: 3.3,
    avgBanTurn: null,
    avgPickRound: 2.2,
    blindPickRate: 0,
    averageGameTime: "38:22",
    csPerMinute: 6,
    damagePerMinute: 362,
    goldPerMinute: 343,
    csDiffAt15: -7.4,
    goldDiffAt15: -546,
    xpDiffAt15: -457,
    soloqKrChallengerWinRate: 50,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "aatrox", level: 2, phase: "late" },
        { championId: "naafiri", level: 2, phase: "late" },
        { championId: "viego", level: 2, phase: "late" },
        { championId: "wukong", level: 2, phase: "late" },
      ],
      weakVs: [
        { championId: "trundle", level: 2, phase: "all", note: "ult-ul fură rezistențele tank-ului" },
        { championId: "dr-mundo", level: 2, phase: "late" },
        { championId: "jarvan-iv", level: 2, phase: "lane" },
        { championId: "khazix", level: 2, phase: "lane" },
        { championId: "xin-zhao", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["melee", "frontline", "engage", "tank", "setup", "teamfight"],
        abilities: [
          { key: "passive", name: "Fury of the North", effects: [{ type: "mark", subtype: "melee-ally-proc", strength: 9, reliability: 9, priority: 8 }] },
          { key: "q", name: "Arctic Assault", effects: [{ type: "dash", strength: 6, reliability: 7, priority: 6 }, { type: "knockup", strength: 7, reliability: 7, priority: 7 }, { type: "setup", subtype: "engage-start", strength: 8, reliability: 7, priority: 8 }] },
          { key: "e", name: "Permafrost", effects: [{ type: "stun", subtype: "conditional-freeze", strength: 8, reliability: 8, priority: 8, conditions: ["requires-passive-stacks"] }] },
          { key: "r", name: "Glacial Prison", effects: [{ type: "stun", subtype: "long-range-pick", strength: 9, reliability: 8, priority: 9 }, { type: "slow", subtype: "aoe-follow-up", strength: 7, reliability: 9, priority: 7 }, { type: "setup", subtype: "teamfight-start", strength: 9, reliability: 8, priority: 9 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 3 },
        accessProfile: { engageRange: 8, targetAccess: 6, stickiness: 6 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 8, zoneThreat: 6, antiDiveThreat: 7 },
        phaseIdentity: { earlyRole: "setup", midRole: "tank", lateRole: "setup" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
        synergy: {
          wantsTeam: [
            { id: "sejuani-melee-density", type: "team", targetTags: ["melee"], scalingByCount: [{ count: 1, score: 2 }, { count: 2, score: 6 }, { count: 3, score: 10 }], effect: { score: 0, reason: "Passive and stack access improve with melee allies" } },
          ],
        },
      },
    },
  },
});
