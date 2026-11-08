import { createChampion } from "./_helpers";

export const gnar = createChampion({
  id: "gnar",
  name: "Gnar",
  image: "/champions/gnar.png",
  roles: ["top"],
  damageProfile: ["AD"],
  attackType: "ranged",

  synergyWith: [
    { championId: "lee-sin", score: 3 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "ambessa", score: 2 },
    { championId: "xin-zhao", score: 2 },
    { championId: "rell", score: 3 },
    { championId: "anivia", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "nocturne", score: 4 }
  ],

  offers: [
    { type: "sideLanePressure", strength: 3 },
    { type: "poke", strength: 3 },
    { type: "disengage", strength: 3 },
    { type: "engage", strength: 3 },
    { type: "reliableCC", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 },
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 1 }
  ],

  playerScaling: { mec: 4, tfg: 4, con: 3, iq: 2 },

  stats: {
    picks: 10,
    bans: 7,
    presence: 17,
    prioScore: 19,
    wins: 7,
    losses: 3,
    proWinRate: 70,
    kda: 3.4,
    avgBanTurn: 8.3,
    avgPickRound: 1.5,
    blindPickRate: 50,
    averageGameTime: "36:17",
    csPerMinute: 8.8,
    damagePerMinute: 476,
    goldPerMinute: 397,
    csDiffAt15: 4.8,
    goldDiffAt15: 187,
    xpDiffAt15: 125,
    soloqKrChallengerWinRate: 56.48,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "udyr", level: 2, phase: "all", note: "kite contra lui Udyr, care n-are gap-closer" },
        { championId: "volibear", level: 2, phase: "all", note: "kite contra juggernaut-ului fără range" },
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "darius", level: 2, phase: "lane" },
        { championId: "fiora", level: 2, phase: "lane" },
        { championId: "gwen", level: 2, phase: "lane" },
        { championId: "illaoi", level: 2, phase: "lane" },
        { championId: "kayle", level: 2, phase: "lane" },
        { championId: "kled", level: 2, phase: "lane" },
        { championId: "ksante", level: 2, phase: "lane" },
        { championId: "mordekaiser", level: 2, phase: "lane" },
        { championId: "nasus", level: 2, phase: "lane" },
        { championId: "olaf", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
        { championId: "sett", level: 2, phase: "lane" },
        { championId: "trundle", level: 2, phase: "lane" },
        { championId: "urgot", level: 2, phase: "lane" },
        { championId: "warwick", level: 2, phase: "lane" },
        { championId: "zaahen", level: 2, phase: "lane" },
        { championId: "aurora", level: 1, phase: "all" },
        { championId: "jayce", level: 1, phase: "all" },
      ],
      stats: {
        picks: 11,
        bans: null,
        presence: 19,
        prioScore: 19,
        wins: 8,
        losses: 3,
        proWinRate: 73,
        kda: 3.4,
        avgBanTurn: null,
        avgPickRound: 1.55,
        blindPickRate: 54.5,
        averageGameTime: "35:54",
        csPerMinute: 8.9,
        damagePerMinute: 459,
        goldPerMinute: 397,
        csDiffAt15: 1.5,
        goldDiffAt15: 71,
        xpDiffAt15: 35,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["ranged", "teamfight", "engage", "weakside", "blindable"],
        abilities: [
          { key: "q", name: "Boomerang Throw / Boulder Toss", effects: [{ type: "poke", strength: 6, reliability: 8, priority: 6 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }] },
          { key: "e", name: "Hop / Crunch", effects: [{ type: "dash", strength: 6, reliability: 8, priority: 6 }, { type: "setup", subtype: "mega-gnar-entry", strength: 6, reliability: 7, priority: 6 }] },
          { key: "r", name: "GNAR!", effects: [{ type: "displacement", subtype: "wall-slam", strength: 10, reliability: 7, priority: 10 }, { type: "stun", subtype: "multi-target", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "wombo", strength: 10, reliability: 7, priority: 10 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 10, visionControl: 1 },
        accessProfile: { engageRange: 7, targetAccess: 6, stickiness: 5 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 6, pickThreat: 5, zoneThreat: 8, antiDiveThreat: 7 },
        phaseIdentity: { earlyRole: "secondary-carry", midRole: "setup", lateRole: "utility" },
        conditions: { requiresEngage: true, requiresFollowUp: true },
        comboDependency: { needsEngage: 4, needsFrontline: 0, needsPeel: 0 },
      },
    },
  },
});
