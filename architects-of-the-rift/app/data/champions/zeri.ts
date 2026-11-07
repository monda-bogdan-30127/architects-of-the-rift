import { createChampion } from "./_helpers";

export const zeri = createChampion({
  id: "zeri",
  name: "Zeri",
  image: "/champions/zeri.png",
  roles: ["adc"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "milio", score: 4 },
    { championId: "renata-glasc", score: 4 },
    { championId: "nami", score: 4 },
    { championId: "rakan", score: 3 },
    { championId: "maokai", score: 3 },
    { championId: "sejuani", score: 3 },
  ],

  offers: [
    { type: "sustainedDamage", strength: 5 },
    { type: "scaling", strength: 5 },
    { type: "poke", strength: 2 }
  ],

  needs: [
    { type: "frontline", priority: 3 },
    { type: "peel", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 3 },
    { exposedTo: "backlineAccess", severity: 3 },
    { exposedTo: "pick", severity: 3 },
    { exposedTo: "earlyPrio", severity: 2 },
    { exposedTo: "objectiveControl", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

  stats: {
    picks: 3,
    bans: 0,
    presence: 3,
    prioScore: 3,
    wins: 2,
    losses: 1,
    proWinRate: 67,
    kda: 3.3,
    avgBanTurn: null,
    avgPickRound: 1.67,
    blindPickRate: 0,
    averageGameTime: "32:40",
    csPerMinute: 10.9,
    damagePerMinute: 726,
    goldPerMinute: 506,
    csDiffAt15: 3,
    goldDiffAt15: 305,
    xpDiffAt15: -219,
    soloqKrChallengerWinRate: 61.17,
  },

  roleData: {
    adc: {
      goodVs: [
        { championId: "jhin", level: 2, phase: "late" },
        { championId: "ziggs", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "caitlyn", level: 2, phase: "lane" },
        { championId: "nilah", level: 2, phase: "lane" },
        { championId: "senna", level: 2, phase: "lane" },
        { championId: "seraphine", level: 2, phase: "lane" },
        { championId: "xayah", level: 2, phase: "lane" },
      ],
      mustWith: ["lulu", "yuumi"],
      stats: {
        picks: 4,
        bans: null,
        presence: 5,
        prioScore: 4,
        wins: 2,
        losses: 2,
        proWinRate: 50,
        kda: 3.6,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "33:41",
        csPerMinute: 11.1,
        damagePerMinute: 763,
        goldPerMinute: 507,
        csDiffAt15: 5,
        goldDiffAt15: 178,
        xpDiffAt15: -228,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["ranged", "backline", "dps", "primary-carry", "front-to-back", "teamfight", "ad"],
        abilities: [
          { key: "q", name: "Burst Fire", effects: [{ type: "dps", subtype: "main-pattern", strength: 9, reliability: 7, priority: 9 }] },
          { key: "w", name: "Ultrashock Laser", effects: [{ type: "poke", strength: 5, reliability: 5, priority: 5 }] },
          { key: "e", name: "Spark Surge", effects: [{ type: "dash", strength: 7, reliability: 7, priority: 7 }, { type: "mobility", subtype: "repositioning", strength: 8, reliability: 8, priority: 8 }] },
          { key: "r", name: "Lightning Crash", effects: [{ type: "dps", subtype: "extended-fight", strength: 9, reliability: 8, priority: 9 }, { type: "zone-control", subtype: "teamfight-threat-space", strength: 6, reliability: 7, priority: 6 }] },
        ],
        accessProfile: { engageRange: 2, targetAccess: 5, stickiness: 7 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 9, pickThreat: 2, zoneThreat: 5, antiDiveThreat: 1 },
        phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
        conditions: { requiresFrontline: true, requiresPeel: true },
        comboDependency: { needsFrontline: 8, needsPeel: 9, needsEnchanter: 7 },
        synergy: {
          wantsTeam: [
            { id: "zeri-protection-shell", type: "team", targetTags: ["frontline", "enchanter", "warden"], minCount: 2, effect: { score: 8, reason: "Needs real protection structure to unlock full value" } },
          ],
        },
      },
    },
  },
});
