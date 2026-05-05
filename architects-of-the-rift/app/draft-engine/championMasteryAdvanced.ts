// ─── draft-engine/championMasteryAdvanced.ts ─────────────────────────────────
//
// Advanced champion mastery features:
//   1. High-stakes detection (clutch fallback amplifier)
//   2. Pool depth pressure (post-ban roster quality)
//   3. Target banning (player-focused ban strategy)
//   4. Draft reading (predictive picks based on enemy mastery)
//
// All features are meta-aware: low-meta champions don't generate strong
// bonuses even when mastery is high.
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Champion, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { players } from "@/app/data/players";
import {
    getChampionGrade,
    getResolvedChampionPool,
    getMasteryMultiplier,
    getMetaDampeningFactor,
    GRADE_RANK,
} from "@/app/utils/championMasteryUtils";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";
import { getMetaPriorityScore } from "./draftEvaluator";
import { getChampionMap } from "./championPool";

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

// ═══ 1. HIGH-STAKES DETECTION ════════════════════════════════════════════════
//
// Returns an amplifier (1.0 to 1.20) used to strengthen signature pulls in
// clutch situations. In Game 5 of a Bo5, players gravitate to their most
// trusted champions — the AI should reflect that.

export type ClutchContext = {
    amplifier: number;          // 1.0 - 1.20, applied to signaturePullBonus
    isElimination: boolean;     // true → both teams in must-win mode
    blueAtElimination: boolean; // blue team is in must-win
    redAtElimination: boolean;  // red team is in must-win
    reason: string;             // human-readable for diagnostics
};

/**
 * Counts wins for a side from completed prior games.
 */
function countWins(series: ActiveDraftSeries, side: Side): number {
    let count = 0;
    for (const g of series.games ?? []) {
        if (!g.completed) continue;
        if (g.winnerSide === side) count++;
    }
    return count;
}

/**
 * Detects high-stakes contexts and returns a clutch amplifier.
 *
 * Logic:
 *   - Bo5 Game 5 (any score, but typically 2-2)        → 1.20  (max amp)
 *   - Bo5 with one team at 2 wins (i.e. losing team    → 1.10  (mid amp,
 *     is 1 loss away from elimination)                          loser only,
 *                                                               but applied
 *                                                               to both for
 *                                                               simplicity)
 *   - Bo3 Game 3                                       → 1.20  (max amp)
 *   - Otherwise                                        → 1.00  (no effect)
 *
 * The amplifier is capped at 1.20 to prevent the draft engine from being
 * dominated by signature picks regardless of meta/counter signals.
 */
export function getClutchContext(
    series: ActiveDraftSeries | null | undefined,
): ClutchContext {
    if (!series) {
        return {
            amplifier: 1.0,
            isElimination: false,
            blueAtElimination: false,
            redAtElimination: false,
            reason: "no series",
        };
    }

    const bo = series.bo ?? 1;
    const currentGame = series.currentGameNumber ?? 1;
    const blueWins = countWins(series, "blue");
    const redWins = countWins(series, "red");

    // Bo5 Game 5 — always max amp
    if (bo === 5 && currentGame === 5) {
        return {
            amplifier: 1.20,
            isElimination: true,
            blueAtElimination: true,
            redAtElimination: true,
            reason: "Bo5 G5 — both teams in elimination",
        };
    }

    // Bo3 Game 3 — always max amp
    if (bo === 3 && currentGame === 3) {
        return {
            amplifier: 1.20,
            isElimination: true,
            blueAtElimination: true,
            redAtElimination: true,
            reason: "Bo3 G3 — both teams in elimination",
        };
    }

    // Bo5 with one team at 2 wins — losing team in elimination
    if (bo === 5 && (blueWins === 2 || redWins === 2)) {
        const blueAtElim = redWins === 2;
        const redAtElim = blueWins === 2;
        return {
            amplifier: 1.10,
            isElimination: true,
            blueAtElimination: blueAtElim,
            redAtElimination: redAtElim,
            reason: `Bo5 series at ${blueWins}-${redWins} — ${blueAtElim ? "blue" : "red"} faces elimination`,
        };
    }

    return {
        amplifier: 1.0,
        isElimination: false,
        blueAtElimination: false,
        redAtElimination: false,
        reason: "regular game",
    };
}

