// FEEDBACK_FIXES §7 / §8 — date pentru UI-ul de draft (pure, fără React): identitatea compoziției
// în cuvinte, atributele echipei, matchup-urile unui campion contra pick-urilor adversarului.

import { championsById } from "@/app/data/champions";
import type { Champion, Role } from "@/app/types/champion";
import { COMP_ATTRIBUTE_INFO, type CompAttribute } from "@/app/types/compAttributes";
import { getMatchupRelations } from "./championMatchups";
import { isCompatible, readCompIdentity, type CompIdentity } from "./compIdentity";
import { getDirectOpponents } from "./compCounter";
import { buildCompVector } from "./draftEvaluator";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { describeMatchupDetailed, type MatchupKind } from "./matchupGrades";

type Assignments = Partial<Record<Role, string>>;

const IDENTITY_LABELS: Record<CompIdentity, string> = {
  dive: "Dive",
  poke: "Poke",
  pick: "Pick",
  "front-to-back": "Front-to-back",
  teamfight: "Teamfight",
  "protect-carry": "Protect the carry",
};

export type IdentitySummary = {
  /** „Dive · clear”, „No clear identity yet”. */
  label: string;
  /** 0..1, pentru bara mică. */
  strength: number;
  /** „+ Pick”: runner-up compatibil, peste prag (fără split). */
  companion: string | null;
  /** „Split: Dive / Poke” (culoarea de warning). */
  split: string | null;
};

/** Pragurile de claritate din raport (aceleași cu nota de Composition). */
function clarityLabel(strength: number): string {
  const [clear, medium] = DRAFT_THINKING_CONFIG.report.composition.strength;
  return strength >= clear ? "clear" : strength >= medium ? "medium" : "weak";
}

export function getIdentitySummary(picks: string[], assignments: Assignments): IdentitySummary {
  const reading = readCompIdentity(picks, assignments);
  if (!picks.length || !reading.dominant) {
    return { label: "No clear identity yet", strength: reading.strength, companion: null, split: null };
  }
  const runnerUp = reading.runnerUp;
  const aboveThreshold = runnerUp ? reading.signals[runnerUp] >= DRAFT_THINKING_CONFIG.identity.threshold : false;
  return {
    label: `${IDENTITY_LABELS[reading.dominant]} · ${clarityLabel(reading.strength)}`,
    strength: reading.strength,
    companion: runnerUp && aboveThreshold && !reading.split && isCompatible(reading.dominant, runnerUp) ? `+ ${IDENTITY_LABELS[runnerUp]}` : null,
    split: reading.split && runnerUp ? `Split: ${IDENTITY_LABELS[reading.dominant]} / ${IDENTITY_LABELS[runnerUp]}` : null,
  };
}

/** Cele 6 atribute din panoul live (§7.2). */
export const TEAM_ATTRIBUTE_KEYS: CompAttribute[] = ["engage", "peel", "frontline", "dive", "poke", "waveclear"];
/** Un atribut e „plin” (bara întreagă) de la această sumă de `offers` pe compoziție. */
const ATTRIBUTE_FULL = 10;

export type TeamAttribute = { key: CompAttribute; label: string; value: number };
export type TeamAttributes = { attributes: TeamAttribute[]; ad: number; ap: number };

/**
 * Atributele echipei (0..10): suma `offers` pe compoziție (vectorul din evaluator), plafonată la 10,
 * plus împărțirea AD / AP din `damageProfile` (mixt = jumătate-jumătate).
 */
export function getTeamAttributes(picks: string[]): TeamAttributes {
  const vector = buildCompVector(picks) as unknown as Record<string, number>;
  let ad = 0;
  let ap = 0;
  for (const id of picks) {
    const profile = championsById[id]?.damageProfile ?? [];
    const hasAd = profile.includes("AD");
    const hasAp = profile.includes("AP");
    if (hasAd && hasAp) {
      ad += 0.5;
      ap += 0.5;
    } else if (hasAd) ad += 1;
    else if (hasAp) ap += 1;
  }
  return {
    attributes: TEAM_ATTRIBUTE_KEYS.map((key) => ({
      key,
      label: COMP_ATTRIBUTE_INFO[key].shortLabel,
      value: Math.max(0, Math.min(ATTRIBUTE_FULL, vector[key] ?? 0)),
    })),
    ad,
    ap,
  };
}

export type ChampionMatchupLine = { label: string; reason: string; kind: MatchupKind };

/**
 * Matchup-urile campionului contra pick-urilor adversarului de pe rolurile pe care le poate juca
 * (botlane 2v2), din perspectiva campionului: „Countered in lane vs Fiora” + motivul.
 */
export function getChampionMatchupsVs(champion: Champion, enemyAssignments: Assignments): ChampionMatchupLine[] {
  const lines: ChampionMatchupLine[] = [];
  const seen = new Set<string>();
  for (const role of champion.roles) {
    for (const opponent of getDirectOpponents(role, enemyAssignments)) {
      const key = `${opponent.id}:${role}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const relations = getMatchupRelations(champion.id, role, opponent.id, opponent.role);
      for (const kind of ["good", "weak"] as const) {
        const relation = kind === "good" ? relations.good : relations.weak;
        if (relation) lines.push({ ...describeMatchupDetailed(relation, kind), kind });
      }
    }
  }
  return lines;
}

/** Atributele (și identitatea) dacă echipa ar lua candidatul: preview-ul din hover (§7.3). */
export function getPickPreview(picks: string[], candidateId: string, assignmentsWithCandidate: Assignments) {
  const before = getTeamAttributes(picks);
  const after = getTeamAttributes([...picks, candidateId]);
  return {
    attributes: after.attributes.map((attribute, index) => ({ ...attribute, delta: attribute.value - before.attributes[index].value })),
    identity: getIdentitySummary([...picks, candidateId], assignmentsWithCandidate),
  };
}
