// Duo-uri bot (DRAFT_THINKING §2): planul de duo înainte de primul pick de bot,
// fallback când partenerul mustWith al ancorei a fost banat, protecția la ban și
// deny-ul pe noul duo al inamicului.

import { champions, championsById } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getMustWith } from "./championMatchups";
import { getCarryArchetype } from "./draftArchetypes";
import { getMetaPriorityScore } from "./draftEvaluator";
import { getOpenRolesForPickedChampions, resolveRoleAssignments } from "./draftRoleResolver";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { MUSTWITH_CONFIG, getEligiblePartners, type MustWithTeamContext } from "./mustWithPriority";

const DUO = DRAFT_THINKING_CONFIG.duo;
const playersById = new Map(players.map((player) => [player.id, player]));

export type BotDuoOption = {
  adcId: string;
  supportId: string;
  /** synergy = synergyWith ≥ explicitSynergyMinScore (în oricare fișier). */
  kind: "mustWith" | "synergy";
  adcGrade: ChampionMasteryGrade | null;
  supportGrade: ChampionMasteryGrade | null;
  score: number;
};

type DuoCandidate = { adcId: string; supportId: string; kind: BotDuoOption["kind"] };

let duoCandidates: DuoCandidate[] | null = null;

/** Toate perechile adc–support posibile din date (static): mustWith în oricare sens, apoi synergy ≥ 4. */
function getDuoCandidates(): DuoCandidate[] {
  if (duoCandidates) return duoCandidates;
  const byKey = new Map<string, DuoCandidate>();
  const add = (adcId: string, supportId: string, kind: DuoCandidate["kind"]) => {
    if (!championsById[adcId]?.roles.includes("adc") || !championsById[supportId]?.roles.includes("support")) return;
    if (adcId === supportId) return;
    const key = `${adcId}|${supportId}`;
    const existing = byKey.get(key);
    if (!existing || (existing.kind === "synergy" && kind === "mustWith")) byKey.set(key, { adcId, supportId, kind });
  };
  for (const champion of champions) {
    if (champion.roles.includes("adc")) for (const partner of getMustWith(champion.id, "adc")) add(champion.id, partner, "mustWith");
    if (champion.roles.includes("support")) for (const partner of getMustWith(champion.id, "support")) add(partner, champion.id, "mustWith");
    for (const entry of champion.synergyWith) {
      if ((entry.score ?? 0) < MUSTWITH_CONFIG.explicitSynergyMinScore) continue;
      add(champion.id, entry.championId, "synergy");
      add(entry.championId, champion.id, "synergy");
    }
  }
  duoCandidates = [...byKey.values()];
  return duoCandidates;
}

function rosterGrade(roster: Partial<Record<Role, string>>, role: Role, championId: string): ChampionMasteryGrade | null {
  const player = roster[role] ? playersById.get(roster[role]!) : undefined;
  return player ? getChampionGrade(player, championId) : null;
}

const isPlayableGrade = (grade: ChampionMasteryGrade | null) =>
  grade === null || GRADE_RANK[grade] >= MUSTWITH_CONFIG.minPartnerGradeRank;

function bothBotRolesOpen(ctx: MustWithTeamContext): boolean {
  const open = getOpenRolesForPickedChampions([...ctx.ownPicks], ctx.roster, ctx.lockedRoles);
  return open.includes("adc") && open.includes("support");
}

/**
 * §2.2 — duo-urile bot încă posibile, doar când ambele roluri bot sunt libere:
 * ambii campioni disponibili, ambii jucători cu ≥ C. Sortate după `score`.
 */
export function getAvailableBotDuos(ctx: MustWithTeamContext): BotDuoOption[] {
  if (!bothBotRolesOpen(ctx)) return [];
  const taken = new Set([...ctx.unavailable, ...ctx.ownPicks]);
  const duos: BotDuoOption[] = [];
  for (const { adcId, supportId, kind } of getDuoCandidates()) {
    if (taken.has(adcId) || taken.has(supportId)) continue;
    const adcGrade = rosterGrade(ctx.roster, "adc", adcId);
    const supportGrade = rosterGrade(ctx.roster, "support", supportId);
    if (!isPlayableGrade(adcGrade) || !isPlayableGrade(supportGrade)) continue;
    const meta = (getMetaPriorityScore(championsById[adcId]!, "adc") + getMetaPriorityScore(championsById[supportId]!, "support")) / 2;
    const score =
      (adcGrade ? GRADE_RANK[adcGrade] : GRADE_RANK.C) +
      (supportGrade ? GRADE_RANK[supportGrade] : GRADE_RANK.C) +
      meta * DUO.metaWeight +
      (kind === "mustWith" ? DUO.mustWithScoreBonus : 0);
    duos.push({ adcId, supportId, kind, adcGrade, supportGrade, score });
  }
  return duos.sort((a, b) => b.score - a.score || a.adcId.localeCompare(b.adcId) || a.supportId.localeCompare(b.supportId));
}

