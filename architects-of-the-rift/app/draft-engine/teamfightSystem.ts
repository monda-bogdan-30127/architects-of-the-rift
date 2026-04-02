// ═══════════════════════════════════════════════════════════════════════════
// Upgrade 5: Teamfight resolution from champion mechanics
//
// Connects the richest unused champion data to simulation:
//   abilities/effects → engage quality, CC chains, special interactions
//   threatProfile    → damage targeting, backline access vs peel
//   accessProfile    → can carries be reached? can engagers get in?
//   peelProfile      → carry protection effectiveness
//   ccProfile        → lockdown chains, pick potential
//   carryProfile     → self-protection of ADC/mid carries
//   damageDelivery   → sustained vs burst, reliability, AoE
//   conditions       → unmet conditions = penalty
//   special          → antiDash, projectileBlock, ground counters
//
// NEW FILE: place in app/draft-engine/teamfightSystem.ts
// ═══════════════════════════════════════════════════════════════════════════

import type { Role } from "@/app/types/champion";
import type { ChampionRoleProfile } from "@/app/types/champion";
import { getChampionRoleProfile } from "./championProfileSystem";
import {
  clamp,
  round1,
  average,
  getChampionByIdSafe,
} from "./matchSimulationUtils";
import { ROLE_ORDER } from "./draftTypes";

// ─── Types ──────────────────────────────────────────────────────────────────

export type TeamfightEvaluation = {
  engageQuality: number;
  ccChainPower: number;
  damageOutput: number;
  carryOutputEfficiency: number;
  frontlinePresence: number;
  peelEfficiency: number;
  conditionsMet: number;
  specialInteractions: number;
  teamfightTotal: number;
};

