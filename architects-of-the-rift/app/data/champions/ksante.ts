import { createChampion } from "./_helpers";

export const ksante = createChampion({
  id: "ksante",
  name: "K'Sante",
  image: "/champions/k'sante.png",
  roles: ["top", "mid"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "milio", score: 4 },
    { championId: "zeri", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "sejuani", score: 3 },
    { championId: "vi", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "peel", strength: 3 },
    { type: "reliableCC", strength: 3 },
    { type: "sideLanePressure", strength: 2 }
  ],

  needs: [
    { type: "sustainedDamage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 1 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "pick", severity: 2 }
  ],

  playerScaling: { mec: 4, tfg: 4, con: 4, iq: 2 },

  stats: {
    picks: 20,
    bans: 16,
    presence: 36,
    prioScore: 38,
    wins: 7,
    losses: 13,
    proWinRate: 35,
    kda: 1.8,
    avgBanTurn: 6.7,
    avgPickRound: 2,
    blindPickRate: 35,
    averageGameTime: "31:37",
    csPerMinute: 8,
    damagePerMinute: 381,
    goldPerMinute: 354,
    csDiffAt15: 0.9,
    goldDiffAt15: -14,
    xpDiffAt15: 43,
    soloqKrChallengerWinRate: 51,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "jayce", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "late" },
        { championId: "sion", level: 2, phase: "late" },
        { championId: "ornn", level: 1, phase: "all" },
      ],
      stats: {
        picks: 20,
        bans: null,
        presence: 38,
        prioScore: 36,
        wins: 8,
        losses: 12,
        proWinRate: 40,
        kda: 1.7,
        avgBanTurn: null,
        avgPickRound: 2.1,
        blindPickRate: 35,
        averageGameTime: "31:56",
        csPerMinute: 8,
        damagePerMinute: 389,
        goldPerMinute: 356,
        csDiffAt15: 1.2,
        goldDiffAt15: 8,
        xpDiffAt15: 44,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "frontline", "warden", "tank", "anti-dive", "blindable"],
        abilities: [
          { key: "q", name: "Ntofo Strikes", effects: [{ type: "slow", strength: 6, reliability: 8, priority: 6 }, { type: "knockup", subtype: "3rd-cast", strength: 7, reliability: 7, priority: 7 }] },
          { key: "w", name: "Path Maker", effects: [{ type: "unstoppable", strength: 7, reliability: 8, priority: 8 }, { type: "displacement", subtype: "charged-push", strength: 8, reliability: 7, priority: 8 }] },
          { key: "e", name: "Footwork", effects: [{ type: "dash", strength: 6, reliability: 8, priority: 6 }, { type: "shield", strength: 6, reliability: 8, priority: 6 }] },
          { key: "r", name: "All Out", effects: [{ type: "displacement", subtype: "isolation", strength: 10, reliability: 9, priority: 10 }, { type: "burst", subtype: "all-in-window", strength: 8, reliability: 7, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 10, visionControl: 2 },
        accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 8 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 7, zoneThreat: 6, antiDiveThreat: 9 },
        phaseIdentity: { earlyRole: "tank", midRole: "peel", lateRole: "tank" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
      },
    },
    mid: {
      goodVs: [],
      stats: {
        picks: 1,
        bans: null,
        presence: 19,
        prioScore: 22,
        wins: 0,
        losses: 1,
        proWinRate: 0,
        kda: 2,
        avgBanTurn: null,
        avgPickRound: 1,
        blindPickRate: 0,
        averageGameTime: "30:14",
        csPerMinute: 7.2,
        damagePerMinute: 120,
        goldPerMinute: 304,
        csDiffAt15: -18,
        goldDiffAt15: -1173,
        xpDiffAt15: -336,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
