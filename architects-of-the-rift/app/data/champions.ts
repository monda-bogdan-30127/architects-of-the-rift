// Auto-generated from Winter 2026 pro patch 16.5 data provided by the user.

import type { Champion, ChampionCarryProfile, ChampionWeakness } from '../types/champion';

const createChampion = (champion: Omit<Champion, 'weakVs' | 'goodVs' | 'mustWith' | 'synergyWith' | 'offers' | 'needs' | 'weaknesses' | 'playerScaling' | 'carryProfile'> & Partial<Pick<Champion, 'weakVs' | 'goodVs' | 'mustWith' | 'synergyWith' | 'offers' | 'needs' | 'weaknesses' | 'playerScaling' | 'carryProfile'>>): Champion => ({
  weakVs: [],
  goodVs: [],
  mustWith: [],
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
    goodVs: [
      { championId: "syndra", score: 4 },
      { championId: "aurora", score: 4 },
      { championId: "leblanc", score: 3 },
      { championId: "viktor", score: 3 },
      { championId: "galio", score: 3 }
    ],

    weakVs: [
      { championId: "aurelion-sol", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "ahri", score: 2 }
    ],

    synergyWith: [{ championId: "vi", score: 5 }, { championId: "jarvan-iv", score: 4 }, { championId: "wukong", score: 4 }, { championId: "rakan", score: 3 }, { championId: "dr-mundo", score: 3 }],
    // Example of a near-mandatory pairing in coordinated play.
    //mustWith: [{ championId: "jarvan-iv", score: 5 }],
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
      picks: 39,
      bans: 169,
      presence: 208,
      prioScore: 79,
      wins: 26,
      losses: 13,
      proWinRate: 67,
      kda: 5.6,
      avgBanTurn: 3.1,
      avgPickRound: 1.36,
      blindPickRate: 86.1,
      averageGameTime: "31:22",
      csPerMinute: 9.5,
      damagePerMinute: 695,
      goldPerMinute: 434,
      csDiffAt15: 7.6,
      goldDiffAt15: 262,
      xpDiffAt15: 176,
      soloqKrChallengerWinRate: 53.4,
    },
  }),


  createChampion({
    id: "ambessa",
    goodVs: [
      { championId: "aurora", score: 5 },
      { championId: "ksante", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "wukong", score: 3 },
      { championId: "aatrox", score: 3 },
      { championId: "xin-zhao", score: 3 },
      { championId: "viego", score: 3 }
    ],

    weakVs: [
      { championId: "ornn", score: 5 },
      { championId: "gwen", score: 4 },
      { championId: "volibear", score: 4 },
      { championId: "jayce", score: 3 },
      { championId: "gnar", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "renekton", score: 2 }
    ],

    synergyWith: [
      { championId: "vi", score: 3 },
      { championId: "galio", score: 5 },
      { championId: "rumble", score: 4 },
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
      picks: 68,
      bans: 52,
      presence: 120,
      prioScore: 39,
      wins: 29,
      losses: 39,
      proWinRate: 43,
      kda: 2.2,
      avgBanTurn: 5.6,
      avgPickRound: 1.68,
      blindPickRate: 56.9,
      averageGameTime: "31:50",
      csPerMinute: 8.3,
      damagePerMinute: 610,
      goldPerMinute: 393,
      csDiffAt15: -4.8,
      goldDiffAt15: -201,
      xpDiffAt15: -89,
      soloqKrChallengerWinRate: 56,
    },
  }),


  createChampion({
    id: "jarvan-iv",
    goodVs: [
      { championId: "sejuani", score: 2 },
      { championId: "maokai", score: 2 },
      { championId: "ambessa", score: 5 },
      { championId: "nocturne", score: 3 },
      { championId: "xin-zhao", score: 2 }
    ],
    weakVs: [
      { championId: "lee-sin", score: 5 },
      { championId: "wukong", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "pantheon", score: 2 },
      { championId: "poppy", score: 2 }
    ],
    synergyWith: [{ championId: "orianna", score: 5 }, { championId: "rumble", score: 5 }, { championId: "galio", score: 4 }, { championId: "seraphine", score: 3 }],
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
      picks: 72,
      bans: 102,
      presence: 174,
      prioScore: 62,
      wins: 35,
      losses: 37,
      proWinRate: 49,
      kda: 4.1,
      avgBanTurn: 3.6,
      avgPickRound: 1.47,
      blindPickRate: 72.9,
      averageGameTime: "32:04",
      csPerMinute: 6.8,
      damagePerMinute: 400,
      goldPerMinute: 390,
      csDiffAt15: 4.7,
      goldDiffAt15: 226,
      xpDiffAt15: 259,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "rumble",
    goodVs: [
      { championId: "kennen", score: 5 },
      { championId: "yorick", score: 5 },
      { championId: "sion", score: 4 },
      { championId: "ksante", score: 3 },
      { championId: "ornn", score: 3 }
    ],

    weakVs: [
      { championId: "gnar", score: 3 },
      { championId: "gwen", score: 3 },
      { championId: "ambessa", score: 3 },
      { championId: "aurora", score: 2 },
      { championId: "galio", score: 2 }
    ],

    synergyWith: [{ championId: "jarvan-iv", score: 5 }, { championId: "vi", score: 4 }, { championId: "nautilus", score: 4 }, { championId: "wukong", score: 4 }, { championId: "rakan", score: 2 }],
    offers: [
      { type: "zoneControl", strength: 5 },
      { type: "waveclear", strength: 3 },
      { type: "burstDamage", strength: 3 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "reliableCC", priority: 1 },
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


    playerScaling: { mec: 3, tfg: 5, con: 3, iq: 4 },

    name: "Rumble",
    image: "/champions/rumble.png",
    roles: ["top"],
    damageProfile: ["AP"],
    stats: {
      picks: 52,
      bans: 142,
      presence: 194,
      prioScore: 72,
      wins: 30,
      losses: 22,
      proWinRate: 58,
      kda: 2.7,
      avgBanTurn: 3.5,
      avgPickRound: 1.42,
      blindPickRate: 98,
      averageGameTime: "32:42",
      csPerMinute: 8.1,
      damagePerMinute: 725,
      goldPerMinute: 396,
      csDiffAt15: -5.8,
      goldDiffAt15: -17,
      xpDiffAt15: -272,
      soloqKrChallengerWinRate: 60,
    },
  }),


  createChampion({
    id: "vi",
    goodVs: [
      { championId: "maokai", score: 2 },
      { championId: "sejuani", score: 2 },
      { championId: "naafiri", score: 5 },
      { championId: "wukong", score: 3 },
      { championId: "xin-zhao", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],

    weakVs: [
      { championId: "zaahen", score: 3 },
      { championId: "poppy", score: 3 },
      { championId: "pantheon", score: 5 },
      { championId: "nocturne", score: 4 }
    ],

    synergyWith: [{ championId: "ahri", score: 5 }, { championId: "orianna", score: 4 }, { championId: "galio", score: 3 }, { championId: "rumble", score: 4 }],
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
      picks: 51,
      bans: 80,
      presence: 131,
      prioScore: 45,
      wins: 29,
      losses: 22,
      proWinRate: 57,
      kda: 3.3,
      avgBanTurn: 5.4,
      avgPickRound: 1.76,
      blindPickRate: 72.9,
      averageGameTime: "32:20",
      csPerMinute: 7.1,
      damagePerMinute: 409,
      goldPerMinute: 403,
      csDiffAt15: 1.7,
      goldDiffAt15: 82,
      xpDiffAt15: 309,
      soloqKrChallengerWinRate: 55.57,
    },
  }),


  createChampion({
    id: "neeko",
    weakVs: [
      { championId: "anivia", score: 5 },
      { championId: "nami", score: 4 },
      { championId: "bard", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "lulu", score: 2 }
    ],

    goodVs: [
      { championId: "rakan", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "milio", score: 3 }
    ],

    synergyWith: [
      { championId: "caitlyn", score: 3 },
      { championId: "kaisa", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "kalista", score: 3 },
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
      picks: 56,
      bans: 45,
      presence: 101,
      prioScore: 33,
      wins: 23,
      losses: 33,
      proWinRate: 41,
      kda: 2.3,
      avgBanTurn: 5.5,
      avgPickRound: 1.68,
      blindPickRate: 53.7,
      averageGameTime: "31:57",
      csPerMinute: 1.2,
      damagePerMinute: 355,
      goldPerMinute: 271,
      csDiffAt15: 0.1,
      goldDiffAt15: 70,
      xpDiffAt15: -51,
      soloqKrChallengerWinRate: 56.7,
    },
  }),


  createChampion({
    id: "nautilus",
    goodVs: [
      { championId: "bard", score: 3 },
      { championId: "karma", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "milio", score: 4 },
      { championId: "thresh", score: 2 }
    ],

    weakVs: [
      { championId: "alistar", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "neeko", score: 3 },
      { championId: "poppy", score: 3 },
      { championId: "seraphine", score: 2 }
    ],

    synergyWith: [
      { championId: "varus", score: 5 },
      { championId: "kalista", score: 3 },
      { championId: "kaisa", score: 5 },
      { championId: "rumble", score: 4 }
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
      picks: 33,
      bans: 121,
      presence: 154,
      prioScore: 57,
      wins: 15,
      losses: 18,
      proWinRate: 45,
      kda: 2.8,
      avgBanTurn: 5.6,
      avgPickRound: 1.61,
      blindPickRate: 29,
      averageGameTime: "32:58",
      csPerMinute: 1.1,
      damagePerMinute: 223,
      goldPerMinute: 267,
      csDiffAt15: 2.3,
      goldDiffAt15: 48,
      xpDiffAt15: -51,
      soloqKrChallengerWinRate: 56,
    },
  }),

  createChampion({
    id: "varus",
    goodVs: [
      { championId: "jhin", score: 4 },
      { championId: "corki", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "ezreal", score: 3 },
      { championId: "sivir", score: 3 },
    ],
    weakVs: [
      { championId: "yunara", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "ashe", score: 3 },
      { championId: "kaisa", score: 2 },
      { championId: "miss-fortune", score: 2 }
    ],

    synergyWith: [
      { championId: "nautilus", score: 5 },
      { championId: "karma", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "renata-glasc", score: 4 }
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
      picks: 46,
      bans: 145,
      presence: 191,
      prioScore: 69,
      wins: 21,
      losses: 25,
      proWinRate: 46,
      kda: 2.8,
      avgBanTurn: 3.5,
      avgPickRound: 1.74,
      blindPickRate: 79.5,
      averageGameTime: "33:11",
      csPerMinute: 9,
      damagePerMinute: 789,
      goldPerMinute: 457,
      csDiffAt15: -0.5,
      goldDiffAt15: -73,
      xpDiffAt15: -39,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "ryze",
    goodVs: [
      { championId: "mel", score: 5 },
      { championId: "yone", score: 4 },
      { championId: "viktor", score: 4 },
      { championId: "ahri", score: 3 },
      { championId: "azir", score: 3 },
    ],
    
    weakVs: [
      { championId: "cassiopeia", score: 2 },
      { championId: "syndra", score: 3 },
      { championId: "annie", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "anivia", score: 2 }
    ],

    synergyWith: [
      { championId: "vi", score: 3 },
      { championId: "pantheon", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "xin-zhao", score: 4 }
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
      picks: 69,
      bans: 102,
      presence: 171,
      prioScore: 62,
      wins: 31,
      losses: 38,
      proWinRate: 45,
      kda: 2.9,
      avgBanTurn: 4.3,
      avgPickRound: 1.36,
      blindPickRate: 82.1,
      averageGameTime: "31:42",
      csPerMinute: 9.5,
      damagePerMinute: 620,
      goldPerMinute: 412,
      csDiffAt15: -3.2,
      goldDiffAt15: -63,
      xpDiffAt15: -222,
      soloqKrChallengerWinRate: 52,
    },
  }),

  createChampion({
    id: "yunara",
    goodVs: [
      { championId: "kaisa", score: 5 },
      { championId: "varus", score: 3 },
      { championId: "jhin", score: 3 },
      { championId: "zeri", score: 3 },
      { championId: "lucian", score: 3 },
    ],

    weakVs: [
      { championId: "ashe", score: 4 },
      { championId: "ezreal", score: 3 },
      { championId: "aphelios", score: 4 },
      { championId: "corki", score: 3 },
      { championId: "caitlyn", score: 2 }
    ],

    synergyWith: [
      { championId: "karma", score: 5 },
      { championId: "bard", score: 5 },
      { championId: "braum", score: 4 },
    ],
    mustWith: [
      { championId: "lulu", score: 5 },
      { championId: "milio", score: 5 },
      { championId: "nami", score: 4 },
      { championId: "thresh", score: 3 }
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
      picks: 69,
      bans: 24,
      presence: 93,
      prioScore: 26,
      wins: 26,
      losses: 43,
      proWinRate: 38,
      kda: 3,
      avgBanTurn: 5.7,
      avgPickRound: 1.86,
      blindPickRate: 65.2,
      averageGameTime: "32:27",
      csPerMinute: 10.2,
      damagePerMinute: 733,
      goldPerMinute: 501,
      csDiffAt15: -4.7,
      goldDiffAt15: 63,
      xpDiffAt15: -268,
      soloqKrChallengerWinRate: 56,
    },
  }),


  createChampion({
    id: "azir",
    goodVs: [
      { championId: "viktor", score: 5 },
      { championId: "taliyah", score: 2 },
      { championId: "aurora", score: 5 },
      { championId: "akali", score: 4 }
    ],

    weakVs: [
      { championId: "leblanc", score: 5 },
      { championId: "ryze", score: 4 },
      { championId: "ahri", score: 3 },
      { championId: "ziggs", score: 2 },
      { championId: "yone", score: 3 }
    ],
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
      picks: 52,
      bans: 74,
      presence: 126,
      prioScore: 44,
      wins: 18,
      losses: 34,
      proWinRate: 35,
      kda: 1.8,
      avgBanTurn: 4.7,
      avgPickRound: 1.52,
      blindPickRate: 58,
      averageGameTime: "32:23",
      csPerMinute: 9.6,
      damagePerMinute: 640,
      goldPerMinute: 401,
      csDiffAt15: -0.1,
      goldDiffAt15: -208,
      xpDiffAt15: -163,
      soloqKrChallengerWinRate: 42.44,
    },
  }),


  createChampion({
    id: "xin-zhao",
    goodVs: [
      { championId: "trundle", score: 5 },
      { championId: "wukong", score: 3 },
      { championId: "zaahen", score: 3 },
      { championId: "sejuani", score: 5 },
      { championId: "naafiri", score: 3 },
    ],

    weakVs: [
      { championId: "jax", score: 5 },
      { championId: "aatrox", score: 4 },
      { championId: "skarner", score: 4 },
      { championId: "nocturne", score: 3 },
      { championId: "vi", score: 3 }
    ],

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
      picks: 87,
      bans: 35,
      presence: 122,
      prioScore: 41,
      wins: 43,
      losses: 44,
      proWinRate: 49,
      kda: 2.9,
      avgBanTurn: 6.5,
      avgPickRound: 1.4,
      blindPickRate: 48.8,
      averageGameTime: "32:09",
      csPerMinute: 7.1,
      damagePerMinute: 462,
      goldPerMinute: 390,
      csDiffAt15: 0.9,
      goldDiffAt15: -124,
      xpDiffAt15: -54,
      soloqKrChallengerWinRate: 59.6,
    },
  }),


  createChampion({
    id: "karma",
    goodVs: [
      { championId: "alistar", score: 4 },
      { championId: "nami", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "neeko", score: 2 },
    ],

    weakVs: [
      { championId: "nautilus", score: 5 },
      { championId: "seraphine", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "bard", score: 2 }
    ],

    synergyWith: [
      { championId: "caitlyn", score: 5 },
      { championId: "ezreal", score: 5 },
      { championId: "varus", score: 5 },
      { championId: "sivir", score: 4 }
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
      picks: 34,
      bans: 164,
      presence: 198,
      prioScore: 75,
      wins: 13,
      losses: 21,
      proWinRate: 38,
      kda: 3.3,
      avgBanTurn: 3.7,
      avgPickRound: 1.41,
      blindPickRate: 87.9,
      averageGameTime: "31:30",
      csPerMinute: 1.3,
      damagePerMinute: 279,
      goldPerMinute: 266,
      csDiffAt15: 0.6,
      goldDiffAt15: 6,
      xpDiffAt15: -146,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "ezreal",
    goodVs: [
      { championId: "jhin", score: 5 },
      { championId: "yunara", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "corki", score: 4 }
    ],

    weakVs: [
      { championId: "caitlyn", score: 4 },
      { championId: "sivir", score: 3 },
      { championId: "varus", score: 2 }
    ],

    synergyWith: [
      { championId: "karma", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "braum", score: 3 },
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
      picks: 83,
      bans: 27,
      presence: 110,
      prioScore: 37,
      wins: 39,
      losses: 44,
      proWinRate: 47,
      kda: 3.6,
      avgBanTurn: 7.1,
      avgPickRound: 1.43,
      blindPickRate: 63.3,
      averageGameTime: "32:10",
      csPerMinute: 10,
      damagePerMinute: 841,
      goldPerMinute: 472,
      csDiffAt15: 3.2,
      goldDiffAt15: -134,
      xpDiffAt15: 107,
      soloqKrChallengerWinRate: 54.8,
    },
  }),


  createChampion({
    id: "pantheon",
    goodVs: [
      { championId: "vi", score: 5 },
      { championId: "naafiri", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "sejuani", score: 3 },
      { championId: "xin-zhao", score: 2 }
    ],

    weakVs: [
      { championId: "skarner", score: 5 },
      { championId: "ambessa", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "poppy", score: 2 }
    ],

    synergyWith: [
      { championId: "taliyah", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "kalista", score: 4 },
      { championId: "azir", score: 3 }
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
      picks: 72,
      bans: 98,
      presence: 170,
      prioScore: 62,
      wins: 35,
      losses: 37,
      proWinRate: 49,
      kda: 3.1,
      avgBanTurn: 3.9,
      avgPickRound: 1.36,
      blindPickRate: 80,
      averageGameTime: "31:54",
      csPerMinute: 6.8,
      damagePerMinute: 524,
      goldPerMinute: 390,
      csDiffAt15: -3.6,
      goldDiffAt15: 65,
      xpDiffAt15: -102,
      soloqKrChallengerWinRate: 55.2,
    },
  }),

  createChampion({
    id: "caitlyn",
    goodVs: [
      { championId: "ezreal", score: 4 },
      { championId: "corki", score: 4 },
      { championId: "jhin", score: 3 },
      { championId: "yunara", score: 3 }
    ],

    weakVs: [
      { championId: "aphelios", score: 4 },
      { championId: "ashe", score: 4 },
      { championId: "jhin", score: 3 },
      { championId: "sivir", score: 1 },
    ],

    synergyWith: [
      { championId: "karma", score: 5 },
      { championId: "lux", score: 5 },
      { championId: "neeko", score: 4 },
      { championId: "milio", score: 2 },
      { championId: "braum", score: 1 }
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
      picks: 35,
      bans: 22,
      presence: 57,
      prioScore: 18,
      wins: 25,
      losses: 10,
      proWinRate: 71,
      kda: 4,
      avgBanTurn: 6.4,
      avgPickRound: 1.63,
      blindPickRate: 36.4,
      averageGameTime: "32:16",
      csPerMinute: 10.1,
      damagePerMinute: 759,
      goldPerMinute: 497,
      csDiffAt15: 4.1,
      goldDiffAt15: 154,
      xpDiffAt15: 58,
      soloqKrChallengerWinRate: 59.4,
    },
  }),


  createChampion({
    id: "ahri",
    goodVs: [
      { championId: "sylas", score: 5 },
      { championId: "annie", score: 5 },
      { championId: "akali", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "taliyah", score: 3 }
    ],

    weakVs: [
      { championId: "viktor", score: 2 },
      { championId: "leblanc", score: 4 },
      { championId: "mel", score: 3 },
      { championId: "cassiopeia", score: 3 },
      { championId: "ryze", score: 2 }
    ],
    synergyWith: [
      { championId: "vi", score: 5 },
      { championId: "xin-zhao", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "pantheon", score: 4 }
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
      picks: 43,
      bans: 15,
      presence: 58,
      prioScore: 17,
      wins: 28,
      losses: 15,
      proWinRate: 65,
      kda: 6,
      avgBanTurn: 6.4,
      avgPickRound: 1.72,
      blindPickRate: 53.7,
      averageGameTime: "33:47",
      csPerMinute: 9.1,
      damagePerMinute: 718,
      goldPerMinute: 426,
      csDiffAt15: 2,
      goldDiffAt15: 77,
      xpDiffAt15: 58,
      soloqKrChallengerWinRate: 59,
    },
  }),

  createChampion({
    id: "bard",
    goodVs: [
      { championId: "alistar", score: 5 },
      { championId: "rakan", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "neeko", score: 4 },
      { championId: "seraphine", score: 3 }
    ],

    weakVs: [
      { championId: "nautilus", score: 5 },
      { championId: "karma", score: 3 },
      { championId: "ezreal", score: 4 }
    ],

    synergyWith: [
      { championId: "caitlyn", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "sivir", score: 3 },
      { championId: "wukong", score: 2 }
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
      picks: 64,
      bans: 63,
      presence: 127,
      prioScore: 43,
      wins: 44,
      losses: 20,
      proWinRate: 69,
      kda: 4.8,
      avgBanTurn: 5.8,
      avgPickRound: 1.56,
      blindPickRate: 60,
      averageGameTime: "31:10",
      csPerMinute: 1.2,
      damagePerMinute: 264,
      goldPerMinute: 281,
      csDiffAt15: -1.5,
      goldDiffAt15: -28,
      xpDiffAt15: 30,
      soloqKrChallengerWinRate: 58,
    },
  }),

  createChampion({
    id: "taliyah",
    goodVs: [
      { championId: "galio", score: 4 },
      { championId: "sylas", score: 4 },
      { championId: "aurora", score: 2 }
    ],

    weakVs: [
      { championId: "zoe", score: 5 },
      { championId: "anivia", score: 3 },
      { championId: "ryze", score: 2 },
      { championId: "leblanc", score: 3 },
      { championId: "ahri", score: 5 }
    ],
    synergyWith: [
      { championId: "vi", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "nocturne", score: 3 },
      { championId: "ambessa", score: 4 },
      { championId: "xin-zhao", score: 2 }
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
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 19,
      bans: 15,
      presence: 34,
      prioScore: 11,
      wins: 11,
      losses: 8,
      proWinRate: 58,
      kda: 4.3,
      avgBanTurn: 6.5,
      avgPickRound: 1.79,
      blindPickRate: 50,
      averageGameTime: "33:38",
      csPerMinute: 8.8,
      damagePerMinute: 698,
      goldPerMinute: 411,
      csDiffAt15: -7.8,
      goldDiffAt15: -71,
      xpDiffAt15: -4,
      soloqKrChallengerWinRate: 58,
    },
  }),

  createChampion({
    id: "sion",
    goodVs: [
      { championId: "aurora", score: 4 },
      { championId: "gnar", score: 2 },
      { championId: "ambessa", score: 3 },
      { championId: "jayce", score: 2 }
    ],

    weakVs: [
      { championId: "renekton", score: 5 },
      { championId: "rumble", score: 5 },
      { championId: "zaahen", score: 5 },
      { championId: "gwen", score: 4 },
      { championId: "aatrox", score: 4 }
    ],

    synergyWith: [
      { championId: "naafiri", score: 3 },
      { championId: "lee-sin", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "viego", score: 3 }
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
      picks: 44,
      bans: 33,
      presence: 77,
      prioScore: 24,
      wins: 17,
      losses: 27,
      proWinRate: 39,
      kda: 2.9,
      avgBanTurn: 7,
      avgPickRound: 1.82,
      blindPickRate: 35.7,
      averageGameTime: "31:14",
      csPerMinute: 7.9,
      damagePerMinute: 482,
      goldPerMinute: 347,
      csDiffAt15: -10.2,
      goldDiffAt15: -594,
      xpDiffAt15: -264,
      soloqKrChallengerWinRate: 51,
    },
  }),


  createChampion({
    id: "ksante",
    goodVs: [
      { championId: "aatrox", score: 4 },
      { championId: "jayce", score: 2 },
      { championId: "aurora", score: 2 }
    ],

    weakVs: [
      { championId: "gnar", score: 4 },
      { championId: "ambessa", score: 5 },
      { championId: "vayne", score: 4 },
      { championId: "aatrox", score: 2 },
      { championId: "renekton", score: 3 }
    ],

    synergyWith: [
      { championId: "nocturne", score: 5 },
      { championId: "xin-zhao", score: 4 },
      { championId: "naafiri", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "ambessa", score: 3 }
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
    ],


    playerScaling: { mec: 4, tfg: 4, con: 4, iq: 2 },

    name: "K'Sante",
    image: "/champions/k'sante.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 52,
      bans: 16,
      presence: 68,
      prioScore: 23,
      wins: 16,
      losses: 36,
      proWinRate: 31,
      kda: 1.9,
      avgBanTurn: 8.3,
      avgPickRound: 1.42,
      blindPickRate: 22,
      averageGameTime: "32:29",
      csPerMinute: 8.3,
      damagePerMinute: 458,
      goldPerMinute: 364,
      csDiffAt15: 1.9,
      goldDiffAt15: -97,
      xpDiffAt15: 210,
      soloqKrChallengerWinRate: 51,
    },
  }),


  createChampion({
    id: "dr-mundo",
    goodVs: [
      { championId: "viego", score: 5 },
      { championId: "jayce", score: 4 },
      { championId: "qiyana", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "zaahen", score: 4 }
    ],

    weakVs: [
      { championId: "naafiri", score: 5 },
      { championId: "vi", score: 3 },
      { championId: "nocturne", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],
    synergyWith: [
      { championId: "hwei", score: 3 },
      { championId: "orianna", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "karma", score: 4 },
      { championId: "seraphine", score: 5 },
      { championId: "nami", score: 3 },
      { championId: "sivir", score: 4 }
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
    roles: ["jungle"],
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 15,
      bans: 21,
      presence: 36,
      prioScore: 11,
      wins: 9,
      losses: 6,
      proWinRate: 60,
      kda: 4.7,
      avgBanTurn: 6.4,
      avgPickRound: 2.27,
      blindPickRate: 15.4,
      averageGameTime: "31:59",
      csPerMinute: 7.2,
      damagePerMinute: 652,
      goldPerMinute: 392,
      csDiffAt15: 6.4,
      goldDiffAt15: -22,
      xpDiffAt15: 97,
      soloqKrChallengerWinRate: 53,
    },
  }),


  createChampion({
    id: "zaahen",
    goodVs: [
      { championId: "gwen", score: 4 },
      { championId: "ksante", score: 4 },
      { championId: "reksai", score: 3 },
      { championId: "pantheon", score: 2 },
      { championId: "wukong", score: 2 }
    ],

    weakVs: [
      { championId: "dr-mundo", score: 2 },
      { championId: "ornn", score: 2 },
      { championId: "gnar", score: 2 },
      { championId: "ambessa", score: 2 },
      { championId: "jax", score: 1 }
    ],
    offers: [
      { type: "dive", strength: 4 },
      { type: "burstDamage", strength: 3 },
      { type: "backlineAccess", strength: 4 }
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


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Zaahen",
    image: "/champions/zaahen.png",
    roles: ["jungle", "top"],
    damageProfile: ["AD"],
    stats: {
      picks: 24,
      bans: 4,
      presence: 28,
      prioScore: 6,
      wins: 10,
      losses: 14,
      proWinRate: 42,
      kda: 2.3,
      avgBanTurn: 9.3,
      avgPickRound: 2.25,
      blindPickRate: 8.7,
      averageGameTime: "33:45",
      csPerMinute: 7.9,
      damagePerMinute: 560,
      goldPerMinute: 387,
      csDiffAt15: -6.4,
      goldDiffAt15: -210,
      xpDiffAt15: -250,
      soloqKrChallengerWinRate: 56.4,
    },
  }),

  createChampion({
    id: "ashe",
    goodVs: [
      { championId: "ziggs", score: 5 },
      { championId: "corki", score: 4 },
      { championId: "miss-fortune", score: 4 },
      { championId: "yunara", score: 4 },
      { championId: "jhin", score: 3 }
    ],

    weakVs: [
      { championId: "varus", score: 2 },
      { championId: "jinx", score: 3 }
    ],

    synergyWith: [
      { championId: "braum", score: 3 },
      { championId: "karma", score: 2 },
      { championId: "bard", score: 2 }
    ],

    mustWith: [
      { championId: "seraphine", score: 5 }
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
      picks: 59,
      bans: 57,
      presence: 116,
      prioScore: 40,
      wins: 37,
      losses: 22,
      proWinRate: 63,
      kda: 3.8,
      avgBanTurn: 5.2,
      avgPickRound: 1.46,
      blindPickRate: 75,
      averageGameTime: "30:50",
      csPerMinute: 9.7,
      damagePerMinute: 672,
      goldPerMinute: 476,
      csDiffAt15: 2.4,
      goldDiffAt15: 177,
      xpDiffAt15: 83,
      soloqKrChallengerWinRate: 58.82,
    },
  }),


  createChampion({
    id: "corki",
    goodVs: [
      { championId: "jhin", score: 5 },
      { championId: "aphelios", score: 4 },
      { championId: "sivir", score: 3 },
      { championId: "yunara", score: 3 }
    ],

    weakVs: [
      { championId: "ashe", score: 5 },
      { championId: "ezreal", score: 4 },
      { championId: "varus", score: 4 },
      { championId: "caitlyn", score: 4 }
    ],
    synergyWith: [
      { championId: "nami", score: 5 },
      { championId: "braum", score: 3 },
      { championId: "bard", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "thresh", score: 2 }
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
    damageProfile: ["AD", "AP"],
    stats: {
      picks: 63,
      bans: 16,
      presence: 79,
      prioScore: 23,
      wins: 33,
      losses: 30,
      proWinRate: 52,
      kda: 3.4,
      avgBanTurn: 8.3,
      avgPickRound: 1.7,
      blindPickRate: 49.2,
      averageGameTime: "32:10",
      csPerMinute: 9.8,
      damagePerMinute: 798,
      goldPerMinute: 483,
      csDiffAt15: -2.8,
      goldDiffAt15: -240,
      xpDiffAt15: 54,
      soloqKrChallengerWinRate: 57.57,
    },
  }),

  createChampion({
    id: "aurora",
    goodVs: [
      { championId: "ryze", score: 2 },
      { championId: "galio", score: 3 },
      { championId: "viktor", score: 3 },
      { championId: "leblanc", score: 3 },
      { championId: "ksante", score: 3 },
      { championId: "rumble", score: 2 }
    ],

    weakVs: [
      { championId: "azir", score: 5 },
      { championId: "annie", score: 5 },
      { championId: "mel", score: 4 },
      { championId: "sion", score: 5 },
      { championId: "gnar", score: 4 },
      { championId: "ahri", score: 3 }
    ],

    synergyWith: [
      { championId: "lee-sin", score: 5 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "xin-zhao", score: 4 },
      { championId: "ambessa", score: 2 },
      { championId: "vi", score: 3 }
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
      picks: 59,
      bans: 35,
      presence: 94,
      prioScore: 31,
      wins: 24,
      losses: 35,
      proWinRate: 41,
      kda: 3.5,
      avgBanTurn: 7.2,
      avgPickRound: 1.51,
      blindPickRate: 56.4,
      averageGameTime: "31:45",
      csPerMinute: 8.7,
      damagePerMinute: 744,
      goldPerMinute: 399,
      csDiffAt15: -0.1,
      goldDiffAt15: 64,
      xpDiffAt15: 47,
      soloqKrChallengerWinRate: 53.81,
    },
  }),

  createChampion({
    id: "gwen",
    goodVs: [
      { championId: "ksante", score: 5 },
      { championId: "ornn", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "kennen", score: 4 },
      { championId: "sion", score: 4 },
      { championId: "aatrox", score: 4 }
    ],

    weakVs: [
      { championId: "zaahen", score: 5 },
      { championId: "jax", score: 4 },
      { championId: "gnar", score: 5 }
    ],

    synergyWith: [
      { championId: "vi", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "xin-zhao", score: 2 },
      { championId: "jarvan-iv", score: 2 }
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
      picks: 16,
      bans: 23,
      presence: 39,
      prioScore: 13,
      wins: 9,
      losses: 7,
      proWinRate: 56,
      kda: 2.9,
      avgBanTurn: 7.9,
      avgPickRound: 2,
      blindPickRate: 6.3,
      averageGameTime: "32:52",
      csPerMinute: 8.7,
      damagePerMinute: 892,
      goldPerMinute: 437,
      csDiffAt15: 2.9,
      goldDiffAt15: 53,
      xpDiffAt15: -47,
      soloqKrChallengerWinRate: 54.82,
    },
  }),


  createChampion({
    id: "renekton",
    goodVs: [
      { championId: "sion", score: 5 },
      { championId: "kennen", score: 5 },
      { championId: "zaahen", score: 4 },
      { championId: "ornn", score: 3 },
      { championId: "ambessa", score: 2 }
    ],

    weakVs: [
      { championId: "gwen", score: 4 },
      { championId: "gnar", score: 2 },
      { championId: "kennen", score: 3 }
    ],
    synergyWith: [
      { championId: "nocturne", score: 5 },
      { championId: "xin-zhao", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "nidalee", score: 2 }
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
      picks: 55,
      bans: 40,
      presence: 95,
      prioScore: 29,
      wins: 33,
      losses: 22,
      proWinRate: 60,
      kda: 2.5,
      avgBanTurn: 7.5,
      avgPickRound: 1.87,
      blindPickRate: 88.5,
      averageGameTime: "31:46",
      csPerMinute: 9,
      damagePerMinute: 588,
      goldPerMinute: 402,
      csDiffAt15: 3.8,
      goldDiffAt15: 92,
      xpDiffAt15: 112,
      soloqKrChallengerWinRate: 59.18,
    },
  }),


  createChampion({
    id: "lulu",
    goodVs: [
      { championId: "karma", score: 3 },
      { championId: "neeko", score: 3 },
      { championId: "alistar", score: 4 },
      { championId: "braum", score: 4 }
    ],

    weakVs: [
      { championId: "thresh", score: 5 },
      { championId: "bard", score: 5 },
      { championId: "nautilus", score: 4 },
      { championId: "seraphine", score: 3 },
      { championId: "nami", score: 3 }
    ],

    synergyWith: [
      { championId: "aphelios", score: 5 },
      { championId: "jinx", score: 5 },
      { championId: "zeri", score: 5 },
      { championId: "kogmaw", score: 5 },
      { championId: "yunara", score: 5 }
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
    ],


    playerScaling: { mac: 4, tfg: 3, con: 4, iq: 5 },

    name: "Lulu",
    image: "/champions/lulu.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 63,
      bans: 37,
      presence: 100,
      prioScore: 31,
      wins: 22,
      losses: 41,
      proWinRate: 35,
      kda: 4.5,
      avgBanTurn: 7.4,
      avgPickRound: 1.79,
      blindPickRate: 60,
      averageGameTime: "32:19",
      csPerMinute: 1,
      damagePerMinute: 185,
      goldPerMinute: 256,
      csDiffAt15: -0.1,
      goldDiffAt15: -95,
      xpDiffAt15: 92,
      soloqKrChallengerWinRate: 51.7,
    },
  }),

  createChampion({
    id: "wukong",
    goodVs: [
      { championId: "maokai", score: 4 },
      { championId: "trundle", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "pantheon", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],

    weakVs: [
      { championId: "poppy", score: 3 },
      { championId: "dr-mundo", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "nocturne", score: 3 }
    ],

    synergyWith: [
      { championId: "ahri", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "sylas", score: 2 },
      { championId: "viktor", score: 3 },
      { championId: "akali", score: 4 }
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
      picks: 35,
      bans: 23,
      presence: 58,
      prioScore: 17,
      wins: 15,
      losses: 20,
      proWinRate: 43,
      kda: 2.5,
      avgBanTurn: 7.2,
      avgPickRound: 1.86,
      blindPickRate: 23.5,
      averageGameTime: "34:19",
      csPerMinute: 6.7,
      damagePerMinute: 424,
      goldPerMinute: 379,
      csDiffAt15: -2.9,
      goldDiffAt15: -278,
      xpDiffAt15: -246,
      soloqKrChallengerWinRate: 57.39,
    },
  }),


  createChampion({
    id: "gnar",
    goodVs: [
      { championId: "ksante", score: 5 },
      { championId: "gwen", score: 5 },
      { championId: "yorick", score: 4 },
      { championId: "ambessa", score: 4 },
      { championId: "renekton", score: 4 }
    ],

    weakVs: [
      { championId: "kennen", score: 5 },
      { championId: "sion", score: 2 },
      { championId: "vayne", score: 2 },
      { championId: "yorick", score: 2 }
    ],

    synergyWith: [
      { championId: "lee-sin", score: 3 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "ambessa", score: 2 },
      { championId: "xin-zhao", score: 2 },
      { championId: "nocturne", score: 4 }
    ],

    offers: [
      { type: "sideLanePressure", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 4, con: 3, iq: 2 },

    name: "Gnar",
    image: "/champions/gnar.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 73,
      bans: 34,
      presence: 107,
      prioScore: 33,
      wins: 45,
      losses: 28,
      proWinRate: 62,
      kda: 3,
      avgBanTurn: 8.4,
      avgPickRound: 1.7,
      blindPickRate: 57.1,
      averageGameTime: "31:22",
      csPerMinute: 9,
      damagePerMinute: 697,
      goldPerMinute: 414,
      csDiffAt15: 6.2,
      goldDiffAt15: 362,
      xpDiffAt15: 327,
      soloqKrChallengerWinRate: 56.48,
    },
  }),

  createChampion({
    id: "aatrox",
    goodVs: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "sion", score: 4 },
      { championId: "jayce", score: 4 },
      { championId: "yorick", score: 4 },
      { championId: "nocturne", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "dr-mundo", score: 3 }
    ],

    weakVs: [
      { championId: "vi", score: 5 },
      { championId: "renekton", score: 5 },
      { championId: "ornn", score: 4 },
      { championId: "ksante", score: 3 },
      { championId: "gwen", score: 3 }
    ],

    synergyWith: [
      { championId: "renekton", score: 5 },
      { championId: "jax", score: 4 },
      { championId: "ahri", score: 5 },
      { championId: "viktor", score: 3 },
      { championId: "akali", score: 2 }
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
      picks: 23,
      bans: 8,
      presence: 31,
      prioScore: 8,
      wins: 17,
      losses: 6,
      proWinRate: 74,
      kda: 5.4,
      avgBanTurn: 7.8,
      avgPickRound: 2,
      blindPickRate: 23.8,
      averageGameTime: "31:15",
      csPerMinute: 7.8,
      damagePerMinute: 534,
      goldPerMinute: 424,
      csDiffAt15: 7.7,
      goldDiffAt15: 448,
      xpDiffAt15: 395,
      soloqKrChallengerWinRate: 57.14,
    },
  }),


  createChampion({
    id: "akali",
    goodVs: [
      { championId: "ryze", score: 32 },
      { championId: "viktor", score: 4 },
      { championId: "aurora", score: 3 },
      { championId: "orianna", score: 4 },
      { championId: "syndra", score: 3 }
    ],

    weakVs: [
      { championId: "ahri", score: 5 },
      { championId: "azir", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "annie", score: 3 }
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
    roles: ["mid", "top"],
    damageProfile: ["AP"],
    stats: {
      picks: 23,
      bans: 60,
      presence: 83,
      prioScore: 29,
      wins: 14,
      losses: 9,
      proWinRate: 61,
      kda: 3.1,
      avgBanTurn: 5.3,
      avgPickRound: 1.87,
      blindPickRate: 13,
      averageGameTime: "31:31",
      csPerMinute: 8.5,
      damagePerMinute: 610,
      goldPerMinute: 409,
      csDiffAt15: -6.6,
      goldDiffAt15: -231,
      xpDiffAt15: -63,
      soloqKrChallengerWinRate: 49.5,
    },
  }),

  createChampion({
    id: "nocturne",
    goodVs: [
      { championId: "dr-mundo", score: 4 },
      { championId: "pantheon", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "xin-zhao", score: 3 },
      { championId: "wukong", score: 3 }
    ],

    weakVs: [
      { championId: "jarvan-iv", score: 2 },
      { championId: "tahm-kench", score: 4 },
      { championId: "naafiri", score: 4 },
      { championId: "aatrox", score: 3 }
    ],

    synergyWith: [
      { championId: "orianna", score: 5 },
      { championId: "ahri", score: 5 },
      { championId: "akali", score: 3 },
      { championId: "shen", score: 5 },
      { championId: "ornn", score: 5 }
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
      picks: 35,
      bans: 87,
      presence: 122,
      prioScore: 43,
      wins: 18,
      losses: 17,
      proWinRate: 51,
      kda: 3.6,
      avgBanTurn: 4.8,
      avgPickRound: 1.77,
      blindPickRate: 44.1,
      averageGameTime: "31:13",
      csPerMinute: 7.2,
      damagePerMinute: 440,
      goldPerMinute: 399,
      csDiffAt15: 3.6,
      goldDiffAt15: -80,
      xpDiffAt15: 29,
      soloqKrChallengerWinRate: 59.69,
    },
  }),

  createChampion({
    id: "nami",
    goodVs: [
      { championId: "neeko", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "lulu", score: 3 },
      { championId: "milio", score: 3 }
    ],

    weakVs: [
      { championId: "seraphine", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "karma", score: 3 }
    ],

    mustWith: [
      { championId: "lucian", score: 5 },
      { championId: "corki", score: 5 },
      { championId: "jhin", score: 5 },
      { championId: "caitlyn", score: 4 }
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
      picks: 62,
      bans: 26,
      presence: 88,
      prioScore: 28,
      wins: 34,
      losses: 28,
      proWinRate: 55,
      kda: 4.5,
      avgBanTurn: 8.1,
      avgPickRound: 1.63,
      blindPickRate: 47.5,
      averageGameTime: "32:27",
      csPerMinute: 1,
      damagePerMinute: 248,
      goldPerMinute: 269,
      csDiffAt15: -1.1,
      goldDiffAt15: -77,
      xpDiffAt15: -70,
      soloqKrChallengerWinRate: 56.07,
    },
  }),

  createChampion({
    id: "alistar",
    goodVs: [
      { championId: "rell", score: 5 },
      { championId: "nautilus", score: 4 },
      { championId: "rakan", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "rakan", score: 3 }
    ],

    weakVs: [
      { championId: "lulu", score: 3 },
      { championId: "seraphine", score: 2 },
      { championId: "bard", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "poppy", score: 2 }
    ],
    synergyWith: [{ championId: "kalista", score: 4 }, { championId: "kaisa", score: 4 }],
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
      picks: 25,
      bans: 12,
      presence: 37,
      prioScore: 11,
      wins: 14,
      losses: 11,
      proWinRate: 56,
      kda: 3.2,
      avgBanTurn: 8.4,
      avgPickRound: 1.88,
      blindPickRate: 32,
      averageGameTime: "30:50",
      csPerMinute: 0.9,
      damagePerMinute: 145,
      goldPerMinute: 262,
      csDiffAt15: -2,
      goldDiffAt15: -56,
      xpDiffAt15: -67,
      soloqKrChallengerWinRate: 56.97,
    },
  }),


  createChampion({
    id: "kaisa",
    goodVs: [
      { championId: "miss-fortune", score: 5 },
      { championId: "tristana", score: 5 },
      { championId: "sivir", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "jinx", score: 4 }
    ],

    weakVs: [
      { championId: "ashe", score: 4 },
      { championId: "yunara", score: 4 },
      { championId: "poppy", score: 4 },
      { championId: "caitlyn", score: 4 }
    ],

    synergyWith: [
      { championId: "rakan", score: 4 },
      { championId: "rell", score: 4 }
    ],

    mustWith: [
      { championId: "nautilus", score: 5 },
      { championId: "alistar", score: 5 },
      { championId: "leona", score: 5 }
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
      picks: 12,
      bans: 9,
      presence: 21,
      prioScore: 7,
      wins: 7,
      losses: 5,
      proWinRate: 58,
      kda: 2.7,
      avgBanTurn: 7.3,
      avgPickRound: 1.83,
      blindPickRate: 25,
      averageGameTime: "30:36",
      csPerMinute: 9.5,
      damagePerMinute: 691,
      goldPerMinute: 509,
      csDiffAt15: -2.4,
      goldDiffAt15: 131,
      xpDiffAt15: -16,
      soloqKrChallengerWinRate: 52.99,
    },
  }),


  createChampion({
    id: "galio",
    goodVs: [
      { championId: "syndra", score: 3 },
      { championId: "rumble", score: 3 },
      { championId: "leblanc", score: 4 }
    ],

    weakVs: [
      { championId: "ahri", score: 5 },
      { championId: "orianna", score: 5 },
      { championId: "annie", score: 4 },
      { championId: "yone", score: 4 }
    ],

    synergyWith: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "nocturne", score: 5 },
      { championId: "camille", score: 5 },
      { championId: "rakan", score: 4 },
      { championId: "kindred", score: 4 }
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
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 22,
      bans: 19,
      presence: 41,
      prioScore: 13,
      wins: 9,
      losses: 13,
      proWinRate: 41,
      kda: 2.4,
      avgBanTurn: 8.3,
      avgPickRound: 1.95,
      blindPickRate: 14.3,
      averageGameTime: "30:29",
      csPerMinute: 7.9,
      damagePerMinute: 453,
      goldPerMinute: 360,
      csDiffAt15: -3.4,
      goldDiffAt15: -294,
      xpDiffAt15: -18,
      soloqKrChallengerWinRate: 55.99,
    },
  }),

  createChampion({
    id: "sivir",
    goodVs: [
      { championId: "jhin", score: 5 },
      { championId: "xayah", score: 5 },
      { championId: "miss-fortune", score: 4 },
      { championId: "ezreal", score: 3 }
    ],

    weakVs: [
      { championId: "zeri", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "yunara", score: 3 },
      { championId: "varus", score: 2 }
    ],

    synergyWith: [
      { championId: "xin-zhao", score: 3 },
      { championId: "lulu", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "karma", score: 5 },
      { championId: "bard", score: 4 },
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
      picks: 28,
      bans: 23,
      presence: 51,
      prioScore: 17,
      wins: 16,
      losses: 12,
      proWinRate: 57,
      kda: 4.5,
      avgBanTurn: 7.7,
      avgPickRound: 1.68,
      blindPickRate: 15.4,
      averageGameTime: "32:27",
      csPerMinute: 10.5,
      damagePerMinute: 876,
      goldPerMinute: 524,
      csDiffAt15: 2.2,
      goldDiffAt15: 374,
      xpDiffAt15: 181,
      soloqKrChallengerWinRate: 54.26,
    },
  }),


  createChampion({
    id: "seraphine",
    goodVs: [
      { championId: "rell", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "nami", score: 3 },
      { championId: "nautilus", score: 3 }
    ],

    weakVs: [
      { championId: "neeko", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "anivia", score: 3 }
    ],

    mustWith: [{ championId: "ashe", score: 5 }],

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
    ],


    playerScaling: { mac: 4, tfg: 5, con: 3, iq: 4 },

    name: "Seraphine",
    image: "/champions/seraphine.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 59,
      bans: 43,
      presence: 102,
      prioScore: 35,
      wins: 34,
      losses: 25,
      proWinRate: 58,
      kda: 4.3,
      avgBanTurn: 5.3,
      avgPickRound: 1.49,
      blindPickRate: 67.9,
      averageGameTime: "31:14",
      csPerMinute: 1.3,
      damagePerMinute: 265,
      goldPerMinute: 281,
      csDiffAt15: 0.7,
      goldDiffAt15: 59,
      xpDiffAt15: 160,
      soloqKrChallengerWinRate: 55.53,
    },
  }),


  createChampion({
    id: "anivia",
    goodVs: [
      { championId: "taliyah", score: 4 },
      { championId: "cassiopeia", score: 2 },
      { championId: "neeko", score: 4 },
      { championId: "seraphine", score: 3 },
      { championId: "ryze", score: 3 },
      { championId: "aurora", score: 2 }
    ],

    weakVs: [
      { championId: "syndra", score: 5 },
      { championId: "orianna", score: 5 },
      { championId: "azir", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "bard", score: 3 }
    ],

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
      picks: 35,
      bans: 20,
      presence: 55,
      prioScore: 18,
      wins: 14,
      losses: 21,
      proWinRate: 40,
      kda: 2.8,
      avgBanTurn: 5.6,
      avgPickRound: 1.49,
      blindPickRate: 17.6,
      averageGameTime: "32:47",
      csPerMinute: 4.8,
      damagePerMinute: 467,
      goldPerMinute: 331,
      csDiffAt15: 1.7,
      goldDiffAt15: 248,
      xpDiffAt15: 164,
      soloqKrChallengerWinRate: 62.77,
    },
  }),


  createChampion({
    id: "rakan",
    goodVs: [
      { championId: "renata-glasc", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "braum", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "karma", score: 4 }
    ],

    weakVs: [
      { championId: "bard", score: 5 },
      { championId: "neeko", score: 4 },
      { championId: "alistar", score: 3 },
      { championId: "seraphine", score: 1 },
      { championId: "poppy", score: 4 }
    ],

    synergyWith: [
      { championId: "kaisa", score: 3 },
      { championId: "ezreal", score: 3 },
      { championId: "jhin", score: 4 },
      { championId: "jinx", score: 5 },
      { championId: "caitlyn", score: 2 }
    ],

    mustWith: [
      { championId: "xayah", score: 5 }
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
      picks: 25,
      bans: 11,
      presence: 36,
      prioScore: 9,
      wins: 14,
      losses: 11,
      proWinRate: 56,
      kda: 3.9,
      avgBanTurn: 8.6,
      avgPickRound: 2.2,
      blindPickRate: 32,
      averageGameTime: "32:32",
      csPerMinute: 1.2,
      damagePerMinute: 186,
      goldPerMinute: 273,
      csDiffAt15: 3.2,
      goldDiffAt15: -69,
      xpDiffAt15: 26,
      soloqKrChallengerWinRate: 56.49,
    },
  }),


  createChampion({
    id: "syndra",
    goodVs: [
      { championId: "viktor", score: 4 },
      { championId: "azir", score: 2 },
      { championId: "aurora", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "ryze", score: 3 },
    ],

    weakVs: [
      { championId: "galio", score: 3 },
      { championId: "orianna", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "akali", score: 3 }
    ],

    synergyWith: [
      { championId: "lee-sin", score: 3 },
      { championId: "viego", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "nocturne", score: 4 },
      { championId: "naafiri", score: 2 }
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
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 7,
      bans: 15,
      presence: 22,
      prioScore: 7,
      wins: 2,
      losses: 5,
      proWinRate: 29,
      kda: 1.6,
      avgBanTurn: 8.5,
      avgPickRound: 2.14,
      blindPickRate: 0,
      averageGameTime: "32:30",
      csPerMinute: 9.4,
      damagePerMinute: 760,
      goldPerMinute: 411,
      csDiffAt15: 11.4,
      goldDiffAt15: 461,
      xpDiffAt15: 555,
      soloqKrChallengerWinRate: 54.74,
    },
  }),


  createChampion({
    id: "leona",
    goodVs: [
      { championId: "karma", score: 5 },
      { championId: "nautilus", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "thresh", score: 3 }
    ],

    weakVs: [
      { championId: "bard", score: 5 },
      { championId: "neeko", score: 4 },
      { championId: "alistar", score: 4 },
      { championId: "lulu", score: 3 },
      { championId: "rakan", score: 3 }
    ],

    synergyWith: [
      { championId: "kaisa", score: 3 },
      { championId: "ezreal", score: 4 },
      { championId: "jhin", score: 3 },
      { championId: "caitlyn", score: 2 },
      { championId: "miss-fortune", score: 4 }
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
      picks: 11,
      bans: 8,
      presence: 19,
      prioScore: 6,
      wins: 4,
      losses: 7,
      proWinRate: 36,
      kda: 2,
      avgBanTurn: 7.8,
      avgPickRound: 1.82,
      blindPickRate: 30,
      averageGameTime: "33:23",
      csPerMinute: 1.2,
      damagePerMinute: 178,
      goldPerMinute: 259,
      csDiffAt15: 2.4,
      goldDiffAt15: -47,
      xpDiffAt15: -188,
      soloqKrChallengerWinRate: 57.33,
    },
  }),


  createChampion({
    id: "mel",
    goodVs: [
      { championId: "annie", score: 5 },
      { championId: "aurora", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "ahri", score: 2 },
    ],

    weakVs: [
      { championId: "ahri", score: 4 },
      { championId: "azir", score: 4 },
      { championId: "hwei", score: 4 },
      { championId: "viktor", score: 3 }
    ],

    offers: [
      { type: "burstDamage", strength: 4 },
      { type: "poke", strength: 3 },
      { type: "waveclear", strength: 3 },
      { type: "scaling", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
      { exposedTo: "peel", severity: 1 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Mel",
    image: "/champions/mel.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 25,
      bans: 30,
      presence: 55,
      prioScore: 18,
      wins: 10,
      losses: 15,
      proWinRate: 40,
      kda: 3.5,
      avgBanTurn: 8.2,
      avgPickRound: 1.88,
      blindPickRate: 44,
      averageGameTime: "31:20",
      csPerMinute: 8.8,
      damagePerMinute: 668,
      goldPerMinute: 422,
      csDiffAt15: 8.9,
      goldDiffAt15: 316,
      xpDiffAt15: 433,
      soloqKrChallengerWinRate: 50.98,
    },
  }),


  createChampion({
    id: "ornn",
    goodVs: [
      { championId: "aatrox", score: 4 },
      { championId: "ksante", score: 4 },
      { championId: "zaahen", score: 3 }
    ],

    weakVs: [
      { championId: "gnar", score: 5 },
      { championId: "gwen", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "rumble", score: 3 }
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
      bans: 5,
      presence: 13,
      prioScore: 4,
      wins: 6,
      losses: 2,
      proWinRate: 75,
      kda: 7.9,
      avgBanTurn: 8.4,
      avgPickRound: 1.88,
      blindPickRate: 0,
      averageGameTime: "32:14",
      csPerMinute: 7.6,
      damagePerMinute: 529,
      goldPerMinute: 360,
      csDiffAt15: -12,
      goldDiffAt15: -879,
      xpDiffAt15: -226,
      soloqKrChallengerWinRate: 59.4,
    },
  }),


  createChampion({
    id: "braum",
    goodVs: [
      { championId: "maokai", score: 4 },
      { championId: "milio", score: 3 },
      { championId: "rell", score: 2 },
      { championId: "nautilus", score: 2 }
    ],

    weakVs: [
      { championId: "rakan", score: 5 },
      { championId: "lulu", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "alistar", score: 3 },
      { championId: "thresh", score: 3 }
    ],

    synergyWith: [
      { championId: "lucian", score: 4 },
      { championId: "ezreal", score: 3 },
      { championId: "jinx", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "yunara", score: 4 }
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
    ],

    playerScaling: { mac: 4, tfg: 4, con: 5, iq: 4 },

    name: "Braum",
    image: "/champions/braum.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 2,
      bans: 6,
      presence: 8,
      prioScore: 3,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 3,
      avgBanTurn: 8.7,
      avgPickRound: 2.5,
      blindPickRate: 50,
      averageGameTime: "36:04",
      csPerMinute: 0.7,
      damagePerMinute: 193,
      goldPerMinute: 270,
      csDiffAt15: -6.5,
      goldDiffAt15: -647,
      xpDiffAt15: -792,
      soloqKrChallengerWinRate: 54.78,
    },
  }),

  createChampion({
    id: "jhin",
    goodVs: [
      { championId: "smolder", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "ashe", score: 3 }
    ],

    weakVs: [
      { championId: "caitlyn", score: 4 },
      { championId: "jinx", score: 4 },
      { championId: "xayah", score: 3 }
    ],

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
      picks: 34,
      bans: 8,
      presence: 42,
      prioScore: 12,
      wins: 11,
      losses: 23,
      proWinRate: 32,
      kda: 3.2,
      avgBanTurn: 8.6,
      avgPickRound: 1.79,
      blindPickRate: 20.6,
      averageGameTime: "31:47",
      csPerMinute: 9.6,
      damagePerMinute: 614,
      goldPerMinute: 462,
      csDiffAt15: 0.4,
      goldDiffAt15: -4,
      xpDiffAt15: 103,
      soloqKrChallengerWinRate: 53.43,
    },
  }),

  createChampion({
    id: "aphelios",
    goodVs: [
      { championId: "yunara", score: 3 },
      { championId: "caitlyn", score: 4 },
      { championId: "jhin", score: 3 },
      { championId: "kalista", score: 3 },
      { championId: "ezreal", score: 3 }
    ],

    weakVs: [
      { championId: "xayah", score: 5 },
      { championId: "kaisa", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "jinx", score: 3 }
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
      picks: 14,
      bans: 2,
      presence: 16,
      prioScore: 4,
      wins: 10,
      losses: 4,
      proWinRate: 71,
      kda: 3,
      avgBanTurn: 10,
      avgPickRound: 1.93,
      blindPickRate: 25,
      averageGameTime: "33:24",
      csPerMinute: 9.9,
      damagePerMinute: 783,
      goldPerMinute: 528,
      csDiffAt15: 13.9,
      goldDiffAt15: 474,
      xpDiffAt15: 273,
      soloqKrChallengerWinRate: 53.17,
    },
  }),

  createChampion({
    id: "xayah",
    goodVs: [
      { championId: "aphelios", score: 5 },
      { championId: "lucian", score: 4 },
      { championId: "corki", score: 4 },
      { championId: "kaisa", score: 3 }
    ],

    weakVs: [
      { championId: "sivir", score: 5 },
      { championId: "caitlyn", score: 4 },
      { championId: "ezreal", score: 3 }
    ],

    synergyWith: [
      { championId: "alistar", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "rell", score: 3 }
    ],

    mustWith: [{ championId: "rakan", score: 5 }],

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
      picks: 14,
      bans: 3,
      presence: 17,
      prioScore: 4,
      wins: 9,
      losses: 5,
      proWinRate: 64,
      kda: 3.6,
      avgBanTurn: 8.7,
      avgPickRound: 2.43,
      blindPickRate: 15.4,
      averageGameTime: "32:30",
      csPerMinute: 10.3,
      damagePerMinute: 816,
      goldPerMinute: 525,
      csDiffAt15: -3.3,
      goldDiffAt15: 184,
      xpDiffAt15: 152,
      soloqKrChallengerWinRate: 58.35,
    },
  }),


  createChampion({
    id: "jax",
    goodVs: [
      { championId: "gwen", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "sion", score: 3 },
      { championId: "zaahen", score: 3 }
    ],

    weakVs: [
      { championId: "kennen", score: 5 },
      { championId: "ambessa", score: 4 },
      { championId: "gnar", score: 3 }
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
      picks: 8,
      bans: 10,
      presence: 18,
      prioScore: 6,
      wins: 4,
      losses: 4,
      proWinRate: 50,
      kda: 3.4,
      avgBanTurn: 8,
      avgPickRound: 1.88,
      blindPickRate: 50,
      averageGameTime: "32:32",
      csPerMinute: 8.7,
      damagePerMinute: 543,
      goldPerMinute: 413,
      csDiffAt15: -3.7,
      goldDiffAt15: 197,
      xpDiffAt15: 38,
      soloqKrChallengerWinRate: 56.29,
    },
  }),


  createChampion({
    id: "jayce",
    goodVs: [
      { championId: "ambessa", score: 4 },
      { championId: "ksante", score: 3 },
      { championId: "yorick", score: 3 }
    ],

    weakVs: [
      { championId: "sion", score: 2 },
      { championId: "ornn", score: 2 },
      { championId: "gnar", score: 2 }
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
    roles: ["top", "mid"],
    damageProfile: ["AD"],
    stats: {
      picks: 44,
      bans: 28,
      presence: 72,
      prioScore: 24,
      wins: 24,
      losses: 20,
      proWinRate: 55,
      kda: 2.5,
      avgBanTurn: 6.7,
      avgPickRound: 1.45,
      blindPickRate: 83.7,
      averageGameTime: "31:21",
      csPerMinute: 9.2,
      damagePerMinute: 773,
      goldPerMinute: 422,
      csDiffAt15: 7.3,
      goldDiffAt15: 386,
      xpDiffAt15: -198,
      soloqKrChallengerWinRate: 56.92,
    },
  }),

  createChampion({
    id: "rell",
    goodVs: [
      { championId: "renata-glasc", score: 4 },
      { championId: "thresh", score: 3 },
      { championId: "nami", score: 2 },
      { championId: "neeko", score: 3 }
    ],

    weakVs: [
      { championId: "seraphine", score: 5 },
      { championId: "alistar", score: 5 },
      { championId: "nautilus", score: 2 },
      { championId: "poppy", score: 5 },
    ],

    synergyWith: [
      { championId: "kaisa", score: 3 },
      { championId: "miss-fortune", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "jhin", score: 3 },
      { championId: "jinx", score: 4 }
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
      picks: 7,
      bans: 3,
      presence: 10,
      prioScore: 3,
      wins: 2,
      losses: 5,
      proWinRate: 29,
      kda: 2.8,
      avgBanTurn: 9,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "30:24",
      csPerMinute: 1,
      damagePerMinute: 159,
      goldPerMinute: 258,
      csDiffAt15: 0.9,
      goldDiffAt15: -95,
      xpDiffAt15: -445,
      soloqKrChallengerWinRate: 59.93,
    },
  }),

  createChampion({
    id: "poppy",
    goodVs: [
      { championId: "rell", score: 5 },
      { championId: "pantheon", score: 5 },
      { championId: "ksante", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "vi", score: 2 }
    ],

    weakVs: [
      { championId: "alistar", score: 4 },
      { championId: "braum", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "trundle", score: 4 },
      { championId: "karma", score: 3 },
      { championId: "dr-mundo", score: 3 },
      { championId: "ambessa", score: 3 }
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
      picks: 9,
      bans: 30,
      presence: 39,
      prioScore: 13,
      wins: 5,
      losses: 4,
      proWinRate: 56,
      kda: 3.3,
      avgBanTurn: 6.3,
      avgPickRound: 2.22,
      blindPickRate: 22.2,
      averageGameTime: "32:16",
      csPerMinute: 4.9,
      damagePerMinute: 334,
      goldPerMinute: 342,
      csDiffAt15: -10.9,
      goldDiffAt15: -189,
      xpDiffAt15: -194,
      soloqKrChallengerWinRate: 59.93,
    },
  }),


  createChampion({
    id: "viktor",
    goodVs: [
      { championId: "ahri", score: 2 },
      { championId: "galio", score: 4 },
      { championId: "azir", score: 2 },
      { championId: "mel", score: 3 }
    ],

    weakVs: [
      { championId: "orianna", score: 3 },
      { championId: "ryze", score: 5 },
      { championId: "aurora", score: 4 },
      { championId: "sylas", score: 3 }
    ],
    offers: [
      { type: "waveclear", strength: 5 },
      { type: "zoneControl", strength: 4 },
      { type: "scaling", strength: 5 },
      { type: "sustainedDamage", strength: 4 }
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

    playerScaling: { mec: 4, tfg: 4, con: 5, iq: 4 },

    name: "Viktor",
    image: "/champions/viktor.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 28,
      bans: 8,
      presence: 36,
      prioScore: 9,
      wins: 12,
      losses: 16,
      proWinRate: 43,
      kda: 2.6,
      avgBanTurn: 9.1,
      avgPickRound: 2.11,
      blindPickRate: 57.7,
      averageGameTime: "33:11",
      csPerMinute: 9,
      damagePerMinute: 852,
      goldPerMinute: 395,
      csDiffAt15: 6.9,
      goldDiffAt15: -75,
      xpDiffAt15: 64,
      soloqKrChallengerWinRate: 55.57,
    },
  }),


  createChampion({
    id: "malphite",

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
      picks: 3,
      bans: 8,
      presence: 11,
      prioScore: 4,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 1.8,
      avgBanTurn: 9.1,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "34:15",
      csPerMinute: 8,
      damagePerMinute: 465,
      goldPerMinute: 355,
      csDiffAt15: -18.7,
      goldDiffAt15: -470,
      xpDiffAt15: -671,
      soloqKrChallengerWinRate: 56.47,
    },
  }),


  createChampion({
    id: "annie",
    goodVs: [
      { championId: "hwei", score: 4 },
      { championId: "aurora", score: 4 },
      { championId: "ryze", score: 3 },
      { championId: "galio", score: 3 }
    ],

    weakVs: [
      { championId: "ryze", score: 3 },
      { championId: "ahri", score: 5 },
      { championId: "mel", score: 4 }
    ],

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
      picks: 42,
      bans: 23,
      presence: 65,
      prioScore: 19,
      wins: 21,
      losses: 21,
      proWinRate: 50,
      kda: 2.8,
      avgBanTurn: 8.5,
      avgPickRound: 1.93,
      blindPickRate: 68.3,
      averageGameTime: "32:07",
      csPerMinute: 7.9,
      damagePerMinute: 664,
      goldPerMinute: 372,
      csDiffAt15: 1.2,
      goldDiffAt15: -136,
      xpDiffAt15: -41,
      soloqKrChallengerWinRate: 63.99,
    },
  }),

  createChampion({
    id: "naafiri",
    goodVs: [
      { championId: "dr-mundo", score: 5 },
      { championId: "nocturne", score: 4 },
      { championId: "jarvan-iv", score: 4 }
    ],

    weakVs: [
      { championId: "vi", score: 4 },
      { championId: "pantheon", score: 4 },
      { championId: "xin-zhao", score: 3 }
    ],

    synergyWith: [
      { championId: "lissandra", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "sylas", score: 3 },
      { championId: "ahri", score: 3 },
      { championId: "viktor", score: 2 },
      { championId: "orianna", score: 2 }
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
    roles: ["jungle", "top"],
    damageProfile: ["AD"],
    stats: {
      picks: 24,
      bans: 11,
      presence: 35,
      prioScore: 9,
      wins: 11,
      losses: 13,
      proWinRate: 46,
      kda: 3.5,
      avgBanTurn: 8.3,
      avgPickRound: 2.13,
      blindPickRate: 13.6,
      averageGameTime: "33:05",
      csPerMinute: 7.3,
      damagePerMinute: 544,
      goldPerMinute: 414,
      csDiffAt15: -5.5,
      goldDiffAt15: 12,
      xpDiffAt15: -378,
      soloqKrChallengerWinRate: 53.9,
    },
  }),

  createChampion({
    id: "leblanc",
    goodVs: [
      { championId: "taliyah", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "azir", score: 2 }
    ],

    weakVs: [
      { championId: "galio", score: 4 },
      { championId: "aurora", score: 4 }
    ],

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
      picks: 14,
      bans: 27,
      presence: 41,
      prioScore: 14,
      wins: 8,
      losses: 6,
      proWinRate: 57,
      kda: 5.2,
      avgBanTurn: 7.6,
      avgPickRound: 1.71,
      blindPickRate: 15.4,
      averageGameTime: "33:27",
      csPerMinute: 8.3,
      damagePerMinute: 808,
      goldPerMinute: 414,
      csDiffAt15: 9.9,
      goldDiffAt15: 698,
      xpDiffAt15: 724,
      soloqKrChallengerWinRate: 53.23,
    },
  }),

  createChampion({
    id: "qiyana",
    goodVs: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "ambessa", score: 4 },
      { championId: "wukong", score: 3 },
      { championId: "pantheon", score: 3 }
    ],

    weakVs: [
      { championId: "vi", score: 4 },
      { championId: "dr-mundo", score: 4 },
      { championId: "nocturne", score: 3 },
      { championId: "xin-zhao", score: 3 }
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
      picks: 2,
      bans: 3,
      presence: 5,
      prioScore: 2,
      wins: 0,
      losses: 2,
      proWinRate: 0,
      kda: 0.5,
      avgBanTurn: 7.7,
      avgPickRound: 1.5,
      blindPickRate: 0,
      averageGameTime: "22:43",
      csPerMinute: 6.1,
      damagePerMinute: 406,
      goldPerMinute: 367,
      csDiffAt15: -3,
      goldDiffAt15: -874,
      xpDiffAt15: -1258,
      soloqKrChallengerWinRate: 58.1,
    },
  }),


  createChampion({
    id: "sylas",
    goodVs: [
      { championId: "akali", score: 2 },
      { championId: "viktor", score: 4 }
    ],

    weakVs: [
      { championId: "taliyah", score: 4 },
      { championId: "galio", score: 2 },
      { championId: "ahri", score: 5 }
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
      picks: 14,
      bans: 8,
      presence: 22,
      prioScore: 6,
      wins: 6,
      losses: 8,
      proWinRate: 43,
      kda: 3.1,
      avgBanTurn: 7.4,
      avgPickRound: 2.14,
      blindPickRate: 0,
      averageGameTime: "30:12",
      csPerMinute: 8,
      damagePerMinute: 624,
      goldPerMinute: 402,
      csDiffAt15: -2.3,
      goldDiffAt15: 143,
      xpDiffAt15: 271,
      soloqKrChallengerWinRate: 54.38,
    },
  }),


  createChampion({
    id: "cassiopeia",
    goodVs: [
      { championId: "yone", score: 3 },
      { championId: "aurora", score: 3 },
      { championId: "ahri", score: 3 },
      { championId: "ryze", score: 3 }
    ],

    weakVs: [
      { championId: "galio", score: 5 },
      { championId: "anivia", score: 5 }
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
      picks: 14,
      bans: 13,
      presence: 27,
      prioScore: 10,
      wins: 7,
      losses: 7,
      proWinRate: 50,
      kda: 3.4,
      avgBanTurn: 6.8,
      avgPickRound: 1.29,
      blindPickRate: 0,
      averageGameTime: "31:50",
      csPerMinute: 9.2,
      damagePerMinute: 625,
      goldPerMinute: 410,
      csDiffAt15: -0.7,
      goldDiffAt15: -299,
      xpDiffAt15: -234,
      soloqKrChallengerWinRate: 57.03,
    },
  }),


  createChampion({
    id: "trundle",

    goodVs: [
      { championId: "poppy", score: 5 },
      { championId: "xin-zhao", score: 3 },
      { championId: "pantheon", score: 3 },
      { championId: "vi", score: 2 },
      { championId: "jarvan-iv", score: 2 }
    ],

    weakVs: [
      { championId: "ivern", score: 4 },
      { championId: "skarner", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "lee-sin", score: 3 }
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
      picks: 5,
      bans: 4,
      presence: 9,
      prioScore: 2,
      wins: 1,
      losses: 4,
      proWinRate: 20,
      kda: 2.1,
      avgBanTurn: 8.3,
      avgPickRound: 2.4,
      blindPickRate: 0,
      averageGameTime: "30:31",
      csPerMinute: 5.9,
      damagePerMinute: 338,
      goldPerMinute: 368,
      csDiffAt15: -19,
      goldDiffAt15: -738,
      xpDiffAt15: -1305,
      soloqKrChallengerWinRate: null,
    },
  }),


  createChampion({
    id: "lee-sin",
    goodVs: [
      { championId: "nocturne", score: 3 },
      { championId: "qiyana", score: 3 },
      { championId: "naafiri", score: 2 },
      { championId: "jarvan-iv", score: 5 }
    ],

    weakVs: [
      { championId: "xin-zhao", score: 3 },
      { championId: "pantheon", score: 4 },
      { championId: "poppy", score: 3 },
      { championId: "trundle", score: 3 },
      { championId: "vi", score: 2 }
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
      picks: 19,
      bans: 12,
      presence: 31,
      prioScore: 9,
      wins: 9,
      losses: 10,
      proWinRate: 47,
      kda: 3.4,
      avgBanTurn: 5.8,
      avgPickRound: 2.05,
      blindPickRate: 31.6,
      averageGameTime: "32:20",
      csPerMinute: 6.9,
      damagePerMinute: 503,
      goldPerMinute: 414,
      csDiffAt15: -2.8,
      goldDiffAt15: -40,
      xpDiffAt15: -49,
      soloqKrChallengerWinRate: 57.05,
    },
  }),

  createChampion({
    id: "kennen",
    goodVs: [
      { championId: "jax", score: 5 },
      { championId: "gnar", score: 4 }
    ],

    weakVs: [
      { championId: "rumble", score: 5 },
      { championId: "gwen", score: 4 }
    ],

    offers: [
      { type: "sideLanePressure", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],

    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 },
    ],


    playerScaling: { mec: 4, tfg: 5, clt: 3, con: 3 },

    name: "Kennen",
    image: "/champions/kennen.png",
    roles: ["top"],
    damageProfile: ["AP"],
    stats: {
      picks: 9,
      bans: 9,
      presence: 18,
      prioScore: 5,
      wins: 3,
      losses: 6,
      proWinRate: 33,
      kda: 1.2,
      avgBanTurn: 8.4,
      avgPickRound: 2.22,
      blindPickRate: 12.5,
      averageGameTime: "31:47",
      csPerMinute: 8.4,
      damagePerMinute: 705,
      goldPerMinute: 373,
      csDiffAt15: 16.3,
      goldDiffAt15: 404,
      xpDiffAt15: 105,
      soloqKrChallengerWinRate: 55.84,
    },
  }),


  createChampion({
    id: "yone",
    goodVs: [
      { championId: "galio", score: 3 },
      { championId: "viktor", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "azir", score: 3 }
    ],

    weakVs: [
      { championId: "ahri", score: 5 },
      { championId: "ryze", score: 4 }
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
      picks: 10,
      bans: 6,
      presence: 16,
      prioScore: 4,
      wins: 7,
      losses: 3,
      proWinRate: 70,
      kda: 3.5,
      avgBanTurn: 8.2,
      avgPickRound: 2.2,
      blindPickRate: 22.2,
      averageGameTime: "31:28",
      csPerMinute: 9.6,
      damagePerMinute: 733,
      goldPerMinute: 432,
      csDiffAt15: -5.6,
      goldDiffAt15: -82,
      xpDiffAt15: 298,
      soloqKrChallengerWinRate: 54.63,
    },
  }),


  createChampion({
    id: "zoe",
    goodVs: [
      { championId: "azir", score: 5 },
      { championId: "taliyah", score: 5 },
      { championId: "syndra", score: 3 }
    ],

    weakVs: [
      { championId: "viktor", score: 4 }
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
      picks: 10,
      bans: 8,
      presence: 18,
      prioScore: 6,
      wins: 2,
      losses: 8,
      proWinRate: 20,
      kda: 1.7,
      avgBanTurn: 7.3,
      avgPickRound: 1.9,
      blindPickRate: 44.4,
      averageGameTime: "30:21",
      csPerMinute: 8.7,
      damagePerMinute: 638,
      goldPerMinute: 365,
      csDiffAt15: 0.7,
      goldDiffAt15: -23,
      xpDiffAt15: -291,
      soloqKrChallengerWinRate: 56.32,
    },
  }),


  createChampion({
    id: "lux",
    goodVs: [
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 4 },
      { championId: "heimerdinger", score: 3 },
      { championId: "karma", score: 3 },
      { championId: "nami", score: 3 }
    ],

    weakVs: [
      { championId: "rakan", score: 4 },
      { championId: "alistar", score: 3 },
      { championId: "nautilus", score: 3 }
    ],

    synergyWith: [
      { championId: "caitlyn", score: 5 },
      { championId: "ezreal", score: 2 },
      { championId: "varus", score: 3 },
      { championId: "jhin", score: 3 }
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
      bans: 2,
      presence: 3,
      prioScore: 1,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: null,
      avgBanTurn: 8.5,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "36:04",
      csPerMinute: 1.1,
      damagePerMinute: 244,
      goldPerMinute: 271,
      csDiffAt15: -2,
      goldDiffAt15: 335,
      xpDiffAt15: 754,
      soloqKrChallengerWinRate: 55.59,
    },
  }),


  createChampion({
    id: "yasuo",

    goodVs: [
      { championId: "gnar", score: 3 },
      { championId: "twisted-fate", score: 3 },
    ],

    weakVs: [
      { championId: "renekton", score: 3 },
      { championId: "malphite", score: 3 },
      { championId: "annie", score: 3 }
    ],

    synergyWith: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "sejuani", score: 4 }
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
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "siege", severity: 2 },
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 3, iq: 4 },

    name: "Yasuo",
    image: "/champions/yasuo.png",
    roles: ["mid", "top"],
    damageProfile: ["AD"],
    stats: {
      picks: 3,
      bans: 3,
      presence: 6,
      prioScore: 2,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 2.2,
      avgBanTurn: 4.3,
      avgPickRound: 1.67,
      blindPickRate: 0,
      averageGameTime: "30:43",
      csPerMinute: 8.5,
      damagePerMinute: 500,
      goldPerMinute: 409,
      csDiffAt15: -21,
      goldDiffAt15: -1165,
      xpDiffAt15: -926,
      soloqKrChallengerWinRate: 55.14,
    },
  }),

  createChampion({
    id: "rengar",
    synergyWith: [
      { championId: "orianna", score: 5 }
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
    goodVs: [
      { championId: "ahri", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "hwei", score: 3 },
      { championId: "leblanc", score: 3 },
      { championId: "karma", score: 3 }
    ],

    weakVs: [
      { championId: "taliyah", score: 4 },
      { championId: "kassadin", score: 3 },
      { championId: "yone", score: 4 }
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
      picks: 1,
      bans: 2,
      presence: 3,
      prioScore: 1,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 18,
      avgBanTurn: 9.5,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "50:34",
      csPerMinute: 9.4,
      damagePerMinute: 1241,
      goldPerMinute: 481,
      csDiffAt15: -18,
      goldDiffAt15: -302,
      xpDiffAt15: -741,
      soloqKrChallengerWinRate: 55.48,
    },
  }),


  createChampion({
    id: "olaf",
    goodVs: [
      { championId: "ksante", score: 3 }
    ],

    weakVs: [
      { championId: "renekton", score: 4 }
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
      picks: 4,
      bans: 3,
      presence: 7,
      prioScore: 2,
      wins: 1,
      losses: 3,
      proWinRate: 25,
      kda: 1.7,
      avgBanTurn: 6.7,
      avgPickRound: 2.5,
      blindPickRate: 33.3,
      averageGameTime: "29:51",
      csPerMinute: 7.5,
      damagePerMinute: 440,
      goldPerMinute: 375,
      csDiffAt15: -0.3,
      goldDiffAt15: -512,
      xpDiffAt15: -124,
      soloqKrChallengerWinRate: 61.9,
    },
  }),


  createChampion({
    id: "maokai",
    goodVs: [
      { championId: "ivern", score: 4 },
      { championId: "lillia", score: 3 },
      { championId: "viego", score: 3 }
    ],

    weakVs: [
      { championId: "lee-sin", score: 5 },
      { championId: "naafiri", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "kindred", score: 3 }
    ],

    synergyWith: [
      { championId: "jayce", score: 4 },
      { championId: "corki", score: 4 },
      { championId: "varus", score: 3 },
      { championId: "miss-fortune", score: 3 }
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
      picks: 5,
      bans: 3,
      presence: 8,
      prioScore: 2,
      wins: 3,
      losses: 2,
      proWinRate: 60,
      kda: 3.2,
      avgBanTurn: 3.7,
      avgPickRound: 2.8,
      blindPickRate: 0,
      averageGameTime: "32:25",
      csPerMinute: 6.3,
      damagePerMinute: 584,
      goldPerMinute: 343,
      csDiffAt15: -12.8,
      goldDiffAt15: -778,
      xpDiffAt15: -704,
      soloqKrChallengerWinRate: 56.69,
    },
  }),


  createChampion({
    id: "nidalee",
    goodVs: [
      { championId: "gwen", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "lillia", score: 3 },
      { championId: "viego", score: 3 }
    ],

    weakVs: [
      { championId: "lee-sin", score: 5 },
      { championId: "naafiri", score: 3 },
      { championId: "poppy", score: 3 },
      { championId: "kindred", score: 3 }
    ],

    mustWith: [
      { championId: "renekton", score: 5 },
      { championId: "twisted-fate", score: 4 },
      { championId: "camille", score: 3 }
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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 22,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 100,
      averageGameTime: "23:29",
      csPerMinute: 7.2,
      damagePerMinute: 514,
      goldPerMinute: 505,
      csDiffAt15: -2,
      goldDiffAt15: 1041,
      xpDiffAt15: 1677,
      soloqKrChallengerWinRate: 58.11,
    },
  }),

  createChampion({
    id: "lucian",
    goodVs: [
      { championId: "aphelios", score: 4 },
      { championId: "ezreal", score: 3 },
      { championId: "sivir", score: 3 }
    ],

    weakVs: [
      { championId: "corki", score: 4 },
      { championId: "caitlyn", score: 4 },
      { championId: "xayah", score: 4 },
      { championId: "ashe", score: 3 },
      { championId: "miss-fortune", score: 3 }
    ],

    synergyWith: [
      { championId: "lulu", score: 3 }
    ],

    mustWith: [
      { championId: "braum", score: 4 },
      { championId: "nami", score: 5 },
      { championId: "milio", score: 5 }
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
      picks: 19,
      bans: 11,
      presence: 30,
      prioScore: 9,
      wins: 9,
      losses: 10,
      proWinRate: 47,
      kda: 2.8,
      avgBanTurn: 9.3,
      avgPickRound: 1.79,
      blindPickRate: 33.3,
      averageGameTime: "30:33",
      csPerMinute: 9.9,
      damagePerMinute: 813,
      goldPerMinute: 489,
      csDiffAt15: 2.7,
      goldDiffAt15: 331,
      xpDiffAt15: -120,
      soloqKrChallengerWinRate: 57.47,
    },
  }),

  createChampion({
    id: "irelia",
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
      bans: 1,
      presence: 2,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1.1,
      avgBanTurn: 10,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "40:52",
      csPerMinute: 9.2,
      damagePerMinute: 471,
      goldPerMinute: 373,
      csDiffAt15: -26,
      goldDiffAt15: -496,
      xpDiffAt15: -889,
      soloqKrChallengerWinRate: 53.01,
    },
  }),


  createChampion({
    id: "jinx",
    goodVs: [
      { championId: "aphelios", score: 3 },
      { championId: "ezreal", score: 3 }
    ],

    weakVs: [
      { championId: "kaisa", score: 4 },
      { championId: "yunara", score: 3 },
      { championId: "caitlyn", score: 3 }
    ],

    synergyWith: [
      { championId: "nami", score: 4 },
      { championId: "thresh", score: 4 }
    ],

    mustWith: [{ championId: "lulu", score: 5 },
    { championId: "braum", score: 2 },
    { championId: "milio", score: 5 }
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
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.5,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "29:25",
      csPerMinute: 10,
      damagePerMinute: 267,
      goldPerMinute: 398,
      csDiffAt15: -24,
      goldDiffAt15: -1306,
      xpDiffAt15: -1033,
      soloqKrChallengerWinRate: 56.21,
    },
  }),

  createChampion({
    id: "sejuani",
    goodVs: [
      { championId: "jarvan-iv", score: 3 }
    ],

    weakVs: [
      { championId: "trundle", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "dr-mundo", score: 3 }
    ],

    synergyWith: [
      { championId: "yasuo", score: 4 },
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
      bans: 2,
      presence: 7,
      prioScore: 2,
      wins: 3,
      losses: 2,
      proWinRate: 60,
      kda: 10.4,
      avgBanTurn: 8.5,
      avgPickRound: 2.2,
      blindPickRate: 20,
      averageGameTime: "32:54",
      csPerMinute: 6.7,
      damagePerMinute: 357,
      goldPerMinute: 379,
      csDiffAt15: -7.2,
      goldDiffAt15: 5,
      xpDiffAt15: 83,
      soloqKrChallengerWinRate: 50,
    },
  }),


  createChampion({
    id: "pyke",
    goodVs: [
      { championId: "karma", score: 3 },
      { championId: "rakan", score: 2 }
    ],

    weakVs: [
      { championId: "bard", score: 5 },
      { championId: "lulu", score: 4 },
      { championId: "seraphine", score: 4 }
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
      picks: 6,
      bans: 3,
      presence: 9,
      prioScore: 3,
      wins: 2,
      losses: 4,
      proWinRate: 33,
      kda: 1.4,
      avgBanTurn: 6.3,
      avgPickRound: 1.67,
      blindPickRate: 16.7,
      averageGameTime: "29:35",
      csPerMinute: 1,
      damagePerMinute: 190,
      goldPerMinute: 274,
      csDiffAt15: -5.2,
      goldDiffAt15: -57,
      xpDiffAt15: -787,
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

    mustWith: [
      { championId: "lulu", score: 5 },
      { championId: "braum", score: 4 },
      { championId: "milio", score: 4 }
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
      picks: 0,
      bans: 1,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 9,
      avgPickRound: null,
      blindPickRate: null,
      averageGameTime: null,
      csPerMinute: null,
      damagePerMinute: null,
      goldPerMinute: null,
      csDiffAt15: null,
      goldDiffAt15: null,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 56.98,
    },
  }),


  createChampion({
    id: "yorick",
    goodVs: [
      { championId: "ksante", score: 3 },
      { championId: "gnar", score: 3 },
      { championId: "ambessa", score: 2 }
    ],

    weakVs: [
      { championId: "rumble", score: 4 },
      { championId: "jayce", score: 3 }
    ],

    offers: [
      { type: "splitpush", strength: 5 },
      { type: "sideLanePressure", strength: 5 },
      { type: "waveclear", strength: 3 }
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

    name: "Yorick",
    image: "/champions/yorick.png",
    roles: ["top"],
    damageProfile: ["AD"],
    stats: {
      picks: 28,
      bans: 17,
      presence: 45,
      prioScore: 15,
      wins: 13,
      losses: 15,
      proWinRate: 46,
      kda: 2.4,
      avgBanTurn: 7.8,
      avgPickRound: 1.57,
      blindPickRate: 7.4,
      averageGameTime: "30:40",
      csPerMinute: 9.3,
      damagePerMinute: 632,
      goldPerMinute: 420,
      csDiffAt15: -1.1,
      goldDiffAt15: -43,
      xpDiffAt15: 475,
      soloqKrChallengerWinRate: 50.0,
    },
  }),


  createChampion({
    id: "thresh",
    goodVs: [
      { championId: "braum", score: 3 },
      { championId: "lulu", score: 3 }
    ],

    weakVs: [
      { championId: "rakan", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "neeko", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "bard", score: 3 }
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
      picks: 7,
      bans: 2,
      presence: 9,
      prioScore: 2,
      wins: 4,
      losses: 3,
      proWinRate: 57,
      kda: 3.3,
      avgBanTurn: 8,
      avgPickRound: 1.86,
      blindPickRate: 66.7,
      averageGameTime: "31:53",
      csPerMinute: 1.3,
      damagePerMinute: 154,
      goldPerMinute: 277,
      csDiffAt15: 6.8,
      goldDiffAt15: 85,
      xpDiffAt15: 177,
      soloqKrChallengerWinRate: 58.57,
    },
  }),

  createChampion({
    id: "nunu",
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
    goodVs: [
      { championId: "yorick", score: 5 },
      { championId: "rumble", score: 5 },
      { championId: "ksante", score: 3 },
      { championId: "ambessa", score: 2 }
    ],

    weakVs: [
      { championId: "jayce", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "ornn", score: 3 }
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
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 0,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 2.7,
      avgBanTurn: null,
      avgPickRound: 2.67,
      blindPickRate: 66.7,
      averageGameTime: "32:14",
      csPerMinute: 8.1,
      damagePerMinute: 643,
      goldPerMinute: 409,
      csDiffAt15: -21,
      goldDiffAt15: -974,
      xpDiffAt15: -735,
      soloqKrChallengerWinRate: 55.22,
    },
  }),


  createChampion({
    id: "twisted-fate",
    goodVs: [
      { championId: "aurora", score: 5 },
      { championId: "akali", score: 3 }
    ],

    weakVs: [
      { championId: "ahri", score: 4 },
      { championId: "galio", score: 4 }
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
      picks: 12,
      bans: 9,
      presence: 21,
      prioScore: 6,
      wins: 7,
      losses: 5,
      proWinRate: 58,
      kda: 3.4,
      avgBanTurn: 8.1,
      avgPickRound: 2,
      blindPickRate: 27.3,
      averageGameTime: "32:22",
      csPerMinute: 8.9,
      damagePerMinute: 569,
      goldPerMinute: 472,
      csDiffAt15: -15.6,
      goldDiffAt15: 468,
      xpDiffAt15: -730,
      soloqKrChallengerWinRate: 55.97,
    },
  }),


  createChampion({
    id: "kindred",
    goodVs: [
      { championId: "skarner", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "nidalee", score: 4 },
      { championId: "sejuani", score: 3 },
      { championId: "viego", score: 3 }
    ],

    weakVs: [
      { championId: "lillia", score: 5 },
      { championId: "pantheon", score: 4 },
      { championId: "vi", score: 3 }
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
      soloqKrChallengerWinRate: 57.09,
    },
  }),

  createChampion({
    id: "vayne",
    goodVs: [
      { championId: "kaisa", score: 3 },
      { championId: "ksante", score: 3 },
      { championId: "gnar", score: 3 }
    ],

    weakVs: [
      { championId: "sivir", score: 3 }
    ],

    synergyWith: [{ championId: "lulu", score: 4 }, { championId: "milio", score: 3 }],
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
      picks: 10,
      bans: 6,
      presence: 16,
      prioScore: 5,
      wins: 5,
      losses: 5,
      proWinRate: 50,
      kda: 2.8,
      avgBanTurn: 6.7,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "31:53",
      csPerMinute: 8.3,
      damagePerMinute: 626,
      goldPerMinute: 406,
      csDiffAt15: 2.5,
      goldDiffAt15: 609,
      xpDiffAt15: -68,
      soloqKrChallengerWinRate: 57.79,
    },
  }),


  createChampion({
    id: "viego",
    goodVs: [
      { championId: "skarner", score: 4 },
      { championId: "ivern", score: 4 },
      { championId: "wukong", score: 3 }
    ],

    weakVs: [
      { championId: "pantheon", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "poppy", score: 3 },
      { championId: "kindred", score: 3 },
      { championId: "nocturne", score: 3 }
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
    ],

    playerScaling: { mec: 4, mac: 4, tfg: 3, iq: 4 },

    name: "Viego",
    image: "/champions/viego.png",
    roles: ["jungle"],
    damageProfile: ["AD"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 2.3,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "33:35",
      csPerMinute: 6.1,
      damagePerMinute: 372,
      goldPerMinute: 381,
      csDiffAt15: -3,
      goldDiffAt15: -486,
      xpDiffAt15: -1085,
      soloqKrChallengerWinRate: 55.74,
    },
  }),


  createChampion({
    id: "renata-glasc",
    goodVs: [
      { championId: "braum", score: 3 },
      { championId: "karma", score: 3 },
      { championId: "nami", score: 3 }
    ],

    weakVs: [
      { championId: "lulu", score: 5 },
      { championId: "rakan", score: 5 },
      { championId: "alistar", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "leona", score: 3 }
    ],
    synergyWith: [
      { championId: "kalista", score: 5 },
      { championId: "varus", score: 4 },
      { championId: "corki", score: 3 },
      { championId: "jhin", score: 3 }
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
    ],

    playerScaling: { mac: 4, tfg: 4, clt: 4, iq: 5 },

    name: "Renata Glasc",
    image: "/champions/renata-glasc.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 7,
      bans: 2,
      presence: 9,
      prioScore: 3,
      wins: 4,
      losses: 3,
      proWinRate: 57,
      kda: 4,
      avgBanTurn: 9,
      avgPickRound: 1.57,
      blindPickRate: 14.3,
      averageGameTime: "36:35",
      csPerMinute: 1.1,
      damagePerMinute: 182,
      goldPerMinute: 262,
      csDiffAt15: -1,
      goldDiffAt15: -157,
      xpDiffAt15: 291,
      soloqKrChallengerWinRate: 62.26,
    },
  }),


  createChampion({
    id: "tristana",
    goodVs: [
      { championId: "sivir", score: 5 },
      { championId: "yunara", score: 3 },
      { championId: "draven", score: 2 }
    ],

    weakVs: [
      { championId: "kaisa", score: 5 },
      { championId: "varus", score: 4 },
      { championId: "ezreal", score: 4 }
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
      picks: 4,
      bans: 1,
      presence: 5,
      prioScore: 1,
      wins: 2,
      losses: 2,
      proWinRate: 50,
      kda: 1.7,
      avgBanTurn: 7,
      avgPickRound: 2.25,
      blindPickRate: 25,
      averageGameTime: "28:57",
      csPerMinute: 9.3,
      damagePerMinute: 742,
      goldPerMinute: 477,
      csDiffAt15: -16,
      goldDiffAt15: -489,
      xpDiffAt15: -1176,
      soloqKrChallengerWinRate: 60.51,
    },
  }),
  createChampion({
    id: "elise",
    goodVs: [
      { championId: "renata-glasc", score: 5 },
      { championId: "leona", score: 5 },
      { championId: "lulu", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "neeko", score: 4 }
    ],

    weakVs: [
      { championId: "karma", score: 5 },
      { championId: "alistar", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "braum", score: 4 },
      { championId: "pantheon", score: 4 }
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
      picks: 4,
      bans: 2,
      presence: 6,
      prioScore: 2,
      wins: 3,
      losses: 1,
      proWinRate: 75,
      kda: 3.8,
      avgBanTurn: 7,
      avgPickRound: 1.75,
      blindPickRate: 0,
      averageGameTime: "33:11",
      csPerMinute: 1.2,
      damagePerMinute: 410,
      goldPerMinute: 319,
      csDiffAt15: 2.5,
      goldDiffAt15: 961,
      xpDiffAt15: 20,
      soloqKrChallengerWinRate: 60.58,
    },
  }),
  createChampion({
    id: "zed",
    goodVs: [
      { championId: "taliyah", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "sejuani", score: 4 },
      { championId: "trundle", score: 4 }
    ],

    weakVs: [
      { championId: "skarner", score: 5 },
      { championId: "yone", score: 5 },
      { championId: "naafiri", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "azir", score: 4 }
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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 0,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 2.3,
      avgBanTurn: null,
      avgPickRound: 2.5,
      blindPickRate: 0,
      averageGameTime: "34:08",
      csPerMinute: 9.3,
      damagePerMinute: 598,
      goldPerMinute: 425,
      csDiffAt15: -24.5,
      goldDiffAt15: -1428,
      xpDiffAt15: -720,
      soloqKrChallengerWinRate: 60.15,
    },
  }),
  createChampion({
    id: "garen",
    goodVs: [
      { championId: "ksante", score: 5 }
    ],

    weakVs: [
      { championId: "jax", score: 5 },
      { championId: "sion", score: 4 }
    ],
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
    goodVs: [
      { championId: "yunara", score: 5 },
      { championId: "ezreal", score: 5 },
      { championId: "varus", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "corki", score: 4 }
    ],

    weakVs: [
      { championId: "kaisa", score: 5 },
      { championId: "sivir", score: 4 },
      { championId: "aphelios", score: 4 }
    ],

    synergyWith: [
      { championId: "neeko", score: 5 },
      { championId: "leona", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "braum", score: 3 }],

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
      picks: 9,
      bans: 2,
      presence: 11,
      prioScore: 3,
      wins: 2,
      losses: 7,
      proWinRate: 22,
      kda: 2.2,
      avgBanTurn: 9.5,
      avgPickRound: 2.22,
      blindPickRate: 44.4,
      averageGameTime: "30:17",
      csPerMinute: 9.7,
      damagePerMinute: 728,
      goldPerMinute: 479,
      csDiffAt15: -6.9,
      goldDiffAt15: -435,
      xpDiffAt15: -275,
      soloqKrChallengerWinRate: 55.26,
    },
  }),


  createChampion({
    id: "hwei",
    goodVs: [
      { championId: "annie", score: 5 },
      { championId: "mel", score: 3 },
      { championId: "ahri", score: 3 }
    ],

    weakVs: [
      { championId: "viktor", score: 3 },
      { championId: "taliyah", score: 3 }
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
      picks: 7,
      bans: 0,
      presence: 7,
      prioScore: 1,
      wins: 4,
      losses: 3,
      proWinRate: 57,
      kda: 4.5,
      avgBanTurn: null,
      avgPickRound: 2.14,
      blindPickRate: 28.6,
      averageGameTime: "32:59",
      csPerMinute: 8.9,
      damagePerMinute: 595,
      goldPerMinute: 389,
      csDiffAt15: -4.5,
      goldDiffAt15: -235,
      xpDiffAt15: -69,
      soloqKrChallengerWinRate: 52.85,
    },
  }),


  createChampion({
    id: "volibear",
    goodVs: [
      { championId: "skarner", score: 5 },
      { championId: "renekton", score: 5 },
      { championId: "ambessa", score: 4 }
    ],

    weakVs: [
      { championId: "vi", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "jarvan-iv", score: 4 }
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
      picks: 4,
      bans: 5,
      presence: 9,
      prioScore: 3,
      wins: 3,
      losses: 1,
      proWinRate: 75,
      kda: 4.7,
      avgBanTurn: 6.6,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "31:55",
      csPerMinute: 7.7,
      damagePerMinute: 765,
      goldPerMinute: 464,
      csDiffAt15: 15.2,
      goldDiffAt15: 313,
      xpDiffAt15: 284,
      soloqKrChallengerWinRate: 57.75,
    },
  }),


  createChampion({
    id: "yuumi",
    goodVs: [
      { championId: "karma", score: 3 }
    ],

    weakVs: [
      { championId: "thresh", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "seraphine", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "alistar", score: 3 }
    ],

    synergyWith: [
      { championId: "sivir", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "aphelios", score: 2 },
      { championId: "twitch", score: 2 },
      { championId: "yunara", score: 3 },
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
      bans: 1,
      presence: 4,
      prioScore: 1,
      wins: 3,
      losses: 0,
      proWinRate: 100,
      kda: 25,
      avgBanTurn: 7,
      avgPickRound: 1.67,
      blindPickRate: 33.3,
      averageGameTime: "33:45",
      csPerMinute: 0.6,
      damagePerMinute: 299,
      goldPerMinute: 305,
      csDiffAt15: -10.3,
      goldDiffAt15: -164,
      xpDiffAt15: 466,
      soloqKrChallengerWinRate: 44.85,
    },
  }),


  createChampion({
    id: "graves",
    goodVs: [
      { championId: "xin-zhao", score: 5 },
      { championId: "viego", score: 4 }
    ],

    weakVs: [
      { championId: "vi", score: 5 },
      { championId: "kindred", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "lee-sin", score: 4 }
    ],

    offers: [
      { type: "earlyPrio", strength: 4 },
      { type: "objectiveControl", strength: 3 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "scaling", severity: 1 },
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
    goodVs: [
      { championId: "sivir", score: 4 },
      { championId: "corki", score: 3 },
      { championId: "ashe", score: 3 }
    ],

    weakVs: [
      { championId: "caitlyn", score: 5 },
      { championId: "ashe", score: 4 },
      { championId: "yunara", score: 5 }
    ],

    mustWith: [
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 5 }
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
      prioScore: 1,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 4.9,
      avgBanTurn: null,
      avgPickRound: 1.67,
      blindPickRate: 0,
      averageGameTime: "34:25",
      csPerMinute: 11.4,
      damagePerMinute: 875,
      goldPerMinute: 530,
      csDiffAt15: -5,
      goldDiffAt15: -310,
      xpDiffAt15: -210,
      soloqKrChallengerWinRate: 61.17,
    },
  }),


  createChampion({
    id: "milio",
    goodVs: [
      { championId: "nami", score: 3 },
      { championId: "rakan", score: 4 },
      { championId: "karma", score: 2 }
    ],

    weakVs: [
      { championId: "nautilus", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "lulu", score: 3 },
      { championId: "neeko", score: 2 }
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
      prioScore: 2,
      wins: 5,
      losses: 7,
      proWinRate: 42,
      kda: 4.9,
      avgBanTurn: null,
      avgPickRound: 2.25,
      blindPickRate: 27.3,
      averageGameTime: "31:30",
      csPerMinute: 0.9,
      damagePerMinute: 164,
      goldPerMinute: 256,
      csDiffAt15: -0.1,
      goldDiffAt15: -72,
      xpDiffAt15: 192,
      soloqKrChallengerWinRate: 53.13,
    },
  }),


  createChampion({
    id: "gragas",
    goodVs: [
      { championId: "ksante", score: 5 },
      { championId: "sion", score: 5 },
      { championId: "gnar", score: 4 },
      { championId: "ambessa", score: 4 },
      { championId: "aatrox", score: 4 }
    ],

    weakVs: [
      { championId: "yorick", score: 5 },
      { championId: "renekton", score: 4 },
      { championId: "rumble", score: 4 },
      { championId: "olaf", score: 4 },
      { championId: "jayce", score: 4 }
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
    goodVs: [
      { championId: "ksante", score: 3 },
      { championId: "sion", score: 3 }
    ],

    weakVs: [
      { championId: "zaahen", score: 3 },
      { championId: "ambessa", score: 2 }
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
      picks: 3,
      bans: 1,
      presence: 4,
      prioScore: 1,
      wins: 1,
      losses: 2,
      proWinRate: 33,
      kda: 1.9,
      avgBanTurn: 8,
      avgPickRound: 1.67,
      blindPickRate: 0,
      averageGameTime: "39:31",
      csPerMinute: 8.9,
      damagePerMinute: 609,
      goldPerMinute: 384,
      csDiffAt15: 3.5,
      goldDiffAt15: 493,
      xpDiffAt15: 471,
      soloqKrChallengerWinRate: 63.21,
    },
  }),


  createChampion({
    id: "draven",
    goodVs: [
      { championId: "lucian", score: 5 },
      { championId: "corki", score: 4 },
      { championId: "kalista", score: 4 }
    ],

    weakVs: [
      { championId: "tristana", score: 5 },
      { championId: "varus", score: 4 },
      { championId: "kaisa", score: 4 }
    ],

    offers: [
      { type: "earlyPrio", strength: 5 },
      { type: "burstDamage", strength: 4 },
      { type: "siege", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 3 },
      { exposedTo: "backlineAccess", severity: 3 },
      { exposedTo: "pick", severity: 2 },
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 5, tfg: 4, clt: 2, con: 4 },

    name: "Draven",
    image: "/champions/draven.png",
    roles: ["adc"],
    damageProfile: ["AD"],
    stats: {
      picks: 0,
      bans: 3,
      presence: 3,
      prioScore: 1,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 6.3,
      avgPickRound: null,
      blindPickRate: null,
      averageGameTime: null,
      csPerMinute: null,
      damagePerMinute: null,
      goldPerMinute: null,
      csDiffAt15: null,
      goldDiffAt15: null,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 55.06,
    },
  }),


  createChampion({
    id: "smolder",
    goodVs: [
      { championId: "hwei", score: 5 },
      { championId: "galio", score: 5 },
      { championId: "corki", score: 4 },
      { championId: "miss-fortune", score: 4 },
      { championId: "zeri", score: 4 }
    ],

    weakVs: [
      { championId: "tristana", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "azir", score: 4 },
      { championId: "yone", score: 4 }
    ],

    synergyWith: [
      { championId: "braum", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "tahm-kench", score: 3 }
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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.3,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "30:27",
      csPerMinute: 10.3,
      damagePerMinute: 668,
      goldPerMinute: 388,
      csDiffAt15: 14,
      goldDiffAt15: -349,
      xpDiffAt15: 72,
      soloqKrChallengerWinRate: 59.49,
    },
  }),
  createChampion({
    id: "kalista",
    goodVs: [
      { championId: "varus", score: 3 },
      { championId: "corki", score: 3 },
      { championId: "lucian", score: 3 }
    ],

    weakVs: [
      { championId: "miss-fortune", score: 3 },
      { championId: "aphelios", score: 3 }
    ],

    synergyWith: [
      { championId: "renata-glasc", score: 5 },
      { championId: "alistar", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "neeko", score: 3 }
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
      picks: 7,
      bans: 4,
      presence: 11,
      prioScore: 4,
      wins: 4,
      losses: 3,
      proWinRate: 57,
      kda: 3.3,
      avgBanTurn: 7,
      avgPickRound: 1.57,
      blindPickRate: 42.9,
      averageGameTime: "36:35",
      csPerMinute: 9.8,
      damagePerMinute: 815,
      goldPerMinute: 496,
      csDiffAt15: 8.9,
      goldDiffAt15: 14,
      xpDiffAt15: -321,
      soloqKrChallengerWinRate: 52.87,
    },
  }),
  createChampion({
    id: "blitzcrank",
    goodVs: [
      { championId: "karma", score: 5 },
      { championId: "pyke", score: 5 },
      { championId: "thresh", score: 4 },
      { championId: "renata-glasc", score: 4 },
      { championId: "bard", score: 4 }
    ],

    weakVs: [
      { championId: "rakan", score: 5 },
      { championId: "alistar", score: 4 },
      { championId: "neeko", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "braum", score: 4 }
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
      picks: 1,
      bans: 2,
      presence: 3,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1.8,
      avgBanTurn: 9,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "43:49",
      csPerMinute: 0.7,
      damagePerMinute: 245,
      goldPerMinute: 244,
      csDiffAt15: -2,
      goldDiffAt15: -916,
      xpDiffAt15: -269,
      soloqKrChallengerWinRate: 57.25,
    },
  }),

  createChampion({
    id: "diana",
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
      soloqKrChallengerWinRate: 52.38,
    },
  }),


  createChampion({
    id: "veigar",
    goodVs: [
      { championId: "azir", score: 5 }
    ],

    weakVs: [
      { championId: "ahri", score: 4 }
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
    goodVs: [
      { championId: "sion", score: 5 }
    ],

    weakVs: [
      { championId: "rumble", score: 5 }
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
      soloqKrChallengerWinRate: 57.02,
    },
  }),


  createChampion({
    id: "sett",
    goodVs: [
      { championId: "sion", score: 5 },
      { championId: "chogath", score: 4 }
    ],

    offers: [
      { type: "frontline", strength: 3 },
      { type: "engage", strength: 3 },
      { type: "burstDamage", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
    ],

    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Sett",
    image: "/champions/sett.png",
    roles: ["top"],
    damageProfile: ["AD", "TRUE"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 2.4,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 100,
      averageGameTime: "43:49",
      csPerMinute: 0.8,
      damagePerMinute: 347,
      goldPerMinute: 270,
      csDiffAt15: 2,
      goldDiffAt15: 916,
      xpDiffAt15: 269,
      soloqKrChallengerWinRate: 51.18,
    },
  }),


  createChampion({
    id: "vex",
    goodVs: [
      { championId: "leblanc", score: 3 },
      { championId: "ahri", score: 2 }
    ],

    offers: [
      { type: "burstDamage", strength: 4 },
      { type: "antiDive", strength: 3 },
      { type: "pick", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "peel", severity: 2 },
      { exposedTo: "frontline", severity: 2 },
    ],

    playerScaling: { mec: 4, tfg: 3, con: 3, iq: 4 },

    name: "Vex",
    image: "/champions/vex.png",
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 0,
      bans: 1,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 9,
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
    goodVs: [
      { championId: "ksante", score: 2 },
      { championId: "sion", score: 2 },
      { championId: "camille", score: 4 }
    ],

    weakVs: [
      { championId: "alistar", score: 5 },
      { championId: "jax", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "yorick", score: 4 }
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
      bans: 3,
      presence: 10,
      prioScore: 3,
      wins: 5,
      losses: 2,
      proWinRate: 71,
      kda: 6.1,
      avgBanTurn: 5.3,
      avgPickRound: 1.71,
      blindPickRate: 50,
      averageGameTime: "30:28",
      csPerMinute: 5.8,
      damagePerMinute: 459,
      goldPerMinute: 379,
      csDiffAt15: -8.2,
      goldDiffAt15: -177,
      xpDiffAt15: 24,
      soloqKrChallengerWinRate: 54.06,
    },
  }),


  createChampion({
    id: "darius",
    goodVs: [
      { championId: "ambessa", score: 5 }
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
    goodVs: [
      { championId: "xin-zhao", score: 5 },
      { championId: "rengar", score: 4 }
    ],

    synergyWith: [
      { championId: "orianna", score: 5 },
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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 1,
      wins: 2,
      losses: 0,
      proWinRate: 100,
      kda: 6.8,
      avgBanTurn: null,
      avgPickRound: 1.5,
      blindPickRate: 0,
      averageGameTime: "28:41",
      csPerMinute: 8.3,
      damagePerMinute: 849,
      goldPerMinute: 584,
      csDiffAt15: 7.5,
      goldDiffAt15: 2200,
      xpDiffAt15: 654,
      soloqKrChallengerWinRate: 54.55,
    },
  }),

  createChampion({
    id: "mordekaiser",
    goodVs: [
      { championId: "yorick", score: 5 },
      { championId: "sion", score: 4 }
    ],

    weakVs: [
      { championId: "ornn", score: 5 },
      { championId: "gnar", score: 5 },
      { championId: "ksante", score: 4 }
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
    goodVs: [
      { championId: "vi", score: 5 },
      { championId: "leona", score: 3 }
    ],

    synergyWith: [
      { championId: "caitlyn", score: 4 },
      { championId: "varus", score: 3 }
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
    roles: ["support", "mid", "jungle"],
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
    goodVs: [
      { championId: "gragas", score: 5 },
      { championId: "ksante", score: 4 },
      { championId: "gwen", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "gnar", score: 4 }
    ],

    weakVs: [
      { championId: "renekton", score: 5 },
      { championId: "malphite", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "aatrox", score: 4 }
    ],

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
    goodVs: [
      { championId: "taliyah", score: 5 },
      { championId: "syndra", score: 5 },
      { championId: "sylas", score: 4 }
    ],

    weakVs: [
      { championId: "ahri", score: 5 },
      { championId: "akali", score: 4 },
      { championId: "ryze", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "yone", score: 4 }
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
      { type: "sideLanePressure", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 },
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
    goodVs: [
      { championId: "galio", score: 4 },
      { championId: "aurora", score: 3 }
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
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: null,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "27:23",
      csPerMinute: 9.8,
      damagePerMinute: 677,
      goldPerMinute: 467,
      csDiffAt15: 21,
      goldDiffAt15: 926,
      xpDiffAt15: 771,
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
    goodVs: [
      { championId: "wukong", score: 5 }
    ],

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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.8,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "23:29",
      csPerMinute: 6.4,
      damagePerMinute: 710,
      goldPerMinute: 353,
      csDiffAt15: 2,
      goldDiffAt15: -1041,
      xpDiffAt15: -1677,
      soloqKrChallengerWinRate: 58.29,
    },
  }),


  createChampion({
    id: "senna",
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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 1,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 2.8,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "30:56",
      csPerMinute: 8.4,
      damagePerMinute: 698,
      goldPerMinute: 421,
      csDiffAt15: -27,
      goldDiffAt15: -822,
      xpDiffAt15: -1085,
      soloqKrChallengerWinRate: 56.57,
    },
  }),


  createChampion({
    id: "lillia",
    offers: [
      { type: "burstDamage", strength: 3 },
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 }
    ],

    needs: [
      { type: "frontline", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "dive", severity: 2 },
      { exposedTo: "backlineAccess", severity: 2 },
    ],


    playerScaling: { mec: 4, mac: 4, tfg: 4, iq: 4 },

    name: "Lillia",
    image: "/champions/lillia.png",
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
      soloqKrChallengerWinRate: 48.02,
    },
  }),


  createChampion({
    id: "skarner",
    goodVs: [
      { championId: "pantheon", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "vi", score: 3 }
    ],

    weakVs: [
      { championId: "dr-mundo", score: 4 }
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
      picks: 20,
      bans: 18,
      presence: 38,
      prioScore: 12,
      wins: 11,
      losses: 9,
      proWinRate: 55,
      kda: 3.1,
      avgBanTurn: 8.2,
      avgPickRound: 1.75,
      blindPickRate: 26.3,
      averageGameTime: "30:42",
      csPerMinute: 6.6,
      damagePerMinute: 448,
      goldPerMinute: 372,
      csDiffAt15: -9,
      goldDiffAt15: -240,
      xpDiffAt15: -579,
      soloqKrChallengerWinRate: 50.2,
    },
  }),


  createChampion({
    id: "ziggs",
    goodVs: [
      { championId: "viktor", score: 5 },
      { championId: "lucian", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "azir", score: 4 }
    ],

    weakVs: [
      { championId: "zeri", score: 5 },
      { championId: "caitlyn", score: 4 },
      { championId: "senna", score: 4 },
      { championId: "jinx", score: 4 },
      { championId: "kaisa", score: 4 }
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
      picks: 11,
      bans: 6,
      presence: 17,
      prioScore: 5,
      wins: 6,
      losses: 5,
      proWinRate: 55,
      kda: 4.8,
      avgBanTurn: 4.3,
      avgPickRound: 1.82,
      blindPickRate: 22.2,
      averageGameTime: "32:20",
      csPerMinute: 9.4,
      damagePerMinute: 903,
      goldPerMinute: 463,
      csDiffAt15: 3.2,
      goldDiffAt15: 113,
      xpDiffAt15: 381,
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
      picks: 4,
      bans: 1,
      presence: 5,
      prioScore: 1,
      wins: 3,
      losses: 1,
      proWinRate: 75,
      kda: 3.2,
      avgBanTurn: 9,
      avgPickRound: 2.25,
      blindPickRate: 0,
      averageGameTime: "36:40",
      csPerMinute: 9.2,
      damagePerMinute: 679,
      goldPerMinute: 415,
      csDiffAt15: 2.7,
      goldDiffAt15: 99,
      xpDiffAt15: -119,
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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 0,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 2.6,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "28:52",
      csPerMinute: 8.5,
      damagePerMinute: 842,
      goldPerMinute: 377,
      csDiffAt15: -20,
      goldDiffAt15: -364,
      xpDiffAt15: -450,
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
    goodVs: [
      { championId: "gwen", score: 5 }
    ],

    weakVs: [
      { championId: "sion", score: 5 },
      { championId: "ahri", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "aurora", score: 4 }
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
      { type: "sustainedDamage", strength: 4 },
      { type: "objectiveControl", strength: 4 },
      { type: "zoneControl", strength: 2 }
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "earlyPrio", severity: 1 },
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
      soloqKrChallengerWinRate: 53.39,
    },
  }),
  createChampion({
    id: "evelynn",
    offers: [
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
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
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
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
      soloqKrChallengerWinRate: 49.7,
    },
  }),
  createChampion({
    id: "janna",
    goodVs: [
      { championId: "rakan", score: 5 }
    ],

    weakVs: [
      { championId: "alistar", score: 5 }
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
    ],


    playerScaling: { mac: 4, tfg: 3, con: 3, iq: 4 },

    name: "Janna",
    image: "/champions/janna.png",
    roles: ["support"],
    damageProfile: ["AP"],
    stats: {
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 2,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: null,
      averageGameTime: "40:45",
      csPerMinute: 1.1,
      damagePerMinute: 144,
      goldPerMinute: 243,
      csDiffAt15: 5,
      goldDiffAt15: -50,
      xpDiffAt15: -740,
      soloqKrChallengerWinRate: 55.58,
    },
  }),
  createChampion({
    id: "karthus",
    offers: [
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
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
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [

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
    goodVs: [
      { championId: "ryze", score: 4 }
    ],
    offers: [
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [

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
      { type: "earlyPrio", strength: 3 },
      { type: "objectiveControl", strength: 3 },
      { type: "roamPressure", strength: 3 }
    ],

    needs: [
      { type: "followUp", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "disengage", severity: 2 },
      { exposedTo: "zoneControl", severity: 1 },
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
      { type: "sideLanePressure", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 },
    ],


    playerScaling: { mec: 3, tfg: 3, con: 3, iq: 2 },

    name: "Nasus",
    image: "/champions/nasus.png",
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
      soloqKrChallengerWinRate: 51.22,
    },
  }),
  createChampion({
    id: "quinn",
    offers: [
      { type: "sideLanePressure", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 1 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 2 },
      { exposedTo: "siege", severity: 1 },
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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 11,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: null,
      averageGameTime: "46:59",
      csPerMinute: 7.9,
      damagePerMinute: 1141,
      goldPerMinute: 470,
      csDiffAt15: -1,
      goldDiffAt15: -468,
      xpDiffAt15: -36,
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
      soloqKrChallengerWinRate: 51.8,
    },
  }),
  createChampion({
    id: "udyr",
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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 1,
      wins: 0,
      losses: 2,
      proWinRate: 0,
      kda: 0.5,
      avgBanTurn: null,
      avgPickRound: 1.5,
      blindPickRate: 0,
      averageGameTime: "29:49",
      csPerMinute: 8.4,
      damagePerMinute: 403,
      goldPerMinute: 331,
      csDiffAt15: 8,
      goldDiffAt15: -186,
      xpDiffAt15: 312,
      soloqKrChallengerWinRate: 56.81,
    },
  }),
  createChampion({
    id: "urgot",
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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 2.6,
      avgBanTurn: null,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "43:17",
      csPerMinute: 8.1,
      damagePerMinute: 775,
      goldPerMinute: 471,
      csDiffAt15: 2,
      goldDiffAt15: 461,
      xpDiffAt15: -842,
      soloqKrChallengerWinRate: 57.89,
    },
  }),
  createChampion({
    id: "zac",
    goodVs: [
      { championId: "udyr", score: 5 },
      { championId: "gnar", score: 5 },
      { championId: "camille", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "rumble", score: 4 }
    ],

    weakVs: [
      { championId: "skarner", score: 5 },
      { championId: "poppy", score: 4 },
      { championId: "ksante", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "ornn", score: 4 }
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
    goodVs: [
      { championId: "lulu", score: 5 },
      { championId: "ashe", score: 5 },
      { championId: "alistar", score: 4 }
    ],

    weakVs: [
      { championId: "maokai", score: 5 },
      { championId: "nami", score: 4 },
      { championId: "bard", score: 4 },
      { championId: "leona", score: 4 }
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
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.6,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 100,
      averageGameTime: "23:29",
      csPerMinute: 5,
      damagePerMinute: 811,
      goldPerMinute: 332,
      csDiffAt15: -79,
      goldDiffAt15: -2893,
      xpDiffAt15: -3333,
      soloqKrChallengerWinRate: 50.5,
    },
  }),
  createChampion({
    id: "ivern",
    goodVs: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "nidalee", score: 4 },
      { championId: "skarner", score: 4 },
      { championId: "sejuani", score: 4 }
    ],

    weakVs: [
      { championId: "trundle", score: 5 },
      { championId: "lillia", score: 4 },
      { championId: "viego", score: 4 },
      { championId: "pantheon", score: 4 }
    ],
    offers: [
      { type: "peel", strength: 4 },
      { type: "antiDive", strength: 4 },
      { type: "disengage", strength: 3 },
      { type: "frontline", strength: 2 }
    ],

    needs: [
      { type: "engage", priority: 2 }
    ],
    weaknesses: [
      { exposedTo: "poke", severity: 3 },
      { exposedTo: "siege", severity: 2 },
    ],


    playerScaling: { mec: 2, mac: 4, tfg: 3, iq: 4 },

    name: "Ivern",
    image: "/champions/ivern.png",
    roles: ["jungle"],
    damageProfile: ["AP"],
    stats: {
      picks: 0,
      bans: 1,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 8,
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
    synergyWith: [{ championId: "leona", score: 4 }, { championId: "alistar", score: 4 }, { championId: "sona", score: 3 }],
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
];


const mergeRelations = (relations: Champion["goodVs"]): Champion["goodVs"] => {
  const byId = new Map<string, Champion["goodVs"][number]>();

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

const derivedGoodVsByChampionId = new Map<string, Champion["goodVs"]>();

for (const champion of baseChampions) {
  for (const relation of champion.weakVs) {
    const current = derivedGoodVsByChampionId.get(relation.championId) ?? [];
    current.push({
      championId: champion.id,
      score: relation.score,
    });
    derivedGoodVsByChampionId.set(relation.championId, current);
  }
}


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
  goodVs: mergeRelations([
    ...champion.goodVs,
    ...(derivedGoodVsByChampionId.get(champion.id) ?? []),
  ]),
  weakVs: mergeRelations(champion.weakVs),
  synergyWith: mergeRelations(champion.synergyWith),
  mustWith: mergeRelations(champion.mustWith),
}));

export const championsById = Object.fromEntries(champions.map((champion) => [champion.id, champion]));