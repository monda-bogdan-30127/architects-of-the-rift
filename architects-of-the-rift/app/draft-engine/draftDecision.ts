// DRAFT_REALISM §3 — pipeline-ul de decizie al AI-ului la draft:
// întâi ce e imposibil (filtre), apoi ce e forțat, apoi ce vrea echipa (intenții → ponderi), apoi cu ce.
//
//   ctx      = buildDraftContext(...)          o singură dată per acțiune
//   valid    = applyHardFilters(pool, ctx)
//   forced   = getForcedAction(pool, ctx)
//   intents  = evaluateIntents(ctx)
//   weights  = getBucketWeights(ctx, intents)
//   ranked   = valid → scoreCandidate(c, ctx, weights), sortat
//   ales     = chooseFinal(ranked, ctx)

import type { Champion } from "@/app/types/champion";
import type {
  ActiveDraftSeries,
  DraftAiConfig,
  DraftCandidateBreakdown,
  DraftGameState,
  DraftSave,
  DraftStep,
} from "./draftTypes";
import { DEFAULT_AI_CONFIG } from "./draftTypes";
import { buildDraftContext, type DraftContext } from "./draftContext";
import {
  getPickCandidatePool,
  getPickHardFilter,
  isBlockedPick,
  scoreBanCandidate,
  scorePickCandidate,
} from "./draftAI";
import { UNIT_BAN_WEIGHTS, UNIT_PICK_WEIGHTS, type BucketWeights } from "./draftBuckets";
import { MUSTWITH_CONFIG, resolveMustWithLock, type EligiblePartner } from "./mustWithPriority";
import { describeForcedOffPool, describeMustWithLock } from "./draftDecisionExplainer";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { roll } from "./draftVariationSystem";

import {
  getCachedIntents,
  getIntentMultiplier,
  getScarcity,
  INTENT_BUCKET,
  isScarcePoolChampion,
  type Intent,
} from "./draftIntents";

// ─── Observator de decizii (harness: scripts/draft-trace.ts, draft-calibration.ts) ──
export type DraftDecisionObservation = {
  step: DraftStep;
  game: DraftGameState;
  series: ActiveDraftSeries;
  /** Candidații scorați, sortați (gol pentru acțiunile forțate înainte de scorare). */
  ranked: DraftCandidateBreakdown[];
  chosen: DraftCandidateBreakdown | null;
};
let decisionObserver: ((observation: DraftDecisionObservation) => void) | null = null;
/** Doar pentru harness: nu schimbă decizia, primește lista scorată după fiecare acțiune AI. */
export function setDraftDecisionObserver(observer: ((observation: DraftDecisionObservation) => void) | null) {
  decisionObserver = observer;
}

// ─── Scor ────────────────────────────────────────────────────────────────────
export function scoreCandidate(
  candidate: Champion,
  ctx: DraftContext,
  weights: BucketWeights,
  intents: readonly Intent[] = [],
): DraftCandidateBreakdown {
  const entry = ctx.step.action === "ban" ? scoreBanCandidate(candidate, ctx, weights) : scorePickCandidate(candidate, ctx, weights);
  // §7: intenția decisivă conduce draftul — candidații fără nimic în bucket-ul ei sunt penalizați.
  const main = intents[0];
  if (main && main.urgency >= DRAFT_THINKING_CONFIG.intents.decisiveThreshold) {
    const bucket = INTENT_BUCKET[main.id];
    if ((entry.buckets?.[bucket] ?? 0) <= 0) {
      return {
        ...entry,
        totalScore: entry.totalScore - DRAFT_THINKING_CONFIG.intents.offIntentPenalty,
        reasonTags: [...(entry.reasonTags ?? []), "off-intent"],
      };
    }
  }
  return entry;
}

/** Un candidat scorat în afara pipeline-ului (scenarii, UI), cu ponderile pasului. */
export function scoreDraftCandidate(
  candidate: Champion,
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig = DEFAULT_AI_CONFIG
): DraftCandidateBreakdown {
  const ctx = buildDraftContext(step, game, series, save, config);
  const intents = evaluateIntents(ctx);
  return withIntents(scoreCandidate(candidate, ctx, getBucketWeights(ctx, intents), intents), intents);
}

function byTotal(a: DraftCandidateBreakdown, b: DraftCandidateBreakdown) {
  const primary = b.totalScore - a.totalScore;
  if (Math.abs(primary) > 0.01) return primary;
  return applyRealisticPickTiebreaker(a, b);
}