export type BotDuoState = {
  duos: BotDuoOption[];
  best: BotDuoOption | null;
  /** Cel mai bun duo dacă nimic n-ar fi banat — ca să știm că planul principal a căzut. */
  bestWithoutBans: BotDuoOption | null;
  /** Membrii celui mai bun duo, dacă e clar peste al doilea (§2.4: nu se banează în faza 1). */
  protectedIds: string[];
};

/** Starea de duo a unei echipe; `bans` = ban-urile din jocul curent (pentru „planul a căzut”). */
export function getBotDuoState(ctx: MustWithTeamContext, bans: readonly string[]): BotDuoState {
  const duos = getAvailableBotDuos(ctx);
  const banned = new Set(bans);
  const withoutBans = banned.size
    ? getAvailableBotDuos({ ...ctx, unavailable: new Set([...ctx.unavailable].filter((id) => !banned.has(id))) })
    : duos;
  const best = duos[0] ?? null;
  const second = duos[1] ?? null;
  const protectedIds = best && (!second || best.score - second.score >= DUO.protectMargin) ? [best.adcId, best.supportId] : [];
  return { duos, best, bestWithoutBans: withoutBans[0] ?? null, protectedIds };
}

const name = (championId: string) => championsById[championId]?.name ?? championId;

/** „Rakan banat → trecem pe Kai'Sa + Nautilus (A / B)” sau „Duo: Kai'Sa + Nautilus (A / B)”. */
export function describeDuoPlan(state: BotDuoState, bans: readonly string[]): string | null {
  const best = state.best;
  if (!best) return null;
  const grades = `${best.adcGrade ?? "?"} / ${best.supportGrade ?? "?"}`;
  const lost = state.bestWithoutBans;
  if (lost && (lost.adcId !== best.adcId || lost.supportId !== best.supportId)) {
    const bannedMember = [lost.adcId, lost.supportId].find((id) => bans.includes(id));
    if (bannedMember) return `${name(bannedMember)} banat → trecem pe ${name(best.adcId)} + ${name(best.supportId)} (${grades})`;
  }
  return `Duo: ${name(best.adcId)} + ${name(best.supportId)} (${grades})`;
}

export type DuoPickResult = { bonus: number; tag: "duo-plan" | "orphan-anchor" | null; line: string | null };

/**
 * §2.2 — bonusul primului pick de bot (înlocuiește `getComboPotentialBonus`):
 * cel mai bun duo (mustWith +3 / synergy +1.5), alt duo valid +1, ancoră orfană −2
 * (−0.75 dacă e un carry self-sufficient).
 */
export function getDuoPickBonus(
  candidate: Champion,
  candidateRole: Role | null,
  ctx: MustWithTeamContext,
  state: BotDuoState,
  bans: readonly string[],
  /** Pick-urile inamicului: dacă el a luat partenerul, candidatul e deny, nu ancoră orfană. */
  enemyPicks: readonly string[] = [],
): DuoPickResult {
  const none: DuoPickResult = { bonus: 0, tag: null, line: null };
  if (candidateRole !== "adc" && candidateRole !== "support") return none;
  if (!state.duos.length && !getMustWith(candidate.id, candidateRole).length) return none;
  if (!bothBotRolesOpen(ctx)) return none;

  const inDuo = (duo: BotDuoOption) => (candidateRole === "adc" ? duo.adcId : duo.supportId) === candidate.id;
  if (state.best && inDuo(state.best)) {
    const bonus = state.best.kind === "mustWith" ? DUO.bestMustWithBonus : DUO.bestSynergyBonus;
    return { bonus, tag: "duo-plan", line: describeDuoPlan(state, bans) };
  }
  // Ancoră orfană: are mustWith pe rolul bot, dar niciun partener eligibil — înaintea
  // „alt duo valid”: Xayah fără Rakan nu e un plan, chiar dacă merge cu Nautilus.
  // Excepție: partenerul a fost luat chiar de inamic (ex. ei au Xayah) → Rakan rămâne deny (§2.4 / 5.5).
  const partnerTakenByEnemy = getMustWith(candidate.id, candidateRole).some((id) => enemyPicks.includes(id));
  if (getMustWith(candidate.id, candidateRole).length && !partnerTakenByEnemy) {
    const partners = getEligiblePartners(candidate.id, candidateRole, {
      ...ctx,
      ownPicks: [...ctx.ownPicks, candidate.id],
      unavailable: new Set([...ctx.unavailable, candidate.id]),
    });
    if (!partners.length) {
      const penalty = getCarryArchetype(candidate.id) === "self-sufficient" ? DUO.orphanSelfSufficientPenalty : DUO.orphanAnchorPenalty;
      const missing = getMustWith(candidate.id, candidateRole).map(name).join(" / ");
      return { bonus: -penalty, tag: "orphan-anchor", line: `${name(candidate.id)} fără ${missing} disponibil — evitat` };
    }
  }
  if (state.duos.some(inDuo)) return { bonus: DUO.otherDuoBonus, tag: "duo-plan", line: null };
  return none;
}

