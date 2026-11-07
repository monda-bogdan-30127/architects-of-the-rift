import { createChampion } from "./_helpers";

export const veigar = createChampion({
  id: "veigar",
  name: "Veigar",
  image: "/champions/veigar.png",
  roles: ["mid"],
  damageProfile: ["AP"],

  synergyWith: [
    { championId: "jarvan-iv", score: 5 },
    { championId: "amumu", score: 5 },
    { championId: "wukong", score: 4 },
    { championId: "sejuani", score: 4 },
    { championId: "malphite", score: 4 },
    { championId: "nautilus", score: 3 },
    { championId: "leona", score: 3 },
    { championId: "rell", score: 3 },
  ],

  offers: [
    { type: "burstDamage", strength: 5 },
    { type: "zoneControl", strength: 4 },
    { type: "scaling", strength: 4 }
  ],

  needs: [
    { type: "frontline", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "dive", severity: 2 },
    { exposedTo: "backlineAccess", severity: 2 },
    { exposedTo: "pick", severity: 2 },
    { exposedTo: "peel", severity: 2 },
    { exposedTo: "frontline", severity: 2 },
  ],

  playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

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
    soloqKrChallengerWinRate: 49.46,
  },

  roleData: {
    mid: {
      goodVs: [],
      weakVs: [],
      mustWith: [],
      stats: null,
      profile: {
        tags: ["ranged", "control", "burst", "pick", "zone-control", "ap"],
        abilities: [
          { key: "w", name: "Dark Matter", effects: [{ type: "burst", strength: 9, reliability: 5, priority: 9 }] },
          { key: "e", name: "Event Horizon", effects: [{ type: "zone-control", subtype: "cage", strength: 10, reliability: 8, priority: 10 }, { type: "stun", subtype: "edge-contact", strength: 9, reliability: 7, priority: 9 }, { type: "anti-engage", subtype: "area-denial", strength: 9, reliability: 8, priority: 9 }] },
          { key: "r", name: "Primordial Burst", effects: [{ type: "execute", strength: 9, reliability: 9, priority: 9 }, { type: "burst", strength: 10, reliability: 9, priority: 10 }] },
        ],
        accessProfile: { engageRange: 0, targetAccess: 3, stickiness: 2 },
        threatProfile: { backlineThreat: 8, frontlineThreat: 7, pickThreat: 9, zoneThreat: 10, antiDiveThreat: 7 },
        phaseIdentity: { earlyRole: "utility", midRole: "pick", lateRole: "carry" },
        damageProfileDetailed: { execute: 9 },
      },
    },
  },
});
