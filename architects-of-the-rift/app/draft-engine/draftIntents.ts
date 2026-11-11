// DRAFT_REALISM §7 — intențiile echipei, la nivel de echipă și per pas (nu per candidat):
// iau priority, le iau ce vor ei, contrez, îmi construiesc comp-ul, dau comfort, ascund informație.
// Plus predicția inamicului (§7.2), lookahead-ul (§7.3) și raritatea în fearless (§7.1).

import { champions, championsById } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import { GRADE_RANK, getChampionGrade, getResolvedChampionPool } from "@/app/utils/championMasteryUtils";
import { getCandidateIdentityFit } from "./compIdentity";
import { getDirectOpponents } from "./compCounter";
import type { DraftContext } from "./draftContext";
import { buildCompVector, evaluateNeedStatuses } from "./draftEvaluator";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import type { BucketId, IntentId } from "./draftTypes";
import { getWeaknessCoverage, WEAKNESS_COVER_CONFIG } from "./matchupGrades";
import { getMatchupValue } from "./matchupScoring";
import { getSeasonChampionThreat } from "./seasonThreatSystem";

const INTENTS = DRAFT_THINKING_CONFIG.intents;
const LOOKAHEAD = DRAFT_THINKING_CONFIG.lookahead;
const PRIORITY = DRAFT_THINKING_CONFIG.priority;
const playersById = new Map(players.map((player) => [player.id, player]));
const name = (championId: string) => championsById[championId]?.name ?? championId;
const clamp10 = (value: number) => Math.max(0, Math.min(10, value));
const isSolo = (role: Role) => role === "top" || role === "mid";

export type Intent = { id: IntentId; urgency: number; reason: string; targets?: string[] };

/** Bucket-ul amplificat de fiecare intenție. */
export const INTENT_BUCKET: Record<IntentId, BucketId> = {
  "secure-priority": "power",
  deny: "deny",
  answer: "counter",
  "build-identity": "comp",
  comfort: "comfort",
  hide: "info",
};

function playerOn(roster: Partial<Record<Role, string>>, role: Role) {
  return roster[role] ? playersById.get(roster[role]!) : undefined;
}

// ─── §7.2 Predicția inamicului ───────────────────────────────────────────────

/**
 * Interesul lor pentru un campion (0..10): 0.5 × gradeWant (jucătorul lor de pe un rol liber)
 * + 0.3 × priority value (perspectiva lor) + 0.2 × fit cu identitatea lor (−3..+3 → 0..10).
 */
export function getTheirInterest(champion: Champion, ctx: DraftContext): number {
  const enemy = ctx.enemy;
  const roles = champion.roles.filter((role) => enemy.openRoles.includes(role));
  if (!roles.length) return 0;
  let gradeWant = 0;
  for (const role of roles) {
    const player = playerOn(enemy.roster, role);
    if (player) gradeWant = Math.max(gradeWant, PRIORITY.gradeWant[getChampionGrade(player, champion.id)] ?? 0);
  }
  // Fit cu identitatea lor (−3..+3 → 0..10); fără identitate clară: neutru (5).
  const dominant = enemy.identity.dominant;
  const fit = dominant
    ? Math.max(...roles.map((role) => ((getCandidateIdentityFit(champion, role, dominant) + 3) / 6) * 10))
    : 5;
  const theirPriority = ctx.enemyPriorityOf(champion).value;
  return clamp10(INTENTS.interestWeights.grade * gradeWant + INTENTS.interestWeights.priority * theirPriority + INTENTS.interestWeights.identity * fit);
}

// ─── §7.3 Lookahead ──────────────────────────────────────────────────────────

export type LookaheadValue = {
  theirInterest: number;
  takeProbability: number;
  banProbability: number;
  /** theirInterest × takeProbability × denyWeight → bucket-ul `deny`. */
  denyValue: number;
};

/** Cât ne-ar bana ei campionul ăsta (semnătura / sezonul nostru), 0..10. */
function enemyTargetsUs(champion: Champion, ctx: DraftContext): number {
  const priority = ctx.priorityOf(champion);
  const signature = priority.ownBestGrade ? PRIORITY.gradeWant[priority.ownBestGrade] ?? 0 : 0;
  const season = getSeasonChampionThreat(ctx.own.teamSlug, champion.id, ctx.own.roster).threat * PRIORITY.seasonWantWeight;
  return clamp10(signature + season);
}

const lookaheadCache = new WeakMap<DraftContext, Map<string, LookaheadValue>>();

/** Cache pe acțiune (contextul se construiește o dată per acțiune). */
export function getLookaheadValue(champion: Champion, ctx: DraftContext): LookaheadValue {
  let cache = lookaheadCache.get(ctx);
  if (!cache) {
    cache = new Map();
    lookaheadCache.set(ctx, cache);
  }
  let value = cache.get(champion.id);
  if (!value) {
    value = computeLookahead(champion, ctx);
    cache.set(champion.id, value);
  }
  return value;
}