export type DuoFallbackResult = { bonus: number; anchorId: string | null; line: string | null };

/**
 * §2.3 — ancora bot e deja luată, dar n-are partener mustWith eligibil (banat,
 * luat, jucătorul < C): candidații de pe rolul complementar cu synergyWith ≥ 4 cu
 * ancora și grad ≥ C primesc `fallbackPartnerBonus`, ordonați după grad.
 */
export function getDuoFallbackBonus(
  candidate: Champion,
  candidateRole: Role | null,
  ctx: MustWithTeamContext,
  hasMustWithLock: boolean,
): DuoFallbackResult {
  const none: DuoFallbackResult = { bonus: 0, anchorId: null, line: null };
  if (hasMustWithLock || (candidateRole !== "adc" && candidateRole !== "support")) return none;
  const anchorRole: Role = candidateRole === "adc" ? "support" : "adc";
  const assignments = resolveRoleAssignments([...ctx.ownPicks], ctx.roster, ctx.lockedRoles);
  const anchorId = assignments[anchorRole];
  if (!anchorId || assignments[candidateRole]) return none;
  if (!getMustWith(anchorId, anchorRole).length) return none;

  const anchor = championsById[anchorId];
  const minScore = MUSTWITH_CONFIG.explicitSynergyMinScore;
  const synergy =
    (anchor?.synergyWith.find((entry) => entry.championId === candidate.id)?.score ?? 0) >= minScore ||
    (candidate.synergyWith.find((entry) => entry.championId === anchorId)?.score ?? 0) >= minScore;
  if (!synergy) return none;
  const grade = rosterGrade(ctx.roster, candidateRole, candidate.id);
  if (!isPlayableGrade(grade)) return none;

  const rank = grade ? GRADE_RANK[grade] : GRADE_RANK.C;
  const missing = getMustWith(anchorId, anchorRole).map(name).join(" / ");
  return {
    bonus: DUO.fallbackPartnerBonus + DUO.fallbackGradeStep * (rank - GRADE_RANK.C),
    anchorId,
    line: `${missing} indisponibil după ${name(anchorId)} → ${name(candidate.id)} (synergy, grad ${grade ?? "?"})`,
  };
}

/**
 * §2.4 — deny pe noul duo al inamicului: și-a pierdut duo-ul principal printr-un
 * ban și are încă ambele roluri bot libere → candidații din noul lui cel mai bun
 * duo primesc deny-ul de botlane. `relevant` = inamicul e AI sau userul joacă des duo-ul.
 */
export function getEnemyDuoDenyBonus(
  candidate: Champion,
  enemyState: BotDuoState,
  forBan: boolean,
  isRelevant: (duo: BotDuoOption) => boolean,
): number {
  const best = enemyState.best;
  const primary = enemyState.bestWithoutBans;
  if (!best || !primary) return 0;
  if (primary.adcId === best.adcId && primary.supportId === best.supportId) return 0;
  if (best.adcId !== candidate.id && best.supportId !== candidate.id) return 0;
  if (!isRelevant(best)) return 0;
  return forBan ? MUSTWITH_CONFIG.deny.bot.ban : MUSTWITH_CONFIG.deny.bot.pick;
}
