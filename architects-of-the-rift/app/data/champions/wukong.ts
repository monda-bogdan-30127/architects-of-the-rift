import { createChampion } from "./_helpers";

export const wukong = createChampion({
  id: "wukong",
  name: "Wukong",
  image: "/champions/wukong.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "orianna", score: 4 },
    { championId: "azir", score: 4 },
    { championId: "neeko", score: 4 },
    { championId: "miss-fortune", score: 4 },
    { championId: "ahri", score: 4 },
    { championId: "sylas", score: 2 },
    { championId: "viktor", score: 3 },
    { championId: "akali", score: 4 },
    { championId: "renata-glasc", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 4 },
    { type: "dive", strength: 4 },
    { type: "followUp", strength: 4 },
    { type: "reliableCC", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 3, mac: 4, tfg: 5, iq: 4 },

  stats: {
    picks: 11,
    bans: 15,
    presence: 26,
    prioScore: 29,
    wins: 5,
    losses: 6,
    proWinRate: 45,
    kda: 3.8,
    avgBanTurn: 6.1,
    avgPickRound: 1.82,
    blindPickRate: 30,
    averageGameTime: "36:23",
    csPerMinute: 7.1,
    damagePerMinute: 353,
    goldPerMinute: 377,
    csDiffAt15: 5.3,
    goldDiffAt15: 194,
    xpDiffAt15: 230,
    soloqKrChallengerWinRate: 57.39,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "zyra", level: 2, phase: "lane" },
        { championId: "nidalee", level: 2, phase: "late" },
      ],
      stats: {
        picks: 13,
        bans: null,
        presence: 31,
        prioScore: 30,
        wins: 5,
        losses: 8,
        proWinRate: 38,
        kda: 3.3,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 25,
        averageGameTime: "35:32",
        csPerMinute: 7.1,
        damagePerMinute: 352,
        goldPerMinute: 384,
        csDiffAt15: 4.2,
        goldDiffAt15: 196,
        xpDiffAt15: 202,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "dive", "teamfight", "engage", "ad"],
        abilities: [
          { key: "w", name: "Warrior Trickster", effects: [{ type: "mobility", subtype: "stealth-reposition", strength: 7, reliability: 8, priority: 7 }] },
          { key: "e", name: "Nimbus Strike", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "dps", subtype: "entry-damage", strength: 6, reliability: 8, priority: 6 }] },
          { key: "r", name: "Cyclone", effects: [{ type: "knockup", subtype: "aoe-teamfight", strength: 9, reliability: 8, priority: 9 }, { type: "dps", subtype: "extended-spin", strength: 7, reliability: 8, priority: 7 }, { type: "setup", subtype: "wombo", strength: 9, reliability: 8, priority: 9 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 2 },
        accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 7 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 7, pickThreat: 6, zoneThreat: 8, antiDiveThreat: 4 },
        phaseIdentity: { earlyRole: "carry", midRole: "setup", lateRole: "utility" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsFollowUp: 7, needsEngage: 0, needsFrontline: 0 },
      },
    },
  },
});