function computeLookahead(champion: Champion, ctx: DraftContext): LookaheadValue {
  const theirInterest = getTheirInterest(champion, ctx);
  const pTakeOne = (theirInterest / 10) * LOOKAHEAD.takeRate;
  const takeProbability = 1 - Math.pow(1 - pTakeOne, ctx.lookahead.enemyPicksBeforeOurNext);
  const pBan = (enemyTargetsUs(champion, ctx) / 10) * LOOKAHEAD.banRate;
  const banProbability = 1 - Math.pow(1 - pBan, ctx.lookahead.enemyBansBeforeOurNext);
  return { theirInterest, takeProbability, banProbability, denyValue: theirInterest * takeProbability * LOOKAHEAD.denyWeight };
}

// ─── §7.1 Raritate în fearless ───────────────────────────────────────────────

/** Câți campioni ≥ B mai are disponibili jucătorul de pe `role` (pe acel rol). */
export function getRemainingPool(roster: Partial<Record<Role, string>>, role: Role, unavailable: ReadonlySet<string>): number {
  const player = playerOn(roster, role);
  if (!player) return Infinity;
  return getResolvedChampionPool(player).filter(
    (entry) =>
      GRADE_RANK[entry.grade] >= GRADE_RANK.B &&
      !unavailable.has(entry.champion) &&
      Boolean(championsById[entry.champion]?.roles.includes(role)),
  ).length;
}

const scarceCache = new WeakMap<DraftContext, { own: Role[]; enemy: Role[] }>();

/** §7.1 — rolurile cu pool rar, pentru noi și pentru ei (cache pe acțiune). */
export function getScarcity(ctx: DraftContext): { own: Role[]; enemy: Role[] } {
  let value = scarceCache.get(ctx);
  if (!value) {
    value = {
      own: getScarceRoles(ctx.own.roster, ctx.own.openRoles, ctx.unavailable),
      enemy: getScarceRoles(ctx.enemy.roster, ctx.enemy.openRoles, ctx.unavailable),
    };
    scarceCache.set(ctx, value);
  }
  return value;
}

/** Rolurile libere (ale unei echipe) pe care jucătorul mai are ≤ scarcePool campioni ≥ B. */
export function getScarceRoles(roster: Partial<Record<Role, string>>, openRoles: readonly Role[], unavailable: ReadonlySet<string>): Role[] {
  return openRoles.filter((role) => getRemainingPool(roster, role, unavailable) <= INTENTS.scarcePool);
}

/** §7.1 — candidatul e un ≥ B al unui jucător cu pool rar pe un rol liber: îi asiguri rolul (power / target). */
export function isScarcePoolChampion(champion: Champion, roster: Partial<Record<Role, string>>, scarceRoles: readonly Role[]): boolean {
  return scarceRoles.some((role) => {
    const player = playerOn(roster, role);
    return Boolean(player && champion.roles.includes(role) && GRADE_RANK[getChampionGrade(player, champion.id)] >= GRADE_RANK.B);
  });
}

// ─── Intențiile ──────────────────────────────────────────────────────────────

const available = (ctx: DraftContext) => champions.filter((champion) => !ctx.unavailable.has(champion.id));

function securePriority(ctx: DraftContext): Intent {
  const top = ctx.topOwnUsablePriority();
  const urgency = top ? clamp10((top.priority.value - PRIORITY.tier2Min) * INTENTS.secureScale) : 0;
  const reason = top
    ? `${name(top.championId)} is tier ${top.priority.tier} (priority ${top.priority.value.toFixed(1)})${top.priority.ownBestGrade ? ` and we have it at ${top.priority.ownBestGrade}` : ""}`
    : "Nothing contested left for us";
  return { id: "secure-priority", urgency, reason, ...(top ? { targets: [top.championId] } : {}) };
}

function deny(ctx: DraftContext): Intent {
  let best: { id: string; value: number; take: number } | null = null;
  if (ctx.lookahead.enemyPicksBeforeOurNext > 0) {
    for (const champion of available(ctx)) {
      const look = getLookaheadValue(champion, ctx);
      const value = look.theirInterest * look.takeProbability;
      if (!best || value > best.value) best = { id: champion.id, value, take: look.takeProbability };
    }
  }
  const urgency = clamp10((best?.value ?? 0) * INTENTS.denyScale);
  const picks = ctx.lookahead.enemyPicksBeforeOurNext;
  const reason = best && picks
    ? `${picks} enemy pick${picks > 1 ? "s" : ""} before our next; they want ${name(best.id)} (${Math.round(best.take * 100)}% to take it)`
    : "No enemy pick before our next";
  return { id: "deny", urgency, reason, ...(best ? { targets: [best.id] } : {}) };
}

