import { createChampion } from "./_helpers";

export const cassiopeia = createChampion({
  id: "cassiopeia",
  name: "Cassiopeia",
  image: "/champions/cassiopeia.png",
  roles: ["mid", "adc"],
  damageProfile: ["AP"],
  attackType: "ranged",

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

  roleData: {
    mid: {
      goodVs: [
        { championId: "kassadin", level: 3, phase: "all", note: "W (grounding) îl ține pe loc și anulează R-ul lui Kassadin" },
        { championId: "akali", level: 2, phase: "all", note: "grounding oprește dash-urile Akalei" },
        { championId: "aurora", level: 2, phase: "all", note: "W (grounding) anulează blink-urile Aurorei" },
        { championId: "leblanc", level: 2, phase: "all", note: "grounding anulează W-ul LeBlanc-ului" },
        { championId: "sylas", level: 2, phase: "all", note: "grounding anulează E-ul lui Sylas (dash)" },
        { championId: "syndra", level: 2, phase: "all", note: "DPS constant contra burst-ului; favorabilă în pro 2026 (59%)" },
        { championId: "viktor", level: 2, phase: "all", note: "DPS constant și grounding; favorabilă în pro 2026 (59%)" },
        { championId: "yasuo", level: 2, phase: "all", note: "grounding anulează E-ul și Q3" },
        { championId: "yone", level: 2, phase: "all", note: "grounding anulează E-ul și R-ul (dash-uri)" },
        { championId: "zed", level: 2, phase: "all", note: "grounding și R (stun) pe un asasin melee" },
        { championId: "anivia", level: 1, phase: "all" },
        { championId: "orianna", level: 1, phase: "all" },
      ],
      stats: {
        picks: 15,
        bans: null,
        presence: 55,
        prioScore: 61,
        wins: 9,
        losses: 6,
        proWinRate: 60,
        kda: 4.1,
        avgBanTurn: null,
        avgPickRound: 1.2,
        blindPickRate: 76.9,
        averageGameTime: "33:20",
        csPerMinute: 8.7,
        damagePerMinute: 562,
        goldPerMinute: 405,
        csDiffAt15: 5.3,
        goldDiffAt15: 258,
        xpDiffAt15: 27,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        special: { ground: 10 },
      },
    },
    adc: {
      goodVs: [
        { championId: "ziggs", level: 2, phase: "all", note: "DPS constant contra unui mage de poke; favorabilă în pro 2026 (12-2)" },
      ],
      stats: {
        picks: 1,
        bans: null,
        presence: 41,
        prioScore: 47,
        wins: 1,
        losses: 0,
        proWinRate: 100,
        kda: 4.7,
        avgBanTurn: null,
        avgPickRound: 1,
        blindPickRate: 100,
        averageGameTime: "33:21",
        csPerMinute: 8.5,
        damagePerMinute: 609,
        goldPerMinute: 461,
        csDiffAt15: 0,
        goldDiffAt15: 276,
        xpDiffAt15: 246,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