function applyRealisticPickTiebreaker(a: DraftCandidateBreakdown, b: DraftCandidateBreakdown) {
  const roleCoverageDiff = (b.planBias ?? 0) - (a.planBias ?? 0);
  if (Math.abs(roleCoverageDiff) > 0.01) return roleCoverageDiff;

  const counterPreservationDiff = (b.counterpickPreservationBonus ?? 0) - (a.counterpickPreservationBonus ?? 0);
  if (Math.abs(counterPreservationDiff) > 0.01) return counterPreservationDiff;

  const flexDiff = (b.flexBonus ?? 0) - (a.flexBonus ?? 0);
  if (Math.abs(flexDiff) > 0.01) return flexDiff;

  return 0;
}

// ─── Intenții și ponderi (§5, §7, §8) ────────────────────────────────────────
/** §7 — intențiile echipei la pasul curent (cache pe context: se calculează o dată per acțiune). */
export function evaluateIntents(ctx: DraftContext): Intent[] {
  return getCachedIntents(ctx);
}

/** Ponderea fazei (§5) pentru fiecare bucket; intențiile (§7) și stilul (§8) se adaugă peste. */
export function getPhaseWeights(ctx: DraftContext): BucketWeights {
  const phases = DRAFT_THINKING_CONFIG.phases;
  if (ctx.step.action === "ban") {
    const phase = ctx.phase === "ban2" ? phases.ban.ban2 : phases.ban.ban1;
    return { ...UNIT_BAN_WEIGHTS, ...phase };
  }
  const pickPhase = ctx.phase === "pick1-open" || ctx.phase === "pick1-close" || ctx.phase === "pick2" || ctx.phase === "last-pick" ? ctx.phase : "pick2";
  return { ...UNIT_PICK_WEIGHTS, ...phases.pick[pickPhase] };
}

/** weight[b] = faza × stil (§8) × (1 + boost × Σ urgency/10 a intențiilor legate de b). */
export function getBucketWeights(ctx: DraftContext, intents: readonly Intent[]): BucketWeights {
  const weights = getPhaseWeights(ctx);
  const phaseOne = ctx.phase === "pick1-open" || ctx.phase === "pick1-close";
  for (const bucket of Object.keys(weights) as (keyof BucketWeights)[]) {
    if (bucket === "hygiene") continue;
    // Stilul (§8) contează la pick; `power` (earlyPriorityBias) doar în faza 1, `counter` (counterpickBias)
    // doar în pick2 / last-pick: în faza 1 ar trage spre counter-pick-uri imediate pe solo lane-uri,
    // exact opusul lui „păstrez solo lane-ul pentru counter-pick” (scenariul §15.8).
    const style =
      ctx.step.action !== "pick" ? 1
        : bucket === "power" ? (phaseOne ? ctx.style.phaseOnePower : 1)
          : bucket === "counter" ? (phaseOne ? 1 : ctx.style.bucket.counter ?? 1)
            : ctx.style.bucket[bucket] ?? 1;
    weights[bucket] = (weights[bucket] ?? 1) * style * getIntentMultiplier(intents, bucket);
  }
  return weights;
}

function withIntents(entry: DraftCandidateBreakdown, intents: readonly Intent[]): DraftCandidateBreakdown {
  return intents.length ? { ...entry, intents: intents.map(({ id, urgency, reason }) => ({ id, urgency, reason })) } : entry;
}

// ─── Filtre dure (§3.2) ──────────────────────────────────────────────────────
type FilteredPool = { candidates: Champion[]; blocked: { champion: Champion; tag: string }[] };

