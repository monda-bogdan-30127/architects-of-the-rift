import { createChampion } from "./_helpers";

export const naafiri = createChampion({
  id: "naafiri",
  name: "Naafiri",
  image: "/champions/naafiri.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "galio", score: 4 },
    { championId: "twisted-fate", score: 4 },
    { championId: "ahri", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "pyke", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "orianna", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 4 },
    { type: "dive", strength: 4 },
    { type: "pick", strength: 4 },
    { type: "backlineAccess", strength: 3 },
    { type: "earlyPrio", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "antiDive", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 5,
    bans: 5,
    presence: 10,
    prioScore: 9,
    wins: 2,
    losses: 3,
    proWinRate: 40,
    kda: 2.3,
    avgBanTurn: 7.4,
    avgPickRound: 3.2,
    blindPickRate: 60,
    averageGameTime: "31:22",
    csPerMinute: 7.5,
    damagePerMinute: 625,
    goldPerMinute: 402,
    csDiffAt15: -4.2,
    goldDiffAt15: -41,
    xpDiffAt15: -117,
    soloqKrChallengerWinRate: 53.9,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "karthus", level: 2, phase: "lane" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 6,
        bans: null,
        presence: 11,
        prioScore: 9,
        wins: 3,
        losses: 3,
        proWinRate: 50,
        kda: 3.3,
        avgBanTurn: null,
        avgPickRound: 2.83,
        blindPickRate: 50,
        averageGameTime: "31:42",
        csPerMinute: 7.5,
        damagePerMinute: 639,
        goldPerMinute: 424,
        csDiffAt15: -7.7,
        goldDiffAt15: -278,
        xpDiffAt15: -280,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "assassin", "dive", "burst", "ad"],
        abilities: [
          { key: "w", name: "Hounds' Pursuit", effects: [{ type: "dash", subtype: "pack-engage", strength: 9, reliability: 8, priority: 9 }, { type: "pick", subtype: "backline-lock", strength: 7, reliability: 7, priority: 7 }] },
          { key: "e", name: "Eviscerate", effects: [{ type: "burst", strength: 7, reliability: 8, priority: 7 }] },
          { key: "r", name: "The Call of the Pack", effects: [{ type: "mobility", subtype: "hunt-speed", strength: 8, reliability: 8, priority: 8 }, { type: "burst", subtype: "assassination-window", strength: 8, reliability: 8, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 2 },
        accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 8 },
        threatProfile: { backlineThreat: 9, frontlineThreat: 4, pickThreat: 8, zoneThreat: 3, antiDiveThreat: 1 },
        phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "pick" },
        conditions: { requiresFrontline: true, requiresPeel: true },
        comboDependency: { needsFrontline: 5, needsPeel: 4 },
      },
    },
  },
});
