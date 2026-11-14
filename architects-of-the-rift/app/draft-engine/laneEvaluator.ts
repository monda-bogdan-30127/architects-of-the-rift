import type { Role } from "@/app/types/champion";
import { ROLE_ORDER } from "./draftTypes";
import type { LanePhaseResult, LaneRoleBreakdown } from "./matchSimulationTypes";
import {
  average,
  championBlindSafety,
  clamp,
  getChampionByIdSafe,
  getPlayerByIdSafe,
  playerChampionDraftFit,
  playerSkill,
  playerChampionMatchupHistoryEdge,
  round1,
} from "./matchSimulationUtils";
import { getHistoryAdjustedLaneBonus } from "./playerHistoryEvaluator";
import { getLaneMatchupEdge } from "./matchupScoring";
import { getChampionStatsForRole } from "./championRoleStatsSystem";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import type { LaneOrder } from "./laneOrder";
import { getActiveTrait } from "@/app/utils/playerTraitUtils";

function earlyStatScore(championId: string | null, role: Role) {
  const champion = getChampionByIdSafe(championId);
  if (!champion) return 5;

  const stats = getChampionStatsForRole(champion, role);
  const cs = clamp(((stats.csDiffAt15 ?? 0) + 15) / 30, 0, 1) * 10;
  const gold = clamp(((stats.goldDiffAt15 ?? 0) + 700) / 1400, 0, 1) * 10;
  const xp = clamp(((stats.xpDiffAt15 ?? 0) + 500) / 1000, 0, 1) * 10;

  return clamp(cs * 0.3 + gold * 0.45 + xp * 0.25, 0, 10);
}

function jungleInfluence(role: Role, playerId: string | null, championId: string | null) {
  if (role !== "jungle") return 0;
  const player = getPlayerByIdSafe(playerId);
  const champion = getChampionByIdSafe(championId);
  if (!player || !champion) return 5;

  const roam = champion.offers
    .filter((offer) => ["roamPressure", "engage", "earlyPrio", "reliableCC"].includes(offer.type))
    .reduce((sum, offer) => sum + offer.strength, 0);

  const macro = playerSkill("macro", playerId);
  const execution = playerSkill("execution", playerId);

  return clamp(roam * 0.68 + macro * 0.82 + execution * 0.35, 0, 10);
}

type LaneContext = {
  blueRoster: Partial<Record<Role, string>>;
  redRoster: Partial<Record<Role, string>>;
  assignmentsBlue: Partial<Record<Role, string>>;
  assignmentsRed: Partial<Record<Role, string>>;
  /** PLAYER_TRAITS §7.3 — cine a ales primul pe fiecare lane (lipsă = fără efectele de blind / counter). */
  laneOrder?: { blue: LaneOrder; red: LaneOrder };
  /** PLAYER_TRAITS §7.4 — roluri pe care un series_adapter a pierdut lane-ul contra aceluiași jucător în jocul anterior. */
  adapted?: { blue: Partial<Record<Role, boolean>>; red: Partial<Record<Role, boolean>> };
};

/**
 * PLAYER_TRAITS §7.4 — trait-urile de lane ale jucătorului ajustează termenul de matchup:
 *   pozitiv: × (1 + counterLaneBoost × int) pentru counter_specialist pe counter, + dominatorBoost × int pentru
 *     lane_dominator; multiplicatorul total ≤ matchupBoostCap;
 *   negativ: × (1 − cea mai mare reducere) dintre blind_safe pe blind (blindSafeShield) și matchup_resilient
 *     (resilientShield), fără cumul;
 *   counter_specialist pe blind: − counterBlindPenalty la scorul de lane.
 * Fără trait-uri active, factorul e 1 și penalizarea 0 (comportament identic).
 */
function laneTraitEffect(playerId: string | null, matchup: number, order: "blind" | "counter" | undefined, adapted = false) {
  const T = DRAFT_THINKING_CONFIG.traits;
  const player = getPlayerByIdSafe(playerId);
  const result = { factor: 1, penalty: 0, notes: [] as string[] };
  if (!player) return result;
  const counter = getActiveTrait(player, "counter_specialist");
  const blindSafe = getActiveTrait(player, "blind_safe");
  const resilient = getActiveTrait(player, "matchup_resilient");
  const dominator = getActiveTrait(player, "lane_dominator");
  const adapter = adapted ? getActiveTrait(player, "series_adapter") : null;
  if (matchup > 0) {
    let boost = 0;
    if (counter && order === "counter") {
      boost += T.counterLaneBoost * counter.intensity;
      result.notes.push("counter-pick edge");
    }
    if (dominator) {
      boost += T.dominatorBoost * dominator.intensity;
      result.notes.push("lane dominance");
    }
    result.factor = Math.min(T.matchupBoostCap, 1 + boost);
  } else if (matchup < 0) {
    const blindShield = blindSafe && order === "blind" ? T.blindSafeShield * blindSafe.intensity : 0;
    const resilientShield = resilient ? T.resilientShield * resilient.intensity : 0;
    const adapterShield = adapter ? T.seriesAdapterLaneShield * adapter.intensity : 0;
    const shield = Math.max(blindShield, resilientShield, adapterShield);
    if (shield > 0) {
      result.factor = 1 - shield;
      result.notes.push(shield === resilientShield ? "lane held" : shield === adapterShield ? "adapted" : "blind held");
    }
  }
  if (counter && order === "blind") {
    result.penalty = T.counterBlindPenalty;
    result.notes.push("forced to blind");
  }
  return result;
}

