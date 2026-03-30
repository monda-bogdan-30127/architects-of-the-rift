import type { Champion } from "@/app/types/champion";
import type { TeamDraftEvaluation } from "./draftTypes";
import { getChampionRoleProfile, type DerivedChampionRoleProfile } from "./championProfileSystem";

const clamp = (value: number, min = 0, max = 10) => Math.max(min, Math.min(max, value));
const avg = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

export type SimulationReadinessBreakdown = {
  score: number;
  conditionScore: number;
  protectionCoverage: number;
  engageCoverage: number;
  frontlineCoverage: number;
  followUpCoverage: number;
  risks: string[];
};

function getProfiles(champions: Array<Champion | null>): DerivedChampionRoleProfile[] {
  return champions
    .map((champion) => (champion ? getChampionRoleProfile(champion) : null))
    .filter((profile): profile is DerivedChampionRoleProfile => Boolean(profile));
}

export function evaluateSimulationReadiness(champions: Array<Champion | null>, evaluation: Pick<TeamDraftEvaluation, "compVector" | "protectionScore" | "frontlineScore" | "primaryEngageScore" | "followUpScore" | "accessScore" | "threatScore" | "roleProfileScore">): SimulationReadinessBreakdown {
  const profiles = getProfiles(champions);
  if (!profiles.length) {
    return {
      score: 5,
      conditionScore: 5,
      protectionCoverage: 5,
      engageCoverage: 5,
      frontlineCoverage: 5,
      followUpCoverage: 5,
      risks: [],
    };
  }

  const protectionCoverage = clamp(evaluation.protectionScore ?? 5, 0, 10);
  const frontlineCoverage = clamp(evaluation.frontlineScore ?? 5, 0, 10);
  const engageCoverage = clamp(evaluation.primaryEngageScore ?? 5, 0, 10);
  const followUpCoverage = clamp(evaluation.followUpScore ?? 5, 0, 10);

  const conditionScores: number[] = [];
  const risks: string[] = [];

  for (const profile of profiles) {
    let profileScore = 8;
    if (profile.conditions.requiresPeel && protectionCoverage < 5.5) {
      profileScore -= 2.2;
      risks.push(`${profile.role}: low peel coverage for a protection-reliant pick`);
    }
    if (profile.conditions.requiresFrontline && frontlineCoverage < 5.5) {
      profileScore -= 2.2;
      risks.push(`${profile.role}: frontline requirement is underfilled`);
    }
    if (profile.conditions.requiresEngage && engageCoverage < 5.3) {
      profileScore -= 1.8;
      risks.push(`${profile.role}: engage requirement is underfilled`);
    }
    if (profile.conditions.requiresFollowUp && followUpCoverage < 5.3) {
      profileScore -= 1.6;
      risks.push(`${profile.role}: follow-up requirement is underfilled`);
    }
    conditionScores.push(clamp(profileScore, 0, 10));
  }

  const conditionScore = avg(conditionScores);
  const score = clamp(avg([
    conditionScore,
    protectionCoverage,
    frontlineCoverage,
    engageCoverage,
    followUpCoverage,
    evaluation.accessScore ?? 5,
    evaluation.threatScore ?? 5,
    evaluation.roleProfileScore ?? 5,
  ]), 0, 10);

  return {
    score,
    conditionScore,
    protectionCoverage,
    engageCoverage,
    frontlineCoverage,
    followUpCoverage,
    risks: Array.from(new Set(risks)).slice(0, 6),
  };
}
