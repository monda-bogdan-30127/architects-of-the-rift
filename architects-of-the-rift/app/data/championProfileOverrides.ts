import type { ChampionRoleProfile, Role } from "@/app/types/champion";

type RoleOverrideKey = `${string}:${Role}`;
export type ChampionRoleProfileOverride = Partial<ChampionRoleProfile>;

export const championProfileOverrides: Record<RoleOverrideKey, ChampionRoleProfileOverride> = {
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
  "xin-zhao:jungle": {
    tags: ["melee", "dive", "burst", "skirmish", "primary-carry", "ad"],
    abilities: [
      { key: "q", name: "Three Talon Strike", effects: [{ type: "dps", strength: 6, reliability: 8, priority: 6 }, { type: "knockup", subtype: "3-hit-conditional", strength: 7, reliability: 7, priority: 7 }] },
      { key: "e", name: "Audacious Charge", effects: [{ type: "dash", strength: 8, reliability: 8, priority: 8 }, { type: "slow", strength: 5, reliability: 8, priority: 5 }, { type: "setup", subtype: "backline-entry", strength: 7, reliability: 8, priority: 7 }] },
      { key: "r", name: "Crescent Guard", effects: [{ type: "zone-control", subtype: "carry-space-creation", strength: 8, reliability: 8, priority: 8 }, { type: "anti-engage", subtype: "outer-threat-denial", strength: 7, reliability: 7, priority: 7 }] },
    ],
    accessProfile: { engageRange: 7, targetAccess: 9, stickiness: 8 },
    threatProfile: { backlineThreat: 9, frontlineThreat: 6, pickThreat: 7, zoneThreat: 5, antiDiveThreat: 3 },
    phaseIdentity: { earlyRole: "carry", midRole: "carry", lateRole: "utility" },
    conditions: { requiresPeel: true },
    comboDependency: { needsEnchanter: 7, needsPeel: 6 },
  },
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
  "vi:jungle": {
    tags: ["melee", "dive", "engage", "pick", "ad"],
    abilities: [
      { key: "q", name: "Vault Breaker", effects: [{ type: "dash", strength: 8, reliability: 7, priority: 8 }, { type: "knockup", strength: 7, reliability: 7, priority: 7 }] },
      { key: "r", name: "Cease and Desist", effects: [{ type: "unstoppable", strength: 8, reliability: 9, priority: 9 }, { type: "knockup", subtype: "point-and-click-engage", strength: 10, reliability: 10, priority: 10 }, { type: "setup", subtype: "carry-isolation", strength: 10, reliability: 10, priority: 10 }] },
    ],
    special: { antiDash: 0, projectileBlock: 0, ground: 0, displacement: 6, visionControl: 2 },
    accessProfile: { engageRange: 8, targetAccess: 10, stickiness: 8 },
    threatProfile: { backlineThreat: 10, frontlineThreat: 5, pickThreat: 10, zoneThreat: 3, antiDiveThreat: 2 },
    phaseIdentity: { earlyRole: "pick", midRole: "carry", lateRole: "pick" },
    conditions: { requiresFollowUp: true },
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
  "gragas:jungle": {
    tags: ["melee", "engage", "pick", "disengage", "ap"],
    abilities: [
      { key: "e", name: "Body Slam", effects: [{ type: "dash", strength: 7, reliability: 8, priority: 7 }, { type: "stun", strength: 7, reliability: 8, priority: 7 }, { type: "anti-engage", subtype: "interrupt", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Explosive Cask", effects: [{ type: "displacement", strength: 10, reliability: 8, priority: 10 }, { type: "setup", subtype: "isolation", strength: 8, reliability: 8, priority: 8 }, { type: "anti-engage", subtype: "reset", strength: 8, reliability: 8, priority: 8 }] },
    ],
    accessProfile: { engageRange: 7, targetAccess: 7, stickiness: 5 },
    threatProfile: { backlineThreat: 7, frontlineThreat: 5, pickThreat: 9, zoneThreat: 6, antiDiveThreat: 8 },
    phaseIdentity: { earlyRole: "pick", midRole: "utility", lateRole: "pick" },
  },
};
