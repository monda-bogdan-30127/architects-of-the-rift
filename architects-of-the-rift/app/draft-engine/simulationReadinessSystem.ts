import type { Champion } from "@/app/types/champion";
import type { TeamDraftEvaluation } from "./draftTypes";
import { getChampionRoleProfile } from "./championProfileSystem";

type DerivedChampionRoleProfile = NonNullable<
  ReturnType<typeof getChampionRoleProfile>
>;

const clamp = (value: number, min = 0, max = 10) =>
  Math.max(min, Math.min(max, value));

const avg = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

export type SimulationReadinessBreakdown = {
  score: number;
  conditionScore: number;
  protectionCoverage: number;
  engageCoverage: number;
  frontlineCoverage: number;
  followUpCoverage: number;
  risks: string[];
};

function getProfiles(
  champions: Array<Champion | null>
): DerivedChampionRoleProfile[] {
  return champions
    .map((champion) =>
      champion ? getChampionRoleProfile(champion) : null
    )
    .filter(
      (p): p is DerivedChampionRoleProfile =>
        Boolean(p)
    );
}

// ─── Contextual risk weights per comp identity ──────────────────────────────
// Each comp type cares about different things:
//   - front-to-back wants frontline + peel, doesn't need engage
//   - dive wants engage + follow-up, doesn't need peel or disengage
//   - poke wants range + disengage, doesn't need frontline or engage
//   - pick wants follow-up + burst, moderate needs overall
//   - teamfight wants AoE engage + frontline + follow-up
//   - balanced wants a bit of everything
//
// Values 0-1: how much this comp NEEDS the attribute (1.0 = critical)
type RiskWeights = {
  needsFrontline: number;
  needsEngage: number;
  needsPeel: number;
  needsFollowUp: number;
};

const RISK_WEIGHTS: Record<string, RiskWeights> = {
  "front-to-back": { needsFrontline: 1.0, needsEngage: 0.3, needsPeel: 1.0, needsFollowUp: 0.4 },
  "dive":          { needsFrontline: 0.6, needsEngage: 1.0, needsPeel: 0.2, needsFollowUp: 1.0 },
  "poke":          { needsFrontline: 0.2, needsEngage: 0.1, needsPeel: 0.6, needsFollowUp: 0.2 },
  "pick":          { needsFrontline: 0.3, needsEngage: 0.4, needsPeel: 0.3, needsFollowUp: 0.8 },
  "teamfight":     { needsFrontline: 0.9, needsEngage: 0.8, needsPeel: 0.6, needsFollowUp: 0.8 },
  "balanced":      { needsFrontline: 0.6, needsEngage: 0.6, needsPeel: 0.5, needsFollowUp: 0.5 },
};

export function evaluateSimulationReadiness(
  champions: Array<Champion | null>,
  evaluation: Pick<
    TeamDraftEvaluation,
    | "compVector"
    | "protectionScore"
    | "frontlineScore"
    | "primaryEngageScore"
    | "followUpScore"
    | "accessScore"
    | "threatScore"
    | "roleProfileScore"
    | "compIdentity"
  >
): SimulationReadinessBreakdown {
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

  const compIdentity = evaluation.compIdentity ?? "balanced";
  const weights = RISK_WEIGHTS[compIdentity] ?? RISK_WEIGHTS.balanced;

  const risks: string[] = [];

  // ─── Contextual team-level risks ─────────────────────────────────────────
  // Only flag as risk if (a) coverage is low AND (b) this comp actually needs it
  if (frontlineCoverage < 4.5 && weights.needsFrontline >= 0.7) {
    risks.push(`no frontline (${compIdentity} comp needs it)`);
  }
  if (engageCoverage < 4.5 && weights.needsEngage >= 0.7) {
    risks.push(`no engage (${compIdentity} comp needs it)`);
  }
  if (protectionCoverage < 4.5 && weights.needsPeel >= 0.7) {
    risks.push(`no peel (${compIdentity} comp needs it)`);
  }
  if (followUpCoverage < 4.5 && weights.needsFollowUp >= 0.7) {
    risks.push(`no follow-up (${compIdentity} comp needs it)`);
  }

  // ─── Per-champion condition checks ───────────────────────────────────────
  // If a champion has requiresX condition, check if team has X. Penalty scales
  // with how much this comp actually needs the attribute.
  const conditionScores: number[] = [];

  for (const championProfile of profiles) {
    let championScore = 8;
    const cond = championProfile.conditions;

    if (cond.requiresPeel && protectionCoverage < 5.5) {
      const penalty = 2.2 * weights.needsPeel;
      championScore -= penalty;
      if (weights.needsPeel >= 0.6) {
        risks.push(`${championProfile.role}: protection-reliant pick underfilled`);
      }
    }

    if (cond.requiresFrontline && frontlineCoverage < 5.5) {
      const penalty = 2.2 * weights.needsFrontline;
      championScore -= penalty;
      if (weights.needsFrontline >= 0.6) {
        risks.push(`${championProfile.role}: frontline requirement underfilled`);
      }
    }

    if (cond.requiresEngage && engageCoverage < 5.3) {
      const penalty = 1.8 * weights.needsEngage;
      championScore -= penalty;
      if (weights.needsEngage >= 0.6) {
        risks.push(`${championProfile.role}: engage requirement underfilled`);
      }
    }

    if (cond.requiresFollowUp && followUpCoverage < 5.3) {
      const penalty = 1.6 * weights.needsFollowUp;
      championScore -= penalty;
      if (weights.needsFollowUp >= 0.6) {
        risks.push(`${championProfile.role}: follow-up requirement underfilled`);
      }
    }

    conditionScores.push(clamp(championScore, 0, 10));
  }

  const conditionScore = avg(conditionScores);

  // ─── Overall score — weight components by comp relevance ─────────────────
  const relevantScores: number[] = [conditionScore];

  if (weights.needsFrontline >= 0.5) relevantScores.push(frontlineCoverage);
  if (weights.needsEngage >= 0.5) relevantScores.push(engageCoverage);
  if (weights.needsPeel >= 0.5) relevantScores.push(protectionCoverage);
  if (weights.needsFollowUp >= 0.5) relevantScores.push(followUpCoverage);

  // Always include overall profile scores
  relevantScores.push(evaluation.accessScore ?? 5);
  relevantScores.push(evaluation.threatScore ?? 5);
  relevantScores.push(evaluation.roleProfileScore ?? 5);

  const score = clamp(avg(relevantScores), 0, 10);

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
