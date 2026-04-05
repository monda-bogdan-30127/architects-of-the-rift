import type { Player } from "@/app/types/player";

type StyleInfo = {
  primary: string;
  secondary: string;
  tags: string[];
};

type ScoredEntry = {
  label: string;
  score: number;
};

const sortByScoreDesc = (entries: ScoredEntry[]) => [...entries].sort((a, b) => b.score - a.score);
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const norm100 = (value: number) => clamp01(value / 100);
const norm10 = (value: number) => clamp01(value / 10);
const needsTeamLabel = (value: number) => clamp01((value - 0.58) / 0.24);
const resourceHeavyLabel = (value: number) => clamp01((value - 0.66) / 0.20);
const resourceLightLabel = (value: number) => clamp01((0.56 - value) / 0.24);
const lowRiskLabel = (value: number) => clamp01((0.60 - value) / 0.26);
const highRiskLabel = (value: number) => clamp01((value - 0.60) / 0.24);

const byRoleFallback: Record<Player["role"], { secondary: string; tags: string[] }> = {
  top: { secondary: "Controller", tags: ["Stable", "Flexible"] },
  jungle: { secondary: "Tempo", tags: ["Objective", "Tempo"] },
  mid: { secondary: "Controller", tags: ["Stable", "Flexible"] },
  adc: { secondary: "Teamfighter", tags: ["Teamfight", "Stable"] },
  support: { secondary: "Facilitator", tags: ["Utility", "Vision"] },
};

const uniquePush = (values: string[], next: string) => {
  if (!values.includes(next)) values.push(next);
};

const pickTopTagLabels = (
  candidates: ScoredEntry[],
  excluded: string[],
  fallbackTags: string[],
  maxTags = 3
): string[] => {
  const chosen: string[] = [];
  const loweredExcluded = new Set(excluded.map((item) => item.toLowerCase()));

  for (const entry of sortByScoreDesc(candidates)) {
    if (entry.score < 0.44) continue;
    if (loweredExcluded.has(entry.label.toLowerCase())) continue;
    uniquePush(chosen, entry.label);
    if (chosen.length >= maxTags) break;
  }

  for (const fallback of fallbackTags) {
    if (chosen.length >= maxTags) break;
    if (loweredExcluded.has(fallback.toLowerCase())) continue;
    uniquePush(chosen, fallback);
  }

  return chosen;
};

const overrideScore = (
  player: Player,
  key: keyof NonNullable<Player["archetypeAffinity"]>,
  scale = 1
) => norm10(player.archetypeAffinity?.[key] ?? 0) * scale;

const adaptationScore = (
  player: Player,
  key: keyof NonNullable<Player["adaptationProfile"]>,
  scale = 1
) => norm10(player.adaptationProfile?.[key] ?? 0) * scale;

