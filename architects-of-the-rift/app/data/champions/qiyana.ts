import { createChampion } from "./_helpers";

export const qiyana = createChampion({
  id: "qiyana",
  name: "Qiyana",
  image: "/champions/qiyana.png",
  roles: ["jungle"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "twisted-fate", score: 5 },
    { championId: "galio", score: 5 },
    { championId: "pantheon", score: 4 },
    { championId: "pyke", score: 4 },
    { championId: "leona", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "renekton", score: 2 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "backlineAccess", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 18,
    bans: 28,
    presence: 46,
    prioScore: 56,
    wins: 9,
    losses: 9,
    proWinRate: 50,
    kda: 3.1,
    avgBanTurn: 3.8,
    avgPickRound: 1.44,
    blindPickRate: 55.6,
    averageGameTime: "33:08",
    csPerMinute: 7.9,
    damagePerMinute: 554,
    goldPerMinute: 452,
    csDiffAt15: 5.1,
    goldDiffAt15: 630,
    xpDiffAt15: 287,
    soloqKrChallengerWinRate: 58.1,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "ivern", level: 2, phase: "lane" },
        { championId: "karthus", level: 2, phase: "lane" },
        { championId: "lillia", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 20,
        bans: null,
        presence: 52,
        prioScore: 56,
        wins: 10,
        losses: 10,
        proWinRate: 50,
        kda: 3,
        avgBanTurn: null,
        avgPickRound: 1.4,
        blindPickRate: 60,
        averageGameTime: "33:06",
        csPerMinute: 8,
        damagePerMinute: 557,
        goldPerMinute: 459,
        csDiffAt15: 6.8,
        goldDiffAt15: 714,
        xpDiffAt15: 389,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "assassin", "pick", "burst", "terrain-combo", "ad"],
        abilities: [
          { key: "q", name: "Elemental Wrath / Edge of Ixtal", effects: [{ type: "burst", strength: 8, reliability: 7, priority: 8 }, { type: "root", subtype: "river-empower", strength: 6, reliability: 6, priority: 6 }] },
          { key: "w", name: "Terrashape", effects: [{ type: "mobility", subtype: "element-access", strength: 7, reliability: 9, priority: 7 }] },
          { key: "e", name: "Audacity", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }] },
          { key: "r", name: "Supreme Display of Talent", effects: [{ type: "stun", subtype: "terrain-aoe", strength: 10, reliability: 7, priority: 10 }, { type: "burst", subtype: "teamfight-spike", strength: 9, reliability: 7, priority: 9 }, { type: "pick", subtype: "catch-on-wall", strength: 8, reliability: 7, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 2 },
        accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 7 },
        threatProfile: { backlineThreat: 10, frontlineThreat: 4, pickThreat: 9, zoneThreat: 8, antiDiveThreat: 1 },
        phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "pick" },
        conditions: { requiresFollowUp: true, requiresFrontline: true },
        comboDependency: { needsFollowUp: 6, needsFrontline: 4 },
      },
    },
  },
});
