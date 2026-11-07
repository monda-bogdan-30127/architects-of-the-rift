import { createChampion } from "./_helpers";

export const drMundo = createChampion({
  id: "dr-mundo",
  name: "Dr. Mundo",
  image: "/champions/dr.-mundo.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD", "AP"],

  synergyWith: [
    { championId: "nami", score: 4 },
    { championId: "seraphine", score: 4 },
    { championId: "karma", score: 3 },
    { championId: "lulu", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "orianna", score: 3 },
    { championId: "jinx", score: 3 },
    { championId: "aphelios", score: 3 },
  ],

  offers: [
    { type: "frontline", strength: 5 },
    { type: "sideLanePressure", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 4, con: 4, iq: 4 },

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
    soloqKrChallengerWinRate: 53,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "lillia", level: 2, phase: "late" },
        { championId: "viego", level: 2, phase: "late" },
        { championId: "xin-zhao", level: 2, phase: "late" },
      ],
      weakVs: [
        { championId: "aatrox", level: 2, phase: "lane" },
        { championId: "jarvan-iv", level: 2, phase: "lane" },
        { championId: "nocturne", level: 2, phase: "lane" },
        { championId: "pantheon", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["melee", "frontline", "tank", "stat-check", "anti-poke"],
        abilities: [
          { key: "q", name: "Infected Bonesaw", effects: [{ type: "slow", strength: 7, reliability: 8, priority: 7 }, { type: "poke", strength: 5, reliability: 8, priority: 5 }] },
          { key: "e", name: "Blunt Force Trauma", effects: [{ type: "burst", strength: 6, reliability: 8, priority: 6 }] },
          { key: "r", name: "Maximum Dosage", effects: [{ type: "heal", subtype: "massive-self-sustain", strength: 10, reliability: 10, priority: 10 }, { type: "mobility", subtype: "run-down", strength: 6, reliability: 8, priority: 6 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 2 },
        accessProfile: { engageRange: 4, targetAccess: 5, stickiness: 7 },
        threatProfile: { backlineThreat: 5, frontlineThreat: 8, pickThreat: 3, zoneThreat: 3, antiDiveThreat: 6 },
        phaseIdentity: { earlyRole: "tank", midRole: "tank", lateRole: "tank" },
        conditions: { requiresEngage: true },
        comboDependency: { needsEngage: 7 },
      },
    },
    top: {
      goodVs: [],
      weakVs: [
        { championId: "aatrox", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
