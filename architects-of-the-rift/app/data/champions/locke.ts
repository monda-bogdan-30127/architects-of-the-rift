import { createChampion } from "./_helpers";

export const locke = createChampion({
  id: "locke",
  name: "Locke",
  image: "/champions/locke.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "sejuani", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "nami", score: 4 },
    { championId: "braum", score: 4 },
    { championId: "milio", score: 4 },
    { championId: "sivir", score: 4 },
    { championId: "lee-sin", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "backlineAccess", strength: 4 },
    { type: "roamPressure", strength: 4 },
    { type: "pick", strength: 3 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "peel", severity: 3 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 }
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 11,
    bans: 25,
    presence: 36,
    prioScore: 43,
    wins: 6,
    losses: 5,
    proWinRate: 55,
    kda: 3.2,
    avgBanTurn: 6.2,
    avgPickRound: 1.73,
    blindPickRate: 27.3,
    averageGameTime: "32:07",
    csPerMinute: 8.3,
    damagePerMinute: 529,
    goldPerMinute: 418,
    csDiffAt15: -13,
    goldDiffAt15: -190,
    xpDiffAt15: -291,
    soloqKrChallengerWinRate: null,
  },

  roleData: {
    mid: {
      goodVs: [
        { championId: "velkoz", level: 2, phase: "all", note: "blink, dash și execute pe un mage fără escape" },
        { championId: "xerath", level: 2, phase: "all", note: "blink, dash și execute pe un artillery fără escape" },
        { championId: "syndra", level: 1, phase: "all" },
        { championId: "viktor", level: 1, phase: "all" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 11,
        bans: null,
        presence: 42,
        prioScore: 45,
        wins: 6,
        losses: 5,
        proWinRate: 55,
        kda: 3.2,
        avgBanTurn: null,
        avgPickRound: 1.73,
        blindPickRate: 27.3,
        averageGameTime: "32:07",
        csPerMinute: 8.3,
        damagePerMinute: 529,
        goldPerMinute: 418,
        csDiffAt15: -13,
        goldDiffAt15: -190,
        xpDiffAt15: -291,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        abilities: [
          { key: "passive", name: "Silver Stake", effects: [{ type: "dps", subtype: "on-hit-missing-health", strength: 6, reliability: 8, priority: 6 }] },
          { key: "q", name: "Soul Nails", effects: [{ type: "slow", strength: 5, reliability: 6, priority: 6 }, { type: "mark", subtype: "nail-stacks", strength: 7, reliability: 6, priority: 7 }] },
          { key: "w", name: "Soul Ignition", effects: [{ type: "mobility", subtype: "attack-move-speed", strength: 6, reliability: 9, priority: 5 }] },
          { key: "e", name: "Ashen Pursuit", effects: [{ type: "dash", subtype: "blink-then-dash", strength: 8, reliability: 8, priority: 9 }, { type: "mobility", subtype: "reset-on-takedown", strength: 8, reliability: 7, priority: 8 }] },
          { key: "r", name: "Purgatory", effects: [{ type: "execute", subtype: "chain-execute", strength: 9, reliability: 7, priority: 10 }, { type: "slow", subtype: "decaying-99", strength: 9, reliability: 7, priority: 8 }, { type: "zone-control", strength: 6, reliability: 6, priority: 6 }] },
        ],
        damageProfileDetailed: { execute: 9 },
        ccProfile: { soft: 6, pick: 7 },
        accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
        threatProfile: { backlineThreat: 8, pickThreat: 8 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "pick" },
      },
    },
  },
});
