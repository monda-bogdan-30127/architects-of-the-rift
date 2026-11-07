import { createChampion } from "./_helpers";

export const lissandra = createChampion({
  id: "lissandra",
  name: "Lissandra",
  image: "/champions/lissandra.png",
  roles: ["mid"],
  damageProfile: ["AP"],

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
        { championId: "akali", level: 2, phase: "all", note: "CC point-click (R) pe un asasin, chiar și în shroud" },
        { championId: "ekko", level: 2, phase: "all", note: "CC point-click pe un asasin" },
        { championId: "katarina", level: 2, phase: "all", note: "CC point-click întrerupe R-ul Katarinei" },
        { championId: "leblanc", level: 2, phase: "all", note: "CC point-click pe LeBlanc" },
        { championId: "locke", level: 2, phase: "all", note: "CC point-click și R pe sine opresc all-in-ul" },
        { championId: "talon", level: 2, phase: "all", note: "CC point-click pe un asasin" },
        { championId: "yasuo", level: 2, phase: "all", note: "CC point-click pe un campion care trăiește din dash-uri" },
        { championId: "zed", level: 2, phase: "all", note: "R pe sine anulează all-in-ul lui Zed" },
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
