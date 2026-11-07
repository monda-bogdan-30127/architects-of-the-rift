import type { Champion, ChampionRoleProfile, ChampionSynergyRule, Role } from "@/app/types/champion";
import { getChampionRoleProfile } from "./championProfileSystem";
import { resolveRoleAssignments } from "./draftRoleResolver";

type Entry = { champion: Champion; profile: ChampionRoleProfile };

function intersects<T>(a: T[], b: T[]) {
  return a.some((entry) => b.includes(entry));
}

function profileMatchesRuleTarget(entry: Entry, rule: ChampionSynergyRule) {
  if (rule.targetChampionIds?.length && rule.targetChampionIds.includes(entry.champion.id)) return true;
  if (rule.targetTags?.length && intersects(entry.profile.tags, rule.targetTags)) return true;
  return false;
}

/** Profilul fiecărui campion pe rolul rezolvat al compoziției (nu primul rol din listă). */
function getEntries(champions: Champion[]): Entry[] {
  const assignments = resolveRoleAssignments(champions.map((champion) => champion.id), {});
  const roleById = new Map<string, Role>();
  for (const [role, championId] of Object.entries(assignments) as [Role, string | undefined][]) {
    if (championId) roleById.set(championId, role);
  }
  return champions
    .map((champion) => {
      const profile = getChampionRoleProfile(champion, roleById.get(champion.id) ?? null);
      return profile ? { champion, profile } : null;
    })
    .filter((entry): entry is Entry => Boolean(entry));
}

export function evaluateRuleSynergy(allies: Champion[], enemies: Champion[]) {
  const allyEntries = getEntries(allies);
  // `enemies` rămâne în semnătură; regulile de matchup nu mai sunt evaluate aici (§4.4).
  void enemies;
  let score = 0;

  for (const current of allyEntries) {
    for (const rule of current.profile.synergy.wantsAllies) {
      const hits = allyEntries.filter((ally) => ally.champion.id !== current.champion.id && profileMatchesRuleTarget(ally, rule)).length;
      if (hits > 0) score += rule.effect.score;
    }

    for (const rule of current.profile.synergy.wantsTeam) {
      const hits = allyEntries.filter((ally) => profileMatchesRuleTarget(ally, rule)).length;
      if (rule.scalingByCount?.length) {
        for (const entry of rule.scalingByCount) if (hits >= entry.count) score += entry.score;
      } else if (hits >= (rule.minCount ?? 1)) {
        score += rule.effect.score;
      }
    }

    for (const rule of current.profile.synergy.goodWith) {
      const hits = allyEntries.filter((ally) => ally.champion.id !== current.champion.id && profileMatchesRuleTarget(ally, rule)).length;
      if (hits > 0) score += rule.effect.score;
    }

    // mustWith / goodVs / weakVs: tratate de mustWithPriority.ts și matchupScoring.ts (§4.4).
  }

  return Math.max(0, Math.min(10, 5 + score * 0.12));
}

export function evaluateInteractionScore(allies: Champion[], enemies: Champion[]) {
  const allyEntries = getEntries(allies);
  const enemyEntries = getEntries(enemies);
  const enemyTags = new Set(enemyEntries.flatMap((entry) => entry.profile.tags));
  const allyTags = new Set(allyEntries.flatMap((entry) => entry.profile.tags));
  let score = 0;

  for (const { profile } of allyEntries) {
    const allyCounters = new Set(profile.interactionProfile.counters);
    const allyCounteredBy = new Set(profile.interactionProfile.counteredBy);

    if (allyCounters.has("dash") && (enemyTags.has("dive") || enemyTags.has("dash-heavy"))) score += 1.4;
    if (allyCounters.has("projectile") && enemyTags.has("poke")) score += 1.1;
    if (allyCounteredBy.has("disengage") && enemyTags.has("zone-control")) score -= 1.0;
    if (allyCounteredBy.has("hard-cc") && enemyTags.has("pick")) score -= 1.2;
    if (profile.conditions.requiresFrontline && !allyTags.has("frontline")) score -= 1.4;
    if (profile.conditions.requiresPeel && !(allyTags.has("peel") || allyTags.has("warden") || allyTags.has("enchanter"))) score -= 1.2;
  }

  return Math.max(0, Math.min(10, 5 + score));
}