function answer(ctx: DraftContext): Intent {
  let best: { counterId: string; enemyId: string; value: number } | null = null;
  for (const role of ctx.own.openRoles) {
    const opponents = getDirectOpponents(role, ctx.enemy.assignments);
    if (!opponents.length) continue;
    const player = playerOn(ctx.own.roster, role);
    for (const champion of available(ctx)) {
      if (!champion.roles.includes(role)) continue;
      if (player && GRADE_RANK[getChampionGrade(player, champion.id)] < GRADE_RANK.B) continue;
      for (const opponent of opponents) {
        const value = getMatchupValue(champion.id, role, opponent.id, opponent.role);
        if (!best || value > best.value) best = { counterId: champion.id, enemyId: opponent.id, value };
      }
    }
  }
  const seasonPlan = ctx.season.punish.size > 0 ? INTENTS.answerSeasonBonus : 0;
  const urgency = clamp10(Math.max(0, best?.value ?? 0) * INTENTS.answerScale + seasonPlan);
  const reason = best && best.value > 0
    ? `${name(best.counterId)} answers their ${name(best.enemyId)}${seasonPlan ? " (their season favorite)" : ""}`
    : "No lane to answer yet";
  return { id: "answer", urgency, reason, ...(best ? { targets: [best.counterId] } : {}) };
}

function buildIdentity(ctx: DraftContext): Intent {
  const picks = ctx.own.picks;
  const missing = picks.length ? evaluateNeedStatuses(picks).filter((need) => need.missing > 0).length : 0;
  const vector = buildCompVector(picks) as unknown as Record<string, number>;
  const hasAdc = Boolean(ctx.own.assignments.adc);
  const gateMissing = picks.length >= 3 && ((vector.frontline ?? 0) < DRAFT_THINKING_CONFIG.report.composition.baseNeedMin || (!hasAdc && !ctx.own.openRoles.includes("adc")));
  const winCondition = ctx.ownWinCondition;
  const winNeeds = winCondition
    ? (championsById[winCondition.championId]?.needs ?? []).filter((need) => need.priority >= WEAKNESS_COVER_CONFIG.minNeedPriority).length
    : 0;
  const winUncovered = winCondition && winNeeds > 0 && getWeaknessCoverage(winCondition.championId, picks) < 1;
  // FEEDBACK_FIXES §10.5: „jucăm prin bot” crește urgența de a construi identitatea (combo-ul).
  const botFocus = ctx.botFocus === "bot" ? INTENTS.botFocusIdentityBonus : 0;
  const urgency = clamp10(missing * INTENTS.identityNeedScale + (gateMissing ? INTENTS.identityGateBonus : 0) + (winUncovered ? INTENTS.identityWinBonus : 0) + botFocus);
  const parts = [
    missing ? `${missing} comp need${missing > 1 ? "s" : ""} open` : null,
    gateMissing ? "no frontline yet" : null,
    winUncovered ? `${name(winCondition!.championId)} needs support` : null,
    botFocus ? "playing through bot" : null,
  ].filter(Boolean);
  return { id: "build-identity", urgency, reason: parts.length ? `${parts.join(", ")}` : "Comp is on track" };
}

function comfort(ctx: DraftContext, scarceRoles: readonly Role[]): Intent {
  let best = 0;
  let target: { playerName: string; championId: string; grade: string } | null = null;
  for (const role of ctx.own.openRoles) {
    const player = playerOn(ctx.own.roster, role);
    if (!player) continue;
    for (const entry of getResolvedChampionPool(player)) {
      if (ctx.unavailable.has(entry.champion) || !championsById[entry.champion]?.roles.includes(role)) continue;
      const value = entry.grade === "SS" ? INTENTS.comfortSS : entry.grade === "S" ? INTENTS.comfortS : 0;
      if (value > best) {
        best = value;
        target = { playerName: player.name, championId: entry.champion, grade: entry.grade };
      }
    }
  }
  const elimination = ctx.seriesPressure.eliminationGame ? INTENTS.comfortElimination : 0;
  const scarce = scarceRoles.length ? INTENTS.comfortScarce : 0;
  const urgency = clamp10(best + elimination + scarce);
  const parts = [
    target ? `${target.playerName} has ${name(target.championId)} at ${target.grade}` : null,
    elimination ? "elimination game" : null,
    scarce ? `fearless: few options left on ${scarceRoles.join(" / ")}` : null,
  ].filter(Boolean);
  return { id: "comfort", urgency, reason: parts.length ? parts.join("; ") : "No signature pick available", ...(target ? { targets: [target.championId] } : {}) };
}

