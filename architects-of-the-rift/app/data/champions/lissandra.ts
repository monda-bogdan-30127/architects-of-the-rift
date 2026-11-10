import { createChampion } from "./_helpers";

export const lissandra = createChampion({
  id: "lissandra",
  name: "Lissandra",
  image: "/champions/lissandra.png",
  roles: ["mid"],
  damageProfile: ["AP"],
  attackType: "ranged",

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

  roleData: {
    mid: {
      goodVs: [
        { championId: "akali", level: 2, phase: "all", note: "Point-click CC (R) on an assassin, even in shroud" },
        { championId: "ekko", level: 2, phase: "all", note: "Point-click CC on an assassin" },
        { championId: "katarina", level: 2, phase: "all", note: "Point-click CC interrupts Katarina's R" },
        { championId: "leblanc", level: 2, phase: "all", note: "Point-click CC on LeBlanc" },
        { championId: "locke", level: 2, phase: "all", note: "Point-click CC and self-cast R stop the all-in" },
        { championId: "talon", level: 2, phase: "all", note: "Point-click CC on an assassin" },
        { championId: "yasuo", level: 2, phase: "all", note: "Point-click CC on a champion who lives on dashes" },
        { championId: "zed", level: 2, phase: "all", note: "Self-cast R negates Zed's all-in" },
      ],
      stats: {
        picks: 2,
        bans: null,
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
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
