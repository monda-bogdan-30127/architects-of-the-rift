import { createChampion } from "./_helpers";

export const orianna = createChampion({
  id: "orianna",
  name: "Orianna",
  image: "/champions/orianna.png",
  roles: ["mid"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "vi", score: 5 },
    { championId: "jarvan-iv", score: 4 },
    { championId: "nocturne", score: 4 },
    { championId: "wukong", score: 4 },
    { championId: "ambessa", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "waveclear", strength: 4 },
    { type: "zoneControl", strength: 5 },
    { type: "followUp", strength: 5 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 2 },
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 5, con: 4, iq: 5 },

  stats: {
    picks: 19,
    bans: 20,
    presence: 39,
    prioScore: 45,
    wins: 14,
    losses: 5,
    proWinRate: 74,
    kda: 5.2,
    avgBanTurn: 5.9,
    avgPickRound: 1.58,
    blindPickRate: 94.7,
    averageGameTime: "34:37",
    csPerMinute: 8.9,
    damagePerMinute: 687,
    goldPerMinute: 410,
    csDiffAt15: 6.9,
    goldDiffAt15: 221,
    xpDiffAt15: 169,
    soloqKrChallengerWinRate: 53.4,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "leblanc", level: 2, phase: "late" },
        { championId: "syndra", level: 2, phase: "late" },
        { championId: "taliyah", level: 2, phase: "late" },
        { championId: "anivia", level: 1, phase: "all" },
        { championId: "ryze", level: 1, phase: "all" },
      ],
      stats: {
        picks: 22,
        bans: null,
        presence: 44,
        prioScore: 45,
        wins: 15,
        losses: 7,
        proWinRate: 68,
        kda: 5,
        avgBanTurn: null,
        avgPickRound: 1.59,
        blindPickRate: 90.9,
        averageGameTime: "34:10",
        csPerMinute: 9,
        damagePerMinute: 647,
        goldPerMinute: 407,
        csDiffAt15: 5.5,
        goldDiffAt15: 77,
        xpDiffAt15: 82,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["ranged", "control", "teamfight", "follow-up", "ap", "secondary-carry"],
        abilities: [
          { key: "q", name: "Command: Attack", effects: [{ type: "poke", strength: 6, reliability: 8, priority: 6 }, { type: "setup", subtype: "ball-placement", strength: 8, reliability: 9, priority: 8 }] },
          { key: "e", name: "Command: Protect", effects: [{ type: "shield", strength: 7, reliability: 9, priority: 7 }, { type: "setup", subtype: "carry-protection", strength: 5, reliability: 8, priority: 5 }] },
          { key: "r", name: "Command: Shockwave", effects: [{ type: "displacement", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "aoe-follow-up", strength: 10, reliability: 8, priority: 10 }, { type: "burst", subtype: "teamfight-swing", strength: 8, reliability: 8, priority: 8 }] },
        ],
        accessProfile: { engageRange: 7, targetAccess: 4, stickiness: 2 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 7, pickThreat: 6, zoneThreat: 8, antiDiveThreat: 5 },
        phaseIdentity: { earlyRole: "utility", midRole: "setup", lateRole: "carry" },
        damageDelivery: { aoe: 5.333333333333333 },
      },
    },
  },
});
