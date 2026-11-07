import { createChampion } from "./_helpers";

export const braum = createChampion({
  id: "braum",
  name: "Braum",
  image: "/champions/braum.png",
  roles: ["support"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "lucian", score: 5 },
    { championId: "aphelios", score: 4 },
    { championId: "jinx", score: 3 },
    { championId: "zeri", score: 3 },
    { championId: "ashe", score: 3 },
    { championId: "azir", score: 3 },
  ],

  offers: [
    { type: "peel", strength: 5 },
    { type: "antiDive", strength: 5 },
    { type: "frontline", strength: 3 }
  ],

  needs: [
    { type: "engage", priority: 2 }
  ],

  weaknesses: [
    { exposedTo: "poke", severity: 3 },
    { exposedTo: "siege", severity: 2 },
    { exposedTo: "disengage", severity: 2 },
    { exposedTo: "zoneControl", severity: 1 }
  ],

  playerScaling: { mac: 4, tfg: 4, con: 5, iq: 4 },

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
    soloqKrChallengerWinRate: 54.78,
  },

  roleData: {
    support: {
      goodVs: [
        { championId: "caitlyn", level: 2, phase: "lane" },
        { championId: "ezreal", level: 2, phase: "lane" },
        { championId: "ziggs", level: 2, phase: "lane" },
      ],
      stats: null,
      profile: {
        tags: ["ranged", "warden", "peel", "anti-dive", "front-to-back"],
        abilities: [
          { key: "passive", name: "Concussive Blows", effects: [{ type: "mark", subtype: "ally-proc-cc", strength: 9, reliability: 9, priority: 9 }] },
          { key: "e", name: "Unbreakable", effects: [{ type: "projectile-block", strength: 10, reliability: 9, priority: 10 }, { type: "anti-engage", strength: 8, reliability: 8, priority: 8 }] },
          { key: "r", name: "Glacial Fissure", effects: [{ type: "knockup", strength: 8, reliability: 8, priority: 8 }, { type: "slow", strength: 7, reliability: 9, priority: 7 }] },
        ],
        special: { antiDash: 0, projectileBlock: 10, ground: 0, displacement: 6, visionControl: 4 },
        accessProfile: { engageRange: 5, targetAccess: 3, stickiness: 4 },
        threatProfile: { backlineThreat: 2, frontlineThreat: 5, pickThreat: 5, zoneThreat: 5, antiDiveThreat: 10 },
        phaseIdentity: { earlyRole: "peel", midRole: "peel", lateRole: "peel" },
      },
    },
  },
});
