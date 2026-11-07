import { createChampion } from "./_helpers";

export const jax = createChampion({
  id: "jax",
  name: "Jax",
  image: "/champions/jax.png",
  roles: ["top"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "sejuani", score: 4 },     // melee proc + lockdown
    { championId: "jarvan-iv", score: 4 },   // trap + free DPS
    { championId: "nocturne", score: 3 },    // dive follow-up
    { championId: "orianna", score: 4 },     // ball delivery
    { championId: "lulu", score: 3 },        // hypercarry enable
    { championId: "karma", score: 3 },       // mobility + shields
    { championId: "senna", score: 3 },       // scaling comp synergy
  ],

  offers: [
    { type: "splitpush", strength: 5 },
    { type: "sideLanePressure", strength: 5 },
    { type: "sustainedDamage", strength: 4 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "poke", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, clt: 3, con: 3 },

  stats: {
    picks: 5,
    bans: 8,
    presence: 13,
    prioScore: 14,
    wins: 2,
    losses: 3,
    proWinRate: 40,
    kda: 1.8,
    avgBanTurn: 8.8,
    avgPickRound: 2.4,
    blindPickRate: 40,
    averageGameTime: "32:34",
    csPerMinute: 8.5,
    damagePerMinute: 519,
    goldPerMinute: 401,
    csDiffAt15: -3.6,
    goldDiffAt15: 279,
    xpDiffAt15: -223,
    soloqKrChallengerWinRate: 56.29,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "tryndamere", level: 2, phase: "all", note: "Counter Strike anulează autoatacurile lui Tryndamere" },
        { championId: "aatrox", level: 2, phase: "late" },
        { championId: "ambessa", level: 2, phase: "late" },
        { championId: "camille", level: 2, phase: "late" },
        { championId: "galio", level: 2, phase: "late" },
        { championId: "garen", level: 2, phase: "late" },
        { championId: "gnar", level: 2, phase: "late" },
        { championId: "renekton", level: 2, phase: "late" },
        { championId: "riven", level: 2, phase: "late" },
        { championId: "sett", level: 2, phase: "late" },
        { championId: "volibear", level: 2, phase: "late" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 7,
        bans: null,
        presence: 16,
        prioScore: 15,
        wins: 3,
        losses: 4,
        proWinRate: 43,
        kda: 1.8,
        avgBanTurn: null,
        avgPickRound: 2.29,
        blindPickRate: 28.6,
        averageGameTime: "32:31",
        csPerMinute: 8.2,
        damagePerMinute: 520,
        goldPerMinute: 403,
        csDiffAt15: -10.9,
        goldDiffAt15: 2,
        xpDiffAt15: -348,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "duelist", "scaling", "splitpush", "diver"],
        abilities: [
          { key: "q", name: "Leap Strike", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }] },
          { key: "e", name: "Counter Strike", effects: [{ type: "anti-engage", subtype: "auto-attack-denial", strength: 8, reliability: 8, priority: 8 }, { type: "stun", strength: 6, reliability: 8, priority: 6 }] },
          { key: "r", name: "Grandmaster-At-Arms", effects: [{ type: "dps", subtype: "extended-fight-scaling", strength: 8, reliability: 8, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 6, targetAccess: 8, stickiness: 8 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 8, pickThreat: 5, zoneThreat: 3, antiDiveThreat: 4 },
        phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
        conditions: { requiresFrontline: true, requiresPeel: true },
        comboDependency: { needsEngage: 0, needsFrontline: 5, needsPeel: 4 },
      },
    },
  },
});