export function applyHardFilters(pool: Champion[], ctx: DraftContext): FilteredPool {
  const ownPartnerIds = new Set(ctx.mustWith.ownPartners.map((partner) => partner.partnerId));

  if (ctx.step.action === "ban") {
    // §5.5: nu-ți bana partenerul eligibil al unui campion deja luat.
    // DRAFT_THINKING §2.4: în faza 1 nici membrii celui mai bun duo propriu (clar peste al doilea).
    // DRAFT_REALISM §7.1: nici ultimele opțiuni ≥ B ale unui jucător propriu cu pool rar (fearless).
    const scarceOwn = getScarcity(ctx).own;
    const ownScarceIds = scarceOwn.length
      ? pool.filter((champion) => isScarcePoolChampion(champion, ctx.own.roster, scarceOwn)).map((champion) => champion.id)
      : [];
    const protectedIds = new Set([...ownPartnerIds, ...ownScarceIds, ...(ctx.phase === "ban1" ? ctx.mustWith.ownDuo.protectedIds : [])]);
    let banPool = pool;
    if (protectedIds.size > 0) {
      const unprotected = pool.filter((champion) => !protectedIds.has(champion.id));
      if (unprotected.length) banPool = unprotected;
    }
    // Pre-filtru ieftin: top 30 după meta + ban-uri; favoriții de sezon ai adversarului intră mereu.
    const candidates = [...banPool]
      .map((champion) => ({ champion, priority: (champion.stats?.prioScore ?? 0) + (champion.stats?.bans ?? 0) * 0.5 }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 30)
      .map((entry) => entry.champion);
    const seasonIds = new Set(ctx.season.responses.flatMap((response) => (response.kind === "ignore" ? [] : [response.championId])));
    const included = new Set(candidates.map((champion) => champion.id));
    for (const champion of banPool) {
      if (seasonIds.has(champion.id) && !included.has(champion.id)) candidates.push(champion);
    }
    return { candidates, blocked: [] };
  }

  // Pick: pre-filtrul de pool (top 50, parteneri mustWith, B+ pe rolurile libere), apoi rol / mastery.
  const candidates: Champion[] = [];
  const blocked: FilteredPool["blocked"] = [];
  for (const champion of getPickCandidatePool(pool, ctx.step, ctx.game, ctx.series, ctx.save, ownPartnerIds)) {
    const tag = getPickHardFilter(champion, ctx);
    if (tag) blocked.push({ champion, tag });
    else candidates.push(champion);
  }
  return { candidates, blocked };
}

// ─── Acțiuni forțate (§3.3) ──────────────────────────────────────────────────
function withMustWithLock(breakdown: DraftCandidateBreakdown, lock: EligiblePartner): DraftCandidateBreakdown {
  const mustWithLock = { anchorId: lock.anchorId, partnerId: lock.partnerId, grade: lock.grade };
  return {
    ...breakdown,
    mustWithLock,
    reasonTags: [...(breakdown.reasonTags ?? []), "mustwith-lock"],
    explanation: [...(breakdown.explanation ?? []), describeMustWithLock(mustWithLock, lock.isBotPair)],
  };
}

/** §5.2 / 4.3: botlane mustWith = override, înainte de pre-filtru și de shortlist. */
export function getForcedAction(pool: Champion[], ctx: DraftContext, weights: BucketWeights): DraftCandidateBreakdown | null {
  if (ctx.step.action !== "pick") return null;
  const lock = resolveMustWithLock(ctx.mustWith.own);
  const lockedCandidate = lock ? pool.find((champion) => champion.id === lock.partnerId) : undefined;
  if (!lock || !lockedCandidate) return null;
  const breakdown = scoreCandidate(lockedCandidate, ctx, weights);
  return isBlockedPick(breakdown) ? null : withMustWithLock(breakdown, lock);
}

// ─── Alegerea finală (§10) ───────────────────────────────────────────────────
/** `choiceRank` = locul alegerii în lista sortată (0 = primul). */
function withChoiceRank(chosen: DraftCandidateBreakdown | null, ranked: DraftCandidateBreakdown[]) {
  if (!chosen) return null;
  const index = ranked.indexOf(chosen);
  return index >= 0 ? { ...chosen, choiceRank: index } : chosen;
}

/**
 * §10 — shortlist = candidații cu totalScore ≥ best − window (max 5), p(i) ∝ exp((score_i − best) / temperature),
 * alegere deterministă prin roll(seed) pe distribuția cumulativă.
 */
export function chooseSoftmax(ranked: DraftCandidateBreakdown[], window: number, temperature: number, seed: string): DraftCandidateBreakdown | null {
  const best = ranked[0];
  if (!best) return null;
  const shortlist = ranked.filter((entry) => entry.totalScore >= best.totalScore - window).slice(0, DRAFT_THINKING_CONFIG.choice.maxShortlist);
  if (shortlist.length <= 1) return best;
  const weights = shortlist.map((entry) => Math.exp((entry.totalScore - best.totalScore) / Math.max(0.05, temperature)));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let threshold = roll(seed) * total;
  for (let index = 0; index < shortlist.length; index += 1) {
    threshold -= weights[index];
    if (threshold <= 0) return shortlist[index];
  }
  return shortlist[shortlist.length - 1];
}

export function chooseFinal(ranked: DraftCandidateBreakdown[], ctx: DraftContext): DraftCandidateBreakdown | null {
  const { series, game, step } = ctx;
  if (step.action === "pick") {
    // §1.5: un candidat cu D intră în shortlist doar dacă e pe primul loc.
    const valid = ranked.filter((entry, index) => index === 0 || !entry.reasonTags?.includes("mastery-d"));
    const seed = `${series.seriesId}:${series.currentGameNumber}:${game.phaseIndex}:${step.side}`;

    // §5.4: partenerul non-bot al unei ancore proprii e ales cu nonBotLockChance (determinist).
    // Fără o excepție permisă (counter nota 5 / pick SS, `nonBotOverride`): oriunde ar fi în listă — bonusul
    // fix nu mai garanta locul 1 după ce intențiile (§7) amplifică bucket-urile. Cu excepție: doar dacă e primul.
    const isNonBotPartner = (entry: DraftCandidateBreakdown) =>
      ctx.mustWith.ownPartners.find((partner) => !partner.isBotPair && partner.partnerId === entry.championId);
    const partnerEntry = ctx.mustWith.nonBotOverride ? (valid[0] && isNonBotPartner(valid[0]) ? valid[0] : undefined) : valid.find(isNonBotPartner);
    const nonBotPartner = partnerEntry ? isNonBotPartner(partnerEntry) : undefined;
    if (partnerEntry && nonBotPartner && roll(`${seed}:mustwith`) < MUSTWITH_CONFIG.nonBotLockChance) {
      return withMustWithLock(partnerEntry, nonBotPartner);
    }
    const { window, temperature } = ctx.style.variance;
    return withChoiceRank(chooseSoftmax(valid, window, temperature, seed), valid);
  }

  // §9.3: la ban, aceeași alegere, cu fereastră mai mică și temperatura × 0.7.
  const banSeed = `${series.seriesId}:${series.currentGameNumber}:${game.phaseIndex}:ban:${step.side}`;
  const CHOICE = DRAFT_THINKING_CONFIG.choice;
  // Fereastra de ban = banWindow la creativity 5, proporțională cu fereastra stilului (o fereastră fixă tăia
  // varianța echipelor creative: scenariul §15.9).
  const STYLE = DRAFT_THINKING_CONFIG.style;
  const windowAtFive = STYLE.windowBase + STYLE.windowStep * 5;
  const banWindow = CHOICE.banWindow * (ctx.style.variance.window / windowAtFive);
  return withChoiceRank(chooseSoftmax(ranked, banWindow, ctx.style.variance.temperature * CHOICE.banTemperatureFactor, banSeed), ranked);
}

// ─── Pipeline ────────────────────────────────────────────────────────────────
export function decideDraftAction(
  pool: Champion[],
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig,
  rankedOut: DraftCandidateBreakdown[] = []
): DraftCandidateBreakdown | null {
  if (!pool.length) return null;
  const ctx = buildDraftContext(step, game, series, save, config);
  const intents = evaluateIntents(ctx);
  const weights = getBucketWeights(ctx, intents);

  const forced = getForcedAction(pool, ctx, weights);
  if (forced) return withIntents(forced, intents);

  const { candidates, blocked } = applyHardFilters(pool, ctx);
  const ranked = candidates.map((candidate) => scoreCandidate(candidate, ctx, weights, intents)).sort(byTotal);
  rankedOut.push(...ranked);

  if (step.action === "pick" && !ranked.length) {
    // §1.5: niciun candidat valid (ban-uri + fearless au golit pool-urile) → cel mai bun
    // dintre cei excluși doar pentru mastery, marcat `forced-off-pool`.
    const scoredBlocked = blocked
      .filter((entry) => entry.tag !== "invalid-role-map")
      .map((entry) => scoreCandidate(entry.champion, ctx, weights, intents))
      .sort(byTotal);
    rankedOut.push(...scoredBlocked);
    const forcedOff =
      scoredBlocked.find((entry) => !entry.reasonTags?.includes("breaks-own-pick")) ?? scoredBlocked[0];
    if (!forcedOff) return null;
    return withIntents(
      {
        ...forcedOff,
        reasonTags: [...(forcedOff.reasonTags ?? []), "forced-off-pool"],
        explanation: [...(forcedOff.explanation ?? []), describeForcedOffPool(forcedOff.projectedPlayerId ?? null, forcedOff.championId)],
      },
      intents
    );
  }

  const chosen = chooseFinal(ranked, ctx);
  return chosen ? withIntents(chosen, intents) : null;
}

/** Punctul de intrare (prin `getAiChoice`): wrapper subțire peste `decideDraftAction`. */
export function chooseAiAction(
  pool: Champion[],
  step: DraftStep,
  game: DraftGameState,
  series: ActiveDraftSeries,
  save: DraftSave | null,
  config: DraftAiConfig = DEFAULT_AI_CONFIG
): DraftCandidateBreakdown | null {
  const ranked: DraftCandidateBreakdown[] = [];
  const chosen = decideDraftAction(pool, step, game, series, save, config, ranked);
  decisionObserver?.({ step, game, series, ranked, chosen });
  return chosen;
}
