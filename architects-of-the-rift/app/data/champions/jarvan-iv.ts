import { createChampion } from "./_helpers";

export const jarvanIv = createChampion({
  id: "jarvan-iv",
  name: "Jarvan IV",
  image: "/champions/jarvan-iv.png",
  roles: ["jungle"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "orianna", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "rumble", score: 4 },
    { championId: "kaisa", score: 4 },
    { championId: "miss-fortune", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "neeko", score: 3 },
  ],

  offers: [
    { type: "engage", strength: 5 },
    { type: "dive", strength: 4 },
    { type: "reliableCC", strength: 3 },
    { type: "earlyPrio", strength: 4 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 21,
    bans: 22,
    presence: 43,
    prioScore: 50,
    wins: 12,
    losses: 9,
    proWinRate: 57,
    kda: 4.2,
    avgBanTurn: 5,
    avgPickRound: 1.52,
    blindPickRate: 50,
    averageGameTime: "33:00",
    csPerMinute: 7.3,
    damagePerMinute: 344,
    goldPerMinute: 385,
    csDiffAt15: 3,
    goldDiffAt15: -3,
    xpDiffAt15: 169,
    soloqKrChallengerWinRate: 55,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "belveth", level: 2, phase: "lane" },
        { championId: "karthus", level: 2, phase: "lane" },
        { championId: "master-yi", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 24,
        bans: null,
        presence: 47,
        prioScore: 48,
        wins: 14,
        losses: 10,
        proWinRate: 58,
        kda: 4.4,
        avgBanTurn: null,
        avgPickRound: 1.54,
        blindPickRate: 56.5,
        averageGameTime: "32:48",
        csPerMinute: 7.3,
        damagePerMinute: 347,
        goldPerMinute: 389,
        csDiffAt15: 2.7,
        goldDiffAt15: -8,
        xpDiffAt15: 144,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "engage", "dive", "setup", "teamfight", "ad"],
        abilities: [
          { key: "q", name: "Dragon Strike", effects: [{ type: "poke", strength: 4, reliability: 7, priority: 4 }, { type: "setup", subtype: "flag-combo", strength: 7, reliability: 8, priority: 7 }] },
          { key: "e", name: "Demacian Standard", effects: [{ type: "setup", subtype: "combo-anchor", strength: 8, reliability: 9, priority: 8 }] },
          { key: "r", name: "Cataclysm", effects: [{ type: "pick", subtype: "carry-isolation", strength: 9, reliability: 9, priority: 9 }, { type: "zone-control", subtype: "terrain-cage", strength: 8, reliability: 8, priority: 8 }, { type: "setup", subtype: "follow-up-window", strength: 9, reliability: 9, priority: 9 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 2 },
        accessProfile: { engageRange: 8, targetAccess: 8, stickiness: 7 },
        threatProfile: { backlineThreat: 9, frontlineThreat: 6, pickThreat: 9, zoneThreat: 8, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "setup", midRole: "pick", lateRole: "utility" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsFollowUp: 8, needsEngage: 0, needsFrontline: 0 },
      },
    },
  },
});
