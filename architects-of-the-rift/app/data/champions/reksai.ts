import { createChampion } from "./_helpers";

export const reksai = createChampion({
  id: "reksai",
  name: "Rek'Sai",
  image: "/champions/rek'sai.png",
  roles: ["top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "taliyah", score: 5 },
    { championId: "twisted-fate", score: 5 },
    { championId: "galio", score: 4 },
    { championId: "pantheon", score: 4 },
    { championId: "nocturne", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "nautilus", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "earlyPrio", strength: 4 },
    { type: "pick", strength: 4 },
    { type: "sideLanePressure", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 3, clt: 3 },

  stats: {
    picks: 0,
    bans: 0,
    presence: 0,
    prioScore: 0,
    wins: 0,
    losses: 0,
    proWinRate: null,
    kda: null,
    avgBanTurn: null,
    avgPickRound: null,
    blindPickRate: null,
    averageGameTime: null,
    csPerMinute: null,
    damagePerMinute: null,
    goldPerMinute: null,
    csDiffAt15: null,
    goldDiffAt15: null,
    xpDiffAt15: null,
    soloqKrChallengerWinRate: 63.21,
  },

  roleData: {
    top: {
      goodVs: [
        { championId: "ksante", level: 2, phase: "lane" },
        { championId: "sion", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["melee", "lane-bully", "pick", "ad-bruiser", "skirmish"],
        abilities: [
          { key: "q", name: "Queen's Wrath / Prey Seeker", effects: [{ type: "dps", strength: 6, reliability: 8, priority: 6 }, { type: "poke", subtype: "burrowed", strength: 4, reliability: 7, priority: 4 }] },
          { key: "w", name: "Burrow / Un-burrow", effects: [{ type: "knockup", strength: 7, reliability: 8, priority: 7 }, { type: "vision", subtype: "tremor-sense", strength: 6, reliability: 9, priority: 6 }] },
          { key: "e", name: "Tunnel / Furious Bite", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "burst", subtype: "true-damage-finisher", strength: 8, reliability: 8, priority: 8 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 5, visionControl: 6 },
        accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 6 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 7, pickThreat: 7, zoneThreat: 4, antiDiveThreat: 3 },
        phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "utility" },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
      },
    },
  },
});
