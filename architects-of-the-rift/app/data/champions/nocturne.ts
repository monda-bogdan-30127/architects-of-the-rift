import { createChampion } from "./_helpers";

export const nocturne = createChampion({
  id: "nocturne",
  name: "Nocturne",
  image: "/champions/nocturne.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "orianna", score: 5 },
    { championId: "ahri", score: 5 },
    { championId: "akali", score: 3 },
    { championId: "shen", score: 5 },
    { championId: "ornn", score: 5 },
    { championId: "galio", score: 4 },
    { championId: "twisted-fate", score: 4 },
    { championId: "ryze", score: 4 },
  ],

  offers: [
    { type: "backlineAccess", strength: 5 },
    { type: "dive", strength: 5 },
    { type: "pick", strength: 4 },
    { type: "roamPressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 3 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, clt: 3, iq: 4 },

  stats: {
    picks: 13,
    bans: 57,
    presence: 70,
    prioScore: 89,
    wins: 8,
    losses: 5,
    proWinRate: 62,
    kda: 4.8,
    avgBanTurn: 3.1,
    avgPickRound: 1.31,
    blindPickRate: 92.3,
    averageGameTime: "31:58",
    csPerMinute: 7,
    damagePerMinute: 404,
    goldPerMinute: 389,
    csDiffAt15: 1.2,
    goldDiffAt15: -193,
    xpDiffAt15: -161,
    soloqKrChallengerWinRate: 59.69,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "sejuani", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "skarner", level: 2, phase: "late" },
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "lee-sin", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: {
        picks: 14,
        bans: null,
        presence: 80,
        prioScore: 89,
        wins: 9,
        losses: 5,
        proWinRate: 64,
        kda: 4.6,
        avgBanTurn: null,
        avgPickRound: 1.5,
        blindPickRate: 92.9,
        averageGameTime: "32:12",
        csPerMinute: 7,
        damagePerMinute: 391,
        goldPerMinute: 387,
        csDiffAt15: 0.9,
        goldDiffAt15: -200,
        xpDiffAt15: -175,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "dive", "pick", "backline-access", "ad"],
        abilities: [
          { key: "q", name: "Duskbringer", effects: [{ type: "mobility", subtype: "trail-speed", strength: 6, reliability: 8, priority: 6 }] },
          { key: "w", name: "Shroud of Darkness", effects: [{ type: "anti-engage", subtype: "spell-shield", strength: 8, reliability: 8, priority: 8 }] },
          { key: "e", name: "Unspeakable Horror", effects: [{ type: "cc", subtype: "fear-delayed", strength: 7, reliability: 6, priority: 7 }] },
          { key: "r", name: "Paranoia", effects: [{ type: "dash", subtype: "global-dive", strength: 10, reliability: 9, priority: 10 }, { type: "pick", subtype: "backline-collapse", strength: 9, reliability: 9, priority: 9 }, { type: "setup", subtype: "darkness-engage", strength: 8, reliability: 9, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 4 },
        accessProfile: { engageRange: 10, targetAccess: 10, stickiness: 7 },
        threatProfile: { backlineThreat: 10, frontlineThreat: 4, pickThreat: 9, zoneThreat: 3, antiDiveThreat: 2 },
        phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "pick" },
        conditions: { requiresFollowUp: true, requiresPeel: true },
        comboDependency: { needsFollowUp: 6, needsPeel: 4 },
      },
    },
  },
});
