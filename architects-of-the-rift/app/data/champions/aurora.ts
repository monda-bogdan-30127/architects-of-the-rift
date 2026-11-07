import { createChampion } from "./_helpers";

export const aurora = createChampion({
  id: "aurora",
  name: "Aurora",
  image: "/champions/aurora.png",
  roles: ["mid", "top"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "sejuani", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "alistar", score: 3 },
    { championId: "vi", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "zoneControl", strength: 3 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 4, con: 3, iq: 4 },

  stats: {
    picks: 4,
    bans: 3,
    presence: 7,
    prioScore: 8,
    wins: 2,
    losses: 2,
    proWinRate: 50,
    kda: 3.4,
    avgBanTurn: 8.7,
    avgPickRound: 1.75,
    blindPickRate: 50,
    averageGameTime: "29:49",
    csPerMinute: 8.9,
    damagePerMinute: 746,
    goldPerMinute: 406,
    csDiffAt15: 0,
    goldDiffAt15: 438,
    xpDiffAt15: 156,
    soloqKrChallengerWinRate: 53.81,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "orianna", level: 1, phase: "all" },
        { championId: "viktor", level: 1, phase: "all" },
      ],
      stats: {
        picks: 3,
        bans: null,
        presence: 6,
        prioScore: 6,
        wins: 1,
        losses: 2,
        proWinRate: 33,
        kda: 3.4,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 66.7,
        averageGameTime: "28:03",
        csPerMinute: 8.8,
        damagePerMinute: 830,
        goldPerMinute: 411,
        csDiffAt15: -7.3,
        goldDiffAt15: 401,
        xpDiffAt15: -4,
        soloqKrChallengerWinRate: null,
      },
    },
    top: {
      goodVs: [
        { championId: "ornn", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 2,
        bans: null,
        presence: 5,
        prioScore: 5,
        wins: 2,
        losses: 0,
        proWinRate: 100,
        kda: 6.5,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 50,
        averageGameTime: "34:18",
        csPerMinute: 9,
        damagePerMinute: 682,
        goldPerMinute: 398,
        csDiffAt15: 29.5,
        goldDiffAt15: 747,
        xpDiffAt15: 625,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["ranged", "ap", "skirmish", "zone-control", "carry"],
        abilities: [
          { key: "q", name: "Aurora Q", effects: [{ type: "poke", strength: 6, reliability: 7, priority: 6 }, { type: "burst", subtype: "return-hit", strength: 7, reliability: 6, priority: 7 }] },
          { key: "w", name: "Aurora W", effects: [{ type: "mobility", subtype: "phase-shift", strength: 7, reliability: 8, priority: 7 }] },
          { key: "r", name: "Aurora R", effects: [{ type: "zone-control", subtype: "arena", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "fight-trap", strength: 8, reliability: 8, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 2, visionControl: 2 },
        accessProfile: { engageRange: 7, targetAccess: 7, stickiness: 5 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 6, pickThreat: 5, zoneThreat: 9, antiDiveThreat: 4 },
        phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
        conditions: { requiresFrontline: true, requiresEngage: true, requiresPeel: true },
        comboDependency: { needsEngage: 5, needsFrontline: 6, needsPeel: 4 },
      },
    },
  },
});
