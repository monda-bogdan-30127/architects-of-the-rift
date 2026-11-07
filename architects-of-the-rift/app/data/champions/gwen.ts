import { createChampion } from "./_helpers";

export const gwen = createChampion({
  id: "gwen",
  name: "Gwen",
  image: "/champions/gwen.png",
  roles: ["top"],
  damageProfile: ["AP", "TRUE"],

  synergyWith: [
    { championId: "sejuani", score: 4 },
    { championId: "maokai", score: 3 },
    { championId: "rell", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "yone", score: 3 },
    { championId: "pantheon", score: 3 },
  ],

  offers: [
    { type: "splitpush", strength: 4 },
    { type: "sideLanePressure", strength: 4 },
    { type: "sustainedDamage", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
    { exposedTo: "siege", severity: 1 },
  ],

  playerScaling: { mec: 5, tfg: 4, clt: 3, con: 3 },

  stats: {
    picks: 1,
    bans: 2,
    presence: 3,
    prioScore: 3,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: null,
    avgBanTurn: 9.5,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "25:43",
    csPerMinute: 10.4,
    damagePerMinute: 691,
    goldPerMinute: 487,
    csDiffAt15: 29,
    goldDiffAt15: 1332,
    xpDiffAt15: 469,
    soloqKrChallengerWinRate: 54.82,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "malphite", level: 2, phase: "all", note: "damage magic și true damage contra tank-ului de armură" },
        { championId: "aatrox", level: 2, phase: "late" },
        { championId: "ambessa", level: 2, phase: "late" },
        { championId: "chogath", level: 2, phase: "late" },
        { championId: "dr-mundo", level: 2, phase: "late" },
        { championId: "ksante", level: 2, phase: "late" },
        { championId: "ornn", level: 2, phase: "late" },
        { championId: "poppy", level: 2, phase: "late" },
        { championId: "riven", level: 2, phase: "late" },
        { championId: "rumble", level: 2, phase: "late" },
        { championId: "sion", level: 2, phase: "late" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 3,
        prioScore: 3,
        wins: 1,
        losses: 0,
        proWinRate: 100,
        kda: null,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "25:43",
        csPerMinute: 10.4,
        damagePerMinute: 691,
        goldPerMinute: 487,
        csDiffAt15: 29,
        goldDiffAt15: 1332,
        xpDiffAt15: 469,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "ap", "duelist", "scaling", "frontline-killer"],
        abilities: [
          { key: "q", name: "Snip Snip!", effects: [{ type: "burst", subtype: "center-hit", strength: 7, reliability: 7, priority: 7 }, { type: "dps", strength: 8, reliability: 8, priority: 8 }] },
          { key: "w", name: "Hallowed Mist", effects: [{ type: "anti-engage", subtype: "outside-target-denial", strength: 8, reliability: 8, priority: 8 }] },
          { key: "e", name: "Skip 'n Slash", effects: [{ type: "dash", strength: 6, reliability: 8, priority: 6 }, { type: "mobility", subtype: "duel-stickiness", strength: 7, reliability: 8, priority: 7 }] },
          { key: "r", name: "Needlework", effects: [{ type: "poke", strength: 6, reliability: 7, priority: 6 }, { type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "dps", subtype: "extended-fight-finisher", strength: 8, reliability: 7, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 5, targetAccess: 7, stickiness: 7 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 10, pickThreat: 2, zoneThreat: 4, antiDiveThreat: 2 },
        phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
        conditions: { requiresFrontline: true, requiresEngage: true, requiresPeel: true },
        comboDependency: { needsFrontline: 7, needsPeel: 5, needsEngage: 6 },
      },
    },
  },
});
