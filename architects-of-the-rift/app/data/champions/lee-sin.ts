import { createChampion } from "./_helpers";

export const leeSin = createChampion({
  id: "lee-sin",
  name: "Lee Sin",
  image: "/champions/lee-sin.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "leblanc", score: 5 },
    { championId: "renekton", score: 4 },
    { championId: "twisted-fate", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "sylas", score: 3 },
    { championId: "pyke", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rakan", score: 2 },
  ],

  offers: [
    { type: "earlyPrio", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "dive", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 24,
    bans: 19,
    presence: 43,
    prioScore: 51,
    wins: 12,
    losses: 12,
    proWinRate: 50,
    kda: 3.6,
    avgBanTurn: 5.2,
    avgPickRound: 1.29,
    blindPickRate: 66.7,
    averageGameTime: "34:29",
    csPerMinute: 7.3,
    damagePerMinute: 385,
    goldPerMinute: 390,
    csDiffAt15: 1.6,
    goldDiffAt15: -49,
    xpDiffAt15: 208,
    soloqKrChallengerWinRate: 57.05,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "amumu", level: 2, phase: "lane" },
        { championId: "belveth", level: 2, phase: "lane" },
        { championId: "brand", level: 2, phase: "lane" },
        { championId: "chogath", level: 2, phase: "lane" },
        { championId: "diana", level: 2, phase: "lane" },
        { championId: "dr-mundo", level: 2, phase: "lane" },
        { championId: "ekko", level: 2, phase: "lane" },
        { championId: "evelynn", level: 2, phase: "lane" },
        { championId: "fiddlesticks", level: 2, phase: "lane" },
        { championId: "ivern", level: 2, phase: "lane" },
        { championId: "karthus", level: 2, phase: "lane" },
        { championId: "kayn", level: 2, phase: "lane" },
        { championId: "kindred", level: 2, phase: "lane" },
        { championId: "lillia", level: 2, phase: "lane" },
        { championId: "master-yi", level: 2, phase: "lane" },
        { championId: "nasus", level: 2, phase: "lane" },
        { championId: "sejuani", level: 2, phase: "lane" },
        { championId: "shyvana", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 27,
        bans: null,
        presence: 47,
        prioScore: 49,
        wins: 13,
        losses: 14,
        proWinRate: 48,
        kda: 3.3,
        avgBanTurn: null,
        avgPickRound: 1.3,
        blindPickRate: 59.3,
        averageGameTime: "34:22",
        csPerMinute: 7.3,
        damagePerMinute: 372,
        goldPerMinute: 388,
        csDiffAt15: 0.9,
        goldDiffAt15: -98,
        xpDiffAt15: 142,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "skirmish", "playmaker", "pick", "ad"],
        abilities: [
          { key: "q", name: "Sonic Wave / Resonating Strike", effects: [{ type: "poke", strength: 5, reliability: 7, priority: 5 }, { type: "dash", subtype: "targeted-follow", strength: 8, reliability: 8, priority: 8 }] },
          { key: "w", name: "Safeguard / Iron Will", effects: [{ type: "dash", subtype: "ward-hop", strength: 8, reliability: 8, priority: 8 }, { type: "shield", strength: 5, reliability: 8, priority: 5 }] },
          { key: "r", name: "Dragon's Rage", effects: [{ type: "displacement", subtype: "insec-kick", strength: 10, reliability: 7, priority: 10 }, { type: "pick", subtype: "kick-isolation", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "carry-delivery", strength: 9, reliability: 7, priority: 9 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 10, visionControl: 3 },
        accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 6 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 5, pickThreat: 10, zoneThreat: 4, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "utility" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsFollowUp: 7 },
      },
    },
  },
});
