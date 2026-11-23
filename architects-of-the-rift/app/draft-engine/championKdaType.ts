// KDA_WORLDS_2026 §3.2 — tipul campionului pentru KDA (fallback-ul factorului de campion și raportul pe tip din
// scripts/kda-calibration.ts). Regulile citesc offers (vectorul de compoziție al campionului) și resourceDemand.

import type { Role } from "@/app/types/champion";
import { getResourceDemand } from "./championResource";
import { buildCompVector } from "./draftEvaluator";

export type ChampionKdaType =
  | "support-engage" | "support-enchanter"
  | "mid-assassin" | "mid-control-mage"
  | "jungle-engage"
  | "adc-hyper-carry" | "adc-lane-utility"
  | "other";

/** Factorul relativ la rol pe tip (Worlds 2026, §1.3); „other” = 1. */
export const KDA_TYPE_FACTOR: Record<ChampionKdaType, number> = {
  "support-engage": 0.75,
  "support-enchanter": 1.2,
  "mid-assassin": 0.8,
  "mid-control-mage": 1.05,
  "jungle-engage": 0.85,
  "adc-hyper-carry": 0.85,
  "adc-lane-utility": 1.05,
  other: 1,
};

/** Prag pentru „are atributul” la asasini (dive / backlineAccess / roamPressure), ca la compIdentity (pasul 7). */
const PRESENT_MIN = 3;

export function getChampionKdaType(championId: string, role: Role): ChampionKdaType {
  const vector = buildCompVector([championId]) as unknown as Record<string, number>;
  const value = (key: string) => vector[key] ?? 0;
  switch (role) {
    case "support":
      if (value("engage") >= 4 || value("frontline") >= 3) return "support-engage";
      if (value("peel") >= 4) return "support-enchanter";
      return "other";
    case "mid":
      if (value("burstDamage") >= 4 && (value("dive") >= PRESENT_MIN || value("backlineAccess") >= PRESENT_MIN || value("roamPressure") >= PRESENT_MIN)) {
        return "mid-assassin";
      }
      if (value("scaling") >= 4 || value("waveclear") >= 4 || value("poke") >= 4) return "mid-control-mage";
      return "other";
    case "jungle":
      return value("engage") >= 4 ? "jungle-engage" : "other";
    case "adc":
      return getResourceDemand(championId, role) >= 5 || value("scaling") >= 5 ? "adc-hyper-carry" : "adc-lane-utility";
    default:
      return "other";
  }
}