/**
 * Side-specific amplifier — only the side facing elimination gets the boost.
 * Falls back to symmetric amplifier in Bo5 G5 and Bo3 G3 (both sides clutch).
 */
export function getClutchAmplifierForSide(
    series: ActiveDraftSeries | null | undefined,
    side: Side,
): number {
    const ctx = getClutchContext(series);
    if (!ctx.isElimination) return 1.0;

    if (ctx.blueAtElimination && ctx.redAtElimination) return ctx.amplifier;
    if (side === "blue" && ctx.blueAtElimination) return ctx.amplifier;
    if (side === "red" && ctx.redAtElimination) return ctx.amplifier;
    return 1.0;
}

// ═══ 2. POOL DEPTH PRESSURE ══════════════════════════════════════════════════
//
// After bans, evaluate the quality of each player's REMAINING pool.
// If a player is reduced to mostly C/D champions, their effective draft
// power drops significantly.

export type PoolDepthSnapshot = {
    topGrade: ChampionMasteryGrade;       // best remaining grade
    averageMultiplier: number;             // mean of remaining multipliers
    metaWeightedMultiplier: number;        // mean weighted by champion meta
    draftableCount: number;                // how many champs left in pool
    weakeningRatio: number;                // 0 = unaffected, 1 = pool destroyed
};

/**
 * Computes the quality of a player's pool after subtracting bans/picks.
 * Used by:
 *   - Target banning (to measure ban impact)
 *   - Draft reading (to predict what they'll pick)
 *   - Strategic ban scoring (to decide diminishing returns)
 */
export function getPostBanPoolQuality(
    player: Player,
    unavailable: Set<string>,
): PoolDepthSnapshot {
    const fullPool = getResolvedChampionPool(player);
    if (fullPool.length === 0) {
        return {
            topGrade: "F",
            averageMultiplier: 0,
            metaWeightedMultiplier: 0,
            draftableCount: 0,
            weakeningRatio: 1,
        };
    }

    const championMap = getChampionMap();
    const available = fullPool.filter((p) => !unavailable.has(p.champion));

    if (available.length === 0) {
        return {
            topGrade: "F",
            averageMultiplier: 0,
            metaWeightedMultiplier: 0,
            draftableCount: 0,
            weakeningRatio: 1,
        };
    }

    // Top grade in remaining pool
    const topGrade = available[0]!.grade;

    // Plain average multiplier
    const avgMult = available.reduce((s, e) => s + e.multiplier, 0) / available.length;

    // Meta-weighted average — multiply each entry by champion's meta priority
    let metaWeightedSum = 0;
    let metaWeightTotal = 0;
    for (const entry of available) {
        const champion = championMap.get(entry.champion);
        if (!champion) continue;
        const meta = clamp(getMetaPriorityScore(champion), 0, 10) / 10;
        metaWeightedSum += entry.multiplier * meta;
        metaWeightTotal += meta;
    }
    const metaWeighted = metaWeightTotal > 0 ? metaWeightedSum / metaWeightTotal : avgMult;

    // Weakening ratio — compares full pool's metaWeighted avg to current
    let fullMetaSum = 0;
    let fullMetaTotal = 0;
    for (const entry of fullPool) {
        const champion = championMap.get(entry.champion);
        if (!champion) continue;
        const meta = clamp(getMetaPriorityScore(champion), 0, 10) / 10;
        fullMetaSum += entry.multiplier * meta;
        fullMetaTotal += meta;
    }
    const fullMetaWeighted = fullMetaTotal > 0 ? fullMetaSum / fullMetaTotal : avgMult;
    const weakeningRatio = clamp(
        1 - (metaWeighted / Math.max(0.001, fullMetaWeighted)),
        0, 1,
    );

    return {
        topGrade,
        averageMultiplier: avgMult,
        metaWeightedMultiplier: metaWeighted,
        draftableCount: available.length,
        weakeningRatio,
    };
}

/**
 * Aggregates pool depth across a roster — useful for evaluating overall team
 * draft strength after current bans.
 */
