import { createChampion } from "./_helpers";

export const pantheon = createChampion({
  id: "pantheon",
  name: "Pantheon",
  image: "/champions/pantheon.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "twisted-fate", score: 4 },
    { championId: "galio", score: 4 },
    { championId: "ahri", score: 3 },
    { championId: "taliyah", score: 3 },
    { championId: "kaisa", score: 4 },
    { championId: "ryze", score: 5 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "pick", strength: 4 },
    { type: "engage", strength: 4 },
    { type: "earlyPrio", strength: 5 },
    { type: "roamPressure", strength: 5 },
    { type: "burstDamage", strength: 4 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "zoneControl", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "peel", severity: 1 },
    { exposedTo: "scaling", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 12,
    bans: 12,
    presence: 24,
    prioScore: 26,
    wins: 6,
    losses: 6,
    proWinRate: 50,
    kda: 3.5,
    avgBanTurn: 4.9,
    avgPickRound: 1.92,
    blindPickRate: 33.3,
    averageGameTime: "33:29",
    csPerMinute: 6.7,
    damagePerMinute: 394,
    goldPerMinute: 381,
    csDiffAt15: -10,
    goldDiffAt15: 4,
    xpDiffAt15: -338,
    soloqKrChallengerWinRate: 55.2,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "belveth", level: 2, phase: "lane" },
        { championId: "graves", level: 2, phase: "lane" },
        { championId: "ivern", level: 2, phase: "lane" },
        { championId: "karthus", level: 2, phase: "lane" },
        { championId: "kindred", level: 2, phase: "lane" },
        { championId: "nocturne", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 15,
        bans: null,
        presence: 28,
        prioScore: 25,
        wins: 7,
        losses: 8,
        proWinRate: 47,
        kda: 3.2,
        avgBanTurn: null,
        avgPickRound: 2.07,
        blindPickRate: 46.7,
        averageGameTime: "33:10",
        csPerMinute: 6.7,
        damagePerMinute: 401,
        goldPerMinute: 383,
        csDiffAt15: -7.9,
        goldDiffAt15: -108,
        xpDiffAt15: -244,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "burst", "pick", "early-game", "semi-global", "ad"],
        abilities: [
          { key: "w", name: "Shield Vault", effects: [{ type: "stun", strength: 8, reliability: 10, priority: 8 }, { type: "pick", subtype: "targeted-catch", strength: 8, reliability: 10, priority: 8 }] },
          { key: "e", name: "Aegis Assault", effects: [{ type: "anti-engage", subtype: "front-facing-block", strength: 7, reliability: 8, priority: 7 }] },
          { key: "r", name: "Grand Starfall", effects: [{ type: "mobility", subtype: "map-roam", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "cross-map-collapse", strength: 8, reliability: 8, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 3 },
        accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 6 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 5, pickThreat: 9, zoneThreat: 4, antiDiveThreat: 4 },
        phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "utility" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsFollowUp: 6 },
      },
    },
  },
});
