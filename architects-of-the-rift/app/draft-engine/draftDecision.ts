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
import { chooseFromAdaptiveShortlist, roll } from "./draftVariationSystem";

type Intent = NonNullable<DraftCandidateBreakdown["intents"]>[number];

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
export function scoreCandidate(candidate: Champion, ctx: DraftContext, weights: BucketWeights): DraftCandidateBreakdown {
  return ctx.step.action === "ban" ? scoreBanCandidate(candidate, ctx, weights) : scorePickCandidate(candidate, ctx, weights);
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
  return withIntents(scoreCandidate(candidate, ctx, getBucketWeights(ctx, intents)), intents);
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
export function evaluateIntents(_ctx: DraftContext): Intent[] {
  return [];
}

export function getBucketWeights(ctx: DraftContext, _intents: Intent[]): BucketWeights {
  return ctx.step.action === "ban" ? { ...UNIT_BAN_WEIGHTS } : { ...UNIT_PICK_WEIGHTS };
}

function withIntents(entry: DraftCandidateBreakdown, intents: Intent[]): DraftCandidateBreakdown {
  return intents.length ? { ...entry, intents } : entry;
}

// ─── Filtre dure (§3.2) ──────────────────────────────────────────────────────
type FilteredPool = { candidates: Champion[]; blocked: { champion: Champion; tag: string }[] };

export function applyHardFilters(pool: Champion[], ctx: DraftContext): FilteredPool {
  const ownPartnerIds = new Set(ctx.mustWith.ownPartners.map((partner) => partner.partnerId));

  if (ctx.step.action === "ban") {
    // §5.5: nu-ți bana partenerul eligibil al unui campion deja luat.
    // DRAFT_THINKING §2.4: în faza 1 nici membrii celui mai bun duo propriu (clar peste al doilea).
    const protectedIds = new Set([...ownPartnerIds, ...(ctx.phase === "ban1" ? ctx.mustWith.ownDuo.protectedIds : [])]);
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

export function chooseFinal(ranked: DraftCandidateBreakdown[], ctx: DraftContext): DraftCandidateBreakdown | null {
  const { series, game, step } = ctx;
  if (step.action === "pick") {
    // §1.5: un candidat cu D intră în shortlist doar dacă e pe primul loc.
    const valid = ranked.filter((entry, index) => index === 0 || !entry.reasonTags?.includes("mastery-d"));
    const seed = `${series.seriesId}:${series.currentGameNumber}:${game.phaseIndex}:${step.side}`;

    // §5.4: partener non-bot pe primul loc → ales cu nonBotLockChance (determinist).
    const top = valid[0];
    const nonBotPartner = top
      ? ctx.mustWith.ownPartners.find((partner) => !partner.isBotPair && partner.partnerId === top.championId)
      : undefined;
    if (top && nonBotPartner && roll(`${seed}:mustwith`) < MUSTWITH_CONFIG.nonBotLockChance) {
      return withMustWithLock(top, nonBotPartner);
    }
    return withChoiceRank(chooseFromAdaptiveShortlist(valid, seed) ?? null, valid);
  }

  const banSeed = `${series.seriesId}:${series.currentGameNumber}:${game.phaseIndex}:ban:${step.side}`;
  const banShortlist = ranked.slice(0, 3);
  const banHash = banSeed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return withChoiceRank(banShortlist[banHash % banShortlist.length] ?? ranked[0] ?? null, ranked);
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
  const ranked = candidates.map((candidate) => scoreCandidate(candidate, ctx, weights)).sort(byTotal);
  rankedOut.push(...ranked);

  if (step.action === "pick" && !ranked.length) {
    // §1.5: niciun candidat valid (ban-uri + fearless au golit pool-urile) → cel mai bun
    // dintre cei excluși doar pentru mastery, marcat `forced-off-pool`.
    const scoredBlocked = blocked
      .filter((entry) => entry.tag !== "invalid-role-map")
      .map((entry) => scoreCandidate(entry.champion, ctx, weights))
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