export function getRosterPoolWeakening(args: {
    roster: Partial<Record<Role, string>>;
    unavailable: Set<string>;
}): {
    averageWeakening: number;        // 0 = roster intact, 1 = devastated
    worstPlayerId: string | null;    // most affected player
    worstPlayerWeakening: number;
} {
    let totalWeakening = 0;
    let count = 0;
    let worstPlayerId: string | null = null;
    let worstWeakening = 0;

    for (const playerId of getRosterPlayerIds(args.roster)) {
        const player = getPlayer(playerId);
        if (!player) continue;

        const snapshot = getPostBanPoolQuality(player, args.unavailable);
        totalWeakening += snapshot.weakeningRatio;
        count++;

        if (snapshot.weakeningRatio > worstWeakening) {
            worstWeakening = snapshot.weakeningRatio;
            worstPlayerId = playerId;
        }
    }

    return {
        averageWeakening: count > 0 ? totalWeakening / count : 0,
        worstPlayerId,
        worstPlayerWeakening: worstWeakening,
    };
}

// ═══ 3. TARGET BANNING ═══════════════════════════════════════════════════════
//
// The classic "let's ruin this player's draft" strategy. Calculates how much
// THIS specific ban would weaken a single enemy player's pool, weighted by
// player strength and champion meta priority.

export type TargetBanAnalysis = {
    bonus: number;                          // additive to ban score (0-3.5 typical)
    targetPlayerId: string | null;          // who we're targeting
    targetGrade: ChampionMasteryGrade;      // their grade on this candidate
    weakeningDelta: number;                 // how much their pool drops
    reason: string;                         // diagnostic
};

/**
 * Computes the target-banning bonus for a candidate champion.
 *
 * Iterates each enemy player and asks: if we ban THIS champion, how much
 * does THIS player's pool weaken? Returns the maximum impact found.
 *
 * Meta-aware: banning an off-meta SS gives less bonus than banning a meta
 * SS, even if the player's grade is identical. Enforces "ban what they'd
 * actually pick" instead of "ban what they're best at".
 *
 * Sensitive to player strength: target-banning a star player generates more
 * bonus than target-banning a role player.
 */
export function getTargetBanningBonus(args: {
    candidate: Champion;
    enemyRoster: Partial<Record<Role, string>>;
    currentBans: Set<string>;       // bans already locked
    currentPicks: Set<string>;      // picks already locked
}): TargetBanAnalysis {
    const baseUnavailable = new Set<string>([...args.currentBans, ...args.currentPicks]);

    let bestImpact = 0;
    let bestPlayer: string | null = null;
    let bestGrade: ChampionMasteryGrade = "F";
    let bestDelta = 0;

    const candidateMeta = clamp(getMetaPriorityScore(args.candidate), 0, 10);
    const metaNorm = candidateMeta / 10;

    for (const playerId of getRosterPlayerIds(args.enemyRoster)) {
        const player = getPlayer(playerId);
        if (!player) continue;

        const grade = getChampionGrade(player, args.candidate.id);

        // Only A or higher creates target-ban incentive — B and below means
        // they'd happily pick something else, no need to "target" this.
        if (GRADE_RANK[grade] < GRADE_RANK.A) continue;

        // Pool quality before this ban (with already-locked unavailable)
        const beforeSnapshot = getPostBanPoolQuality(player, baseUnavailable);

        // Pool quality after this ban
        const afterUnavailable = new Set(baseUnavailable);
        afterUnavailable.add(args.candidate.id);
        const afterSnapshot = getPostBanPoolQuality(player, afterUnavailable);

        // Drop in meta-weighted multiplier
        const delta = beforeSnapshot.metaWeightedMultiplier - afterSnapshot.metaWeightedMultiplier;
        if (delta <= 0) continue;

        const playerStrength = getPlayerOverallScore(player);

        // Combined impact: drop × player strength × meta priority of this ban
        // Each factor is bounded so the total stays in a reasonable additive range
        const impact = delta * playerStrength * metaNorm * 8.0;

        if (impact > bestImpact) {
            bestImpact = impact;
            bestPlayer = playerId;
            bestGrade = grade;
            bestDelta = delta;
        }
    }

    // Cap the bonus to keep it from dominating ban scoring
    const cappedBonus = clamp(bestImpact, 0, 3.5);

    return {
        bonus: cappedBonus,
        targetPlayerId: bestPlayer,
        targetGrade: bestGrade,
        weakeningDelta: bestDelta,
        reason: bestPlayer
            ? `target ${bestPlayer} on ${bestGrade}, meta=${candidateMeta.toFixed(1)}`
            : "no target ban incentive",
    };
}