/**
 * PLAYER_TRAITS §8.3 — junglerul pe o parte a hărții: topside_jungler → + jungleSideBoost × intensity pe top și mid,
 * − jungleSideAwayPenalty pe adc și support; botside_jungler invers. Lanerul ajutat cu resource_hog primește încă
 * + jungleSideHogBonus; un weakside_ready de pe partea opusă nu primește malusul (e obișnuit fără jungler).
 */
function jungleSideEffect(role: Role, roster: Partial<Record<Role, string>>): { delta: number; note: string | null } {
  if (role === "jungle") return { delta: 0, note: null };
  const jungler = getPlayerByIdSafe(roster.jungle ?? null);
  const side = getActiveTrait(jungler, "topside_jungler") ?? getActiveTrait(jungler, "botside_jungler");
  if (!jungler || !side) return { delta: 0, note: null };
  const T = DRAFT_THINKING_CONFIG.traits;
  const laner = getPlayerByIdSafe(roster[role] ?? null);
  const topside = role === "top" || role === "mid";
  const helped = side.id === "topside_jungler" ? topside : !topside;
  if (helped) {
    const hog = getActiveTrait(laner, "resource_hog") ? T.jungleSideHogBonus : 0;
    return { delta: T.jungleSideBoost * side.intensity + hog, note: hog ? "jungle plays for the carry" : "jungle help" };
  }
  if (getActiveTrait(laner, "weakside_ready")) return { delta: 0, note: "weakside held" };
  return { delta: -T.jungleSideAwayPenalty, note: "jungle away" };
}

