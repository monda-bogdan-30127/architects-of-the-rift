import { createChampion } from "./_helpers";

export const renataGlasc = createChampion({
  id: "renata-glasc",
  name: "Renata Glasc",
  image: "/champions/renata-glasc.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "ranged",

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

  roleData: {
    support: {
      goodVs: [
        { championId: "alistar", level: 2, phase: "all", note: "R întoarce engage-ul împotriva echipei care intră" },
        { championId: "rell", level: 2, phase: "all", note: "R întoarce engage-ul împotriva echipei care intră" },
      ],
      stats: {
        picks: 16,
        bans: null,
        presence: 63,
        prioScore: 69,
        wins: 8,
        losses: 8,
        proWinRate: 50,
        kda: 3.5,
        avgBanTurn: null,
        avgPickRound: 1.5,
        blindPickRate: 80,
        averageGameTime: "36:36",
        csPerMinute: 1.1,
        damagePerMinute: 166,
        goldPerMinute: 260,
        csDiffAt15: 1.3,
        goldDiffAt15: -93,
        xpDiffAt15: 157,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        abilities: [
          { key: "q", name: "Handshake", effects: [{ type: "root", strength: 6, reliability: 6, priority: 7 }, { type: "displacement", subtype: "throw", strength: 6, reliability: 6, priority: 6 }] },
          { key: "w", name: "Bailout", effects: [{ type: "shield", subtype: "delayed-revive", strength: 8, reliability: 7, priority: 9 }] },
          { key: "e", name: "Loyalty Program", effects: [{ type: "shield", strength: 5, reliability: 8, priority: 5 }, { type: "slow", strength: 4, reliability: 7, priority: 4 }] },
          { key: "r", name: "Hostile Takeover", effects: [{ type: "anti-engage", subtype: "berserk-wave", strength: 9, reliability: 7, priority: 10 }, { type: "zone-control", strength: 8, reliability: 7, priority: 8 }] },
        ],
        ccProfile: { hard: 6, lockdown: 6 },
        special: { displacement: 5 },
        threatProfile: { zoneThreat: 8 },
      },
    },
  },
});