export type TeamfightResult = {
  blue: TeamfightEvaluation;
  red: TeamfightEvaluation;
  blueTeamfightEdge: number;
  redTeamfightEdge: number;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getProfiles(assignments: Partial<Record<Role, string>>): Array<{ role: Role; profile: ChampionRoleProfile }> {
  const result: Array<{ role: Role; profile: ChampionRoleProfile }> = [];
  for (const role of ROLE_ORDER) {
    const champId = assignments[role];
    if (!champId) continue;
    const champ = getChampionByIdSafe(champId);
    if (!champ) continue;
    const profile = getChampionRoleProfile(champ, role);
    if (profile) result.push({ role, profile });
  }
  return result;
}

function hasTag(profiles: Array<{ profile: ChampionRoleProfile }>, tag: string): boolean {
  return profiles.some((p) => p.profile.tags?.includes(tag));
}

function countTag(profiles: Array<{ profile: ChampionRoleProfile }>, tag: string): number {
  return profiles.filter((p) => p.profile.tags?.includes(tag)).length;
}

function sumEffectStrength(profiles: Array<{ profile: ChampionRoleProfile }>, effectType: string): number {
  let total = 0;
  for (const { profile } of profiles) {
    for (const ability of profile.abilities ?? []) {
      for (const effect of ability.effects ?? []) {
        if (effect.type === effectType) {
          total += effect.strength * (effect.reliability / 10);
        }
      }
    }
  }
  return total;
}

// ─── Individual evaluators ──────────────────────────────────────────────────

function evaluateEngageQuality(profiles: Array<{ role: Role; profile: ChampionRoleProfile }>): number {
  if (profiles.length === 0) return 5;

  const engageRanges = profiles.map((p) => p.profile.accessProfile?.engageRange ?? 3);
  const bestEngageRange = Math.max(...engageRanges);

  const ccHard = average(profiles.map((p) => p.profile.ccProfile?.hard ?? 0));
  const setupEffects = sumEffectStrength(profiles, "setup");
  const engageEffects = sumEffectStrength(profiles, "knockup") + sumEffectStrength(profiles, "stun") * 0.8;

  // Team needs at least one reliable engage tool
  const hasReliableEngage = bestEngageRange >= 6 && ccHard >= 4;
  const engageBonus = hasReliableEngage ? 1.5 : 0;

  return clamp(
    bestEngageRange * 0.25 +
    ccHard * 0.20 +
    Math.min(setupEffects, 20) * 0.12 +
    Math.min(engageEffects, 25) * 0.08 +
    engageBonus,
    0, 10
  );
}

function evaluateCCChainPower(profiles: Array<{ role: Role; profile: ChampionRoleProfile }>): number {
  if (profiles.length === 0) return 5;

  const chainPotentials = profiles.map((p) => p.profile.ccProfile?.chainPotential ?? 0);
  const lockdowns = profiles.map((p) => p.profile.ccProfile?.lockdown ?? 0);
  const hardCCs = profiles.map((p) => p.profile.ccProfile?.hard ?? 0);

  const bestChain = Math.max(...chainPotentials);
  const avgLockdown = average(lockdowns);
  const totalHardCC = hardCCs.reduce((sum, v) => sum + v, 0);

  // Multiple sources of hard CC = chain potential
  const multiSourceBonus = hardCCs.filter((v) => v >= 4).length >= 2 ? 1.5 : 0;

  return clamp(
    bestChain * 0.30 +
    avgLockdown * 0.25 +
    Math.min(totalHardCC, 30) * 0.10 +
    multiSourceBonus,
    0, 10
  );
}

function evaluateDamageOutput(profiles: Array<{ role: Role; profile: ChampionRoleProfile }>): number {
  if (profiles.length === 0) return 5;

  const totalBurst = profiles.reduce((sum, p) => sum + (p.profile.damageProfileDetailed?.burst ?? 0), 0);
  const totalDps = profiles.reduce((sum, p) => sum + (p.profile.damageProfileDetailed?.dps ?? 0), 0);
  const avgReliability = average(profiles.map((p) => p.profile.damageDelivery?.reliability ?? 5));
  const avgUptime = average(profiles.map((p) => p.profile.damageDelivery?.uptime ?? 5));
  const totalAoe = profiles.reduce((sum, p) => sum + (p.profile.damageDelivery?.aoe ?? 0), 0);

  return clamp(
    Math.min(totalBurst, 35) * 0.08 +
    Math.min(totalDps, 35) * 0.08 +
    avgReliability * 0.25 +
    avgUptime * 0.20 +
    Math.min(totalAoe, 25) * 0.06,
    0, 10
  );
}

function evaluateCarryOutputEfficiency(
  allyProfiles: Array<{ role: Role; profile: ChampionRoleProfile }>,
  enemyProfiles: Array<{ role: Role; profile: ChampionRoleProfile }>,
  allyAssignments: Partial<Record<Role, string>>
): number {
  // How much of the carry's damage actually gets through?
  // Depends on: carry self-protection, team peel, vs enemy access/threat

  const adcChampId = allyAssignments["adc"];
  const adcChamp = getChampionByIdSafe(adcChampId ?? null);
  if (!adcChamp) return 5;

  const carryProfile = adcChamp.carryProfile;
  const selfProtection = (
    (carryProfile?.selfPeel ?? 1) +
    (carryProfile?.selfSave ?? 0) +
    (carryProfile?.mobilitySafety ?? 1)
  ) / 3;

  // Team peel for carry
  const teamPeel = average(allyProfiles.map((p) => {
    const pp = p.profile.peelProfile;
    if (!pp) return 0;
    return (pp.bodyguard + pp.disengage + pp.antiDive + pp.shield + pp.resetProtection) / 5;
  }));

  // Enemy threat to backline
  const enemyBacklineThreat = average(
    enemyProfiles.map((p) => p.profile.threatProfile?.backlineThreat ?? 3)
  );
  const enemyAccess = average(
    enemyProfiles.map((p) => p.profile.accessProfile?.targetAccess ?? 3)
  );

  // Carry efficiency = protection vs threat
  const protection = selfProtection * 0.30 + teamPeel * 0.70;
  const threat = enemyBacklineThreat * 0.55 + enemyAccess * 0.45;

  // High protection vs low threat = carry outputs freely (8-9)
  // Low protection vs high threat = carry gets dove and dies (2-4)
  return clamp(5 + (protection - threat * 0.6) * 1.2, 1, 10);
}

function evaluateFrontlinePresence(profiles: Array<{ role: Role; profile: ChampionRoleProfile }>): number {
  if (profiles.length === 0) return 5;

  const frontlineThreat = profiles.reduce(
    (sum, p) => sum + (p.profile.threatProfile?.frontlineThreat ?? 0), 0
  );
  const antiDive = profiles.reduce(
    (sum, p) => sum + (p.profile.threatProfile?.antiDiveThreat ?? 0), 0
  );

  const hasTank = hasTag(profiles, "frontline") || hasTag(profiles, "tank");
  const tankBonus = hasTank ? 1.5 : 0;
  const tankCount = countTag(profiles, "frontline");
  const doubleFrontBonus = tankCount >= 2 ? 1.0 : 0;

  return clamp(
    Math.min(frontlineThreat, 35) * 0.10 +
    Math.min(antiDive, 25) * 0.08 +
    tankBonus +
    doubleFrontBonus,
    0, 10
  );
}

function evaluatePeelEfficiency(
  allyProfiles: Array<{ role: Role; profile: ChampionRoleProfile }>,
  enemyProfiles: Array<{ role: Role; profile: ChampionRoleProfile }>
): number {
  if (allyProfiles.length === 0) return 5;

  const avgPeel = average(allyProfiles.map((p) => {
    const pp = p.profile.peelProfile;
    if (!pp) return 0;
    return (pp.bodyguard * 0.25 + pp.disengage * 0.25 + pp.antiDive * 0.25 + pp.shield * 0.15 + pp.resetProtection * 0.10);
  }));

  // Peel is more valuable when enemy has dive/access threats
  const enemyDivePressure = average(
    enemyProfiles.map((p) =>
      (p.profile.accessProfile?.targetAccess ?? 3) * 0.5 +
      (p.profile.threatProfile?.backlineThreat ?? 3) * 0.5
    )
  );

  // If enemy has high dive pressure, peel matters more
  const relevanceMultiplier = enemyDivePressure >= 6 ? 1.3 : enemyDivePressure >= 4 ? 1.0 : 0.7;

  return clamp(avgPeel * relevanceMultiplier, 0, 10);
}

function evaluateConditionsMet(
  profiles: Array<{ role: Role; profile: ChampionRoleProfile }>
): number {
  if (profiles.length === 0) return 10;

  const allTags = new Set(profiles.flatMap((p) => p.profile.tags ?? []));
  let unmetCount = 0;
  let totalConditions = 0;

  for (const { profile } of profiles) {
    const cond = profile.conditions;
    if (!cond) continue;

    if (cond.requiresFrontline) {
      totalConditions += 1;
      if (!allTags.has("frontline") && !allTags.has("tank")) unmetCount += 1;
    }
    if (cond.requiresEngage) {
      totalConditions += 1;
      if (!allTags.has("engage")) unmetCount += 1;
    }
    if (cond.requiresPeel) {
      totalConditions += 1;
      if (!allTags.has("peel") && !allTags.has("warden") && !allTags.has("enchanter")) unmetCount += 1;
    }
    if (cond.requiresFollowUp) {
      totalConditions += 1;
      if (!allTags.has("follow-up") && !allTags.has("dive") && !allTags.has("burst")) unmetCount += 1;
    }
    if (cond.requiresSetup) {
      totalConditions += 1;
      if (!allTags.has("setup") && !allTags.has("engage")) unmetCount += 1;
    }
  }

  if (totalConditions === 0) return 8;

  const metRatio = 1 - (unmetCount / totalConditions);
  return clamp(metRatio * 10, 2, 10);
}

function evaluateSpecialInteractions(
  allyProfiles: Array<{ role: Role; profile: ChampionRoleProfile }>,
  enemyProfiles: Array<{ role: Role; profile: ChampionRoleProfile }>
): number {
  let score = 5;

  // Anti-dash vs dash-heavy enemies
  const allyAntiDash = Math.max(...allyProfiles.map((p) => p.profile.special?.antiDash ?? 0));
  const enemyDashCount = enemyProfiles.filter((p) => {
    const abilities = p.profile.abilities ?? [];
    return abilities.some((a) => a.effects?.some((e) => e.type === "dash"));
  }).length;

  if (allyAntiDash >= 7 && enemyDashCount >= 3) {
    score += 1.5; // Poppy W vs dash-heavy comp
  }

  // Projectile block vs projectile-heavy enemies
  const allyProjBlock = Math.max(...allyProfiles.map((p) => p.profile.special?.projectileBlock ?? 0));
  const enemyProjectileChamps = enemyProfiles.filter((p) => {
    const abilities = p.profile.abilities ?? [];
    return abilities.some((a) => a.effects?.some((e) => e.type === "projectile" || e.type === "poke"));
  }).length;

  if (allyProjBlock >= 8 && enemyProjectileChamps >= 2) {
    score += 1.2; // Braum shield vs poke comp
  }

  // Ground vs mobility-heavy enemies
  const allyGround = Math.max(...allyProfiles.map((p) => p.profile.special?.ground ?? 0));
  if (allyGround >= 7 && enemyDashCount >= 3) {
    score += 1.0;
  }

  // Zone control vs grouped enemies
  const allyZoneThreat = allyProfiles.reduce(
    (sum, p) => sum + (p.profile.threatProfile?.zoneThreat ?? 0), 0
  );
  if (allyZoneThreat >= 25) {
    score += 0.8;
  }

  // Displacement vs channeled/positional enemies
  const allyDisplacement = Math.max(...allyProfiles.map((p) => p.profile.special?.displacement ?? 0));
  if (allyDisplacement >= 8) {
    score += 0.5;
  }

  return clamp(score, 0, 10);
}

// ─── Main entry point ───────────────────────────────────────────────────────

export function evaluateTeamfight(args: {
  blueAssignments: Partial<Record<Role, string>>;
  redAssignments: Partial<Record<Role, string>>;
}): TeamfightResult {
  const blueProfiles = getProfiles(args.blueAssignments);
  const redProfiles = getProfiles(args.redAssignments);

  const blue: TeamfightEvaluation = {
    engageQuality: evaluateEngageQuality(blueProfiles),
    ccChainPower: evaluateCCChainPower(blueProfiles),
    damageOutput: evaluateDamageOutput(blueProfiles),
    carryOutputEfficiency: evaluateCarryOutputEfficiency(blueProfiles, redProfiles, args.blueAssignments),
    frontlinePresence: evaluateFrontlinePresence(blueProfiles),
    peelEfficiency: evaluatePeelEfficiency(blueProfiles, redProfiles),
    conditionsMet: evaluateConditionsMet(blueProfiles),
    specialInteractions: evaluateSpecialInteractions(blueProfiles, redProfiles),
    teamfightTotal: 0,
  };

  const red: TeamfightEvaluation = {
    engageQuality: evaluateEngageQuality(redProfiles),
    ccChainPower: evaluateCCChainPower(redProfiles),
    damageOutput: evaluateDamageOutput(redProfiles),
    carryOutputEfficiency: evaluateCarryOutputEfficiency(redProfiles, blueProfiles, args.redAssignments),
    frontlinePresence: evaluateFrontlinePresence(redProfiles),
    peelEfficiency: evaluatePeelEfficiency(redProfiles, blueProfiles),
    conditionsMet: evaluateConditionsMet(redProfiles),
    specialInteractions: evaluateSpecialInteractions(redProfiles, blueProfiles),
    teamfightTotal: 0,
  };

  // Composite teamfight score
  blue.teamfightTotal = round1(clamp(
    blue.engageQuality * 0.15 +
    blue.ccChainPower * 0.12 +
    blue.damageOutput * 0.18 +
    blue.carryOutputEfficiency * 0.18 +
    blue.frontlinePresence * 0.10 +
    blue.peelEfficiency * 0.08 +
    blue.conditionsMet * 0.12 +
    blue.specialInteractions * 0.07,
    0, 10
  ));

  red.teamfightTotal = round1(clamp(
    red.engageQuality * 0.15 +
    red.ccChainPower * 0.12 +
    red.damageOutput * 0.18 +
    red.carryOutputEfficiency * 0.18 +
    red.frontlinePresence * 0.10 +
    red.peelEfficiency * 0.08 +
    red.conditionsMet * 0.12 +
    red.specialInteractions * 0.07,
    0, 10
  ));

  // Edge: how much better is one team's teamfight vs the other
  const blueTeamfightEdge = round1(clamp((blue.teamfightTotal - red.teamfightTotal) * 0.5, -2.5, 2.5));
  const redTeamfightEdge = round1(-blueTeamfightEdge);

  return { blue, red, blueTeamfightEdge, redTeamfightEdge };
}
