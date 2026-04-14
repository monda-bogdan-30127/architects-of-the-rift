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
    weakVs: [
      { championId: "aurelion-sol", score: 5 },
      { championId: "sylas", score: 3 },
      { championId: "akali", score: 4 }
    ],
    goodVs: [
      { championId: "viktor", score: 5 },
      { championId: "syndra", score: 5 },
      { championId: "taliyah", score: 4 },
      { championId: "aurora", score: 3 },
      { championId: "leblanc", score: 2 }
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
      picks: 30,
      bans: 163,
      presence: 193.0,
      prioScore: 83.0,
      wins: 13,
      losses: 17,
      proWinRate: 43.0,
      kda: 3.9,
      avgBanTurn: 3.8,
      avgPickRound: 1.83,
      blindPickRate: 76.7,
      averageGameTime: "32:41",
      csPerMinute: 8.7,
      damagePerMinute: 779,
      goldPerMinute: 421,
      csDiffAt15: 5.9,
      goldDiffAt15: 313,
      xpDiffAt15: 165,
      soloqKrChallengerWinRate: 53.4,
    },
  }),
  createChampion({
    id: "ambessa",
    weakVs: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "volibear", score: 5 },
      { championId: "jayce", score: 4 },
      { championId: "renekton", score: 5 },
      { championId: "gwen", score: 3 }
    ],
    goodVs: [
      { championId: "ksante", score: 5 },
      { championId: "jax", score: 5 },
      { championId: "sion", score: 3 },
      { championId: "reksai", score: 4 },
      { championId: "wukong", score: 4 }
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
      picks: 51,
      bans: 91,
      presence: 142.0,
      prioScore: 55.0,
      wins: 25,
      losses: 26,
      proWinRate: 49.0,
      kda: 2.3,
      avgBanTurn: 3.6,
      avgPickRound: 2.04,
      blindPickRate: 62.0,
      averageGameTime: "31:30",
      csPerMinute: 7.8,
      damagePerMinute: 678,
      goldPerMinute: 383,
      csDiffAt15: -1.4,
      goldDiffAt15: -126,
      xpDiffAt15: -97,
      soloqKrChallengerWinRate: 56,
    },
  }),
  createChampion({
    id: "jarvan-iv",
    goodVs: [
      { championId: "sejuani", score: 2 },
      { championId: "maoki", score: 2 },
      { championId: "pantheon", score: 4 },
      { championId: "ambessa", score: 4 },
      { championId: "malphite", score: 4 }
    ],
    weakVs: [
      { championId: "naafiri", score: 4 },
      { championId: "qiyana", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "poppy", score: 3 }
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
      picks: 50,
      bans: 81,
      presence: 131.0,
      prioScore: 53.0,
      wins: 30,
      losses: 20,
      proWinRate: 60.0,
      kda: 4.5,
      avgBanTurn: 4.5,
      avgPickRound: 1.6,
      blindPickRate: 70.0,
      averageGameTime: "31:57",
      csPerMinute: 6.5,
      damagePerMinute: 460,
      goldPerMinute: 396,
      csDiffAt15: -0.6,
      goldDiffAt15: 114,
      xpDiffAt15: 11,
      soloqKrChallengerWinRate: 55,
    },
  }),
  createChampion({
    id: "rumble",
    goodVs: [
      { championId: "kennen", score: 5 },
      { championId: "yorick", score: 5 },
      { championId: "aatrox", score: 4 },
      { championId: "ksante", score: 2 }
    ],

    weakVs: [
      { championId: "gnar", score: 3 },
      { championId: "gwen", score: 3 },
      { championId: "sion", score: 2 },
      { championId: "aurora", score: 2 },
      { championId: "galio", score: 3 }
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
      picks: 53,
      bans: 72,
      presence: 125.0,
      prioScore: 52.0,
      wins: 28,
      losses: 25,
      proWinRate: 53.0,
      kda: 2.8,
      avgBanTurn: 4.1,
      avgPickRound: 1.43,
      blindPickRate: 92.5,
      averageGameTime: "32:57",
      csPerMinute: 8.1,
      damagePerMinute: 797,
      goldPerMinute: 396,
      csDiffAt15: 4.2,
      goldDiffAt15: 314,
      xpDiffAt15: 266,
      soloqKrChallengerWinRate: 60,
    },
  }),
  createChampion({
    id: "vi",
    goodVs: [
      { championId: "maokai", score: 3 },
      { championId: "sejuani", score: 2 },
    ],

    weakVs: [
      { championId: "pantheon", score: 3 },
      { championId: "zaahen", score: 3 },
      { championId: "poppy", score: 3 },
      { championId: "xin-zhao", score: 2 }
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
      picks: 39,
      bans: 81,
      presence: 120.0,
      prioScore: 50.0,
      wins: 16,
      losses: 23,
      proWinRate: 41.0,
      kda: 2.8,
      avgBanTurn: 4.1,
      avgPickRound: 1.69,
      blindPickRate: 74.4,
      averageGameTime: "32:42",
      csPerMinute: 6.7,
      damagePerMinute: 387,
      goldPerMinute: 380,
      csDiffAt15: 3.1,
      goldDiffAt15: 88,
      xpDiffAt15: 254,
      soloqKrChallengerWinRate: 55.57,
    },
  }),
  createChampion({
    id: "neeko",
    weakVs: [{ championId: "alistar", score: 2 }, { championId: "janna", score: 3 }, { championId: "braum", score: 2 }, { championId: "seraphine", score: 5 }, { championId: "lulu", score: 3 }],
    goodVs: [
      { championId: "rakan", score: 5 },
      { championId: "leona", score: 5 },
      { championId: "rell", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "milio", score: 3 }
    ],
    synergyWith: [{ championId: "caitlyn", score: 5 }, { championId: "kaisa", score: 5 }, { championId: "seraphine", score: 4 }, { championId: "kalista", score: 3 }],
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
      picks: 45,
      bans: 69,
      presence: 114.0,
      prioScore: 46.0,
      wins: 20,
      losses: 25,
      proWinRate: 44.0,
      kda: 2.9,
      avgBanTurn: 4.9,
      avgPickRound: 1.58,
      blindPickRate: 63.6,
      averageGameTime: "32:39",
      csPerMinute: 1.2,
      damagePerMinute: 389,
      goldPerMinute: 275,
      csDiffAt15: 0.1,
      goldDiffAt15: 196,
      xpDiffAt15: 17,
      soloqKrChallengerWinRate: 56.7,
    },
  }),
  createChampion({
    id: "nautilus",
    goodVs: [
      { championId: "karma", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "lulu", score: 3 },
      { championId: "thresh", score: 2 }
    ],
    weakVs: [
      { championId: "leona", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "poppy", score: 3 },
      { championId: "rakan", score: 2 },
      { championId: "rell", score: 2 }
    ],
    synergyWith: [{ championId: "varus", score: 5 }, { championId: "kalista", score: 3 }, { championId: "kaisa", score: 4 }, { championId: "rumble", score: 4 }],
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
      picks: 50,
      bans: 62,
      presence: 112.0,
      prioScore: 45.0,
      wins: 21,
      losses: 29,
      proWinRate: 42.0,
      kda: 2.5,
      avgBanTurn: 6.6,
      avgPickRound: 1.52,
      blindPickRate: 48.0,
      averageGameTime: "32:51",
      csPerMinute: 1.0,
      damagePerMinute: 201,
      goldPerMinute: 257,
      csDiffAt15: 2.5,
      goldDiffAt15: -42,
      xpDiffAt15: 10,
      soloqKrChallengerWinRate: 56,
    },
  }),
  createChampion({
    id: "varus",
    goodVs: [
      { championId: "jhin", score: 4 },
      { championId: "ashe", score: 3 },
      { championId: "sivir", score: 2 },
      { championId: "yunara", score: 2 },
      { championId: "ezreal", score: 1 }
    ],
    weakVs: [{ championId: "yasuo", score: 3 }, { championId: "braum", score: 3 }, { championId: "nilah", score: 3 }, { championId: "lucian", score: 4 }, { championId: "kaisa", score: 3 }],
    synergyWith: [{ championId: "nautilus", score: 5 }, { championId: "karma", score: 5 }, { championId: "bard", score: 4 }, { championId: "renata-glasc", score: 4 }],
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
      picks: 42,
      bans: 68,
      presence: 110.0,
      prioScore: 45.0,
      wins: 22,
      losses: 20,
      proWinRate: 52.0,
      kda: 3.9,
      avgBanTurn: 4.1,
      avgPickRound: 1.55,
      blindPickRate: 54.8,
      averageGameTime: "32:20",
      csPerMinute: 9.1,
      damagePerMinute: 914,
      goldPerMinute: 479,
      csDiffAt15: 0,
      goldDiffAt15: -158,
      xpDiffAt15: 123,
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
      { championId: "syndra", score: 3 }
    ],
    weakVs: [
      { championId: "cassiopeia", score: 3 },
      { championId: "swain", score: 3 },
      { championId: "akali", score: 4 },
      { championId: "anivia", score: 3 },
      { championId: "aurora", score: 3 }
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
      picks: 63,
      bans: 51,
      presence: 114.0,
      prioScore: 45.0,
      wins: 33,
      losses: 30,
      proWinRate: 52.0,
      kda: 3.5,
      avgBanTurn: 4.9,
      avgPickRound: 1.51,
      blindPickRate: 84.1,
      averageGameTime: "32:19",
      csPerMinute: 9.3,
      damagePerMinute: 711,
      goldPerMinute: 434,
      csDiffAt15: 4,
      goldDiffAt15: 155,
      xpDiffAt15: 47,
      soloqKrChallengerWinRate: 52,
    },
  }),
  createChampion({
    id: "yunara",
    goodVs: [
      { championId: "jinx", score: 5 },
      { championId: "smolder", score: 5 },
      { championId: "tristana", score: 4 },
      { championId: "lucian", score: 4 },
      { championId: "aphelios", score: 3 }
    ],
    weakVs: [
      { championId: "miss-fortune", score: 5 },
      { championId: "caitlyn", score: 3 },
      { championId: "varus", score: 2 }
    ],
    synergyWith: [{ championId: "ornn", score: 5 }, { championId: "ksante", score: 5 }, { championId: "taliyah", score: 4 },],
    mustWith: [{ championId: "lulu", score: 5 }, { championId: "milio", score: 5 }, { championId: "nami", score: 4 }, { championId: "thresh", score: 3 }],
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
      picks: 70,
      bans: 40,
      presence: 110.0,
      prioScore: 42.0,
      wins: 37,
      losses: 33,
      proWinRate: 53.0,
      kda: 3.1,
      avgBanTurn: 4.8,
      avgPickRound: 1.6,
      blindPickRate: 84.3,
      averageGameTime: "31:26",
      csPerMinute: 9.6,
      damagePerMinute: 800,
      goldPerMinute: 506,
      csDiffAt15: -2.4,
      goldDiffAt15: 24,
      xpDiffAt15: 18,
      soloqKrChallengerWinRate: 56,
    },
  }),
  createChampion({
    id: "azir",
    goodVs: [
      { championId: "viktor", score: 5 },
      { championId: "ahri", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "taliyah", score: 2 }
    ],

    weakVs: [
      { championId: "zoe", score: 3 },
      { championId: "syndra", score: 3 },
      { championId: "aurora", score: 2 },
      { championId: "ziggs", score: 3 },
      { championId: "yone", score: 3 }
    ],
    synergyWith: [{ championId: "maokai", score: 4 }, { championId: "sejuani", score: 4 }, { championId: "braum", score: 3 }, { championId: "ornn", score: 4 }],
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
      picks: 34,
      bans: 68,
      presence: 102.0,
      prioScore: 41.0,
      wins: 20,
      losses: 14,
      proWinRate: 59.0,
      kda: 3.1,
      avgBanTurn: 4.8,
      avgPickRound: 1.97,
      blindPickRate: 61.8,
      averageGameTime: "32:00",
      csPerMinute: 9.3,
      damagePerMinute: 776,
      goldPerMinute: 428,
      csDiffAt15: 4.3,
      goldDiffAt15: -121,
      xpDiffAt15: 98,
      soloqKrChallengerWinRate: 42.44,
    },
  }),
  createChampion({
    id: "xin-zhao",
    goodVs: [
      { championId: "trundle", score: 5 },
      { championId: "sejuani", score: 5 },
      { championId: "jayce", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "pantheon", score: 2 }
    ],

    weakVs: [
      { championId: "nocturne", score: 5 },
      { championId: "khazix", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "lee-sin", score: 4 },
      { championId: "ambessa", score: 3 }
    ],
    synergyWith: [{ championId: "sivir", score: 4 }, { championId: "karma", score: 4 }, { championId: "annie", score: 3 }, { championId: "lulu", score: 3 }],
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
      picks: 58,
      bans: 50,
      presence: 108.0,
      prioScore: 40.0,
      wins: 33,
      losses: 25,
      proWinRate: 57.0,
      kda: 3.1,
      avgBanTurn: 5.3,
      avgPickRound: 1.84,
      blindPickRate: 63.8,
      averageGameTime: "31:39",
      csPerMinute: 6.7,
      damagePerMinute: 540,
      goldPerMinute: 394,
      csDiffAt15: -3.7,
      goldDiffAt15: -284,
      xpDiffAt15: -231,
      soloqKrChallengerWinRate: 59.6,
    },
  }),
  createChampion({
    id: "karma",
    goodVs: [
      { championId: "rakan", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "alistar", score: 2 }
    ],

    weakVs: [
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "seraphine", score: 4 },
      { championId: "nami", score: 3 },
      { championId: "lulu", score: 2 }
    ],
    synergyWith: [{ championId: "caitlyn", score: 5 }, { championId: "ezreal", score: 5 }, { championId: "varus", score: 5 }, { championId: "sivir", score: 4 }],
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
      picks: 48,
      bans: 49,
      presence: 97.0,
      prioScore: 38.0,
      wins: 22,
      losses: 26,
      proWinRate: 46.0,
      kda: 3.6,
      avgBanTurn: 6.7,
      avgPickRound: 1.67,
      blindPickRate: 78.7,
      averageGameTime: "33:59",
      csPerMinute: 1.0,
      damagePerMinute: 262,
      goldPerMinute: 266,
      csDiffAt15: -1.4,
      goldDiffAt15: 82,
      xpDiffAt15: -6,
      soloqKrChallengerWinRate: 55,
    },
  }),
  createChampion({
    id: "ezreal",
    goodVs: [
      { championId: "tristana", score: 5 },
      { championId: "xayah", score: 4 },
      { championId: "corki", score: 2 }
    ],

    weakVs: [
      { championId: "sivir", score: 5 },
      { championId: "miss-fortune", score: 4 },
      { championId: "ashe", score: 3 },
      { championId: "caitlyn", score: 3 },
      { championId: "aphelios", score: 3 }
    ],
    synergyWith: [{ championId: "karma", score: 5 }, { championId: "bard", score: 4 }, { championId: "leona", score: 3 }, { championId: "braum", score: 3 }, { championId: "thresh", score: 3 }],
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
      picks: 59,
      bans: 32,
      presence: 91.0,
      prioScore: 35.0,
      wins: 24,
      losses: 35,
      proWinRate: 41.0,
      kda: 3.7,
      avgBanTurn: 6.3,
      avgPickRound: 1.49,
      blindPickRate: 39.7,
      averageGameTime: "33:09",
      csPerMinute: 9.7,
      damagePerMinute: 1035,
      goldPerMinute: 490,
      csDiffAt15: 6.3,
      goldDiffAt15: 361,
      xpDiffAt15: 221,
      soloqKrChallengerWinRate: 54.8,
    },
  }),
  createChampion({
    id: "pantheon",
    goodVs: [
      { championId: "trundle", score: 5 },
      { championId: "ambessa", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "kalista", score: 3 }
    ],
    weakVs: [{ championId: "skarner", score: 2 }, { championId: "poppy", score: 5 }, { championId: "jarvan-iv", score: 3 }, { championId: "taliyah", score: 3 }],
    synergyWith: [{ championId: "taliyah", score: 4 }, { championId: "ahri", score: 4 }, { championId: "kalista", score: 4 }, { championId: "azir", score: 3 }],
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
      picks: 42,
      bans: 46,
      presence: 88.0,
      prioScore: 34.0,
      wins: 23,
      losses: 19,
      proWinRate: 55.0,
      kda: 3.5,
      avgBanTurn: 5.0,
      avgPickRound: 1.71,
      blindPickRate: 42.9,
      averageGameTime: "32:28",
      csPerMinute: 6.6,
      damagePerMinute: 602,
      goldPerMinute: 397,
      csDiffAt15: 0.3,
      goldDiffAt15: 334,
      xpDiffAt15: 218,
      soloqKrChallengerWinRate: 55.2,
    },
  }),
  createChampion({
    id: "caitlyn",
    goodVs: [
      { championId: "sivir", score: 4 },
      { championId: "jinx", score: 4 },
      { championId: "lucian", score: 4 },
      { championId: "yunara", score: 3 },
      { championId: "ezreal", score: 3 }
    ],

    weakVs: [
      { championId: "aphelios", score: 4 }, { championId: "nocturne", score: 4 }, { championId: "vi", score: 4 }
    ],
    synergyWith: [{ championId: "karma", score: 5 }, { championId: "lux", score: 5 }, { championId: "neeko", score: 4 }, { championId: "morgana", score: 2 }],
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
      picks: 21,
      bans: 61,
      presence: 82.0,
      prioScore: 34.0,
      wins: 14,
      losses: 7,
      proWinRate: 67.0,
      kda: 4.3,
      avgBanTurn: 3.7,
      avgPickRound: 2.14,
      blindPickRate: 57.1,
      averageGameTime: "33:40",
      csPerMinute: 10.2,
      damagePerMinute: 786,
      goldPerMinute: 518,
      csDiffAt15: 7,
      goldDiffAt15: 544,
      xpDiffAt15: 168,
      soloqKrChallengerWinRate: 59.4,
    },
  }),
  createChampion({
    id: "ahri",
    goodVs: [
      { championId: "yone", score: 5 },
      { championId: "akali", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "veigar", score: 4 },
      { championId: "taliyah", score: 4 }
    ],

    weakVs: [
      { championId: "viktor", score: 4 },
      { championId: "leblanc", score: 4 },
      { championId: "mel", score: 3 },
      { championId: "cassiopeia", score: 3 },
      { championId: "ryze", score: 2 }
    ],
    synergyWith: [{ championId: "vi", score: 5 }, { championId: "xin-zhao", score: 4 }, { championId: "wukong", score: 4 }, { championId: "pantheon", score: 4 }],
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
      picks: 52,
      bans: 35,
      presence: 87.0,
      prioScore: 33.0,
      wins: 28,
      losses: 24,
      proWinRate: 54.0,
      kda: 4.7,
      avgBanTurn: 6.7,
      avgPickRound: 1.67,
      blindPickRate: 67.3,
      averageGameTime: "31:48",
      csPerMinute: 9.0,
      damagePerMinute: 728,
      goldPerMinute: 426,
      csDiffAt15: 2.1,
      goldDiffAt15: 302,
      xpDiffAt15: 241,
      soloqKrChallengerWinRate: 59,
    },
  }),
  createChampion({
    id: "bard",
    goodVs: [
      { championId: "leona", score: 4 },
      { championId: "alistar", score: 3 },
      { championId: "rell", score: 4 },
      { championId: "pyke", score: 5 },
      { championId: "nautilus", score: 3 }
    ],

    weakVs: [
      { championId: "karma", score: 2 },
      { championId: "neeko", score: 2 }
    ],

    synergyWith: [{ championId: "ezreal", score: 5 }, { championId: "caitlyn", score: 4 }, { championId: "ashe", score: 4 }, { championId: "taliyah", score: 3 }, { championId: "wukong", score: 3 }, { championId: "azir", score: 3 }],
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
      picks: 38,
      bans: 44,
      presence: 82.0,
      prioScore: 31.0,
      wins: 25,
      losses: 13,
      proWinRate: 66.0,
      kda: 4.8,
      avgBanTurn: 6.7,
      avgPickRound: 1.84,
      blindPickRate: 44.7,
      averageGameTime: "32:58",
      csPerMinute: 1.1,
      damagePerMinute: 295,
      goldPerMinute: 278,
      csDiffAt15: -2.3,
      goldDiffAt15: -10,
      xpDiffAt15: 103,
      soloqKrChallengerWinRate: 58,
    },
  }),
  createChampion({
    id: "taliyah",
    goodVs: [
      { championId: "galio", score: 5 },
      { championId: "sylas", score: 4 },
      { championId: "aurora", score: 2 }
    ],

    weakVs: [
      { championId: "zoe", score: 5 },
      { championId: "anivia", score: 5 },
      { championId: "ryze", score: 2 },
      { championId: "leblanc", score: 3 },
      { championId: "ahri", score: 3 }
    ],
    synergyWith: [{ championId: "pantheon", score: 5 }, { championId: "bard", score: 3 }, { championId: "nautilus", score: 3 }, { championId: "renekton", score: 3 }, { championId: "vi", score: 4 }, { championId: "nocturne", score: 4 }],
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
      picks: 35,
      bans: 39,
      presence: 74.0,
      prioScore: 31.0,
      wins: 16,
      losses: 19,
      proWinRate: 46.0,
      kda: 3.1,
      avgBanTurn: 5.7,
      avgPickRound: 1.46,
      blindPickRate: 45.7,
      averageGameTime: "31:55",
      csPerMinute: 8.8,
      damagePerMinute: 675,
      goldPerMinute: 396,
      csDiffAt15: -7.6,
      goldDiffAt15: -258,
      xpDiffAt15: -266,
      soloqKrChallengerWinRate: 58,
    },
  }),
  createChampion({
    id: "sion",
    goodVs: [
      { championId: "aurora", score: 4 },
      { championId: "rumble", score: 3 },
      { championId: "ambessa", score: 3 },
      { championId: "gnar", score: 2 },
      { championId: "ksante", score: 2 }
    ],

    weakVs: [
      { championId: "reksai", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "sett", score: 2 },
      { championId: "zaahen", score: 2 },
      { championId: "camille", score: 3 }
    ],
    synergyWith: [{ championId: "varus", score: 4 }, { championId: "ashe", score: 4 }, { championId: "senna", score: 4 }, { championId: "orianna", score: 3 }],
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
      picks: 41,
      bans: 40,
      presence: 81.0,
      prioScore: 30.0,
      wins: 23,
      losses: 18,
      proWinRate: 56.0,
      kda: 3.0,
      avgBanTurn: 6.2,
      avgPickRound: 1.71,
      blindPickRate: 63.4,
      averageGameTime: "32:38",
      csPerMinute: 7.8,
      damagePerMinute: 617,
      goldPerMinute: 376,
      csDiffAt15: -0.5,
      goldDiffAt15: -40,
      xpDiffAt15: 76,
      soloqKrChallengerWinRate: 51,
    },
  }),
  createChampion({
    id: "ksante",
    goodVs: [
      { championId: "aatrox", score: 4 },
      { championId: "jayce", score: 2 },
      { championId: "renekton", score: 2 },
      { championId: "rumble", score: 2 },
      { championId: "gnar", score: 2 }
    ],

    weakVs: [
      { championId: "gwen", score: 4 },
      { championId: "zaahen", score: 4 },
      { championId: "ambessa", score: 4 },
      { championId: "poppy", score: 3 },
      { championId: "yorick", score: 3 }
    ],
    synergyWith: [{ championId: "azir", score: 4 }, { championId: "yunara", score: 3 }, { championId: "lulu", score: 3 }, { championId: "ahri", score: 3 }],
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
      picks: 57,
      bans: 21,
      presence: 78.0,
      prioScore: 30.0,
      wins: 22,
      losses: 35,
      proWinRate: 39.0,
      kda: 2.3,
      avgBanTurn: 6.9,
      avgPickRound: 1.47,
      blindPickRate: 46.4,
      averageGameTime: "32:22",
      csPerMinute: 7.8,
      damagePerMinute: 518,
      goldPerMinute: 362,
      csDiffAt15: -6.1,
      goldDiffAt15: -348,
      xpDiffAt15: -111,
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
      { championId: "renekton", score: 5 },
      { championId: "nocturne", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],
    synergyWith: [{ championId: "azir", score: 5 }, { championId: "orianna", score: 5 }, { championId: "lulu", score: 3 }, { championId: "karma", score: 3 }, { championId: "sivir", score: 4 }],
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
      picks: 38,
      bans: 40,
      presence: 78.0,
      prioScore: 30.0,
      wins: 21,
      losses: 17,
      proWinRate: 55.0,
      kda: 3.5,
      avgBanTurn: 4.5,
      avgPickRound: 1.76,
      blindPickRate: 67.6,
      averageGameTime: "31:10",
      csPerMinute: 7.2,
      damagePerMinute: 674,
      goldPerMinute: 395,
      csDiffAt15: 9.1,
      goldDiffAt15: 83,
      xpDiffAt15: 487,
      soloqKrChallengerWinRate: 53,
    },
  }),
  createChampion({
    id: "zaahen",
    goodVs: [
      { championId: "gwen", score: 5 },
      { championId: "ksante", score: 5 },
      { championId: "reksai", score: 4 },
      { championId: "pantheon", score: 4 },
      { championId: "wukong", score: 4 }
    ],

    weakVs: [
      { championId: "dr-mundo", score: 4 },
      { championId: "ornn", score: 3 },
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
      picks: 40,
      bans: 37,
      presence: 77.0,
      prioScore: 29.0,
      wins: 25,
      losses: 15,
      proWinRate: 63.0,
      kda: 3.7,
      avgBanTurn: 5.7,
      avgPickRound: 1.85,
      blindPickRate: 40.0,
      averageGameTime: "31:52",
      csPerMinute: 7.3,
      damagePerMinute: 597,
      goldPerMinute: 395,
      csDiffAt15: -2.6,
      goldDiffAt15: -205,
      xpDiffAt15: -168,
      soloqKrChallengerWinRate: 56.4,
    },
  }),
  createChampion({
    id: "ashe",
    goodVs: [
      { championId: "kaisa", score: 5 },
      { championId: "zeri", score: 5 },
      { championId: "lucian", score: 4 },
      { championId: "ezreal", score: 3 },
      { championId: "aphelios", score: 2 }
    ],

    weakVs: [
      { championId: "varus", score: 3 },
      { championId: "yunara", score: 2 },
      { championId: "corki", score: 2 }
    ],
    synergyWith: [{ championId: "braum", score: 3 }, { championId: "karma", score: 2 }, { championId: "bard", score: 4 }],
    mustWith: [{ championId: "seraphine", score: 5 }],
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
      picks: 38,
      bans: 37,
      presence: 75.0,
      prioScore: 28.0,
      wins: 25,
      losses: 13,
      proWinRate: 66.0,
      kda: 3.9,
      avgBanTurn: 5.1,
      avgPickRound: 1.82,
      blindPickRate: 55.3,
      averageGameTime: "30:38",
      csPerMinute: 8.9,
      damagePerMinute: 725,
      goldPerMinute: 469,
      csDiffAt15: 2.3,
      goldDiffAt15: 49,
      xpDiffAt15: -42,
      soloqKrChallengerWinRate: 58.82,
    },
  }),
  createChampion({
    id: "corki",
    goodVs: [
      { championId: "jhin", score: 4 },
      { championId: "aphelios", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "ashe", score: 2 },
      { championId: "sivir", score: 2 }
    ],

    weakVs: [
      { championId: "xayah", score: 3 },
      { championId: "kaisa", score: 3 },
      { championId: "ezreal", score: 2 },
      { championId: "miss-fortune", score: 2 },
      { championId: "yunara", score: 1 }
    ],
    synergyWith: [{ championId: "nami", score: 5 }, { championId: "braum", score: 3 }, { championId: "bard", score: 3 }, { championId: "renata-glasc", score: 2 }],
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
      picks: 49,
      bans: 30,
      presence: 79.0,
      prioScore: 28.0,
      wins: 20,
      losses: 29,
      proWinRate: 41.0,
      kda: 2.7,
      avgBanTurn: 5.7,
      avgPickRound: 1.82,
      blindPickRate: 63.3,
      averageGameTime: "33:14",
      csPerMinute: 9.7,
      damagePerMinute: 831,
      goldPerMinute: 475,
      csDiffAt15: -1.2,
      goldDiffAt15: -270,
      xpDiffAt15: -175,
      soloqKrChallengerWinRate: 57.57,
    },
  }),
  createChampion({
    id: "aurora",
    goodVs: [
      { championId: "azir", score: 4 },
      { championId: "ryze", score: 4 },
      { championId: "ksante", score: 4 },
      { championId: "leblanc", score: 4 },
      { championId: "galio", score: 3 }
    ],

    weakVs: [
      { championId: "cassiopeia", score: 5 },
      { championId: "gnar", score: 4 },
      { championId: "sion", score: 4 },
      { championId: "viktor", score: 3 },
      { championId: "orianna", score: 3 }
    ],

    synergyWith: [{ championId: "nautilus", score: 5 }, { championId: "rell", score: 5 }, { championId: "wukong", score: 4 }, { championId: "jarvan-iv", score: 5 }],
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
      picks: 45,
      bans: 28,
      presence: 73.0,
      prioScore: 27.0,
      wins: 25,
      losses: 20,
      proWinRate: 56.0,
      kda: 3.5,
      avgBanTurn: 4.5,
      avgPickRound: 1.78,
      blindPickRate: 40.0,
      averageGameTime: "32:15",
      csPerMinute: 8.3,
      damagePerMinute: 832,
      goldPerMinute: 401,
      csDiffAt15: 1.6,
      goldDiffAt15: 65,
      xpDiffAt15: 48,
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
      { championId: "aatrox", score: 4 }
    ],

    weakVs: [
      { championId: "zaahen", score: 5 },
      { championId: "jax", score: 4 },
      { championId: "gnar", score: 3 }
    ],
    synergyWith: [{ championId: "sejuani", score: 3 }, { championId: "maokai", score: 3 }, { championId: "seraphine", score: 3 }, { championId: "renata-glasc", score: 3 }],
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
      picks: 23,
      bans: 42,
      presence: 65.0,
      prioScore: 26.0,
      wins: 12,
      losses: 11,
      proWinRate: 52.0,
      kda: 2.2,
      avgBanTurn: 8.0,
      avgPickRound: 1.83,
      blindPickRate: 21.7,
      averageGameTime: "32:26",
      csPerMinute: 8.4,
      damagePerMinute: 795,
      goldPerMinute: 414,
      csDiffAt15: 1.1,
      goldDiffAt15: -196,
      xpDiffAt15: -444,
      soloqKrChallengerWinRate: 54.82,
    },
  }),
  createChampion({
    id: "renekton",
    goodVs: [
      { championId: "olaf", score: 5 },
      { championId: "aatrox", score: 5 },
      { championId: "dr-mundo", score: 4 },
      { championId: "ornn", score: 3 },
      { championId: "yone", score: 4 }
    ],

    weakVs: [
      { championId: "gwen", score: 4 },
      { championId: "ambessa", score: 4 },
      { championId: "kennen", score: 3 },
      { championId: "rumble", score: 3 },
      { championId: "reksai", score: 2 }
    ],
    synergyWith: [{ championId: "nidalee", score: 5 }, { championId: "taliyah", score: 3 }, { championId: "sejuani", score: 4 }, { championId: "lissandra", score: 3 }],
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
      picks: 43,
      bans: 31,
      presence: 74.0,
      prioScore: 25.0,
      wins: 23,
      losses: 20,
      proWinRate: 53.0,
      kda: 2.4,
      avgBanTurn: 7.0,
      avgPickRound: 1.98,
      blindPickRate: 67.4,
      averageGameTime: "31:47",
      csPerMinute: 8.6,
      damagePerMinute: 589,
      goldPerMinute: 387,
      csDiffAt15: 3.3,
      goldDiffAt15: 182,
      xpDiffAt15: 40,
      soloqKrChallengerWinRate: 59.18,
    },
  }),
  createChampion({
    id: "lulu",
    goodVs: [
      { championId: "alistar", score: 5 },
      { championId: "rell", score: 5 },
      { championId: "braum", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "pyke", score: 4 }
    ],

    weakVs: [
      { championId: "seraphine", score: 4 },
      { championId: "nami", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "bard", score: 3 },
      { championId: "thresh", score: 2 }
    ],
    synergyWith: [{ championId: "aphelios", score: 5 }, { championId: "jinx", score: 5 }, { championId: "zeri", score: 5 }, { championId: "kogmaw", score: 5 }, { championId: "yunara", score: 3 }],
    // Example: enchanter + hypercarry pairs are often strong synergy, not always true must-picks.
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
      picks: 37,
      bans: 30,
      presence: 67.0,
      prioScore: 25.0,
      wins: 20,
      losses: 17,
      proWinRate: 54.0,
      kda: 4.6,
      avgBanTurn: 7.4,
      avgPickRound: 1.81,
      blindPickRate: 54.1,
      averageGameTime: "31:21",
      csPerMinute: 1.1,
      damagePerMinute: 210,
      goldPerMinute: 272,
      csDiffAt15: 2.1,
      goldDiffAt15: 8,
      xpDiffAt15: 278,
      soloqKrChallengerWinRate: 51.7,
    },
  }),
  createChampion({
    id: "wukong",
    goodVs: [
      { championId: "maokai", score: 4 },
      { championId: "dr-mundo", score: 3 },
      { championId: "pantheon", score: 3 },
      { championId: "nocturne", score: 3 }
    ],

    weakVs: [
      { championId: "trundle", score: 2 },
      { championId: "poppy", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "zaahen", score: 3 }
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
      picks: 44,
      bans: 21,
      presence: 65.0,
      prioScore: 24.0,
      wins: 17,
      losses: 27,
      proWinRate: 39.0,
      kda: 2.7,
      avgBanTurn: 7.1,
      avgPickRound: 1.61,
      blindPickRate: 36.4,
      averageGameTime: "33:20",
      csPerMinute: 6.6,
      damagePerMinute: 446,
      goldPerMinute: 381,
      csDiffAt15: -3.8,
      goldDiffAt15: -94,
      xpDiffAt15: -243,
      soloqKrChallengerWinRate: 57.39,
    },
  }),
  createChampion({
    id: "gnar",
    goodVs: [
      { championId: "ornn", score: 5 },
      { championId: "aurora", score: 4 },
      { championId: "rumble", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "renekton", score: 4 }
    ],

    weakVs: [
      { championId: "kennen", score: 5 },
      { championId: "ambessa", score: 3 },
      { championId: "sion", score: 2 },
      { championId: "yorick", score: 2 },
      { championId: "ksante", score: 2 }
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
      picks: 33,
      bans: 29,
      presence: 62.0,
      prioScore: 24.0,
      wins: 16,
      losses: 17,
      proWinRate: 48.0,
      kda: 2.8,
      avgBanTurn: 8.1,
      avgPickRound: 1.73,
      blindPickRate: 42.4,
      averageGameTime: "32:07",
      csPerMinute: 8.8,
      damagePerMinute: 738,
      goldPerMinute: 414,
      csDiffAt15: 9,
      goldDiffAt15: 490,
      xpDiffAt15: 301,
      soloqKrChallengerWinRate: 56.48,
    },
  }),
  createChampion({
    id: "aatrox",
    goodVs: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "sion", score: 4 },
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
      picks: 36,
      bans: 22,
      presence: 58.0,
      prioScore: 21.0,
      wins: 23,
      losses: 13,
      proWinRate: 64.0,
      kda: 3.2,
      avgBanTurn: 6.0,
      avgPickRound: 1.72,
      blindPickRate: 30.6,
      averageGameTime: "31:57",
      csPerMinute: 7.7,
      damagePerMinute: 687,
      goldPerMinute: 411,
      csDiffAt15: 6.4,
      goldDiffAt15: 270,
      xpDiffAt15: 242,
      soloqKrChallengerWinRate: 57.14,
    },
  }),
  createChampion({
    id: "akali",
    goodVs: [
      { championId: "ryze", score: 5 },
      { championId: "viktor", score: 4 },
      { championId: "aurora", score: 3 },
      { championId: "galio", score: 3 },
      { championId: "syndra", score: 3 }
    ],

    weakVs: [
      { championId: "ahri", score: 5 },
      { championId: "azir", score: 3 },
      { championId: "orianna", score: 3 }
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
      picks: 19,
      bans: 35,
      presence: 54.0,
      prioScore: 21.0,
      wins: 9,
      losses: 10,
      proWinRate: 47.0,
      kda: 3.5,
      avgBanTurn: 4.5,
      avgPickRound: 2.05,
      blindPickRate: 33.3,
      averageGameTime: "33:12",
      csPerMinute: 8.1,
      damagePerMinute: 732,
      goldPerMinute: 426,
      csDiffAt15: -5.9,
      goldDiffAt15: 20,
      xpDiffAt15: 146,
      soloqKrChallengerWinRate: 49.5,
    },
  }),
  createChampion({
    id: "nocturne",
    goodVs: [
      { championId: "xin-zhao", score: 5 },
      { championId: "dr-mundo", score: 4 },
      { championId: "pantheon", score: 4 },
      { championId: "galio", score: 3 }
    ],

    weakVs: [
      { championId: "tahm-kench", score: 4 },
      { championId: "naafiri", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "aatrox", score: 3 },
      { championId: "maokai", score: 3 }
    ],
    synergyWith: [{ championId: "orianna", score: 5 }, { championId: "twisted-fate", score: 5 }, { championId: "camille", score: 5 }, { championId: "taliyah", score: 5 }],
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
      picks: 20,
      bans: 33,
      presence: 53.0,
      prioScore: 21.0,
      wins: 11,
      losses: 9,
      proWinRate: 55.0,
      kda: 2.9,
      avgBanTurn: 5.6,
      avgPickRound: 2.1,
      blindPickRate: 75.0,
      averageGameTime: "33:01",
      csPerMinute: 6.8,
      damagePerMinute: 465,
      goldPerMinute: 393,
      csDiffAt15: -3.4,
      goldDiffAt15: -76,
      xpDiffAt15: -226,
      soloqKrChallengerWinRate: 59.69,
    },
  }),
  createChampion({
    id: "nami",
    goodVs: [
      { championId: "karma", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "lulu", score: 3 }
    ],

    weakVs: [
      { championId: "milio", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "seraphine", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "renata-glasc", score: 2 }
    ],
    mustWith: [{ championId: "lucian", score: 5 }, { championId: "corki", score: 5 }, { championId: "jhin", score: 5 }, { championId: "caitlyn", score: 4 }, { championId: "zeri", score: 3 }],
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
      picks: 36,
      bans: 23,
      presence: 59.0,
      prioScore: 20.0,
      wins: 17,
      losses: 19,
      proWinRate: 47.0,
      kda: 3.6,
      avgBanTurn: 6.5,
      avgPickRound: 1.97,
      blindPickRate: 66.7,
      averageGameTime: "33:07",
      csPerMinute: 0.9,
      damagePerMinute: 284,
      goldPerMinute: 268,
      csDiffAt15: -3.4,
      goldDiffAt15: -45,
      xpDiffAt15: -161,
      soloqKrChallengerWinRate: 56.07,
    },
  }),
  createChampion({
    id: "alistar",
    goodVs: [
      { championId: "renata-glasc", score: 5 },
      { championId: "leona", score: 4 },
      { championId: "braum", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "wukong", score: 3 }
    ],

    weakVs: [
      { championId: "lulu", score: 5 },
      { championId: "seraphine", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "karma", score: 2 },
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
      picks: 36,
      bans: 17,
      presence: 53.0,
      prioScore: 19.0,
      wins: 20,
      losses: 16,
      proWinRate: 56.0,
      kda: 3.1,
      avgBanTurn: 8.3,
      avgPickRound: 1.78,
      blindPickRate: 33.3,
      averageGameTime: "32:23",
      csPerMinute: 0.9,
      damagePerMinute: 176,
      goldPerMinute: 261,
      csDiffAt15: 0.4,
      goldDiffAt15: -176,
      xpDiffAt15: -147,
      soloqKrChallengerWinRate: 56.97,
    },
  }),
  createChampion({
    id: "kaisa",
    goodVs: [
      { championId: "miss-fortune", score: 5 },
      { championId: "tristana", score: 5 },
      { championId: "smolder", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "jinx", score: 4 }
    ],

    weakVs: [
      { championId: "ashe", score: 5 },
      { championId: "sivir", score: 4 },
      { championId: "poppy", score: 4 },
      { championId: "caitlyn", score: 4 },
      { championId: "xayah", score: 3 }
    ],
    synergyWith: [{ championId: "rakan", score: 4 }, { championId: "rell", score: 4 }],
    mustWith: [{ championId: "nautilus", score: 5 }, { championId: "alistar", score: 5 }, { championId: "leona", score: 5 }],
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
      picks: 25,
      bans: 22,
      presence: 47.0,
      prioScore: 17.0,
      wins: 9,
      losses: 16,
      proWinRate: 36.0,
      kda: 3.3,
      avgBanTurn: 7.6,
      avgPickRound: 1.88,
      blindPickRate: 41.7,
      averageGameTime: "31:08",
      csPerMinute: 9.4,
      damagePerMinute: 765,
      goldPerMinute: 504,
      csDiffAt15: -4.9,
      goldDiffAt15: 153,
      xpDiffAt15: 64,
      soloqKrChallengerWinRate: 52.99,
    },
  }),
  createChampion({
    id: "galio",
    goodVs: [
      { championId: "syndra", score: 5 },
      { championId: "rumble", score: 3 },
      { championId: "leblanc", score: 4 },
      { championId: "ahri", score: 3 }
    ],

    weakVs: [
      { championId: "taliyah", score: 5 },
      { championId: "smolder", score: 3 },
      { championId: "viktor", score: 4 },
      { championId: "yone", score: 4 },
      { championId: "aurora", score: 4 }
    ],
    synergyWith: [{ championId: "jarvan-iv", score: 5 }, { championId: "nocturne", score: 5 }, { championId: "camille", score: 5 }, { championId: "rakan", score: 4 }, { championId: "kindred", score: 4 }],
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
      picks: 21,
      bans: 20,
      presence: 41.0,
      prioScore: 16.0,
      wins: 8,
      losses: 13,
      proWinRate: 38.0,
      kda: 2.9,
      avgBanTurn: 6.8,
      avgPickRound: 1.57,
      blindPickRate: 25.0,
      averageGameTime: "33:28",
      csPerMinute: 7.4,
      damagePerMinute: 552,
      goldPerMinute: 352,
      csDiffAt15: -17.1,
      goldDiffAt15: -814,
      xpDiffAt15: -324,
      soloqKrChallengerWinRate: 55.99,
    },
  }),
  createChampion({
    id: "sivir",
    goodVs: [
      { championId: "jhin", score: 5 },
      { championId: "xayah", score: 5 },
      { championId: "miss-fortune", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "ezreal", score: 3 }
    ],

    weakVs: [
      { championId: "zeri", score: 5 },
      { championId: "caitlyn", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "yunara", score: 3 },
      { championId: "varus", score: 3 }
    ],
    synergyWith: [{ championId: "xin-zhao", score: 3 }, { championId: "lulu", score: 5 }, { championId: "braum", score: 5 }, { championId: "karma", score: 4 }],
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
      picks: 33,
      bans: 15,
      presence: 48.0,
      prioScore: 16.0,
      wins: 21,
      losses: 12,
      proWinRate: 64.0,
      kda: 4.7,
      avgBanTurn: 6.1,
      avgPickRound: 2.06,
      blindPickRate: 27.3,
      averageGameTime: "30:59",
      csPerMinute: 10.2,
      damagePerMinute: 853,
      goldPerMinute: 518,
      csDiffAt15: -0.3,
      goldDiffAt15: 11,
      xpDiffAt15: 10,
      soloqKrChallengerWinRate: 54.26,
    },
  }),
  createChampion({
    id: "seraphine",
    goodVs: [
      { championId: "neeko", score: 5 },
      { championId: "yuumi", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "nami", score: 3 },
      { championId: "lulu", score: 3 }
    ],

    weakVs: [
      { championId: "nautilus", score: 4 },
      { championId: "rell", score: 3 }
    ],
    synergyWith: [{ championId: "miss-fortune", score: 2 }, { championId: "jhin", score: 2 }, { championId: "dr-mundo", score: 3 }, { championId: "jarvan-iv", score: 3 }, { championId: "xin-zhao", score: 3 }],
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
      picks: 35,
      bans: 11,
      presence: 46.0,
      prioScore: 16.0,
      wins: 23,
      losses: 12,
      proWinRate: 66.0,
      kda: 5.2,
      avgBanTurn: 6.3,
      avgPickRound: 1.77,
      blindPickRate: 57.1,
      averageGameTime: "30:10",
      csPerMinute: 1.6,
      damagePerMinute: 305,
      goldPerMinute: 296,
      csDiffAt15: 2.1,
      goldDiffAt15: 217,
      xpDiffAt15: 226,
      soloqKrChallengerWinRate: 55.53,
    },
  }),
  createChampion({
    id: "anivia",
    goodVs: [
      { championId: "taliyah", score: 4 },
      { championId: "cassiopeia", score: 4 },
      { championId: "ryze", score: 5 },
      { championId: "aurora", score: 2 }
    ],

    weakVs: [
      { championId: "syndra", score: 5 },
      { championId: "orianna", score: 5 },
      { championId: "azir", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "ryze", score: 5 }
    ],

    synergyWith: [
      { championId: "poppy", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "vi", score: 2 },
      { championId: "nocturne", score: 2 }
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
    roles: ["mid"],
    damageProfile: ["AP"],
    stats: {
      picks: 22,
      bans: 14,
      presence: 36.0,
      prioScore: 13.0,
      wins: 16,
      losses: 6,
      proWinRate: 73.0,
      kda: 5.4,
      avgBanTurn: 5.3,
      avgPickRound: 1.64,
      blindPickRate: 22.7,
      averageGameTime: "31:11",
      csPerMinute: 8.7,
      damagePerMinute: 687,
      goldPerMinute: 420,
      csDiffAt15: 5.5,
      goldDiffAt15: 167,
      xpDiffAt15: 528,
      soloqKrChallengerWinRate: 62.77,
    },
  }),
  createChampion({
    id: "rakan",
    goodVs: [
      { championId: "renata-glasc", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "braum", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "nautilus", score: 3 }
    ],

    weakVs: [
      { championId: "neeko", score: 3 },
      { championId: "seraphine", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "poppy", score: 4 },
      { championId: "alistar", score: 2 }
    ],
    synergyWith: [{ championId: "yasuo", score: 4 }, { championId: "orianna", score: 3 }, { championId: "ahri", score: 3 }],
    mustWith: [{ championId: "xayah", score: 5 }],
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
      picks: 33,
      bans: 10,
      presence: 43.0,
      prioScore: 13.0,
      wins: 15,
      losses: 18,
      proWinRate: 45.0,
      kda: 3.6,
      avgBanTurn: 8.5,
      avgPickRound: 2.21,
      blindPickRate: 39.4,
      averageGameTime: "31:57",
      csPerMinute: 1.0,
      damagePerMinute: 175,
      goldPerMinute: 266,
      csDiffAt15: 0.7,
      goldDiffAt15: -153,
      xpDiffAt15: -149,
      soloqKrChallengerWinRate: 56.49,
    },
  }),
  createChampion({
    id: "syndra",
    goodVs: [
      { championId: "viktor", score: 4 },
      { championId: "azir", score: 4 },
      { championId: "aurora", score: 3 },
      { championId: "taliyah", score: 3 }
    ],

    weakVs: [
      { championId: "galio", score: 5 },
      { championId: "orianna", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "ryze", score: 3 },
      { championId: "akali", score: 3 }
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
      picks: 17,
      bans: 17,
      presence: 34.0,
      prioScore: 12.0,
      wins: 6,
      losses: 11,
      proWinRate: 35.0,
      kda: 1.8,
      avgBanTurn: 7.9,
      avgPickRound: 1.94,
      blindPickRate: 17.6,
      averageGameTime: "33:28",
      csPerMinute: 8.5,
      damagePerMinute: 800,
      goldPerMinute: 432,
      csDiffAt15: 1.4,
      goldDiffAt15: 225,
      xpDiffAt15: -156,
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
    synergyWith: [{ championId: "varus", score: 4 }, { championId: "miss-fortune", score: 4 }, { championId: "kaisa", score: 4 }, { championId: "samira", score: 4 }],
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
      picks: 22,
      bans: 13,
      presence: 35.0,
      prioScore: 12.0,
      wins: 10,
      losses: 12,
      proWinRate: 45.0,
      kda: 2.2,
      avgBanTurn: 7.8,
      avgPickRound: 2.05,
      blindPickRate: 18.2,
      averageGameTime: "31:13",
      csPerMinute: 1.1,
      damagePerMinute: 217,
      goldPerMinute: 257,
      csDiffAt15: 2.2,
      goldDiffAt15: -58,
      xpDiffAt15: -38,
      soloqKrChallengerWinRate: 57.33,
    },
  }),
  createChampion({
    id: "mel",
    goodVs: [
      { championId: "yone", score: 5 },
      { championId: "corki", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "ezreal", score: 3 },
      { championId: "jayce", score: 3 }
    ],

    weakVs: [
      { championId: "varus", score: 5 },
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
      picks: 18,
      bans: 16,
      presence: 34.0,
      prioScore: 12.0,
      wins: 5,
      losses: 13,
      proWinRate: 28.0,
      kda: 1.9,
      avgBanTurn: 6.4,
      avgPickRound: 2.11,
      blindPickRate: 50.0,
      averageGameTime: "30:56",
      csPerMinute: 8.8,
      damagePerMinute: 800,
      goldPerMinute: 402,
      csDiffAt15: 3.9,
      goldDiffAt15: -24,
      xpDiffAt15: -129,
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
      picks: 18,
      bans: 12,
      presence: 30.0,
      prioScore: 11.0,
      wins: 6,
      losses: 12,
      proWinRate: 33.0,
      kda: 2.6,
      avgBanTurn: 5.5,
      avgPickRound: 2.11,
      blindPickRate: 33.3,
      averageGameTime: "31:19",
      csPerMinute: 7.2,
      damagePerMinute: 501,
      goldPerMinute: 336,
      csDiffAt15: -15.5,
      goldDiffAt15: -800,
      xpDiffAt15: -393,
      soloqKrChallengerWinRate: 59.4,
    },
  }),
  createChampion({
    id: "braum",
    goodVs: [
      { championId: "seraphine", score: 5 },
      { championId: "maokai", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "milio", score: 3 },
      { championId: "lulu", score: 3 }
    ],

    weakVs: [
      { championId: "karma", score: 4 },
      { championId: "rakan", score: 3 },
      { championId: "alistar", score: 3 }
    ],
    synergyWith: [{ championId: "ashe", score: 5 }, { championId: "lucian", score: 5 }, { championId: "aphelios", score: 4 }, { championId: "jinx", score: 4 }],
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
      picks: 12,
      bans: 16,
      presence: 28.0,
      prioScore: 10.0,
      wins: 5,
      losses: 7,
      proWinRate: 42.0,
      kda: 2.4,
      avgBanTurn: 8.4,
      avgPickRound: 2.17,
      blindPickRate: 41.7,
      averageGameTime: "30:45",
      csPerMinute: 0.9,
      damagePerMinute: 201,
      goldPerMinute: 256,
      csDiffAt15: -5,
      goldDiffAt15: 52,
      xpDiffAt15: -150,
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
      { championId: "ziggs", score: 4 },
      { championId: "senna", score: 3 },
      { championId: "xayah", score: 3 }
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
      picks: 23,
      bans: 8,
      presence: 31.0,
      prioScore: 10.0,
      wins: 8,
      losses: 15,
      proWinRate: 35.0,
      kda: 3.9,
      avgBanTurn: 9.0,
      avgPickRound: 2.04,
      blindPickRate: 26.1,
      averageGameTime: "35:10",
      csPerMinute: 9.3,
      damagePerMinute: 726,
      goldPerMinute: 471,
      csDiffAt15: -4,
      goldDiffAt15: -503,
      xpDiffAt15: -277,
      soloqKrChallengerWinRate: 53.43,
    },
  }),
  createChampion({
    id: "aphelios",
    goodVs: [
      { championId: "ziggs", score: 4 },
      { championId: "caitlyn", score: 4 },
      { championId: "jhin", score: 3 },
      { championId: "kalista", score: 3 },
      { championId: "ezreal", score: 3 }
    ],

    weakVs: [
      { championId: "xayah", score: 5 },
      { championId: "kaisa", score: 4 },
      { championId: "yunara", score: 3 },
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
      picks: 25,
      bans: 9,
      presence: 34.0,
      prioScore: 10.0,
      wins: 13,
      losses: 12,
      proWinRate: 52.0,
      kda: 3.0,
      avgBanTurn: 7.2,
      avgPickRound: 2.2,
      blindPickRate: 28.0,
      averageGameTime: "31:54",
      csPerMinute: 9.5,
      damagePerMinute: 793,
      goldPerMinute: 492,
      csDiffAt15: 2.1,
      goldDiffAt15: 167,
      xpDiffAt15: -29,
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
    synergyWith: [{ championId: "rakan", score: 5 }, { championId: "alistar", score: 3 }, { championId: "nautilus", score: 3 }, { championId: "rell", score: 3 }],
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
      picks: 19,
      bans: 11,
      presence: 30.0,
      prioScore: 10.0,
      wins: 11,
      losses: 8,
      proWinRate: 58.0,
      kda: 3.3,
      avgBanTurn: 8.3,
      avgPickRound: 2.21,
      blindPickRate: 42.1,
      averageGameTime: "33:20",
      csPerMinute: 10.0,
      damagePerMinute: 898,
      goldPerMinute: 543,
      csDiffAt15: -3.2,
      goldDiffAt15: -34,
      xpDiffAt15: -240,
      soloqKrChallengerWinRate: 58.35,
    },
  }),
  createChampion({
    id: "jax",
    goodVs: [
      { championId: "gwen", score: 4 },
      { championId: "xin-zhao", score: 4 },
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
      picks: 16,
      bans: 12,
      presence: 28.0,
      prioScore: 10.0,
      wins: 7,
      losses: 9,
      proWinRate: 44.0,
      kda: 1.8,
      avgBanTurn: 7.5,
      avgPickRound: 2.19,
      blindPickRate: 25.0,
      averageGameTime: "30:39",
      csPerMinute: 7.9,
      damagePerMinute: 614,
      goldPerMinute: 398,
      csDiffAt15: -1.6,
      goldDiffAt15: -78,
      xpDiffAt15: 108,
      soloqKrChallengerWinRate: 56.29,
    },
  }),
  createChampion({
    id: "jayce",
    goodVs: [
      { championId: "wukong", score: 5 },
      { championId: "ambessa", score: 5 },
      { championId: "kennen", score: 3 },
      { championId: "jax", score: 3 },
      { championId: "taliyah", score: 4 }
    ],

    weakVs: [
      { championId: "dr-mundo", score: 4 },
      { championId: "malphite", score: 3 },
      { championId: "sion", score: 2 }
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
      picks: 14,
      bans: 10,
      presence: 24.0,
      prioScore: 9.0,
      wins: 6,
      losses: 8,
      proWinRate: 43.0,
      kda: 2.9,
      avgBanTurn: 6.5,
      avgPickRound: 1.86,
      blindPickRate: 28.6,
      averageGameTime: "32:46",
      csPerMinute: 8.7,
      damagePerMinute: 815,
      goldPerMinute: 454,
      csDiffAt15: 13.9,
      goldDiffAt15: 542,
      xpDiffAt15: 146,
      soloqKrChallengerWinRate: 56.92,
    },
  }),
  createChampion({
    id: "rell",
    goodVs: [
      { championId: "renata-glasc", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "seraphine", score: 3 },
      { championId: "nami", score: 3 },
      { championId: "nautilus", score: 3 }
    ],

    weakVs: [
      { championId: "poppy", score: 5 },
      { championId: "lulu", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "neeko", score: 4 },
      { championId: "rakan", score: 3 }
    ],
    synergyWith: [{ championId: "xayah", score: 3 }, { championId: "kalista", score: 4 }, { championId: "yasuo", score: 4 }, { championId: "kaisa", score: 4 }],
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
      picks: 18,
      bans: 10,
      presence: 28.0,
      prioScore: 9.0,
      wins: 8,
      losses: 10,
      proWinRate: 44.0,
      kda: 3.1,
      avgBanTurn: 8.4,
      avgPickRound: 2.22,
      blindPickRate: 38.9,
      averageGameTime: "30:50",
      csPerMinute: 1.0,
      damagePerMinute: 173,
      goldPerMinute: 260,
      csDiffAt15: 1.2,
      goldDiffAt15: -306,
      xpDiffAt15: -79,
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
      { championId: "leona", score: 3 }
    ],

    weakVs: [
      { championId: "rakan", score: 3 },
      { championId: "trundle", score: 4 }
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
      picks: 15,
      bans: 10,
      presence: 25.0,
      prioScore: 9.0,
      wins: 9,
      losses: 6,
      proWinRate: 60.0,
      kda: 4.0,
      avgBanTurn: 5.9,
      avgPickRound: 2.2,
      blindPickRate: 40.0,
      averageGameTime: "31:01",
      csPerMinute: 4.3,
      damagePerMinute: 464,
      goldPerMinute: 333,
      csDiffAt15: 0.3,
      goldDiffAt15: 179,
      xpDiffAt15: 201,
      soloqKrChallengerWinRate: 59.93,
    },
  }),
  createChampion({
    id: "viktor",
    goodVs: [
      { championId: "ahri", score: 5 },
      { championId: "galio", score: 4 },
      { championId: "mel", score: 3 },
      { championId: "aurora", score: 3 },
      { championId: "zoe", score: 3 }
    ],

    weakVs: [
      { championId: "orianna", score: 5 },
      { championId: "azir", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "akali", score: 4 },
      { championId: "ryze", score: 3 }
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
      picks: 19,
      bans: 8,
      presence: 27.0,
      prioScore: 8.0,
      wins: 13,
      losses: 6,
      proWinRate: 68.0,
      kda: 2.9,
      avgBanTurn: 8.6,
      avgPickRound: 2.21,
      blindPickRate: 47.4,
      averageGameTime: "33:11",
      csPerMinute: 8.6,
      damagePerMinute: 845,
      goldPerMinute: 401,
      csDiffAt15: 3.1,
      goldDiffAt15: -160,
      xpDiffAt15: -27,
      soloqKrChallengerWinRate: 55.57,
    },
  }),
  createChampion({
    id: "malphite",
    goodVs: [
      { championId: "pantheon", score: 4 },
      { championId: "trundle", score: 3 },
      { championId: "gnar", score: 3 },
      { championId: "wukong", score: 3 }
    ],

    weakVs: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "zaahen", score: 3 },
      { championId: "dr-mundo", score: 3 }
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
      picks: 6,
      bans: 15,
      presence: 21.0,
      prioScore: 8.0,
      wins: 4,
      losses: 2,
      proWinRate: 67.0,
      kda: 3.8,
      avgBanTurn: 5.7,
      avgPickRound: 2.5,
      blindPickRate: 16.7,
      averageGameTime: "34:45",
      csPerMinute: 6.0,
      damagePerMinute: 514,
      goldPerMinute: 345,
      csDiffAt15: -15.7,
      goldDiffAt15: -660,
      xpDiffAt15: -481,
      soloqKrChallengerWinRate: 56.47,
    },
  }),
  createChampion({
    id: "annie",
    goodVs: [
      { championId: "hwei", score: 4 },
      { championId: "viktor", score: 4 },
      { championId: "aurora", score: 4 },
      { championId: "sylas", score: 4 }
    ],

    weakVs: [
      { championId: "ryze", score: 3 },
      { championId: "syndra", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "ahri", score: 3 }
    ],
    synergyWith: [{ championId: "vi", score: 5 }, { championId: "jarvan-iv", score: 4 }, { championId: "wukong", score: 4 }],
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
      picks: 14,
      bans: 11,
      presence: 25.0,
      prioScore: 8.0,
      wins: 6,
      losses: 8,
      proWinRate: 43.0,
      kda: 3.0,
      avgBanTurn: 8.5,
      avgPickRound: 2.36,
      blindPickRate: 42.9,
      averageGameTime: "31:21",
      csPerMinute: 7.3,
      damagePerMinute: 736,
      goldPerMinute: 376,
      csDiffAt15: -13.1,
      goldDiffAt15: -782,
      xpDiffAt15: -743,
      soloqKrChallengerWinRate: 63.99,
    },
  }),
  createChampion({
    id: "naafiri",
    goodVs: [
      { championId: "dr-mundo", score: 5 },
      { championId: "nocturne", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "wukong", score: 3 }
    ],

    weakVs: [
      { championId: "vi", score: 4 },
      { championId: "xin-zhao", score: 3 }
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
      picks: 10,
      bans: 11,
      presence: 21.0,
      prioScore: 8.0,
      wins: 5,
      losses: 5,
      proWinRate: 50.0,
      kda: 5.3,
      avgBanTurn: 7.1,
      avgPickRound: 2.0,
      blindPickRate: 20.0,
      averageGameTime: "31:08",
      csPerMinute: 7.3,
      damagePerMinute: 619,
      goldPerMinute: 427,
      csDiffAt15: 9.5,
      goldDiffAt15: 398,
      xpDiffAt15: 420,
      soloqKrChallengerWinRate: 53.9,
    },
  }),
  createChampion({
    id: "leblanc",
    goodVs: [
      { championId: "taliyah", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "azir", score: 3 }
    ],

    weakVs: [
      { championId: "galio", score: 4 },
      { championId: "aurora", score: 4 }
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
      picks: 5,
      bans: 15,
      presence: 20.0,
      prioScore: 8.0,
      wins: 3,
      losses: 2,
      proWinRate: 60.0,
      kda: 3.8,
      avgBanTurn: 7.2,
      avgPickRound: 2.8,
      blindPickRate: 20.0,
      averageGameTime: "29:15",
      csPerMinute: 8.4,
      damagePerMinute: 805,
      goldPerMinute: 412,
      csDiffAt15: 5.2,
      goldDiffAt15: 478,
      xpDiffAt15: -130,
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
      picks: 8,
      bans: 9,
      presence: 17.0,
      prioScore: 6.0,
      wins: 3,
      losses: 5,
      proWinRate: 38.0,
      kda: 2.5,
      avgBanTurn: 5.3,
      avgPickRound: 1.75,
      blindPickRate: 25.0,
      averageGameTime: "32:30",
      csPerMinute: 7.6,
      damagePerMinute: 611,
      goldPerMinute: 434,
      csDiffAt15: 5.4,
      goldDiffAt15: 422,
      xpDiffAt15: 226,
      soloqKrChallengerWinRate: 58.1,
    },
  }),
  createChampion({
    id: "sylas",
    goodVs: [
      { championId: "orianna", score: 4 },
      { championId: "ashe", score: 3 },
      { championId: "maokai", score: 4 },
      { championId: "kennen", score: 5 },
      { championId: "ahri", score: 3 }
    ],

    weakVs: [
      { championId: "taliyah", score: 4 },
      { championId: "galio", score: 2 },
      { championId: "ryze", score: 3 }
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

    ],


    playerScaling: { mec: 4, tfg: 4, clt: 3, iq: 4 },

    name: "Sylas",
    image: "/champions/sylas.png",
    roles: ["mid", "jungle"],
    damageProfile: ["AP"],
    stats: {
      picks: 9,
      bans: 10,
      presence: 19.0,
      prioScore: 6.0,
      wins: 2,
      losses: 7,
      proWinRate: 22.0,
      kda: 1.9,
      avgBanTurn: 6.9,
      avgPickRound: 2.33,
      blindPickRate: 11.1,
      averageGameTime: "31:44",
      csPerMinute: 8.3,
      damagePerMinute: 521,
      goldPerMinute: 384,
      csDiffAt15: -18.1,
      goldDiffAt15: -359,
      xpDiffAt15: -330,
      soloqKrChallengerWinRate: 54.38,
    },
  }),
  createChampion({
    id: "cassiopeia",
    goodVs: [
      { championId: "azir", score: 5 },
      { championId: "yone", score: 4 },
      { championId: "viktor", score: 3 },
      { championId: "sylas", score: 3 },
      { championId: "ryze", score: 3 }
    ],

    weakVs: [
      { championId: "galio", score: 5 },
      { championId: "anivia", score: 5 },
      { championId: "ahri", score: 4 }
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
      picks: 5,
      bans: 10,
      presence: 15.0,
      prioScore: 6.0,
      wins: 2,
      losses: 3,
      proWinRate: 40.0,
      kda: 3.0,
      avgBanTurn: 4.2,
      avgPickRound: 1.4,
      blindPickRate: 0.0,
      averageGameTime: "35:09",
      csPerMinute: 8.6,
      damagePerMinute: 705,
      goldPerMinute: 408,
      csDiffAt15: -2.2,
      goldDiffAt15: -17,
      xpDiffAt15: 280,
      soloqKrChallengerWinRate: 57.03,
    },
  }),
  createChampion({
    id: "trundle",
    goodVs: [
      { championId: "ivern", score: 4 },
      { championId: "skarner", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "lee-sin", score: 3 }
    ],

    weakVs: [
      { championId: "poppy", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "pantheon", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "jarvan-iv", score: 3 }
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
      picks: 16,
      bans: 5,
      presence: 21.0,
      prioScore: 6.0,
      wins: 4,
      losses: 12,
      proWinRate: 25.0,
      kda: 2.5,
      avgBanTurn: 8.6,
      avgPickRound: 2.38,
      blindPickRate: 12.5,
      averageGameTime: "30:44",
      csPerMinute: 6.2,
      damagePerMinute: 413,
      goldPerMinute: 364,
      csDiffAt15: -15.8,
      goldDiffAt15: -446,
      xpDiffAt15: -829,
      soloqKrChallengerWinRate: null,
    },
  }),
  createChampion({
    id: "lee-sin",
    goodVs: [
      { championId: "maokai", score: 5 },
      { championId: "nocturne", score: 4 },
      { championId: "qiyana", score: 3 },
      { championId: "naafiri", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],

    weakVs: [
      { championId: "lillia", score: 5 },
      { championId: "pantheon", score: 4 },
      { championId: "poppy", score: 3 },
      { championId: "trundle", score: 3 },
      { championId: "vi", score: 3 }
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
      picks: 8,
      bans: 9,
      presence: 17.0,
      prioScore: 6.0,
      wins: 4,
      losses: 4,
      proWinRate: 50.0,
      kda: 3.3,
      avgBanTurn: 7.7,
      avgPickRound: 2.75,
      blindPickRate: 37.5,
      averageGameTime: "33:54",
      csPerMinute: 6.4,
      damagePerMinute: 586,
      goldPerMinute: 389,
      csDiffAt15: 1.1,
      goldDiffAt15: 444,
      xpDiffAt15: 267,
      soloqKrChallengerWinRate: 57.05,
    },
  }),
  createChampion({
    id: "kennen",
    goodVs: [
      { championId: "jax", score: 5 },
      { championId: "gnar", score: 4 },
      { championId: "renekton", score: 4 }
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
      picks: 5,
      bans: 10,
      presence: 15.0,
      prioScore: 6.0,
      wins: 3,
      losses: 2,
      proWinRate: 60.0,
      kda: 2.2,
      avgBanTurn: 8.9,
      avgPickRound: 2.8,
      blindPickRate: 40.0,
      averageGameTime: "33:03",
      csPerMinute: 8.1,
      damagePerMinute: 701,
      goldPerMinute: 369,
      csDiffAt15: -3.8,
      goldDiffAt15: -358,
      xpDiffAt15: -79,
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
    ],

    needs: [
      { type: "frontline", priority: 1 }
    ],
    weaknesses: [

    ],


    playerScaling: { mec: 5, tfg: 4, clt: 3, iq: 4 },

    name: "Yone",
    image: "/champions/yone.png",
    roles: ["mid"],
    damageProfile: ["AD"],
    stats: {
      picks: 9,
      bans: 6,
      presence: 15.0,
      prioScore: 5.0,
      wins: 3,
      losses: 6,
      proWinRate: 33.0,
      kda: 2.0,
      avgBanTurn: 6.7,
      avgPickRound: 2.0,
      blindPickRate: 22.2,
      averageGameTime: "31:29",
      csPerMinute: 9.7,
      damagePerMinute: 616,
      goldPerMinute: 419,
      csDiffAt15: 13.3,
      goldDiffAt15: 206,
      xpDiffAt15: 318,
      soloqKrChallengerWinRate: 54.63,
    },
  }),
  createChampion({
    id: "zoe",
    goodVs: [
      { championId: "azir", score: 5 },
      { championId: "taliyah", score: 5 },
      { championId: "aurora", score: 3 },
      { championId: "ryze", score: 3 }
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
      picks: 7,
      bans: 7,
      presence: 14.0,
      prioScore: 5.0,
      wins: 2,
      losses: 5,
      proWinRate: 29.0,
      kda: 3.3,
      avgBanTurn: 3.9,
      avgPickRound: 2.57,
      blindPickRate: 57.1,
      averageGameTime: "32:50",
      csPerMinute: 7.8,
      damagePerMinute: 731,
      goldPerMinute: 376,
      csDiffAt15: -10.9,
      goldDiffAt15: 46,
      xpDiffAt15: -149,
      soloqKrChallengerWinRate: 56.32,
    },
  }),
  createChampion({
    id: "lux",
    goodVs: [
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 4 },
      { championId: "heimerdinger", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "nami", score: 3 }
    ],

    weakVs: [
      { championId: "rakan", score: 4 },
      { championId: "annie", score: 3 },
      { championId: "nautilus", score: 3 }
    ],
    synergyWith: [{ championId: "caitlyn", score: 5 }, { championId: "ezreal", score: 3 }, { championId: "jhin", score: 3 }],
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
      picks: 2,
      bans: 9,
      presence: 11.0,
      prioScore: 5.0,
      wins: 1,
      losses: 1,
      proWinRate: 50.0,
      kda: 1.3,
      avgBanTurn: 2.7,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "34:32",
      csPerMinute: 1.2,
      damagePerMinute: 431,
      goldPerMinute: 255,
      csDiffAt15: -7,
      goldDiffAt15: -362,
      xpDiffAt15: -330,
      soloqKrChallengerWinRate: 55.59,
    },
  }),
  createChampion({
    id: "yasuo",
    weakVs: [{ championId: "renekton", score: 3 }, { championId: "malphite", score: 3 }, { championId: "annie", score: 3 }],
    synergyWith: [{ championId: "rakan", score: 4 }, { championId: "rell", score: 4 }, { championId: "alistar", score: 4 }, { championId: "sejuani", score: 4 }],
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
      picks: 5,
      bans: 8,
      presence: 13.0,
      prioScore: 5.0,
      wins: 3,
      losses: 2,
      proWinRate: 60.0,
      kda: 3.7,
      avgBanTurn: 2.0,
      avgPickRound: 2.8,
      blindPickRate: 40.0,
      averageGameTime: "30:59",
      csPerMinute: 9.7,
      damagePerMinute: 485,
      goldPerMinute: 432,
      csDiffAt15: 12,
      goldDiffAt15: 314,
      xpDiffAt15: 74,
      soloqKrChallengerWinRate: 55.14,
    },
  }),
  createChampion({
    id: "rengar",
    synergyWith: [{ championId: "orianna", score: 5 }],
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
      picks: 1,
      bans: 8,
      presence: 9.0,
      prioScore: 4.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 0.8,
      avgBanTurn: 3.1,
      avgPickRound: 3.0,
      blindPickRate: 0.0,
      averageGameTime: "28:20",
      csPerMinute: 7.0,
      damagePerMinute: 459,
      goldPerMinute: 421,
      csDiffAt15: 2,
      goldDiffAt15: -222,
      xpDiffAt15: 730,
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
      picks: 2,
      bans: 7,
      presence: 9.0,
      prioScore: 4.0,
      wins: 2,
      losses: 0,
      proWinRate: 100.0,
      kda: 31.0,
      avgBanTurn: 3.3,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "29:31",
      csPerMinute: 9.4,
      damagePerMinute: 900,
      goldPerMinute: 458,
      csDiffAt15: -20.5,
      goldDiffAt15: -546,
      xpDiffAt15: -824,
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
      picks: 6,
      bans: 5,
      presence: 11.0,
      prioScore: 4.0,
      wins: 2,
      losses: 4,
      proWinRate: 33.0,
      kda: 1.7,
      avgBanTurn: 6.4,
      avgPickRound: 2.33,
      blindPickRate: 50.0,
      averageGameTime: "32:25",
      csPerMinute: 7.9,
      damagePerMinute: 755,
      goldPerMinute: 398,
      csDiffAt15: 9,
      goldDiffAt15: 111,
      xpDiffAt15: 17,
      soloqKrChallengerWinRate: 61.9,
    },
  }),
  createChampion({
    id: "maokai",
    goodVs: [
      { championId: "ivern", score: 4 },
      { championId: "gwen", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "lillia", score: 3 },
      { championId: "viego", score: 3 }
    ],

    weakVs: [
      { championId: "lee-sin", score: 5 },
      { championId: "nidalee", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "kindred", score: 3 }
    ],
    synergyWith: [{ championId: "azir", score: 4 }, { championId: "corki", score: 4 }, { championId: "jinx", score: 3 }, { championId: "miss-fortune", score: 3 }],
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
      picks: 14,
      bans: 1,
      presence: 15.0,
      prioScore: 4.0,
      wins: 4,
      losses: 10,
      proWinRate: 29.0,
      kda: 2.1,
      avgBanTurn: 3.0,
      avgPickRound: 2.5,
      blindPickRate: 35.7,
      averageGameTime: "31:23",
      csPerMinute: 6.0,
      damagePerMinute: 548,
      goldPerMinute: 344,
      csDiffAt15: -7.5,
      goldDiffAt15: -505,
      xpDiffAt15: -391,
      soloqKrChallengerWinRate: 56.69,
    },
  }),
  createChampion({
    id: "nidalee",
    goodVs: [
      { championId: "zyra", score: 4 },
      { championId: "gwen", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "lillia", score: 3 },
      { championId: "viego", score: 3 }
    ],

    weakVs: [
      { championId: "lee-sin", score: 5 },
      { championId: "nidalee", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "poppy", score: 3 },
      { championId: "kindred", score: 3 }
    ],
    mustWith: [{ championId: "renekton", score: 5 }, { championId: "twisted-fate", score: 4 }, { championId: "camille", score: 3 }],
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
      picks: 2,
      bans: 6,
      presence: 8.0,
      prioScore: 3.0,
      wins: 2,
      losses: 0,
      proWinRate: 100.0,
      kda: 11.0,
      avgBanTurn: 5.0,
      avgPickRound: 1.5,
      blindPickRate: 50.0,
      averageGameTime: "35:50",
      csPerMinute: 7.0,
      damagePerMinute: 716,
      goldPerMinute: 414,
      csDiffAt15: 5.5,
      goldDiffAt15: 236,
      xpDiffAt15: -222,
      soloqKrChallengerWinRate: 58.11,
    },
  }),
  createChampion({
    id: "lucian",
    goodVs: [
      { championId: "varus", score: 3 },
      { championId: "sivir", score: 3 },
      { championId: "aphelios", score: 3 },
      { championId: "ezreal", score: 2 }
    ],

    weakVs: [
      { championId: "ashe", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "kalista", score: 3 },
      { championId: "caitlyn", score: 3 },
      { championId: "corki", score: 3 }
    ],
    synergyWith: [{ championId: "lulu", score: 3 }],
    mustWith: [{ championId: "braum", score: 4 }, { championId: "nami", score: 5 }, { championId: "milio", score: 5 }],
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
      picks: 5,
      bans: 5,
      presence: 10.0,
      prioScore: 3.0,
      wins: 3,
      losses: 2,
      proWinRate: 60.0,
      kda: 2.1,
      avgBanTurn: 6.0,
      avgPickRound: 2.4,
      blindPickRate: 60.0,
      averageGameTime: "29:10",
      csPerMinute: 9.4,
      damagePerMinute: 821,
      goldPerMinute: 483,
      csDiffAt15: 3,
      goldDiffAt15: -340,
      xpDiffAt15: 76,
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
      picks: 0,
      bans: 7,
      presence: 7.0,
      prioScore: 3.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 1.3,
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
    synergyWith: [{ championId: "nami", score: 4 }, { championId: "thresh", score: 4 }],
    mustWith: [{ championId: "lulu", score: 5 }, { championId: "renata-glasc", score: 3 }, { championId: "milio", score: 5 }],
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
      picks: 8,
      bans: 2,
      presence: 10.0,
      prioScore: 3.0,
      wins: 5,
      losses: 3,
      proWinRate: 63.0,
      kda: 4.6,
      avgBanTurn: 9.0,
      avgPickRound: 1.88,
      blindPickRate: 37.5,
      averageGameTime: "28:41",
      csPerMinute: 9.6,
      damagePerMinute: 697,
      goldPerMinute: 513,
      csDiffAt15: -2.5,
      goldDiffAt15: 103,
      xpDiffAt15: -376,
      soloqKrChallengerWinRate: 56.21,
    },
  }),
  createChampion({
    id: "sejuani",
    goodVs: [
      { championId: "jarvan-iv", score: 3 }
    ],
    weakVs: [{ championId: "trundle", score: 4 }, { championId: "vi", score: 4 },
    { championId: "xin-zhao", score: 4 },
    { championId: "dr-mundo", score: 3 }],
    synergyWith: [{ championId: "yasuo", score: 4 }, { championId: "azir", score: 4 }, { championId: "renekton", score: 4 }, { championId: "gwen", score: 3 }],
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
      picks: 1,
      bans: 6,
      presence: 7.0,
      prioScore: 3.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 5.5,
      avgBanTurn: 7.0,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "37:12",
      csPerMinute: 6.3,
      damagePerMinute: 575,
      goldPerMinute: 346,
      csDiffAt15: 6,
      goldDiffAt15: -406,
      xpDiffAt15: 146,
      soloqKrChallengerWinRate: 50,
    },
  }),
  createChampion({
    id: "pyke",
    weakVs: [
      { championId: "bard", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "seraphine", score: 3 }
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
      picks: 2,
      bans: 5,
      presence: 7.0,
      prioScore: 3.0,
      wins: 0,
      losses: 2,
      proWinRate: 0.0,
      kda: 1.9,
      avgBanTurn: 5.8,
      avgPickRound: 1.5,
      blindPickRate: 50.0,
      averageGameTime: "27:12",
      csPerMinute: 1.3,
      damagePerMinute: 252,
      goldPerMinute: 268,
      csDiffAt15: 1,
      goldDiffAt15: 156,
      xpDiffAt15: -562,
      soloqKrChallengerWinRate: 55.06,
    },
  }),
  createChampion({
    id: "kogmaw",
    synergyWith: [{ championId: "nami", score: 5 }, { championId: "tahm-kench", score: 3 }, { championId: "janna", score: 4 }],
    mustWith: [{ championId: "lulu", score: 5 }, { championId: "braum", score: 4 }, { championId: "milio", score: 4 }],
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
      picks: 5,
      bans: 1,
      presence: 6.0,
      prioScore: 3.0,
      wins: 1,
      losses: 4,
      proWinRate: 20.0,
      kda: 1.6,
      avgBanTurn: 5.0,
      avgPickRound: 1.0,
      blindPickRate: 0.0,
      averageGameTime: "33:38",
      csPerMinute: 8.2,
      damagePerMinute: 1050,
      goldPerMinute: 430,
      csDiffAt15: 7,
      goldDiffAt15: 58,
      xpDiffAt15: 93,
      soloqKrChallengerWinRate: 56.98,
    },
  }),
  createChampion({
    id: "yorick",
    goodVs: [
      { championId: "ksante", score: 4 },
      { championId: "gnar", score: 3 }
    ],

    weakVs: [
      { championId: "rumble", score: 4 },
      { championId: "ambessa", score: 3 }
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
      picks: 3,
      bans: 4,
      presence: 7.0,
      prioScore: 2.0,
      wins: 2,
      losses: 1,
      proWinRate: 67.0,
      kda: 1.9,
      avgBanTurn: 9.0,
      avgPickRound: 2.67,
      blindPickRate: 0.0,
      averageGameTime: "36:43",
      csPerMinute: 8.4,
      damagePerMinute: 539,
      goldPerMinute: 435,
      csDiffAt15: 1.7,
      goldDiffAt15: 230,
      xpDiffAt15: -239,
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
      picks: 8,
      bans: 1,
      presence: 9.0,
      prioScore: 2.0,
      wins: 7,
      losses: 1,
      proWinRate: 88.0,
      kda: 7.9,
      avgBanTurn: 10.0,
      avgPickRound: 2.5,
      blindPickRate: 12.5,
      averageGameTime: "32:47",
      csPerMinute: 1.1,
      damagePerMinute: 159,
      goldPerMinute: 276,
      csDiffAt15: 0.4,
      goldDiffAt15: 19,
      xpDiffAt15: 122,
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
      picks: 1,
      bans: 4,
      presence: 5.0,
      prioScore: 2.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 2.8,
      avgBanTurn: 1.3,
      avgPickRound: 1.0,
      blindPickRate: null,
      averageGameTime: "43:27",
      csPerMinute: 5.5,
      damagePerMinute: 535,
      goldPerMinute: 318,
      csDiffAt15: -27,
      goldDiffAt15: -1067,
      xpDiffAt15: -1337,
      soloqKrChallengerWinRate: 54.9,
    },
  }),
  createChampion({
    id: "camille",
    goodVs: [
      { championId: "yorick", score: 5 },
      { championId: "rumble", score: 5 },
      { championId: "volibear", score: 3 },
      { championId: "ambessa", score: 3 },
      { championId: "gragas", score: 3 }
    ],

    weakVs: [
      { championId: "jayce", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "shen", score: 3 },
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
      picks: 6,
      bans: 2,
      presence: 8.0,
      prioScore: 2.0,
      wins: 2,
      losses: 4,
      proWinRate: 33.0,
      kda: 1.8,
      avgBanTurn: 9.5,
      avgPickRound: 2.67,
      blindPickRate: 16.7,
      averageGameTime: "32:27",
      csPerMinute: 7.3,
      damagePerMinute: 675,
      goldPerMinute: 397,
      csDiffAt15: -13.7,
      goldDiffAt15: -21,
      xpDiffAt15: -201,
      soloqKrChallengerWinRate: 55.22,
    },
  }),
  createChampion({
    id: "twisted-fate",
    goodVs: [
      { championId: "twisted-fate", score: 4 }
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
      picks: 2,
      bans: 3,
      presence: 5.0,
      prioScore: 2.0,
      wins: 1,
      losses: 1,
      proWinRate: 50.0,
      kda: 4.0,
      avgBanTurn: 2.7,
      avgPickRound: 1.5,
      blindPickRate: 50.0,
      averageGameTime: "32:21",
      csPerMinute: 8.7,
      damagePerMinute: 577,
      goldPerMinute: 486,
      csDiffAt15: 0.5,
      goldDiffAt15: 908,
      xpDiffAt15: 44,
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
      picks: 1,
      bans: 4,
      presence: 5.0,
      prioScore: 2.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: null,
      avgBanTurn: 8.0,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "41:24",
      csPerMinute: 7.8,
      damagePerMinute: 1059,
      goldPerMinute: 526,
      csDiffAt15: 0,
      goldDiffAt15: 1494,
      xpDiffAt15: 1204,
      soloqKrChallengerWinRate: 57.09,
    },
  }),
  createChampion({
    id: "vayne",
    goodVs: [
      { championId: "kaisa", score: 3 },
      { championId: "ksante", score: 3 }
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
      picks: 5,
      bans: 2,
      presence: 7.0,
      prioScore: 2.0,
      wins: 2,
      losses: 3,
      proWinRate: 40.0,
      kda: 1.7,
      avgBanTurn: 10.0,
      avgPickRound: 2.2,
      blindPickRate: 40.0,
      averageGameTime: "35:13",
      csPerMinute: 7.7,
      damagePerMinute: 592,
      goldPerMinute: 408,
      csDiffAt15: -20.2,
      goldDiffAt15: -997,
      xpDiffAt15: -370,
      soloqKrChallengerWinRate: 57.79,
    },
  }),
  createChampion({
    id: "viego",
    goodVs: [
      { championId: "skarner", score: 4 },
      { championId: "ivern", score: 4 },
      { championId: "wukong", score: 3 },
      { championId: "zyra", score: 3 }
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
      picks: 4,
      bans: 2,
      presence: 6.0,
      prioScore: 2.0,
      wins: 0,
      losses: 4,
      proWinRate: 0.0,
      kda: 1.4,
      avgBanTurn: 6.5,
      avgPickRound: 2.25,
      blindPickRate: 25.0,
      averageGameTime: "29:33",
      csPerMinute: 6.8,
      damagePerMinute: 399,
      goldPerMinute: 386,
      csDiffAt15: -10.8,
      goldDiffAt15: -354,
      xpDiffAt15: -652,
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
    synergyWith: [{ championId: "kalista", score: 5 }, { championId: "varus", score: 4 }, { championId: "corki", score: 3 }, { championId: "gwen", score: 3 }],
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
      picks: 4,
      bans: 2,
      presence: 6.0,
      prioScore: 2.0,
      wins: 3,
      losses: 1,
      proWinRate: 75.0,
      kda: 4.9,
      avgBanTurn: 9.5,
      avgPickRound: 2.25,
      blindPickRate: 25.0,
      averageGameTime: "30:50",
      csPerMinute: 1.0,
      damagePerMinute: 252,
      goldPerMinute: 275,
      csDiffAt15: -1.8,
      goldDiffAt15: 198,
      xpDiffAt15: 322,
      soloqKrChallengerWinRate: 62.26,
    },
  }),
  createChampion({
    id: "tristana",
    goodVs: [
      { championId: "sivir", score: 5 },
      { championId: "smolder", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "draven", score: 4 }
    ],

    weakVs: [
      { championId: "lucian", score: 5 },
      { championId: "ashe", score: 4 },
      { championId: "ryze", score: 4 },
      { championId: "miss-fortune", score: 4 },
      { championId: "varus", score: 4 }
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
      picks: 5,
      bans: 1,
      presence: 6.0,
      prioScore: 2.0,
      wins: 1,
      losses: 4,
      proWinRate: 20.0,
      kda: 2.0,
      avgBanTurn: 5.0,
      avgPickRound: 2.4,
      blindPickRate: 0.0,
      averageGameTime: "31:33",
      csPerMinute: 9.7,
      damagePerMinute: 693,
      goldPerMinute: 478,
      csDiffAt15: -7.4,
      goldDiffAt15: -811,
      xpDiffAt15: -394,
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
      picks: 0,
      bans: 4,
      presence: 4.0,
      prioScore: 2.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 3.0,
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
      picks: 0,
      bans: 4,
      presence: 4.0,
      prioScore: 2.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 5.5,
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
      picks: 3,
      bans: 2,
      presence: 5.0,
      prioScore: 2.0,
      wins: 2,
      losses: 1,
      proWinRate: 67.0,
      kda: 1.3,
      avgBanTurn: 8.5,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "26:37",
      csPerMinute: 9.1,
      damagePerMinute: 565,
      goldPerMinute: 399,
      csDiffAt15: -5.3,
      goldDiffAt15: -511,
      xpDiffAt15: -633,
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
    synergyWith: [{ championId: "neeko", score: 5 }, { championId: "leona", score: 4 }, { championId: "amumu", score: 4 }, { championId: "maokai", score: 3 }],
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
      picks: 10,
      bans: 0,
      presence: 10.0,
      prioScore: 2.0,
      wins: 6,
      losses: 4,
      proWinRate: 60.0,
      kda: 3.4,
      avgBanTurn: null,
      avgPickRound: 3.0,
      blindPickRate: 30.0,
      averageGameTime: "31:49",
      csPerMinute: 9.0,
      damagePerMinute: 735,
      goldPerMinute: 473,
      csDiffAt15: -3.7,
      goldDiffAt15: -700,
      xpDiffAt15: -288,
      soloqKrChallengerWinRate: 55.26,
    },
  }),
  createChampion({
    id: "hwei",
    goodVs: [
      { championId: "jayce", score: 5 },
      { championId: "akali", score: 5 },
      { championId: "sylas", score: 4 },
      { championId: "mel", score: 4 },
      { championId: "azir", score: 4 }
    ],

    weakVs: [
      { championId: "smolder", score: 5 },
      { championId: "annie", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "yone", score: 4 }
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
      picks: 8,
      bans: 0,
      presence: 8.0,
      prioScore: 2.0,
      wins: 3,
      losses: 5,
      proWinRate: 38.0,
      kda: 2.3,
      avgBanTurn: null,
      avgPickRound: 2.75,
      blindPickRate: 12.5,
      averageGameTime: "34:31",
      csPerMinute: 8.8,
      damagePerMinute: 784,
      goldPerMinute: 413,
      csDiffAt15: 11.4,
      goldDiffAt15: 380,
      xpDiffAt15: 413,
      soloqKrChallengerWinRate: 52.85,
    },
  }),
  createChampion({
    id: "volibear",
    goodVs: [
      { championId: "skarner", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "ambessa", score: 4 }
    ],

    weakVs: [
      { championId: "vi", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "camille", score: 4 }
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
      picks: 5,
      bans: 1,
      presence: 6.0,
      prioScore: 2.0,
      wins: 4,
      losses: 1,
      proWinRate: 80.0,
      kda: 4.9,
      avgBanTurn: 3.0,
      avgPickRound: 2.2,
      blindPickRate: 0.0,
      averageGameTime: "33:00",
      csPerMinute: 8.4,
      damagePerMinute: 671,
      goldPerMinute: 411,
      csDiffAt15: 9.8,
      goldDiffAt15: 285,
      xpDiffAt15: 145,
      soloqKrChallengerWinRate: 57.75,
    },
  }),
  createChampion({
    id: "yuumi",
    goodVs: [
      { championId: "lulu", score: 5 }
    ],

    weakVs: [
      { championId: "rakan", score: 5 },
      { championId: "seraphine", score: 4 }
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
      presence: 4.0,
      prioScore: 2.0,
      wins: 0,
      losses: 3,
      proWinRate: 0.0,
      kda: 3.0,
      avgBanTurn: 5.0,
      avgPickRound: 1.67,
      blindPickRate: 33.3,
      averageGameTime: "30:28",
      csPerMinute: 0.6,
      damagePerMinute: 249,
      goldPerMinute: 249,
      csDiffAt15: -3.7,
      goldDiffAt15: -493,
      xpDiffAt15: 507,
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
      picks: 3,
      bans: 1,
      presence: 4.0,
      prioScore: 1.0,
      wins: 0,
      losses: 3,
      proWinRate: 0.0,
      kda: 1.2,
      avgBanTurn: 7.0,
      avgPickRound: 1.67,
      blindPickRate: 33.3,
      averageGameTime: "31:26",
      csPerMinute: 8.0,
      damagePerMinute: 613,
      goldPerMinute: 400,
      csDiffAt15: 8.3,
      goldDiffAt15: -33,
      xpDiffAt15: -195,
      soloqKrChallengerWinRate: 58.55,
    },
  }),
  createChampion({
    id: "zeri",
    goodVs: [
      { championId: "ziggs", score: 5 },
      { championId: "jinx", score: 5 },
      { championId: "lucian", score: 4 },
      { championId: "jhin", score: 4 }
    ],

    weakVs: [
      { championId: "caitlyn", score: 5 },
      { championId: "ashe", score: 4 },
      { championId: "yunara", score: 4 },
      { championId: "senna", score: 4 },
      { championId: "smolder", score: 4 }
    ],
    mustWith: [{ championId: "lulu", score: 5 }, { championId: "yuumi", score: 5 }],
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
      bans: 1,
      presence: 4.0,
      prioScore: 1.0,
      wins: 1,
      losses: 2,
      proWinRate: 33.0,
      kda: 2.1,
      avgBanTurn: 8.0,
      avgPickRound: 2.33,
      blindPickRate: 0.0,
      averageGameTime: "30:49",
      csPerMinute: 10.3,
      damagePerMinute: 716,
      goldPerMinute: 501,
      csDiffAt15: 4.3,
      goldDiffAt15: -146,
      xpDiffAt15: -703,
      soloqKrChallengerWinRate: 61.17,
    },
  }),
  createChampion({
    id: "milio",
    goodVs: [
      { championId: "alistar", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "rakan", score: 4 }
    ],

    weakVs: [
      { championId: "nautilus", score: 5 },
      { championId: "bard", score: 4 },
      { championId: "neeko", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "braum", score: 4 }
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
      picks: 1,
      bans: 2,
      presence: 3.0,
      prioScore: 1.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 2.0,
      avgBanTurn: 10.0,
      avgPickRound: 3.0,
      blindPickRate: 0.0,
      averageGameTime: "27:46",
      csPerMinute: 0.9,
      damagePerMinute: 133,
      goldPerMinute: 279,
      csDiffAt15: -10,
      goldDiffAt15: -224,
      xpDiffAt15: -663,
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
      picks: 3,
      bans: 1,
      presence: 4.0,
      prioScore: 1.0,
      wins: 1,
      losses: 2,
      proWinRate: 33.0,
      kda: 1.0,
      avgBanTurn: 9.0,
      avgPickRound: 2.67,
      blindPickRate: 66.7,
      averageGameTime: "28:28",
      csPerMinute: 8.5,
      damagePerMinute: 507,
      goldPerMinute: 372,
      csDiffAt15: -3.7,
      goldDiffAt15: -601,
      xpDiffAt15: -440,
      soloqKrChallengerWinRate: 57.92,
    },
  }),
  createChampion({
    id: "reksai",
    goodVs: [
      { championId: "udyr", score: 5 },
      { championId: "ksante", score: 5 },
      { championId: "rumble", score: 4 }
    ],

    weakVs: [
      { championId: "zac", score: 5 },
      { championId: "aatrox", score: 4 },
      { championId: "renekton", score: 4 }
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
      picks: 5,
      bans: 0,
      presence: 5.0,
      prioScore: 1.0,
      wins: 3,
      losses: 2,
      proWinRate: 60.0,
      kda: 2.5,
      avgBanTurn: null,
      avgPickRound: 2.4,
      blindPickRate: 60.0,
      averageGameTime: "35:05",
      csPerMinute: 8.0,
      damagePerMinute: 554,
      goldPerMinute: 403,
      csDiffAt15: 7.4,
      goldDiffAt15: 197,
      xpDiffAt15: 217,
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
      bans: 2,
      presence: 2.0,
      prioScore: 1.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 5.5,
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
    synergyWith: [{ championId: "braum", score: 3 }, { championId: "lulu", score: 3 }, { championId: "tahm-kench", score: 3 }],
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
      picks: 3,
      bans: 0,
      presence: 3.0,
      prioScore: 1.0,
      wins: 1,
      losses: 2,
      proWinRate: 33.0,
      kda: 1.5,
      avgBanTurn: null,
      avgPickRound: 1.67,
      blindPickRate: 66.7,
      averageGameTime: "33:31",
      csPerMinute: 9.4,
      damagePerMinute: 1094,
      goldPerMinute: 415,
      csDiffAt15: 25.3,
      goldDiffAt15: 717,
      xpDiffAt15: 374,
      soloqKrChallengerWinRate: 59.49,
    },
  }),
  createChampion({
    id: "kalista",
    goodVs: [
      { championId: "lucian", score: 5 },
      { championId: "senna", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "varus", score: 4 },
      { championId: "ziggs", score: 4 }
    ],

    weakVs: [
      { championId: "aphelios", score: 5 },
      { championId: "ezreal", score: 4 },
      { championId: "draven", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "xayah", score: 4 }
    ],
    synergyWith: [{ championId: "renata-glasc", score: 5 }, { championId: "alistar", score: 4 }, { championId: "rell", score: 4 }, { championId: "neeko", score: 3 }],
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
      picks: 4,
      bans: 0,
      presence: 4.0,
      prioScore: 1.0,
      wins: 3,
      losses: 1,
      proWinRate: 75.0,
      kda: 4.3,
      avgBanTurn: null,
      avgPickRound: 2.25,
      blindPickRate: 50.0,
      averageGameTime: "35:47",
      csPerMinute: 9.3,
      damagePerMinute: 749,
      goldPerMinute: 485,
      csDiffAt15: 16,
      goldDiffAt15: 1232,
      xpDiffAt15: 52,
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
      bans: 1,
      presence: 2.0,
      prioScore: 1.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 0.6,
      avgBanTurn: 10.0,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "23:21",
      csPerMinute: 0.9,
      damagePerMinute: 221,
      goldPerMinute: 229,
      csDiffAt15: 2,
      goldDiffAt15: -378,
      xpDiffAt15: -1027,
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
      picks: 1,
      bans: 1,
      presence: 2.0,
      prioScore: 1.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 4.5,
      avgBanTurn: 8.0,
      avgPickRound: 2.0,
      blindPickRate: 100.0,
      averageGameTime: "31:39",
      csPerMinute: 7.9,
      damagePerMinute: 419,
      goldPerMinute: 415,
      csDiffAt15: 15,
      goldDiffAt15: 324,
      xpDiffAt15: 995,
      soloqKrChallengerWinRate: 52.38,
    },
  }),
  createChampion({
    id: "veigar",
    goodVs: [
      { championId: "azir", score: 5 }
    ],

    weakVs: [
      { championId: "taliyah", score: 5 },
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 1.0,
      wins: 0,
      losses: 2,
      proWinRate: 0.0,
      kda: 0.7,
      avgBanTurn: null,
      avgPickRound: 1.5,
      blindPickRate: 0.0,
      averageGameTime: "28:04",
      csPerMinute: 8.5,
      damagePerMinute: 533,
      goldPerMinute: 365,
      csDiffAt15: -12.5,
      goldDiffAt15: -880,
      xpDiffAt15: -259,
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
      picks: 1,
      bans: 1,
      presence: 2.0,
      prioScore: 1.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 3.3,
      avgBanTurn: 2.0,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "33:24",
      csPerMinute: 7.8,
      damagePerMinute: 823,
      goldPerMinute: 382,
      csDiffAt15: -20,
      goldDiffAt15: -744,
      xpDiffAt15: -629,
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
      bans: 1,
      presence: 2.0,
      prioScore: 1.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 0.0,
      avgBanTurn: 9.0,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "27:18",
      csPerMinute: 8.2,
      damagePerMinute: 499,
      goldPerMinute: 331,
      csDiffAt15: -4,
      goldDiffAt15: -226,
      xpDiffAt15: -584,
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
      picks: 2,
      bans: 1,
      presence: 3.0,
      prioScore: 1.0,
      wins: 1,
      losses: 1,
      proWinRate: 50.0,
      kda: 2.7,
      avgBanTurn: 9.0,
      avgPickRound: 4.5,
      blindPickRate: 0.0,
      averageGameTime: "30:18",
      csPerMinute: 8.7,
      damagePerMinute: 536,
      goldPerMinute: 407,
      csDiffAt15: -11,
      goldDiffAt15: 146,
      xpDiffAt15: 26,
      soloqKrChallengerWinRate: 63.5,
    },
  }),
  createChampion({
    id: "shen",
    goodVs: [
      { championId: "gwen", score: 5 },
      { championId: "rell", score: 5 },
      { championId: "ornn", score: 4 },
      { championId: "rumble", score: 4 },
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
      picks: 4,
      bans: 0,
      presence: 4.0,
      prioScore: 1.0,
      wins: 1,
      losses: 3,
      proWinRate: 25.0,
      kda: 1.9,
      avgBanTurn: null,
      avgPickRound: 3.25,
      blindPickRate: 0.0,
      averageGameTime: "29:46",
      csPerMinute: 5.0,
      damagePerMinute: 530,
      goldPerMinute: 347,
      csDiffAt15: -11.5,
      goldDiffAt15: -494,
      xpDiffAt15: -670,
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 1.0,
      wins: 1,
      losses: 1,
      proWinRate: 50.0,
      kda: 4.2,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "30:31",
      csPerMinute: 7.6,
      damagePerMinute: 715,
      goldPerMinute: 419,
      csDiffAt15: 8,
      goldDiffAt15: 254,
      xpDiffAt15: 197,
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 1.0,
      wins: 0,
      losses: 2,
      proWinRate: 0.0,
      kda: 1.1,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "30:00",
      csPerMinute: 9.1,
      damagePerMinute: 753,
      goldPerMinute: 389,
      csDiffAt15: -7,
      goldDiffAt15: 158,
      xpDiffAt15: 157,
      soloqKrChallengerWinRate: 62.87,
    },
  }),
  createChampion({
    id: "khazix",
    goodVs: [
      { championId: "xin-zhao", score: 5 },
      { championId: "rengar", score: 4 }
    ],
    synergyWith: [{ championId: "orianna", score: 5 }, {
      championId: "shen", score: 4
    }],
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
      picks: 3,
      bans: 0,
      presence: 3.0,
      prioScore: 1.0,
      wins: 1,
      losses: 2,
      proWinRate: 33.0,
      kda: 2.3,
      avgBanTurn: null,
      avgPickRound: 2.33,
      blindPickRate: 0.0,
      averageGameTime: "31:47",
      csPerMinute: 6.8,
      damagePerMinute: 689,
      goldPerMinute: 468,
      csDiffAt15: -0.3,
      goldDiffAt15: 938,
      xpDiffAt15: 227,
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 1.0,
      wins: 1,
      losses: 1,
      proWinRate: 50.0,
      kda: 4.4,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 50.0,
      averageGameTime: "32:05",
      csPerMinute: 7.8,
      damagePerMinute: 766,
      goldPerMinute: 388,
      csDiffAt15: -7,
      goldDiffAt15: -172,
      xpDiffAt15: -324,
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
      picks: 1,
      bans: 1,
      presence: 2.0,
      prioScore: 1.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 3.0,
      avgBanTurn: 10.0,
      avgPickRound: 3.0,
      blindPickRate: 0.0,
      averageGameTime: "29:31",
      csPerMinute: 1.0,
      damagePerMinute: 127,
      goldPerMinute: 251,
      csDiffAt15: 5,
      goldDiffAt15: -116,
      xpDiffAt15: 930,
      soloqKrChallengerWinRate: 60.66,
    },
  }),
  createChampion({
    id: "morgana",
    goodVs: [
      { championId: "vi", score: 5 },
      { championId: "leona", score: 3 }
    ],
    synergyWith: [{ championId: "caitlyn", score: 4 }, { championId: "miss-fortune", score: 3 }, { championId: "varus", score: 3 }],
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
      picks: 1,
      bans: 1,
      presence: 2.0,
      prioScore: 1.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 4.8,
      avgBanTurn: 4.0,
      avgPickRound: 5.0,
      blindPickRate: 0.0,
      averageGameTime: "34:15",
      csPerMinute: 6.9,
      damagePerMinute: 547,
      goldPerMinute: 380,
      csDiffAt15: 2,
      goldDiffAt15: 508,
      xpDiffAt15: 481,
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
      bans: 1,
      presence: 1.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 10.0,
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
      bans: 1,
      presence: 1.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 10.0,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 3.3,
      avgBanTurn: null,
      avgPickRound: 1.0,
      blindPickRate: 100.0,
      averageGameTime: "30:55",
      csPerMinute: 7.3,
      damagePerMinute: 607,
      goldPerMinute: 405,
      csDiffAt15: 1,
      goldDiffAt15: 926,
      xpDiffAt15: -198,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 1.4,
      avgBanTurn: null,
      avgPickRound: 1.0,
      blindPickRate: 100.0,
      averageGameTime: "33:02",
      csPerMinute: 8.2,
      damagePerMinute: 662,
      goldPerMinute: 359,
      csDiffAt15: -16,
      goldDiffAt15: -925,
      xpDiffAt15: -62,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 11.0,
      avgBanTurn: null,
      avgPickRound: 1.0,
      blindPickRate: 0.0,
      averageGameTime: "44:11",
      csPerMinute: 0.5,
      damagePerMinute: 166,
      goldPerMinute: 259,
      csDiffAt15: -21,
      goldDiffAt15: 85,
      xpDiffAt15: -3,
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
      picks: 0,
      bans: 1,
      presence: 1.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 7.0,
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
      bans: 1,
      presence: 1.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
      proWinRate: null,
      kda: 8.0,
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 0.0,
      wins: 1,
      losses: 1,
      proWinRate: 50.0,
      kda: 6.2,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "34:36",
      csPerMinute: 7.6,
      damagePerMinute: 985,
      goldPerMinute: 420,
      csDiffAt15: 11.5,
      goldDiffAt15: -485,
      xpDiffAt15: 222,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 0.6,
      avgBanTurn: null,
      avgPickRound: 1.0,
      blindPickRate: 0.0,
      averageGameTime: "27:45",
      csPerMinute: 7.9,
      damagePerMinute: 367,
      goldPerMinute: 386,
      csDiffAt15: -15,
      goldDiffAt15: -741,
      xpDiffAt15: 29,
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 0.0,
      wins: 2,
      losses: 0,
      proWinRate: 100.0,
      kda: 10.5,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 50.0,
      averageGameTime: "33:40",
      csPerMinute: 7.7,
      damagePerMinute: 607,
      goldPerMinute: 412,
      csDiffAt15: -1.5,
      goldDiffAt15: -8,
      xpDiffAt15: -39,
      soloqKrChallengerWinRate: 48.02,
    },
  }),
  createChampion({
    id: "skarner",
    goodVs: [
      { championId: "zed", score: 5 },
      { championId: "nocturne", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "wukong", score: 4 }
    ],

    weakVs: [
      { championId: "kayn", score: 5 },
      { championId: "volibear", score: 4 },
      { championId: "dr-mundo", score: 4 },
      { championId: "viego", score: 4 },
      { championId: "trundle", score: 4 }
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
      picks: 3,
      bans: 0,
      presence: 3.0,
      prioScore: 0.0,
      wins: 3,
      losses: 0,
      proWinRate: 100.0,
      kda: 7.1,
      avgBanTurn: null,
      avgPickRound: 3.0,
      blindPickRate: 66.7,
      averageGameTime: "36:26",
      csPerMinute: 6.2,
      damagePerMinute: 545,
      goldPerMinute: 381,
      csDiffAt15: 10,
      goldDiffAt15: 220,
      xpDiffAt15: 57,
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 0.0,
      wins: 1,
      losses: 1,
      proWinRate: 50.0,
      kda: 4.8,
      avgBanTurn: null,
      avgPickRound: 2.5,
      blindPickRate: 0.0,
      averageGameTime: "24:56",
      csPerMinute: 9.3,
      damagePerMinute: 624,
      goldPerMinute: 484,
      csDiffAt15: -1,
      goldDiffAt15: 388,
      xpDiffAt15: 1026,
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
      picks: 2,
      bans: 0,
      presence: 2.0,
      prioScore: 0.0,
      wins: 0,
      losses: 2,
      proWinRate: 0.0,
      kda: 1.2,
      avgBanTurn: null,
      avgPickRound: 2.5,
      blindPickRate: 0.0,
      averageGameTime: "34:40",
      csPerMinute: 7.7,
      damagePerMinute: 704,
      goldPerMinute: 355,
      csDiffAt15: -34.5,
      goldDiffAt15: -1312,
      xpDiffAt15: -812,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 5.0,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "30:26",
      csPerMinute: 7.9,
      damagePerMinute: 731,
      goldPerMinute: 435,
      csDiffAt15: -39,
      goldDiffAt15: -2464,
      xpDiffAt15: -2084,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 0.5,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "23:21",
      csPerMinute: 10.0,
      damagePerMinute: 417,
      goldPerMinute: 395,
      csDiffAt15: 12,
      goldDiffAt15: -76,
      xpDiffAt15: -1066,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 5.0,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 100.0,
      averageGameTime: "32:04",
      csPerMinute: 8.2,
      damagePerMinute: 1043,
      goldPerMinute: 438,
      csDiffAt15: 11,
      goldDiffAt15: -327,
      xpDiffAt15: -327,
      soloqKrChallengerWinRate: 57.04,
    },
  }),
  createChampion({
    id: "samira",
    synergyWith: [{ championId: "alistar", score: 4 }, { championId: "leona", score: 4 }, { championId: "rell", score: 4 }],
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 4.8,
      avgBanTurn: null,
      avgPickRound: 2.0,
      blindPickRate: 0.0,
      averageGameTime: "34:10",
      csPerMinute: 8.0,
      damagePerMinute: 1507,
      goldPerMinute: 539,
      csDiffAt15: -10,
      goldDiffAt15: -149,
      xpDiffAt15: -610,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 1,
      losses: 0,
      proWinRate: 100.0,
      kda: 7.3,
      avgBanTurn: null,
      avgPickRound: 3.0,
      blindPickRate: 0.0,
      averageGameTime: "52:58",
      csPerMinute: 7.2,
      damagePerMinute: 1211,
      goldPerMinute: 483,
      csDiffAt15: 8,
      goldDiffAt15: 1297,
      xpDiffAt15: 1080,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 2.0,
      avgBanTurn: null,
      avgPickRound: 3.0,
      blindPickRate: 100.0,
      averageGameTime: "42:36",
      csPerMinute: 7.3,
      damagePerMinute: 1077,
      goldPerMinute: 395,
      csDiffAt15: -4,
      goldDiffAt15: -899,
      xpDiffAt15: 23,
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
      picks: 1,
      bans: 0,
      presence: 1.0,
      prioScore: 0.0,
      wins: 0,
      losses: 1,
      proWinRate: 0.0,
      kda: 1.8,
      avgBanTurn: null,
      avgPickRound: 4.0,
      blindPickRate: 0.0,
      averageGameTime: "26:44",
      csPerMinute: 6.5,
      damagePerMinute: 634,
      goldPerMinute: 358,
      csDiffAt15: -24,
      goldDiffAt15: -213,
      xpDiffAt15: -1907,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      picks: 0,
      bans: 0,
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      picks: 0,
      bans: 0,
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      picks: 0,
      bans: 0,
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      bans: 0,
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
      presence: 0.0,
      prioScore: 0.0,
      wins: null,
      losses: null,
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
