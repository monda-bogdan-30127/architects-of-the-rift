// Auto-generated from Worlds 2026 pro meta data provided by the user.
// Champion pro stats reflect Worlds only; soloq KR Challenger values are preserved from the prior dataset.
// Locke was added with Worlds stats and Riot-confirmed mid / Assassin-Mage classification.

import type { Champion, ChampionCarryProfile, ChampionWeakness } from '../types/champion';

// Matchup-urile (goodVs/weakVs) și mustWith sunt pe rol, în championRoleMatchups.ts
// (citite prin draft-engine/championMatchups.ts) — DRAFT_REWORK §2 / §4.9.
const createChampion = (champion: Omit<Champion, 'synergyWith' | 'offers' | 'needs' | 'weaknesses' | 'playerScaling' | 'carryProfile'> & Partial<Pick<Champion, 'synergyWith' | 'offers' | 'needs' | 'weaknesses' | 'playerScaling' | 'carryProfile'>>): Champion => ({
  synergyWith: [],
  offers: [],
  needs: [],
  weaknesses: [],
  carryProfile: undefined,
  ...champion,
});


const mergeWeaknesses = (
  weaknesses: ChampionWeakness[]
): ChampionWeakness[] => {
  const merged = new Map<ChampionWeakness["exposedTo"], ChampionWeakness>();

  for (const weakness of weaknesses) {
    const existing = merged.get(weakness.exposedTo);

    if (!existing || weakness.severity > existing.severity) {
      merged.set(weakness.exposedTo, weakness);
    }
  }

  return Array.from(merged.values());
};

