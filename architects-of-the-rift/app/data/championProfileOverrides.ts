import type { ChampionRoleProfile, Role } from "@/app/types/champion";

type RoleOverrideKey = `${string}:${Role}`;
export type ChampionRoleProfileOverride = {
  [K in keyof ChampionRoleProfile]?: ChampionRoleProfile[K] extends readonly unknown[]
    ? ChampionRoleProfile[K]
    : ChampionRoleProfile[K] extends unknown[]
      ? ChampionRoleProfile[K]
      : ChampionRoleProfile[K] extends object
        ? Partial<ChampionRoleProfile[K]>
        : ChampionRoleProfile[K];
};

export const championProfileOverrides: Record<RoleOverrideKey, ChampionRoleProfileOverride> = {
  "zeri:adc": {
    tags: ["ranged", "backline", "dps", "primary-carry", "front-to-back", "teamfight", "ad"],
    abilities: [
      { key: "q", name: "Burst Fire", effects: [{ type: "dps", subtype: "main-pattern", strength: 9, reliability: 7, priority: 9 }] },
      { key: "w", name: "Ultrashock Laser", effects: [{ type: "poke", strength: 5, reliability: 5, priority: 5 }] },
      { key: "e", name: "Spark Surge", effects: [{ type: "dash", strength: 7, reliability: 7, priority: 7 }, { type: "mobility", subtype: "repositioning", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Lightning Crash", effects: [{ type: "dps", subtype: "extended-fight", strength: 9, reliability: 8, priority: 9 }, { type: "zone-control", subtype: "teamfight-threat-space", strength: 6, reliability: 7, priority: 6 }] },
    ],
    accessProfile: { engageRange: 2, targetAccess: 5, stickiness: 7 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 9, pickThreat: 2, zoneThreat: 5, antiDiveThreat: 1 },
    phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
    conditions: { requiresFrontline: true, requiresPeel: true },
    comboDependency: { needsFrontline: 8, needsPeel: 9, needsEnchanter: 7 },
  },
  "veigar:mid": {
    tags: ["ranged", "control", "burst", "pick", "zone-control", "ap"],
    abilities: [
      { key: "w", name: "Dark Matter", effects: [{ type: "burst", strength: 9, reliability: 5, priority: 9 }] },
      { key: "e", name: "Event Horizon", effects: [{ type: "zone-control", subtype: "cage", strength: 10, reliability: 8, priority: 10 }, { type: "stun", subtype: "edge-contact", strength: 9, reliability: 7, priority: 9 }, { type: "anti-engage", subtype: "area-denial", strength: 9, reliability: 8, priority: 9 }] },
      { key: "r", name: "Primordial Burst", effects: [{ type: "execute", strength: 9, reliability: 9, priority: 9 }, { type: "burst", strength: 10, reliability: 9, priority: 10 }] },
    ],
    accessProfile: { engageRange: 0, targetAccess: 3, stickiness: 2 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 7, pickThreat: 9, zoneThreat: 10, antiDiveThreat: 7 },
    phaseIdentity: { earlyRole: "utility", midRole: "pick", lateRole: "carry" },
  },
  "orianna:mid": {
    tags: ["ranged", "control", "teamfight", "follow-up", "ap", "secondary-carry"],
    abilities: [
      { key: "q", name: "Command: Attack", effects: [{ type: "poke", strength: 6, reliability: 8, priority: 6 }, { type: "setup", subtype: "ball-placement", strength: 8, reliability: 9, priority: 8 }] },
      { key: "e", name: "Command: Protect", effects: [{ type: "shield", strength: 7, reliability: 9, priority: 7 }, { type: "setup", subtype: "carry-protection", strength: 5, reliability: 8, priority: 5 }] },
      { key: "r", name: "Command: Shockwave", effects: [{ type: "displacement", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "aoe-follow-up", strength: 10, reliability: 8, priority: 10 }, { type: "burst", subtype: "teamfight-swing", strength: 8, reliability: 8, priority: 8 }] },
    ],
    accessProfile: { engageRange: 7, targetAccess: 4, stickiness: 2 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 7, pickThreat: 6, zoneThreat: 8, antiDiveThreat: 5 },
    phaseIdentity: { earlyRole: "utility", midRole: "setup", lateRole: "carry" },
  },
  "bard:support": {
    tags: ["ranged", "pick", "utility", "zone-control", "roam"],
    abilities: [
      { key: "q", name: "Cosmic Binding", effects: [{ type: "stun", strength: 8, reliability: 6, priority: 8 }, { type: "setup", subtype: "catch", strength: 8, reliability: 6, priority: 8 }] },
      { key: "e", name: "Magical Journey", effects: [{ type: "mobility", subtype: "team-portal", strength: 8, reliability: 8, priority: 8 }, { type: "setup", subtype: "flank-access", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Tempered Fate", effects: [{ type: "zone-control", subtype: "stasis", strength: 10, reliability: 8, priority: 10 }, { type: "anti-engage", subtype: "fight-pause", strength: 10, reliability: 8, priority: 10 }, { type: "setup", subtype: "objective-control", strength: 10, reliability: 8, priority: 10 }] },
    ],
    accessProfile: { engageRange: 7, targetAccess: 6, stickiness: 3 },
    threatProfile: { backlineThreat: 6, frontlineThreat: 4, pickThreat: 9, zoneThreat: 10, antiDiveThreat: 8 },
    phaseIdentity: { earlyRole: "utility", midRole: "pick", lateRole: "zone-control" },
  },
  "braum:support": {
    tags: ["ranged", "warden", "peel", "anti-dive", "front-to-back"],
    abilities: [
      { key: "passive", name: "Concussive Blows", effects: [{ type: "mark", subtype: "ally-proc-cc", strength: 9, reliability: 9, priority: 9 }] },
      { key: "e", name: "Unbreakable", effects: [{ type: "projectile-block", strength: 10, reliability: 9, priority: 10 }, { type: "anti-engage", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Glacial Fissure", effects: [{ type: "knockup", strength: 8, reliability: 8, priority: 8 }, { type: "slow", strength: 7, reliability: 9, priority: 7 }] },
    ],
    special: { antiDash: 0, projectileBlock: 10, ground: 0, displacement: 6, visionControl: 4 },
    accessProfile: { engageRange: 5, targetAccess: 3, stickiness: 4 },
    threatProfile: { backlineThreat: 2, frontlineThreat: 5, pickThreat: 5, zoneThreat: 5, antiDiveThreat: 10 },
    phaseIdentity: { earlyRole: "peel", midRole: "peel", lateRole: "peel" },
  },
   "ksante:top": {
    tags: ["melee", "frontline", "warden", "tank", "anti-dive", "blindable"],
    abilities: [
      { key: "q", name: "Ntofo Strikes", effects: [{ type: "slow", strength: 6, reliability: 8, priority: 6 }, { type: "knockup", subtype: "3rd-cast", strength: 7, reliability: 7, priority: 7 }] },
      { key: "w", name: "Path Maker", effects: [{ type: "unstoppable", strength: 7, reliability: 8, priority: 8 }, { type: "displacement", subtype: "charged-push", strength: 8, reliability: 7, priority: 8 }] },
      { key: "e", name: "Footwork", effects: [{ type: "dash", strength: 6, reliability: 8, priority: 6 }, { type: "shield", strength: 6, reliability: 8, priority: 6 }] },
      { key: "r", name: "All Out", effects: [{ type: "displacement", subtype: "isolation", strength: 10, reliability: 9, priority: 10 }, { type: "burst", subtype: "all-in-window", strength: 8, reliability: 7, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 10, visionControl: 2 },
    accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 8 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 7, zoneThreat: 6, antiDiveThreat: 9 },
    phaseIdentity: { earlyRole: "tank", midRole: "peel", lateRole: "tank" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
  },

  "rumble:top": {
    tags: ["ranged", "ap", "zone-control", "teamfight", "lane-priority"],
    abilities: [
      { key: "q", name: "Flamespitter", effects: [{ type: "dps", subtype: "close-range-cone", strength: 8, reliability: 8, priority: 8 }] },
      { key: "e", name: "Electro Harpoon", effects: [{ type: "slow", strength: 6, reliability: 8, priority: 6 }, { type: "poke", strength: 5, reliability: 7, priority: 5 }] },
      { key: "r", name: "The Equalizer", effects: [{ type: "zone-control", subtype: "teamfight-line", strength: 10, reliability: 8, priority: 10 }, { type: "slow", subtype: "aoe", strength: 8, reliability: 9, priority: 8 }, { type: "burst", subtype: "wombo-follow-up", strength: 8, reliability: 8, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 2 },
    accessProfile: { engageRange: 7, targetAccess: 5, stickiness: 5 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 8, pickThreat: 4, zoneThreat: 10, antiDiveThreat: 4 },
    phaseIdentity: { earlyRole: "carry", midRole: "zone-control", lateRole: "utility" },
    conditions: { requiresFrontline: true, requiresEngage: true, requiresPeel: true },
    comboDependency: { needsEngage: 8, needsFrontline: 7, needsPeel: 4 },
  },

  "sion:top": {
    tags: ["melee", "frontline", "tank", "engage", "weakside", "waveclear"],
    abilities: [
      { key: "q", name: "Decimating Smash", effects: [{ type: "knockup", subtype: "charged-aoe", strength: 8, reliability: 6, priority: 8 }, { type: "burst", strength: 6, reliability: 6, priority: 6 }] },
      { key: "e", name: "Roar of the Slayer", effects: [{ type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "poke", strength: 4, reliability: 7, priority: 4 }] },
      { key: "r", name: "Unstoppable Onslaught", effects: [{ type: "unstoppable", strength: 9, reliability: 8, priority: 9 }, { type: "knockup", subtype: "long-range-engage", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "fight-start", strength: 9, reliability: 8, priority: 9 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 1 },
    accessProfile: { engageRange: 9, targetAccess: 5, stickiness: 4 },
    threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 6, zoneThreat: 6, antiDiveThreat: 7 },
    phaseIdentity: { earlyRole: "tank", midRole: "setup", lateRole: "tank" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
  },

  "renekton:top": {
    tags: ["melee", "bruiser", "lane-bully", "setup", "early-game"],
    abilities: [
      { key: "w", name: "Ruthless Predator", effects: [{ type: "stun", strength: 7, reliability: 9, priority: 7 }, { type: "burst", subtype: "targeted-trade", strength: 7, reliability: 9, priority: 7 }] },
      { key: "e", name: "Slice and Dice", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "mobility", subtype: "double-dash-window", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Dominus", effects: [{ type: "dps", subtype: "extended-fight", strength: 6, reliability: 8, priority: 6 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
    accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 7, pickThreat: 7, zoneThreat: 4, antiDiveThreat: 4 },
    phaseIdentity: { earlyRole: "carry", midRole: "setup", lateRole: "utility" },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
  },

  "ambessa:top": {
    tags: ["melee", "diver", "carry", "skirmish", "snowball"],
    abilities: [
      { key: "q", name: "Cunning Sweep / Sundering Slam", effects: [{ type: "burst", strength: 7, reliability: 7, priority: 7 }, { type: "slow", strength: 4, reliability: 7, priority: 4 }] },
      { key: "e", name: "Public Execution", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "mobility", subtype: "target-stick", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Shadow Hunt", effects: [{ type: "dash", subtype: "backline-commit", strength: 10, reliability: 8, priority: 10 }, { type: "burst", subtype: "carry-assassination-window", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "dive-start", strength: 7, reliability: 7, priority: 7 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 2, visionControl: 1 },
    accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 8 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 7, pickThreat: 6, zoneThreat: 4, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
    conditions: { requiresFrontline: true, requiresPeel: true, requiresFollowUp: true },
    comboDependency: { needsFrontline: 6, needsPeel: 5, needsEngage: 0 },
  },

  "gnar:top": {
    tags: ["ranged", "teamfight", "engage", "weakside", "blindable"],
    abilities: [
      { key: "q", name: "Boomerang Throw / Boulder Toss", effects: [{ type: "poke", strength: 6, reliability: 8, priority: 6 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }] },
      { key: "e", name: "Hop / Crunch", effects: [{ type: "dash", strength: 6, reliability: 8, priority: 6 }, { type: "setup", subtype: "mega-gnar-entry", strength: 6, reliability: 7, priority: 6 }] },
      { key: "r", name: "GNAR!", effects: [{ type: "displacement", subtype: "wall-slam", strength: 10, reliability: 7, priority: 10 }, { type: "stun", subtype: "multi-target", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "wombo", strength: 10, reliability: 7, priority: 10 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 10, visionControl: 1 },
    accessProfile: { engageRange: 7, targetAccess: 6, stickiness: 5 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 6, pickThreat: 5, zoneThreat: 8, antiDiveThreat: 7 },
    phaseIdentity: { earlyRole: "secondary-carry", midRole: "setup", lateRole: "utility" },
    conditions: { requiresEngage: true, requiresFollowUp: true },
    comboDependency: { needsEngage: 4, needsFrontline: 0, needsPeel: 0 },
  },

  "gwen:top": {
    tags: ["melee", "ap", "duelist", "scaling", "frontline-killer"],
    abilities: [
      { key: "q", name: "Snip Snip!", effects: [{ type: "burst", subtype: "center-hit", strength: 7, reliability: 7, priority: 7 }, { type: "dps", strength: 8, reliability: 8, priority: 8 }] },
      { key: "w", name: "Hallowed Mist", effects: [{ type: "anti-engage", subtype: "outside-target-denial", strength: 8, reliability: 8, priority: 8 }] },
      { key: "e", name: "Skip 'n Slash", effects: [{ type: "dash", strength: 6, reliability: 8, priority: 6 }, { type: "mobility", subtype: "duel-stickiness", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Needlework", effects: [{ type: "poke", strength: 6, reliability: 7, priority: 6 }, { type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "dps", subtype: "extended-fight-finisher", strength: 8, reliability: 7, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
    accessProfile: { engageRange: 5, targetAccess: 7, stickiness: 7 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 10, pickThreat: 2, zoneThreat: 4, antiDiveThreat: 2 },
    phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
    conditions: { requiresFrontline: true, requiresEngage: true, requiresPeel: true },
    comboDependency: { needsFrontline: 7, needsPeel: 5, needsEngage: 6 },
  },

  "zaahen:top": {
    tags: ["melee", "fighter", "assassin", "snowball", "skirmish"],
    abilities: [
      { key: "q", name: "Zaahen Q", effects: [{ type: "burst", strength: 8, reliability: 7, priority: 8 }] },
      { key: "e", name: "Zaahen E", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "mobility", subtype: "reset-positioning", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Zaahen R", effects: [{ type: "burst", subtype: "all-in-finisher", strength: 9, reliability: 7, priority: 9 }, { type: "execute", strength: 6, reliability: 7, priority: 6 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 1, visionControl: 1 },
    accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 8 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 6, pickThreat: 7, zoneThreat: 3, antiDiveThreat: 2 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "pick" },
    conditions: { requiresFrontline: true, requiresPeel: true },
    comboDependency: { needsFrontline: 6, needsPeel: 5, needsEngage: 0 },
  },

  "ornn:top": {
    tags: ["melee", "frontline", "engage", "tank", "teamfight", "weakside"],
    abilities: [
      { key: "q", name: "Volcanic Rupture", effects: [{ type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "zone-control", subtype: "pillar", strength: 5, reliability: 7, priority: 5 }] },
      { key: "e", name: "Searing Charge", effects: [{ type: "dash", strength: 5, reliability: 7, priority: 5 }, { type: "knockup", subtype: "terrain-combo", strength: 8, reliability: 7, priority: 8 }] },
      { key: "r", name: "Call of the Forge God", effects: [{ type: "knockup", subtype: "long-range-engage", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "teamfight-start", strength: 9, reliability: 8, priority: 9 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 1 },
    accessProfile: { engageRange: 8, targetAccess: 5, stickiness: 5 },
    threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 6, zoneThreat: 6, antiDiveThreat: 7 },
    phaseIdentity: { earlyRole: "tank", midRole: "setup", lateRole: "tank" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
  },

  "aatrox:top": {
    tags: ["melee", "drain-fighter", "skirmish", "teamfight", "blindable"],
    abilities: [
      { key: "q", name: "The Darkin Blade", effects: [{ type: "burst", strength: 7, reliability: 6, priority: 7 }, { type: "knockup", subtype: "sweetspot", strength: 6, reliability: 6, priority: 6 }] },
      { key: "w", name: "Infernal Chains", effects: [{ type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "pick", subtype: "pullback-zone", strength: 6, reliability: 6, priority: 6 }] },
      { key: "e", name: "Umbral Dash", effects: [{ type: "dash", strength: 5, reliability: 8, priority: 5 }, { type: "heal", subtype: "self-sustain", strength: 6, reliability: 8, priority: 6 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
    accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 5, zoneThreat: 6, antiDiveThreat: 5 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
    conditions: { requiresPeel: true },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 4 },
  },

  "jax:top": {
    tags: ["melee", "duelist", "scaling", "splitpush", "diver"],
    abilities: [
      { key: "q", name: "Leap Strike", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }] },
      { key: "e", name: "Counter Strike", effects: [{ type: "anti-engage", subtype: "auto-attack-denial", strength: 8, reliability: 8, priority: 8 }, { type: "stun", strength: 6, reliability: 8, priority: 6 }] },
      { key: "r", name: "Grandmaster-At-Arms", effects: [{ type: "dps", subtype: "extended-fight-scaling", strength: 8, reliability: 8, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
    accessProfile: { engageRange: 6, targetAccess: 8, stickiness: 8 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 8, pickThreat: 5, zoneThreat: 3, antiDiveThreat: 4 },
    phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
    conditions: { requiresFrontline: true, requiresPeel: true },
    comboDependency: { needsEngage: 0, needsFrontline: 5, needsPeel: 4 },
  },

  "reksai:top": {
    tags: ["melee", "lane-bully", "pick", "ad-bruiser", "skirmish"],
    abilities: [
      { key: "q", name: "Queen's Wrath / Prey Seeker", effects: [{ type: "dps", strength: 6, reliability: 8, priority: 6 }, { type: "poke", subtype: "burrowed", strength: 4, reliability: 7, priority: 4 }] },
      { key: "w", name: "Burrow / Un-burrow", effects: [{ type: "knockup", strength: 7, reliability: 8, priority: 7 }, { type: "vision", subtype: "tremor-sense", strength: 6, reliability: 9, priority: 6 }] },
      { key: "e", name: "Tunnel / Furious Bite", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "burst", subtype: "true-damage-finisher", strength: 8, reliability: 8, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 5, visionControl: 6 },
    accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 6 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 7, pickThreat: 7, zoneThreat: 4, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "utility" },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
  },

  "aurora:top": {
    tags: ["ranged", "ap", "skirmish", "zone-control", "carry"],
    abilities: [
      { key: "q", name: "Aurora Q", effects: [{ type: "poke", strength: 6, reliability: 7, priority: 6 }, { type: "burst", subtype: "return-hit", strength: 7, reliability: 6, priority: 7 }] },
      { key: "w", name: "Aurora W", effects: [{ type: "mobility", subtype: "phase-shift", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Aurora R", effects: [{ type: "zone-control", subtype: "arena", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "fight-trap", strength: 8, reliability: 8, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 2, visionControl: 2 },
    accessProfile: { engageRange: 7, targetAccess: 7, stickiness: 5 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 6, pickThreat: 5, zoneThreat: 9, antiDiveThreat: 4 },
    phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "carry" },
    conditions: { requiresFrontline: true, requiresEngage: true, requiresPeel: true },
    comboDependency: { needsEngage: 5, needsFrontline: 6, needsPeel: 4 },
  },

  "yorick:top": {
    tags: ["melee", "splitpush", "side-lane", "structure-damage"],
    abilities: [
      { key: "q", name: "Last Rites", effects: [{ type: "dps", subtype: "extended-side-lane", strength: 7, reliability: 8, priority: 7 }] },
      { key: "w", name: "Dark Procession", effects: [{ type: "zone-control", subtype: "cage", strength: 6, reliability: 7, priority: 6 }] },
      { key: "e", name: "Mourning Mist", effects: [{ type: "slow", strength: 4, reliability: 7, priority: 4 }, { type: "setup", subtype: "ghoul-chase", strength: 5, reliability: 8, priority: 5 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
    accessProfile: { engageRange: 4, targetAccess: 5, stickiness: 6 },
    threatProfile: { backlineThreat: 5, frontlineThreat: 8, pickThreat: 3, zoneThreat: 4, antiDiveThreat: 2 },
    phaseIdentity: { earlyRole: "utility", midRole: "carry", lateRole: "carry" },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
  },

  "kennen:top": {
    tags: ["ranged", "ap", "teamfight", "flank", "wombo"],
    abilities: [
      { key: "q", name: "Thundering Shuriken", effects: [{ type: "poke", strength: 5, reliability: 7, priority: 5 }] },
      { key: "e", name: "Lightning Rush", effects: [{ type: "dash", subtype: "flank-entry", strength: 7, reliability: 8, priority: 7 }, { type: "mobility", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Slicing Maelstrom", effects: [{ type: "stun", subtype: "multi-target", strength: 8, reliability: 8, priority: 8 }, { type: "zone-control", subtype: "aoe-lockdown", strength: 9, reliability: 8, priority: 9 }, { type: "burst", subtype: "teamfight-spike", strength: 8, reliability: 7, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
    accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 5 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 6, pickThreat: 4, zoneThreat: 9, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "secondary-carry", midRole: "carry", lateRole: "utility" },
    conditions: { requiresEngage: true, requiresFollowUp: true },
    comboDependency: { needsEngage: 7, needsFrontline: 0, needsPeel: 0 },
  },

  "jayce:top": {
    tags: ["ranged", "ad", "poke", "lane-priority", "siege"],
    abilities: [
      { key: "q", name: "Shock Blast / To the Skies!", effects: [{ type: "poke", subtype: "accelerated-blast", strength: 9, reliability: 7, priority: 9 }, { type: "burst", strength: 7, reliability: 7, priority: 7 }] },
      { key: "e", name: "Thundering Blow / Acceleration Gate", effects: [{ type: "displacement", subtype: "self-peel-knockback", strength: 6, reliability: 8, priority: 6 }, { type: "setup", subtype: "poke-enable", strength: 8, reliability: 9, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 1 },
    accessProfile: { engageRange: 8, targetAccess: 6, stickiness: 4 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 6, pickThreat: 5, zoneThreat: 7, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
    conditions: { requiresFrontline: true, requiresPeel: true },
    comboDependency: { needsEngage: 0, needsFrontline: 5, needsPeel: 4 },
  },
  "xin-zhao:jungle": {
    tags: ["melee", "dive", "burst", "skirmish", "primary-carry", "ad"],
    abilities: [
      { key: "q", name: "Three Talon Strike", effects: [{ type: "dps", strength: 6, reliability: 8, priority: 6 }, { type: "knockup", subtype: "3-hit-conditional", strength: 7, reliability: 7, priority: 7 }] },
      { key: "e", name: "Audacious Charge", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "setup", subtype: "backline-entry", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Crescent Guard", effects: [{ type: "zone-control", subtype: "carry-space-creation", strength: 8, reliability: 8, priority: 8 }, { type: "anti-engage", subtype: "outer-threat-denial", strength: 7, reliability: 7, priority: 7 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 5, visionControl: 4 },
    accessProfile: { engageRange: 7, targetAccess: 9, stickiness: 8 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 6, pickThreat: 7, zoneThreat: 5, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "utility" },
    conditions: { requiresPeel: true },
    comboDependency: { needsEnchanter: 7, needsPeel: 6 },
  },

  "jarvan-iv:jungle": {
    tags: ["melee", "engage", "dive", "setup", "teamfight", "ad"],
    abilities: [
      { key: "q", name: "Dragon Strike", effects: [{ type: "poke", strength: 4, reliability: 7, priority: 4 }, { type: "setup", subtype: "flag-combo", strength: 7, reliability: 8, priority: 7 }] },
      { key: "e", name: "Demacian Standard", effects: [{ type: "setup", subtype: "combo-anchor", strength: 8, reliability: 9, priority: 8 }] },
      { key: "r", name: "Cataclysm", effects: [{ type: "pick", subtype: "carry-isolation", strength: 9, reliability: 9, priority: 9 }, { type: "zone-control", subtype: "terrain-cage", strength: 8, reliability: 8, priority: 8 }, { type: "setup", subtype: "follow-up-window", strength: 9, reliability: 9, priority: 9 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 2 },
    accessProfile: { engageRange: 8, targetAccess: 8, stickiness: 7 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 6, pickThreat: 9, zoneThreat: 8, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "setup", midRole: "pick", lateRole: "utility" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsFollowUp: 8, needsEngage: 0, needsFrontline: 0 },
  },

  "wukong:jungle": {
    tags: ["melee", "dive", "teamfight", "engage", "ad"],
    abilities: [
      { key: "w", name: "Warrior Trickster", effects: [{ type: "mobility", subtype: "stealth-reposition", strength: 7, reliability: 8, priority: 7 }] },
      { key: "e", name: "Nimbus Strike", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "dps", subtype: "entry-damage", strength: 6, reliability: 8, priority: 6 }] },
      { key: "r", name: "Cyclone", effects: [{ type: "knockup", subtype: "aoe-teamfight", strength: 9, reliability: 8, priority: 9 }, { type: "dps", subtype: "extended-spin", strength: 7, reliability: 8, priority: 7 }, { type: "setup", subtype: "wombo", strength: 9, reliability: 8, priority: 9 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 2 },
    accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 7 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 7, pickThreat: 6, zoneThreat: 8, antiDiveThreat: 4 },
    phaseIdentity: { earlyRole: "carry", midRole: "setup", lateRole: "utility" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsFollowUp: 7, needsEngage: 0, needsFrontline: 0 },
  },

  "vi:jungle": {
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

  "pantheon:jungle": {
    tags: ["melee", "burst", "pick", "early-game", "semi-global", "ad"],
    abilities: [
      { key: "w", name: "Shield Vault", effects: [{ type: "stun", strength: 8, reliability: 10, priority: 8 }, { type: "pick", subtype: "targeted-catch", strength: 8, reliability: 10, priority: 8 }] },
      { key: "e", name: "Aegis Assault", effects: [{ type: "anti-engage", subtype: "front-facing-block", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Grand Starfall", effects: [{ type: "mobility", subtype: "map-roam", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "cross-map-collapse", strength: 8, reliability: 8, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 3 },
    accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 6 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 5, pickThreat: 9, zoneThreat: 4, antiDiveThreat: 4 },
    phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "utility" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsFollowUp: 6 },
  },

  "dr-mundo:jungle": {
    tags: ["melee", "frontline", "tank", "stat-check", "anti-poke"],
    abilities: [
      { key: "q", name: "Infected Bonesaw", effects: [{ type: "slow", strength: 7, reliability: 8, priority: 7 }, { type: "poke", strength: 5, reliability: 8, priority: 5 }] },
      { key: "e", name: "Blunt Force Trauma", effects: [{ type: "burst", strength: 6, reliability: 8, priority: 6 }] },
      { key: "r", name: "Maximum Dosage", effects: [{ type: "heal", subtype: "massive-self-sustain", strength: 10, reliability: 10, priority: 10 }, { type: "mobility", subtype: "run-down", strength: 6, reliability: 8, priority: 6 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 2 },
    accessProfile: { engageRange: 4, targetAccess: 5, stickiness: 7 },
    threatProfile: { backlineThreat: 5, frontlineThreat: 8, pickThreat: 3, zoneThreat: 3, antiDiveThreat: 6 },
    phaseIdentity: { earlyRole: "tank", midRole: "tank", lateRole: "tank" },
    conditions: { requiresEngage: true },
    comboDependency: { needsEngage: 7 } as any,
  },

  "nocturne:jungle": {
    tags: ["melee", "dive", "pick", "backline-access", "ad"],
    abilities: [
      { key: "q", name: "Duskbringer", effects: [{ type: "mobility", subtype: "trail-speed", strength: 6, reliability: 8, priority: 6 }] },
      { key: "w", name: "Shroud of Darkness", effects: [{ type: "anti-engage", subtype: "spell-shield", strength: 8, reliability: 8, priority: 8 }] },
      { key: "e", name: "Unspeakable Horror", effects: [{ type: "cc", subtype: "fear-delayed", strength: 7, reliability: 6, priority: 7 }] },
      { key: "r", name: "Paranoia", effects: [{ type: "dash", subtype: "global-dive", strength: 10, reliability: 9, priority: 10 }, { type: "pick", subtype: "backline-collapse", strength: 9, reliability: 9, priority: 9 }, { type: "setup", subtype: "darkness-engage", strength: 8, reliability: 9, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 4 },
    accessProfile: { engageRange: 10, targetAccess: 10, stickiness: 7 },
    threatProfile: { backlineThreat: 10, frontlineThreat: 4, pickThreat: 9, zoneThreat: 3, antiDiveThreat: 2 },
    phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "pick" },
    conditions: { requiresFollowUp: true, requiresPeel: true },
    comboDependency: { needsFollowUp: 6, needsPeel: 4 },
  },

  "aatrox:jungle": {
    tags: ["melee", "drain-fighter", "skirmish", "teamfight", "ad"],
    abilities: [
      { key: "q", name: "The Darkin Blade", effects: [{ type: "burst", strength: 7, reliability: 6, priority: 7 }, { type: "knockup", subtype: "sweetspot", strength: 6, reliability: 6, priority: 6 }] },
      { key: "w", name: "Infernal Chains", effects: [{ type: "slow", strength: 5, reliability: 7, priority: 5 }, { type: "setup", subtype: "pullback-zone", strength: 6, reliability: 6, priority: 6 }] },
      { key: "e", name: "Umbral Dash", effects: [{ type: "dash", strength: 5, reliability: 8, priority: 5 }, { type: "heal", subtype: "self-sustain", strength: 6, reliability: 8, priority: 6 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 1 },
    accessProfile: { engageRange: 6, targetAccess: 7, stickiness: 6 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 5, zoneThreat: 6, antiDiveThreat: 5 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
    conditions: { requiresPeel: true },
    comboDependency: { needsPeel: 4 },
  },

  "qiyana:jungle": {
    tags: ["melee", "assassin", "pick", "burst", "terrain-combo", "ad"],
    abilities: [
      { key: "q", name: "Elemental Wrath / Edge of Ixtal", effects: [{ type: "burst", strength: 8, reliability: 7, priority: 8 }, { type: "root", subtype: "river-empower", strength: 6, reliability: 6, priority: 6 }] },
      { key: "w", name: "Terrashape", effects: [{ type: "mobility", subtype: "element-access", strength: 7, reliability: 9, priority: 7 }] },
      { key: "e", name: "Audacity", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Supreme Display of Talent", effects: [{ type: "stun", subtype: "terrain-aoe", strength: 10, reliability: 7, priority: 10 }, { type: "burst", subtype: "teamfight-spike", strength: 9, reliability: 7, priority: 9 }, { type: "pick", subtype: "catch-on-wall", strength: 8, reliability: 7, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 2 },
    accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 7 },
    threatProfile: { backlineThreat: 10, frontlineThreat: 4, pickThreat: 9, zoneThreat: 8, antiDiveThreat: 1 },
    phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "pick" },
    conditions: { requiresFollowUp: true, requiresFrontline: true },
    comboDependency: { needsFollowUp: 6, needsFrontline: 4 },
  },

  "ambessa:jungle": {
    tags: ["melee", "diver", "carry", "skirmish", "snowball"],
    abilities: [
      { key: "q", name: "Cunning Sweep / Sundering Slam", effects: [{ type: "burst", strength: 7, reliability: 7, priority: 7 }, { type: "slow", strength: 4, reliability: 7, priority: 4 }] },
      { key: "e", name: "Public Execution", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "mobility", subtype: "target-stick", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Shadow Hunt", effects: [{ type: "dash", subtype: "backline-commit", strength: 10, reliability: 8, priority: 10 }, { type: "burst", subtype: "carry-assassination-window", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "dive-start", strength: 7, reliability: 7, priority: 7 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 2, visionControl: 1 },
    accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 8 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 7, pickThreat: 6, zoneThreat: 4, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "secondary-carry" },
    conditions: { requiresFrontline: true, requiresPeel: true, requiresFollowUp: true },
    comboDependency: { needsFrontline: 6, needsPeel: 5 },
  },

  "trundle:jungle": {
    tags: ["melee", "frontline-breaker", "anti-tank", "skirmish", "utility"],
    abilities: [
      { key: "e", name: "Pillar of Ice", effects: [{ type: "zone-control", subtype: "terrain-block", strength: 9, reliability: 9, priority: 9 }, { type: "displacement", subtype: "micro-knock", strength: 6, reliability: 8, priority: 6 }, { type: "pick", subtype: "path-cut", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Subjugate", effects: [{ type: "dps", subtype: "tank-drain", strength: 8, reliability: 9, priority: 8 }, { type: "anti-engage", subtype: "frontline-steal", strength: 7, reliability: 8, priority: 7 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 2 },
    accessProfile: { engageRange: 5, targetAccess: 5, stickiness: 8 },
    threatProfile: { backlineThreat: 4, frontlineThreat: 9, pickThreat: 7, zoneThreat: 8, antiDiveThreat: 5 },
    phaseIdentity: { earlyRole: "utility", midRole: "carry", lateRole: "utility" },
    conditions: { requiresEngage: true },
    comboDependency: { needsEngage: 5 },
  },

  "zaahen:jungle": {
    tags: ["melee", "fighter", "assassin", "snowball", "skirmish"],
    abilities: [
      { key: "q", name: "Zaahen Q", effects: [{ type: "burst", strength: 8, reliability: 7, priority: 8 }] },
      { key: "e", name: "Zaahen E", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "mobility", subtype: "reset-positioning", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Zaahen R", effects: [{ type: "burst", subtype: "all-in-finisher", strength: 9, reliability: 7, priority: 9 }, { type: "execute", strength: 6, reliability: 7, priority: 6 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 1, visionControl: 1 },
    accessProfile: { engageRange: 7, targetAccess: 8, stickiness: 8 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 6, pickThreat: 7, zoneThreat: 3, antiDiveThreat: 2 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "pick" },
    conditions: { requiresFrontline: true, requiresPeel: true },
    comboDependency: { needsFrontline: 6, needsPeel: 5 },
  },

  "malphite:jungle": {
    tags: ["melee", "frontline", "engage", "tank", "anti-ad"],
    abilities: [
      { key: "q", name: "Seismic Shard", effects: [{ type: "slow", strength: 7, reliability: 9, priority: 7 }, { type: "poke", strength: 4, reliability: 8, priority: 4 }] },
      { key: "e", name: "Ground Slam", effects: [{ type: "anti-engage", subtype: "attack-speed-cripple", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Unstoppable Force", effects: [{ type: "unstoppable", strength: 10, reliability: 10, priority: 10 }, { type: "knockup", subtype: "aoe-engage", strength: 10, reliability: 10, priority: 10 }, { type: "setup", subtype: "wombo-start", strength: 10, reliability: 10, priority: 10 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 8, visionControl: 1 },
    accessProfile: { engageRange: 10, targetAccess: 8, stickiness: 5 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 6, pickThreat: 7, zoneThreat: 8, antiDiveThreat: 7 },
    phaseIdentity: { earlyRole: "tank", midRole: "setup", lateRole: "tank" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsFollowUp: 8 },
  },

  "lee-sin:jungle": {
    tags: ["melee", "skirmish", "playmaker", "pick", "ad"],
    abilities: [
      { key: "q", name: "Sonic Wave / Resonating Strike", effects: [{ type: "poke", strength: 5, reliability: 7, priority: 5 }, { type: "dash", subtype: "targeted-follow", strength: 8, reliability: 8, priority: 8 }] },
      { key: "w", name: "Safeguard / Iron Will", effects: [{ type: "dash", subtype: "ward-hop", strength: 8, reliability: 8, priority: 8 }, { type: "shield", strength: 5, reliability: 8, priority: 5 }] },
      { key: "r", name: "Dragon's Rage", effects: [{ type: "displacement", subtype: "insec-kick", strength: 10, reliability: 7, priority: 10 }, { type: "pick", subtype: "kick-isolation", strength: 9, reliability: 7, priority: 9 }, { type: "setup", subtype: "carry-delivery", strength: 9, reliability: 7, priority: 9 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 10, visionControl: 3 },
    accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 6 },
    threatProfile: { backlineThreat: 8, frontlineThreat: 5, pickThreat: 10, zoneThreat: 4, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "utility" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsFollowUp: 7 },
  },

  "naafiri:jungle": {
    tags: ["melee", "assassin", "dive", "burst", "ad"],
    abilities: [
      { key: "w", name: "Hounds' Pursuit", effects: [{ type: "dash", subtype: "pack-engage", strength: 9, reliability: 8, priority: 9 }, { type: "pick", subtype: "backline-lock", strength: 7, reliability: 7, priority: 7 }] },
      { key: "e", name: "Eviscerate", effects: [{ type: "burst", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "The Call of the Pack", effects: [{ type: "mobility", subtype: "hunt-speed", strength: 8, reliability: 8, priority: 8 }, { type: "burst", subtype: "assassination-window", strength: 8, reliability: 8, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 0, visionControl: 2 },
    accessProfile: { engageRange: 8, targetAccess: 9, stickiness: 8 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 4, pickThreat: 8, zoneThreat: 3, antiDiveThreat: 1 },
    phaseIdentity: { earlyRole: "carry", midRole: "pick", lateRole: "pick" },
    conditions: { requiresFrontline: true, requiresPeel: true },
    comboDependency: { needsFrontline: 5, needsPeel: 4 },
  },

  "sejuani:jungle": {
    tags: ["melee", "frontline", "engage", "tank", "setup", "teamfight"],
    abilities: [
      { key: "passive", name: "Fury of the North", effects: [{ type: "mark", subtype: "melee-ally-proc", strength: 9, reliability: 9, priority: 8 }] },
      { key: "q", name: "Arctic Assault", effects: [{ type: "dash", strength: 6, reliability: 7, priority: 6 }, { type: "knockup", strength: 7, reliability: 7, priority: 7 }, { type: "setup", subtype: "engage-start", strength: 8, reliability: 7, priority: 8 }] },
      { key: "e", name: "Permafrost", effects: [{ type: "stun", subtype: "conditional-freeze", strength: 8, reliability: 8, priority: 8, conditions: ["requires-passive-stacks"] }] },
      { key: "r", name: "Glacial Prison", effects: [{ type: "stun", subtype: "long-range-pick", strength: 9, reliability: 8, priority: 9 }, { type: "slow", subtype: "aoe-follow-up", strength: 7, reliability: 9, priority: 7 }, { type: "setup", subtype: "teamfight-start", strength: 9, reliability: 8, priority: 9 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 7, visionControl: 3 },
    accessProfile: { engageRange: 8, targetAccess: 6, stickiness: 6 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 8, pickThreat: 8, zoneThreat: 6, antiDiveThreat: 7 },
    phaseIdentity: { earlyRole: "setup", midRole: "tank", lateRole: "setup" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsEngage: 0, needsFrontline: 0, needsPeel: 0 },
  },

  "poppy:jungle": {
    tags: ["melee", "frontline", "tank", "anti-dash", "engage", "utility", "teamfight"],
    abilities: [
      { key: "q", name: "Hammer Shock", effects: [{ type: "burst", strength: 6, reliability: 7, priority: 6 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "zone-control", subtype: "delayed-area-threat", strength: 6, reliability: 7, priority: 6 }] },
      { key: "w", name: "Steadfast Presence", effects: [{ type: "anti-dash", subtype: "area-denial", strength: 10, reliability: 9, priority: 10, counters: ["dash"] }, { type: "anti-engage", strength: 9, reliability: 9, priority: 9 }, { type: "zone-control", subtype: "anti-entry-zone", strength: 8, reliability: 9, priority: 8 }] },
      { key: "e", name: "Heroic Charge", effects: [{ type: "dash", strength: 6, reliability: 7, priority: 6 }, { type: "stun", subtype: "wall-conditional", strength: 8, reliability: 6, priority: 8, conditions: ["needs-terrain"] }, { type: "displacement", strength: 7, reliability: 7, priority: 7 }] },
      { key: "r", name: "Keeper's Verdict", effects: [{ type: "displacement", subtype: "fight-reset", strength: 10, reliability: 7, priority: 10 }, { type: "anti-engage", subtype: "deny-commit", strength: 9, reliability: 7, priority: 9 }, { type: "zone-control", subtype: "objective-space-control", strength: 8, reliability: 7, priority: 8 }] },
    ],
    special: { antiDash: 10, projectileBlock: 0, ground: 0, displacement: 9, visionControl: 3 },
    accessProfile: { engageRange: 6, targetAccess: 5, stickiness: 6 },
    threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 6, zoneThreat: 8, antiDiveThreat: 10 },
    phaseIdentity: { earlyRole: "utility", midRole: "tank", lateRole: "peel" },
  },

  "maokai:jungle": {
    tags: ["melee", "frontline", "engage", "tank", "vision", "utility"],
    abilities: [
      { key: "q", name: "Bramble Smash", effects: [{ type: "displacement", strength: 7, reliability: 8, priority: 7 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }] },
      { key: "w", name: "Twisted Advance", effects: [{ type: "dash", subtype: "point-and-click-root", strength: 7, reliability: 9, priority: 7 }, { type: "root", strength: 8, reliability: 9, priority: 8 }, { type: "pick", subtype: "reliable-catch", strength: 8, reliability: 9, priority: 8 }] },
      { key: "e", name: "Sapling Toss", effects: [{ type: "vision", subtype: "brush-control", strength: 8, reliability: 9, priority: 8 }, { type: "zone-control", subtype: "area-scouting", strength: 7, reliability: 9, priority: 7 }] },
      { key: "r", name: "Nature's Grasp", effects: [{ type: "root", subtype: "long-range-teamfight", strength: 9, reliability: 8, priority: 9 }, { type: "setup", subtype: "front-to-back-engage", strength: 9, reliability: 8, priority: 9 }, { type: "zone-control", subtype: "lane-fill", strength: 8, reliability: 8, priority: 8 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 9 },
    accessProfile: { engageRange: 8, targetAccess: 5, stickiness: 6 },
    threatProfile: { backlineThreat: 5, frontlineThreat: 7, pickThreat: 8, zoneThreat: 9, antiDiveThreat: 7 },
    phaseIdentity: { earlyRole: "utility", midRole: "setup", lateRole: "tank" },
    conditions: { requiresFollowUp: true },
    comboDependency: { needsFollowUp: 7 },
  },
};
