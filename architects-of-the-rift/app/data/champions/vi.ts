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
      stats: {
        picks: 15,
        bans: null,
        presence: 67,
        prioScore: 73,
        wins: 10,
        losses: 5,
        proWinRate: 67,
        kda: 3.3,
        avgBanTurn: null,
        avgPickRound: 1.53,
        blindPickRate: 78.6,
        averageGameTime: "31:14",
        csPerMinute: 7.5,
        damagePerMinute: 317,
        goldPerMinute: 400,
        csDiffAt15: 4.2,
        goldDiffAt15: -47,
        xpDiffAt15: 119,
        soloqKrChallengerWinRate: null,
      },
      profile: {
        tags: ["melee", "dive", "engage", "pick", "ad"],
        abilities: [
          { key: "q", name: "Vault Breaker", effects: [{ type: "dash", strength: 8, reliability: 7, priority: 8 }, { type: "knockup", strength: 7, reliability: 7, priority: 7 }] },
          { key: "r", name: "Cease and Desist", effects: [{ type: "unstoppable", strength: 8, reliability: 9, priority: 9 }, { type: "knockup", subtype: "point-and-click-engage", strength: 10, reliability: 10, priority: 10 }, { type: "pick", subtype: "carry-lock", strength: 10, reliability: 10, priority: 10 }, { type: "setup", subtype: "carry-isolation", strength: 10, reliability: 10, priority: 10 }] },
        ],
        special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 2 },
        accessProfile: { engageRange: 8, targetAccess: 10, stickiness: 8 },
        threatProfile: { backlineThreat: 10, frontlineThreat: 5, pickThreat: 10, zoneThreat: 3, antiDiveThreat: 2 },
        phaseIdentity: { earlyRole: "pick", midRole: "carry", lateRole: "pick" },
        conditions: { requiresFollowUp: true },
        comboDependency: { needsFollowUp: 8, needsPeel: 4 },
      },
    },
  },
});
