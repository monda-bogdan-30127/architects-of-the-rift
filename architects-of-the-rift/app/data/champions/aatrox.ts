import { createChampion } from "./_helpers";

export const aatrox = createChampion({
  id: "aatrox",
  name: "Aatrox",
  image: "/champions/aatrox.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "galio", score: 5 },
    { championId: "aurora", score: 4 },
    { championId: "ahri", score: 5 },
    { championId: "viktor", score: 3 },
    { championId: "wukong", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "lissandra", score: 2 }
  ],

  offers: [
    { type: "earlyPrio", strength: 3 },
    { type: "objectiveControl", strength: 3 },
    { type: "roamPressure", strength: 3 },
    { type: "sideLanePressure", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 4,
    bans: 0,
    presence: 4,
    prioScore: 2,
    wins: 1,
    losses: 3,
    proWinRate: 25,
    kda: 2.6,
    avgBanTurn: null,
    avgPickRound: 3.25,
    blindPickRate: 0,
    averageGameTime: "31:00",
    csPerMinute: 7.9,
    damagePerMinute: 484,
    goldPerMinute: 362,
    csDiffAt15: -0.8,
    goldDiffAt15: -330,
    xpDiffAt15: 244,
    soloqKrChallengerWinRate: 57.14,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "ivern", level: 2, phase: "lane" },
        { championId: "kindred", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 1,
        prioScore: 0,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 1.6,
        avgBanTurn: null,
        avgPickRound: 3,
        blindPickRate: 0,
        averageGameTime: "26:51",
        csPerMinute: 6.6,
        damagePerMinute: 460,
        goldPerMinute: 368,
        csDiffAt15: 22,
        goldDiffAt15: 242,
        xpDiffAt15: 840,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "drain-fighter", "skirmish", "teamfight", "ad"],
        abilities: [
          { key: "q", name: "The Darkin Blade", effects: [{ type: "burst", strength: 7, reliability: 6, priority: 7 }, { type: "knockup", subtype: "sweetspot", strength: 6, reliability: 6, priority: 6 }] },
          { key: "w", name: "Infernal Chains", effects: [{ type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "setup", subtype: "pullback-zone", strength: 6, reliability: 6, priority: 6 }] },
          { key: "e", name: "Umbral Dash", effects: [{ type: "dash", strength: 5, reliability: 8, priority: 5 }, { type: "heal", subtype: "self-sustain", strength: 6, reliability: 8, priority: 6 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 5, zoneThreat: 6, antiDiveThreat: 5 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
        conditions: { requiresPeel: true },
        comboDependency: { needsPeel: 4 },
      },
    },
    top: {
      goodVs: [
        { championId: "galio", level: 2, phase: "lane" },
        { championId: "mordekaiser", level: 2, phase: "lane" },
        { championId: "reksai", level: 2, phase: "lane" },
        { championId: "shen", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
        { championId: "yorick", level: 2, phase: "lane" },
        { championId: "jayce", level: 2, phase: "late" },
      ],
      stats: {
        picks: 3,
        bans: null,
        presence: 3,
        prioScore: 1,
        wins: 1,
        losses: 2,
        proWinRate: 33,
        kda: 3.5,
        avgBanTurn: null,
        avgPickRound: 3.33,
        blindPickRate: 0,
        averageGameTime: "32:23",
        csPerMinute: 8.3,
        damagePerMinute: 491,
        goldPerMinute: 360,
        csDiffAt15: -8.3,
        goldDiffAt15: -520,
        xpDiffAt15: 45,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "drain-fighter", "skirmish", "teamfight", "blindable"],
        abilities: [
          { key: "q", name: "The Darkin Blade", effects: [{ type: "burst", strength: 7, reliability: 6, priority: 7 }, { type: "knockup", subtype: "sweetspot", strength: 6, reliability: 6, priority: 6 }] },
          { key: "w", name: "Infernal Chains", effects: [{ type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "pick", subtype: "pullback-zone", strength: 6, reliability: 6, priority: 6 }] },
          { key: "e", name: "Umbral Dash", effects: [{ type: "dash", strength: 5, reliability: 8, priority: 5 }, { type: "heal", subtype: "self-sustain", strength: 6, reliability: 8, priority: 6 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 5, zoneThreat: 6, antiDiveThreat: 5 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
        conditions: { requiresPeel: true },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 4 },
      },
    },
  },
});
