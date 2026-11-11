// DRAFT_REALISM §8 — stilul echipei, din `TeamIdentity` (toate cele 42 de echipe au knob-uri 1–10):
// multiplicatori pe bucket-uri și pe urgența intențiilor, angajamentul față de plan, varianța alegerii
// finale (§10), toleranța la off-meta și răspunsul la favoriții de sezon.

import type { Team } from "@/app/types/team";
import type { BucketId, IntentId } from "./draftTypes";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";

const STYLE = DRAFT_THINKING_CONFIG.style;

export type TeamStyle = {
  /** Multiplicatori pe bucket-uri (power doar în faza 1, vezi `phaseOnePower`). */
  bucket: Partial<Record<BucketId, number>>;
  /** `bucket.power` se aplică doar în pick1-open / pick1-close (earlyPriorityBias). */
  phaseOnePower: number;
  intentUrgency: Record<IntentId, number>;
  /** Scalează alinierea la plan, coerența, win condition-ul și penalizarea de split (discipline). */
  planCommitment: number;
  /** counterpickBias → cât ține echipa solo lane-urile pentru counter-pick (counterpickPreservation, `info`). */
  counterpickPreservation: number;
  /** Scalează penalizarea de blind risk (risc mare → acceptă blind-uri riscante). */
  blindRiskFactor: number;
  /** §10 — fereastra și temperatura alegerii finale. */
  variance: { temperature: number; window: number };
  /** Scalează offMetaPenalty (creativity). */
  offMetaTolerance: number;
  /** DRAFT_THINKING §7.4 — ce face cu favoriții de sezon ai adversarului. */
  seasonResponse: "ban" | "plan" | "balanced";
  /** Planurile din `preferredStyles` primesc +preferredPlanBonus în alegerea planului. */
  preferredStyles: string[];
};

/** Knob 1–10 → factor: k = 5 → 1.0; k = 1 → 0.76; k = 10 → 1.3. */
export const knobFactor = (knob: number | undefined) => STYLE.knobBase + STYLE.knobStep * (knob ?? 5);

export function getTeamStyle(team: Team | null, args: { seriesPressure: { eliminationGame: boolean } }): TeamStyle {
  const identity = team?.identity;
  // Presiunea seriei: meci de eliminare → mai mult comfort, mai mult risc (temporar).
  const elimination = args.seriesPressure.eliminationGame;
  const comfortBias = (identity?.comfortBias ?? 5) + (elimination ? STYLE.eliminationComfort : 0);
  const riskLevel = (identity?.riskLevel ?? 5) + (elimination ? STYLE.eliminationRisk : 0);
  const creativity = identity?.creativity ?? 5;

  const early = knobFactor(identity?.earlyPriorityBias);
  const counter = knobFactor(identity?.counterpickBias);
  const comfort = knobFactor(comfortBias);
  return {
    bucket: { counter, comfort, info: knobFactor(identity?.flexBias) },
    phaseOnePower: early,
    intentUrgency: {
      "secure-priority": early,
      answer: counter,
      hide: counter,
      comfort,
      deny: 1,
      "build-identity": 1,
    },
    planCommitment: knobFactor(identity?.discipline),
    counterpickPreservation: Math.max(0.2, 1 + STYLE.counterpickPreservationStep * ((identity?.counterpickBias ?? 5) - 5)),
    blindRiskFactor: Math.max(0.3, 2 - knobFactor(riskLevel)),
    variance: {
      window: STYLE.windowBase + STYLE.windowStep * creativity,
      temperature: STYLE.temperatureBase + STYLE.temperatureStep * creativity,
    },
    offMetaTolerance: STYLE.offMetaBase - STYLE.offMetaStep * creativity,
    seasonResponse: riskLevel >= STYLE.seasonPlanRisk ? "plan" : riskLevel <= STYLE.seasonBanRisk ? "ban" : "balanced",
    preferredStyles: (identity?.preferredStyles ?? []).filter((style) => style !== "balanced"),
  };
}
