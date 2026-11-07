import { createChampion } from "./_helpers";

export const vi = createChampion({
  id: "vi",
  name: "Vi",
  image: "/champions/vi.png",
  roles: ["jungle"],
  damageProfile: ["AD"],

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

  stats: {
    picks: 15,
    bans: 42,
    presence: 57,
    prioScore: 70,
    wins: 10,
    losses: 5,
    proWinRate: 67,
    kda: 3.3,
    avgBanTurn: 3.8,
    avgPickRound: 1.53,
    blindPickRate: 78.6,
    averageGameTime: "31:14",
    csPerMinute: 7.5,
    damagePerMinute: 317,
    goldPerMinute: 400,
    csDiffAt15: 4.2,
    goldDiffAt15: -47,
    xpDiffAt15: 119,
    soloqKrChallengerWinRate: 55.57,
  },

  roleData: {
    jungle: {
      goodVs: [],
      weakVs: [
        { championId: "poppy", level: 2, phase: "all", note: "W oprește Q-ul lui Vi" },
        { championId: "maokai", level: 2, phase: "late" },
        { championId: "khazix", level: 2, phase: "lane" },
        { championId: "skarner", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
  },
});
