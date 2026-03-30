import type { Team } from "@/app/types/team";
import type { TeamDraftEvaluation } from "./draftTypes";
import { getChampionRoleProfile } from "./championProfileSystem";
import type { Champion } from "@/app/types/champion";

type DerivedChampionRoleProfile = NonNullable<
  ReturnType<typeof getChampionRoleProfile>
>;

const clamp = (value: number, min = 0, max = 10) =>
  Math.max(min, Math.min(max, value));

export type TeamIdentityEvaluation = {
  score: number;
  matchedTags: string[];
  avoidedTags: string[];
  styleMatched: boolean;
  note: string;
};

export function evaluateTeamIdentity(
  team: Team | null | undefined,
  compIdentity: TeamDraftEvaluation["compIdentity"],
  champions: Array<Champion | null>
): TeamIdentityEvaluation {
  const identity = team?.identity;

  if (!identity) {
    return {
      score: 5,
      matchedTags: [],
      avoidedTags: [],
      styleMatched: false,
      note: "No team identity configured.",
    };
  }

  if (team?.isPlayerControlled) {
    return {
      score: 5,
      matchedTags: [],
      avoidedTags: [],
      styleMatched: false,
      note: "Team identity ignored because the team is player-controlled.",
    };
  }

  const profiles: DerivedChampionRoleProfile[] = champions
    .map((champion) => (champion ? getChampionRoleProfile(champion) : null))
    .filter(
      (profile): profile is DerivedChampionRoleProfile => Boolean(profile)
    );

  const teamTags = new Set(profiles.flatMap((profile) => profile.tags));
  const matchedTags = identity.preferredTags.filter((tag) =>
    teamTags.has(tag)
  );
  const avoidedTags = (identity.avoidTags ?? []).filter((tag) =>
    teamTags.has(tag)
  );
  const styleMatched = identity.preferredStyles.includes(compIdentity);

  let score = 5;

  if (styleMatched) score += 2.2;
  score += matchedTags.length * 0.4;
  score -= avoidedTags.length * 0.65;

  const profileBlind = profiles.length
    ? profiles.reduce(
        (sum, profile) => sum + profile.draftProfile.blindPick,
        0
      ) / profiles.length
    : 5;

  const profileFlex = profiles.length
    ? profiles.reduce(
        (sum, profile) => sum + profile.draftProfile.flexValue,
        0
      ) / profiles.length
    : 0;

  const profileContest = profiles.length
    ? profiles.reduce(
        (sum, profile) => sum + profile.draftProfile.contestPriority,
        0
      ) / profiles.length
    : 0;

  score += ((identity.flexBias ?? 5) - 5) * 0.12 * (profileFlex / 10);
  score += ((identity.counterpickBias ?? 5) - 5) * 0.08 * (profileBlind / 10);
  score += ((identity.earlyPriorityBias ?? 5) - 5) * 0.1 * (profileContest / 10);
  score += ((identity.comfortBias ?? 5) - 5) * 0.08;
  score += ((identity.creativity ?? 5) - 5) * 0.05 * (profileFlex / 10);
  score += ((identity.discipline ?? 5) - 5) * 0.05 * (profileBlind / 10);

  const noteParts: string[] = [];

  if (styleMatched) {
    noteParts.push(`preferred style matched (${compIdentity})`);
  }

  if (matchedTags.length) {
    noteParts.push(`matched tags: ${matchedTags.join(", ")}`);
  }

  if (avoidedTags.length) {
    noteParts.push(`avoid tags hit: ${avoidedTags.join(", ")}`);
  }

  return {
    score: clamp(score, 0, 10),
    matchedTags,
    avoidedTags,
    styleMatched,
    note: noteParts.join("; ") || "Neutral identity fit.",
  };
}
