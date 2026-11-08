import { createChampion } from "./_helpers";

export const annie = createChampion({
  id: "annie",
  name: "Annie",
  image: "/champions/annie.png",
  roles: ["mid"],
  damageProfile: ["AP"],
  attackType: "ranged",

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

  roleData: {
    mid: {
      goodVs: [
        { championId: "irelia", level: 2, phase: "all", note: "stun point-click pe un campion care trebuie să intre" },
        { championId: "yasuo", level: 2, phase: "all", note: "stun point-click pe un campion care trebuie să intre în ea" },
        { championId: "yone", level: 2, phase: "all", note: "stun point-click pe un campion care trebuie să intre în ea" },
        { championId: "akali", level: 1, phase: "all" },
      ],
      stats: {
        picks: 6,
        bans: null,
        presence: 8,
        prioScore: 6,
        wins: 4,
        losses: 2,
        proWinRate: 67,
        kda: 6.2,
        avgBanTurn: null,
        avgPickRound: 2.5,
        blindPickRate: 66.7,
        averageGameTime: "36:07",
        csPerMinute: 7.8,
        damagePerMinute: 736,
        goldPerMinute: 384,
        csDiffAt15: 3.7,
        goldDiffAt15: 131,
        xpDiffAt15: 48,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
