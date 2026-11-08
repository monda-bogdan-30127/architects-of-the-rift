import { createChampion } from "./_helpers";

export const renekton = createChampion({
  id: "renekton",
  name: "Renekton",
  image: "/champions/renekton.png",
  roles: ["top"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "nidalee", score: 4 },
    { championId: "elise", score: 4 },
    { championId: "lee-sin", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "ahri", score: 3 },
    { championId: "akali", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "renata-glasc", score: 3 },
  ],

  offers: [
    { type: "earlyPrio", strength: 5 },
    { type: "engage", strength: 3 },
    { type: "burstDamage", strength: 3 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "engage", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 4, iq: 2 },

  stats: {
    picks: 7,
    bans: 13,
    presence: 20,
    prioScore: 22,
    wins: 5,
    losses: 2,
    proWinRate: 71,
    kda: 3.2,
    avgBanTurn: 9.8,
    avgPickRound: 2.43,
    blindPickRate: 42.9,
    averageGameTime: "37:31",
    csPerMinute: 8.8,
    damagePerMinute: 480,
    goldPerMinute: 402,
    csDiffAt15: 6.1,
    goldDiffAt15: 309,
    xpDiffAt15: 1,
    soloqKrChallengerWinRate: 59.18,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "camille", level: 2, phase: "lane" },
        { championId: "galio", level: 2, phase: "lane" },
        { championId: "gangplank", level: 2, phase: "lane" },
        { championId: "irelia", level: 2, phase: "lane" },
        { championId: "kayle", level: 2, phase: "lane" },
        { championId: "nasus", level: 2, phase: "lane" },
        { championId: "ornn", level: 2, phase: "lane" },
        { championId: "reksai", level: 2, phase: "lane" },
        { championId: "shen", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
        { championId: "twisted-fate", level: 2, phase: "lane" },
        { championId: "vayne", level: 2, phase: "lane" },
        { championId: "vladimir", level: 2, phase: "lane" },
        { championId: "yasuo", level: 2, phase: "lane" },
        { championId: "yone", level: 2, phase: "lane" },
        { championId: "ambessa", level: 1, phase: "all" },
        { championId: "olaf", level: 1, phase: "all" },
      ],
      stats: {
        picks: 8,
        bans: null,
        presence: 21,
        prioScore: 20,
        wins: 5,
        losses: 3,
        proWinRate: 63,
        kda: 2.5,
        avgBanTurn: null,
        avgPickRound: 2.63,
        blindPickRate: 37.5,
        averageGameTime: "37:14",
        csPerMinute: 8.7,
        damagePerMinute: 465,
        goldPerMinute: 395,
        csDiffAt15: 9.6,
        goldDiffAt15: 443,
        xpDiffAt15: 180,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "bruiser", "lane-bully", "setup", "early-game"],
        abilities: [
          { key: "w", name: "Ruthless Predator", effects: [{ type: "stun", strength: 7, reliability: 9, priority: 7 }, { type: "burst", subtype: "targeted-trade", strength: 7, reliability: 9, priority: 7 }] },
          { key: "e", name: "Slice and Dice", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "mobility", subtype: "double-dash-window", strength: 7, reliability: 8, priority: 7 }] },
          { key: "r", name: "Dominus", effects: [{ type: "dps", subtype: "extended-fight", strength: 6, reliability: 8, priority: 6 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 7, pickThreat: 7, zoneThreat: 4, antiDiveThreat: 4 },
        phaseIdentity: { earlyRole: "carry", midRole: "setup", lateRole: "utility" },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
      },
    },
  },
});
