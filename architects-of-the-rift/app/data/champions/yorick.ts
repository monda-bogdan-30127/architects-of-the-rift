import { createChampion } from "./_helpers";

export const yorick = createChampion({
  id: "yorick",
  name: "Yorick",
  image: "/champions/yorick.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "maokai", score: 5 },
    { championId: "sejuani", score: 5 },
    { championId: "ivern", score: 4 },
    { championId: "amumu", score: 4 },
    { championId: "skarner", score: 4 },
    { championId: "taliyah", score: 3 },
    { championId: "veigar", score: 3 },
    { championId: "ziggs", score: 3 },
  ],

  offers: [
    { type: "splitpush", strength: 5 },
    { type: "sideLanePressure", strength: 5 },
    { type: "waveclear", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 },
    { type: "waveclear", priority: 3 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "engage", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "waveclear", severity: 1 },
  ],

  playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

  stats: {
    picks: 2,
    bans: 0,
    presence: 2,
    prioScore: 2,
    wins: 0,
    losses: 2,
    proWinRate: 0,
    kda: 0.3,
    avgBanTurn: null,
    avgPickRound: 2,
    blindPickRate: 0,
    averageGameTime: "32:21",
    csPerMinute: 9.4,
    damagePerMinute: 354,
    goldPerMinute: 391,
    csDiffAt15: -20,
    goldDiffAt15: -1410,
    xpDiffAt15: -1722,
    soloqKrChallengerWinRate: 50.0,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ornn", level: 2, phase: "late" },
        { championId: "sion", level: 2, phase: "late" },
      ],
      weakVs: [],
      mustWith: [],
      stats: {
        picks: 2,
        bans: null,
        presence: 2,
        prioScore: 2,
        wins: 0,
        losses: 2,
        proWinRate: 0,
        kda: 0.3,
        avgBanTurn: null,
        avgPickRound: 2,
        blindPickRate: 0,
        averageGameTime: "32:21",
        csPerMinute: 9.4,
        damagePerMinute: 354,
        goldPerMinute: 391,
        csDiffAt15: -20,
        goldDiffAt15: -1410,
        xpDiffAt15: -1722,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "splitpush", "side-lane", "structure-damage"],
        abilities: [
          { key: "q", name: "Last Rites", effects: [{ type: "dps", subtype: "extended-side-lane", strength: 7, reliability: 8, priority: 7 }] },
          { key: "w", name: "Dark Procession", effects: [{ type: "zone-control", subtype: "cage", strength: 6, reliability: 7, priority: 6 }] },
          { key: "e", name: "Mourning Mist", effects: [{ type: "slow", strength: 4, reliability: 7, priority: 4 }, { type: "setup", subtype: "ghoul-chase", strength: 5, reliability: 8, priority: 5 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 4, targetAccess: 5, stickiness: 6 },
        threatProfile: { backlineThreat: 5, frontlineThreat: 8, pickThreat: 3, zoneThreat: 4, antiDiveThreat: 2 },
        phaseIdentity: { earlyRole: "utility", midRole: "carry", lateRole: "carry" },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
      },
    },
  },
});
