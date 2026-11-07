import { createChampion } from "./_helpers";

export const trundle = createChampion({
  id: "trundle",
  name: "Trundle",
  image: "/champions/trundle.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "anivia", score: 5 },
    { championId: "orianna", score: 4 },
    { championId: "azir", score: 4 },
    { championId: "cassiopeia", score: 3 },
    { championId: "syndra", score: 3 },
    { championId: "kaisa", score: 3 },
    { championId: "xayah", score: 2 },
    { championId: "miss-fortune", score: 2 },
  ],

  offers: [
    { type: "frontline", strength: 3 },
    { type: "objectiveControl", strength: 4 },
    { type: "sideLanePressure", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 2 },
    { exposedTo: "siege", severity: 1 },
    { exposedTo: "earlyPrio", severity: 1 },
  ],

  playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

  stats: {
    picks: 8,
    bans: 7,
    presence: 15,
    prioScore: 16,
    wins: 5,
    losses: 3,
    proWinRate: 63,
    kda: 7.5,
    avgBanTurn: 6.9,
    avgPickRound: 2.25,
    blindPickRate: 25,
    averageGameTime: "32:23",
    csPerMinute: 7.2,
    damagePerMinute: 395,
    goldPerMinute: 400,
    csDiffAt15: -1.9,
    goldDiffAt15: 236,
    xpDiffAt15: 200,
    soloqKrChallengerWinRate: null,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "naafiri", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "khazix", level: 2, phase: "lane" },
        { championId: "kindred", level: 2, phase: "lane" },
        { championId: "lillia", level: 2, phase: "lane" },
        { championId: "nidalee", level: 2, phase: "lane" },
        { championId: "vi", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["melee", "frontline-breaker", "anti-tank", "skirmish", "utility"],
        abilities: [
          { key: "e", name: "Pillar of Ice", effects: [{ type: "zone-control", subtype: "terrain-block", strength: 9, reliability: 9, priority: 9 }, { type: "displacement", subtype: "micro-knock", strength: 6, reliability: 8, priority: 6 }, { type: "pick", subtype: "path-cut", strength: 7, reliability: 8, priority: 7 }] },
          { key: "r", name: "Subjugate", effects: [{ type: "dps", subtype: "tank-drain", strength: 8, reliability: 9, priority: 8 }, { type: "anti-engage", subtype: "frontline-steal", strength: 7, reliability: 8, priority: 7 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 2 },
        accessProfile: { engageRange: 5, targetAccess: 5, stickiness: 8 },
        threatProfile: { backlineThreat: 4, frontlineThreat: 9, pickThreat: 7, zoneThreat: 8, antiDiveThreat: 5 },
        phaseIdentity: { earlyRole: "utility", midRole: "carry", lateRole: "utility" },
        conditions: { requiresEngage: true },
        comboDependency: { needsEngage: 5 },
      },
    },
  },
});
