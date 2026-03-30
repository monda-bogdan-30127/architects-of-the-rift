import type { Champion } from "@/app/types/champion";
import type { DraftGameState, Side } from "./draftTypes";
import { getChampionRoleProfile } from "./championProfileSystem";

export type DraftPlanType =
  | "front-to-back"
  | "dive"
  | "pick"
  | "poke"
  | "skirmish"
  | "protect-carry"
  | "balanced";

export type DraftPlan = {
  type: DraftPlanType;
  confidence: number;
  desiredTags: string[];
  missingTags: string[];
  notes: string[];
};

const PLAN_TAGS: Record<DraftPlanType, string[]> = {
  "front-to-back": ["frontline", "peel", "dps", "follow-up"],
  dive: ["dive", "engage", "backlineAccess", "follow-up"],
  pick: ["pick", "reliableCC", "burst", "zone-control"],
  poke: ["poke", "zone-control", "disengage"],
  skirmish: ["dive", "burst", "follow-up"],
  "protect-carry": ["frontline", "peel", "warden", "enchanter", "dps"],
  balanced: ["frontline", "engage", "damage-balance"],
};

function scoreTags(tags: Set<string>, wanted: string[]) {
  let score = 0;
  for (const tag of wanted) {
    if (tags.has(tag)) score += 1;
  }
  return score;
}

function inferTeamTags(champions: Array<Champion | null>): Set<string> {
  const teamTags = new Set<string>();

  for (const champion of champions) {
    const profile = champion ? getChampionRoleProfile(champion) : null;
    if (!profile) continue;

    for (const tag of profile.tags) {
      teamTags.add(tag);
    }

    if (
      (profile.peelProfile?.bodyguard ?? 0) >= 6 ||
      (profile.peelProfile?.disengage ?? 0) >= 6
    ) {
      teamTags.add("peel");
    }

    if ((profile.ccProfile?.pick ?? 0) >= 6) {
      teamTags.add("pick");
    }

    if ((profile.ccProfile?.hard ?? 0) >= 6 || (profile.ccProfile?.lockdown ?? 0) >= 6) {
      teamTags.add("reliableCC");
    }

    if ((profile.accessProfile?.targetAccess ?? 0) >= 6) {
      teamTags.add("backlineAccess");
    }

    if ((profile.ccProfile?.chainPotential ?? 0) >= 6) {
      teamTags.add("follow-up");
    }

    if ((profile.damageProfileDetailed?.dps ?? 0) >= 7) {
      teamTags.add("dps");
    }

    if ((profile.damageProfileDetailed?.burst ?? 0) >= 7) {
      teamTags.add("burst");
    }

    if ((profile.damageProfileDetailed?.poke ?? 0) >= 6) {
      teamTags.add("poke");
    }

    if (
      (profile.special?.displacement ?? 0) >= 6 ||
      (profile.special?.antiDash ?? 0) >= 7
    ) {
      teamTags.add("disengage");
    }

    if ((profile.special?.ground ?? 0) >= 6 || (profile.threatProfile?.zoneThreat ?? 0) >= 7) {
      teamTags.add("zone-control");
    }

    const totalDamage =
      (profile.damageProfileDetailed?.dps ?? 0) +
      (profile.damageProfileDetailed?.burst ?? 0);

    if (totalDamage >= 12) {
      teamTags.add("damage-balance");
    }
  }

  return teamTags;
}

export function inferDraftPlan(
  champions: Array<Champion | null>,
  _game: DraftGameState,
  _side: Side
): DraftPlan {
  const teamTags = inferTeamTags(champions);

  const candidates = (Object.keys(PLAN_TAGS) as DraftPlanType[])
    .map((type) => {
      const desired = PLAN_TAGS[type];
      const matched = scoreTags(teamTags, desired);
      return { type, matched, desired };
    })
    .sort((a, b) => b.matched - a.matched);

  const best =
    candidates[0] ?? {
      type: "balanced" as DraftPlanType,
      matched: 0,
      desired: PLAN_TAGS.balanced,
    };

  const missingTags = best.desired.filter((tag) => !teamTags.has(tag));

  return {
    type: best.type,
    confidence: Math.min(10, best.matched * 2.2),
    desiredTags: best.desired,
    missingTags,
    notes: missingTags.length
      ? [`missing: ${missingTags.join(", ")}`]
      : ["core plan online"],
  };
}

export function getPlanFitBonus(
  candidate: Champion,
  alliedChampions: Array<Champion | null>,
  game: DraftGameState,
  side: Side
) {
  const plan = inferDraftPlan(alliedChampions, game, side);
  const profile = getChampionRoleProfile(candidate);

  if (!profile) {
    return { bonus: 0, plan };
  }

  let bonus = 0;

  for (const tag of plan.missingTags) {
    if (profile.tags.includes(tag)) bonus += 2.4;
  }

  for (const tag of plan.desiredTags) {
    if (profile.tags.includes(tag)) bonus += 0.5;
  }

  return { bonus: Math.min(10, bonus), plan };
}
