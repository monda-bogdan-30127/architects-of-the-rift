import { createChampion } from "./_helpers";

export const nautilus = createChampion({
  id: "nautilus",
  name: "Nautilus",
  image: "/champions/nautilus.png",
  roles: ["support"],
  damageProfile: ["AP"],
  attackType: "melee",

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

  roleData: {
    support: {
      goodVs: [
        { championId: "lux", level: 2, phase: "all", note: "Hook and point-click CC on an immobile support" },
        { championId: "heimerdinger", level: 2, phase: "lane" },
        { championId: "lulu", level: 2, phase: "lane" },
        { championId: "senna", level: 2, phase: "lane" },
        { championId: "seraphine", level: 2, phase: "lane" },
        { championId: "sona", level: 2, phase: "lane" },
        { championId: "soraka", level: 2, phase: "lane" },
        { championId: "velkoz", level: 2, phase: "lane" },
        { championId: "yuumi", level: 2, phase: "lane" },
        { championId: "zyra", level: 2, phase: "lane" },
      ],
      stats: {
        picks: 23,
        bans: null,
        presence: 37,
        prioScore: 39,
        wins: 15,
        losses: 8,
        proWinRate: 65,
        kda: 3,
        avgBanTurn: null,
        avgPickRound: 1.35,
        blindPickRate: 60.9,
        averageGameTime: "32:46",
        csPerMinute: 1.2,
        damagePerMinute: 142,
        goldPerMinute: 255,
        csDiffAt15: 2.7,
        goldDiffAt15: -12,
        xpDiffAt15: -78,
        soloqKrChallengerWinRate: null,
      },
    },
  },
});