export function getPlayerStyleInfo(player: Player): StyleInfo {
  const playstyle = player.advancedProfile.playstyle;
  const primary = player.advancedProfile.primary;
  const tendencies = player.advancedProfile.tendencies;
  const substats = player.advancedProfile.substats;

  const carryUsage = norm100(playstyle.carryResourceUsage);
  const utilityComfort = norm100(playstyle.utilityComfort);
  const playmakingIntent = norm100(playstyle.playmakingIntent);
  const scalingOrientation = norm100(playstyle.scalingOrientation);
  const laneControlBias = norm100(playstyle.laneControlBias);
  const roamBias = norm100(playstyle.roamBias);
  const riskAppetite = norm100(playstyle.riskAppetite);
  const setupDependence = norm100(playstyle.setupDependence);
  const styleFlex = norm100(playstyle.styleFlex);

  const mechanics = norm100(primary.mechanics);
  const laning = norm100(primary.laning);
  const teamfighting = norm100(primary.teamfighting);
  const skirmishing = norm100(primary.skirmishing);
  const mapAwareness = norm100(primary.mapAwareness);
  const objectiveControl = norm100(primary.objectiveControl);
  const consistency = norm100(primary.consistency);
  const discipline = norm100(primary.discipline);
  const clutchFactor = norm100(primary.clutchFactor);
  const metaReadiness = norm100(primary.metaReadiness);
  const riskManagement = norm100(primary.riskManagement);
  const aggression = norm100(primary.aggression);
  const rotationTiming = norm100(primary.rotationTiming);

  const splitPushBias = norm100(tendencies.splitPushBias);
  const flankPreference = norm100(tendencies.flankPreference);
  const invadeFrequency = norm100(tendencies.invadeFrequency);
  const safeLanePreference = norm100(tendencies.safeLanePreference);

  const role = player.role;

  let styleCandidates: ScoredEntry[] = [];
  let tagCandidates: ScoredEntry[] = [];

  switch (role) {
    case "top": {
      const weaksideScore =
        resourceLightLabel(carryUsage) * 0.34 +
        safeLanePreference * 0.18 +
        consistency * 0.18 +
        riskManagement * 0.16 +
        norm100(substats.blindStability) * 0.14;

      const carryTopScore =
        carryUsage * 0.32 +
        mechanics * 0.18 +
        laning * 0.14 +
        aggression * 0.10 +
        splitPushBias * 0.10 +
        overrideScore(player, "carry", 0.14) -
        resourceLightLabel(carryUsage) * 0.22;

      const splitpushScore =
        splitPushBias * 0.40 +
        laning * 0.18 +
        mechanics * 0.12 +
        carryUsage * 0.10 +
        norm100(primary.counterPickStrength) * 0.10 -
        resourceLightLabel(carryUsage) * 0.16;

      styleCandidates = [
        {
          label: "Carry",
          score: carryTopScore,
        },
        {
          label: "Weakside",
          score: weaksideScore,
        },
        {
          label: "Controller",
          score:
            mapAwareness * 0.24 +
            discipline * 0.22 +
            consistency * 0.18 +
            riskManagement * 0.16 +
            metaReadiness * 0.10 +
            overrideScore(player, "utility", 0.10),
        },
        {
          label: "Scaler",
          score:
            scalingOrientation * 0.46 +
            teamfighting * 0.18 +
            consistency * 0.16 +
            clutchFactor * 0.08 +
            overrideScore(player, "frontToBack", 0.10),
        },
        {
          label: "Splitpush",
          score: splitpushScore,
        },
      ];

      tagCandidates = [
        {
          label: "Lane Dominant",
          score:
            laneControlBias * 0.34 +
            laning * 0.24 +
            aggression * 0.16 +
            carryUsage * 0.12 +
            splitPushBias * 0.08 -
            weaksideScore * 0.32,
        },
        {
          label: "Counterpick",
          score:
            norm100(primary.counterPickStrength) * 0.34 +
            laning * 0.18 +
            carryTopScore * 0.24 +
            splitpushScore * 0.14 -
            weaksideScore * 0.30,
        },
        {
          label: "Weakside",
          score: weaksideScore * 0.86 + consistency * 0.14,
        },
        {
          label: "Scaling",
          score: scalingOrientation * 0.62 + teamfighting * 0.24 + consistency * 0.14,
        },
        {
          label: "Teamfight",
          score: teamfighting * 0.58 + scalingOrientation * 0.14 + clutchFactor * 0.16 + consistency * 0.12,
        },
        {
          label: "Stable",
          score: consistency * 0.50 + riskManagement * 0.30 + discipline * 0.20,
        },
        {
          label: "Flexible",
          score: styleFlex * 0.70 + metaReadiness * 0.30,
        },
      ];
      break;
    }
    case "jungle": {
      styleCandidates = [
        {
          label: "Carry",
          score:
            resourceHeavyLabel(carryUsage) * 0.30 +
            mechanics * 0.16 +
            skirmishing * 0.20 +
            aggression * 0.14 +
            teamfighting * 0.08 +
            highRiskLabel(riskAppetite) * 0.06 +
            overrideScore(player, "carry", 0.16),
        },
        {
          label: "Playmaker",
          score:
            playmakingIntent * 0.28 +
            skirmishing * 0.22 +
            aggression * 0.16 +
            flankPreference * 0.10 +
            highRiskLabel(riskAppetite) * 0.08 +
            invadeFrequency * 0.06 +
            overrideScore(player, "engage", 0.12) +
            overrideScore(player, "dive", 0.10),
        },
        {
          label: "Setup",
          score:
            utilityComfort * 0.20 +
            objectiveControl * 0.22 +
            mapAwareness * 0.18 +
            discipline * 0.12 +
            riskManagement * 0.08 +
            overrideScore(player, "setup", 0.12) +
            overrideScore(player, "tank", 0.08),
        },
        {
          label: "Controller",
          score:
            mapAwareness * 0.24 +
            objectiveControl * 0.24 +
            discipline * 0.18 +
            consistency * 0.16 +
            riskManagement * 0.12 +
            rotationTiming * 0.06,
        },
      ];

      tagCandidates = [
        { label: "Tempo", score: rotationTiming * 0.44 + mapAwareness * 0.30 + playmakingIntent * 0.14 + invadeFrequency * 0.12 },
        { label: "Objective", score: objectiveControl * 0.72 + discipline * 0.10 + mapAwareness * 0.18 },
        { label: "Invader", score: invadeFrequency * 0.74 + aggression * 0.12 + skirmishing * 0.14 },
        { label: "Stable", score: consistency * 0.50 + riskManagement * 0.30 + discipline * 0.20 },
        { label: "Scaling", score: scalingOrientation * 0.70 + teamfighting * 0.30 },
        { label: "High Risk", score: highRiskLabel(riskAppetite) * 0.66 + aggression * 0.20 + skirmishing * 0.14 },
        { label: "Pathing", score: mapAwareness * 0.54 + objectiveControl * 0.22 + rotationTiming * 0.24 },
      ];
      break;
    }
    case "mid": {
      styleCandidates = [
        {
          label: "Carry",
          score:
            carryUsage * 0.34 +
            mechanics * 0.18 +
            teamfighting * 0.14 +
            laning * 0.10 +
            aggression * 0.10 +
            overrideScore(player, "carry", 0.14),
        },
        {
          label: "Playmaker",
          score:
            playmakingIntent * 0.22 +
            skirmishing * 0.18 +
            aggression * 0.18 +
            flankPreference * 0.12 +
            roamBias * 0.10 +
            highRiskLabel(riskAppetite) * 0.08 +
            overrideScore(player, "engage", 0.12),
        },
        {
          label: "Controller",
          score:
            mapAwareness * 0.22 +
            discipline * 0.18 +
            consistency * 0.16 +
            metaReadiness * 0.16 +
            laning * 0.12 +
            riskManagement * 0.10 +
            overrideScore(player, "setup", 0.10),
        },
        {
          label: "Scaler",
          score:
            scalingOrientation * 0.46 +
            teamfighting * 0.16 +
            consistency * 0.12 +
            clutchFactor * 0.08 +
            overrideScore(player, "frontToBack", 0.10),
        },
      ];

      tagCandidates = [
        { label: "Lane Control", score: laneControlBias * 0.58 + laning * 0.42 },
        { label: "Scaling", score: scalingOrientation * 0.70 + teamfighting * 0.30 },
        { label: "Aggressive", score: aggression * 0.50 + highRiskLabel(riskAppetite) * 0.30 + skirmishing * 0.20 },
        { label: "Stable", score: consistency * 0.50 + riskManagement * 0.28 + discipline * 0.22 },
        { label: "Flexible", score: styleFlex * 0.68 + metaReadiness * 0.32 },
        { label: "Roaming", score: roamBias * 0.58 + flankPreference * 0.22 + playmakingIntent * 0.20 },
        { label: "Setup", score: playmakingIntent * 0.26 + mapAwareness * 0.18 + overrideScore(player, "setup", 0.56) },
      ];
      break;
    }
    case "adc": {
      const selfSufficient = (1 - setupDependence) * 0.62 + riskManagement * 0.22 + consistency * 0.16;

      styleCandidates = [
        {
          label: "Carry",
          score:
            carryUsage * 0.34 +
            teamfighting * 0.24 +
            mechanics * 0.14 +
            scalingOrientation * 0.08 +
            overrideScore(player, "carry", 0.12) +
            overrideScore(player, "frontToBack", 0.08),
        },
        {
          label: "Scaler",
          score:
            scalingOrientation * 0.50 +
            teamfighting * 0.20 +
            consistency * 0.14 +
            clutchFactor * 0.06 +
            overrideScore(player, "frontToBack", 0.10),
        },
        {
          label: "Lane Bully",
          score:
            laneControlBias * 0.34 +
            laning * 0.22 +
            aggression * 0.20 +
            highRiskLabel(riskAppetite) * 0.08 +
            overrideScore(player, "poke", 0.16),
        },
        {
          label: "Teamfighter",
          score:
            teamfighting * 0.54 +
            consistency * 0.16 +
            clutchFactor * 0.10 +
            scalingOrientation * 0.12 +
            overrideScore(player, "frontToBack", 0.08),
        },
        {
          label: "Weakside",
          score:
            selfSufficient * 0.46 +
            resourceLightLabel(carryUsage) * 0.24 +
            lowRiskLabel(riskAppetite) * 0.12 +
            safeLanePreference * 0.18,
        },
      ];

      tagCandidates = [
        { label: "Teamfight", score: teamfighting * 0.68 + clutchFactor * 0.16 + scalingOrientation * 0.16 },
        { label: "Scaling", score: scalingOrientation * 0.70 + consistency * 0.12 + teamfighting * 0.18 },
        { label: "Aggressive", score: aggression * 0.50 + highRiskLabel(riskAppetite) * 0.30 + laning * 0.20 },
        { label: "Weakside", score: selfSufficient * 0.54 + resourceLightLabel(carryUsage) * 0.18 + safeLanePreference * 0.28 },
        { label: "Stable", score: consistency * 0.54 + riskManagement * 0.30 + clutchFactor * 0.16 },
        { label: "Self-Sufficient", score: selfSufficient * 0.72 + lowRiskLabel(riskAppetite) * 0.28 },
        { label: "Poke", score: overrideScore(player, "poke", 0.74) + laneControlBias * 0.10 + laning * 0.16 },
      ];
      break;
    }
    case "support": {
      styleCandidates = [
        {
          label: "Facilitator",
          score:
            utilityComfort * 0.28 +
            mapAwareness * 0.18 +
            discipline * 0.12 +
            overrideScore(player, "utility", 0.18) +
            overrideScore(player, "setup", 0.14),
        },
        {
          label: "Engage",
          score:
            playmakingIntent * 0.22 +
            skirmishing * 0.12 +
            teamfighting * 0.10 +
            overrideScore(player, "engage", 0.26) +
            overrideScore(player, "dive", 0.10),
        },
        {
          label: "Enchanter",
          score:
            utilityComfort * 0.24 +
            consistency * 0.10 +
            teamfighting * 0.08 +
            overrideScore(player, "enchanter", 0.24) +
            overrideScore(player, "frontToBack", 0.10),
        },
        {
          label: "Playmaker",
          score:
            playmakingIntent * 0.22 +
            flankPreference * 0.12 +
            aggression * 0.10 +
            roamBias * 0.10 +
            adaptationScore(player, "creativity", 0.14) +
            overrideScore(player, "engage", 0.14),
        },
      ];

      tagCandidates = [
        { label: "Utility", score: utilityComfort * 0.54 + overrideScore(player, "utility", 0.46) },
        { label: "Roaming", score: roamBias * 0.34 + rotationTiming * 0.28 + playmakingIntent * 0.12 + adaptationScore(player, "creativity", 0.12) + overrideScore(player, "engage", 0.14) },
        { label: "Setup", score: playmakingIntent * 0.18 + overrideScore(player, "setup", 0.62) + overrideScore(player, "engage", 0.20) },
        { label: "Peel", score: utilityComfort * 0.16 + consistency * 0.12 + overrideScore(player, "enchanter", 0.44) + overrideScore(player, "frontToBack", 0.28) },
        { label: "Vision", score: mapAwareness * 0.62 + discipline * 0.16 + utilityComfort * 0.22 },
        { label: "Creative", score: adaptationScore(player, "creativity", 0.62) + styleFlex * 0.18 + playmakingIntent * 0.20 },
        { label: "Stable", score: consistency * 0.54 + riskManagement * 0.30 + discipline * 0.16 },
        { label: "Lane Pressure", score: laning * 0.42 + playmakingIntent * 0.22 + overrideScore(player, "engage", 0.14) + overrideScore(player, "poke", 0.22) },
      ];
      break;
    }
  }

  const sortedStyles = sortByScoreDesc(styleCandidates);
  const primaryStyle = sortedStyles[0]?.label ?? "Flexible";
  const secondaryCandidate = sortedStyles[1];
  const secondaryStyle = secondaryCandidate && secondaryCandidate.score >= 0.42
    ? secondaryCandidate.label
    : byRoleFallback[role].secondary;

  const tags = pickTopTagLabels(tagCandidates, [primaryStyle, secondaryStyle], byRoleFallback[role].tags, 3);

  return {
    primary: primaryStyle,
    secondary: secondaryStyle,
    tags,
  };
}