// ═══ 4. DRAFT READING (PREDICTIVE PICKS) ═════════════════════════════════════
//
// For each enemy player who hasn't picked yet, predict their most likely
// champion based on mastery × meta × availability. Used for:
//   - Predictive banning (ban what we expect them to pick)
//   - Counter-pick preparation (draft anti-X if we predict X)

export type PickPrediction = {
    playerId: string;
    role: Role;
    championId: string;
    grade: ChampionMasteryGrade;
    confidence: number; // 0-1, from softmax over candidate scores
    alternativesCount: number;
};

/**
 * Predicts the most likely next pick for each enemy player who hasn't
 * picked yet. Confidence reflects how dominant the top pick is over
 * their other available options.
 */
export function predictEnemyPicks(args: {
    enemyRoster: Partial<Record<Role, string>>;
    enemyPicksSoFar: string[];
    unavailable: Set<string>;       // bans + all picks (both teams)
    rolesAlreadyPicked: Set<Role>;  // enemy roles already picked
}): PickPrediction[] {
    const championMap = getChampionMap();
    const predictions: PickPrediction[] = [];

    for (const [role, playerId] of Object.entries(args.enemyRoster) as [Role, string | undefined][]) {
        if (!playerId) continue;
        if (args.rolesAlreadyPicked.has(role)) continue;

        const player = getPlayer(playerId);
        if (!player) continue;

        const pool = getResolvedChampionPool(player);
        const available = pool.filter((p) => !args.unavailable.has(p.champion));
        if (available.length === 0) continue;

        // Score each candidate by mastery_multiplier × meta
        type Scored = { championId: string; grade: ChampionMasteryGrade; score: number };
        const scored: Scored[] = [];

        for (const entry of available) {
            const champion = championMap.get(entry.champion);
            if (!champion) continue;
            if (!champion.roles.includes(role)) continue;

            const meta = clamp(getMetaPriorityScore(champion), 0, 10) / 10;
            const score = entry.multiplier * (0.4 + 0.6 * meta);
            scored.push({ championId: entry.champion, grade: entry.grade, score });
        }

        if (scored.length === 0) continue;

        scored.sort((a, b) => b.score - a.score);
        const top = scored[0]!;

        // Confidence: top score / sum of top 3 scores (softmax-like)
        const topN = scored.slice(0, 3);
        const totalTopN = topN.reduce((s, e) => s + e.score, 0);
        const confidence = totalTopN > 0 ? top.score / totalTopN : 0.5;

        predictions.push({
            playerId,
            role,
            championId: top.championId,
            grade: top.grade,
            confidence,
            alternativesCount: scored.length - 1,
        });
    }

    return predictions;
}

/**
 * Bonus for banning a champion that we PREDICT the enemy would pick.
 *
 * Stronger when:
 *   - Confidence is high (their pool funnels them to this pick)
 *   - The grade is SS/S (it's their signature, not just a meta pick)
 *   - The champion is meta (they'd actually consider it)
 *
 * Capped at +2.5 to avoid stacking with regular ban pressure.
 */
export function getPredictiveBanBonus(args: {
    candidate: Champion;
    predictions: PickPrediction[];
}): { bonus: number; predictedFor: string | null; confidence: number } {
    const match = args.predictions.find((p) => p.championId === args.candidate.id);
    if (!match) {
        return { bonus: 0, predictedFor: null, confidence: 0 };
    }

    const gradeWeight =
        match.grade === "SS" ? 1.0 :
            match.grade === "S" ? 0.7 :
                match.grade === "A" ? 0.4 :
                    0.2;

    const metaPriority = clamp(getMetaPriorityScore(args.candidate), 0, 10);
    const metaDampening = getMetaDampeningFactor(metaPriority);

    // Up to +2.5 for SS, high confidence, meta pick
    const bonus = clamp(
        match.confidence * gradeWeight * metaDampening * 3.0,
        0, 2.5,
    );

    return {
        bonus,
        predictedFor: match.playerId,
        confidence: match.confidence,
    };
}

