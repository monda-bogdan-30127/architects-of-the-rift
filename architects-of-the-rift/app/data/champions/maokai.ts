import { createChampion } from "./_helpers";

export const maokai = createChampion({
  id: "maokai",
  name: "Maokai",
  image: "/champions/maokai.png",
  roles: ["jungle", "support"],
  damageProfile: ["AP"],
  attackType: "melee",

  synergyWith: [
    { championId: "miss-fortune", score: 5 },
    { championId: "jayce", score: 5 },
    { championId: "xayah", score: 4 },
    { championId: "orianna", score: 4 },
    { championId: "yasuo", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "seraphine", score: 3 },
    { championId: "ziggs", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 4 },
    { type: "engage", strength: 4 },
    { type: "zoneControl", strength: 4 },
    { type: "objectiveControl", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 4,
    bans: 8,
    presence: 12,
    prioScore: 13,
    wins: 0,
    losses: 4,
    proWinRate: 0,
    kda: 1.1,
    avgBanTurn: 7.1,
    avgPickRound: 2.75,
    blindPickRate: 0,
    averageGameTime: "30:14",
    csPerMinute: 6.2,
    damagePerMinute: 507,
    goldPerMinute: 363,
    csDiffAt15: -14.5,
    goldDiffAt15: -584,
    xpDiffAt15: -907,
    soloqKrChallengerWinRate: 56.69,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "belveth", level: 2, phase: "all", note: "CC point-click (W) pe un campion care trebuie să stea în luptă" },
        { championId: "khazix", level: 2, phase: "all", note: "tank cu CC point-click, nu poate fi izolat" },
        { championId: "master-yi", level: 2, phase: "all", note: "W point-click îl prinde pe Yi după Q" },
        { championId: "naafiri", level: 2, phase: "all", note: "CC point-click (W) și tank pe care nu-l poate burst-a" },
        { championId: "rengar", level: 2, phase: "all", note: "tank cu CC point-click, nu poate fi one-shot" },
        { championId: "pantheon", level: 2, phase: "late" },
      ],
      stats: {
        picks: 4,
        bans: null,
        presence: 13,
        prioScore: 13,
        wins: 0,
        losses: 4,
        proWinRate: 0,
        kda: 1.1,
        avgBanTurn: null,
        avgPickRound: 2.75,
        blindPickRate: 0,
        averageGameTime: "30:14",
        csPerMinute: 6.2,
        damagePerMinute: 507,
        goldPerMinute: 363,
        csDiffAt15: -14.5,
        goldDiffAt15: -584,
        xpDiffAt15: -907,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "frontline", "engage", "tank", "vision", "utility"],
        abilities: [
          { key: "q", name: "Bramble Smash", effects: [{ type: "displacement", strength: 7, reliability: 8, priority: 7 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }] },
          { key: "w", name: "Twisted Advance", effects: [{ type: "dash", subtype: "point-and-click-root", strength: 7, reliability: 9, priority: 7 }, { type: "root", strength: 8, reliability: 9, priority: 8 }, { type: "pick", subtype: "reliable-catch", strength: 8, reliability: 9, priority: 8 }] },
          { key: "e", name: "Sapling Toss", effects: [{ type: "vision", subtype: "brush-control", strength: 8, reliability: 9, priority: 8 }, { type: "zone-control", subtype: "area-scouting", strength: 7, reliability: 9, priority: 7 }] },
          { key: "r", name: "Nature's Grasp", effects: [{ type: "root", subtype: "long-range-teamfight", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "front-to-back-engage", strength: 9, reliability: 8, priority: 9 }, { type: "zone-control", subtype: "lane-fill", strength: 8, reliability: 8, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 9 },
        accessProfile: { engageRange: 8, targetAccess: 5, stickiness: 6 },
        threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 8, zoneThreat: 9, antiDiveThreat: 7 },
        phaseIdentity: { earlyRole: "utility", midRole: "setup", lateRole: "tank" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsFollowUp: 7 },
      },
    },
    support: {
      goodVs: [],
      stats: null,
    },
  },
});
