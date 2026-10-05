// Auto-generated from combined MSI + Summer Split 2026 pro data provided by the user.
// Counts are summed; performance averages are weighted by the relevant sample size.
// prioScore is weighted by tournament game count (MSI: 71 games, Summer Split: 386 games).

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
      { championId: "taliyah", score: 4 },
      { championId: "azir", score: 1 },
      { championId: "viktor", score: 3 },
      { championId: "galio", score: 3 },
    ],

    weakVs: [
      { championId: "akali", score: 3 },
      { championId: "leblanc", score: 2 },
      { championId: "yone", score: 3 },
    ],

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
      picks: 87,
      bans: 254,
      presence: 341,
      prioScore: 70,
      wins: 49,
      losses: 38,
      proWinRate: 56,
      kda: 4.6,
      avgBanTurn: 3.5,
      avgPickRound: 1.57,
      blindPickRate: 84.9,
      averageGameTime: "31:14",
      csPerMinute: 9.1,
      damagePerMinute: 666,
      goldPerMinute: 412,
      csDiffAt15: 5.8,
      goldDiffAt15: 11,
      xpDiffAt15: 6,
      soloqKrChallengerWinRate: 53.4,
    },
  }),


  createChampion({
    id: "ambessa",
    goodVs: [
      { championId: "xin-zhao", score: 3 },
      { championId: "ornn", score: 4 },
      { championId: "jax", score: 3 },
      { championId: "yorick", score: 2 },
      { championId: "wukong", score: 2 }
    ],

    weakVs: [
      { championId: "poppy", score: 4 },
      { championId: "gwen", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "renekton", score: 2 },
      { championId: "rumble", score: 2 }
    ],

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
      picks: 113,
      bans: 46,
      presence: 159,
      prioScore: 29,
      wins: 51,
      losses: 62,
      proWinRate: 45,
      kda: 2.2,
      avgBanTurn: 7.7,
      avgPickRound: 1.54,
      blindPickRate: 45.5,
      averageGameTime: "32:24",
      csPerMinute: 8.6,
      damagePerMinute: 575,
      goldPerMinute: 386,
      csDiffAt15: -1.4,
      goldDiffAt15: -110,
      xpDiffAt15: -100,
      soloqKrChallengerWinRate: 56,
    },
  }),


  createChampion({
    id: "jarvan-iv",
    goodVs: [
      { championId: "sejuani", score: 2 },
      { championId: "dr-mundo", score: 2 },
      { championId: "ambessa", score: 5 },
      { championId: "pantheon", score: 3 },
      { championId: "xin-zhao", score: 2 }
    ],

    weakVs: [
      { championId: "lee-sin", score: 5 },
      { championId: "ezreal", score: 5 },
      { championId: "qiyana", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "maokai", score: 2 },
      { championId: "poppy", score: 2 }
    ],

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
      picks: 143,
      bans: 75,
      presence: 218,
      prioScore: 41,
      wins: 73,
      losses: 70,
      proWinRate: 51,
      kda: 3.8,
      avgBanTurn: 4.7,
      avgPickRound: 1.45,
      blindPickRate: 63.9,
      averageGameTime: "32:30",
      csPerMinute: 6.8,
      damagePerMinute: 428,
      goldPerMinute: 387,
      csDiffAt15: 0,
      goldDiffAt15: -143,
      xpDiffAt15: -55,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "rumble",
    goodVs: [
      { championId: "kennen", score: 3 },
      { championId: "yorick", score: 5 },
      { championId: "ornn", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "ksante", score: 3 },
    ],

    weakVs: [
      { championId: "gnar", score: 3 },
      { championId: "gwen", score: 3 },
      { championId: "aurora", score: 2 }
    ],

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
      picks: 124,
      bans: 73,
      presence: 197,
      prioScore: 36,
      wins: 65,
      losses: 59,
      proWinRate: 52,
      kda: 3.2,
      avgBanTurn: 5.8,
      avgPickRound: 1.64,
      blindPickRate: 82.4,
      averageGameTime: "32:32",
      csPerMinute: 8.2,
      damagePerMinute: 697,
      goldPerMinute: 383,
      csDiffAt15: 1.6,
      goldDiffAt15: -45,
      xpDiffAt15: 143,
      soloqKrChallengerWinRate: 60,
    },
  }),


  createChampion({
    id: "vi",
    goodVs: [
      { championId: "dr-mundo", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "viego", score: 3 },
      { championId: "nocturne", score: 3 },
      { championId: "naafiri", score: 3 }
    ],

    weakVs: [
      { championId: "poppy", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "khazix", score: 2 },
      { championId: "skarner", score: 3 }
    ],

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
      picks: 99,
      bans: 210,
      presence: 309,
      prioScore: 61,
      wins: 55,
      losses: 44,
      proWinRate: 56,
      kda: 3.2,
      avgBanTurn: 3.9,
      avgPickRound: 1.68,
      blindPickRate: 84.5,
      averageGameTime: "32:46",
      csPerMinute: 7,
      damagePerMinute: 385,
      goldPerMinute: 394,
      csDiffAt15: 1.2,
      goldDiffAt15: 139,
      xpDiffAt15: 204,
      soloqKrChallengerWinRate: 55.57,
    },
  }),


  createChampion({
    id: "neeko",
    goodVs: [
      { championId: "rakan", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "nautilus", score: 3 },
      { championId: "renata-glasc", score: 3 },
    ],

    weakVs: [
      { championId: "bard", score: 4 },
      { championId: "karma", score: 3 },
      { championId: "seraphine", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "ezreal", score: 4 },
    ],

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
      picks: 18,
      bans: 11,
      presence: 29,
      prioScore: 4,
      wins: 10,
      losses: 8,
      proWinRate: 56,
      kda: 2.6,
      avgBanTurn: 8.7,
      avgPickRound: 2.39,
      blindPickRate: 25.9,
      averageGameTime: "35:14",
      csPerMinute: 1.1,
      damagePerMinute: 321,
      goldPerMinute: 272,
      csDiffAt15: -0.3,
      goldDiffAt15: -188,
      xpDiffAt15: 26,
      soloqKrChallengerWinRate: 56.7,
    },
  }),


  createChampion({
    id: "nautilus",
    goodVs: [
      { championId: "nami", score: 4 },
      { championId: "milio", score: 4 },
      { championId: "karma", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "seraphine", score: 2 },
    ],

    weakVs: [
      { championId: "morgana", score: 4 },
      { championId: "poppy", score: 2 },
      { championId: "rakan", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "alistar", score: 3 },
    ],

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
      picks: 102,
      bans: 110,
      presence: 212,
      prioScore: 38,
      wins: 41,
      losses: 61,
      proWinRate: 40,
      kda: 2.4,
      avgBanTurn: 6.8,
      avgPickRound: 1.78,
      blindPickRate: 52.8,
      averageGameTime: "31:50",
      csPerMinute: 1.1,
      damagePerMinute: 170,
      goldPerMinute: 252,
      csDiffAt15: 1.6,
      goldDiffAt15: -89,
      xpDiffAt15: -126,
      soloqKrChallengerWinRate: 56,
    },
  }),

  createChampion({
    id: "varus",
    goodVs: [
      { championId: "ezreal", score: 3 },
      { championId: "aphelios", score: 3 },
      { championId: "corki", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "ziggs", score: 3 },
    ],

    weakVs: [
      { championId: "xayah", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "zeri", score: 3 },
      { championId: "kalista", score: 3 }
    ],

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
      picks: 67,
      bans: 66,
      presence: 133,
      prioScore: 23,
      wins: 31,
      losses: 36,
      proWinRate: 46,
      kda: 2.8,
      avgBanTurn: 5.1,
      avgPickRound: 2.05,
      blindPickRate: 63.2,
      averageGameTime: "32:32",
      csPerMinute: 9.2,
      damagePerMinute: 768,
      goldPerMinute: 454,
      csDiffAt15: 2.6,
      goldDiffAt15: -103,
      xpDiffAt15: -189,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "ryze",
    goodVs: [
      { championId: "aurora", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "annie", score: 3 },
      { championId: "taliyah", score: 3 },
    ],

    weakVs: [
      { championId: "akali", score: 4 },
      { championId: "twisted-fate", score: 2 },
      { championId: "anivia", score: 3 },
      { championId: "cassiopeia", score: 3 },
    ],

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
      picks: 126,
      bans: 46,
      presence: 172,
      prioScore: 30,
      wins: 57,
      losses: 69,
      proWinRate: 45,
      kda: 3.5,
      avgBanTurn: 5.7,
      avgPickRound: 1.65,
      blindPickRate: 81,
      averageGameTime: "32:28",
      csPerMinute: 9.5,
      damagePerMinute: 630,
      goldPerMinute: 414,
      csDiffAt15: -1.5,
      goldDiffAt15: -155,
      xpDiffAt15: -202,
      soloqKrChallengerWinRate: 52,
    },
  }),

  createChampion({
    id: "yunara",
    goodVs: [
      { championId: "kaisa", score: 4 },
      { championId: "smolder", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "sivir", score: 3 },
    ],

    weakVs: [
      { championId: "caitlyn", score: 4 },
      { championId: "ashe", score: 3 },
      { championId: "miss-fortune", score: 3 },
      { championId: "ezreal", score: 3 }
    ],

    synergyWith: [
      { championId: "nautilus", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "alistar", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "karma", score: 3 },
      { championId: "thresh", score: 3 },
      { championId: "jarvan-iv", score: 3 }
    ],

    mustWith: [
      { championId: "lulu", score: 5 },
      { championId: "milio", score: 5 },
      { championId: "nami", score: 4 }
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
      picks: 30,
      bans: 7,
      presence: 37,
      prioScore: 5,
      wins: 14,
      losses: 16,
      proWinRate: 47,
      kda: 2.4,
      avgBanTurn: 9.7,
      avgPickRound: 2.5,
      blindPickRate: 37.6,
      averageGameTime: "31:06",
      csPerMinute: 9.9,
      damagePerMinute: 705,
      goldPerMinute: 484,
      csDiffAt15: -12.5,
      goldDiffAt15: -286,
      xpDiffAt15: -461,
      soloqKrChallengerWinRate: 56,
    },
  }),


  createChampion({
    id: "azir",
    goodVs: [
      { championId: "viktor", score: 4 },
      { championId: "aurora", score: 4 },
      { championId: "sylas", score: 3 },
      { championId: "galio", score: 3 },
      { championId: "twisted-fate", score: 3 },
    ],

    weakVs: [
      { championId: "cassiopeia", score: 4 },
      { championId: "akali", score: 3 },
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
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 0,
      wins: 1,
      losses: 2,
      proWinRate: 33,
      kda: 2.3,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "31:37",
      csPerMinute: 9,
      damagePerMinute: 792,
      goldPerMinute: 385,
      csDiffAt15: -11.3,
      goldDiffAt15: -833,
      xpDiffAt15: -338,
      soloqKrChallengerWinRate: 42.44,
    },
  }),


  createChampion({
    id: "xin-zhao",
    goodVs: [
      { championId: "pantheon", score: 4 },
      { championId: "nocturne", score: 3 },
      { championId: "kindred", score: 3 },
      { championId: "zaahen", score: 3 },
      { championId: "sejuani", score: 3 },
    ],

    weakVs: [
      { championId: "ambessa", score: 4 },
      { championId: "khazix", score: 4 },
      { championId: "jax", score: 3 },
      { championId: "skarner", score: 3 },
      { championId: "poppy", score: 3 },
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
      picks: 71,
      bans: 35,
      presence: 106,
      prioScore: 18,
      wins: 34,
      losses: 37,
      proWinRate: 48,
      kda: 2.9,
      avgBanTurn: 8.1,
      avgPickRound: 1.89,
      blindPickRate: 15.1,
      averageGameTime: "31:37",
      csPerMinute: 7.2,
      damagePerMinute: 501,
      goldPerMinute: 392,
      csDiffAt15: -0.3,
      goldDiffAt15: -264,
      xpDiffAt15: -95,
      soloqKrChallengerWinRate: 59.6,
    },
  }),


  createChampion({
    id: "karma",
    goodVs: [
      { championId: "soraka", score: 4 },
      { championId: "neeko", score: 3 },
      { championId: "nami", score: 3 },
      { championId: "braum", score: 2 },
      { championId: "bard", score: 3 },
    ],

    weakVs: [
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "thresh", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "alistar", score: 2 },
    ],

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
      picks: 47,
      bans: 23,
      presence: 70,
      prioScore: 12,
      wins: 25,
      losses: 22,
      proWinRate: 53,
      kda: 3.9,
      avgBanTurn: 8.1,
      avgPickRound: 2.04,
      blindPickRate: 51.1,
      averageGameTime: "34:06",
      csPerMinute: 1.1,
      damagePerMinute: 238,
      goldPerMinute: 267,
      csDiffAt15: 0.2,
      goldDiffAt15: 6,
      xpDiffAt15: 103,
      soloqKrChallengerWinRate: 55,
    },
  }),


  createChampion({
    id: "ezreal",
    goodVs: [
      { championId: "jhin", score: 4 },
      { championId: "vayne", score: 4 },
      { championId: "corki", score: 3 },
      { championId: "ziggs", score: 3 },
      { championId: "miss-fortune", score: 3 },
    ],

    weakVs: [
      { championId: "draven", score: 4 },
      { championId: "kalista", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "sivir", score: 3 },
    ],

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
      picks: 120,
      bans: 162,
      presence: 282,
      prioScore: 56,
      wins: 68,
      losses: 52,
      proWinRate: 57,
      kda: 4.5,
      avgBanTurn: 4.7,
      avgPickRound: 1.49,
      blindPickRate: 79.6,
      averageGameTime: "32:49",
      csPerMinute: 10,
      damagePerMinute: 835,
      goldPerMinute: 484,
      csDiffAt15: 0.8,
      goldDiffAt15: -63,
      xpDiffAt15: 4,
      soloqKrChallengerWinRate: 54.8,
    },
  }),


  createChampion({
    id: "pantheon",
    goodVs: [
      { championId: "aatrox", score: 4 },
      { championId: "viego", score: 4 },
      { championId: "nocturne", score: 3 },
      { championId: "lee-sin", score: 3 },
      { championId: "lillia", score: 3 },
    ],

    weakVs: [
      { championId: "poppy", score: 4 },
      { championId: "maokai", score: 3 },
      { championId: "sejuani", score: 3 },
      { championId: "skarner", score: 3 },
      { championId: "jarvan-iv", score: 3 },
    ],

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
      picks: 67,
      bans: 29,
      presence: 96,
      prioScore: 14,
      wins: 41,
      losses: 26,
      proWinRate: 61,
      kda: 3.9,
      avgBanTurn: 7,
      avgPickRound: 2.15,
      blindPickRate: 30.9,
      averageGameTime: "32:44",
      csPerMinute: 6.7,
      damagePerMinute: 563,
      goldPerMinute: 405,
      csDiffAt15: -3.4,
      goldDiffAt15: -4,
      xpDiffAt15: -107,
      soloqKrChallengerWinRate: 55.2,
    },
  }),

  createChampion({
    id: "caitlyn",
    goodVs: [
      { championId: "zeri", score: 4 },
      { championId: "varus", score: 3 },
      { championId: "jhin", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "aphelios", score: 3 },
    ],

    weakVs: [
      { championId: "kalista", score: 4 },
      { championId: "draven", score: 2 },
      { championId: "lucian", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "kaisa", score: 3 },
    ],

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
      picks: 46,
      bans: 65,
      presence: 111,
      prioScore: 20,
      wins: 23,
      losses: 23,
      proWinRate: 50,
      kda: 3.4,
      avgBanTurn: 6.9,
      avgPickRound: 2.28,
      blindPickRate: 34.9,
      averageGameTime: "33:36",
      csPerMinute: 10.1,
      damagePerMinute: 773,
      goldPerMinute: 490,
      csDiffAt15: 5.8,
      goldDiffAt15: 338,
      xpDiffAt15: -25,
      soloqKrChallengerWinRate: 59.4,
    },
  }),


  createChampion({
    id: "ahri",
    goodVs: [
      { championId: "akali", score: 4 },
      { championId: "viktor", score: 3 },
      { championId: "syndra", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "aurora", score: 3 },
    ],

    weakVs: [
      { championId: "cassiopeia", score: 4 },
      { championId: "leblanc", score: 3 },
      { championId: "aurelion-sol", score: 3 },
      { championId: "sylas", score: 2 },
      { championId: "lissandra", score: 3 },
    ],

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
      picks: 49,
      bans: 26,
      presence: 75,
      prioScore: 12,
      wins: 27,
      losses: 22,
      proWinRate: 55,
      kda: 4.8,
      avgBanTurn: 8.3,
      avgPickRound: 2.04,
      blindPickRate: 35.4,
      averageGameTime: "32:24",
      csPerMinute: 8.9,
      damagePerMinute: 727,
      goldPerMinute: 428,
      csDiffAt15: 7.5,
      goldDiffAt15: 180,
      xpDiffAt15: 190,
      soloqKrChallengerWinRate: 59,
    },
  }),

  createChampion({
    id: "bard",
    goodVs: [
      { championId: "leona", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "braum", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "rakan", score: 3 },
    ],

    weakVs: [
      { championId: "nami", score: 4 },
      { championId: "yuumi", score: 3 },
      { championId: "janna", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "karma", score: 3 },
    ],

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
      picks: 76,
      bans: 124,
      presence: 200,
      prioScore: 38,
      wins: 39,
      losses: 37,
      proWinRate: 51,
      kda: 4,
      avgBanTurn: 5.7,
      avgPickRound: 1.88,
      blindPickRate: 71.6,
      averageGameTime: "32:21",
      csPerMinute: 1.1,
      damagePerMinute: 220,
      goldPerMinute: 270,
      csDiffAt15: -3.3,
      goldDiffAt15: 15,
      xpDiffAt15: 8,
      soloqKrChallengerWinRate: 58,
    },
  }),

  createChampion({
    id: "taliyah",
    goodVs: [
      { championId: "syndra", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "hwei", score: 3 },
      { championId: "viktor", score: 3 },
      { championId: "twisted-fate", score: 3 },
    ],

    weakVs: [
      { championId: "ziggs", score: 3 },
      { championId: "yone", score: 3 },
      { championId: "kassadin", score: 3 },
      { championId: "leblanc", score: 3 },
    ],

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
      picks: 40,
      bans: 26,
      presence: 66,
      prioScore: 11,
      wins: 23,
      losses: 17,
      proWinRate: 58,
      kda: 4.2,
      avgBanTurn: 8.1,
      avgPickRound: 2.15,
      blindPickRate: 17.9,
      averageGameTime: "32:02",
      csPerMinute: 9.3,
      damagePerMinute: 628,
      goldPerMinute: 419,
      csDiffAt15: -2.9,
      goldDiffAt15: -218,
      xpDiffAt15: 11,
      soloqKrChallengerWinRate: 58,
    },
  }),

  createChampion({
    id: "sion",
    goodVs: [
      { championId: "aurora", score: 3 },
      { championId: "jayce", score: 3 },
      { championId: "renekton", score: 2 },
      { championId: "volibear", score: 3 },
      { championId: "yorick", score: 3 },
    ],

    weakVs: [
      { championId: "mordekaiser", score: 4 },
      { championId: "kennen", score: 4 },
      { championId: "gwen", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "camille", score: 3 },
    ],

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
      picks: 15,
      bans: 1,
      presence: 16,
      prioScore: 3,
      wins: 1,
      losses: 14,
      proWinRate: 7,
      kda: 1.6,
      avgBanTurn: 7,
      avgPickRound: 1.87,
      blindPickRate: 40,
      averageGameTime: "32:13",
      csPerMinute: 7.5,
      damagePerMinute: 523,
      goldPerMinute: 328,
      csDiffAt15: -12.3,
      goldDiffAt15: -606,
      xpDiffAt15: -134,
      soloqKrChallengerWinRate: 51,
    },
  }),


  createChampion({
    id: "ksante",
    goodVs: [
      { championId: "jayce", score: 3 },
      { championId: "jax", score: 3 },
      { championId: "sion", score: 3 },
      { championId: "aurora", score: 3 },
    ],

    weakVs: [
      { championId: "vayne", score: 4 },
      { championId: "renekton", score: 3 },
      { championId: "rumble", score: 3 },
      { championId: "ambessa", score: 3 },
      { championId: "yorick", score: 3 },
    ],

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
      picks: 70,
      bans: 34,
      presence: 104,
      prioScore: 17,
      wins: 38,
      losses: 32,
      proWinRate: 54,
      kda: 3.1,
      avgBanTurn: 8.3,
      avgPickRound: 2.05,
      blindPickRate: 25.5,
      averageGameTime: "33:14",
      csPerMinute: 8.3,
      damagePerMinute: 392,
      goldPerMinute: 376,
      csDiffAt15: 0.4,
      goldDiffAt15: -142,
      xpDiffAt15: 113,
      soloqKrChallengerWinRate: 51,
    },
  }),


  createChampion({
    id: "dr-mundo",
    goodVs: [
      { championId: "skarner", score: 4 },
      { championId: "lillia", score: 4 },
      { championId: "maokai", score: 3 },
      { championId: "xin-zhao", score: 3 },
      { championId: "viego", score: 3 },
    ],

    weakVs: [
      { championId: "aatrox", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "nocturne", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "pantheon", score: 3 },
    ],

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
      picks: 14,
      bans: 11,
      presence: 25,
      prioScore: 4,
      wins: 7,
      losses: 7,
      proWinRate: 50,
      kda: 7.7,
      avgBanTurn: 8.8,
      avgPickRound: 2.79,
      blindPickRate: 8.9,
      averageGameTime: "33:48",
      csPerMinute: 8.1,
      damagePerMinute: 710,
      goldPerMinute: 391,
      csDiffAt15: -4.9,
      goldDiffAt15: -238,
      xpDiffAt15: -61,
      soloqKrChallengerWinRate: 53,
    },
  }),


  createChampion({
    id: "zaahen",
    goodVs: [
      { championId: "ksante", score: 4 },
      { championId: "sion", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "vi", score: 3 },
    ],

    weakVs: [
      { championId: "ambessa", score: 4 },
      { championId: "xin-zhao", score: 3 },
      { championId: "gnar", score: 3 },
      { championId: "aatrox", score: 3 },
    ],

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
      picks: 27,
      bans: 4,
      presence: 31,
      prioScore: 4,
      wins: 9,
      losses: 18,
      proWinRate: 33,
      kda: 2.3,
      avgBanTurn: 8.5,
      avgPickRound: 2.26,
      blindPickRate: 7.7,
      averageGameTime: "32:49",
      csPerMinute: 8.2,
      damagePerMinute: 639,
      goldPerMinute: 375,
      csDiffAt15: -15.9,
      goldDiffAt15: -455,
      xpDiffAt15: -378,
      soloqKrChallengerWinRate: 56.4,
    },
  }),

  createChampion({
    id: "ashe",
    goodVs: [
      { championId: "xayah", score: 4 },
      { championId: "yunara", score: 4 },
      { championId: "corki", score: 3 },
      { championId: "lucian", score: 3 },
      { championId: "jinx", score: 3 },
    ],

    weakVs: [
      { championId: "aphelios", score: 4 },
      { championId: "kalista", score: 4 },
      { championId: "varus", score: 3 },
      { championId: "caitlyn", score: 3 },
      { championId: "ezreal", score: 3 },
    ],

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
      picks: 29,
      bans: 8,
      presence: 37,
      prioScore: 5,
      wins: 20,
      losses: 9,
      proWinRate: 69,
      kda: 4.8,
      avgBanTurn: 6.9,
      avgPickRound: 2.41,
      blindPickRate: 57.2,
      averageGameTime: "32:30",
      csPerMinute: 9.7,
      damagePerMinute: 709,
      goldPerMinute: 478,
      csDiffAt15: 2,
      goldDiffAt15: 90,
      xpDiffAt15: -236,
      soloqKrChallengerWinRate: 58.82,
    },
  }),


  createChampion({
    id: "corki",
    goodVs: [
      { championId: "jhin", score: 4 },
      { championId: "zeri", score: 3 },
      { championId: "tristana", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "yunara", score: 2 },
    ],

    weakVs: [
      { championId: "varus", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "caitlyn", score: 3 },
      { championId: "kalista", score: 3 },
    ],

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
      picks: 54,
      bans: 10,
      presence: 64,
      prioScore: 11,
      wins: 28,
      losses: 26,
      proWinRate: 52,
      kda: 3.7,
      avgBanTurn: 8.2,
      avgPickRound: 1.63,
      blindPickRate: 40.4,
      averageGameTime: "33:08",
      csPerMinute: 9.9,
      damagePerMinute: 759,
      goldPerMinute: 491,
      csDiffAt15: -1.2,
      goldDiffAt15: 14,
      xpDiffAt15: 18,
      soloqKrChallengerWinRate: 57.57,
    },
  }),


  createChampion({
    id: "aurora",
    goodVs: [
      { championId: "yone", score: 4 },
      { championId: "sylas", score: 4 },
      { championId: "viktor", score: 3 },
      { championId: "rumble", score: 3 },
      { championId: "gwen", score: 3 },
    ],

    weakVs: [
      { championId: "annie", score: 4 },
      { championId: "taliyah", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "gnar", score: 3 },
      { championId: "orianna", score: 3 },
    ],

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
      picks: 26,
      bans: 8,
      presence: 34,
      prioScore: 4,
      wins: 8,
      losses: 18,
      proWinRate: 31,
      kda: 2.7,
      avgBanTurn: 8.4,
      avgPickRound: 2.73,
      blindPickRate: 47.4,
      averageGameTime: "32:15",
      csPerMinute: 8.3,
      damagePerMinute: 742,
      goldPerMinute: 382,
      csDiffAt15: -7.9,
      goldDiffAt15: -124,
      xpDiffAt15: -152,
      soloqKrChallengerWinRate: 53.81,
    },
  }),


  createChampion({
    id: "gwen",
    goodVs: [
      { championId: "sion", score: 4 },
      { championId: "ornn", score: 4 },
      { championId: "camille", score: 3 },
      { championId: "aatrox", score: 3 },
      { championId: "ambessa", score: 3 },
    ],

    weakVs: [
      { championId: "zaahen", score: 4 },
      { championId: "jayce", score: 3 },
      { championId: "jax", score: 3 },
      { championId: "aurora", score: 3 },
    ],

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
      picks: 4,
      bans: 3,
      presence: 7,
      prioScore: 1,
      wins: 1,
      losses: 3,
      proWinRate: 25,
      kda: 0.9,
      avgBanTurn: 8.7,
      avgPickRound: 2.75,
      blindPickRate: 0,
      averageGameTime: "32:53",
      csPerMinute: 8.4,
      damagePerMinute: 633,
      goldPerMinute: 379,
      csDiffAt15: 0.3,
      goldDiffAt15: -390,
      xpDiffAt15: -880,
      soloqKrChallengerWinRate: 54.82,
    },
  }),


  createChampion({
    id: "renekton",
    goodVs: [
      { championId: "yorick", score: 4 },
      { championId: "jayce", score: 3 },
      { championId: "aatrox", score: 3 },
      { championId: "ksante", score: 3 },
      { championId: "ambessa", score: 3 },
    ],

    weakVs: [
      { championId: "vayne", score: 4 },
      { championId: "gnar", score: 3 },
      { championId: "camille", score: 3 },
      { championId: "ornn", score: 3 },
    ],

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
      picks: 53,
      bans: 51,
      presence: 104,
      prioScore: 17,
      wins: 28,
      losses: 25,
      proWinRate: 53,
      kda: 2.3,
      avgBanTurn: 8.1,
      avgPickRound: 2.28,
      blindPickRate: 65.6,
      averageGameTime: "33:03",
      csPerMinute: 8.7,
      damagePerMinute: 638,
      goldPerMinute: 390,
      csDiffAt15: 10,
      goldDiffAt15: 306,
      xpDiffAt15: 307,
      soloqKrChallengerWinRate: 59.18,
    },
  }),


  createChampion({
    id: "lulu",
    goodVs: [
      { championId: "karma", score: 4 },
      { championId: "soraka", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "neeko", score: 2 },
    ],

    weakVs: [
      { championId: "thresh", score: 4 },
      { championId: "milio", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "blitzcrank", score: 3 },
      { championId: "nami", score: 3 },
    ],

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
      picks: 36,
      bans: 36,
      presence: 72,
      prioScore: 11,
      wins: 18,
      losses: 18,
      proWinRate: 50,
      kda: 4.2,
      avgBanTurn: 8.3,
      avgPickRound: 2.53,
      blindPickRate: 44,
      averageGameTime: "30:21",
      csPerMinute: 1.1,
      damagePerMinute: 182,
      goldPerMinute: 267,
      csDiffAt15: 1.1,
      goldDiffAt15: -5,
      xpDiffAt15: 135,
      soloqKrChallengerWinRate: 51.7,
    },
  }),

  createChampion({
    id: "wukong",
    goodVs: [
      { championId: "lillia", score: 4 },
      { championId: "dr-mundo", score: 4 },
      { championId: "lee-sin", score: 3 },
      { championId: "nocturne", score: 3 },
      { championId: "viego", score: 3 },
    ],

    weakVs: [
      { championId: "maokai", score: 4 },
      { championId: "skarner", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "qiyana", score: 3 },
      { championId: "poppy", score: 3 },
    ],

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
      picks: 50,
      bans: 20,
      presence: 70,
      prioScore: 10,
      wins: 21,
      losses: 29,
      proWinRate: 42,
      kda: 2.8,
      avgBanTurn: 8.4,
      avgPickRound: 2.4,
      blindPickRate: 45.6,
      averageGameTime: "33:08",
      csPerMinute: 7,
      damagePerMinute: 413,
      goldPerMinute: 392,
      csDiffAt15: -0.7,
      goldDiffAt15: -113,
      xpDiffAt15: -138,
      soloqKrChallengerWinRate: 57.39,
    },
  }),


  createChampion({
    id: "gnar",
    goodVs: [
      { championId: "renekton", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "ksante", score: 3 },
      { championId: "rumble", score: 3 }
    ],

    weakVs: [
      { championId: "kennen", score: 3 },
      { championId: "vayne", score: 4 },
      { championId: "jax", score: 3 },
      { championId: "jayce", score: 3 },
    ],

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
      picks: 113,
      bans: 67,
      presence: 180,
      prioScore: 31,
      wins: 61,
      losses: 52,
      proWinRate: 54,
      kda: 3.1,
      avgBanTurn: 6.7,
      avgPickRound: 1.8,
      blindPickRate: 70.3,
      averageGameTime: "31:33",
      csPerMinute: 8.9,
      damagePerMinute: 554,
      goldPerMinute: 404,
      csDiffAt15: -0.1,
      goldDiffAt15: 46,
      xpDiffAt15: 45,
      soloqKrChallengerWinRate: 56.48,
    },
  }),

  createChampion({
    id: "aatrox",
    goodVs: [
      { championId: "sion", score: 4 },
      { championId: "dr-mundo", score: 4 },
      { championId: "poppy", score: 4 },
      { championId: "ambessa", score: 3 },
      { championId: "xin-zhao", score: 3 },
      { championId: "jayce", score: 2 }
    ],

    weakVs: [
      { championId: "renekton", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "rumble", score: 4 },
      { championId: "gnar", score: 3 },
      { championId: "gwen", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "pantheon", score: 3 },
    ],

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
      picks: 21,
      bans: 7,
      presence: 28,
      prioScore: 4,
      wins: 12,
      losses: 9,
      proWinRate: 57,
      kda: 3.7,
      avgBanTurn: 8.3,
      avgPickRound: 2.66,
      blindPickRate: 14.9,
      averageGameTime: "31:06",
      csPerMinute: 8.7,
      damagePerMinute: 662,
      goldPerMinute: 403,
      csDiffAt15: 2.4,
      goldDiffAt15: -215,
      xpDiffAt15: 198,
      soloqKrChallengerWinRate: 57.14,
    },
  }),


  createChampion({
    id: "akali",
    goodVs: [
      { championId: "ryze", score: 4 },
      { championId: "aurora", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "azir", score: 3 },
      { championId: "viktor", score: 3 },
    ],

    weakVs: [
      { championId: "lissandra", score: 4 },
      { championId: "jayce", score: 4 },
      { championId: "ahri", score: 3 },
      { championId: "twisted-fate", score: 3 },
      { championId: "annie", score: 3 },
    ],

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
      picks: 58,
      bans: 170,
      presence: 228,
      prioScore: 45,
      wins: 36,
      losses: 22,
      proWinRate: 62,
      kda: 4,
      avgBanTurn: 5.6,
      avgPickRound: 1.81,
      blindPickRate: 32.5,
      averageGameTime: "30:40",
      csPerMinute: 8.8,
      damagePerMinute: 599,
      goldPerMinute: 425,
      csDiffAt15: -0.3,
      goldDiffAt15: 98,
      xpDiffAt15: 352,
      soloqKrChallengerWinRate: 49.5,
    },
  }),



  createChampion({
    id: "nocturne",
    goodVs: [
      { championId: "dr-mundo", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "qiyana", score: 3 },
      { championId: "sejuani", score: 3 }
    ],

    weakVs: [
      { championId: "skarner", score: 4 },
      { championId: "lee-sin", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "vi", score: 3 }
    ],

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
      picks: 64,
      bans: 237,
      presence: 301,
      prioScore: 61,
      wins: 25,
      losses: 39,
      proWinRate: 39,
      kda: 2.5,
      avgBanTurn: 3.7,
      avgPickRound: 2,
      blindPickRate: 78.5,
      averageGameTime: "32:30",
      csPerMinute: 6.9,
      damagePerMinute: 435,
      goldPerMinute: 381,
      csDiffAt15: -0.3,
      goldDiffAt15: -143,
      xpDiffAt15: -170,
      soloqKrChallengerWinRate: 59.69,
    },
  }),

  createChampion({
    id: "nami",
    goodVs: [
      { championId: "lulu", score: 4 },
      { championId: "milio", score: 4 },
      { championId: "soraka", score: 3 },
      { championId: "tahm-kench", score: 3 },
      { championId: "braum", score: 3 },
    ],

    weakVs: [
      { championId: "nautilus", score: 4 },
      { championId: "neeko", score: 4 },
      { championId: "thresh", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "seraphine", score: 3 },
    ],

    synergyWith: [
      { championId: "varus", score: 3 },
      { championId: "ezreal", score: 3 }
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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 20,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "24:55",
      csPerMinute: 0.8,
      damagePerMinute: 351,
      goldPerMinute: 347,
      csDiffAt15: -2,
      goldDiffAt15: 891,
      xpDiffAt15: 876,
      soloqKrChallengerWinRate: 56.07,
    },
  }),

  createChampion({
    id: "alistar",
    goodVs: [
      { championId: "nami", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "braum", score: 3 },
    ],

    weakVs: [
      { championId: "janna", score: 4 },
      { championId: "seraphine", score: 2 },
      { championId: "bard", score: 3 },
      { championId: "renata-glasc", score: 3 },
      { championId: "rakan", score: 3 },
    ],

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
      picks: 68,
      bans: 30,
      presence: 98,
      prioScore: 16,
      wins: 36,
      losses: 32,
      proWinRate: 53,
      kda: 3.2,
      avgBanTurn: 8.5,
      avgPickRound: 1.86,
      blindPickRate: 27.6,
      averageGameTime: "32:15",
      csPerMinute: 1,
      damagePerMinute: 128,
      goldPerMinute: 257,
      csDiffAt15: -2.6,
      goldDiffAt15: -155,
      xpDiffAt15: -88,
      soloqKrChallengerWinRate: 56.97,
    },
  }),


  createChampion({
    id: "kaisa",
    goodVs: [
      { championId: "caitlyn", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "corki", score: 3 },
      { championId: "samira", score: 3 },
      { championId: "sivir", score: 3 },
    ],

    weakVs: [
      { championId: "jinx", score: 3 },
      { championId: "aphelios", score: 4 },
      { championId: "zeri", score: 3 },
      { championId: "kalista", score: 3 },
      { championId: "lucian", score: 3 },
    ],

    synergyWith: [
      { championId: "rell", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "wukong", score: 3 },
      { championId: "leona", score: 3 },
    ],

    mustWith: [
      { championId: "nautilus", score: 5 },
      { championId: "neeko", score: 5 },
      { championId: "alistar", score: 5 }
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
      picks: 38,
      bans: 37,
      presence: 75,
      prioScore: 14,
      wins: 19,
      losses: 19,
      proWinRate: 50,
      kda: 4.2,
      avgBanTurn: 7.6,
      avgPickRound: 1.74,
      blindPickRate: 17.3,
      averageGameTime: "31:57",
      csPerMinute: 10,
      damagePerMinute: 671,
      goldPerMinute: 512,
      csDiffAt15: -1.5,
      goldDiffAt15: 218,
      xpDiffAt15: -152,
      soloqKrChallengerWinRate: 52.99,
    },
  }),


  createChampion({
    id: "galio",
    goodVs: [
      { championId: "leblanc", score: 4 },
      { championId: "sylas", score: 3 },
      { championId: "aurora", score: 3 },
      { championId: "zoe", score: 3 },
      { championId: "viktor", score: 3 },
    ],

    weakVs: [
      { championId: "taliyah", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "yone", score: 3 },
      { championId: "annie", score: 3 },
      { championId: "orianna", score: 3 },
    ],

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
      picks: 57,
      bans: 34,
      presence: 91,
      prioScore: 15,
      wins: 24,
      losses: 33,
      proWinRate: 42,
      kda: 3.1,
      avgBanTurn: 6.8,
      avgPickRound: 1.95,
      blindPickRate: 12,
      averageGameTime: "31:37",
      csPerMinute: 8.3,
      damagePerMinute: 522,
      goldPerMinute: 371,
      csDiffAt15: -8,
      goldDiffAt15: -196,
      xpDiffAt15: -76,
      soloqKrChallengerWinRate: 55.99,
    },
  }),


  createChampion({
    id: "sivir",
    goodVs: [
      { championId: "aphelios", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "ezreal", score: 3 },
      { championId: "jhin", score: 3 },
      { championId: "ashe", score: 3 },
    ],

    weakVs: [
      { championId: "tristana", score: 4 },
      { championId: "yunara", score: 4 },
      { championId: "kaisa", score: 3 },
      { championId: "caitlyn", score: 3 },
      { championId: "lucian", score: 3 },
    ],

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
      picks: 48,
      bans: 44,
      presence: 92,
      prioScore: 16,
      wins: 26,
      losses: 22,
      proWinRate: 54,
      kda: 4.5,
      avgBanTurn: 8.3,
      avgPickRound: 1.93,
      blindPickRate: 19.8,
      averageGameTime: "32:56",
      csPerMinute: 10.6,
      damagePerMinute: 757,
      goldPerMinute: 515,
      csDiffAt15: -0.5,
      goldDiffAt15: 171,
      xpDiffAt15: -69,
      soloqKrChallengerWinRate: 54.26,
    },
  }),


  createChampion({
    id: "seraphine",
    goodVs: [
      { championId: "nami", score: 4 },
      { championId: "karma", score: 4 },
      { championId: "neeko", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "lulu", score: 3 },
    ],

    weakVs: [
      { championId: "leona", score: 3 },
      { championId: "thresh", score: 3 },
      { championId: "braum", score: 2 },
      { championId: "bard", score: 3 },
      { championId: "nautilus", score: 2 },
    ],

    synergyWith: [
      { championId: "ezreal", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "dr-mundo", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "ornn", score: 3 },
      { championId: "nocturne", score: 2 },
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
      picks: 48,
      bans: 25,
      presence: 73,
      prioScore: 11,
      wins: 30,
      losses: 18,
      proWinRate: 63,
      kda: 5.1,
      avgBanTurn: 6.9,
      avgPickRound: 2.33,
      blindPickRate: 51.8,
      averageGameTime: "31:49",
      csPerMinute: 2.6,
      damagePerMinute: 348,
      goldPerMinute: 311,
      csDiffAt15: 0.1,
      goldDiffAt15: 248,
      xpDiffAt15: 368,
      soloqKrChallengerWinRate: 55.53,
    },
  }),


  createChampion({
    id: "anivia",
    goodVs: [
      { championId: "galio", score: 4 },
      { championId: "cassiopeia", score: 4 },
      { championId: "vladimir", score: 3 },
      { championId: "seraphine", score: 3 },
      { championId: "ryze", score: 3 },
    ],

    weakVs: [
      { championId: "swain", score: 4 },
      { championId: "viktor", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "azir", score: 3 },
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
      picks: 50,
      bans: 40,
      presence: 90,
      prioScore: 16,
      wins: 22,
      losses: 28,
      proWinRate: 44,
      kda: 3.3,
      avgBanTurn: 6.4,
      avgPickRound: 1.84,
      blindPickRate: 37.8,
      averageGameTime: "33:47",
      csPerMinute: 8.5,
      damagePerMinute: 582,
      goldPerMinute: 389,
      csDiffAt15: 2.4,
      goldDiffAt15: 51,
      xpDiffAt15: 140,
      soloqKrChallengerWinRate: 62.77,
    },
  }),


  createChampion({
    id: "rakan",
    goodVs: [
      { championId: "karma", score: 3 },
      { championId: "alistar", score: 4 },
      { championId: "braum", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "leona", score: 3 },
    ],

    weakVs: [
      { championId: "neeko", score: 4 },
      { championId: "bard", score: 4 },
      { championId: "poppy", score: 3 },
      { championId: "seraphine", score: 3 },
      { championId: "renata-glasc", score: 3 },
    ],

    synergyWith: [
      { championId: "kaisa", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "jinx", score: 3 },
      { championId: "aphelios", score: 3 },
      { championId: "yasuo", score: 3 },
      { championId: "wukong", score: 3 },
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
      picks: 38,
      bans: 17,
      presence: 55,
      prioScore: 8,
      wins: 20,
      losses: 18,
      proWinRate: 53,
      kda: 4.9,
      avgBanTurn: 7.5,
      avgPickRound: 2.13,
      blindPickRate: 26.7,
      averageGameTime: "30:14",
      csPerMinute: 1.2,
      damagePerMinute: 163,
      goldPerMinute: 270,
      csDiffAt15: 2.5,
      goldDiffAt15: 126,
      xpDiffAt15: -193,
      soloqKrChallengerWinRate: 56.49,
    },
  }),


  createChampion({
    id: "syndra",
    goodVs: [
      { championId: "vladimir", score: 4 },
      { championId: "cassiopeia", score: 3 },
      { championId: "hwei", score: 3 },
      { championId: "viktor", score: 3 },
      { championId: "azir", score: 2 },
    ],

    weakVs: [
      { championId: "annie", score: 4 },
      { championId: "twisted-fate", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "ryze", score: 3 },
      { championId: "vex", score: 3 },
    ],

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
      picks: 119,
      bans: 107,
      presence: 226,
      prioScore: 43,
      wins: 52,
      losses: 67,
      proWinRate: 44,
      kda: 3,
      avgBanTurn: 5.5,
      avgPickRound: 1.68,
      blindPickRate: 44.6,
      averageGameTime: "32:43",
      csPerMinute: 9.1,
      damagePerMinute: 691,
      goldPerMinute: 413,
      csDiffAt15: 6.2,
      goldDiffAt15: 57,
      xpDiffAt15: 119,
      soloqKrChallengerWinRate: 54.74,
    },
  }),


  createChampion({
    id: "leona",
    goodVs: [
      { championId: "karma", score: 3 },
      { championId: "nami", score: 2 },
      { championId: "blitzcrank", score: 3 },
      { championId: "lulu", score: 2 },
    ],

    weakVs: [
      { championId: "bard", score: 5 },
      { championId: "poppy", score: 4 },
      { championId: "milio", score: 3 },
      { championId: "neeko", score: 3 },
      { championId: "rakan", score: 3 },
    ],

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
      picks: 65,
      bans: 19,
      presence: 84,
      prioScore: 14,
      wins: 40,
      losses: 25,
      proWinRate: 62,
      kda: 2.8,
      avgBanTurn: 8.3,
      avgPickRound: 1.74,
      blindPickRate: 34,
      averageGameTime: "32:28",
      csPerMinute: 1.2,
      damagePerMinute: 176,
      goldPerMinute: 263,
      csDiffAt15: 2.8,
      goldDiffAt15: -159,
      xpDiffAt15: 75,
      soloqKrChallengerWinRate: 57.33,
    },
  }),


  createChampion({
    id: "mel",
    goodVs: [
      { championId: "yone", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "aurora", score: 3 },
      { championId: "annie", score: 2 },
    ],

    weakVs: [
      { championId: "ryze", score: 4 },
      { championId: "akali", score: 4 },
      { championId: "hwei", score: 3 },
      { championId: "azir", score: 3 },
      { championId: "syndra", score: 3 },
    ],

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
      picks: 23,
      bans: 15,
      presence: 38,
      prioScore: 6,
      wins: 11,
      losses: 12,
      proWinRate: 48,
      kda: 3.4,
      avgBanTurn: 8,
      avgPickRound: 2.7,
      blindPickRate: 35.4,
      averageGameTime: "33:46",
      csPerMinute: 9.5,
      damagePerMinute: 685,
      goldPerMinute: 454,
      csDiffAt15: 6,
      goldDiffAt15: 270,
      xpDiffAt15: 634,
      soloqKrChallengerWinRate: 50.98,
    },
  }),


  createChampion({
    id: "ornn",
    goodVs: [
      { championId: "aatrox", score: 3 },
      { championId: "gnar", score: 2 },
      { championId: "kennen", score: 3 },
      { championId: "ksante", score: 3 },
      { championId: "volibear", score: 2 },
    ],

    weakVs: [
      { championId: "jax", score: 4 },
      { championId: "poppy", score: 4 },
      { championId: "jayce", score: 3 },
      { championId: "mel", score: 3 },
      { championId: "gwen", score: 3 },
    ],

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
      picks: 14,
      bans: 1,
      presence: 15,
      prioScore: 2,
      wins: 8,
      losses: 6,
      proWinRate: 57,
      kda: 2.7,
      avgBanTurn: 7,
      avgPickRound: 1.93,
      blindPickRate: 0,
      averageGameTime: "34:03",
      csPerMinute: 7,
      damagePerMinute: 367,
      goldPerMinute: 329,
      csDiffAt15: -16.5,
      goldDiffAt15: -714,
      xpDiffAt15: -514,
      soloqKrChallengerWinRate: 59.4,
    },
  }),


  createChampion({
    id: "braum",
    goodVs: [
      { championId: "poppy", score: 4 },
      { championId: "milio", score: 3 },
      { championId: "soraka", score: 3 },
      { championId: "yuumi", score: 3 },
      { championId: "seraphine", score: 2 },
    ],

    weakVs: [
      { championId: "rakan", score: 4 },
      { championId: "bard", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "nami", score: 3 },
    ],

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
      picks: 4,
      bans: 3,
      presence: 7,
      prioScore: 1,
      wins: 2,
      losses: 2,
      proWinRate: 50,
      kda: 3.8,
      avgBanTurn: 9,
      avgPickRound: 2.25,
      blindPickRate: 0,
      averageGameTime: "33:35",
      csPerMinute: 0.9,
      damagePerMinute: 150,
      goldPerMinute: 262,
      csDiffAt15: -10,
      goldDiffAt15: 163,
      xpDiffAt15: 226,
      soloqKrChallengerWinRate: 54.78,
    },
  }),


  createChampion({
    id: "jhin",
    goodVs: [
      { championId: "smolder", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "ziggs", score: 4 },
      { championId: "kogmaw", score: 3 }
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
      picks: 93,
      bans: 22,
      presence: 115,
      prioScore: 19,
      wins: 37,
      losses: 56,
      proWinRate: 40,
      kda: 4.3,
      avgBanTurn: 8.2,
      avgPickRound: 1.66,
      blindPickRate: 46.5,
      averageGameTime: "33:20",
      csPerMinute: 9.7,
      damagePerMinute: 639,
      goldPerMinute: 465,
      csDiffAt15: -3.7,
      goldDiffAt15: -319,
      xpDiffAt15: -57,
      soloqKrChallengerWinRate: 53.43,
    },
  }),


  createChampion({
    id: "aphelios",
    goodVs: [
      { championId: "kaisa", score: 4 },
      { championId: "ezreal", score: 4 },
      { championId: "miss-fortune", score: 3 },
      { championId: "kalista", score: 3 },
      { championId: "tristana", score: 3 },
    ],

    weakVs: [
      { championId: "sivir", score: 4 },
      { championId: "lucian", score: 4 },
      { championId: "caitlyn", score: 3 },
      { championId: "zeri", score: 3 },
      { championId: "yunara", score: 3 },
    ],

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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 0,
      wins: 0,
      losses: 2,
      proWinRate: 0,
      kda: 1.6,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "37:17",
      csPerMinute: 9.4,
      damagePerMinute: 831,
      goldPerMinute: 470,
      csDiffAt15: -11,
      goldDiffAt15: 602,
      xpDiffAt15: -1144,
      soloqKrChallengerWinRate: 53.17,
    },
  }),


  createChampion({
    id: "xayah",
    goodVs: [
      { championId: "jhin", score: 4 },
      { championId: "corki", score: 3 },
      { championId: "varus", score: 3 },
      { championId: "lucian", score: 2 },
      { championId: "ezreal", score: 2 },
    ],

    weakVs: [
      { championId: "kalista", score: 4 },
      { championId: "miss-fortune", score: 4 },
      { championId: "sivir", score: 3 },
      { championId: "ashe", score: 3 },
    ],

    synergyWith: [
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "rell", score: 3 },
      { championId: "alistar", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "wukong", score: 3 },
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
      picks: 26,
      bans: 15,
      presence: 41,
      prioScore: 7,
      wins: 14,
      losses: 12,
      proWinRate: 54,
      kda: 4,
      avgBanTurn: 8.6,
      avgPickRound: 2.38,
      blindPickRate: 29.1,
      averageGameTime: "29:25",
      csPerMinute: 10,
      damagePerMinute: 745,
      goldPerMinute: 494,
      csDiffAt15: 0.7,
      goldDiffAt15: 314,
      xpDiffAt15: 240,
      soloqKrChallengerWinRate: 58.35,
    },
  }),


  createChampion({
    id: "jax",
    goodVs: [
      // champs pe care Jax îi bate natural prin E + scaling
      { championId: "ornn", score: 4 },        // free scale + outduel sid
      { championId: "gwen", score: 3 },        // wins extended fights
      { championId: "gnar", score: 3 },        // E counters mini gnar autos
      { championId: "aatrox", score: 3 },      // dodge + outscale
      { championId: "renekton", score: 2 },
    ],

    weakVs: [
      // real counters (nu doar winrate)
      { championId: "ambessa", score: 4 },       // blocks Q = game over
      { championId: "kennen", score: 3 },      // ranged + stun deny engage
      { championId: "gragas", score: 3 },      // disengage + poke
      { championId: "rumble", score: 3 },      // burns through him early
      { championId: "gangplank", score: 2 },   // spacing + poke + scale
    ],

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
      picks: 25,
      bans: 17,
      presence: 42,
      prioScore: 7,
      wins: 13,
      losses: 12,
      proWinRate: 52,
      kda: 2.2,
      avgBanTurn: 7.8,
      avgPickRound: 2.24,
      blindPickRate: 20.8,
      averageGameTime: "31:43",
      csPerMinute: 8.1,
      damagePerMinute: 518,
      goldPerMinute: 388,
      csDiffAt15: -0.5,
      goldDiffAt15: -85,
      xpDiffAt15: -290,
      soloqKrChallengerWinRate: 56.29,
    },
  }),


  createChampion({
    id: "jayce",
    goodVs: [
      { championId: "ornn", score: 4 },
      { championId: "gnar", score: 4 },
      { championId: "gwen", score: 3 },
      { championId: "kennen", score: 3 },
      { championId: "ambessa", score: 3 },
    ],

    weakVs: [
      { championId: "renekton", score: 4 },
      { championId: "gragas", score: 3 },
      { championId: "yorick", score: 3 },
      { championId: "aatrox", score: 3 },
      { championId: "rumble", score: 3 },
    ],

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
      picks: 93,
      bans: 214,
      presence: 307,
      prioScore: 61,
      wins: 39,
      losses: 54,
      proWinRate: 42,
      kda: 2.5,
      avgBanTurn: 4,
      avgPickRound: 1.7,
      blindPickRate: 97.5,
      averageGameTime: "33:37",
      csPerMinute: 9,
      damagePerMinute: 750,
      goldPerMinute: 419,
      csDiffAt15: 5.9,
      goldDiffAt15: 499,
      xpDiffAt15: 0,
      soloqKrChallengerWinRate: 56.92,
    },
  }),


  createChampion({
    id: "rell",
    goodVs: [
      { championId: "tahm-kench", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "janna", score: 3 },
      { championId: "leona", score: 3 },
      { championId: "seraphine", score: 3 },
    ],

    weakVs: [
      { championId: "poppy", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "milio", score: 3 },
      { championId: "bard", score: 3 },
      { championId: "neeko", score: 3 },
    ],

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
      picks: 73,
      bans: 7,
      presence: 80,
      prioScore: 13,
      wins: 31,
      losses: 42,
      proWinRate: 42,
      kda: 2.9,
      avgBanTurn: 8.8,
      avgPickRound: 1.78,
      blindPickRate: 26.4,
      averageGameTime: "32:17",
      csPerMinute: 1.1,
      damagePerMinute: 157,
      goldPerMinute: 259,
      csDiffAt15: -0.3,
      goldDiffAt15: -81,
      xpDiffAt15: -28,
      soloqKrChallengerWinRate: 59.93,
    },
  }),


  createChampion({
    id: "poppy",
    goodVs: [
      { championId: "leona", score: 4 },
      { championId: "pantheon", score: 3 },
      { championId: "xin-zhao", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "camille", score: 3 },
    ],

    weakVs: [
      { championId: "gwen", score: 4 },
      { championId: "trundle", score: 4 },
      { championId: "kennen", score: 3 },
      { championId: "aatrox", score: 3 },
      { championId: "jayce", score: 3 },
      { championId: "shen", score: 3 },
    ],

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
      picks: 29,
      bans: 332,
      presence: 361,
      prioScore: 76,
      wins: 16,
      losses: 13,
      proWinRate: 55,
      kda: 3.2,
      avgBanTurn: 2.8,
      avgPickRound: 2.14,
      blindPickRate: 23,
      averageGameTime: "35:31",
      csPerMinute: 4.6,
      damagePerMinute: 322,
      goldPerMinute: 327,
      csDiffAt15: 0.4,
      goldDiffAt15: -109,
      xpDiffAt15: 24,
      soloqKrChallengerWinRate: 59.93,
    },
  }),


  createChampion({
    id: "viktor",
    goodVs: [
      { championId: "mel", score: 4 },
      { championId: "cassiopeia", score: 4 },
      { championId: "vex", score: 3 },
      { championId: "xerath", score: 3 },
      { championId: "kassadin", score: 3 },
    ],

    weakVs: [
      { championId: "akali", score: 4 },
      { championId: "annie", score: 4 },
      { championId: "azir", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "leblanc", score: 3 },
    ],

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
      picks: 99,
      bans: 26,
      presence: 125,
      prioScore: 20,
      wins: 50,
      losses: 49,
      proWinRate: 51,
      kda: 3.8,
      avgBanTurn: 6.5,
      avgPickRound: 1.78,
      blindPickRate: 59.5,
      averageGameTime: "33:26",
      csPerMinute: 9.3,
      damagePerMinute: 858,
      goldPerMinute: 424,
      csDiffAt15: 4.6,
      goldDiffAt15: -94,
      xpDiffAt15: 264,
      soloqKrChallengerWinRate: 55.57,
    },
  }),


  createChampion({
    id: "malphite",

    goodVs: [
      { championId: "tryndamere", score: 4 },
      { championId: "jayce", score: 3 },
      { championId: "gangplank", score: 3 },
      { championId: "xin-zhao", score: 2 },
      { championId: "gnar", score: 1 }
    ],

    weakVs: [
      { championId: "gwen", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "gragas", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "ornn", score: 4 },
    ],

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
      picks: 6,
      bans: 1,
      presence: 7,
      prioScore: 1,
      wins: 4,
      losses: 2,
      proWinRate: 67,
      kda: 5.7,
      avgBanTurn: 10,
      avgPickRound: 2.83,
      blindPickRate: 0,
      averageGameTime: "29:59",
      csPerMinute: 7.7,
      damagePerMinute: 537,
      goldPerMinute: 398,
      csDiffAt15: -1.2,
      goldDiffAt15: 469,
      xpDiffAt15: 774,
      soloqKrChallengerWinRate: 56.47,
    },
  }),


  createChampion({
    id: "annie",
    goodVs: [
      { championId: "hwei", score: 4 },
      { championId: "aurora", score: 4 },
      { championId: "viktor", score: 3 },
      { championId: "leblanc", score: 3 },
      { championId: "galio", score: 3 },
    ],

    weakVs: [
      { championId: "cassiopeia", score: 4 },
      { championId: "lissandra", score: 4 },
      { championId: "jayce", score: 3 },
      { championId: "ryze", score: 3 },
      { championId: "ahri", score: 3 },
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
      picks: 40,
      bans: 34,
      presence: 74,
      prioScore: 11,
      wins: 21,
      losses: 19,
      proWinRate: 53,
      kda: 3.2,
      avgBanTurn: 7.7,
      avgPickRound: 2.65,
      blindPickRate: 51.4,
      averageGameTime: "33:01",
      csPerMinute: 8,
      damagePerMinute: 661,
      goldPerMinute: 368,
      csDiffAt15: -4.7,
      goldDiffAt15: -164,
      xpDiffAt15: -67,
      soloqKrChallengerWinRate: 63.99,
    },
  }),


  createChampion({
    id: "naafiri",
    goodVs: [
      { championId: "skarner", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "viego", score: 3 },
      { championId: "lillia", score: 3 },
      { championId: "xin-zhao", score: 3 },
    ],

    weakVs: [
      { championId: "poppy", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "vi", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "nocturne", score: 3 },
    ],

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
      picks: 111,
      bans: 67,
      presence: 178,
      prioScore: 32,
      wins: 56,
      losses: 55,
      proWinRate: 50,
      kda: 4.1,
      avgBanTurn: 4.8,
      avgPickRound: 1.69,
      blindPickRate: 44.9,
      averageGameTime: "32:35",
      csPerMinute: 7.5,
      damagePerMinute: 560,
      goldPerMinute: 418,
      csDiffAt15: 1,
      goldDiffAt15: 179,
      xpDiffAt15: 26,
      soloqKrChallengerWinRate: 53.9,
    },
  }),


  createChampion({
    id: "leblanc",
    goodVs: [
      { championId: "viktor", score: 4 },
      { championId: "ziggs", score: 4 },
      { championId: "cassiopeia", score: 3 },
      { championId: "azir", score: 2 },
      { championId: "taliyah", score: 3 },
    ],

    weakVs: [
      { championId: "lissandra", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "vex", score: 3 },
      { championId: "kassadin", score: 3 },
      { championId: "malzahar", score: 3 },
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
      picks: 8,
      bans: 11,
      presence: 19,
      prioScore: 3,
      wins: 3,
      losses: 5,
      proWinRate: 38,
      kda: 1.7,
      avgBanTurn: 8.4,
      avgPickRound: 1.75,
      blindPickRate: 0,
      averageGameTime: "29:48",
      csPerMinute: 8.4,
      damagePerMinute: 770,
      goldPerMinute: 407,
      csDiffAt15: -6.3,
      goldDiffAt15: -43,
      xpDiffAt15: -381,
      soloqKrChallengerWinRate: 53.23,
    },
  }),


  createChampion({
    id: "qiyana",
    goodVs: [
      { championId: "lee-sin", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "wukong", score: 3 },
      { championId: "xin-zhao", score: 3 },
    ],

    weakVs: [
      { championId: "vi", score: 4 },
      { championId: "trundle", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "pantheon", score: 2 },
    ],

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
      picks: 35,
      bans: 21,
      presence: 56,
      prioScore: 9,
      wins: 14,
      losses: 21,
      proWinRate: 40,
      kda: 2.6,
      avgBanTurn: 7.6,
      avgPickRound: 2.17,
      blindPickRate: 24.4,
      averageGameTime: "32:28",
      csPerMinute: 7.9,
      damagePerMinute: 538,
      goldPerMinute: 459,
      csDiffAt15: 4,
      goldDiffAt15: 420,
      xpDiffAt15: 293,
      soloqKrChallengerWinRate: 58.1,
    },
  }),


  createChampion({
    id: "sylas",
    goodVs: [
      { championId: "veigar", score: 5 },
      { championId: "leblanc", score: 3 },
      { championId: "lissandra", score: 4 },
      { championId: "ahri", score: 2 },
      { championId: "xin-zhao", score: 3 },
      { championId: "sejuani", score: 2 },
    ],

    weakVs: [
      { championId: "neeko", score: 5 },
      { championId: "skarner", score: 4 },
      { championId: "trundle", score: 4 },
      { championId: "hwei", score: 3 },
      { championId: "aurora", score: 3 },
      { championId: "kassadin", score: 3 },
      { championId: "lee-sin", score: 2 },
    ],

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
      picks: 48,
      bans: 25,
      presence: 73,
      prioScore: 12,
      wins: 23,
      losses: 25,
      proWinRate: 48,
      kda: 3.3,
      avgBanTurn: 8.4,
      avgPickRound: 2.17,
      blindPickRate: 25.9,
      averageGameTime: "31:41",
      csPerMinute: 8.4,
      damagePerMinute: 610,
      goldPerMinute: 405,
      csDiffAt15: -10.9,
      goldDiffAt15: -66,
      xpDiffAt15: -109,
      soloqKrChallengerWinRate: 54.38,
    },
  }),


  createChampion({
    id: "cassiopeia",
    goodVs: [
      { championId: "yone", score: 3 },
      { championId: "aurora", score: 3 },
      { championId: "ahri", score: 3 },
      { championId: "ryze", score: 3 },
      { championId: "kassadin", score: 5 }
    ],

    weakVs: [
      { championId: "anivia", score: 5 },
      { championId: "malzahar", score: 4 },
      { championId: "aurelion-sol", score: 4 },
      { championId: "galio", score: 2 },
      { championId: "yasuo", score: 2 },
    ],

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
      picks: 116,
      bans: 185,
      presence: 301,
      prioScore: 60,
      wins: 73,
      losses: 43,
      proWinRate: 63,
      kda: 4.7,
      avgBanTurn: 4,
      avgPickRound: 1.49,
      blindPickRate: 83.3,
      averageGameTime: "33:08",
      csPerMinute: 8.9,
      damagePerMinute: 630,
      goldPerMinute: 417,
      csDiffAt15: 1.3,
      goldDiffAt15: 108,
      xpDiffAt15: -16,
      soloqKrChallengerWinRate: 57.03,
    },
  }),


  createChampion({
    id: "trundle",

    goodVs: [
      { championId: "poppy", score: 4 },
      { championId: "sylas", score: 4 },
      { championId: "ivern", score: 4 },
      { championId: "naafiri", score: 3 },
      { championId: "qiyana", score: 3 },
    ],

    weakVs: [
      { championId: "kindred", score: 5 },
      { championId: "khazix", score: 4 },
      { championId: "vi", score: 4 },
      { championId: "lillia", score: 3 },
      { championId: "nidalee", score: 3 },
    ],

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
      picks: 45,
      bans: 39,
      presence: 84,
      prioScore: 13,
      wins: 25,
      losses: 20,
      proWinRate: 56,
      kda: 4,
      avgBanTurn: 8,
      avgPickRound: 2.35,
      blindPickRate: 30.7,
      averageGameTime: "31:00",
      csPerMinute: 6.8,
      damagePerMinute: 353,
      goldPerMinute: 395,
      csDiffAt15: -1.1,
      goldDiffAt15: -50,
      xpDiffAt15: -181,
      soloqKrChallengerWinRate: null,
    },
  }),


  createChampion({
    id: "lee-sin",
    goodVs: [
      { championId: "xin-zhao", score: 3 },
      { championId: "nocturne", score: 4 },
      { championId: "skarner", score: 3 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "trundle", score: 3 },
    ],

    weakVs: [
      { championId: "poppy", score: 5 },
      { championId: "qiyana", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "wukong", score: 3 },
      { championId: "vi", score: 3 },
    ],

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
      picks: 119,
      bans: 112,
      presence: 231,
      prioScore: 44,
      wins: 61,
      losses: 58,
      proWinRate: 51,
      kda: 3.8,
      avgBanTurn: 4.2,
      avgPickRound: 1.55,
      blindPickRate: 69.6,
      averageGameTime: "32:22",
      csPerMinute: 7.1,
      damagePerMinute: 425,
      goldPerMinute: 397,
      csDiffAt15: 0.8,
      goldDiffAt15: 200,
      xpDiffAt15: 152,
      soloqKrChallengerWinRate: 57.05,
    },
  }),


  createChampion({
    id: "kennen",
    goodVs: [
      { championId: "sion", score: 5 },
      { championId: "malphite", score: 5 },
      { championId: "poppy", score: 4 },
      { championId: "ksante", score: 4 },
      { championId: "gnar", score: 2 },
    ],

    weakVs: [
      { championId: "galio", score: 5 },
      { championId: "camille", score: 4 },
      { championId: "rumble", score: 3 },
      { championId: "ornn", score: 3 },
      { championId: "gwen", score: 3 },
    ],

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
      picks: 0,
      bans: 2,
      presence: 2,
      prioScore: 0,
      wins: 0,
      losses: 0,
      proWinRate: null,
      kda: null,
      avgBanTurn: 9.5,
      avgPickRound: null,
      blindPickRate: null,
      averageGameTime: null,
      csPerMinute: null,
      damagePerMinute: null,
      goldPerMinute: null,
      csDiffAt15: null,
      goldDiffAt15: null,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 55.84,
    },
  }),


  createChampion({
    id: "yone",
    goodVs: [
      { championId: "leblanc", score: 5 },
      { championId: "sylas", score: 4 },
      { championId: "galio", score: 4 },
      { championId: "azir", score: 4 },
      { championId: "taliyah", score: 3 },
    ],

    weakVs: [
      { championId: "annie", score: 5 },
      { championId: "ryze", score: 4 },
      { championId: "aurora", score: 4 },
      { championId: "twisted-fate", score: 3 },
      { championId: "swain", score: 3 },
    ],

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
      picks: 19,
      bans: 19,
      presence: 38,
      prioScore: 7,
      wins: 6,
      losses: 13,
      proWinRate: 32,
      kda: 3.1,
      avgBanTurn: 7.4,
      avgPickRound: 1.95,
      blindPickRate: 10.5,
      averageGameTime: "31:58",
      csPerMinute: 9.6,
      damagePerMinute: 564,
      goldPerMinute: 411,
      csDiffAt15: -3.8,
      goldDiffAt15: 13,
      xpDiffAt15: 32,
      soloqKrChallengerWinRate: 54.63,
    },
  }),


  createChampion({
    id: "zoe",
    goodVs: [
      { championId: "azir", score: 3 },
      { championId: "kassadin", score: 5 },
      { championId: "orianna", score: 4 },
      { championId: "viktor", score: 4 },
      { championId: "ryze", score: 4 },
    ],

    weakVs: [
      { championId: "galio", score: 4 },
      { championId: "ahri", score: 4 },
      { championId: "akali", score: 4 },
      { championId: "leblanc", score: 4 },
      { championId: "lissandra", score: 2 },
    ],

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
      picks: 3,
      bans: 1,
      presence: 4,
      prioScore: 1,
      wins: 3,
      losses: 0,
      proWinRate: 100,
      kda: 6.6,
      avgBanTurn: 9,
      avgPickRound: 3,
      blindPickRate: 33.3,
      averageGameTime: "33:02",
      csPerMinute: 8.2,
      damagePerMinute: 699,
      goldPerMinute: 410,
      csDiffAt15: 1,
      goldDiffAt15: -440,
      xpDiffAt15: -113,
      soloqKrChallengerWinRate: 56.32,
    },
  }),


  createChampion({
    id: "lux",
    goodVs: [
      { championId: "lulu", score: 3 },
      { championId: "nami", score: 4 },
      { championId: "pyke", score: 4 },
      { championId: "yuumi", score: 3 },
    ],

    weakVs: [
      { championId: "blitzcrank", score: 5 },
      { championId: "nautilus", score: 5 },
      { championId: "leona", score: 4 },
      { championId: "alistar", score: 4 },
      { championId: "braum", score: 3 },
    ],

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
      picks: 9,
      bans: 0,
      presence: 9,
      prioScore: 1,
      wins: 4,
      losses: 5,
      proWinRate: 44,
      kda: 4.8,
      avgBanTurn: null,
      avgPickRound: 2.56,
      blindPickRate: 13,
      averageGameTime: "35:59",
      csPerMinute: 1.3,
      damagePerMinute: 305,
      goldPerMinute: 272,
      csDiffAt15: -2.9,
      goldDiffAt15: 197,
      xpDiffAt15: 187,
      soloqKrChallengerWinRate: 55.59,
    },
  }),


  createChampion({
    id: "yasuo",

    goodVs: [
      { championId: "gnar", score: 3 },
      { championId: "twisted-fate", score: 5 },
      { championId: "viktor", score: 4 },
      { championId: "hwei", score: 4 },
    ],

    weakVs: [
      { championId: "lissandra", score: 5 },
      { championId: "malphite", score: 5 },
      { championId: "renekton", score: 4 },
      { championId: "pantheon", score: 4 },
      { championId: "vex", score: 3 },
    ],

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
      picks: 6,
      bans: 2,
      presence: 8,
      prioScore: 1,
      wins: 2,
      losses: 4,
      proWinRate: 33,
      kda: 2.4,
      avgBanTurn: 9,
      avgPickRound: 2.17,
      blindPickRate: 0,
      averageGameTime: "29:48",
      csPerMinute: 8.1,
      damagePerMinute: 566,
      goldPerMinute: 373,
      csDiffAt15: -3.7,
      goldDiffAt15: -9,
      xpDiffAt15: -195,
      soloqKrChallengerWinRate: 55.14,
    },
  }),


  createChampion({
    id: "rengar",
    goodVs: [
      { championId: "khazix", score: 5 },
      { championId: "graves", score: 4 },
    ],

    weakVs: [
      { championId: "sejuani", score: 5 },
      { championId: "ivern", score: 4 },
      { championId: "rammus", score: 4 },
      { championId: "skarner", score: 3 },
      { championId: "zac", score: 3 },
    ],

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
    goodVs: [
      { championId: "veigar", score: 5 },
      { championId: "ahri", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "ryze", score: 3 },
      { championId: "viktor", score: 4 },
    ],

    weakVs: [
      { championId: "taliyah", score: 5 },
      { championId: "yone", score: 5 },
      { championId: "annie", score: 4 },
      { championId: "syndra", score: 4 },
      { championId: "azir", score: 3 },
    ],

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
    goodVs: [
      { championId: "maokai", score: 5 },
      { championId: "ornn", score: 5 },
      { championId: "ksante", score: 4 },
      { championId: "sion", score: 4 },
      { championId: "gnar", score: 2 },
    ],

    weakVs: [
      { championId: "kennen", score: 5 },
      { championId: "rumble", score: 5 },
      { championId: "udyr", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "fiora", score: 3 },
    ],

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
      picks: 73,
      bans: 86,
      presence: 159,
      prioScore: 30,
      wins: 43,
      losses: 30,
      proWinRate: 59,
      kda: 2.9,
      avgBanTurn: 7,
      avgPickRound: 1.74,
      blindPickRate: 59.8,
      averageGameTime: "32:53",
      csPerMinute: 8.5,
      damagePerMinute: 589,
      goldPerMinute: 412,
      csDiffAt15: 1,
      goldDiffAt15: 20,
      xpDiffAt15: 101,
      soloqKrChallengerWinRate: 61.9,
    },
  }),


  createChampion({
    id: "maokai",
    goodVs: [
      { championId: "khazix", score: 5 },
      { championId: "alistar", score: 5 },
      { championId: "nautilus", score: 5 },
      { championId: "lillia", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "poppy", score: 4 },
    ],

    weakVs: [
      { championId: "dr-mundo", score: 5 },
      { championId: "aatrox", score: 5 },
      { championId: "naafiri", score: 4 },
      { championId: "trundle", score: 4 },
      { championId: "kindred", score: 3 },
      { championId: "braum", score: 4 },
      { championId: "nami", score: 3 },
    ],

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
      bans: 0,
      presence: 4,
      prioScore: 0,
      wins: 2,
      losses: 2,
      proWinRate: 50,
      kda: 3.3,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "33:25",
      csPerMinute: 6,
      damagePerMinute: 697,
      goldPerMinute: 372,
      csDiffAt15: -3.5,
      goldDiffAt15: -340,
      xpDiffAt15: 205,
      soloqKrChallengerWinRate: 56.69,
    },
  }),


  createChampion({
    id: "nidalee",
    goodVs: [
      { championId: "nocturne", score: 5 },
      { championId: "wukong", score: 3 },
      { championId: "viego", score: 4 },
      { championId: "graves", score: 4 },
      { championId: "jarvan-iv", score: 2 },
    ],

    weakVs: [
      { championId: "vi", score: 5 },
      { championId: "zac", score: 5 },
      { championId: "skarner", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "volibear", score: 4 },
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
      picks: 4,
      bans: 0,
      presence: 4,
      prioScore: 0,
      wins: 3,
      losses: 1,
      proWinRate: 75,
      kda: 6.4,
      avgBanTurn: null,
      avgPickRound: 2.75,
      blindPickRate: 25,
      averageGameTime: "29:39",
      csPerMinute: 9,
      damagePerMinute: 722,
      goldPerMinute: 451,
      csDiffAt15: 18,
      goldDiffAt15: 341,
      xpDiffAt15: 730,
      soloqKrChallengerWinRate: 58.11,
    },
  }),

  createChampion({
    id: "lucian",

    goodVs: [
      { championId: "ezreal", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "sivir", score: 4 },
      { championId: "vayne", score: 3 },
    ],

    weakVs: [
      { championId: "kalista", score: 4 },
      { championId: "draven", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "yunara", score: 3 },
      { championId: "senna", score: 3 },
    ],

    synergyWith: [
      { championId: "yuumi", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "karma", score: 3 },
      { championId: "leona", score: 2 },
      { championId: "nautilus", score: 2 },
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
      picks: 83,
      bans: 134,
      presence: 217,
      prioScore: 40,
      wins: 38,
      losses: 45,
      proWinRate: 46,
      kda: 2.9,
      avgBanTurn: 6.1,
      avgPickRound: 2.01,
      blindPickRate: 69.7,
      averageGameTime: "31:44",
      csPerMinute: 10,
      damagePerMinute: 801,
      goldPerMinute: 478,
      csDiffAt15: 6.8,
      goldDiffAt15: 165,
      xpDiffAt15: -29,
      soloqKrChallengerWinRate: 57.47,
    },
  }),


  createChampion({
    id: "irelia",

    goodVs: [
      { championId: "kennen", score: 5 },
      { championId: "jayce", score: 4 },
      { championId: "gnar", score: 4 },
      { championId: "shen", score: 4 },
      { championId: "poppy", score: 3 },
    ],

    weakVs: [
      { championId: "ornn", score: 5 },
      { championId: "sion", score: 5 },
      { championId: "renekton", score: 4 },
      { championId: "trundle", score: 3 },
      { championId: "camille", score: 3 },
    ],

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
      picks: 0,
      bans: 1,
      presence: 1,
      prioScore: 0,
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
      soloqKrChallengerWinRate: 53.01,
    },
  }),


  createChampion({
    id: "jinx",
    goodVs: [
      { championId: "kogmaw", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "ziggs", score: 4 },
      { championId: "vayne", score: 3 },
      { championId: "ezreal", score: 3 },
    ],

    weakVs: [
      { championId: "miss-fortune", score: 5 },
      { championId: "samira", score: 5 },
      { championId: "kalista", score: 4 },
      { championId: "zeri", score: 4 },
      { championId: "caitlyn", score: 3 },
    ],

    synergyWith: [
      { championId: "thresh", score: 5 },
      { championId: "nautilus", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "renata-glasc", score: 4 }
    ],

    mustWith: [
      { championId: "lulu", score: 5 },
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
      soloqKrChallengerWinRate: 56.21,
    },
  }),

  createChampion({
    id: "sejuani",
    goodVs: [
      { championId: "belveth", score: 5 },
      { championId: "aatrox", score: 5 },
      { championId: "viego", score: 4 },
      { championId: "naafiri", score: 4 },
      { championId: "wukong", score: 3 },
    ],

    weakVs: [
      { championId: "dr-mundo", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "trundle", score: 4 },
      { championId: "jarvan-iv", score: 3 },
      { championId: "khazix", score: 3 },
    ],

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
      prioScore: 0,
      wins: 5,
      losses: 0,
      proWinRate: 100,
      kda: 13.8,
      avgBanTurn: null,
      avgPickRound: 3.2,
      blindPickRate: 25,
      averageGameTime: "30:49",
      csPerMinute: 6.4,
      damagePerMinute: 407,
      goldPerMinute: 382,
      csDiffAt15: -10.4,
      goldDiffAt15: -52,
      xpDiffAt15: -132,
      soloqKrChallengerWinRate: 50,
    },
  }),


  createChampion({
    id: "pyke",
    goodVs: [
      { championId: "karma", score: 4 },
      { championId: "braum", score: 2 },
      { championId: "morgana", score: 3 },
      { championId: "thresh", score: 2 },
    ],

    weakVs: [
      { championId: "bard", score: 4 },
      { championId: "lux", score: 3 },
      { championId: "lulu", score: 3 },
      { championId: "shen", score: 3 },
      { championId: "tahm-kench", score: 2 },
    ],

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
      picks: 17,
      bans: 14,
      presence: 31,
      prioScore: 5,
      wins: 7,
      losses: 10,
      proWinRate: 41,
      kda: 2.4,
      avgBanTurn: 7.1,
      avgPickRound: 2.35,
      blindPickRate: 35.3,
      averageGameTime: "33:16",
      csPerMinute: 1.1,
      damagePerMinute: 270,
      goldPerMinute: 295,
      csDiffAt15: -0.7,
      goldDiffAt15: 29,
      xpDiffAt15: -109,
      soloqKrChallengerWinRate: 55.06,
    },
  }),


  createChampion({
    id: "kogmaw",

    goodVs: [
      { championId: "caitlyn", score: 3 },
      { championId: "sivir", score: 3 },
      { championId: "tristana", score: 3 }
    ],

    weakVs: [
      { championId: "jinx", score: 5 },
      { championId: "aphelios", score: 5 },
      { championId: "xayah", score: 4 },
      { championId: "lucian", score: 4 },
      { championId: "ezreal", score: 3 },
    ],

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
      picks: 5,
      bans: 0,
      presence: 5,
      prioScore: 1,
      wins: 2,
      losses: 3,
      proWinRate: 40,
      kda: 2.5,
      avgBanTurn: null,
      avgPickRound: 2.2,
      blindPickRate: 0,
      averageGameTime: "29:02",
      csPerMinute: 9.9,
      damagePerMinute: 633,
      goldPerMinute: 437,
      csDiffAt15: 33,
      goldDiffAt15: 273,
      xpDiffAt15: 529,
      soloqKrChallengerWinRate: 56.98,
    },
  }),


  createChampion({
    id: "yorick",
    goodVs: [
      { championId: "ksante", score: 5 },
      { championId: "ornn", score: 5 },
      { championId: "chogath", score: 4 },
      { championId: "jayce", score: 3 },
      { championId: "jax", score: 3 },
    ],

    weakVs: [
      { championId: "gangplank", score: 5 },
      { championId: "ambessa", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "sion", score: 3 },
      { championId: "aatrox", score: 3 },
    ],

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
      picks: 44,
      bans: 45,
      presence: 89,
      prioScore: 16,
      wins: 23,
      losses: 21,
      proWinRate: 52,
      kda: 2.3,
      avgBanTurn: 7.1,
      avgPickRound: 1.91,
      blindPickRate: 15.3,
      averageGameTime: "31:52",
      csPerMinute: 8.8,
      damagePerMinute: 567,
      goldPerMinute: 407,
      csDiffAt15: -6.3,
      goldDiffAt15: -290,
      xpDiffAt15: -118,
      soloqKrChallengerWinRate: 50.0,
    },
  }),


  createChampion({
    id: "thresh",
    goodVs: [
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "seraphine", score: 2 },
      { championId: "nami", score: 3 },
    ],

    weakVs: [
      { championId: "lux", score: 5 },
      { championId: "shen", score: 4 },
      { championId: "pantheon", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "pyke", score: 3 },
    ],

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
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 0,
      wins: 0,
      losses: 3,
      proWinRate: 0,
      kda: 1.1,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 66.7,
      averageGameTime: "34:31",
      csPerMinute: 1,
      damagePerMinute: 159,
      goldPerMinute: 242,
      csDiffAt15: -11.7,
      goldDiffAt15: -314,
      xpDiffAt15: -384,
      soloqKrChallengerWinRate: 58.57,
    },
  }),


  createChampion({
    id: "nunu",

    goodVs: [
      { championId: "karthus", score: 5 },
      { championId: "nidalee", score: 5 },
      { championId: "kindred", score: 4 },
      { championId: "graves", score: 4 },
      { championId: "lillia", score: 3 },
    ],

    weakVs: [
      { championId: "trundle", score: 5 },
      { championId: "xin-zhao", score: 4 },
      { championId: "lee-sin", score: 4 },
      { championId: "jarvan-iv", score: 3 },
    ],

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
    goodVs: [
      { championId: "aatrox", score: 4 },
      { championId: "ksante", score: 4 },
      { championId: "fiora", score: 3 },
      { championId: "sion", score: 3 },
      { championId: "ornn", score: 3 },
    ],

    weakVs: [
      { championId: "jax", score: 3 },
      { championId: "gwen", score: 4 },
      { championId: "olaf", score: 4 },
      { championId: "vladimir", score: 3 },
      { championId: "shen", score: 3 },
    ],

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
      picks: 100,
      bans: 150,
      presence: 250,
      prioScore: 51,
      wins: 47,
      losses: 53,
      proWinRate: 47,
      kda: 1.8,
      avgBanTurn: 4.2,
      avgPickRound: 1.4,
      blindPickRate: 87.2,
      averageGameTime: "32:57",
      csPerMinute: 1.3,
      damagePerMinute: 310,
      goldPerMinute: 276,
      csDiffAt15: -1.6,
      goldDiffAt15: 246,
      xpDiffAt15: -188,
      soloqKrChallengerWinRate: 55.22,
    },
  }),


  createChampion({
    id: "twisted-fate",
    goodVs: [
      { championId: "aurora", score: 5 },
      { championId: "hwei", score: 5 },
      { championId: "leblanc", score: 4 },
      { championId: "yone", score: 4 },
      { championId: "syndra", score: 3 },
    ],

    weakVs: [
      { championId: "taliyah", score: 5 },
      { championId: "lissandra", score: 4 },
      { championId: "zoe", score: 3 },
      { championId: "cassiopeia", score: 3 },
      { championId: "ahri", score: 3 },
    ],

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
      picks: 23,
      bans: 31,
      presence: 54,
      prioScore: 9,
      wins: 14,
      losses: 9,
      proWinRate: 61,
      kda: 3.4,
      avgBanTurn: 7.6,
      avgPickRound: 2.18,
      blindPickRate: 4.3,
      averageGameTime: "31:59",
      csPerMinute: 8.6,
      damagePerMinute: 623,
      goldPerMinute: 459,
      csDiffAt15: -2.8,
      goldDiffAt15: 729,
      xpDiffAt15: -99,
      soloqKrChallengerWinRate: 55.97,
    },
  }),


  createChampion({
    id: "kindred",
    goodVs: [
      { championId: "trundle", score: 5 },
      { championId: "wukong", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "maokai", score: 3 },
    ],

    weakVs: [
      { championId: "lillia", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "poppy", score: 4 },
      { championId: "taliyah", score: 4 },
      { championId: "nidalee", score: 3 },
    ],

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
      picks: 2,
      bans: 1,
      presence: 3,
      prioScore: 0,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 3,
      avgBanTurn: 10,
      avgPickRound: 4.5,
      blindPickRate: 0,
      averageGameTime: "29:03",
      csPerMinute: 8,
      damagePerMinute: 607,
      goldPerMinute: 422,
      csDiffAt15: 28,
      goldDiffAt15: 477,
      xpDiffAt15: 1634,
      soloqKrChallengerWinRate: 57.09,
    },
  }),

  createChampion({
    id: "vayne",
    goodVs: [
      { championId: "renekton", score: 3 },
      { championId: "ksante", score: 5 },
      { championId: "gnar", score: 4 },
      { championId: "kogmaw", score: 3 },
      { championId: "sivir", score: 3 },
    ],

    weakVs: [
      { championId: "samira", score: 5 },
      { championId: "ezreal", score: 4 },
      { championId: "kalista", score: 4 },
      { championId: "lucian", score: 4 },
      { championId: "jinx", score: 3 },
    ],

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
      picks: 23,
      bans: 202,
      presence: 225,
      prioScore: 48,
      wins: 12,
      losses: 11,
      proWinRate: 52,
      kda: 2.6,
      avgBanTurn: 6.3,
      avgPickRound: 1.87,
      blindPickRate: 10.1,
      averageGameTime: "34:51",
      csPerMinute: 8.1,
      damagePerMinute: 633,
      goldPerMinute: 400,
      csDiffAt15: 6.8,
      goldDiffAt15: 272,
      xpDiffAt15: 120,
      soloqKrChallengerWinRate: 57.79,
    },
  }),


  createChampion({
    id: "viego",
    goodVs: [
      { championId: "xin-zhao", score: 3 },
      { championId: "gwen", score: 5 },
      { championId: "skarner", score: 4 },
      { championId: "karthus", score: 4 },
      { championId: "ivern", score: 3 },
    ],

    weakVs: [
      { championId: "zac", score: 5 },
      { championId: "naafiri", score: 5 },
      { championId: "pantheon", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "vi", score: 4 },
    ],

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
    goodVs: [
      { championId: "zilean", score: 5 },
      { championId: "soraka", score: 5 },
      { championId: "rakan", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "seraphine", score: 4 },
    ],

    weakVs: [
      { championId: "maokai", score: 5 },
      { championId: "neeko", score: 4 },
      { championId: "blitzcrank", score: 4 },
      { championId: "thresh", score: 3 },
      { championId: "yuumi", score: 3 },
    ],

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
      picks: 13,
      bans: 2,
      presence: 15,
      prioScore: 2,
      wins: 11,
      losses: 2,
      proWinRate: 85,
      kda: 6.2,
      avgBanTurn: 7,
      avgPickRound: 2.7,
      blindPickRate: 15.4,
      averageGameTime: "31:49",
      csPerMinute: 1.1,
      damagePerMinute: 209,
      goldPerMinute: 282,
      csDiffAt15: -0.4,
      goldDiffAt15: -2,
      xpDiffAt15: 360,
      soloqKrChallengerWinRate: 62.26,
    },
  }),


  createChampion({
    id: "tristana",
    goodVs: [
      { championId: "jhin", score: 5 },
      { championId: "sivir", score: 4 },
      { championId: "draven", score: 4 },
      { championId: "samira", score: 4 },
      { championId: "ziggs", score: 3 },
    ],

    weakVs: [
      { championId: "miss-fortune", score: 5 },
      { championId: "ashe", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "lucian", score: 3 },
    ],

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
      picks: 14,
      bans: 8,
      presence: 22,
      prioScore: 4,
      wins: 7,
      losses: 7,
      proWinRate: 50,
      kda: 2,
      avgBanTurn: 8.8,
      avgPickRound: 2,
      blindPickRate: 8.7,
      averageGameTime: "29:44",
      csPerMinute: 8.7,
      damagePerMinute: 533,
      goldPerMinute: 424,
      csDiffAt15: 4.8,
      goldDiffAt15: 106,
      xpDiffAt15: -568,
      soloqKrChallengerWinRate: 60.51,
    },
  }),


  createChampion({
    id: "elise",
    goodVs: [
      { championId: "rakan", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "renata-glasc", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "poppy", score: 2 },
    ],

    weakVs: [
      { championId: "alistar", score: 5 },
      { championId: "karma", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "rell", score: 3 },
      { championId: "neeko", score: 3 },
    ],

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
      picks: 6,
      bans: 1,
      presence: 7,
      prioScore: 0,
      wins: 1,
      losses: 5,
      proWinRate: 17,
      kda: 1.8,
      avgBanTurn: 7,
      avgPickRound: 3,
      blindPickRate: 33.3,
      averageGameTime: "35:05",
      csPerMinute: 1.1,
      damagePerMinute: 311,
      goldPerMinute: 275,
      csDiffAt15: 2.5,
      goldDiffAt15: -142,
      xpDiffAt15: -91,
      soloqKrChallengerWinRate: 60.58,
    },
  }),


  createChampion({
    id: "zed",
    goodVs: [
      { championId: "talon", score: 5 },
      { championId: "cassiopeia", score: 5 },
      { championId: "jayce", score: 4 },
      { championId: "vladimir", score: 4 },
      { championId: "taliyah", score: 4 },
    ],

    weakVs: [
      { championId: "zoe", score: 5 },
      { championId: "azir", score: 5 },
      { championId: "leblanc", score: 4 },
      { championId: "lissandra", score: 3 },
      { championId: "syndra", score: 3 },
    ],

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
    goodVs: [
      { championId: "ksante", score: 4 }
    ],

    weakVs: [
      { championId: "jax", score: 4 }
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
      { championId: "tristana", score: 5 },
      { championId: "jinx", score: 4 },
      { championId: "draven", score: 4 },
      { championId: "corki", score: 4 },
      { championId: "xayah", score: 3 },
    ],

    weakVs: [
      { championId: "caitlyn", score: 5 },
      { championId: "varus", score: 4 },
      { championId: "aphelios", score: 4 },
      { championId: "zeri", score: 3 },
      { championId: "kalista", score: 3 },
    ],

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
      picks: 19,
      bans: 9,
      presence: 28,
      prioScore: 4,
      wins: 9,
      losses: 10,
      proWinRate: 47,
      kda: 3.1,
      avgBanTurn: 8.7,
      avgPickRound: 2.37,
      blindPickRate: 10.9,
      averageGameTime: "33:48",
      csPerMinute: 10,
      damagePerMinute: 691,
      goldPerMinute: 480,
      csDiffAt15: -3.6,
      goldDiffAt15: 7,
      xpDiffAt15: -71,
      soloqKrChallengerWinRate: 55.26,
    },
  }),


  createChampion({
    id: "hwei",
    goodVs: [
      { championId: "mel", score: 5 },
      { championId: "akali", score: 3 },
      { championId: "sylas", score: 4 },
      { championId: "viktor", score: 4 },
      { championId: "aurora", score: 3 },
    ],

    weakVs: [
      { championId: "twisted-fate", score: 5 },
      { championId: "ahri", score: 4 },
      { championId: "yone", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "aurelion-sol", score: 3 },
    ],

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
      picks: 7,
      bans: 1,
      presence: 8,
      prioScore: 1,
      wins: 2,
      losses: 5,
      proWinRate: 29,
      kda: 2.8,
      avgBanTurn: 8,
      avgPickRound: 2.86,
      blindPickRate: 42.8,
      averageGameTime: "32:43",
      csPerMinute: 8.4,
      damagePerMinute: 804,
      goldPerMinute: 384,
      csDiffAt15: 7.1,
      goldDiffAt15: 304,
      xpDiffAt15: 58,
      soloqKrChallengerWinRate: 52.85,
    },
  }),


  createChampion({
    id: "volibear",
    goodVs: [
      { championId: "sejuani", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "gangplank", score: 3 },
      { championId: "viego", score: 3 },
    ],

    weakVs: [
      { championId: "gnar", score: 5 },
      { championId: "jax", score: 5 },
      { championId: "camille", score: 4 },
      { championId: "poppy", score: 4 },
      { championId: "kindred", score: 3 },
    ],

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
      picks: 5,
      bans: 5,
      presence: 10,
      prioScore: 2,
      wins: 3,
      losses: 2,
      proWinRate: 60,
      kda: 2.4,
      avgBanTurn: 7.4,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "30:30",
      csPerMinute: 7.8,
      damagePerMinute: 683,
      goldPerMinute: 387,
      csDiffAt15: 0.4,
      goldDiffAt15: -159,
      xpDiffAt15: -133,
      soloqKrChallengerWinRate: 57.75,
    },
  }),


  createChampion({
    id: "yuumi",
    goodVs: [
      { championId: "tahm-kench", score: 4 },
      { championId: "renata-glasc", score: 3 },
      { championId: "nami", score: 2 },
      { championId: "lulu", score: 2 },
    ],

    weakVs: [
      { championId: "milio", score: 5 },
      { championId: "thresh", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "braum", score: 3 },
      { championId: "rakan", score: 3 },
    ],

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
      picks: 2,
      bans: 1,
      presence: 3,
      prioScore: 0,
      wins: 2,
      losses: 0,
      proWinRate: 100,
      kda: 6,
      avgBanTurn: 5,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "30:25",
      csPerMinute: 0.6,
      damagePerMinute: 294,
      goldPerMinute: 286,
      csDiffAt15: -2.5,
      goldDiffAt15: 290,
      xpDiffAt15: 709,
      soloqKrChallengerWinRate: 44.85,
    },
  }),


  createChampion({
    id: "graves",
    goodVs: [
      { championId: "sejuani", score: 5 },
      { championId: "wukong", score: 3 },
      { championId: "elise", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "xin-zhao", score: 3 },
    ],

    weakVs: [
      { championId: "pantheon", score: 5 },
      { championId: "lee-sin", score: 5 },
      { championId: "nidalee", score: 4 },
      { championId: "khazix", score: 4 },
      { championId: "nocturne", score: 3 },
    ],

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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 0,
      wins: 0,
      losses: 2,
      proWinRate: 0,
      kda: 1,
      avgBanTurn: null,
      avgPickRound: 2.5,
      blindPickRate: 0,
      averageGameTime: "31:52",
      csPerMinute: 8.6,
      damagePerMinute: 693,
      goldPerMinute: 432,
      csDiffAt15: null,
      goldDiffAt15: -1294,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 58.55,
    },
  }),


  createChampion({
    id: "zeri",
    goodVs: [
      { championId: "aphelios", score: 4 },
      { championId: "varus", score: 3 },
      { championId: "jinx", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "ziggs", score: 3 },
    ],

    weakVs: [
      { championId: "caitlyn", score: 5 },
      { championId: "nilah", score: 4 },
      { championId: "senna", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "seraphine", score: 3 },
    ],

    synergyWith: [
      { championId: "milio", score: 4 },
      { championId: "renata-glasc", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "rakan", score: 3 },
      { championId: "maokai", score: 3 },
      { championId: "sejuani", score: 3 },
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
      picks: 8,
      bans: 2,
      presence: 10,
      prioScore: 1,
      wins: 5,
      losses: 3,
      proWinRate: 63,
      kda: 5.9,
      avgBanTurn: 7.5,
      avgPickRound: 2.5,
      blindPickRate: 0,
      averageGameTime: "29:34",
      csPerMinute: 10.4,
      damagePerMinute: 901,
      goldPerMinute: 558,
      csDiffAt15: 4.3,
      goldDiffAt15: 836,
      xpDiffAt15: -118,
      soloqKrChallengerWinRate: 61.17,
    },
  }),


  createChampion({
    id: "milio",
    goodVs: [
      { championId: "lulu", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "leona", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "karma", score: 3 },
    ],

    weakVs: [
      { championId: "senna", score: 5 },
      { championId: "blitzcrank", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "braum", score: 3 },
      { championId: "rakan", score: 3 },
    ],

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
      picks: 68,
      bans: 3,
      presence: 71,
      prioScore: 9,
      wins: 31,
      losses: 37,
      proWinRate: 46,
      kda: 4.9,
      avgBanTurn: 8.7,
      avgPickRound: 2.03,
      blindPickRate: 71.4,
      averageGameTime: "31:20",
      csPerMinute: 1,
      damagePerMinute: 140,
      goldPerMinute: 263,
      csDiffAt15: -2.9,
      goldDiffAt15: -33,
      xpDiffAt15: 139,
      soloqKrChallengerWinRate: 53.13,
    },
  }),


  createChampion({
    id: "gragas",
    goodVs: [
      { championId: "chogath", score: 4 },
      { championId: "jayce", score: 4 },
      { championId: "kennen", score: 3 },
      { championId: "shen", score: 3 },
      { championId: "sett", score: 3 },
    ],

    weakVs: [
      { championId: "jarvan-iv", score: 5 },
      { championId: "poppy", score: 5 },
      { championId: "kled", score: 4 },
      { championId: "fiora", score: 4 },
      { championId: "camille", score: 4 },
    ],

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
      picks: 4,
      bans: 1,
      presence: 5,
      prioScore: 0,
      wins: 3,
      losses: 1,
      proWinRate: 75,
      kda: 3.3,
      avgBanTurn: 10,
      avgPickRound: 2.25,
      blindPickRate: 0,
      averageGameTime: "31:24",
      csPerMinute: 7.4,
      damagePerMinute: 482,
      goldPerMinute: 357,
      csDiffAt15: -12.8,
      goldDiffAt15: -189,
      xpDiffAt15: 303,
      soloqKrChallengerWinRate: 57.92,
    },
  }),


  createChampion({
    id: "reksai",
    goodVs: [
      { championId: "ksante", score: 5 },
      { championId: "sion", score: 4 },
    ],

    weakVs: [
      { championId: "aatrox", score: 5 },
      { championId: "ambessa", score: 4 },
      { championId: "renekton", score: 3 },
    ],

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
      soloqKrChallengerWinRate: 63.21,
    },
  }),


  createChampion({
    id: "draven",
    goodVs: [
      { championId: "ezreal", score: 5 },
      { championId: "kaisa", score: 5 },
      { championId: "jinx", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "sivir", score: 4 },
    ],

    weakVs: [
      { championId: "ashe", score: 5 },
      { championId: "tristana", score: 5 },
      { championId: "miss-fortune", score: 4 },
      { championId: "xayah", score: 3 },
      { championId: "varus", score: 3 },
    ],

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
      picks: 3,
      bans: 1,
      presence: 4,
      prioScore: 1,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 3.7,
      avgBanTurn: 10,
      avgPickRound: 2,
      blindPickRate: 50,
      averageGameTime: "31:19",
      csPerMinute: 9.3,
      damagePerMinute: 422,
      goldPerMinute: 530,
      csDiffAt15: null,
      goldDiffAt15: 117,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 55.06,
    },
  }),


  createChampion({
    id: "smolder",
    goodVs: [
      { championId: "zeri", score: 5 },
      { championId: "corki", score: 4 },
      { championId: "senna", score: 4 },
      { championId: "jinx", score: 3 },
      { championId: "xayah", score: 3 },
    ],

    weakVs: [
      { championId: "jhin", score: 5 },
      { championId: "ezreal", score: 5 },
      { championId: "kalista", score: 4 },
      { championId: "ashe", score: 4 },
      { championId: "varus", score: 3 },
    ],

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
    goodVs: [
      { championId: "smolder", score: 5 },
      { championId: "zeri", score: 5 },
      { championId: "ezreal", score: 4 },
      { championId: "jinx", score: 4 },
      { championId: "kogmaw", score: 4 },
    ],

    weakVs: [
      { championId: "draven", score: 3 },
      { championId: "senna", score: 5 },
      { championId: "twitch", score: 4 },
      { championId: "ziggs", score: 3 },
      { championId: "aphelios", score: 3 },
    ],

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
      picks: 13,
      bans: 8,
      presence: 21,
      prioScore: 3,
      wins: 11,
      losses: 2,
      proWinRate: 85,
      kda: 5.7,
      avgBanTurn: 8,
      avgPickRound: 2.69,
      blindPickRate: 51,
      averageGameTime: "31:44",
      csPerMinute: 10.1,
      damagePerMinute: 808,
      goldPerMinute: 532,
      csDiffAt15: 18.7,
      goldDiffAt15: 423,
      xpDiffAt15: -84,
      soloqKrChallengerWinRate: 52.87,
    },
  }),
  createChampion({
    id: "blitzcrank",
    goodVs: [
      { championId: "tahm-kench", score: 5 },
      { championId: "karma", score: 5 },
      { championId: "senna", score: 4 },
      { championId: "lulu", score: 4 },
      { championId: "milio", score: 3 },
    ],

    weakVs: [
      { championId: "leona", score: 5 },
      { championId: "ashe", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "alistar", score: 3 },
    ],

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
      picks: 3,
      bans: 1,
      presence: 4,
      prioScore: 0,
      wins: 2,
      losses: 1,
      proWinRate: 67,
      kda: 2.4,
      avgBanTurn: 10,
      avgPickRound: 2.67,
      blindPickRate: 0,
      averageGameTime: "29:40",
      csPerMinute: 0.9,
      damagePerMinute: 193,
      goldPerMinute: 272,
      csDiffAt15: -7,
      goldDiffAt15: -61,
      xpDiffAt15: -158,
      soloqKrChallengerWinRate: 57.25,
    },
  }),


  createChampion({
    id: "diana",
    goodVs: [
      { championId: "udyr", score: 5 },
      { championId: "volibear", score: 4 },
      { championId: "sejuani", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "nidalee", score: 3 },
    ],

    weakVs: [
      { championId: "nocturne", score: 4 },
      { championId: "wukong", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "trundle", score: 3 },
      { championId: "viego", score: 3 },
    ],

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
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: null,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "24:13",
      csPerMinute: 9,
      damagePerMinute: 634,
      goldPerMinute: 504,
      csDiffAt15: null,
      goldDiffAt15: 1053,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 52.38,
    },
  }),


  createChampion({
    id: "veigar",
    goodVs: [
      { championId: "taliyah", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "orianna", score: 3 },
    ],

    weakVs: [
      { championId: "sylas", score: 5 },
      { championId: "viktor", score: 5 },
      { championId: "ryze", score: 3 },
      { championId: "ahri", score: 3 },
    ],

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
    goodVs: [
      { championId: "gragas", score: 5 },
      { championId: "shen", score: 4 },
      { championId: "dr-mundo", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "renekton", score: 3 },
    ],

    weakVs: [
      { championId: "rumble", score: 5 },
      { championId: "sion", score: 4 },
      { championId: "jarvan-iv", score: 4 },
      { championId: "gnar", score: 3 },
      { championId: "gangplank", score: 3 },
    ],

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
      picks: 9,
      bans: 2,
      presence: 11,
      prioScore: 2,
      wins: 6,
      losses: 3,
      proWinRate: 67,
      kda: 4,
      avgBanTurn: 9,
      avgPickRound: 1.89,
      blindPickRate: 0,
      averageGameTime: "30:54",
      csPerMinute: 8.4,
      damagePerMinute: 709,
      goldPerMinute: 425,
      csDiffAt15: -1,
      goldDiffAt15: -21,
      xpDiffAt15: 106,
      soloqKrChallengerWinRate: 57.02,
    },
  }),


  createChampion({
    id: "sett",
    goodVs: [
      { championId: "volibear", score: 5 },
      { championId: "aatrox", score: 4 },
      { championId: "sion", score: 4 },
      { championId: "ornn", score: 4 },
      { championId: "mordekaiser", score: 3 },
    ],

    weakVs: [
      { championId: "akali", score: 5 },
      { championId: "jayce", score: 5 },
      { championId: "camille", score: 4 },
      { championId: "kennen", score: 4 },
      { championId: "viego", score: 3 },
    ],

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
      picks: 1,
      bans: 1,
      presence: 2,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: null,
      avgBanTurn: 10,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "30:56",
      csPerMinute: 8.7,
      damagePerMinute: 746,
      goldPerMinute: 434,
      csDiffAt15: 23,
      goldDiffAt15: 1046,
      xpDiffAt15: 359,
      soloqKrChallengerWinRate: 51.18,
    },
  }),


  createChampion({
    id: "vex",
    goodVs: [
      { championId: "yasuo", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "leblanc", score: 4 },
      { championId: "sylas", score: 3 },
      { championId: "akali", score: 3 },
    ],

    weakVs: [
      { championId: "viktor", score: 5 },
      { championId: "ahri", score: 4 },
      { championId: "corki", score: 4 },
      { championId: "ryze", score: 3 },
    ],

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
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 0,
      wins: 1,
      losses: 2,
      proWinRate: 33,
      kda: 2,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "31:47",
      csPerMinute: 8.4,
      damagePerMinute: 544,
      goldPerMinute: 407,
      csDiffAt15: -9,
      goldDiffAt15: -307,
      xpDiffAt15: -1377,
      soloqKrChallengerWinRate: 63.5,
    },
  }),


  createChampion({
    id: "shen",
    goodVs: [
      { championId: "poppy", score: 5 },
      { championId: "ksante", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "gnar", score: 4 },
      { championId: "kennen", score: 4 },
    ],

    weakVs: [
      { championId: "aatrox", score: 5 },
      { championId: "braum", score: 5 },
      { championId: "renekton", score: 4 },
      { championId: "jax", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "trundle", score: 3 },
      { championId: "kled", score: 3 },
    ],

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
      picks: 118,
      bans: 49,
      presence: 167,
      prioScore: 32,
      wins: 63,
      losses: 55,
      proWinRate: 53,
      kda: 3.7,
      avgBanTurn: 7,
      avgPickRound: 1.43,
      blindPickRate: 47.4,
      averageGameTime: "33:00",
      csPerMinute: 1.8,
      damagePerMinute: 209,
      goldPerMinute: 281,
      csDiffAt15: 0.2,
      goldDiffAt15: -42,
      xpDiffAt15: 61,
      soloqKrChallengerWinRate: 54.06,
    },
  }),


  createChampion({
    id: "darius",
    goodVs: [
      { championId: "camille", score: 5 },
      { championId: "gragas", score: 4 },
      { championId: "sion", score: 4 },
      { championId: "gnar", score: 3 },
      { championId: "ksante", score: 3 },
    ],

    weakVs: [
      { championId: "ornn", score: 3 },
      { championId: "kennen", score: 5 },
      { championId: "aatrox", score: 4 },
      { championId: "renekton", score: 3 },
      { championId: "jax", score: 3 },
    ],

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
    goodVs: [
      { championId: "ornn", score: 5 },
      { championId: "gangplank", score: 4 },
    ],

    weakVs: [
      { championId: "gnar", score: 5 },
      { championId: "gwen", score: 4 },
    ],

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
    goodVs: [
      { championId: "graves", score: 5 },
      { championId: "xin-zhao", score: 5 },
      { championId: "reksai", score: 4 },
      { championId: "trundle", score: 4 },
      { championId: "jarvan-iv", score: 4 },
    ],

    weakVs: [
      { championId: "maokai", score: 5 },
      { championId: "zac", score: 4 },
      { championId: "poppy", score: 4 },
      { championId: "ivern", score: 3 },
      { championId: "evelynn", score: 3 },
    ],

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
      picks: 1,
      bans: 1,
      presence: 2,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.8,
      avgBanTurn: 9,
      avgPickRound: 3,
      blindPickRate: null,
      averageGameTime: "32:41",
      csPerMinute: 7.1,
      damagePerMinute: 515,
      goldPerMinute: 410,
      csDiffAt15: null,
      goldDiffAt15: -506,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 54.55,
    },
  }),

  createChampion({
    id: "mordekaiser",
    goodVs: [
      { championId: "sion", score: 5 },
      { championId: "yorick", score: 4 },
      { championId: "fiora", score: 4 },
      { championId: "skarner", score: 4 },
      { championId: "shen", score: 3 },
    ],

    weakVs: [
      { championId: "aatrox", score: 5 },
      { championId: "ornn", score: 4 },
      { championId: "renekton", score: 4 },
      { championId: "sett", score: 3 },
      { championId: "gangplank", score: 3 },
    ],

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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 0,
      wins: 0,
      losses: 2,
      proWinRate: 0,
      kda: 1.9,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "39:29",
      csPerMinute: 7.5,
      damagePerMinute: 756,
      goldPerMinute: 406,
      csDiffAt15: 18,
      goldDiffAt15: 1697,
      xpDiffAt15: 1670,
      soloqKrChallengerWinRate: 51.52,
    },
  }),


  createChampion({
    id: "zilean",
    goodVs: [
      { championId: "malzahar", score: 5 },
      { championId: "leona", score: 5 },
      { championId: "leblanc", score: 4 },
      { championId: "thresh", score: 4 },
      { championId: "ahri", score: 4 },
    ],

    weakVs: [
      { championId: "alistar", score: 5 },
      { championId: "yuumi", score: 5 },
      { championId: "renata-glasc", score: 5 },
      { championId: "orianna", score: 4 },
      { championId: "ryze", score: 4 },
    ],

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
    goodVs: [
      { championId: "vi", score: 5 },
      { championId: "galio", score: 5 },
      { championId: "nami", score: 4 },
      { championId: "nautilus", score: 4 },
      { championId: "soraka", score: 4 },
    ],

    weakVs: [
      { championId: "bard", score: 5 },
      { championId: "shen", score: 5 },
      { championId: "tahm-kench", score: 5 },
      { championId: "pyke", score: 4 },
      { championId: "lulu", score: 3 },
    ],

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

    goodVs: [
      { championId: "gragas", score: 5 },
      { championId: "malphite", score: 5 },
      { championId: "jax", score: 4 },
      { championId: "aatrox", score: 4 },
      { championId: "ornn", score: 4 },
    ],

    weakVs: [
      { championId: "mordekaiser", score: 5 },
      { championId: "kennen", score: 4 },
      { championId: "gwen", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "gnar", score: 3 },
    ],

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
    goodVs: [
      { championId: "galio", score: 5 },
      { championId: "sylas", score: 5 },
      { championId: "leblanc", score: 4 },
      { championId: "orianna", score: 3 },
      { championId: "syndra", score: 3 },
    ],

    weakVs: [
      { championId: "cassiopeia", score: 5 },
      { championId: "lissandra", score: 5 },
      { championId: "ryze", score: 4 },
      { championId: "vladimir", score: 4 },
      { championId: "zoe", score: 3 },
    ],

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

    goodVs: [
      { championId: "gnar", score: 5 },
      { championId: "ornn", score: 4 },
      { championId: "vladimir", score: 4 },
    ],

    weakVs: [
      { championId: "gwen", score: 5 },
      { championId: "aatrox", score: 4 },
      { championId: "camille", score: 3 },
    ],

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

    goodVs: [
      { championId: "janna", score: 5 },
      { championId: "shen", score: 5 },
      { championId: "tahm-kench", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "bard", score: 2 },
    ],

    weakVs: [
      { championId: "renata-glasc", score: 5 },
      { championId: "karma", score: 5 },
      { championId: "nami", score: 4 },
      { championId: "rakan", score: 4 },
      { championId: "lulu", score: 3 },
    ],

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
    goodVs: [
      { championId: "taliyah", score: 4 },
      { championId: "lissandra", score: 4 },
      { championId: "sylas", score: 4 },
      { championId: "viktor", score: 3 },
      { championId: "galio", score: 3 },
    ],

    weakVs: [
      { championId: "cassiopeia", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "azir", score: 4 },
      { championId: "akali", score: 3 },
      { championId: "ryze", score: 3 },
    ],

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
      picks: 5,
      bans: 0,
      presence: 5,
      prioScore: 0,
      wins: 4,
      losses: 1,
      proWinRate: 80,
      kda: 4.7,
      avgBanTurn: null,
      avgPickRound: 2.6,
      blindPickRate: 0,
      averageGameTime: "30:45",
      csPerMinute: 8.1,
      damagePerMinute: 657,
      goldPerMinute: 406,
      csDiffAt15: -7,
      goldDiffAt15: -229,
      xpDiffAt15: 39,
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
      picks: 2,
      bans: 2,
      presence: 4,
      prioScore: 0,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 5.7,
      avgBanTurn: 8.5,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "29:50",
      csPerMinute: 8.5,
      damagePerMinute: 607,
      goldPerMinute: 454,
      csDiffAt15: 10,
      goldDiffAt15: 377,
      xpDiffAt15: -128,
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
      bans: 2,
      presence: 3,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1,
      avgBanTurn: 3.5,
      avgPickRound: 3,
      blindPickRate: 100,
      averageGameTime: "35:16",
      csPerMinute: 7.7,
      damagePerMinute: 526,
      goldPerMinute: 374,
      csDiffAt15: 11,
      goldDiffAt15: 257,
      xpDiffAt15: 595,
      soloqKrChallengerWinRate: 58.29,
    },
  }),


  createChampion({
    id: "senna",

    goodVs: [
      { championId: "milio", score: 4 },
      { championId: "nautilus", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "lucian", score: 2 },
      { championId: "jhin", score: 2 },
    ],

    weakVs: [
      { championId: "kaisa", score: 5 },
      { championId: "nami", score: 4 },
      { championId: "blitzcrank", score: 4 },
      { championId: "bard", score: 3 },
      { championId: "caitlyn", score: 3 },
    ],

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
      picks: 9,
      bans: 4,
      presence: 13,
      prioScore: 1,
      wins: 2,
      losses: 7,
      proWinRate: 22,
      kda: 3.9,
      avgBanTurn: 2.5,
      avgPickRound: 2.34,
      blindPickRate: 51.9,
      averageGameTime: "32:18",
      csPerMinute: 8,
      damagePerMinute: 604,
      goldPerMinute: 425,
      csDiffAt15: -19.4,
      goldDiffAt15: -870,
      xpDiffAt15: -209,
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
      { championId: "zac", score: 5 },
      { championId: "maokai", score: 3 },
      { championId: "vi", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "wukong", score: 4 },
    ],

    weakVs: [
      { championId: "dr-mundo", score: 5 },
      { championId: "naafiri", score: 5 },
      { championId: "viego", score: 4 },
      { championId: "lillia", score: 4 },
      { championId: "lee-sin", score: 3 },
    ],

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
      picks: 53,
      bans: 27,
      presence: 80,
      prioScore: 12,
      wins: 25,
      losses: 28,
      proWinRate: 47,
      kda: 2.9,
      avgBanTurn: 6.9,
      avgPickRound: 2.13,
      blindPickRate: 16.5,
      averageGameTime: "32:54",
      csPerMinute: 6.3,
      damagePerMinute: 458,
      goldPerMinute: 362,
      csDiffAt15: -2.4,
      goldDiffAt15: -321,
      xpDiffAt15: -290,
      soloqKrChallengerWinRate: 50.2,
    },
  }),


  createChampion({
    id: "ziggs",
    goodVs: [
      { championId: "viktor", score: 5 },
      { championId: "taliyah", score: 5 },
      { championId: "orianna", score: 3 },
      { championId: "azir", score: 4 },
      { championId: "syndra", score: 3 },
    ],

    weakVs: [
      { championId: "kaisa", score: 5 },
      { championId: "xayah", score: 5 },
      { championId: "jhin", score: 4 },
      { championId: "jinx", score: 4 },
      { championId: "tahm-kench", score: 4 },
    ],

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
      picks: 88,
      bans: 74,
      presence: 162,
      prioScore: 31,
      wins: 31,
      losses: 57,
      proWinRate: 35,
      kda: 3.2,
      avgBanTurn: 7.5,
      avgPickRound: 1.58,
      blindPickRate: 52,
      averageGameTime: "33:32",
      csPerMinute: 9.6,
      damagePerMinute: 889,
      goldPerMinute: 461,
      csDiffAt15: -1.8,
      goldDiffAt15: -41,
      xpDiffAt15: 85,
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
    goodVs: [
      { championId: "kassadin", score: 5 },
      { championId: "akali", score: 5 },
      { championId: "viktor", score: 4 },
      { championId: "jayce", score: 4 },
      { championId: "leblanc", score: 4 },
    ],

    weakVs: [
      { championId: "swain", score: 5 },
      { championId: "sylas", score: 4 },
      { championId: "orianna", score: 4 },
      { championId: "irelia", score: 3 },
      { championId: "vladimir", score: 3 },
    ],

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
      picks: 5,
      bans: 5,
      presence: 10,
      prioScore: 2,
      wins: 3,
      losses: 2,
      proWinRate: 60,
      kda: 4.3,
      avgBanTurn: 8.8,
      avgPickRound: 2,
      blindPickRate: 20,
      averageGameTime: "32:54",
      csPerMinute: 9.1,
      damagePerMinute: 736,
      goldPerMinute: 444,
      csDiffAt15: 9.2,
      goldDiffAt15: 938,
      xpDiffAt15: 292,
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
      bans: 1,
      presence: 2,
      prioScore: 1,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 0.7,
      avgBanTurn: 10,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "32:24",
      csPerMinute: 10.4,
      damagePerMinute: 619,
      goldPerMinute: 431,
      csDiffAt15: 10,
      goldDiffAt15: 311,
      xpDiffAt15: -547,
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
      picks: 12,
      bans: 6,
      presence: 18,
      prioScore: 3,
      wins: 5,
      losses: 7,
      proWinRate: 42,
      kda: 4,
      avgBanTurn: 8.7,
      avgPickRound: 1.92,
      blindPickRate: 30,
      averageGameTime: "32:02",
      csPerMinute: 9.3,
      damagePerMinute: 986,
      goldPerMinute: 471,
      csDiffAt15: -10.3,
      goldDiffAt15: -187,
      xpDiffAt15: -261,
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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: 22,
      avgBanTurn: null,
      avgPickRound: 4,
      blindPickRate: 0,
      averageGameTime: "23:19",
      csPerMinute: 8.3,
      damagePerMinute: 1557,
      goldPerMinute: 679,
      csDiffAt15: 0,
      goldDiffAt15: 2350,
      xpDiffAt15: 335,
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
      { championId: "yasuo", score: 5 },
      { championId: "viktor", score: 5 },
      { championId: "kassadin", score: 5 },
      { championId: "azir", score: 4 },
      { championId: "camille", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "poppy", score: 3 },
    ],

    weakVs: [
      { championId: "zoe", score: 5 },
      { championId: "ahri", score: 5 },
      { championId: "renekton", score: 5 },
      { championId: "syndra", score: 4 },
      { championId: "anivia", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "urgot", score: 3 },
    ],

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
      picks: 4,
      bans: 1,
      presence: 5,
      prioScore: 1,
      wins: 3,
      losses: 1,
      proWinRate: 75,
      kda: 4.9,
      avgBanTurn: 10,
      avgPickRound: 1.25,
      blindPickRate: 0,
      averageGameTime: "36:37",
      csPerMinute: 9.2,
      damagePerMinute: 613,
      goldPerMinute: 451,
      csDiffAt15: 2,
      goldDiffAt15: 129,
      xpDiffAt15: 196,
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

    goodVs: [
      { championId: "jax", score: 4 },
      { championId: "renekton", score: 3 },
      { championId: "jayce", score: 3 },
    ],

    weakVs: [
      { championId: "rumble", score: 5 },
      { championId: "dr-mundo", score: 4 },
      { championId: "kennen", score: 4 },
      { championId: "yorick", score: 4 },
      { championId: "aatrox", score: 3 },
    ],

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
      prioScore: 0,
      wins: 2,
      losses: 0,
      proWinRate: 100,
      kda: 3.2,
      avgBanTurn: null,
      avgPickRound: 2.5,
      blindPickRate: 0,
      averageGameTime: "33:09",
      csPerMinute: 7.6,
      damagePerMinute: 666,
      goldPerMinute: 427,
      csDiffAt15: 6.5,
      goldDiffAt15: 78,
      xpDiffAt15: 89,
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

    goodVs: [
      { championId: "nautilus", score: 5 },
      { championId: "karma", score: 5 },
    ],

    weakVs: [
      { championId: "rakan", score: 5 },
      { championId: "nami", score: 4 },
      { championId: "lux", score: 4 },
      { championId: "leona", score: 3 },
      { championId: "ashe", score: 3 },
    ],

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
    goodVs: [
      { championId: "lulu", score: 4 },
      { championId: "alistar", score: 4 },
      { championId: "tahm-kench", score: 4 },
      { championId: "karma", score: 3 },
      { championId: "nami", score: 3 },
    ],

    weakVs: [
      { championId: "rell", score: 4 },
      { championId: "taric", score: 3 },
      { championId: "braum", score: 3 },
      { championId: "rakan", score: 3 },
      { championId: "thresh", score: 2 },
    ],

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

    goodVs: [
      { championId: "ryze", score: 4 },
      { championId: "galio", score: 3 },
      { championId: "vladimir", score: 3 },
      { championId: "zoe", score: 2 },
    ],

    weakVs: [
      { championId: "taliyah", score: 5 },
      { championId: "veigar", score: 3 },
      { championId: "azir", score: 2 },
      { championId: "viktor", score: 3 },
    ],

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
      picks: 4,
      bans: 2,
      presence: 6,
      prioScore: 1,
      wins: 1,
      losses: 3,
      proWinRate: 25,
      kda: 3.2,
      avgBanTurn: 6.5,
      avgPickRound: 2.5,
      blindPickRate: 0,
      averageGameTime: "31:26",
      csPerMinute: 6.3,
      damagePerMinute: 490,
      goldPerMinute: 383,
      csDiffAt15: -27.5,
      goldDiffAt15: -760,
      xpDiffAt15: -1141,
      soloqKrChallengerWinRate: 51.22,
    },
  }),
  createChampion({
    id: "quinn",

    goodVs: [
      { championId: "renekton", score: 4 },
      { championId: "gnar", score: 3 },
    ],

    weakVs: [
      { championId: "gangplank", score: 4 },
    ],

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
      picks: 5,
      bans: 3,
      presence: 8,
      prioScore: 1,
      wins: 2,
      losses: 3,
      proWinRate: 40,
      kda: 1.6,
      avgBanTurn: 3.7,
      avgPickRound: 2.2,
      blindPickRate: 0,
      averageGameTime: "33:39",
      csPerMinute: 7.7,
      damagePerMinute: 512,
      goldPerMinute: 423,
      csDiffAt15: 0.6,
      goldDiffAt15: -217,
      xpDiffAt15: -67,
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

    goodVs: [
      { championId: "lulu", score: 5 },
      { championId: "karma", score: 5 },
      { championId: "janna", score: 4 },
      { championId: "tahm-kench", score: 3 },
    ],

    weakVs: [
      { championId: "senna", score: 5 },
      { championId: "rakan", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "thresh", score: 3 },
      { championId: "yuumi", score: 3 },
    ],

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
      picks: 1,
      bans: 0,
      presence: 1,
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 2.8,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: 0,
      averageGameTime: "43:51",
      csPerMinute: 1,
      damagePerMinute: 85,
      goldPerMinute: 267,
      csDiffAt15: 6,
      goldDiffAt15: -305,
      xpDiffAt15: -288,
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

    goodVs: [
      { championId: "xayah", score: 4 },
      { championId: "lucian", score: 3 },
      { championId: "jinx", score: 3 },
      { championId: "kogmaw", score: 2 }
    ],

    weakVs: [
      { championId: "aphelios", score: 4 },
      { championId: "jhin", score: 4 },
      { championId: "varus", score: 3 },
      { championId: "zeri", score: 3 },
    ],

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

    goodVs: [
      { championId: "pantheon", score: 5 }, // JUNGLE
      { championId: "graves", score: 4 },   // JUNGLE
      { championId: "olaf", score: 4 },
      { championId: "volibear", score: 4 }, // JUNGLE
      { championId: "jax", score: 3 },
      { championId: "aatrox", score: 2 },
    ],

    weakVs: [
      { championId: "darius", score: 5 },    // TOP
      { championId: "rumble", score: 5 },    // TOP
      { championId: "ksante", score: 4 },    // TOP
      { championId: "gnar", score: 4 },      // TOP
      { championId: "wukong", score: 5 },    // JUNGLE
      { championId: "xin-zhao", score: 5 },  // JUNGLE
      { championId: "jarvan-iv", score: 4 }, // JUNGLE
    ],

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
      picks: 3,
      bans: 0,
      presence: 3,
      prioScore: 0,
      wins: 1,
      losses: 2,
      proWinRate: 33,
      kda: 1.9,
      avgBanTurn: null,
      avgPickRound: 2.67,
      blindPickRate: 0,
      averageGameTime: "31:56",
      csPerMinute: 7.3,
      damagePerMinute: 332,
      goldPerMinute: 334,
      csDiffAt15: -18,
      goldDiffAt15: -554,
      xpDiffAt15: -482,
      soloqKrChallengerWinRate: 56.81,
    },
  }),
  createChampion({
    id: "urgot",

    goodVs: [
      { championId: "gangplank", score: 5 },
      { championId: "vladimir", score: 5 },
      { championId: "ksante", score: 4 },
      { championId: "ornn", score: 4 },
      { championId: "sion", score: 3 },
      { championId: "aatrox", score: 3 },
    ],

    weakVs: [
      { championId: "gnar", score: 5 },
      { championId: "renekton", score: 5 },
      { championId: "jax", score: 3 },
      { championId: "kennen", score: 3 },
      { championId: "camille", score: 3 },
    ],

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
      picks: 2,
      bans: 0,
      presence: 2,
      prioScore: 1,
      wins: 1,
      losses: 1,
      proWinRate: 50,
      kda: 3.2,
      avgBanTurn: null,
      avgPickRound: 1,
      blindPickRate: 0,
      averageGameTime: "27:28",
      csPerMinute: 9.8,
      damagePerMinute: 689,
      goldPerMinute: 478,
      csDiffAt15: 10.5,
      goldDiffAt15: 710,
      xpDiffAt15: 54,
      soloqKrChallengerWinRate: 57.89,
    },
  }),
  createChampion({
    id: "zac",
    goodVs: [
      { championId: "khazix", score: 4 },
      { championId: "aatrox", score: 3 },
      { championId: "xin-zhao", score: 3 },
      { championId: "reksai", score: 3 },
      { championId: "rumble", score: 2 }
    ],

    weakVs: [
      { championId: "ksante", score: 5 },
      { championId: "poppy", score: 4 },
      { championId: "nocturne", score: 4 },
      { championId: "maokai", score: 4 },
      { championId: "ornn", score: 4 }
    ],

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
      prioScore: 0,
      wins: 1,
      losses: 0,
      proWinRate: 100,
      kda: null,
      avgBanTurn: null,
      avgPickRound: 3,
      blindPickRate: null,
      averageGameTime: "33:57",
      csPerMinute: 8.8,
      damagePerMinute: 817,
      goldPerMinute: 414,
      csDiffAt15: 5,
      goldDiffAt15: -105,
      xpDiffAt15: 678,
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
      { championId: "pyke", score: 5 },
      { championId: "lulu", score: 3 },
      { championId: "morgana", score: 5 },
      { championId: "shen", score: 4 },
      { championId: "zilean", score: 4 },
      { championId: "thresh", score: 3 },
    ],

    weakVs: [
      { championId: "blitzcrank", score: 5 },
      { championId: "rakan", score: 4 },
      { championId: "leona", score: 4 },
      { championId: "rell", score: 4 },
      { championId: "nami", score: 4 },
      { championId: "janna", score: 3 },
      { championId: "soraka", score: 3 },
    ],

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
      prioScore: 0,
      wins: 0,
      losses: 1,
      proWinRate: 0,
      kda: 1,
      avgBanTurn: null,
      avgPickRound: 2,
      blindPickRate: 0,
      averageGameTime: "33:35",
      csPerMinute: 0.9,
      damagePerMinute: 177,
      goldPerMinute: 229,
      csDiffAt15: 5,
      goldDiffAt15: -394,
      xpDiffAt15: -433,
      soloqKrChallengerWinRate: 50.5,
    },
  }),
  createChampion({
    id: "ivern",
    goodVs: [
      { championId: "jarvan-iv", score: 4 },
      { championId: "xin-zhao", score: 4 },
      { championId: "nidalee", score: 3 },
      { championId: "skarner", score: 4 },
      { championId: "sejuani", score: 4 }
    ],

    weakVs: [
      { championId: "trundle", score: 5 },
      { championId: "lillia", score: 4 },
      { championId: "viego", score: 4 },
      { championId: "pantheon", score: 4 }
    ],

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

    goodVs: [
      { championId: "trundle", score: 5 },
      { championId: "lee-sin", score: 4 },
      { championId: "viego", score: 3 },
      { championId: "vi", score: 3 },
    ],

    weakVs: [
      { championId: "maokai", score: 5 },
      { championId: "sejuani", score: 5 },
      { championId: "xin-zhao", score: 4 },
      { championId: "wukong", score: 4 },
    ],

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
      averageGameTime: "24:13",
      csPerMinute: 7.2,
      damagePerMinute: 35,
      goldPerMinute: 325,
      csDiffAt15: null,
      goldDiffAt15: -210,
      xpDiffAt15: null,
      soloqKrChallengerWinRate: 53.85,
    },
  }),
  createChampion({
    id: "nilah",

    goodVs: [
      { championId: "aphelios", score: 4 },
      { championId: "kaisa", score: 4 },
      { championId: "zeri", score: 5 },
    ],

    weakVs: [
      { championId: "lucian", score: 5 },
      { championId: "sivir", score: 4 },
    ],

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