/**
 * Bonus for picking a champion that COUNTERS one of our predicted enemy picks.
 *
 * If we predict Bard from Keria (high confidence) and we're picking a
 * champion that's strong against Bard, we get a bonus for "preparing the
 * counter" before they lock it in.
 *
 * Note: this is a cheaper, additive heuristic — full counter-pick logic
 * already exists in scorePickCandidate (counterValue). This adds a layer
 * for picks that counter PREDICTED but not yet locked enemies.
 *
 * Capped at +1.2 to remain a tiebreaker, not a dominant signal.
 */
export function getPredictiveCounterBonus(args: {
    candidate: Champion;
    predictions: PickPrediction[];
}): { bonus: number; counters: string[] } {
    if (args.predictions.length === 0) return { bonus: 0, counters: [] };

    let bonus = 0;
    const counters: string[] = [];

    for (const pred of args.predictions) {
        if (pred.confidence < 0.40) continue; // only high-confidence predictions

        // Does our candidate counter the predicted pick?
        const goodVsRel = args.candidate.goodVs?.find(
            (rel) => rel.championId === pred.championId,
        );
        if (!goodVsRel) continue;

        // Higher confidence × stronger counter × predicted-pick grade
        const gradeFactor =
            pred.grade === "SS" ? 1.0 :
                pred.grade === "S" ? 0.7 :
                    0.4;

        const contribution = (goodVsRel.score ?? 0) * pred.confidence * gradeFactor * 0.18;
        bonus += contribution;
        counters.push(pred.championId);
    }

    return {
        bonus: clamp(bonus, 0, 1.2),
        counters,
    };
}

// ═══ 5. UNIFIED ADVANCED CONTEXT (cached for scoring loops) ═════════════════
//
// Computing predictions and pool snapshots is moderately expensive. We cache
// per-decision so all candidates in a single AI turn share the work.

export type AdvancedMasteryContext = {
    clutch: ClutchContext;
    enemyPredictions: PickPrediction[];
    enemyPoolWeakening: ReturnType<typeof getRosterPoolWeakening>;
};

let _advancedContextCache: { key: string; ctx: AdvancedMasteryContext } | null = null;

export function getCachedAdvancedContext(args: {
    game: DraftGameState;
    side: Side;
    series: ActiveDraftSeries;
    enemyRoster: Partial<Record<Role, string>>;
}): AdvancedMasteryContext {
    const unavailable = new Set([
        ...args.game.bansBlue,
        ...args.game.bansRed,
        ...args.game.picksBlue,
        ...args.game.picksRed,
    ]);

    const enemyPicks = args.side === "blue" ? args.game.picksRed : args.game.picksBlue;
    const championMap = getChampionMap();
    const rolesAlreadyPicked = new Set<Role>();
    for (const id of enemyPicks) {
        const champ = championMap.get(id);
        if (!champ) continue;
        for (const role of champ.roles) rolesAlreadyPicked.add(role);
    }

    const rosterKey = Object.entries(args.enemyRoster)
        .map(([r, id]) => `${r}:${id ?? ""}`).sort().join(",");
    const unavailKey = [...unavailable].sort().join(",");
    const key = `${args.series.seriesId}|g${args.series.currentGameNumber}|${args.side}|${rosterKey}|${unavailKey}`;

    if (_advancedContextCache?.key === key) return _advancedContextCache.ctx;

    const ctx: AdvancedMasteryContext = {
        clutch: getClutchContext(args.series),
        enemyPredictions: predictEnemyPicks({
            enemyRoster: args.enemyRoster,
            enemyPicksSoFar: enemyPicks,
            unavailable,
            rolesAlreadyPicked,
        }),
        enemyPoolWeakening: getRosterPoolWeakening({
            roster: args.enemyRoster,
            unavailable,
        }),
    };

    _advancedContextCache = { key, ctx };
    return ctx;
}

export function clearAdvancedContextCache(): void {
    _advancedContextCache = null;
}