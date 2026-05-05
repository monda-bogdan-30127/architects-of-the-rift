// ─── draft-engine/championMasteryDraftSystem.ts ──────────────────────────────
//
// Champion Mastery integration for the draft engine and match simulator.
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Champion, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { players } from "@/app/data/players";
import {
  getChampionGrade,
  getMasteryMultiplier,
  getMasteryContinuousBonus,
  getBanPressureScore,
  getMetaDampeningFactor,
  GRADE_RANK,
  hasMasteryOverride,
} from "@/app/utils/championMasteryUtils";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import type { Side, DraftGameState } from "./draftTypes";
import { getMetaPriorityScore } from "./draftEvaluator";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const playersById = new Map(players.map((p) => [p.id, p]));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPlayer(playerId: string | null | undefined): Player | null {
  if (!playerId) return null;
  return playersById.get(playerId) ?? null;
}

function getRosterPlayerIds(roster: Partial<Record<Role, string>>): string[] {
  return Object.values(roster).filter((id): id is string => Boolean(id));
}

function getPlayerOverallScore(player: Player): number {
  const stats = player.stats;
  const avg = (stats.mec + stats.mac + stats.tfg + stats.clt + stats.con + stats.iq) / 6;
  return clamp(avg / 10, 0, 10);
}

// ─── 1. Continuous mastery bonus (META DAMPENED) ─────────────────────────────

/**
 * Continuous draft bonus from mastery grade — applied to every pick.
 * Off-meta champions get a smaller bonus even with high mastery.
 */
export function getMasteryDraftBonus(
  player: Player | null,
  champion: Champion,
): number {
  if (!player) return 0;
  const grade = getChampionGrade(player, champion.id);
  const rawBonus = getMasteryContinuousBonus(grade);

  // Negative bonuses (penalties for D/F) are NOT dampened — being unable
  // to play a champion isn't more acceptable just because it's off-meta.
  if (rawBonus <= 0) return rawBonus;

  // Positive bonuses are dampened by meta priority
  const metaPriority = getMetaPriorityScore(champion);
  const dampening = getMetaDampeningFactor(metaPriority);
  return rawBonus * dampening;
}

// ─── 2. Signature slot resolution (diminishing returns) ──────────────────────

type SignatureSlot = {
  playerId: string;
  championId: string;
  grade: ChampionMasteryGrade;
  score: number;
};