function buildRoleBreakdown(
  role: Role,
  bluePlayerId: string | null,
  redPlayerId: string | null,
  blueChampionId: string | null,
  redChampionId: string | null,
  lane: LaneContext
): LaneRoleBreakdown {
  // DRAFT_SIM_ALIGNMENT §3.1: aceeași funcție ca în evaluatorul de draft (counterScore).
  const blueMatchup = getLaneMatchupEdge(role, lane.assignmentsBlue, lane.assignmentsRed, lane.blueRoster, lane.redRoster);
  const redMatchup = getLaneMatchupEdge(role, lane.assignmentsRed, lane.assignmentsBlue, lane.redRoster, lane.blueRoster);
  const blueTrait = laneTraitEffect(bluePlayerId, blueMatchup, lane.laneOrder?.blue[role], lane.adapted?.blue[role]);
  const redTrait = laneTraitEffect(redPlayerId, redMatchup, lane.laneOrder?.red[role], lane.adapted?.red[role]);
  const blueSide = jungleSideEffect(role, lane.blueRoster);
  const redSide = jungleSideEffect(role, lane.redRoster);

  const blueDraftFit = playerChampionDraftFit(bluePlayerId, blueChampionId);
  const redDraftFit = playerChampionDraftFit(redPlayerId, redChampionId);

  // Scorurile de jucător relativ la ligă (10 = jucătorul median, vezi skillAtLegacyBaseline).
  const blueExec = playerSkill("execution", bluePlayerId);
  const redExec = playerSkill("execution", redPlayerId);
  const blueLaning = playerSkill("laning", bluePlayerId);
  const redLaning = playerSkill("laning", redPlayerId);
  const blueConsistency = playerSkill("consistency", bluePlayerId);
  const redConsistency = playerSkill("consistency", redPlayerId);

  const blueEarly = earlyStatScore(blueChampionId, role);
  const redEarly = earlyStatScore(redChampionId, role);

  const blueBlind = championBlindSafety(getChampionByIdSafe(blueChampionId), role);
  const redBlind = championBlindSafety(getChampionByIdSafe(redChampionId), role);

  const blueHistoryMatchup = playerChampionMatchupHistoryEdge(
    bluePlayerId,
    blueChampionId,
    redChampionId
  );
  const redHistoryMatchup = playerChampionMatchupHistoryEdge(
    redPlayerId,
    redChampionId,
    blueChampionId
  );
  const blueHistoryLaneBonus = getHistoryAdjustedLaneBonus(
    bluePlayerId,
    blueChampionId,
    redChampionId
  );
  const redHistoryLaneBonus = getHistoryAdjustedLaneBonus(
    redPlayerId,
    redChampionId,
    blueChampionId
  );

  const blueBase = clamp(
    blueEarly * 0.26 +
      blueDraftFit * 0.2 +
      blueExec * 0.1 +
      blueLaning * 0.16 +
      blueConsistency * 0.08 +
      blueBlind * 0.06 +
      jungleInfluence(role, bluePlayerId, blueChampionId) * 0.14 +
      blueMatchup * 0.42 * DRAFT_THINKING_CONFIG.simulation.laneMatchupScale * blueTrait.factor +
      blueHistoryMatchup * 0.3 +
      blueHistoryLaneBonus * 0.7 -
      blueTrait.penalty +
      blueSide.delta,
    0,
    10
  );

  const redBase = clamp(
    redEarly * 0.26 +
      redDraftFit * 0.2 +
      redExec * 0.1 +
      redLaning * 0.16 +
      redConsistency * 0.08 +
      redBlind * 0.06 +
      jungleInfluence(role, redPlayerId, redChampionId) * 0.14 +
      redMatchup * 0.42 * DRAFT_THINKING_CONFIG.simulation.laneMatchupScale * redTrait.factor +
      redHistoryMatchup * 0.3 +
      redHistoryLaneBonus * 0.7 -
      redTrait.penalty +
      redSide.delta,
    0,
    10
  );

  const volatility = round1(
    clamp(
      average([
        Math.abs(blueMatchup),
        Math.abs(redMatchup),
        Math.abs(blueExec - redExec),
        Math.abs(blueEarly - redEarly),
      ]) * 0.75,
      1,
      10
    )
  );

  const noteParts: string[] = [];
  if (blueMatchup - redMatchup >= 2) noteParts.push("blue matchup edge");
  if (redMatchup - blueMatchup >= 2) noteParts.push("red matchup edge");
  if (blueHistoryLaneBonus - redHistoryLaneBonus >= 0.45) noteParts.push("blue player comfort edge");
  if (redHistoryLaneBonus - blueHistoryLaneBonus >= 0.45) noteParts.push("red player comfort edge");
  if (Math.abs(blueEarly - redEarly) >= 1.5) noteParts.push("early priority split");
  if (role === "jungle" && Math.abs(blueExec - redExec) >= 1.5) noteParts.push("pathing influence");
  // PLAYER_TRAITS §7.4: „blue counter-pick edge”, „red blind held”, „blue lane dominance” …
  for (const note of blueTrait.notes) noteParts.push(`blue ${note}`);
  for (const note of redTrait.notes) noteParts.push(`red ${note}`);
  // PLAYER_TRAITS §8.3: „blue jungle help”, „red jungle away”, „blue jungle plays for the carry”.
  if (blueSide.note) noteParts.push(`blue ${blueSide.note}`);
  if (redSide.note) noteParts.push(`red ${redSide.note}`);

  return {
    role,
    blueChampionId,
    redChampionId,
    bluePlayerId,
    redPlayerId,
    blueScore: round1(blueBase),
    redScore: round1(redBase),
    volatility,
    note: noteParts.join(", ") || "stable lane",
  };
}

export function evaluateLanePhase(args: {
  blueRoster: Partial<Record<Role, string>>;
  redRoster: Partial<Record<Role, string>>;
  assignmentsBlue: Partial<Record<Role, string>>;
  assignmentsRed: Partial<Record<Role, string>>;
  laneOrder?: { blue: LaneOrder; red: LaneOrder };
  adapted?: { blue: Partial<Record<Role, boolean>>; red: Partial<Record<Role, boolean>> };
}): LanePhaseResult {
  const roles = ROLE_ORDER.map((role) =>
    buildRoleBreakdown(
      role,
      args.blueRoster[role] ?? null,
      args.redRoster[role] ?? null,
      args.assignmentsBlue[role] ?? null,
      args.assignmentsRed[role] ?? null,
      args
    )
  );

  const blueScore = round1(average(roles.map((role) => role.blueScore)));
  const redScore = round1(average(roles.map((role) => role.redScore)));
  const volatility = round1(average(roles.map((role) => role.volatility)));

  return {
    blueScore,
    redScore,
    volatility,
    roles,
  };
}
