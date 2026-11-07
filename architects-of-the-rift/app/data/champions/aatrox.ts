import { createChampion } from "./_helpers";

export const aatrox = createChampion({
  id: "aatrox",
  name: "Aatrox",
  image: "/champions/aatrox.png",
  roles: ["jungle", "top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "galio", score: 5 },
    { championId: "aurora", score: 4 },
    { championId: "ahri", score: 5 },
    { championId: "viktor", score: 3 },
    { championId: "wukong", score: 4 },
    { championId: "rell", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "lissandra", score: 2 }
  ],

  offers: [
    { type: "earlyPrio", strength: 3 },
    { type: "objectiveControl", strength: 3 },
    { type: "roamPressure", strength: 3 },
    { type: "sideLanePressure", strength: 3 },
    { type: "sustainedDamage", strength: 3 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "engage", severity: 1 },
  ],

  playerScaling: { mec: 4, mac: 4, tfg: 4, iq: 4 },

  stats: {
    picks: 4,
    bans: 0,
    presence: 4,
    prioScore: 2,
    wins: 1,
    losses: 3,
    proWinRate: 25,
    kda: 2.6,
    avgBanTurn: null,
    avgPickRound: 3.25,
    blindPickRate: 0,
    averageGameTime: "31:00",
    csPerMinute: 7.9,
    damagePerMinute: 484,
    goldPerMinute: 362,
    csDiffAt15: -0.8,
    goldDiffAt15: -330,
    xpDiffAt15: 244,
    soloqKrChallengerWinRate: 57.14,
  },

  roleData: {
    jungle: {
      goodVs: [
        { championId: "ambessa", level: 2, phase: "lane" },
        { championId: "xin-zhao", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "jarvan-iv", level: 2, phase: "lane" },
        { championId: "pantheon", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["melee", "drain-fighter", "skirmish", "teamfight", "ad"],
        abilities: [
          { key: "q", name: "The Darkin Blade", effects: [{ type: "burst", strength: 7, reliability: 6, priority: 7 }, { type: "knockup", subtype: "sweetspot", strength: 6, reliability: 6, priority: 6 }] },
          { key: "w", name: "Infernal Chains", effects: [{ type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "setup", subtype: "pullback-zone", strength: 6, reliability: 6, priority: 6 }] },
          { key: "e", name: "Umbral Dash", effects: [{ type: "dash", strength: 5, reliability: 8, priority: 5 }, { type: "heal", subtype: "self-sustain", strength: 6, reliability: 8, priority: 6 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 5, zoneThreat: 6, antiDiveThreat: 5 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
        conditions: { requiresPeel: true },
        comboDependency: { needsPeel: 4 },
      },
    },
    top: {
      goodVs: [
        { championId: "ambessa", level: 2, phase: "lane" },
      ],
      weakVs: [
        { championId: "camille", level: 2, phase: "all", note: "true damage și duel superior în sidelane" },
        { championId: "gwen", level: 2, phase: "late" },
        { championId: "gnar", level: 2, phase: "lane" },
        { championId: "renekton", level: 2, phase: "lane" },
        { championId: "rumble", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["melee", "drain-fighter", "skirmish", "teamfight", "blindable"],
        abilities: [
          { key: "q", name: "The Darkin Blade", effects: [{ type: "burst", strength: 7, reliability: 6, priority: 7 }, { type: "knockup", subtype: "sweetspot", strength: 6, reliability: 6, priority: 6 }] },
          { key: "w", name: "Infernal Chains", effects: [{ type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "pick", subtype: "pullback-zone", strength: 6, reliability: 6, priority: 6 }] },
          { key: "e", name: "Umbral Dash", effects: [{ type: "dash", strength: 5, reliability: 8, priority: 5 }, { type: "heal", subtype: "self-sustain", strength: 6, reliability: 8, priority: 6 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
        accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
        threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 5, zoneThreat: 6, antiDiveThreat: 5 },
        phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
        conditions: { requiresPeel: true },
        comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 4 },
      },
    },
  },
});
