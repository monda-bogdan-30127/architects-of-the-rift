import { createChampion } from "./_helpers";

export const poppy = createChampion({
  id: "poppy",
  name: "Poppy",
  image: "/champions/poppy.png",
  roles: ["support", "jungle", "top"],
  damageProfile: ["AD"],
  attackType: "melee",

  synergyWith: [
    { championId: "sivir", score: 4 },
    { championId: "kalista", score: 3 },
    { championId: "anivia", score: 3 },
    { championId: "yunara", score: 3 },
    { championId: "azir", score: 3 },
    { championId: "jarvan-iv", score: 3 },
    { championId: "varus", score: 3 },
  ],

  offers: [
    { type: "antiDive", strength: 5 },
    { type: "pick", strength: 3 },
    { type: "frontline", strength: 4 },
    { type: "disengage", strength: 4 }
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "sustainedDamage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 },
    { exposedTo: "sideLanePressure", severity: 1 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: {
    picks: 1,
    bans: 5,
    presence: 6,
    prioScore: 8,
    wins: 1,
    losses: 0,
    proWinRate: 100,
    kda: 6,
    avgBanTurn: 7.4,
    avgPickRound: 1,
    blindPickRate: 0,
    averageGameTime: "32:38",
    csPerMinute: 0.9,
    damagePerMinute: 110,
    goldPerMinute: 250,
    csDiffAt15: 5,
    goldDiffAt15: -540,
    xpDiffAt15: 74,
    soloqKrChallengerWinRate: 59.93,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "camille", level: 3, phase: "all", note: "W stops Camille's E (the hookshot is a dash)" },
        { championId: "leona", level: 3, phase: "all", note: "W stops Leona's E (dash)" },
        { championId: "rakan", level: 3, phase: "all", note: "W stops Rakan's W and E (dashes)" },
        { championId: "alistar", level: 2, phase: "all", note: "W stops Alistar's W (headbutt)" },
        { championId: "rell", level: 2, phase: "all", note: "W stops Rell's W" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 6,
        prioScore: 7,
        wins: 1,
        losses: 0,
        proWinRate: 100,
        kda: 6,
        avgBanTurn: null,
        avgPickRound: 1,
        blindPickRate: 0,
        averageGameTime: "32:38",
        csPerMinute: 0.9,
        damagePerMinute: 110,
        goldPerMinute: 250,
        csDiffAt15: 5,
        goldDiffAt15: -540,
        xpDiffAt15: 74,
        soloqKrChallengerWinRate: null,
      },
    },
    jungle: {
      goodVs: [
        { championId: "ambessa", level: 3, phase: "all", note: "W stops all of Ambessa's dashes" },
        { championId: "zac", level: 3, phase: "all", note: "W fully stops Zac's E" },
        { championId: "hecarim", level: 2, phase: "all", note: "W stops Hecarim's R" },
        { championId: "jarvan-iv", level: 2, phase: "all", note: "W stops the EQ combo" },
        { championId: "khazix", level: 2, phase: "all", note: "W stops Kha'Zix's leap" },
        { championId: "lee-sin", level: 2, phase: "all", note: "W stops Q2 and the insec" },
        { championId: "naafiri", level: 2, phase: "all", note: "W stops Naafiri's dash" },
        { championId: "pantheon", level: 2, phase: "all", note: "W stops the W leap" },
        { championId: "vi", level: 2, phase: "all", note: "W stops Vi's Q" },
        { championId: "warwick", level: 2, phase: "all", note: "W stops Warwick's R (leap)" },
        { championId: "wukong", level: 2, phase: "all", note: "W stops Wukong's E" },
        { championId: "xin-zhao", level: 2, phase: "all", note: "W stops Xin Zhao's E" },
        { championId: "zaahen", level: 2, phase: "all", note: "W stops the E dash" },
      ],
      stats: null,
      profile: {
        tags: ["melee", "frontline", "tank", "anti-dash", "engage", "utility", "teamfight"],
        abilities: [
          { key: "q", name: "Hammer Shock", effects: [{ type: "burst", strength: 6, reliability: 7, priority: 6 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "zone-control", subtype: "delayed-area-threat", strength: 6, reliability: 7, priority: 6 }] },
          { key: "w", name: "Steadfast Presence", effects: [{ type: "anti-dash", subtype: "area-denial", strength: 10, reliability: 9, priority: 10, counters: ["dash"] }, { type: "anti-engage", strength: 9, reliability: 9, priority: 9 }, { type: "zone-control", subtype: "anti-entry-zone", strength: 8, reliability: 9, priority: 8 }] },
          { key: "e", name: "Heroic Charge", effects: [{ type: "dash", strength: 6, reliability: 7, priority: 6 }, { type: "stun", subtype: "wall-conditional", strength: 8, reliability: 6, priority: 8, conditions: ["needs-terrain"] }, { type: "displacement", strength: 7, reliability: 7, priority: 7 }] },
          { key: "r", name: "Keeper's Verdict", effects: [{ type: "displacement", subtype: "fight-reset", strength: 10, reliability: 7, priority: 10 }, { type: "anti-engage", subtype: "deny-commit", strength: 9, reliability: 7, priority: 9 }, { type: "zone-control", subtype: "objective-space-control", strength: 8, reliability: 7, priority: 8 }] },
        ],
        special: { antiDash: 10, projectileBlock: 0, ground: 0, displacement: 9, visionControl: 3 },
        accessProfile: { engageRange: 6, targetAccess: 5, stickiness: 6 },
        threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 6, zoneThreat: 8, antiDiveThreat: 10 },
        phaseIdentity: { earlyRole: "utility", midRole: "tank", lateRole: "peel" },
      },
    },
    top: {
      goodVs: [
        { championId: "ambessa", level: 3, phase: "all", note: "W stops all of Ambessa's dashes" },
        { championId: "camille", level: 3, phase: "all", note: "W stops Camille's E (the hookshot is a dash)" },
        { championId: "zac", level: 3, phase: "all", note: "W fully stops Zac's E" },
        { championId: "gragas", level: 2, phase: "all", note: "W stops Gragas's body slam (E)" },
        { championId: "irelia", level: 2, phase: "all", note: "W stops Irelia's Q (dash)" },
        { championId: "riven", level: 2, phase: "all", note: "W stops the Q and E dashes" },
        { championId: "warwick", level: 2, phase: "all", note: "W stops Warwick's R (leap)" },
        { championId: "yasuo", level: 2, phase: "all", note: "W stops E and Q3 (dashes)" },
        { championId: "yone", level: 2, phase: "all", note: "W stops Yone's E and R (dashes)" },
        { championId: "zaahen", level: 2, phase: "all", note: "W stops the E dash" },
      ],
      stats: null,
    },
  },
});