const baseChampions: Champion[] = [
  createChampion({
    id: "orianna",

    synergyWith: [
      { championId: "vi", score: 5 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "ambessa", score: 3 }
    ],

    offers: [
      { type: "waveclear", strength: 4 },
      { type: "zoneControl", strength: 5 },
      { type: "followUp", strength: 5 },
      { type: "scaling", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "siege", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 5, con: 4, iq: 5 },

    name: "Orianna",
    image: "/champions/orianna.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 19,
      bans: 20,
      presence: 39,
      prioScore: 45,
      wins: 14,
      losses: 5,
      proWinRate: 74,
      kda: 5.2,
      avgBanTurn: 5.9,
      avgPickRound: 1.58,
      blindPickRate: 94.7,
      averageGameTime: "34:37",
      csPerMinute: 8.9,
      damagePerMinute: 687,
      goldPerMinute: 410,
      csDiffAt15: 6.9,
      goldDiffAt15: 221,
      xpDiffAt15: 169,
      soloqKrChallengerWinRate: 53.4,
    },
  }),


  createChampion({
    id: "ambessa",

    synergyWith: [
      { championId: "orianna", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "alistar", score: 3 },
      { championId: "kaisa", score: 3 },
      { championId: "ahri", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "sejuani", score: 3 },
    ],
    //mustWith: [{ championId: "jarvan-iv", score: 5 }],
    offers: [
      { type: "dive", strength: 4 },
      { type: "backlineAccess", strength: 4 },
      { type: "sustainedDamage", strength: 3 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 },
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Ambessa",
    image: "/champions/ambessa.png",
    roles: ["top", "jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 20,
      bans: 8,
      presence: 28,
      prioScore: 31,
      wins: 9,
      losses: 11,
      proWinRate: 45,
      kda: 2.5,
      avgBanTurn: 7.6,
      avgPickRound: 1.55,
      blindPickRate: 60,
      averageGameTime: "32:26",
      csPerMinute: 8.6,
      damagePerMinute: 479,
      goldPerMinute: 368,
      csDiffAt15: -3,
      goldDiffAt15: -309,
      xpDiffAt15: -14,
      soloqKrChallengerWinRate: 56,
    },
  }),


  createChampion({
    id: "jarvan-iv",

    synergyWith: [
      { championId: "orianna", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "rumble", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "miss-fortune", score: 3 },
      { championId: "azir", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "neeko", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "dive", strength: 4 },
      { type: "reliableCC", strength: 3 },
      { type: "earlyPrio", strength: 4 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 1 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 4, iq: 4 },

    name: "Jarvan IV",
    image: "/champions/jarvan-iv.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 21,
      bans: 22,
      presence: 43,
      prioScore: 50,
      wins: 12,
      losses: 9,
      proWinRate: 57,
      kda: 4.2,
      avgBanTurn: 5,
      avgPickRound: 1.52,
      blindPickRate: 50,
      averageGameTime: "33:00",
      csPerMinute: 7.3,
      damagePerMinute: 344,
      goldPerMinute: 385,
      csDiffAt15: 3,
      goldDiffAt15: -3,
      xpDiffAt15: 169,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "rumble",

    synergyWith: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "neeko", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "wukong", score: 3 },
    ],

    offers: [
      { type: "zoneControl", strength: 5 },
      { type: "waveclear", strength: 3 },
      { type: "burstDamage", strength: 3 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "reliableCC", priority: 1 },
      { type: "frontline", priority: 1 },
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "siege", severity: 2 },
    ],


    playerScaling: { mec: 3, tfg: 5, con: 3, iq: 4 },

    name: "Rumble",
    image: "/champions/rumble.png",
    roles: ["top"],
    damageProfile: ["AP"],
    stats: {
      picks: 22,
      bans: 19,
      presence: 41,
      prioScore: 48,
      wins: 6,
      losses: 16,
      proWinRate: 27,
      kda: 2.4,
      avgBanTurn: 6.1,
      avgPickRound: 1.41,
      blindPickRate: 95.5,
      averageGameTime: "32:40",
      csPerMinute: 8.1,
      damagePerMinute: 604,
      goldPerMinute: 361,
      csDiffAt15: -0.6,
      goldDiffAt15: 119,
      xpDiffAt15: 208,
      soloqKrChallengerWinRate: 60,
    },
  }),


  createChampion({
    id: "vi",

    synergyWith: [
      { championId: "ahri", score: 4 },
      { championId: "syndra", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "galio", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "nautilus", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "pick", strength: 4 },
      { type: "backlineAccess", strength: 5 },
      { type: "reliableCC", strength: 4 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mac: 4, tfg: 4, clt: 3, iq: 4 },

    name: "Vi",
    image: "/champions/vi.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 15,
      bans: 42,
      presence: 57,
      prioScore: 70,
      wins: 10,
      losses: 5,
      proWinRate: 67,
      kda: 3.3,
      avgBanTurn: 3.8,
      avgPickRound: 1.53,
      blindPickRate: 78.6,
      averageGameTime: "31:14",
      csPerMinute: 7.5,
      damagePerMinute: 317,
      goldPerMinute: 400,
      csDiffAt15: 4.2,
      goldDiffAt15: -47,
      xpDiffAt15: 119,
      soloqKrChallengerWinRate: 55.57,
    },
  }),


  createChampion({
    id: "neeko",

    synergyWith: [
      { championId: "caitlyn", score: 3 },
      { championId: "kaisa", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "kalista", score: 3 },
      { championId: "miss-fortune", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "yunara", score: 2 }
    ],

    offers: [
      { type: "engage", strength: 4 },
      { type: "reliableCC", strength: 5 },
      { type: "followUp", strength: 4 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],


    playerScaling: { mac: 4, tfg: 4, con: 3, iq: 4 },

    name: "Neeko",
    image: "/champions/neeko.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 2,
      bans: 1,
      presence: 3,
      prioScore: 4,
      wins: 0,
      losses: 2,
      proWinRate: 0,
      kda: 2,
      avgBanTurn: 7,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "37:24",
      csPerMinute: 1.4,
      damagePerMinute: 215,
      goldPerMinute: 247,
      csDiffAt15: -1.5,
      goldDiffAt15: 31,
      xpDiffAt15: -304,
      soloqKrChallengerWinRate: 56.7,
    },
  }),


  createChampion({
    id: "nautilus",

    synergyWith: [
      { championId: "kaisa", score: 4 },
      { championId: "draven", score: 3 },
      { championId: "miss-fortune", score: 3 },
      { championId: "azir", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "taliyah", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "pick", strength: 4 },
      { type: "reliableCC", strength: 5 },
      { type: "frontline", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 3 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 5, con: 3, iq: 4 },

    name: "Nautilus",
    image: "/champions/nautilus.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 20,
      bans: 14,
      presence: 34,
      prioScore: 41,
      wins: 13,
      losses: 7,
      proWinRate: 65,
      kda: 2.9,
      avgBanTurn: 6.9,
      avgPickRound: 1.35,
      blindPickRate: 55,
      averageGameTime: "32:55",
      csPerMinute: 1.1,
      damagePerMinute: 140,
      goldPerMinute: 252,
      csDiffAt15: 3,
      goldDiffAt15: -67,
      xpDiffAt15: -155,
      soloqKrChallengerWinRate: 56,
    },
  }),

  createChampion({
    id: "varus",

    synergyWith: [
      { championId: "nautilus", score: 4 },
      { championId: "karma", score: 4 },
      { championId: "renata-glasc", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "orianna", score: 3 },
    ],

    offers: [
      { type: "poke", strength: 5 },
      { type: "objectiveControl", strength: 4 },
      { type: "siege", strength: 4 },
      { type: "waveclear", strength: 3 }
    ],

    needs: [
      { type: "peel", priority: 2 },
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 4, clt: 3, con: 4 },

    name: "Varus",
    image: "/champions/varus.png",
    roles: ["adc"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 2,
      bans: 1,
      presence: 3,
      prioScore: 3,
      wins: 2,
      losses: 0,
      proWinRate: 100,
      kda: 6.3,
      avgBanTurn: 10,
      avgPickRound: 1.5,
      blindPickRate: 0,
      averageGameTime: "35:27",
      csPerMinute: 10.2,
      damagePerMinute: 789,
      goldPerMinute: 524,
      csDiffAt15: -11.5,
      goldDiffAt15: -974,
      xpDiffAt15: 268,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "ryze",

    synergyWith: [
      { championId: "pantheon", score: 5 },
      { championId: "vi", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "xayah", score: 3 }
    ],

    offers: [
      { type: "waveclear", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "sideLanePressure", strength: 4 },
      { type: "scaling", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],

    playerScaling: { mec: 4, mac: 4, con: 4, iq: 5 },

    name: "Ryze",
    image: "/champions/ryze.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 7,
      bans: 4,
      presence: 11,
      prioScore: 10,
      wins: 2,
      losses: 5,
      proWinRate: 29,
      kda: 3.2,
      avgBanTurn: 7.8,
      avgPickRound: 2.29,
      blindPickRate: 71.4,
      averageGameTime: "30:04",
      csPerMinute: 9.3,
      damagePerMinute: 479,
      goldPerMinute: 399,
      csDiffAt15: -2.1,
      goldDiffAt15: 158,
      xpDiffAt15: -82,
      soloqKrChallengerWinRate: 52,
    },
  }),

  createChampion({
    id: "yunara",

    synergyWith: [
      { championId: "nautilus", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "alistar", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "karma", score: 3 },
      { championId: "thresh", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],

    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "scaling", strength: 5 },
      { type: "siege", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 3 },
      { type: "peel", priority: 3 },
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "engage", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

    name: "Yunara",
    image: "/champions/yunara.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 15,
      bans: 3,
      presence: 18,
      prioScore: 16,
      wins: 8,
      losses: 7,
      proWinRate: 53,
      kda: 3,
      avgBanTurn: 8,
      avgPickRound: 1.87,
      blindPickRate: 66.7,
      averageGameTime: "35:02",
      csPerMinute: 10.6,
      damagePerMinute: 736,
      goldPerMinute: 491,
      csDiffAt15: -14.7,
      goldDiffAt15: -511,
      xpDiffAt15: -332,
      soloqKrChallengerWinRate: 56,
    },
  }),


  createChampion({
    id: "azir",

    synergyWith: [
      { championId: "maokai", score: 3 },
      { championId: "nocturne", score: 3 },
      { championId: "vi", score: 4 },
      { championId: "xin-zhao", score: 2 },
      { championId: "lee-sin", score: 3 }
    ],

    offers: [
      { type: "zoneControl", strength: 5 },
      { type: "sustainedDamage", strength: 5 },
      { type: "waveclear", strength: 4 },
      { type: "scaling", strength: 5 },
      { type: "siege", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],


    playerScaling: { mec: 5, tfg: 4, con: 4, iq: 4 },

    name: "Azir",
    image: "/champions/azir.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 42.44,
    },
  }),


  createChampion({
    id: "xin-zhao",

    synergyWith: [
      { championId: "sivir", score: 4 },
      { championId: "karma", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "annie", score: 3 },
      { championId: "lulu", score: 3 }
    ],

    offers: [
      { type: "earlyPrio", strength: 4 },
      { type: "dive", strength: 4 },
      { type: "objectiveControl", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "frontline", severity: 1 },
    ],


    playerScaling: { mec: 3, mac: 4, tfg: 4, iq: 4 },

    name: "Xin Zhao",
    image: "/champions/xin-zhao.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 6,
      bans: 5,
      presence: 11,
      prioScore: 11,
      wins: 4,
      losses: 2,
      proWinRate: 67,
      kda: 6.6,
      avgBanTurn: 8,
      avgPickRound: 1.83,
      blindPickRate: 16.7,
      averageGameTime: "34:17",
      csPerMinute: 7.5,
      damagePerMinute: 384,
      goldPerMinute: 394,
      csDiffAt15: -2.8,
      goldDiffAt15: 147,
      xpDiffAt15: -103,
      soloqKrChallengerWinRate: 59.6,
    },
  }),


  createChampion({
    id: "karma",

    synergyWith: [
      { championId: "ezreal", score: 4 },
      { championId: "caitlyn", score: 4 },
      { championId: "varus", score: 4 },
      { championId: "jinx", score: 3 },
      { championId: "zeri", score: 3 },
      { championId: "tristana", score: 3 },
      { championId: "nidalee", score: 3 },
      { championId: "jayce", score: 3 },
    ],

    offers: [
      { type: "poke", strength: 4 },
      { type: "peel", strength: 4 },
      { type: "earlyPrio", strength: 4 },
      { type: "disengage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],


    playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

    name: "Karma",
    image: "/champions/karma.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 14,
      bans: 6,
      presence: 20,
      prioScore: 21,
      wins: 5,
      losses: 9,
      proWinRate: 36,
      kda: 4.4,
      avgBanTurn: 4.7,
      avgPickRound: 1.57,
      blindPickRate: 50,
      averageGameTime: "34:48",
      csPerMinute: 1.1,
      damagePerMinute: 233,
      goldPerMinute: 260,
      csDiffAt15: -2.7,
      goldDiffAt15: 209,
      xpDiffAt15: -120,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "ezreal",

    synergyWith: [
      { championId: "karma", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "yuumi", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "jayce", score: 3 },
      { championId: "thresh", score: 3 }
    ],

    offers: [
      { type: "poke", strength: 5 },
      { type: "siege", strength: 3 },
      { type: "scaling", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],


    playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

    name: "Ezreal",
    image: "/champions/ezreal.png",
    roles: ["adc"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 23,
      bans: 19,
      presence: 42,
      prioScore: 49,
      wins: 10,
      losses: 13,
      proWinRate: 43,
      kda: 3,
      avgBanTurn: 4.5,
      avgPickRound: 1.43,
      blindPickRate: 81.8,
      averageGameTime: "32:09",
      csPerMinute: 10,
      damagePerMinute: 821,
      goldPerMinute: 466,
      csDiffAt15: 1,
      goldDiffAt15: -68,
      xpDiffAt15: 16,
      soloqKrChallengerWinRate: 54.8,
    },
  }),


  createChampion({
    id: "pantheon",

    synergyWith: [
      { championId: "twisted-fate", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "ahri", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "kaisa", score: 4 },
      { championId: "ryze", score: 5 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 4 },
      { type: "engage", strength: 4 },
      { type: "earlyPrio", strength: 5 },
      { type: "roamPressure", strength: 5 },
      { type: "burstDamage", strength: 4 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],

    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Pantheon",
    image: "/champions/pantheon.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 12,
      bans: 12,
      presence: 24,
      prioScore: 26,
      wins: 6,
      losses: 6,
      proWinRate: 50,
      kda: 3.5,
      avgBanTurn: 4.9,
      avgPickRound: 1.92,
      blindPickRate: 33.3,
      averageGameTime: "33:29",
      csPerMinute: 6.7,
      damagePerMinute: 394,
      goldPerMinute: 381,
      csDiffAt15: -10,
      goldDiffAt15: 4,
      xpDiffAt15: -338,
      soloqKrChallengerWinRate: 55.2,
    },
  }),

  createChampion({
    id: "caitlyn",

    synergyWith: [
      { championId: "karma", score: 4 },
      { championId: "lux", score: 4 },
      { championId: "morgana", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "milio", score: 3 },
      { championId: "nidalee", score: 3 },
      { championId: "jayce", score: 3 },
    ],

    offers: [
      { type: "siege", strength: 5 },
      { type: "poke", strength: 4 },
      { type: "earlyPrio", strength: 4 },
      { type: "waveclear", strength: 3 }
    ],

    needs: [
      { type: "peel", priority: 2 },
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 4, clt: 3, con: 5 },

    name: "Caitlyn",
    image: "/champions/caitlyn.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 8,
      bans: 12,
      presence: 20,
      prioScore: 22,
      wins: 2,
      losses: 6,
      proWinRate: 25,
      kda: 2.5,
      avgBanTurn: 5.4,
      avgPickRound: 1.88,
      blindPickRate: 12.5,
      averageGameTime: "35:21",
      csPerMinute: 11,
      damagePerMinute: 643,
      goldPerMinute: 491,
      csDiffAt15: 23.5,
      goldDiffAt15: 1247,
      xpDiffAt15: 734,
      soloqKrChallengerWinRate: 59.4,
    },
  }),


  createChampion({
    id: "ahri",

    synergyWith: [
      { championId: "vi", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "sejuani", score: 3 },
      { championId: "kaisa", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "followUp", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],

    playerScaling: { mec: 4, mac: 3, tfg: 3, iq: 4 },

    name: "Ahri",
    image: "/champions/ahri.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 4,
      bans: 4,
      presence: 8,
      prioScore: 9,
      wins: 3,
      losses: 1,
      proWinRate: 75,
      kda: 6,
      avgBanTurn: 7.8,
      avgPickRound: 2.25,
      blindPickRate: 0,
      averageGameTime: "35:00",
      csPerMinute: 8.9,
      damagePerMinute: 599,
      goldPerMinute: 413,
      csDiffAt15: 14.2,
      goldDiffAt15: 599,
      xpDiffAt15: 524,
      soloqKrChallengerWinRate: 59,
    },
  }),

  createChampion({
    id: "bard",

    synergyWith: [
      { championId: "ezreal", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "skarner", score: 3 },
      { championId: "sivir", score: 3 },
      { championId: "pantheon", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "ryze", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 4 },
      { type: "roamPressure", strength: 5 },
      { type: "disengage", strength: 4 },
      { type: "followUp", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],


    playerScaling: { mec: 3, mac: 5, tfg: 3, iq: 5 },

    name: "Bard",
    image: "/champions/bard.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 3,
      bans: 2,
      presence: 5,
      prioScore: 5,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 16,
      avgBanTurn: 5.5,
      avgPickRound: 2,
      blindPickRate: 33.3,
      averageGameTime: "29:17",
      csPerMinute: 1.1,
      damagePerMinute: 262,
      goldPerMinute: 291,
      csDiffAt15: -2.3,
      goldDiffAt15: 368,
      xpDiffAt15: 158,
      soloqKrChallengerWinRate: 58,
    },
  }),

  createChampion({
    id: "taliyah",

    synergyWith: [
      { championId: "pantheon", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "sejuani", score: 3 },
      { championId: "kaisa", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "zoneControl", strength: 5 },
      { type: "pick", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "waveclear", strength: 4 },
      { type: "followUp", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],


    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Taliyah",
    image: "/champions/taliyah.png",
    roles: ["mid", "adc"],
    damageProfile: ["AP"],
    stats: {
      picks: 6,
      bans: 4,
      presence: 10,
      prioScore: 9,
      wins: 4,
      losses: 2,
      proWinRate: 67,
      kda: 3.7,
      avgBanTurn: 9.3,
      avgPickRound: 2.83,
      blindPickRate: 0,
      averageGameTime: "35:02",
      csPerMinute: 8.8,
      damagePerMinute: 596,
      goldPerMinute: 392,
      csDiffAt15: 0.2,
      goldDiffAt15: 59,
      xpDiffAt15: -94,
      soloqKrChallengerWinRate: 58,
    },
  }),

  createChampion({
    id: "sion",

    synergyWith: [
      { championId: "pantheon", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "azir", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "aphelios", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "sejuani", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 5 },
      { type: "engage", strength: 4 },
      { type: "waveclear", strength: 3 }
    ],

    needs: [
      { type: "sustainedDamage", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 5, iq: 3 },

    name: "Sion",
    image: "/champions/sion.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 51,
    },
  }),


  createChampion({
    id: "ksante",

    synergyWith: [
      { championId: "milio", score: 4 },
      { championId: "zeri", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "azir", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "sejuani", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 5 },
      { type: "peel", strength: 3 },
      { type: "reliableCC", strength: 3 },
      { type: "sideLanePressure", strength: 2 }
    ],

    needs: [
      { type: "sustainedDamage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "pick", severity: 2 }
    ],


    playerScaling: { mec: 4, tfg: 4, con: 4, iq: 2 },

    name: "K'Sante",
    image: "/champions/k'sante.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 20,
      bans: 16,
      presence: 36,
      prioScore: 38,
      wins: 7,
      losses: 13,
      proWinRate: 35,
      kda: 1.8,
      avgBanTurn: 6.7,
      avgPickRound: 2,
      blindPickRate: 35,
      averageGameTime: "31:37",
      csPerMinute: 8,
      damagePerMinute: 381,
      goldPerMinute: 354,
      csDiffAt15: 0.9,
      goldDiffAt15: -14,
      xpDiffAt15: 43,
      soloqKrChallengerWinRate: 51,
    },
  }),


  createChampion({
    id: "dr-mundo",

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

    name: "Dr. Mundo",
    image: "/champions/dr.-mundo.png",
    roles: ["jungle", "top"],
    damageProfile: ["AD", "AP"],
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
  }),


  createChampion({
    id: "zaahen",

    synergyWith: [
      { championId: "sejuani", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "kaisa", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "azir", score: 3 },
    ],
    offers: [
      { type: "dive", strength: 4 },
      { type: "backlineAccess", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],
    needs: [
      { type: "followUp", priority: 2 },
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "frontline", severity: 1 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Zaahen",
    image: "/champions/zaahen.png",
    roles: ["jungle", "top"],
    damageProfile: ["AD"],
    stats: {
      picks: 5,
      bans: 0,
      presence: 5,
      prioScore: 3,
      wins: 3,
      losses: 2,
      proWinRate: 60,
      kda: 3.1,
      avgBanTurn: null,
      avgPickRound: 2.6,
      blindPickRate: 0,
      averageGameTime: "32:15",
      csPerMinute: 8.2,
      damagePerMinute: 598,
      goldPerMinute: 404,
      csDiffAt15: 3.4,
      goldDiffAt15: 418,
      xpDiffAt15: 724,
      soloqKrChallengerWinRate: 56.4,
    },
  }),

  createChampion({
    id: "ashe",

    synergyWith: [
      { championId: "braum", score: 3 },
      { championId: "karma", score: 2 },
      { championId: "lulu", score: 2 },
      { championId: "bard", score: 2 },
      { championId: "jax", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "sejuani", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "azir", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 4 },
      { type: "poke", strength: 3 },
      { type: "engage", strength: 2 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

    name: "Ashe",
    image: "/champions/ashe.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 11,
      bans: 3,
      presence: 14,
      prioScore: 15,
      wins: 7,
      losses: 4,
      proWinRate: 64,
      kda: 3.5,
      avgBanTurn: 6,
      avgPickRound: 1.55,
      blindPickRate: 72.7,
      averageGameTime: "33:21",
      csPerMinute: 10,
      damagePerMinute: 582,
      goldPerMinute: 479,
      csDiffAt15: 3,
      goldDiffAt15: 14,
      xpDiffAt15: -205,
      soloqKrChallengerWinRate: 58.82,
    },
  }),


  createChampion({
    id: "corki",

    synergyWith: [
      { championId: "nami", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "bard", score: 4 },
      { championId: "renata-glasc", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "orianna", score: 3 },
    ],

    offers: [
      { type: "poke", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "waveclear", strength: 3 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

    name: "Corki",
    image: "/champions/corki.png",
    roles: ["adc"],
    damageProfile: ["AD", "TRUE"],
    stats: {
      picks: 5,
      bans: 2,
      presence: 7,
      prioScore: 7,
      wins: 4,
      losses: 1,
      proWinRate: 80,
      kda: 8.5,
      avgBanTurn: 8.5,
      avgPickRound: 1.8,
      blindPickRate: 40,
      averageGameTime: "32:26",
      csPerMinute: 10.3,
      damagePerMinute: 694,
      goldPerMinute: 510,
      csDiffAt15: 2.2,
      goldDiffAt15: 144,
      xpDiffAt15: -17,
      soloqKrChallengerWinRate: 57.57,
    },
  }),


  createChampion({
    id: "aurora",

    synergyWith: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "sejuani", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "vi", score: 3 },
    ],

    offers: [
      { type: "burstDamage", strength: 4 },
      { type: "backlineAccess", strength: 3 },
      { type: "zoneControl", strength: 3 },
      { type: "waveclear", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 4, con: 3, iq: 4 },

    name: "Aurora",
    image: "/champions/aurora.png",
    roles: ["mid", "top"],
    damageProfile: ["AP"],
    stats: {
      picks: 4,
      bans: 3,
      presence: 7,
      prioScore: 8,
      wins: 2,
      losses: 2,
      proWinRate: 50,
      kda: 3.4,
      avgBanTurn: 8.7,
      avgPickRound: 1.75,
      blindPickRate: 50,
      averageGameTime: "29:49",
      csPerMinute: 8.9,
      damagePerMinute: 746,
      goldPerMinute: 406,
      csDiffAt15: 0,
      goldDiffAt15: 438,
      xpDiffAt15: 156,
      soloqKrChallengerWinRate: 53.81,
    },
  }),


  createChampion({
    id: "gwen",

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

    name: "Gwen",
    image: "/champions/gwen.png",
    roles: ["top"],
    damageProfile: ["AP", "TRUE"],
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
  }),


  createChampion({
    id: "renekton",

    synergyWith: [
      { championId: "nidalee", score: 4 },
      { championId: "elise", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "ahri", score: 3 },
      { championId: "akali", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "renata-glasc", score: 3 },
    ],

    offers: [
      { type: "earlyPrio", strength: 5 },
      { type: "engage", strength: 3 },
      { type: "burstDamage", strength: 3 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "engage", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 4, iq: 2 },

    name: "Renekton",
    image: "/champions/renekton.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 7,
      bans: 13,
      presence: 20,
      prioScore: 22,
      wins: 5,
      losses: 2,
      proWinRate: 71,
      kda: 3.2,
      avgBanTurn: 9.8,
      avgPickRound: 2.43,
      blindPickRate: 42.9,
      averageGameTime: "37:31",
      csPerMinute: 8.8,
      damagePerMinute: 480,
      goldPerMinute: 402,
      csDiffAt15: 6.1,
      goldDiffAt15: 309,
      xpDiffAt15: 1,
      soloqKrChallengerWinRate: 59.18,
    },
  }),


  createChampion({
    id: "lulu",

    synergyWith: [
      { championId: "kogmaw", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "jinx", score: 4 },
      { championId: "aphelios", score: 3 },
      { championId: "yunara", score: 3 },
      { championId: "vayne", score: 3 },
      { championId: "corki", score: 3 },
      { championId: "xin-zhao", score: 3 },
    ],

    offers: [
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 5 },
      { type: "disengage", strength: 3 },
      { type: "scaling", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 }
    ],


    playerScaling: { mac: 4, tfg: 3, con: 4, iq: 5 },

    name: "Lulu",
    image: "/champions/lulu.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 20,
      bans: 9,
      presence: 29,
      prioScore: 29,
      wins: 11,
      losses: 9,
      proWinRate: 55,
      kda: 6.2,
      avgBanTurn: 7.8,
      avgPickRound: 1.8,
      blindPickRate: 68.4,
      averageGameTime: "33:42",
      csPerMinute: 1,
      damagePerMinute: 161,
      goldPerMinute: 258,
      csDiffAt15: 0.4,
      goldDiffAt15: -109,
      xpDiffAt15: -55,
      soloqKrChallengerWinRate: 51.7,
    },
  }),

  createChampion({
    id: "wukong",

    synergyWith: [
      { championId: "orianna", score: 4 },
      { championId: "azir", score: 4 },
      { championId: "neeko", score: 4 },
      { championId: "miss-fortune", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "sylas", score: 2 },
      { championId: "viktor", score: 3 },
      { championId: "akali", score: 4 },
      { championId: "renata-glasc", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 4 },
      { type: "dive", strength: 4 },
      { type: "followUp", strength: 4 },
      { type: "reliableCC", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 1 },
    ],

    playerScaling: { mec: 3, mac: 4, tfg: 5, iq: 4 },

    name: "Wukong",
    image: "/champions/wukong.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 11,
      bans: 15,
      presence: 26,
      prioScore: 29,
      wins: 5,
      losses: 6,
      proWinRate: 45,
      kda: 3.8,
      avgBanTurn: 6.1,
      avgPickRound: 1.82,
      blindPickRate: 30,
      averageGameTime: "36:23",
      csPerMinute: 7.1,
      damagePerMinute: 353,
      goldPerMinute: 377,
      csDiffAt15: 5.3,
      goldDiffAt15: 194,
      xpDiffAt15: 230,
      soloqKrChallengerWinRate: 57.39,
    },
  }),


  createChampion({
    id: "gnar",

    synergyWith: [
      { championId: "lee-sin", score: 3 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "ambessa", score: 2 },
      { championId: "xin-zhao", score: 2 },
      { championId: "rell", score: 3 },
      { championId: "anivia", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "azir", score: 3 },
      { championId: "nocturne", score: 4 }
    ],
    offers: [
      { type: "sideLanePressure", strength: 3 },
      { type: "poke", strength: 3 },
      { type: "disengage", strength: 3 },
      { type: "engage", strength: 3 },
      { type: "reliableCC", strength: 3 }
    ],
    needs: [
      { type: "followUp", priority: 1 },
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 }
    ],

    playerScaling: { mec: 4, tfg: 4, con: 3, iq: 2 },

    name: "Gnar",
    image: "/champions/gnar.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 10,
      bans: 7,
      presence: 17,
      prioScore: 19,
      wins: 7,
      losses: 3,
      proWinRate: 70,
      kda: 3.4,
      avgBanTurn: 8.3,
      avgPickRound: 1.5,
      blindPickRate: 50,
      averageGameTime: "36:17",
      csPerMinute: 8.8,
      damagePerMinute: 476,
      goldPerMinute: 397,
      csDiffAt15: 4.8,
      goldDiffAt15: 187,
      xpDiffAt15: 125,
      soloqKrChallengerWinRate: 56.48,
    },
  }),

  createChampion({
    id: "aatrox",

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

    name: "Aatrox",
    image: "/champions/aatrox.png",
    roles: ["jungle", "top"],
    damageProfile: ["AD"],
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
  }),


  createChampion({
    id: "akali",

    synergyWith: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "zaahen", score: 3 },
      { championId: "samira", score: 3 },
      { championId: "vi", score: 3 },
    ],

    offers: [
      { type: "backlineAccess", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "engage", severity: 1 },
    ],

    playerScaling: { mec: 5, tfg: 3, clt: 3, iq: 4 },

    name: "Akali",
    image: "/champions/akali.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 12,
      bans: 27,
      presence: 39,
      prioScore: 48,
      wins: 3,
      losses: 9,
      proWinRate: 25,
      kda: 1.9,
      avgBanTurn: 5.9,
      avgPickRound: 1.33,
      blindPickRate: 36.4,
      averageGameTime: "34:59",
      csPerMinute: 8.4,
      damagePerMinute: 504,
      goldPerMinute: 383,
      csDiffAt15: -6.1,
      goldDiffAt15: -260,
      xpDiffAt15: -27,
      soloqKrChallengerWinRate: 49.5,
    },
  }),



  createChampion({
    id: "nocturne",

    synergyWith: [
      { championId: "orianna", score: 5 },
      { championId: "ahri", score: 5 },
      { championId: "akali", score: 3 },
      { championId: "shen", score: 5 },
      { championId: "ornn", score: 5 },
      { championId: "galio", score: 4 },
      { championId: "twisted-fate", score: 4 },
      { championId: "ryze", score: 4 },
    ],

    offers: [
      { type: "backlineAccess", strength: 5 },
      { type: "dive", strength: 5 },
      { type: "pick", strength: 4 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 3, clt: 3, iq: 4 },

    name: "Nocturne",
    image: "/champions/nocturne.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 13,
      bans: 57,
      presence: 70,
      prioScore: 89,
      wins: 8,
      losses: 5,
      proWinRate: 62,
      kda: 4.8,
      avgBanTurn: 3.1,
      avgPickRound: 1.31,
      blindPickRate: 92.3,
      averageGameTime: "31:58",
      csPerMinute: 7,
      damagePerMinute: 404,
      goldPerMinute: 389,
      csDiffAt15: 1.2,
      goldDiffAt15: -193,
      xpDiffAt15: -161,
      soloqKrChallengerWinRate: 59.69,
    },
  }),

  createChampion({
    id: "nami",

    synergyWith: [
      { championId: "varus", score: 3 },
      { championId: "ezreal", score: 3 }
    ],

    offers: [
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 4 },
      { type: "disengage", strength: 4 }
    ],

    needs: [
      { type: "engage", priority: 2 },
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "siege", severity: 2 },
    ],

    playerScaling: { mec: 3, mac: 4, con: 4, iq: 4 },

    name: "Nami",
    image: "/champions/nami.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 2,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 6.8,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 66.7,
      averageGameTime: "36:21",
      csPerMinute: 0.8,
      damagePerMinute: 236,
      goldPerMinute: 262,
      csDiffAt15: -4.7,
      goldDiffAt15: 109,
      xpDiffAt15: 15,
      soloqKrChallengerWinRate: 56.07,
    },
  }),

  createChampion({
    id: "alistar",

    synergyWith: [
      { championId: "kaisa", score: 4 },
      { championId: "samira", score: 4 },
      { championId: "sivir", score: 4 },
      { championId: "jhin", score: 3 },
      { championId: "varus", score: 3 },
      { championId: "draven", score: 3 },
      { championId: "xayah", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "frontline", strength: 4 },
      { type: "peel", strength: 3 },
      { type: "disengage", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "peel", severity: 1 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

    name: "Alistar",
    image: "/champions/alistar.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 21,
      bans: 1,
      presence: 22,
      prioScore: 24,
      wins: 7,
      losses: 14,
      proWinRate: 33,
      kda: 2.1,
      avgBanTurn: 9,
      avgPickRound: 1.52,
      blindPickRate: 33.3,
      averageGameTime: "31:46",
      csPerMinute: 1,
      damagePerMinute: 108,
      goldPerMinute: 248,
      csDiffAt15: -1,
      goldDiffAt15: -121,
      xpDiffAt15: -67,
      soloqKrChallengerWinRate: 56.97,
    },
  }),


  createChampion({
    id: "kaisa",

    synergyWith: [
      { championId: "rell", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "leona", score: 3 },
    ],

    offers: [
      { type: "dive", strength: 4 },
      { type: "backlineAccess", strength: 4 },
      { type: "burstDamage", strength: 3 },
      { type: "sustainedDamage", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 3 },
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

    name: "Kai'Sa",
    image: "/champions/kai'sa.png",
    roles: ["adc"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 10,
      bans: 3,
      presence: 13,
      prioScore: 15,
      wins: 5,
      losses: 5,
      proWinRate: 50,
      kda: 4.3,
      avgBanTurn: 7.3,
      avgPickRound: 1.6,
      blindPickRate: 20,
      averageGameTime: "32:12",
      csPerMinute: 10.4,
      damagePerMinute: 576,
      goldPerMinute: 502,
      csDiffAt15: -9.3,
      goldDiffAt15: -33,
      xpDiffAt15: -62,
      soloqKrChallengerWinRate: 52.99,
    },
  }),


  createChampion({
    id: "galio",

    synergyWith: [
      { championId: "nocturne", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "kindred", score: 4 },
      { championId: "wukong", score: 3 },
      { championId: "seraphine", score: 3 },
      { championId: "bard", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 4 },
      { type: "followUp", strength: 4 },
      { type: "antiDive", strength: 3 },
      { type: "frontline", strength: 4 },
      { type: "roamPressure", strength: 4 }
    ],

    needs: [
      { type: "sustainedDamage", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],

    playerScaling: { mec: 4, mac: 4, tfg: 4, con: 4 },

    name: "Galio",
    image: "/champions/galio.png",
    roles: ["mid", "top"],
    damageProfile: ["AP"],
    stats: {
      picks: 12,
      bans: 14,
      presence: 26,
      prioScore: 30,
      wins: 8,
      losses: 4,
      proWinRate: 67,
      kda: 5,
      avgBanTurn: 5.1,
      avgPickRound: 1.58,
      blindPickRate: 33.3,
      averageGameTime: "32:43",
      csPerMinute: 8.3,
      damagePerMinute: 452,
      goldPerMinute: 372,
      csDiffAt15: -5.3,
      goldDiffAt15: -304,
      xpDiffAt15: 1,
      soloqKrChallengerWinRate: 55.99,
    },
  }),


  createChampion({
    id: "sivir",

    synergyWith: [
      { championId: "xin-zhao", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "karma", score: 4 },
      { championId: "renata-glasc", score: 3 },
      { championId: "bard", score: 3 },
      { championId: "nami", score: 3 },
    ],

    offers: [
      { type: "waveclear", strength: 5 },
      { type: "siege", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "scaling", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 4, con: 4, iq: 3 },

    name: "Sivir",
    image: "/champions/sivir.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 3,
      bans: 3,
      presence: 6,
      prioScore: 5,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 4,
      avgBanTurn: 7.7,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "29:29",
      csPerMinute: 10.2,
      damagePerMinute: 839,
      goldPerMinute: 504,
      csDiffAt15: -10.7,
      goldDiffAt15: -373,
      xpDiffAt15: -241,
      soloqKrChallengerWinRate: 54.26,
    },
  }),


  createChampion({
    id: "seraphine",

    synergyWith: [
      { championId: "ezreal", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "dr-mundo", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "ornn", score: 3 },
      { championId: "nocturne", score: 2 },
    ],

    offers: [
      { type: "waveclear", strength: 4 },
      { type: "disengage", strength: 4 },
      { type: "peel", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "zoneControl", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 }
    ],


    playerScaling: { mac: 4, tfg: 5, con: 3, iq: 4 },

    name: "Seraphine",
    image: "/champions/seraphine.png",
    roles: ["support", "adc"],
    damageProfile: ["AP"],
    stats: {
      picks: 13,
      bans: 18,
      presence: 31,
      prioScore: 35,
      wins: 8,
      losses: 5,
      proWinRate: 62,
      kda: 4.1,
      avgBanTurn: 4.3,
      avgPickRound: 1.69,
      blindPickRate: 69.2,
      averageGameTime: "32:59",
      csPerMinute: 1.1,
      damagePerMinute: 240,
      goldPerMinute: 268,
      csDiffAt15: 2.5,
      goldDiffAt15: 120,
      xpDiffAt15: 273,
      soloqKrChallengerWinRate: 55.53,
    },
  }),


  createChampion({
    id: "anivia",

    synergyWith: [
      { championId: "poppy", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "vi", score: 2 },
      { championId: "nocturne", score: 2 },
      { championId: "ezreal", score: 2 },
      { championId: "jhin", score: 2 },
      { championId: "caitlyn", score: 3 }
    ],

    offers: [
      { type: "waveclear", strength: 5 },
      { type: "zoneControl", strength: 5 },
      { type: "scaling", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Anivia",
    image: "/champions/anivia.png",
    roles: ["mid", "support"],
    damageProfile: ["AP"],
    stats: {
      picks: 6,
      bans: 4,
      presence: 10,
      prioScore: 11,
      wins: 1,
      losses: 5,
      proWinRate: 17,
      kda: 1.5,
      avgBanTurn: 6.8,
      avgPickRound: 1.5,
      blindPickRate: 50,
      averageGameTime: "34:34",
      csPerMinute: 8.5,
      damagePerMinute: 499,
      goldPerMinute: 362,
      csDiffAt15: 1,
      goldDiffAt15: -226,
      xpDiffAt15: -100,
      soloqKrChallengerWinRate: 62.77,
    },
  }),


  createChampion({
    id: "rakan",

    synergyWith: [
      { championId: "kaisa", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "jinx", score: 3 },
      { championId: "aphelios", score: 3 },
      { championId: "yasuo", score: 3 },
      { championId: "wukong", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "followUp", strength: 4 },
      { type: "disengage", strength: 3 },
      { type: "reliableCC", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],

    playerScaling: { mec: 4, mac: 4, tfg: 5, iq: 4 },

    name: "Rakan",
    image: "/champions/rakan.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 9,
      bans: 2,
      presence: 11,
      prioScore: 10,
      wins: 4,
      losses: 5,
      proWinRate: 44,
      kda: 3.8,
      avgBanTurn: 8,
      avgPickRound: 2,
      blindPickRate: 44.4,
      averageGameTime: "33:18",
      csPerMinute: 1.2,
      damagePerMinute: 167,
      goldPerMinute: 259,
      csDiffAt15: 3.1,
      goldDiffAt15: 27,
      xpDiffAt15: -65,
      soloqKrChallengerWinRate: 56.49,
    },
  }),


  createChampion({
    id: "syndra",

    synergyWith: [
      { championId: "sejuani", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "rakan", score: 3 },
    ],

    offers: [
      { type: "burstDamage", strength: 5 },
      { type: "pick", strength: 3 },
      { type: "waveclear", strength: 4 },
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

    playerScaling: { mec: 4, tfg: 3, con: 4, iq: 4 },

    name: "Syndra",
    image: "/champions/syndra.png",
    roles: ["mid", "adc"],
    damageProfile: ["AP"],
    stats: {
      picks: 20,
      bans: 25,
      presence: 45,
      prioScore: 56,
      wins: 12,
      losses: 8,
      proWinRate: 60,
      kda: 4,
      avgBanTurn: 3.7,
      avgPickRound: 1.25,
      blindPickRate: 84.2,
      averageGameTime: "32:29",
      csPerMinute: 8.9,
      damagePerMinute: 640,
      goldPerMinute: 408,
      csDiffAt15: 4.4,
      goldDiffAt15: 223,
      xpDiffAt15: 174,
      soloqKrChallengerWinRate: 54.74,
    },
  }),


  createChampion({
    id: "leona",

    synergyWith: [
      { championId: "miss-fortune", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "draven", score: 3 },
      { championId: "corki", score: 3 },
      { championId: "ivern", score: 3 },
      { championId: "vi", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "pick", strength: 4 },
      { type: "reliableCC", strength: 5 },
      { type: "frontline", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

    name: "Leona",
    image: "/champions/leona.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 4,
      bans: 1,
      presence: 5,
      prioScore: 4,
      wins: 2,
      losses: 2,
      proWinRate: 50,
      kda: 2.4,
      avgBanTurn: 7,
      avgPickRound: 2.5,
      blindPickRate: 0,
      averageGameTime: "29:47",
      csPerMinute: 1,
      damagePerMinute: 155,
      goldPerMinute: 263,
      csDiffAt15: -2.2,
      goldDiffAt15: -362,
      xpDiffAt15: -192,
      soloqKrChallengerWinRate: 57.33,
    },
  }),


  createChampion({
    id: "mel",

    synergyWith: [
      { championId: "ornn", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
    ],
    offers: [
      { type: "poke", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "waveclear", strength: 3 },
      { type: "scaling", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 1 },
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 }
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Mel",
    image: "/champions/mel.png",
    roles: ["mid", "adc"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "36:15",
      csPerMinute: 8.8,
      damagePerMinute: 530,
      goldPerMinute: 382,
      csDiffAt15: 20,
      goldDiffAt15: 832,
      xpDiffAt15: 666,
      soloqKrChallengerWinRate: 50.98,
    },
  }),


  createChampion({
    id: "ornn",

    synergyWith: [
      { championId: "pantheon", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "orianna", score: 4 },
      { championId: "azir", score: 3 },
      { championId: "jinx", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 5 },
      { type: "engage", strength: 4 },
      { type: "reliableCC", strength: 4 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 4, con: 5, iq: 4 },

    name: "Ornn",
    image: "/champions/ornn.png",
    roles: ["top"],
    damageProfile: ["AP"],
    stats: {
      picks: 8,
      bans: 1,
      presence: 9,
      prioScore: 8,
      wins: 5,
      losses: 3,
      proWinRate: 63,
      kda: 2.4,
      avgBanTurn: 8,
      avgPickRound: 1.75,
      blindPickRate: 12.5,
      averageGameTime: "30:51",
      csPerMinute: 7.8,
      damagePerMinute: 356,
      goldPerMinute: 343,
      csDiffAt15: -7.2,
      goldDiffAt15: -561,
      xpDiffAt15: -368,
      soloqKrChallengerWinRate: 59.4,
    },
  }),


  createChampion({
    id: "braum",

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

    name: "Braum",
    image: "/champions/braum.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
  }),


  createChampion({
    id: "jhin",

    synergyWith: [
      { championId: "karma", score: 3 },
      { championId: "thresh", score: 3 },
      { championId: "bard", score: 4 },
      { championId: "nautilus", score: 2 },
      { championId: "nami", score: 3 }
    ],

    offers: [
      { type: "pick", strength: 3 },
      { type: "burstDamage", strength: 3 },
      { type: "siege", strength: 3 },
      { type: "followUp", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

    name: "Jhin",
    image: "/champions/jhin.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 17,
      bans: 13,
      presence: 30,
      prioScore: 34,
      wins: 9,
      losses: 8,
      proWinRate: 53,
      kda: 8.5,
      avgBanTurn: 7.7,
      avgPickRound: 1.59,
      blindPickRate: 58.8,
      averageGameTime: "30:17",
      csPerMinute: 10.1,
      damagePerMinute: 629,
      goldPerMinute: 476,
      csDiffAt15: 1.7,
      goldDiffAt15: -81,
      xpDiffAt15: 190,
      soloqKrChallengerWinRate: 53.43,
    },
  }),


  createChampion({
    id: "aphelios",

    synergyWith: [
      { championId: "thresh", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "braum", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "milio", score: 3 },
      { championId: "renata-glasc", score: 3 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "scaling", strength: 5 },
      { type: "siege", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 3 },
      { type: "peel", priority: 3 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 5, clt: 3, con: 4 },

    name: "Aphelios",
    image: "/champions/aphelios.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 1,
      bans: 2,
      presence: 3,
      prioScore: 4,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 9,
      avgBanTurn: 7.5,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "37:32",
      csPerMinute: 10.3,
      damagePerMinute: 672,
      goldPerMinute: 495,
      csDiffAt15: -24,
      goldDiffAt15: -471,
      xpDiffAt15: -462,
      soloqKrChallengerWinRate: 53.17,
    },
  }),


  createChampion({
    id: "xayah",

    synergyWith: [
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "wukong", score: 3 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 4 },
      { type: "antiDive", strength: 4 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 5, clt: 3, con: 4 },

    name: "Xayah",
    image: "/champions/xayah.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 7,
      bans: 1,
      presence: 8,
      prioScore: 6,
      wins: 4,
      losses: 3,
      proWinRate: 57,
      kda: 3,
      avgBanTurn: 3,
      avgPickRound: 2.29,
      blindPickRate: 28.6,
      averageGameTime: "35:46",
      csPerMinute: 10.5,
      damagePerMinute: 657,
      goldPerMinute: 509,
      csDiffAt15: 3.4,
      goldDiffAt15: 607,
      xpDiffAt15: 360,
      soloqKrChallengerWinRate: 58.35,
    },
  }),


  createChampion({
    id: "jax",

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

    name: "Jax",
    image: "/champions/jax.png",
    roles: ["top"],
    damageProfile: ["AD", "AP"],
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
  }),


  createChampion({
    id: "jayce",

    synergyWith: [
      { championId: "nidalee", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "lee-sin", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "karma", score: 3 },
      { championId: "maokai", score: 4 },
    ],

    offers: [
      { type: "poke", strength: 5 },
      { type: "siege", strength: 4 },
      { type: "earlyPrio", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],

    playerScaling: { mec: 5, tfg: 3, con: 3, iq: 3 },

    name: "Jayce",
    image: "/champions/jayce.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 13,
      bans: 25,
      presence: 38,
      prioScore: 45,
      wins: 8,
      losses: 5,
      proWinRate: 62,
      kda: 3.4,
      avgBanTurn: 4.5,
      avgPickRound: 1.69,
      blindPickRate: 83.3,
      averageGameTime: "32:07",
      csPerMinute: 9.5,
      damagePerMinute: 777,
      goldPerMinute: 446,
      csDiffAt15: 12.7,
      goldDiffAt15: 562,
      xpDiffAt15: 326,
      soloqKrChallengerWinRate: 56.92,
    },
  }),


  createChampion({
    id: "rell",

    synergyWith: [
      { championId: "kaisa", score: 4 },
      { championId: "kalista", score: 4 },
      { championId: "miss-fortune", score: 3 },
      { championId: "varus", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "sivir", score: 3 },
      { championId: "wukong", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "followUp", strength: 4 },
      { type: "reliableCC", strength: 4 },
      { type: "frontline", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],


    playerScaling: { mac: 4, tfg: 5, clt: 3, iq: 4 },

    name: "Rell",
    image: "/champions/rell.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 2,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 2.8,
      avgBanTurn: null,
      avgPickRound: 3.33,
      blindPickRate: 33.3,
      averageGameTime: "30:20",
      csPerMinute: 1.1,
      damagePerMinute: 126,
      goldPerMinute: 255,
      csDiffAt15: -1,
      goldDiffAt15: -35,
      xpDiffAt15: 106,
      soloqKrChallengerWinRate: 59.93,
    },
  }),


  createChampion({
    id: "poppy",

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

    name: "Poppy",
    image: "/champions/poppy.png",
    roles: ["support", "jungle", "top"],
    damageProfile: ["AD"],
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
  }),


  createChampion({
    id: "viktor",

    synergyWith: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "ornn", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "rell", score: 3 },
    ],
    offers: [
      { type: "waveclear", strength: 5 },
      { type: "zoneControl", strength: 4 },
      { type: "poke", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "sustainedDamage", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 }
    ],

    playerScaling: { mec: 4, tfg: 4, con: 5, iq: 4 },

    name: "Viktor",
    image: "/champions/viktor.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 15,
      bans: 9,
      presence: 24,
      prioScore: 24,
      wins: 8,
      losses: 7,
      proWinRate: 53,
      kda: 3.6,
      avgBanTurn: 6.8,
      avgPickRound: 1.93,
      blindPickRate: 26.7,
      averageGameTime: "34:34",
      csPerMinute: 8.8,
      damagePerMinute: 735,
      goldPerMinute: 389,
      csDiffAt15: -1.5,
      goldDiffAt15: -195,
      xpDiffAt15: 90,
      soloqKrChallengerWinRate: 55.57,
    },
  }),


  createChampion({
    id: "malphite",

    synergyWith: [
      { championId: "yasuo", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "miss-fortune", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "wukong", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 5 },
      { type: "engage", strength: 4 },
      { type: "reliableCC", strength: 4 },
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 5, iq: 4 },

    name: "Malphite",
    image: "/champions/malphite.png",
    roles: ["jungle", "top"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.3,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "27:26",
      csPerMinute: 6.2,
      damagePerMinute: 188,
      goldPerMinute: 312,
      csDiffAt15: -29,
      goldDiffAt15: -3054,
      xpDiffAt15: -1736,
      soloqKrChallengerWinRate: 56.47,
    },
  }),


  createChampion({
    id: "annie",

    synergyWith: [
      { championId: "nocturne", score: 4 },
      { championId: "xin-zhao", score: 3 },
      { championId: "lee-sin", score: 3 },
      { championId: "ambessa", score: 3 },
      { championId: "jarvan-iv", score: 2 }
    ],

    offers: [
      { type: "burstDamage", strength: 4 },
      { type: "pick", strength: 4 },
      { type: "followUp", strength: 3 },
      { type: "reliableCC", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Annie",
    image: "/champions/annie.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 5,
      bans: 2,
      presence: 7,
      prioScore: 6,
      wins: 3,
      losses: 2,
      proWinRate: 60,
      kda: 6.1,
      avgBanTurn: 9.5,
      avgPickRound: 2.2,
      blindPickRate: 80,
      averageGameTime: "36:17",
      csPerMinute: 7.8,
      damagePerMinute: 746,
      goldPerMinute: 386,
      csDiffAt15: 2.4,
      goldDiffAt15: 102,
      xpDiffAt15: -95,
      soloqKrChallengerWinRate: 63.99,
    },
  }),


  createChampion({
    id: "naafiri",

    synergyWith: [
      { championId: "galio", score: 4 },
      { championId: "twisted-fate", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "pyke", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "orianna", score: 3 },
    ],

    offers: [
      { type: "burstDamage", strength: 4 },
      { type: "dive", strength: 4 },
      { type: "pick", strength: 4 },
      { type: "backlineAccess", strength: 3 },
      { type: "earlyPrio", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Naafiri",
    image: "/champions/naafiri.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 5,
      bans: 5,
      presence: 10,
      prioScore: 9,
      wins: 2,
      losses: 3,
      proWinRate: 40,
      kda: 2.3,
      avgBanTurn: 7.4,
      avgPickRound: 3.2,
      blindPickRate: 60,
      averageGameTime: "31:22",
      csPerMinute: 7.5,
      damagePerMinute: 625,
      goldPerMinute: 402,
      csDiffAt15: -4.2,
      goldDiffAt15: -41,
      xpDiffAt15: -117,
      soloqKrChallengerWinRate: 53.9,
    },
  }),


  createChampion({
    id: "leblanc",

    synergyWith: [
      { championId: "nocturne", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "burstDamage", strength: 5 },
      { type: "roamPressure", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],

    playerScaling: { mec: 5, tfg: 3, clt: 3, iq: 4 },

    name: "LeBlanc",
    image: "/champions/leblanc.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 4,
      bans: 5,
      presence: 9,
      prioScore: 10,
      wins: 1,
      losses: 3,
      proWinRate: 25,
      kda: 8.7,
      avgBanTurn: 8.2,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "33:17",
      csPerMinute: 9.3,
      damagePerMinute: 695,
      goldPerMinute: 412,
      csDiffAt15: 1,
      goldDiffAt15: 200,
      xpDiffAt15: 238,
      soloqKrChallengerWinRate: 53.23,
    },
  }),


  createChampion({
    id: "qiyana",

    synergyWith: [
      { championId: "twisted-fate", score: 5 },
      { championId: "galio", score: 5 },
      { championId: "pantheon", score: 4 },
      { championId: "pyke", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "renekton", score: 2 },
    ],

    offers: [
      { type: "burstDamage", strength: 5 },
      { type: "pick", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "backlineAccess", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

    name: "Qiyana",
    image: "/champions/qiyana.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 18,
      bans: 28,
      presence: 46,
      prioScore: 56,
      wins: 9,
      losses: 9,
      proWinRate: 50,
      kda: 3.1,
      avgBanTurn: 3.8,
      avgPickRound: 1.44,
      blindPickRate: 55.6,
      averageGameTime: "33:08",
      csPerMinute: 7.9,
      damagePerMinute: 554,
      goldPerMinute: 452,
      csDiffAt15: 5.1,
      goldDiffAt15: 630,
      xpDiffAt15: 287,
      soloqKrChallengerWinRate: 58.1,
    },
  }),


  createChampion({
    id: "sylas",

    synergyWith: [
      { championId: "sejuani", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "kaisa", score: 3 },
      { championId: "xayah", score: 2 },
      { championId: "renata-glasc", score: 2 },
    ],

    offers: [
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "zoneControl", severity: 3 },
      { exposedTo: "poke", severity: 3 },
    ],

    playerScaling: { mec: 4, tfg: 4, clt: 3, iq: 4 },

    name: "Sylas",
    image: "/champions/sylas.png",
    roles: ["mid", "jungle"],
    damageProfile: ["AP"],
    stats: {
      picks: 5,
      bans: 9,
      presence: 14,
      prioScore: 17,
      wins: 1,
      losses: 4,
      proWinRate: 20,
      kda: 1.7,
      avgBanTurn: 8.6,
      avgPickRound: 1.8,
      blindPickRate: 0,
      averageGameTime: "33:49",
      csPerMinute: 8,
      damagePerMinute: 434,
      goldPerMinute: 350,
      csDiffAt15: -10,
      goldDiffAt15: -589,
      xpDiffAt15: -649,
      soloqKrChallengerWinRate: 54.38,
    },
  }),


  createChampion({
    id: "cassiopeia",

    synergyWith: [
      { championId: "skarner", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "wukong", score: 2 },
      { championId: "qiyana", score: 2 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "zoneControl", strength: 4 },
      { type: "scaling", strength: 5 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Cassiopeia",
    image: "/champions/cassiopeia.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 13,
      bans: 38,
      presence: 51,
      prioScore: 66,
      wins: 8,
      losses: 5,
      proWinRate: 62,
      kda: 4.1,
      avgBanTurn: 3.9,
      avgPickRound: 1.08,
      blindPickRate: 72.7,
      averageGameTime: "34:09",
      csPerMinute: 8.7,
      damagePerMinute: 573,
      goldPerMinute: 405,
      csDiffAt15: 8.2,
      goldDiffAt15: 233,
      xpDiffAt15: 81,
      soloqKrChallengerWinRate: 57.03,
    },
  }),


  createChampion({
    id: "trundle",

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

    name: "Trundle",
    image: "/champions/trundle.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
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
  }),


  createChampion({
    id: "lee-sin",

    synergyWith: [
      { championId: "leblanc", score: 5 },
      { championId: "renekton", score: 4 },
      { championId: "twisted-fate", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "sylas", score: 3 },
      { championId: "pyke", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rakan", score: 2 },
    ],

    offers: [
      { type: "earlyPrio", strength: 5 },
      { type: "pick", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "dive", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],

    playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

    name: "Lee Sin",
    image: "/champions/lee-sin.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 24,
      bans: 19,
      presence: 43,
      prioScore: 51,
      wins: 12,
      losses: 12,
      proWinRate: 50,
      kda: 3.6,
      avgBanTurn: 5.2,
      avgPickRound: 1.29,
      blindPickRate: 66.7,
      averageGameTime: "34:29",
      csPerMinute: 7.3,
      damagePerMinute: 385,
      goldPerMinute: 390,
      csDiffAt15: 1.6,
      goldDiffAt15: -49,
      xpDiffAt15: 208,
      soloqKrChallengerWinRate: 57.05,
    },
  }),


  createChampion({
    id: "kennen",

    synergyWith: [
      { championId: "amumu", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "yone", score: 3 },
      { championId: "orianna", score: 3 },
    ],

    offers: [
      { type: "sideLanePressure", strength: 2 },
      { type: "burstDamage", strength: 3 },
      { type: "earlyPrio", strength: 1 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 }
    ],


    playerScaling: { mec: 4, tfg: 5, clt: 3, con: 3 },

    name: "Kennen",
    image: "/champions/kennen.png",
    roles: ["top"],
    damageProfile: ["AP"],
    stats: {
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 1,
      wins: 2,
      losses: 0,
      proWinRate: 100,
      kda: 5.3,
      avgBanTurn: null,
      avgPickRound: 2.5,
      blindPickRate: 50,
      averageGameTime: "36:48",
      csPerMinute: 10.6,
      damagePerMinute: 929,
      goldPerMinute: 491,
      csDiffAt15: 21,
      goldDiffAt15: 946,
      xpDiffAt15: 958,
      soloqKrChallengerWinRate: 55.84,
    },
  }),


  createChampion({
    id: "yone",

    synergyWith: [
      { championId: "malphite", score: 5 },
      { championId: "wukong", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "neeko", score: 4 },
      { championId: "rumble", score: 3 },
      { championId: "rakan", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "amumu", score: 4 },
    ],

    offers: [
      { type: "splitpush", strength: 4 },
      { type: "sideLanePressure", strength: 4 },
      { type: "sustainedDamage", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
      { exposedTo: "siege", severity: 1 }
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 3, iq: 4 },

    name: "Yone",
    image: "/champions/yone.png",
    roles: ["mid"],
    damageProfile: ["AD"],
    stats: {
      picks: 4,
      bans: 6,
      presence: 10,
      prioScore: 9,
      wins: 0,
      losses: 4,
      proWinRate: 0,
      kda: 0.9,
      avgBanTurn: 7.3,
      avgPickRound: 3.5,
      blindPickRate: 50,
      averageGameTime: "28:52",
      csPerMinute: 8.9,
      damagePerMinute: 442,
      goldPerMinute: 373,
      csDiffAt15: -8.8,
      goldDiffAt15: -704,
      xpDiffAt15: -565,
      soloqKrChallengerWinRate: 54.63,
    },
  }),


  createChampion({
    id: "zoe",

    synergyWith: [
      { championId: "nidalee", score: 5 },
      { championId: "elise", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "dr-mundo", score: 3 },
      { championId: "lux", score: 3 },
      { championId: "jayce", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "burstDamage", strength: 5 },
      { type: "poke", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],

    playerScaling: { mec: 5, tfg: 3, clt: 3, iq: 4 },

    name: "Zoe",
    image: "/champions/zoe.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 56.32,
    },
  }),


  createChampion({
    id: "lux",

    synergyWith: [
      { championId: "caitlyn", score: 5 },
      { championId: "jhin", score: 5 },
      { championId: "ezreal", score: 4 },
      { championId: "varus", score: 4 },
      { championId: "xerath", score: 3 },
      { championId: "nidalee", score: 3 },
      { championId: "jayce", score: 3 },
      { championId: "ziggs", score: 3 },
    ],

    offers: [
      { type: "poke", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "pick", strength: 3 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "peel", severity: 1 },
      { exposedTo: "waveclear", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Lux",
    image: "/champions/lux.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 3.5,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "23:59",
      csPerMinute: 1.5,
      damagePerMinute: 193,
      goldPerMinute: 282,
      csDiffAt15: 1,
      goldDiffAt15: 127,
      xpDiffAt15: 174,
      soloqKrChallengerWinRate: 55.59,
    },
  }),


  createChampion({
    id: "yasuo",

    synergyWith: [
      { championId: "malphite", score: 5 },
      { championId: "wukong", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "diana", score: 4 },
      { championId: "gragas", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "alistar", score: 4 }
    ],

    offers: [
      { type: "followUp", strength: 4 },
      { type: "dive", strength: 3 },
      { type: "sustainedDamage", strength: 3 },
      { type: "sideLanePressure", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 3 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "poke", severity: 2 }
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 3, iq: 4 },

    name: "Yasuo",
    image: "/champions/yasuo.png",
    roles: ["mid", "top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 55.14,
    },
  }),


  createChampion({
    id: "rengar",

    synergyWith: [
      { championId: "ivern", score: 5 },
      { championId: "leblanc", score: 4 },
      { championId: "qiyana", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "pyke", score: 3 },
      { championId: "ashe", score: 2 },
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "burstDamage", strength: 5 },
      { type: "backlineAccess", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
    ],


    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Rengar",
    image: "/champions/rengar.png",
    roles: ["jungle", "top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 59.66,
    },
  }),


  createChampion({
    id: "aurelion-sol",

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "wukong", score: 5 },
      { championId: "alistar", score: 5 },
      { championId: "malphite", score: 5 },
      { championId: "rakan", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "nautilus", score: 4 },
    ],

    offers: [
      { type: "scaling", strength: 5 },
      { type: "waveclear", strength: 4 },
      { type: "zoneControl", strength: 4 },
      { type: "sustainedDamage", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Aurelion Sol",
    image: "/champions/aurelion-sol.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 55.48,
    },
  }),


  createChampion({
    id: "olaf",

    synergyWith: [
      { championId: "yuumi", score: 5 },
      { championId: "lulu", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "zilean", score: 4 },
      { championId: "ivern", score: 4 },
      { championId: "renata-glasc", score: 3 },
      { championId: "senna", score: 3 },
    ],

    offers: [
      { type: "earlyPrio", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "dive", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Olaf",
    image: "/champions/olaf.png",
    roles: ["top"],
    damageProfile: ["AD", "TRUE"],
    stats: {
      picks: 13,
      bans: 36,
      presence: 49,
      prioScore: 59,
      wins: 8,
      losses: 5,
      proWinRate: 62,
      kda: 2.1,
      avgBanTurn: 4.2,
      avgPickRound: 1.69,
      blindPickRate: 92.3,
      averageGameTime: "34:20",
      csPerMinute: 8.1,
      damagePerMinute: 511,
      goldPerMinute: 377,
      csDiffAt15: -3.5,
      goldDiffAt15: -477,
      xpDiffAt15: -298,
      soloqKrChallengerWinRate: 61.9,
    },
  }),


  createChampion({
    id: "maokai",

    synergyWith: [
      { championId: "miss-fortune", score: 5 },
      { championId: "jayce", score: 5 },
      { championId: "xayah", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "yasuo", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "seraphine", score: 3 },
      { championId: "ziggs", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 4 },
      { type: "engage", strength: 4 },
      { type: "zoneControl", strength: 4 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

    name: "Maokai",
    image: "/champions/maokai.png",
    roles: ["jungle", "support"],
    damageProfile: ["AP"],
    stats: {
      picks: 4,
      bans: 8,
      presence: 12,
      prioScore: 13,
      wins: 0,
      losses: 4,
      proWinRate: 0,
      kda: 1.1,
      avgBanTurn: 7.1,
      avgPickRound: 2.75,
      blindPickRate: 0,
      averageGameTime: "30:14",
      csPerMinute: 6.2,
      damagePerMinute: 507,
      goldPerMinute: 363,
      csDiffAt15: -14.5,
      goldDiffAt15: -584,
      xpDiffAt15: -907,
      soloqKrChallengerWinRate: 56.69,
    },
  }),


  createChampion({
    id: "nidalee",

    // Fost mustWith (scor 3) — pereche fără sens real de „must” (DRAFT_REWORK §2.5).
    synergyWith: [
      { championId: "camille", score: 3 },
    ],

    offers: [
      { type: "poke", strength: 4 },
      { type: "earlyPrio", strength: 5 },
      { type: "roamPressure", strength: 4 },
      { type: "objectiveControl", strength: 3 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],

    playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

    name: "Nidalee",
    image: "/champions/nidalee.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 58.11,
    },
  }),

  createChampion({
    id: "lucian",

    synergyWith: [
      { championId: "yuumi", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "karma", score: 3 },
      { championId: "leona", score: 2 },
      { championId: "nautilus", score: 2 },
    ],

    offers: [
      { type: "earlyPrio", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "sustainedDamage", strength: 3 }
    ],

    needs: [
      { type: "peel", priority: 2 },
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

    name: "Lucian",
    image: "/champions/lucian.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 15,
      bans: 5,
      presence: 20,
      prioScore: 17,
      wins: 7,
      losses: 8,
      proWinRate: 47,
      kda: 3.2,
      avgBanTurn: 5,
      avgPickRound: 2.2,
      blindPickRate: 50,
      averageGameTime: "33:05",
      csPerMinute: 10.2,
      damagePerMinute: 818,
      goldPerMinute: 469,
      csDiffAt15: 8.5,
      goldDiffAt15: 216,
      xpDiffAt15: 172,
      soloqKrChallengerWinRate: 57.47,
    },
  }),


  createChampion({
    id: "irelia",

    synergyWith: [
      { championId: "sejuani", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "vi", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "yasuo", score: 3 },
      { championId: "leblanc", score: 3 },
      { championId: "nautilus", score: 3 },
    ],

    offers: [
      { type: "dive", strength: 4 },
      { type: "sideLanePressure", strength: 4 },
      { type: "splitpush", strength: 4 },
      { type: "backlineAccess", strength: 3 },
      { type: "sustainedDamage", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "poke", severity: 2 },
    ],

    playerScaling: { mec: 5, tfg: 3, con: 3, iq: 2 },

    name: "Irelia",
    image: "/champions/irelia.png",
    roles: ["top", "mid"],
    damageProfile: ["AD"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 1.7,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "25:10",
      csPerMinute: 10,
      damagePerMinute: 285,
      goldPerMinute: 415,
      csDiffAt15: 10,
      goldDiffAt15: 667,
      xpDiffAt15: -630,
      soloqKrChallengerWinRate: 53.01,
    },
  }),


  createChampion({
    id: "jinx",

    synergyWith: [
      { championId: "thresh", score: 5 },
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "renata-glasc", score: 4 },
      // Fost mustWith (scor 2) — pereche fără sens real de „must” (DRAFT_REWORK §2.5).
      { championId: "braum", score: 2 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "scaling", strength: 5 },
      { type: "siege", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 3 },
      { type: "peel", priority: 3 },
      { type: "engage", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "engage", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 5, clt: 3, con: 4 },

    name: "Jinx",
    image: "/champions/jinx.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 5.3,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "47:29",
      csPerMinute: 9.8,
      damagePerMinute: 1029,
      goldPerMinute: 459,
      csDiffAt15: -31,
      goldDiffAt15: -1025,
      xpDiffAt15: -1771,
      soloqKrChallengerWinRate: 56.21,
    },
  }),

  createChampion({
    id: "sejuani",

    synergyWith: [
      { championId: "yasuo", score: 5 },
      { championId: "yone", score: 5 },
      { championId: "sylas", score: 5 },
      { championId: "irelia", score: 4 },
      { championId: "akali", score: 4 },
      { championId: "leblanc", score: 4 },
      { championId: "jinx", score: 3 },
      { championId: "aphelios", score: 3 },
      { championId: "azir", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "gwen", score: 3 }
    ],

    offers: [
      { type: "frontline", strength: 4 },
      { type: "engage", strength: 4 },
      { type: "reliableCC", strength: 4 },
      { type: "followUp", strength: 3 }
    ],

    needs: [
      { type: "sustainedDamage", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

    name: "Sejuani",
    image: "/champions/sejuani.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
    stats: {
      picks: 5,
      bans: 0,
      presence: 5,
      prioScore: 4,
      wins: 1,
      losses: 4,
      proWinRate: 20,
      kda: 3.3,
      avgBanTurn: null,
      avgPickRound: 2.2,
      blindPickRate: 0,
      averageGameTime: "38:22",
      csPerMinute: 6,
      damagePerMinute: 362,
      goldPerMinute: 343,
      csDiffAt15: -7.4,
      goldDiffAt15: -546,
      xpDiffAt15: -457,
      soloqKrChallengerWinRate: 50,
    },
  }),


  createChampion({
    id: "pyke",

    synergyWith: [
      { championId: "mel", score: 3 },
      { championId: "samira", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "lucian", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "varus", score: 3 },
      { championId: "tristana", score: 3 },
      { championId: "kaisa", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "roamPressure", strength: 5 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 5, mac: 4, clt: 4, iq: 4 },

    name: "Pyke",
    image: "/champions/pyke.png",
    roles: ["support"],
    damageProfile: ["AD"],
    stats: {
      picks: 1,
      bans: 3,
      presence: 4,
      prioScore: 5,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1,
      avgBanTurn: 2.7,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "33:03",
      csPerMinute: 1.3,
      damagePerMinute: 164,
      goldPerMinute: 252,
      csDiffAt15: -4,
      goldDiffAt15: -631,
      xpDiffAt15: -657,
      soloqKrChallengerWinRate: 55.06,
    },
  }),


  createChampion({
    id: "kogmaw",

    synergyWith: [
      { championId: "nami", score: 5 },
      { championId: "tahm-kench", score: 3 },
      { championId: "janna", score: 4 }
    ],

    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "scaling", strength: 5 },
      { type: "siege", strength: 4 }
    ],

    needs: [
      { type: "peel", priority: 3 },
      { type: "frontline", priority: 3 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 4, clt: 4, con: 4 },

    name: "Kog'Maw",
    image: "/champions/kog'maw.png",
    roles: ["adc"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 3,
      bans: 1,
      presence: 4,
      prioScore: 3,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 3.2,
      avgBanTurn: 7,
      avgPickRound: 2.67,
      blindPickRate: 66.7,
      averageGameTime: "30:13",
      csPerMinute: 8.8,
      damagePerMinute: 1138,
      goldPerMinute: 445,
      csDiffAt15: 0.3,
      goldDiffAt15: 234,
      xpDiffAt15: -248,
      soloqKrChallengerWinRate: 56.98,
    },
  }),


  createChampion({
    id: "yorick",

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

    name: "Yorick",
    image: "/champions/yorick.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
  }),


  createChampion({
    id: "thresh",

    synergyWith: [
      { championId: "draven", score: 5 },
      { championId: "jhin", score: 5 },
      { championId: "caitlyn", score: 4 },
      { championId: "lucian", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "jinx", score: 3 },
      { championId: "varus", score: 3 },
      { championId: "tristana", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "peel", strength: 3 },
      { type: "reliableCC", strength: 4 },
      { type: "disengage", strength: 2 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],

    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Thresh",
    image: "/champions/thresh.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 58.57,
    },
  }),


  createChampion({
    id: "nunu",

    synergyWith: [
      { championId: "yasuo", score: 5 },
      { championId: "yone", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "veigar", score: 4 },
      { championId: "miss-fortune", score: 3 },
      { championId: "samira", score: 3 },
      { championId: "kennen", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 3 },
      { type: "objectiveControl", strength: 4 },
      { type: "frontline", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "earlyPrio", severity: 1 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Nunu",
    image: "/champions/nunu.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 54.9,
    },
  }),


  createChampion({
    id: "camille",

    synergyWith: [
      { championId: "galio", score: 5 },
      { championId: "taliyah", score: 5 },
      { championId: "twisted-fate", score: 5 },
      { championId: "nocturne", score: 4 },
      { championId: "shen", score: 4 },
      { championId: "sylas", score: 3 },
      { championId: "ahri", score: 3 },
      { championId: "leblanc", score: 3 },
    ],

    offers: [
      { type: "backlineAccess", strength: 5 },
      { type: "dive", strength: 5 },
      { type: "splitpush", strength: 4 },
      { type: "sideLanePressure", strength: 4 }
    ],

    needs: [
      { type: "engage", priority: 2 },
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
    ],

    playerScaling: { mec: 5, tfg: 3, clt: 3, con: 3 },

    name: "Camille",
    image: "/champions/camille.png",
    roles: ["top", "support"],
    damageProfile: ["AD", "TRUE"],
    stats: {
      picks: 10,
      bans: 10,
      presence: 20,
      prioScore: 21,
      wins: 5,
      losses: 5,
      proWinRate: 50,
      kda: 2.8,
      avgBanTurn: 7.5,
      avgPickRound: 1.9,
      blindPickRate: 50,
      averageGameTime: "32:00",
      csPerMinute: 6.9,
      damagePerMinute: 525,
      goldPerMinute: 393,
      csDiffAt15: -9.1,
      goldDiffAt15: -287,
      xpDiffAt15: -559,
      soloqKrChallengerWinRate: 55.22,
    },
  }),


  createChampion({
    id: "twisted-fate",

    synergyWith: [
      { championId: "camille", score: 5 },
      { championId: "jax", score: 5 },
      { championId: "renekton", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "pantheon", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "lee-sin", score: 3 },
      { championId: "elise", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 4 },
      { type: "roamPressure", strength: 5 },
      { type: "sideLanePressure", strength: 3 },
      { type: "waveclear", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],

    playerScaling: { mec: 4, mac: 4, con: 4, iq: 4 },

    name: "Twisted Fate",
    image: "/champions/twisted-fate.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 3,
      bans: 5,
      presence: 8,
      prioScore: 8,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 4.5,
      avgBanTurn: 9.2,
      avgPickRound: 3,
      blindPickRate: 33.3,
      averageGameTime: "32:38",
      csPerMinute: 8.6,
      damagePerMinute: 364,
      goldPerMinute: 431,
      csDiffAt15: 9,
      goldDiffAt15: 660,
      xpDiffAt15: 166,
      soloqKrChallengerWinRate: 55.97,
    },
  }),


  createChampion({
    id: "kindred",

    synergyWith: [
      { championId: "galio", score: 5 },
      { championId: "twisted-fate", score: 5 },
      { championId: "lissandra", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "thresh", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 4 },
      { type: "objectiveControl", strength: 4 },
      { type: "antiDive", strength: 3 },
      { type: "scaling", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 1 },
    ],

    playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

    name: "Kindred",
    image: "/champions/kindred.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 0,
      bans: 1,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 10,
      avgPickRound: null,
      blindPickRate: null,
      averageGameTime: null,
      csPerMinute: null,
      damagePerMinute: null,
      goldPerMinute: null,
      csDiffAt15: null,
      goldDiffAt15: null,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 57.09,
    },
  }),

  createChampion({
    id: "vayne",

    synergyWith: [
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "milio", score: 5 },
      { championId: "janna", score: 4 },
      { championId: "braum", score: 4 },
      { championId: "taric", score: 4 },
      { championId: "renata-glasc", score: 3 },
      { championId: "karma", score: 3 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 3 },
      { type: "peel", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "engage", severity: 1 },
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

    name: "Vayne",
    image: "/champions/vayne.png",
    roles: ["adc", "top"],
    damageProfile: ["AD", "TRUE"],
    stats: {
      picks: 1,
      bans: 9,
      presence: 10,
      prioScore: 12,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1,
      avgBanTurn: 8.2,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "47:09",
      csPerMinute: 7.7,
      damagePerMinute: 666,
      goldPerMinute: 346,
      csDiffAt15: -5,
      goldDiffAt15: 405,
      xpDiffAt15: -844,
      soloqKrChallengerWinRate: 57.79,
    },
  }),


  createChampion({
    id: "viego",

    synergyWith: [
      { championId: "galio", score: 5 },
      { championId: "lissandra", score: 5 },
      { championId: "twisted-fate", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 4 },
      { type: "dive", strength: 3 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "peel", severity: 2 }
    ],

    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Viego",
    image: "/champions/viego.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 55.74,
    },
  }),


  createChampion({
    id: "renata-glasc",

    synergyWith: [
      { championId: "aphelios", score: 5 },
      { championId: "jinx", score: 5 },
      { championId: "kogmaw", score: 5 },
      { championId: "vayne", score: 4 },
      { championId: "twitch", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "kaisa", score: 3 },
      { championId: "xayah", score: 3 },
    ],

    offers: [
      { type: "peel", strength: 4 },
      { type: "disengage", strength: 4 },
      { type: "antiDive", strength: 4 },
      { type: "followUp", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 2 }
    ],

    playerScaling: { mac: 4, tfg: 4, clt: 4, iq: 5 },

    name: "Renata Glasc",
    image: "/champions/renata-glasc.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 16,
      bans: 37,
      presence: 53,
      prioScore: 65,
      wins: 8,
      losses: 8,
      proWinRate: 50,
      kda: 3.5,
      avgBanTurn: 3.1,
      avgPickRound: 1.5,
      blindPickRate: 80,
      averageGameTime: "36:36",
      csPerMinute: 1.1,
      damagePerMinute: 166,
      goldPerMinute: 260,
      csDiffAt15: 1.3,
      goldDiffAt15: -93,
      xpDiffAt15: 157,
      soloqKrChallengerWinRate: 62.26,
    },
  }),


  createChampion({
    id: "tristana",

    synergyWith: [
      { championId: "leona", score: 5 },
      { championId: "nautilus", score: 5 },
      { championId: "rell", score: 5 },
      { championId: "alistar", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "blitzcrank", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "pyke", score: 3 },
    ],

    offers: [
      { type: "siege", strength: 4 },
      { type: "burstDamage", strength: 3 },
      { type: "scaling", strength: 3 },
      { type: "waveclear", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

    name: "Tristana",
    image: "/champions/tristana.png",
    roles: ["adc", "mid"],
    damageProfile: ["AD"],
    stats: {
      picks: 7,
      bans: 0,
      presence: 7,
      prioScore: 6,
      wins: 3,
      losses: 4,
      proWinRate: 43,
      kda: 3.4,
      avgBanTurn: null,
      avgPickRound: 1.86,
      blindPickRate: 14.3,
      averageGameTime: "31:46",
      csPerMinute: 10.6,
      damagePerMinute: 621,
      goldPerMinute: 486,
      csDiffAt15: 8,
      goldDiffAt15: 859,
      xpDiffAt15: 496,
      soloqKrChallengerWinRate: 60.51,
    },
  }),


  createChampion({
    id: "elise",

    synergyWith: [
      { championId: "draven", score: 5 },
      { championId: "caitlyn", score: 5 },
      { championId: "jhin", score: 3 },
      { championId: "varus", score: 3 }
    ],

    offers: [
      { type: "burstDamage", strength: 4 },
      { type: "pick", strength: 4 },
      { type: "poke", strength: 3 },
      { type: "zoneControl", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],

    playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

    name: "Elise",
    image: "/champions/elise.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 5,
      avgBanTurn: null,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "40:04",
      csPerMinute: 1.4,
      damagePerMinute: 288,
      goldPerMinute: 281,
      csDiffAt15: 4,
      goldDiffAt15: 731,
      xpDiffAt15: 208,
      soloqKrChallengerWinRate: 60.58,
    },
  }),


  createChampion({
    id: "zed",

    synergyWith: [
      { championId: "elise", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "reksai", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "pyke", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "nautilus", score: 3 },
    ],

    offers: [
      { type: "burstDamage", strength: 5 },
      { type: "backlineAccess", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 5, mac: 4, tfg: 3, iq: 4 },

    name: "Zed",
    image: "/champions/zed.png",
    roles: ["mid"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 60.15,
    },
  }),


  createChampion({
    id: "garen",

    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "sustainedDamage", strength: 3 },
      { type: "frontline", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Garen",
    image: "/champions/garen.png",
    roles: ["top"],
    damageProfile: ["AD", "TRUE"],
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
      soloqKrChallengerWinRate: 57.86,
    },
  }),


  createChampion({
    id: "miss-fortune",

    synergyWith: [
      { championId: "leona", score: 5 },
      { championId: "nautilus", score: 5 },
      { championId: "amumu", score: 5 },
      { championId: "rell", score: 4 },
      { championId: "alistar", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "malphite", score: 4 }
    ],

    offers: [
      { type: "scaling", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "earlyPrio", strength: 3 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

    name: "Miss Fortune",
    image: "/champions/miss-fortune.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 5,
      bans: 0,
      presence: 5,
      prioScore: 4,
      wins: 2,
      losses: 3,
      proWinRate: 40,
      kda: 3.2,
      avgBanTurn: null,
      avgPickRound: 2.2,
      blindPickRate: 20,
      averageGameTime: "34:06",
      csPerMinute: 10.1,
      damagePerMinute: 672,
      goldPerMinute: 496,
      csDiffAt15: -2.2,
      goldDiffAt15: 164,
      xpDiffAt15: 170,
      soloqKrChallengerWinRate: 55.26,
    },
  }),


  createChampion({
    id: "hwei",

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "sejuani", score: 5 },
      { championId: "rell", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "ornn", score: 3 },
      { championId: "maokai", score: 3 },
      { championId: "malphite", score: 3 },
    ],

    offers: [
      { type: "waveclear", strength: 5 },
      { type: "poke", strength: 4 },
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
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Hwei",
    image: "/champions/hwei.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.2,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "27:26",
      csPerMinute: 9.1,
      damagePerMinute: 576,
      goldPerMinute: 347,
      csDiffAt15: -10,
      goldDiffAt15: -1438,
      xpDiffAt15: -753,
      soloqKrChallengerWinRate: 52.85,
    },
  }),


  createChampion({
    id: "volibear",

    synergyWith: [
      { championId: "orianna", score: 5 },
      { championId: "syndra", score: 5 },
      { championId: "leblanc", score: 4 },
      { championId: "twisted-fate", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "dive", strength: 4 },
      { type: "engage", strength: 4 },
      { type: "pick", strength: 4 },
      { type: "backlineAccess", strength: 3 },
      { type: "earlyPrio", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Volibear",
    image: "/champions/volibear.png",
    roles: ["jungle", "top"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 1,
      bans: 1,
      presence: 2,
      prioScore: 2,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 10,
      avgBanTurn: 10,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "34:09",
      csPerMinute: 9.7,
      damagePerMinute: 586,
      goldPerMinute: 443,
      csDiffAt15: 20,
      goldDiffAt15: 718,
      xpDiffAt15: 1011,
      soloqKrChallengerWinRate: 57.75,
    },
  }),


  createChampion({
    id: "yuumi",

    synergyWith: [
      { championId: "zeri", score: 5 },
      { championId: "sivir", score: 5 },
      { championId: "kogmaw", score: 4 },
      { championId: "vayne", score: 4 },
      { championId: "twitch", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "kaisa", score: 3 },
      { championId: "ezreal", score: 3 },
    ],

    offers: [
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 4 },
      { type: "disengage", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 2 },
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "siege", severity: 2 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Yuumi",
    image: "/champions/yuumi.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 3,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 11.7,
      avgBanTurn: null,
      avgPickRound: 1.67,
      blindPickRate: 0,
      averageGameTime: "32:40",
      csPerMinute: 0.4,
      damagePerMinute: 311,
      goldPerMinute: 268,
      csDiffAt15: -10,
      goldDiffAt15: 95,
      xpDiffAt15: 446,
      soloqKrChallengerWinRate: 44.85,
    },
  }),


  createChampion({
    id: "graves",

    synergyWith: [
      { championId: "renekton", score: 5 },
      { championId: "leblanc", score: 5 },
      { championId: "lucian", score: 4 },
      { championId: "syndra", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
    ],
    offers: [
      { type: "earlyPrio", strength: 4 },
      { type: "objectiveControl", strength: 4 },
      { type: "burstDamage", strength: 3 },
      { type: "sustainedDamage", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 1 },
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "scaling", severity: 1 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 1 }
    ],

    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Graves",
    image: "/champions/graves.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 58.55,
    },
  }),


  createChampion({
    id: "zeri",

    synergyWith: [
      { championId: "milio", score: 4 },
      { championId: "renata-glasc", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "rakan", score: 3 },
      { championId: "maokai", score: 3 },
      { championId: "sejuani", score: 3 },
    ],

    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "scaling", strength: 5 },
      { type: "poke", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 3 },
      { type: "peel", priority: 3 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

    name: "Zeri",
    image: "/champions/zeri.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 3,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 3.3,
      avgBanTurn: null,
      avgPickRound: 1.67,
      blindPickRate: 0,
      averageGameTime: "32:40",
      csPerMinute: 10.9,
      damagePerMinute: 726,
      goldPerMinute: 506,
      csDiffAt15: 3,
      goldDiffAt15: 305,
      xpDiffAt15: -219,
      soloqKrChallengerWinRate: 61.17,
    },
  }),


  createChampion({
    id: "milio",

    synergyWith: [
      { championId: "jinx", score: 5 },
      { championId: "zeri", score: 5 },
      { championId: "kogmaw", score: 4 },
      { championId: "twitch", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "tristana", score: 3 }
    ],

    offers: [
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 4 },
      { type: "disengage", strength: 4 },
      { type: "scaling", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 }
    ],

    playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

    name: "Milio",
    image: "/champions/milio.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 12,
      bans: 0,
      presence: 12,
      prioScore: 9,
      wins: 5,
      losses: 7,
      proWinRate: 42,
      kda: 6.4,
      avgBanTurn: null,
      avgPickRound: 2.25,
      blindPickRate: 45.5,
      averageGameTime: "32:16",
      csPerMinute: 1,
      damagePerMinute: 131,
      goldPerMinute: 261,
      csDiffAt15: -3,
      goldDiffAt15: 167,
      xpDiffAt15: 98,
      soloqKrChallengerWinRate: 53.13,
    },
  }),


  createChampion({
    id: "gragas",

    synergyWith: [
      { championId: "yasuo", score: 5 },
      { championId: "orianna", score: 5 },
      { championId: "diana", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "miss-fortune", score: 3 },
      { championId: "samira", score: 3 },
      { championId: "kaisa", score: 3 },
    ],

    offers: [
      { type: "disengage", strength: 5 },
      { type: "engage", strength: 3 },
      { type: "burstDamage", strength: 3 },
      { type: "frontline", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 }
    ],


    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Gragas",
    image: "/champions/gragas.png",
    roles: ["top"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 57.92,
    },
  }),


  createChampion({
    id: "reksai",

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

    name: "Rek'Sai",
    image: "/champions/rek'sai.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
  }),


  createChampion({
    id: "draven",

    synergyWith: [
      { championId: "nautilus", score: 5 },
      { championId: "leona", score: 5 },
      { championId: "blitzcrank", score: 4 },
      { championId: "pyke", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "pantheon", score: 3 },
    ],
    offers: [
      { type: "earlyPrio", strength: 5 },
      { type: "sustainedDamage", strength: 5 },
      { type: "burstDamage", strength: 4 },
      { type: "objectiveControl", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "peel", severity: 2 }
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

    name: "Draven",
    image: "/champions/draven.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 1,
      bans: 5,
      presence: 6,
      prioScore: 8,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 7,
      avgBanTurn: 7.4,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "30:14",
      csPerMinute: 10,
      damagePerMinute: 444,
      goldPerMinute: 504,
      csDiffAt15: -11,
      goldDiffAt15: -280,
      xpDiffAt15: 50,
      soloqKrChallengerWinRate: 55.06,
    },
  }),


  createChampion({
    id: "smolder",

    synergyWith: [
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "milio", score: 4 },
      { championId: "renata-glasc", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "karma", score: 3 },
      { championId: "maokai", score: 3 },
      { championId: "sejuani", score: 3 },
    ],

    offers: [
      { type: "scaling", strength: 5 },
      { type: "poke", strength: 3 },
      { type: "waveclear", strength: 4 },
      { type: "sustainedDamage", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 4, con: 4, iq: 4 },

    name: "Smolder",
    image: "/champions/smolder.png",
    roles: ["adc", "mid"],
    damageProfile: ["AD", "TRUE"],
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
      soloqKrChallengerWinRate: 59.49,
    },
  }),


  createChampion({
    id: "kalista",

    synergyWith: [
      { championId: "renata-glasc", score: 5 },
      { championId: "nautilus", score: 5 },
      { championId: "leona", score: 5 },
      { championId: "alistar", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "blitzcrank", score: 3 },
      { championId: "thresh", score: 3 },
      { championId: "taric", score: 3 },
    ],

    offers: [
      { type: "earlyPrio", strength: 5 },
      { type: "objectiveControl", strength: 4 },
      { type: "followUp", strength: 3 },
      { type: "engage", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "scaling", severity: 1 },
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 3, con: 4 },

    name: "Kalista",
    image: "/champions/kalista.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 16,
      bans: 2,
      presence: 18,
      prioScore: 19,
      wins: 8,
      losses: 8,
      proWinRate: 50,
      kda: 3,
      avgBanTurn: 7,
      avgPickRound: 1.5,
      blindPickRate: 66.7,
      averageGameTime: "36:36",
      csPerMinute: 10.2,
      damagePerMinute: 548,
      goldPerMinute: 471,
      csDiffAt15: -0.7,
      goldDiffAt15: -278,
      xpDiffAt15: -324,
      soloqKrChallengerWinRate: 52.87,
    },
  }),
  createChampion({
    id: "blitzcrank",

    synergyWith: [
      { championId: "draven", score: 5 },
      { championId: "samira", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "miss-fortune", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "tristana", score: 3 },
      { championId: "caitlyn", score: 3 },
      { championId: "twitch", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "reliableCC", strength: 4 },
      { type: "roamPressure", strength: 2 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],


    playerScaling: { mec: 3, mac: 4, clt: 4, iq: 4 },

    name: "Blitzcrank",
    image: "/champions/blitzcrank.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 57.25,
    },
  }),


  createChampion({
    id: "diana",

    synergyWith: [
      { championId: "yasuo", score: 5 },
      { championId: "malphite", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "yone", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 4 },
      { type: "followUp", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "dive", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Diana",
    image: "/champions/diana.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.8,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "25:10",
      csPerMinute: 8.5,
      damagePerMinute: 436,
      goldPerMinute: 378,
      csDiffAt15: -9,
      goldDiffAt15: -1977,
      xpDiffAt15: -684,
      soloqKrChallengerWinRate: 52.38,
    },
  }),


  createChampion({
    id: "veigar",

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

    name: "Veigar",
    image: "/champions/veigar.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
  }),


  createChampion({
    id: "kled",

    synergyWith: [
      { championId: "twisted-fate", score: 5 },
      { championId: "taliyah", score: 5 },
      { championId: "nocturne", score: 4 },
      { championId: "pantheon", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "engage", strength: 4 },
      { type: "sideLanePressure", strength: 4 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Kled",
    image: "/champions/kled.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 3,
      bans: 1,
      presence: 4,
      prioScore: 4,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 3,
      avgBanTurn: 8,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "37:58",
      csPerMinute: 7.6,
      damagePerMinute: 424,
      goldPerMinute: 362,
      csDiffAt15: -4.7,
      goldDiffAt15: 123,
      xpDiffAt15: -108,
      soloqKrChallengerWinRate: 57.02,
    },
  }),


  createChampion({
    id: "sett",

    synergyWith: [
      { championId: "sejuani", score: 5 },
      { championId: "maokai", score: 5 },
      { championId: "vi", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
    ],
    offers: [
      { type: "frontline", strength: 3 },
      { type: "engage", strength: 3 },
      { type: "reliableCC", strength: 3 },
      { type: "antiDive", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],
    needs: [
      { type: "followUp", priority: 1 },
      { type: "backlineAccess", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 }
    ],

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Sett",
    image: "/champions/sett.png",
    roles: ["top"],
    damageProfile: ["AD", "TRUE"],
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
      soloqKrChallengerWinRate: 51.18,
    },
  }),


  createChampion({
    id: "vex",

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "vi", score: 5 },
      { championId: "sejuani", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 },
    ],
    offers: [
      { type: "burstDamage", strength: 4 },
      { type: "antiDive", strength: 4 },
      { type: "pick", strength: 3 },
      { type: "followUp", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 }
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Vex",
    image: "/champions/vex.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 63.5,
    },
  }),


  createChampion({
    id: "shen",

    synergyWith: [
      { championId: "nocturne", score: 5 },
      { championId: "twisted-fate", score: 5 },
      { championId: "galio", score: 5 },
      { championId: "taliyah", score: 4 },
      { championId: "lee-sin", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "tristana", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 4 },
      { type: "antiDive", strength: 4 },
      { type: "sideLanePressure", strength: 3 },
      { type: "followUp", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 3 }
    ],

    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "engage", severity: 1 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Shen",
    image: "/champions/shen.png",
    roles: ["support", "top"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 7,
      bans: 1,
      presence: 8,
      prioScore: 8,
      wins: 2,
      losses: 5,
      proWinRate: 29,
      kda: 2.9,
      avgBanTurn: 9,
      avgPickRound: 2.14,
      blindPickRate: 28.6,
      averageGameTime: "30:52",
      csPerMinute: 5.1,
      damagePerMinute: 297,
      goldPerMinute: 313,
      csDiffAt15: -11.6,
      goldDiffAt15: -194,
      xpDiffAt15: -346,
      soloqKrChallengerWinRate: 54.06,
    },
  }),


  createChampion({
    id: "darius",

    synergyWith: [
      { championId: "sejuani", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "maokai", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "thresh", score: 3 },
    ],

    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "frontline", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Darius",
    image: "/champions/darius.png",
    roles: ["top"],
    damageProfile: ["AD", "TRUE"],
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
      soloqKrChallengerWinRate: 59.86,
    },
  }),


  createChampion({
    id: "kayle",

    synergyWith: [
      { championId: "ivern", score: 5 },
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "milio", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "maokai", score: 3 },
      { championId: "ornn", score: 3 },
    ],

    offers: [
      { type: "scaling", strength: 5 },
      { type: "sustainedDamage", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 3 },
      { type: "peel", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "engage", severity: 1 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Kayle",
    image: "/champions/kayle.png",
    roles: ["top"],
    damageProfile: ["AD", "AP", "TRUE"],
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
      soloqKrChallengerWinRate: 62.87,
    },
  }),


  createChampion({
    id: "khazix",

    synergyWith: [
      { championId: "pyke", score: 5 },
      { championId: "nautilus", score: 5 },
      { championId: "leona", score: 5 },
      { championId: "rakan", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "orianna", score: 5 },
      { championId: "qiyana", score: 4 },
      { championId: "shen", score: 4 }
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "burstDamage", strength: 5 },
      { type: "backlineAccess", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
    ],

    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Kha'Zix",
    image: "/champions/kha'zix.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 0,
      bans: 2,
      presence: 2,
      prioScore: 3,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 7,
      avgPickRound: null,
      blindPickRate: null,
      averageGameTime: null,
      csPerMinute: null,
      damagePerMinute: null,
      goldPerMinute: null,
      csDiffAt15: null,
      goldDiffAt15: null,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 54.55,
    },
  }),

  createChampion({
    id: "mordekaiser",

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "sejuani", score: 5 },
      { championId: "vi", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "taliyah", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
    ],

    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "frontline", strength: 2 }
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

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Mordekaiser",
    image: "/champions/mordekaiser.png",
    roles: ["top"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 51.52,
    },
  }),


  createChampion({
    id: "zilean",

    synergyWith: [
      { championId: "olaf", score: 5 },
      { championId: "darius", score: 5 },
      { championId: "caitlyn", score: 4 },
      { championId: "volibear", score: 4 },
      { championId: "vayne", score: 4 },
      { championId: "zeri", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "kaisa", score: 3 },
    ],

    offers: [
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 4 },
      { type: "disengage", strength: 4 }
    ],

    needs: [
      { type: "engage", priority: 2 },
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "siege", severity: 2 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Zilean",
    image: "/champions/zilean.png",
    roles: ["support", "mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 60.66,
    },
  }),

  createChampion({
    id: "morgana",

    synergyWith: [
      { championId: "caitlyn", score: 5 },
      { championId: "jinx", score: 5 },
      { championId: "varus", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "ashe", score: 3 },
      { championId: "miss-fortune", score: 3 },
      { championId: "aphelios", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 4 },
      { type: "antiDive", strength: 4 },
      { type: "zoneControl", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Morgana",
    image: "/champions/morgana.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 51.7,
    },
  }),


  createChampion({
    id: "fiora",

    synergyWith: [
      { championId: "sejuani", score: 5 },
      { championId: "braum", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "twisted-fate", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "galio", score: 3 },
    ],

    offers: [
      { type: "splitpush", strength: 5 },
      { type: "sideLanePressure", strength: 5 },
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

    playerScaling: { mec: 5, tfg: 3, clt: 3, con: 3 },

    name: "Fiora",

    image: "/champions/fiora.png",
    roles: ["top"],
    damageProfile: ["AD", "TRUE"],
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
      soloqKrChallengerWinRate: 58.22,
    },
  }),


  createChampion({
    id: "kassadin",

    synergyWith: [
      { championId: "sejuani", score: 5 },
      { championId: "maokai", score: 5 },
      { championId: "ivern", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "renata-glasc", score: 3 },
    ],

    offers: [
      { type: "scaling", strength: 5 },
      { type: "backlineAccess", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Kassadin",
    image: "/champions/kassadin.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 54.52,
    },
  }),


  createChampion({
    id: "riven",

    synergyWith: [
      { championId: "nidalee", score: 5 },
      { championId: "yasuo", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "yone", score: 3 },
      { championId: "irelia", score: 3 },
    ],

    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "splitpush", strength: 4 },
      { type: "sustainedDamage", strength: 3 }
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


    playerScaling: { mec: 5, tfg: 3, con: 3, iq: 2 },

    name: "Riven",
    image: "/champions/riven.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 56.31,
    },
  }),


  createChampion({
    id: "singed",
    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "engage", strength: 3 },
      { type: "disengage", strength: 3 },
      { type: "zoneControl", strength: 3 },
      { type: "frontline", strength: 2 }
    ],
    needs: [
      { type: "followUp", priority: 1 },
      { type: "sustainedDamage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 1 }
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Singed",
    image: "/champions/singed.png",
    roles: ["top"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 58.2,
    },
  }),


  createChampion({
    id: "soraka",

    synergyWith: [
      { championId: "jinx", score: 5 },
      { championId: "kogmaw", score: 5 },
      { championId: "vayne", score: 5 },
      { championId: "aphelios", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "yunara", score: 4 },
      { championId: "varus", score: 3 },
      { championId: "ezreal", score: 3 },
    ],

    offers: [
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 4 },
      { type: "disengage", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 2 },
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "siege", severity: 2 },
    ],

    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Soraka",
    image: "/champions/soraka.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 59.45,
    },
  }),


  createChampion({
    id: "swain",

    synergyWith: [
      { championId: "amumu", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "sejuani", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 3 },
      { type: "sustainedDamage", strength: 4 },
      { type: "zoneControl", strength: 3 }
    ],

    needs: [
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 4, con: 3, iq: 4 },

    name: "Swain",
    image: "/champions/swain.png",
    roles: ["mid", "top"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: null,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "26:12",
      csPerMinute: 9.4,
      damagePerMinute: 876,
      goldPerMinute: 393,
      csDiffAt15: -2,
      goldDiffAt15: 282,
      xpDiffAt15: -584,
      soloqKrChallengerWinRate: 60.61,
    },
  }),


  createChampion({
    id: "warwick",
    offers: [
      { type: "pick", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "frontline", strength: 2 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Warwick",
    image: "/champions/warwick.png",
    roles: ["top", "jungle"],
    damageProfile: ["AD", "AP"],
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
      soloqKrChallengerWinRate: 51.7,
    },
  }),


  createChampion({
    id: "zyra",

    offers: [
      { type: "zoneControl", strength: 5 },
      { type: "objectiveControl", strength: 4 },
      { type: "poke", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 1 },
    ],


    playerScaling: { mac: 4, tfg: 4, con: 3, iq: 4 },

    name: "Zyra",
    image: "/champions/zyra.png",
    roles: ["support", "jungle"],
    damageProfile: ["AP"],
    stats: {
      picks: 0,
      bans: 1,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 7,
      avgPickRound: null,
      blindPickRate: null,
      averageGameTime: null,
      csPerMinute: null,
      damagePerMinute: null,
      goldPerMinute: null,
      csDiffAt15: null,
      goldDiffAt15: null,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 58.29,
    },
  }),


  createChampion({
    id: "senna",

    synergyWith: [
      { championId: "nautilus", score: 5 },
      { championId: "taric", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "tahm-kench", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "xin-zhao", score: 3 },
      { championId: "sejuani", score: 3 },
    ],

    offers: [
      { type: "poke", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],


    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Senna",
    image: "/champions/senna.png",
    roles: ["support", "adc"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 56.57,
    },
  }),


  createChampion({
    id: "lillia",
    offers: [
      { type: "sustainedDamage", strength: 4 },
      { type: "zoneControl", strength: 3 },
      { type: "objectiveControl", strength: 3 },
      { type: "scaling", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 2 },
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 1 }
    ],


    playerScaling: { mec: 4, mac: 4, tfg: 4, iq: 4 },

    name: "Lillia",
    image: "/champions/lillia.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.8,
      avgBanTurn: null,
      avgPickRound: 5,
      blindPickRate: 0,
      averageGameTime: "31:21",
      csPerMinute: 8.3,
      damagePerMinute: 420,
      goldPerMinute: 349,
      csDiffAt15: 10,
      goldDiffAt15: -141,
      xpDiffAt15: -105,
      soloqKrChallengerWinRate: 48.02,
    },
  }),


  createChampion({
    id: "skarner",

    synergyWith: [
      { championId: "seraphine", score: 5 },
      { championId: "yone", score: 5 },
      { championId: "miss-fortune", score: 4 },
      { championId: "samira", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "swain", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 4 },
      { type: "pick", strength: 5 },
      { type: "reliableCC", strength: 5 },
      { type: "engage", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Skarner",
    image: "/champions/skarner.png",
    roles: ["jungle"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 4,
      bans: 10,
      presence: 14,
      prioScore: 16,
      wins: 1,
      losses: 3,
      proWinRate: 25,
      kda: 2.1,
      avgBanTurn: 7.6,
      avgPickRound: 2.25,
      blindPickRate: 0,
      averageGameTime: "32:55",
      csPerMinute: 6.4,
      damagePerMinute: 319,
      goldPerMinute: 340,
      csDiffAt15: -11.5,
      goldDiffAt15: -446,
      xpDiffAt15: -554,
      soloqKrChallengerWinRate: 50.2,
    },
  }),


  createChampion({
    id: "ziggs",

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "amumu", score: 5 },
      { championId: "rell", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "orianna", score: 3 },
    ],

    offers: [
      { type: "poke", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "siege", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "waveclear", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

    name: "Ziggs",
    image: "/champions/ziggs.png",
    roles: ["adc", "mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 5,
      bans: 1,
      presence: 6,
      prioScore: 5,
      wins: 1,
      losses: 4,
      proWinRate: 20,
      kda: 1.7,
      avgBanTurn: 8,
      avgPickRound: 2.8,
      blindPickRate: 60,
      averageGameTime: "31:44",
      csPerMinute: 9.8,
      damagePerMinute: 633,
      goldPerMinute: 411,
      csDiffAt15: 2.8,
      goldDiffAt15: -258,
      xpDiffAt15: 145,
      soloqKrChallengerWinRate: 59.75,
    },
  }),


  createChampion({
    id: "illaoi",
    offers: [
      { type: "sideLanePressure", strength: 5 },
      { type: "splitpush", strength: 4 },
      { type: "sustainedDamage", strength: 4 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Illaoi",
    image: "/champions/illaoi.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 51.2,
    },
  }),


  createChampion({
    id: "lissandra",

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "sejuani", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "miss-fortune", score: 3 },
      { championId: "samira", score: 3 },
      { championId: "kaisa", score: 3 },
    ],

    offers: [
      { type: "pick", strength: 4 },
      { type: "followUp", strength: 4 },
      { type: "waveclear", strength: 3 },
      { type: "reliableCC", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "disengage", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Lissandra",
    image: "/champions/lissandra.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 2,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 2.5,
      avgBanTurn: null,
      avgPickRound: 1.5,
      blindPickRate: 0,
      averageGameTime: "27:34",
      csPerMinute: 9.2,
      damagePerMinute: 516,
      goldPerMinute: 401,
      csDiffAt15: 18,
      goldDiffAt15: 702,
      xpDiffAt15: 636,
      soloqKrChallengerWinRate: 55.49,
    },
  }),

  createChampion({
    id: "tryndamere",
    offers: [
      { type: "splitpush", strength: 5 },
      { type: "sideLanePressure", strength: 5 },
      { type: "sustainedDamage", strength: 4 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Tryndamere",
    image: "/champions/tryndamere.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 50.8,
    },
  }),


  createChampion({
    id: "xerath",
    offers: [
      { type: "poke", strength: 5 },
      { type: "siege", strength: 4 },
      { type: "waveclear", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Xerath",
    image: "/champions/xerath.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 57.04,
    },
  }),


  createChampion({
    id: "samira",
    synergyWith: [
      { championId: "alistar", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "rell", score: 4 }
    ],

    offers: [
      { type: "dive", strength: 4 },
      { type: "followUp", strength: 4 },
      { type: "burstDamage", strength: 3 },
      { type: "sustainedDamage", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 3 },
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

    name: "Samira",
    image: "/champions/samira.png",
    roles: ["adc"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 56.83,
    },
  }),


  createChampion({
    id: "gangplank",

    offers: [
      { type: "waveclear", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "sideLanePressure", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 2 },

    name: "Gangplank",
    image: "/champions/gangplank.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 57.35,
    },
  }),
  createChampion({
    id: "vladimir",

    synergyWith: [
      { championId: "skarner", score: 5 },
      { championId: "thresh", score: 5 },
      { championId: "nami", score: 5 },
      { championId: "reksai", score: 4 },
      { championId: "sivir", score: 4 },
      { championId: "kalista", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "rumble", score: 4 },
    ],

    offers: [
      { type: "scaling", strength: 5 },
      { type: "sustainedDamage", strength: 4 },
      { type: "backlineAccess", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Vladimir",
    image: "/champions/vladimir.png",
    roles: ["mid", "top"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 56.55,
    },
  }),


  createChampion({
    id: "fiddlesticks",
    offers: [
      { type: "engage", strength: 4 },
      { type: "followUp", strength: 5 },
      { type: "zoneControl", strength: 3 },
      { type: "burstDamage", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 5, iq: 4 },

    name: "Fiddlesticks",
    image: "/champions/fiddlesticks.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 57.72,
    },
  }),
  createChampion({
    id: "amumu",
    offers: [
      { type: "engage", strength: 5 },
      { type: "followUp", strength: 5 },
      { type: "reliableCC", strength: 4 },
      { type: "frontline", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 5, iq: 4 },

    name: "Amumu",
    image: "/champions/amumu.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 50.4,
    },
  }),
  createChampion({
    id: "brand",
    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "objectiveControl", strength: 4 },
      { type: "zoneControl", strength: 4 },
      { type: "poke", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 1 },
      { type: "reliableCC", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "earlyPrio", severity: 1 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 }
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 4, iq: 4 },

    name: "Brand",
    image: "/champions/brand.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 51.3,
    },
  }),
  createChampion({
    id: "chogath",

    synergyWith: [
      { championId: "janna", score: 4 },
      { championId: "xayah", score: 5 },
      { championId: "rakan", score: 5 },
      { championId: "zac", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "cassiopeia", score: 4 },
      { championId: "ashe", score: 4 },
      { championId: "vi", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 5 },
      { type: "pick", strength: 3 },
      { type: "zoneControl", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Cho'Gath",
    image: "/champions/cho'gath.png",
    roles: ["top", "jungle", "mid"],
    damageProfile: ["AP", "TRUE"],
    stats: {
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 1,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 3,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "35:26",
      csPerMinute: 7.1,
      damagePerMinute: 414,
      goldPerMinute: 392,
      csDiffAt15: -10,
      goldDiffAt15: -630,
      xpDiffAt15: -488,
      soloqKrChallengerWinRate: 53.39,
    },
  }),
  createChampion({
    id: "evelynn",
    offers: [
      { type: "pick", strength: 5 },
      { type: "burstDamage", strength: 5 },
      { type: "backlineAccess", strength: 4 },
      { type: "roamPressure", strength: 4 }
    ],
    needs: [
      { type: "frontline", priority: 2 },
      { type: "reliableCC", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "earlyPrio", severity: 3 },
      { exposedTo: "objectiveControl", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "antiDive", severity: 2 }
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Evelynn",
    image: "/champions/evelynn.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
  }),
  createChampion({
    id: "fizz",
    offers: [
      { type: "burstDamage", strength: 5 },
      { type: "backlineAccess", strength: 4 },
      { type: "pick", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Fizz",
    image: "/champions/fizz.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 53.73,
    },
  }),
  createChampion({
    id: "hecarim",
    offers: [
      { type: "engage", strength: 4 },
      { type: "dive", strength: 4 },
      { type: "backlineAccess", strength: 4 },
      { type: "objectiveControl", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],
    needs: [
      { type: "followUp", priority: 2 },
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "earlyPrio", severity: 1 }
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Hecarim",
    image: "/champions/hecarim.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 58.82,
    },
  }),
  createChampion({
    id: "heimerdinger",

    synergyWith: [
      { championId: "ezreal", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "tristana", score: 4 },
      { championId: "trundle", score: 3 },
      { championId: "jayce", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "sivir", score: 3 },
      { championId: "varus", score: 3 },
    ],

    offers: [
      { type: "zoneControl", strength: 5 },
      { type: "siege", strength: 4 },
      { type: "waveclear", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "engage", severity: 2 },
    ],


    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Heimerdinger",
    image: "/champions/heimerdinger.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 49.7,
    },
  }),
  createChampion({
    id: "janna",

    synergyWith: [
      { championId: "corki", score: 5 },     // extrem de mare winrate (probabil sample mic dar clar best)
      { championId: "sivir", score: 5 },
      { championId: "lucian", score: 4 },
      { championId: "jinx", score: 4 },
      { championId: "kogmaw", score: 4 },
      { championId: "twitch", score: 4 },
      { championId: "aphelios", score: 3 },
      { championId: "xayah", score: 2 },
    ],
    offers: [
      { type: "disengage", strength: 5 },
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 5 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 2 }
    ],


    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Janna",
    image: "/champions/janna.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 55.58,
    },
  }),
  createChampion({
    id: "karthus",
    offers: [
      { type: "scaling", strength: 5 },
      { type: "sustainedDamage", strength: 5 },
      { type: "objectiveControl", strength: 4 },
      { type: "zoneControl", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 2 },
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "earlyPrio", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "engage", severity: 1 }
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Karthus",
    image: "/champions/karthus.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 53.73,
    },
  }),
  createChampion({
    id: "katarina",
    offers: [
      { type: "backlineAccess", strength: 5 },
      { type: "burstDamage", strength: 5 },
      { type: "dive", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "followUp", strength: 4 }
    ],
    needs: [
      { type: "engage", priority: 2 },
      { type: "reliableCC", priority: 2 },
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "antiDive", severity: 3 },
      { exposedTo: "peel", severity: 3 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 }
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Katarina",
    image: "/champions/katarina.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 60.61,
    },
  }),
  createChampion({
    id: "malzahar",

    synergyWith: [
      { championId: "gangplank", score: 5 },
      { championId: "gragas", score: 5 },
      { championId: "jhin", score: 5 },
      { championId: "khazix", score: 4 },
      { championId: "alistar", score: 4 },
      { championId: "reksai", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "taric", score: 4 },
    ],

    offers: [
      { type: "pick", strength: 5 },
      { type: "reliableCC", strength: 5 },
      { type: "waveclear", strength: 4 },
      { type: "zoneControl", strength: 3 },
      { type: "antiDive", strength: 2 }
    ],

    needs: [
      { type: "followUp", priority: 2 },
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "waveclear", severity: 1 }
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Malzahar",
    image: "/champions/malzahar.png",
    roles: ["mid"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 56.73,
    },
  }),
  createChampion({
    id: "master-yi",
    offers: [
      { type: "sustainedDamage", strength: 5 },
      { type: "scaling", strength: 4 },
      { type: "objectiveControl", strength: 4 },
      { type: "dive", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 2 },
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "antiDive", severity: 3 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "earlyPrio", severity: 1 }
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Master Yi",
    image: "/champions/master-yi.png",
    roles: ["jungle"],
    damageProfile: ["AD", "TRUE"],
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
      soloqKrChallengerWinRate: 58.81,
    },
  }),
  createChampion({
    id: "nasus",
    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "scaling", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "frontline", strength: 3 }
    ],
    needs: [
      { type: "engage", priority: 2 },
      { type: "peel", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "earlyPrio", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "disengage", severity: 2 }
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Nasus",
    image: "/champions/nasus.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1.3,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "27:24",
      csPerMinute: 6.9,
      damagePerMinute: 238,
      goldPerMinute: 327,
      csDiffAt15: -25,
      goldDiffAt15: -1215,
      xpDiffAt15: -1766,
      soloqKrChallengerWinRate: 51.22,
    },
  }),
  createChampion({
    id: "quinn",

    synergyWith: [
      { championId: "thresh", score: 5 },
      { championId: "twisted-fate", score: 5 },
      { championId: "leblanc", score: 5 },
      { championId: "alistar", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "nidalee", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "kaisa", score: 4 },
    ],

    offers: [
      { type: "roamPressure", strength: 5 },
      { type: "sideLanePressure", strength: 4 },
      { type: "earlyPrio", strength: 4 },
      { type: "pick", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "engage", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 2 },
      { exposedTo: "scaling", severity: 2 },
      { exposedTo: "poke", severity: 1 }
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Quinn",
    image: "/champions/quinn.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 55.28,
    },
  }),
  createChampion({
    id: "rammus",
    offers: [
      { type: "frontline", strength: 5 },
      { type: "antiDive", strength: 4 },
      { type: "engage", strength: 3 }
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


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Rammus",
    image: "/champions/rammus.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 52.6,
    },
  }),
  createChampion({
    id: "shaco",
    offers: [
      { type: "pick", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "zoneControl", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Shaco",
    image: "/champions/shaco.png",
    roles: ["jungle"],
    damageProfile: ["AD", "AP"],
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
      soloqKrChallengerWinRate: 64.69,
    },
  }),
  createChampion({
    id: "shyvana",
    offers: [
      { type: "scaling", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Shyvana",
    image: "/champions/shyvana.png",
    roles: ["jungle"],
    damageProfile: ["AD", "AP"],
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
      soloqKrChallengerWinRate: 46.3,
    },
  }),
  createChampion({
    id: "sona",
    offers: [
      { type: "scaling", strength: 4 },
      { type: "poke", strength: 3 },
      { type: "peel", strength: 3 },
      { type: "followUp", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],


    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Sona",
    image: "/champions/sona.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 59.47,
    },
  }),
  createChampion({
    id: "talon",
    offers: [
      { type: "roamPressure", strength: 5 },
      { type: "burstDamage", strength: 5 },
      { type: "backlineAccess", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Talon",
    image: "/champions/talon.png",
    roles: ["mid", "jungle"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 58.06,
    },
  }),
  createChampion({
    id: "taric",

    synergyWith: [
      { championId: "lucian", score: 5 },
      { championId: "sivir", score: 5 },
      { championId: "tristana", score: 5 },
      { championId: "caitlyn", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "khazix", score: 3 },
      { championId: "maokai", score: 3 },
    ],

    offers: [
      { type: "antiDive", strength: 5 },
      { type: "peel", strength: 4 },
      { type: "frontline", strength: 3 },
      { type: "followUp", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "pick", severity: 2 }
    ],


    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Taric",
    image: "/champions/taric.png",
    roles: ["support"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 64.62,
    },
  }),
  createChampion({
    id: "teemo",
    offers: [
      { type: "zoneControl", strength: 4 },
      { type: "sideLanePressure", strength: 3 },
      { type: "poke", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "siege", severity: 2 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Teemo",
    image: "/champions/teemo.png",
    roles: ["top"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 54.47,
    },
  }),
  createChampion({
    id: "twitch",

    synergyWith: [
      { championId: "janna", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "tahm-kench", score: 5 },
      { championId: "lulu", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "cassiopeia", score: 4 },
      { championId: "twisted-fate", score: 3 },
    ],

    offers: [
      { type: "scaling", strength: 4 },
      { type: "backlineAccess", strength: 3 },
      { type: "sustainedDamage", strength: 4 }
    ],

    needs: [
      { type: "frontline", priority: 2 },
      { type: "peel", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 3 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "objectiveControl", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

    name: "Twitch",
    image: "/champions/twitch.png",
    roles: ["adc"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.8,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "26:51",
      csPerMinute: 8.6,
      damagePerMinute: 379,
      goldPerMinute: 346,
      csDiffAt15: -29,
      goldDiffAt15: -1700,
      xpDiffAt15: -1972,
      soloqKrChallengerWinRate: 51.8,
    },
  }),
  createChampion({
    id: "udyr",

    synergyWith: [
      { championId: "seraphine", score: 5 },
      { championId: "twisted-fate", score: 5 },
      { championId: "tahm-kench", score: 5 },
      { championId: "gragas", score: 4 },
      { championId: "jayce", score: 4 },
      { championId: "alistar", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "kaisa", score: 3 },
    ],

    offers: [
      { type: "frontline", strength: 3 },
      { type: "earlyPrio", strength: 4 },
      { type: "objectiveControl", strength: 3 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
      { exposedTo: "engage", severity: 1 },
      { exposedTo: "scaling", severity: 1 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Udyr",
    image: "/champions/udyr.png",
    roles: ["top", "jungle"],
    damageProfile: ["AD", "AP"],
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
      soloqKrChallengerWinRate: 56.81,
    },
  }),
  createChampion({
    id: "urgot",

    synergyWith: [
      { championId: "skarner", score: 5 },
      { championId: "sejuani", score: 5 },
      { championId: "sylas", score: 4 },
      { championId: "cassiopeia", score: 4 },
      { championId: "sivir", score: 4 },
      { championId: "varus", score: 3 },
      { championId: "thresh", score: 3 },
      { championId: "rakan", score: 3 },
    ],

    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "frontline", strength: 3 }
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

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Urgot",
    image: "/champions/urgot.png",
    roles: ["top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 57.89,
    },
  }),
  createChampion({
    id: "zac",

    synergyWith: [
      { championId: "leblanc", score: 5 },
      { championId: "jarvan-iv", score: 5 },
      { championId: "renekton", score: 5 },
      { championId: "morgana", score: 5 },
      { championId: "thresh", score: 4 },
      { championId: "gangplank", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "taric", score: 4 },
    ],

    offers: [
      { type: "engage", strength: 5 },
      { type: "frontline", strength: 4 },
      { type: "followUp", strength: 4 },
      { type: "reliableCC", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 3 },
      { exposedTo: "zoneControl", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],


    playerScaling: { mec: 3, mac: 4, tfg: 3, con: 3 },

    name: "Zac",
    image: "/champions/zac.png",
    roles: ["top", "jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 58.13,
    },
  }),
  createChampion({
    id: "velkoz",
    offers: [
      { type: "poke", strength: 5 },
      { type: "waveclear", strength: 4 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Vel'Koz",
    image: "/champions/vel'koz.png",
    roles: ["mid"],
    damageProfile: ["AP", "TRUE"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 4,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: null,
      averageGameTime: "35:10",
      csPerMinute: 0.9,
      damagePerMinute: 374,
      goldPerMinute: 267,
      csDiffAt15: -8,
      goldDiffAt15: -406,
      xpDiffAt15: -1221,
      soloqKrChallengerWinRate: 59.45,
    },
  }),
  createChampion({
    id: "ekko",
    offers: [
      { type: "pick", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "backlineAccess", strength: 3 },
      { type: "waveclear", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Ekko",
    image: "/champions/ekko.png",
    roles: ["mid", "jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 54.31,
    },
  }),
  createChampion({
    id: "tahm-kench",

    synergyWith: [
      { championId: "senna", score: 5 },
      { championId: "varus", score: 5 },
      { championId: "ashe", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "miss-fortune", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "twitch", score: 4 }
    ],

    offers: [
      { type: "frontline", strength: 5 },
      { type: "peel", strength: 5 },
      { type: "antiDive", strength: 5 },
      { type: "disengage", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "sustainedDamage", severity: 2 },
      { exposedTo: "sideLanePressure", severity: 1 },
    ],


    playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

    name: "Tahm Kench",
    image: "/champions/tahm-kench.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 8.5,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "47:29",
      csPerMinute: 0.8,
      damagePerMinute: 215,
      goldPerMinute: 267,
      csDiffAt15: 4,
      goldDiffAt15: 522,
      xpDiffAt15: 1522,
      soloqKrChallengerWinRate: 50.5,
    },
  }),
  createChampion({
    id: "ivern",

    synergyWith: [
      { championId: "yone", score: 5 },
      { championId: "rakan", score: 5 },
      { championId: "xayah", score: 5 },
      { championId: "rumble", score: 5 },
      { championId: "rell", score: 5 },
      { championId: "kalista", score: 4 },
      { championId: "gwen", score: 4 },
      { championId: "jinx", score: 4 },
    ],

    offers: [
      { type: "peel", strength: 4 },
      { type: "antiDive", strength: 4 },
      { type: "disengage", strength: 3 },
      { type: "frontline", strength: 2 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "siege", severity: 2 },
      { exposedTo: "earlyPrio", severity: 2 },
      { exposedTo: "pick", severity: 2 }
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Ivern",
    image: "/champions/ivern.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
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
      soloqKrChallengerWinRate: 63.3,
    },
  }),
  createChampion({
    id: "kayn",
    offers: [
      { type: "backlineAccess", strength: 5 },
      { type: "dive", strength: 4 },
      { type: "burstDamage", strength: 4 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Kayn",
    image: "/champions/kayn.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 54.03,
    },
  }),
  createChampion({
    id: "akshan",
    offers: [
      { type: "sideLanePressure", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "engage", severity: 2 },
      { exposedTo: "waveclear", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Akshan",
    image: "/champions/akshan.png",
    roles: ["mid", "top"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 59.17,
    },
  }),
  createChampion({
    id: "belveth",

    synergyWith: [
      { championId: "rumble", score: 5 },
      { championId: "renata-glasc", score: 5 },
      { championId: "kalista", score: 5 },
      { championId: "neeko", score: 3 },
      { championId: "ahri", score: 5 },
      { championId: "rell", score: 4 },
      { championId: "akali", score: 4 },
      { championId: "rakan", score: 4 },
    ],

    offers: [
      { type: "objectiveControl", strength: 4 },
      { type: "sustainedDamage", strength: 4 },
      { type: "splitpush", strength: 3 },
      { type: "sideLanePressure", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "earlyPrio", severity: 1 },
    ],


    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Bel'Veth",
    image: "/champions/bel'veth.png",
    roles: ["jungle"],
    damageProfile: ["AD", "TRUE"],
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
      soloqKrChallengerWinRate: 53.85,
    },
  }),
  createChampion({
    id: "nilah",

    synergyWith: [
      { championId: "senna", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "viktor", score: 5 },
      { championId: "jax", score: 4 },
      { championId: "alistar", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "ksante", score: 3 },
    ],

    offers: [
      { type: "dive", strength: 4 },
      { type: "followUp", strength: 4 },
      { type: "sustainedDamage", strength: 3 }
    ],

    needs: [
      { type: "engage", priority: 3 },
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
    ],


    playerScaling: { mec: 4, tfg: 4, clt: 2, con: 4 },

    name: "Nilah",
    image: "/champions/nilah.png",
    roles: ["adc"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 49.23,
    },
  }),
  createChampion({
    id: "briar",
    offers: [
      { type: "dive", strength: 4 },
      { type: "backlineAccess", strength: 4 },
      { type: "sustainedDamage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "antiDive", severity: 2 },
      { exposedTo: "disengage", severity: 2 },
    ],


    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Briar",
    image: "/champions/briar.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
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
      soloqKrChallengerWinRate: 51.7,
    },
  }),
  createChampion({
    id: "locke",

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "sejuani", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "braum", score: 4 },
      { championId: "milio", score: 4 },
      { championId: "sivir", score: 4 },
      { championId: "lee-sin", score: 3 },
    ],

    offers: [
      { type: "burstDamage", strength: 5 },
      { type: "backlineAccess", strength: 4 },
      { type: "roamPressure", strength: 4 },
      { type: "pick", strength: 3 }
    ],
    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 3 },
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "frontline", severity: 2 }
    ],
    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },
    name: "Locke",
    image: "/champions/locke.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 11,
      bans: 25,
      presence: 36,
      prioScore: 43,
      wins: 6,
      losses: 5,
      proWinRate: 55,
      kda: 3.2,
      avgBanTurn: 6.2,
      avgPickRound: 1.73,
      blindPickRate: 27.3,
      averageGameTime: "32:07",
      csPerMinute: 8.3,
      damagePerMinute: 529,
      goldPerMinute: 418,
      csDiffAt15: -13,
      goldDiffAt15: -190,
      xpDiffAt15: -291,
      soloqKrChallengerWinRate: null,
    },
  }),
];


const mergeRelations = (relations: Champion["synergyWith"]): Champion["synergyWith"] => {
  const byId = new Map<string, Champion["synergyWith"][number]>();

  for (const relation of relations) {
    const existing = byId.get(relation.championId);

    if (!existing) {
      byId.set(relation.championId, relation);
      continue;
    }

    byId.set(relation.championId, {
      championId: relation.championId,
      score: Math.max(existing.score ?? 0, relation.score ?? 0) || undefined,
    });
  }

  return Array.from(byId.values());
};


const carryProfileOverrides: Partial<Record<string, ChampionCarryProfile>> = {
  aphelios: { selfPeel: 1, selfSave: 0, mobilitySafety: 0 },
  jinx: { selfPeel: 1, selfSave: 0, mobilitySafety: 0 },
  kogmaw: { selfPeel: 0, selfSave: 0, mobilitySafety: 0 },
  yunara: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  varus: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  caitlyn: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  ashe: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  jhin: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  sivir: { selfPeel: 4, selfSave: 3, mobilitySafety: 2 },
  xayah: { selfPeel: 3, selfSave: 5, mobilitySafety: 2 },
  ezreal: { selfPeel: 1, selfSave: 3, mobilitySafety: 5 },
  zeri: { selfPeel: 2, selfSave: 2, mobilitySafety: 4 },
  kaisa: { selfPeel: 1, selfSave: 2, mobilitySafety: 3 },
  lucian: { selfPeel: 1, selfSave: 1, mobilitySafety: 3 },
  corki: { selfPeel: 1, selfSave: 2, mobilitySafety: 4 },
  tristana: { selfPeel: 2, selfSave: 2, mobilitySafety: 4 },
  samira: { selfPeel: 3, selfSave: 2, mobilitySafety: 2 },
  kalista: { selfPeel: 2, selfSave: 1, mobilitySafety: 3 },
  draven: { selfPeel: 0, selfSave: 0, mobilitySafety: 1 },
  "miss-fortune": { selfPeel: 0, selfSave: 0, mobilitySafety: 1 },
  smolder: { selfPeel: 1, selfSave: 1, mobilitySafety: 2 },
  ziggs: { selfPeel: 1, selfSave: 1, mobilitySafety: 1 },
  mel: { selfPeel: 1, selfSave: 1, mobilitySafety: 1 },
  vayne: { selfPeel: 2, selfSave: 1, mobilitySafety: 3 },
};

export const champions: Champion[] = baseChampions.map((champion) => ({
  ...champion,
  carryProfile: carryProfileOverrides[champion.id] ?? champion.carryProfile,
  synergyWith: mergeRelations(champion.synergyWith),
}));

export const championsById = Object.fromEntries(champions.map((champion) => [champion.id, champion]));