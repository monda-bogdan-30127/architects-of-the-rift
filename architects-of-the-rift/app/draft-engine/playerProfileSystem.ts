import { playerProfileOverrides } from "@/app/data/playerProfileOverrides";
import type { Player, PlayerAdaptationProfile, PlayerArchetypeAffinity, PlayerPhaseProfile } from "@/app/types/player";

const clamp = (value: number, min = 0, max = 10) => Math.max(min, Math.min(max, value));
const n = (value: number | undefined, fallback = 50) => (typeof value === "number" ? value / 10 : fallback / 10);

function merge<T extends object>(base: T, override?: Partial<T>): T {
  return { ...base, ...(override ?? {}) };
}

export function derivePlayerPhaseProfile(player: Player): PlayerPhaseProfile {
  if (player.phaseProfile) return player.phaseProfile;
  const override = playerProfileOverrides[player.id];
  if (override?.phaseProfile) return override.phaseProfile;

  const primary = player.advancedProfile?.primary;
  const playstyle = player.advancedProfile?.playstyle;
  const hidden = player.advancedProfile?.hiddenTraits;

  return {
    early: {
      laneControl: clamp((n(primary?.laning) + n(primary?.mechanics) + n(playstyle?.laneControlBias)) / 3),
      skirmish: clamp((n(primary?.skirmishing) + n(primary?.aggression)) / 2),
      stability: clamp((n(primary?.consistency) + n(primary?.discipline)) / 2),
      mapPlay: clamp((n(primary?.mapAwareness) + n(primary?.rotationTiming)) / 2),
      teamfight: clamp((n(primary?.teamfighting) + n(primary?.positioning)) / 2),
      clutch: clamp((n(primary?.clutchFactor) + n(hidden?.composure, 60)) / 2),
    },
    mid: {
      laneControl: clamp((n(primary?.laning) + n(primary?.mapAwareness)) / 2),
      skirmish: clamp((n(primary?.skirmishing) + n(primary?.adaptability)) / 2),
      stability: clamp((n(primary?.consistency) + n(primary?.riskManagement)) / 2),
      mapPlay: clamp((n(primary?.mapAwareness) + n(primary?.objectiveControl) + n(primary?.rotationTiming)) / 3),
      teamfight: clamp((n(primary?.teamfighting) + n(primary?.positioning)) / 2),
      clutch: clamp((n(primary?.clutchFactor) + n(primary?.currentForm)) / 2),
    },
    late: {
      laneControl: clamp((n(primary?.laning) + n(primary?.discipline)) / 2),
      skirmish: clamp((n(primary?.skirmishing) + n(primary?.teamfighting)) / 2),
      stability: clamp((n(primary?.consistency) + n(primary?.discipline) + n(hidden?.composure, 60)) / 3),
      mapPlay: clamp((n(primary?.objectiveControl) + n(primary?.mapAwareness)) / 2),
      teamfight: clamp((n(primary?.teamfighting) + n(primary?.positioning) + n(primary?.clutchFactor)) / 3),
      clutch: clamp((n(primary?.clutchFactor) + n(hidden?.composure, 60) + n(primary?.currentForm)) / 3),
    },
  };
}

export function derivePlayerArchetypeAffinity(player: Player): PlayerArchetypeAffinity {
  if (player.archetypeAffinity) return player.archetypeAffinity;
  const override = playerProfileOverrides[player.id];

  const primary = player.advancedProfile?.primary;
  const sub = player.advancedProfile?.substats;
  const playstyle = player.advancedProfile?.playstyle;
  const derived: PlayerArchetypeAffinity = {
    engage: clamp((n(primary?.playmakingBias) + n(sub?.counterPrep) + n(playstyle?.playmakingIntent)) / 3),
    enchanter: clamp((n(sub?.utilityComfort) + n(primary?.discipline) + n(primary?.mapAwareness)) / 3),
    carry: clamp((n(sub?.carryComfort) + n(primary?.mechanics) + n(primary?.teamfighting)) / 3),
    tank: clamp((n(primary?.discipline) + n(primary?.riskManagement) + n(sub?.utilityComfort)) / 3),
    poke: clamp((n(primary?.laning) + n(sub?.spacing) + n(primary?.mapAwareness)) / 3),
    setup: clamp((n(primary?.playmakingBias) + n(primary?.mapAwareness) + n(sub?.targetSelection)) / 3),
    utility: clamp((n(sub?.utilityComfort) + n(primary?.objectiveControl) + n(primary?.discipline)) / 3),
    dive: clamp((n(primary?.aggression) + n(primary?.skirmishing) + n(sub?.skirmishInstinct)) / 3),
    frontToBack: clamp((n(primary?.teamfighting) + n(primary?.positioning) + n(primary?.riskManagement)) / 3),
  };
  return merge(derived, override?.archetypeAffinity);
}

export function derivePlayerAdaptationProfile(player: Player): PlayerAdaptationProfile {
  if (player.adaptationProfile) return player.adaptationProfile;
  const override = playerProfileOverrides[player.id];

  const primary = player.advancedProfile?.primary;
  const sub = player.advancedProfile?.substats;
  const hidden = player.advancedProfile?.hiddenTraits;
  const derived: PlayerAdaptationProfile = {
    draftFlex: clamp((n(primary?.adaptability) + n(sub?.styleFlex) + n(primary?.championPoolSize)) / 3),
    creativity: clamp((n(primary?.playmakingBias) + n(sub?.styleFlex) + n(hidden?.leadership, 55)) / 3),
    composure: clamp((n(hidden?.composure, 60) + n(primary?.discipline) + n(primary?.clutchFactor)) / 3),
    matchupLearning: clamp((n(primary?.counterPickStrength) + n(sub?.counterPrep) + n(primary?.adaptability)) / 3),
  };
  return merge(derived, override?.adaptationProfile);
}
