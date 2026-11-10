import { createChampion } from "./_helpers";

export const skarner = createChampion({
  id: "skarner",
  name: "Skarner",
  image: "/champions/skarner.png",
  roles: ["jungle"],
  damageProfile: ["AD", "AP"],
  attackType: "melee",

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

  roleData: {
    jungle: {
      goodVs: [
        { championId: "master-yi", level: 2, phase: "all", note: "Point-click R (suppression) on an auto-attack champion" },
        { championId: "rengar", level: 2, phase: "all", note: "Tank with suppression; can't be one-shot" },
      ],
      stats: {
        picks: 4,
        bans: null,
        presence: 15,
        prioScore: 15,
        wins: 1,
        losses: 3,
        proWinRate: 25,
        kda: 2.1,
        avgBanTurn: null,
        avgPickRound: 2.25,
        blindPickRate: 0,
        averageGameTime: "32:55",
        csPerMinute: 6.4,
        damagePerMinute: 319,
        goldPerMinute: 340,
        csDiffAt15: -11.5,
        goldDiffAt15: -446,
        xpDiffAt15: -554,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