export function findTopSignatureSlot(args: {
  roster: Partial<Record<Role, string>>;
  availableChampions: Map<string, Champion>;
  unavailable: Set<string>;
}): SignatureSlot | null {
  const candidates: SignatureSlot[] = [];

  for (const playerId of getRosterPlayerIds(args.roster)) {
    const player = getPlayer(playerId);
    if (!player) continue;

    const playerStrength = getPlayerOverallScore(player);

    for (const [championId, champion] of args.availableChampions) {
      if (args.unavailable.has(championId)) continue;
      if (!champion.roles.includes(player.role)) continue;

      const grade = getChampionGrade(player, championId);
      if (grade !== "SS" && grade !== "S") continue;

      const meta = clamp(getMetaPriorityScore(champion), 0, 10);
      const gradeWeight = grade === "SS" ? 1.0 : 0.65;

      // Signature slot ranking is naturally meta-aware via × meta
      const score = playerStrength * meta * gradeWeight;

      candidates.push({ playerId, championId, grade, score });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] ?? null;
}

// ─── 3. Synergy gate ─────────────────────────────────────────────────────────

export function checkSynergyCompatibility(
  candidate: Champion,
  ownPicks: Champion[],
): boolean {
  if (ownPicks.length === 0) return true;

  const candidateOffers = new Set(candidate.offers.map((o) => String(o.type)));
  const teamOffers = new Set<string>();
  for (const pick of ownPicks) {
    for (const offer of pick.offers) {
      teamOffers.add(String(offer.type));
    }
  }

  const shared = [...candidateOffers].filter((o) => teamOffers.has(o)).length;
  const newCategories = [...candidateOffers].filter((o) => !teamOffers.has(o)).length;
  return shared >= 1 || newCategories >= 2;
}

// ─── 4. Signature pull (META DAMPENED) ───────────────────────────────────────

export function getSignaturePullBonus(args: {
  player: Player | null;
  candidate: Champion;
  side: Side;
  pickNumber: number;
  ownPicks: Champion[];
  counterValue: number;
  topSignatureSlot: SignatureSlot | null;
  /** Optional clutch fallback amplifier (1.0 normal, ~1.15 high-stakes). */
  clutchAmplifier?: number;
}): number {
  if (!args.player) return 0;

  const grade = getChampionGrade(args.player, args.candidate.id);
  if (grade !== "SS" && grade !== "S") return 0;

  // Counter-detection guard — if picked as counter, no signature pull
  if (args.counterValue >= 1.5) return 0;

  // Late-draft "leftover" guard
  if (args.pickNumber >= 9) return 0;

  // Diminishing returns
  const isTopSlot =
    args.topSignatureSlot?.playerId === args.player.id &&
    args.topSignatureSlot?.championId === args.candidate.id;

  if (!isTopSlot) {
    return grade === "SS" ? 0.6 : 0.3;
  }

  const synergyOK = checkSynergyCompatibility(args.candidate, args.ownPicks);

  const phaseFactor =
    args.pickNumber <= 3 ? 1.0 :
    args.pickNumber <= 6 ? 0.7 :
    0.4;

  const sideFactor =
    (args.side === "blue" && args.pickNumber === 1) ? 1.2 :
    (args.side === "red"  && args.pickNumber >= 7)  ? 0.7 :
    1.0;

  let base = grade === "SS" ? 2.5 : 1.0;
  if (!synergyOK) base *= 0.3;

  // Meta dampening: don't draft around an off-meta SS too hard
  const metaPriority = getMetaPriorityScore(args.candidate);
  const metaDampening = getMetaDampeningFactor(metaPriority);

  // Clutch amplifier (capped to avoid breaking the draft)
  const clutch = clamp(args.clutchAmplifier ?? 1.0, 1.0, 1.20);

  return base * phaseFactor * sideFactor * metaDampening * clutch;
}

// ─── 5. Combined draft bonus ─────────────────────────────────────────────────

export function getMasteryPickBonus(args: {
  player: Player | null;
  candidate: Champion;
  side: Side;
  pickNumber: number;
  ownPicks: Champion[];
  counterValue: number;
  topSignatureSlot: SignatureSlot | null;
  clutchAmplifier?: number;
}): {
  total: number;
  continuous: number;
  signaturePull: number;
  grade: ChampionMasteryGrade;
} {
  if (!args.player) {
    return { total: 0, continuous: 0, signaturePull: 0, grade: "F" };
  }

  const grade = getChampionGrade(args.player, args.candidate.id);
  const continuous = getMasteryDraftBonus(args.player, args.candidate);
  const signaturePull = getSignaturePullBonus(args);

  return {
    total: continuous + signaturePull,
    continuous,
    signaturePull,
    grade,
  };
}

// ─── 6. Ban scoring helpers ──────────────────────────────────────────────────

export function getEnemyMasteryBanBonus(args: {
  candidate: Champion;
  enemyRoster: Partial<Record<Role, string>>;
}): {
  bonus: number;
  bestEnemyGrade: ChampionMasteryGrade;
  bestEnemyPlayerId: string | null;
} {
  let maxPressure = 0;
  let bestGrade: ChampionMasteryGrade = "F";
  let bestPlayerId: string | null = null;

  for (const playerId of getRosterPlayerIds(args.enemyRoster)) {
    const player = getPlayer(playerId);
    if (!player) continue;

    const grade = getChampionGrade(player, args.candidate.id);
    const pressure = getBanPressureScore(player, args.candidate.id);

    if (pressure > maxPressure) {
      maxPressure = pressure;
      bestGrade = grade;
      bestPlayerId = playerId;
    }
  }

  // Meta dampening: don't ban off-meta signatures hard
  const metaPriority = getMetaPriorityScore(args.candidate);
  const metaDampening = getMetaDampeningFactor(metaPriority);

  return {
    bonus: maxPressure * 4.5 * metaDampening,
    bestEnemyGrade: bestGrade,
    bestEnemyPlayerId: bestPlayerId,
  };
}

export function getOwnMasteryBanPenalty(args: {
  candidate: Champion;
  ownRoster: Partial<Record<Role, string>>;
}): {
  penalty: number;
  bestOwnGrade: ChampionMasteryGrade;
  bestOwnPlayerId: string | null;
} {
  let bestRank = 0;
  let bestGrade: ChampionMasteryGrade = "F";
  let bestPlayerId: string | null = null;

  for (const playerId of getRosterPlayerIds(args.ownRoster)) {
    const player = getPlayer(playerId);
    if (!player) continue;

    const grade = getChampionGrade(player, args.candidate.id);
    const rank = GRADE_RANK[grade];

    if (rank > bestRank) {
      bestRank = rank;
      bestGrade = grade;
      bestPlayerId = playerId;
    }
  }

  // Meta dampening on self-protection: an off-meta SS we own is less critical
  // to protect (we wouldn't pick it anyway). Meta dampening reduces penalty.
  const metaPriority = getMetaPriorityScore(args.candidate);
  const metaDampening = getMetaDampeningFactor(metaPriority);

  let penalty = 0;
  switch (bestGrade) {
    case "SS": penalty = -8.0 * metaDampening; break;
    case "S":  penalty = -4.0 * metaDampening; break;
    case "A":  penalty = -1.5 * metaDampening; break;
    default:   penalty = 0;
  }

  return {
    penalty,
    bestOwnGrade: bestGrade,
    bestOwnPlayerId: bestPlayerId,
  };
}

// ─── 7. Sim integration ──────────────────────────────────────────────────────

/**
 * Sim multiplier — NOT meta-dampened.
 * Execution skill on a champion is real regardless of patch popularity.
 */
export function applyMasteryToFit(
  player: Player | null,
  championId: string | null,
  baseFit: number,
): number {
  if (!player || !championId) return baseFit;
  const grade = getChampionGrade(player, championId);
  if (grade === "F") return baseFit * 0.3;
  return clamp(baseFit * getMasteryMultiplier(grade), 0, 10);
}

/**
 * Variance modulation — NOT meta-dampened.
 * Consistency from mastery is real regardless of meta.
 */
export function getMasteryVarianceFactor(
  player: Player | null,
  championId: string | null,
): number {
  if (!player || !championId) return 1.0;
  const grade = getChampionGrade(player, championId);

  switch (grade) {
    case "SS": return 0.825;
    case "S":  return 0.90;
    case "A":  return 0.95;
    case "B":  return 1.00;
    case "C":  return 1.09;
    case "D":  return 1.175;
    case "F":  return 1.25;
  }
}

// ─── 8. Cached signature slot lookup ─────────────────────────────────────────

let _topSlotCache: {
  key: string;
  result: SignatureSlot | null;
} | null = null;

export function getCachedTopSignatureSlot(args: {
  game: DraftGameState;
  side: Side;
  roster: Partial<Record<Role, string>>;
  availableChampions: Map<string, Champion>;
}): SignatureSlot | null {
  const unavailable = new Set([
    ...args.game.bansBlue,
    ...args.game.bansRed,
    ...args.game.picksBlue,
    ...args.game.picksRed,
  ]);

  const rosterKey = Object.entries(args.roster)
    .map(([r, id]) => `${r}:${id ?? ""}`)
    .sort()
    .join(",");
  const unavailKey = [...unavailable].sort().join(",");
  const key = `${args.side}|${rosterKey}|${unavailKey}`;

  if (_topSlotCache?.key === key) return _topSlotCache.result;

  const result = findTopSignatureSlot({
    roster: args.roster,
    availableChampions: args.availableChampions,
    unavailable,
  });

  _topSlotCache = { key, result };
  return result;
}

export function clearSignatureSlotCache(): void {
  _topSlotCache = null;
}

// ─── 9. Diagnostics ──────────────────────────────────────────────────────────

export function getMasteryDraftDiagnostic(args: {
  player: Player | null;
  candidate: Champion;
  side: Side;
  pickNumber: number;
  ownPicks: Champion[];
  counterValue: number;
  topSignatureSlot: SignatureSlot | null;
  clutchAmplifier?: number;
}): {
  grade: ChampionMasteryGrade;
  hasOverride: boolean;
  continuous: number;
  signaturePull: number;
  isTopSlot: boolean;
  synergyOK: boolean;
  metaDampening: number;
  reason: string;
} {
  if (!args.player) {
    return {
      grade: "F",
      hasOverride: false,
      continuous: 0,
      signaturePull: 0,
      isTopSlot: false,
      synergyOK: false,
      metaDampening: 1.0,
      reason: "no player projected",
    };
  }

  const grade = getChampionGrade(args.player, args.candidate.id);
  const hasOverride = hasMasteryOverride(args.player.id);
  const continuous = getMasteryDraftBonus(args.player, args.candidate);
  const signaturePull = getSignaturePullBonus(args);
  const isTopSlot =
    args.topSignatureSlot?.playerId === args.player.id &&
    args.topSignatureSlot?.championId === args.candidate.id;
  const synergyOK = checkSynergyCompatibility(args.candidate, args.ownPicks);
  const metaDampening = getMetaDampeningFactor(getMetaPriorityScore(args.candidate));

  let reason = `grade=${grade}`;
  if (signaturePull > 1.5) reason += " signature-pull";
  else if (signaturePull > 0) reason += " minor-signature";
  if (metaDampening < 0.8) reason += " off-meta-dampened";
  if (!hasOverride) reason += " (auto-fallback)";

  return {
    grade,
    hasOverride,
    continuous,
    signaturePull,
    isTopSlot,
    synergyOK,
    metaDampening,
    reason,
  };
}