function hide(ctx: DraftContext, scarceRoles: readonly Role[]): Intent {
  if (ctx.phase === "last-pick") return { id: "hide", urgency: 0, reason: "Last pick: nothing left to hide" };
  // Un solo lane cu pool rar (§7.1) nu-și permite să aștepte counter-pick-ul: riscă să rămână fără opțiuni.
  const openSolo = ctx.own.openRoles.filter((role) => isSolo(role) && !scarceRoles.includes(role)).length;
  const enemyLeft = ctx.lookahead.enemyPicksRemaining;
  const factor = ctx.lookahead.ourPicksLeft >= 2 ? 1 : INTENTS.hideLastPicksFactor;
  let urgency = Math.min(10, openSolo * INTENTS.hideSoloScale + enemyLeft * INTENTS.hideEnemyScale) * factor;

  // §7.3 — așteptare: un solo lane al nostru pe care ei nu-l iau și nu-l banează rămâne pentru counter-pick.
  const laterPick = ctx.lookahead.ourPicksLeft >= 2 && (ctx.phase === "pick1-open" || ctx.phase === "pick1-close" || ctx.phase === "pick2");
  let waiting: string | null = null;
  if (openSolo && laterPick) {
    for (const champion of available(ctx)) {
      if (!champion.roles.some((role) => isSolo(role) && ctx.own.openRoles.includes(role) && !scarceRoles.includes(role))) continue;
      const priority = ctx.priorityOf(champion);
      if (!priority.ownUsable || priority.tier === 3) continue;
      const look = getLookaheadValue(champion, ctx);
      if (look.takeProbability < LOOKAHEAD.safeProbability && look.banProbability < LOOKAHEAD.safeProbability) {
        urgency += LOOKAHEAD.waitBonusToHide;
        waiting = champion.id;
        break;
      }
    }
  }
  urgency = clamp10(urgency);
  const reason = openSolo
    ? `${openSolo} solo lane${openSolo > 1 ? "s" : ""} open, ${enemyLeft} enemy pick${enemyLeft === 1 ? "" : "s"} left${waiting ? `; ${name(waiting)} can wait for the counter-pick` : ""}`
    : "No solo lane left to hide";
  return { id: "hide", urgency, reason };
}

/** Intențiile echipei la pasul curent (doar la pick), sortate desc după urgență × stil. */
export function evaluateIntents(ctx: DraftContext, styleUrgency: Partial<Record<IntentId, number>> = {}): Intent[] {
  if (ctx.step.action !== "pick") return [];
  const scarceRoles = getScarcity(ctx).own;
  const intents = [securePriority(ctx), deny(ctx), answer(ctx), buildIdentity(ctx), comfort(ctx, scarceRoles), hide(ctx, scarceRoles)].map((intent) => ({
    ...intent,
    urgency: Math.round(clamp10(intent.urgency * (styleUrgency[intent.id] ?? 1)) * 10) / 10,
  }));
  return intents.sort((a, b) => b.urgency - a.urgency);
}

const intentCache = new WeakMap<DraftContext, Intent[]>();
/** Intențiile pasului, cu stilul echipei (cache pe context: o dată per acțiune). */
export function getCachedIntents(ctx: DraftContext): Intent[] {
  let intents = intentCache.get(ctx);
  if (!intents) {
    intents = evaluateIntents(ctx, ctx.style.intentUrgency);
    intentCache.set(ctx, intents);
  }
  return intents;
}

/**
 * §7.3 — așteptare: un solo lane al nostru pe care ei nu-l iau și nu-l banează până la următorul pick poate
 * rămâne pentru counter-pick; pick-ul curent merge pe altceva. Penalizare în `info`, proporțională cu urgența hide.
 */
export function getWaitPenalty(champion: Champion, role: Role | null, ctx: DraftContext): number {
  if (!role || !isSolo(role) || ctx.step.action !== "pick" || ctx.phase === "last-pick" || ctx.lookahead.ourPicksLeft < 2) return 0;
  if (getScarcity(ctx).own.includes(role)) return 0;
  const look = getLookaheadValue(champion, ctx);
  if (look.takeProbability >= LOOKAHEAD.safeProbability || look.banProbability >= LOOKAHEAD.safeProbability) return 0;
  const hideUrgency = getCachedIntents(ctx).find((intent) => intent.id === "hide")?.urgency ?? 0;
  return (hideUrgency / 10) * LOOKAHEAD.waitPenalty;
}

/** Multiplicatorul unui bucket din intenții: 1 + boost × Σ urgency/10 a intențiilor legate de el. */
export function getIntentMultiplier(intents: readonly Intent[], bucket: BucketId): number {
  const sum = intents.filter((intent) => INTENT_BUCKET[intent.id] === bucket).reduce((total, intent) => total + intent.urgency / 10, 0);
  return 1 + INTENTS.boost * sum;
}
