import { createChampion } from "./_helpers";

export const kennen = createChampion({
  id: "kennen",
  name: "Kennen",
  image: "/champions/kennen.png",
  roles: ["top"],
  damageProfile: ["AP"],
  attackType: "ranged",

  synergyWith: [
    { championId: "amumu", score: 5 },
    { championId: "jarvan-iv", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "rakan", score: 4 },
    { championId: "leona", score: 4 },
    { championId: "galio", score: 3 },
    { championId: "yone", score: 3 },
    { championId: "orianna", score: 3 },
  ],

  offers: [
    { type: "sideLanePressure", strength: 2 },
    { type: "burstDamage", strength: 3 },
    { type: "earlyPrio", strength: 1 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "sideLanePressure", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 }
  ],

  playerScaling: { mec: 4, tfg: 5, clt: 3, con: 3 },

  stats: {
    picks: 2,
    bans: 0,
    presence: 2,
    prioScore: 1,
    wins: 2,
    losses: 0,
    proWinRate: 100,
    kda: 5.3,
    avgBanTurn: null,
    avgPickRound: 2.5,
    blindPickRate: 50,
    averageGameTime: "36:48",
    csPerMinute: 10.6,
    damagePerMinute: 929,
    goldPerMinute: 491,
    csDiffAt15: 21,
    goldDiffAt15: 946,
    xpDiffAt15: 958,
    soloqKrChallengerWinRate: 55.84,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "darius", level: 2, phase: "all", note: "kite și stun, Darius nu-l poate prinde" },
        { championId: "malphite", level: 2, phase: "all", note: "damage AP de la distanță, armura nu ajută" },
        { championId: "olaf", level: 2, phase: "all", note: "kite de la distanță, Olaf nu-l prinde fără R" },
        { championId: "sett", level: 2, phase: "all", note: "kite contra juggernaut-ului fără range" },
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "camille", level: 2, phase: "lane" },
        { championId: "fiora", level: 2, phase: "lane" },
        { championId: "garen", level: 2, phase: "lane" },
        { championId: "gwen", level: 2, phase: "lane" },
        { championId: "jax", level: 2, phase: "lane" },
        { championId: "ksante", level: 2, phase: "lane" },
        { championId: "poppy", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "udyr", level: 2, phase: "lane" },
        { championId: "gnar", level: 1, phase: "all" },
        { championId: "jayce", level: 1, phase: "all" },
        { championId: "rumble", level: 1, phase: "all" },
        { championId: "shen", level: 1, phase: "all" },
        { championId: "teemo", level: 1, phase: "all" },
      ],
      stats: {
        picks: 3,
        bans: null,
        presence: 3,
        prioScore: 2,
        wins: 2,
        losses: 1,
        proWinRate: 67,
        kda: 6.5,
        avgBanTurn: null,
        avgPickRound: 2.33,
        blindPickRate: 33.3,
        averageGameTime: "35:16",
        csPerMinute: 10.3,
        damagePerMinute: 748,
        goldPerMinute: 452,
        csDiffAt15: 24.7,
        goldDiffAt15: 992,
        xpDiffAt15: 928,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["ranged", "ap", "teamfight", "flank", "wombo"],
        abilities: [
          { key: "q", name: "Thundering Shuriken", effects: [{ type: "poke", strength: 5, reliability: 7, priority: 5 }] },
          { key: "e", name: "Lightning Rush", effects: [{ type: "dash", subtype: "flank-entry", strength: 7, reliability: 8, priority: 7 }, { type: "mobility", strength: 8, reliability: 8, priority: 8 }] },
          { key: "r", name: "Slicing Maelstrom", effects: [{ type: "stun", subtype: "multi-target", strength: 8, reliability: 8, priority: 8 }, { type: "zone-control", subtype: "aoe-lockdown", strength: 9, reliability: 8, priority: 9 }, { type: "burst", subtype: "teamfight-spike", strength: 8, reliability: 7, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 5 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 6, pickThreat: 4, zoneThreat: 9, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "utility" },
        conditions: { requiresEngage: true, requiresFollowUp: true },
        comboDependency: { needsEngage: 7, needsFrontline: 0, needsPeel: 0 },
      },
    },
  },
});
