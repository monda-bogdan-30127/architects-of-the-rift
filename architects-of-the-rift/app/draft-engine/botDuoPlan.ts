// Duo-uri bot (DRAFT_THINKING §2, FEEDBACK_FIXES §10): planul de duo înainte de primul pick de bot,
// fallback când partenerul mustWith al ancorei a fost banat, protecția la ban și
// deny-ul pe noul duo al inamicului. Doar combo-urile (tier 1: mustWith, tier 2: synergy 5) sunt duo-uri;
// perechile tier 3 (synergy 4) le tratează getBotLaneArchetypeFit ca orice pereche. Bonusurile depind
// de focusul pe bot („jucăm prin bot” / neutru / prio pe alte linii).

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
import { hasTrait } from "@/app/utils/playerTraitUtils";
import { MUSTWITH_CONFIG, getBotPairTier, getEligiblePartners, type MustWithTeamContext } from "./mustWithPriority";

const DUO = DRAFT_THINKING_CONFIG.duo;
const playersById = new Map(players.map((player) => [player.id, player]));

export type BotDuoOption = {
  adcId: string;
  supportId: string;
  /** §10.2 — 1 = mustWith (oricare sens), 2 = synergyWith 5 (oricare fișier). Tier 3 nu e duo. */
  tier: 1 | 2;
  adcGrade: ChampionMasteryGrade | null;
  supportGrade: ChampionMasteryGrade | null;
  score: number;
};

type DuoCandidate = { adcId: string; supportId: string; tier: BotDuoOption["tier"] };

let duoCandidates: DuoCandidate[] | null = null;

/** Toate combo-urile adc–support din date (static): tier 1 (mustWith) și tier 2 (synergy 5), din `getBotPairTier`. */
function getDuoCandidates(): DuoCandidate[] {
  if (duoCandidates) return duoCandidates;
  const byKey = new Map<string, DuoCandidate>();
  const add = (adcId: string, supportId: string) => {
    if (!championsById[adcId]?.roles.includes("adc") || !championsById[supportId]?.roles.includes("support")) return;
    const key = `${adcId}|${supportId}`;
    if (byKey.has(key)) return;
    const tier = getBotPairTier(adcId, supportId);
    if (tier === 1 || tier === 2) byKey.set(key, { adcId, supportId, tier });
  };
  for (const champion of champions) {
    if (champion.roles.includes("adc")) for (const partner of getMustWith(champion.id, "adc")) add(champion.id, partner);
    if (champion.roles.includes("support")) for (const partner of getMustWith(champion.id, "support")) add(partner, champion.id);
    for (const entry of champion.synergyWith) {
      if ((entry.score ?? 0) < MUSTWITH_CONFIG.comboSynergyMinScore) continue;
      add(champion.id, entry.championId);
      add(entry.championId, champion.id);
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
  for (const { adcId, supportId, tier } of getDuoCandidates()) {
    if (taken.has(adcId) || taken.has(supportId)) continue;
    const adcGrade = rosterGrade(ctx.roster, "adc", adcId);
    const supportGrade = rosterGrade(ctx.roster, "support", supportId);
    if (!isPlayableGrade(adcGrade) || !isPlayableGrade(supportGrade)) continue;
    const meta = (getMetaPriorityScore(championsById[adcId]!, "adc") + getMetaPriorityScore(championsById[supportId]!, "support")) / 2;
    const score =
      (adcGrade ? GRADE_RANK[adcGrade] : GRADE_RANK.C) +
      (supportGrade ? GRADE_RANK[supportGrade] : GRADE_RANK.C) +
      meta * DUO.metaWeight +
      (tier === 1 ? DUO.mustWithScoreBonus : DUO.comboTier2ScoreBonus);
    duos.push({ adcId, supportId, tier, adcGrade, supportGrade, score });
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

// ─── §10.3 Focusul pe bot ────────────────────────────────────────────────────
export type BotFocus = "bot" | "neutral" | "elsewhere";

/**
 * Cele mai bune 2 opțiuni de pe rolurile libere non-bot, pe scala scorului de duo:
 * grad (jucătorul de pe rol) × 2 campioni + meta medie × metaWeight. 1 rol liber → aceeași opțiune × 2.
 */
function getBestNonBotPairScore(ctx: MustWithTeamContext): number | null {
  const open = getOpenRolesForPickedChampions([...ctx.ownPicks], ctx.roster, ctx.lockedRoles).filter((role) => role !== "adc" && role !== "support");
  if (!open.length) return null;
  const taken = new Set([...ctx.unavailable, ...ctx.ownPicks]);
  const best = open
    .map((role) => {
      let top: { grade: number; meta: number } | null = null;
      for (const champion of champions) {
        if (taken.has(champion.id) || !champion.roles.includes(role)) continue;
        const grade = rosterGrade(ctx.roster, role, champion.id);
        if (!isPlayableGrade(grade)) continue;
        const option = { grade: grade ? GRADE_RANK[grade] : GRADE_RANK.C, meta: getMetaPriorityScore(champion, role) };
        if (!top || option.grade + option.meta * DUO.metaWeight > top.grade + top.meta * DUO.metaWeight) top = option;
      }
      return top;
    })
    .filter((entry): entry is { grade: number; meta: number } => Boolean(entry))
    .sort((a, b) => b.grade + b.meta * DUO.metaWeight - (a.grade + a.meta * DUO.metaWeight));
  if (!best.length) return null;
  const [first, second = best[0]] = best;
  return first.grade + second.grade + ((first.meta + second.meta) / 2) * DUO.metaWeight;
}

/**
 * „Jucăm prin bot?” (doar cu ambele roluri bot libere):
 *   bot       — plan / identitate protect-carry, win condition pe adc, sau cel mai bun combo (ambii ≥ B)
 *               e cu ≥ focusMargin peste cele mai bune 2 opțiuni de pe celelalte roluri;
 *   elsewhere — win condition pe top / jungle / mid, sau acele opțiuni sunt cu ≥ focusMargin peste combo;
 *   neutral   — altfel.
 */
export function getBotFocus(args: {
  ctx: MustWithTeamContext;
  state: BotDuoState;
  planType: string | null;
  identity: string | null;
  winConditionRole: Role | null;
}): BotFocus {
  if (!bothBotRolesOpen(args.ctx)) return "neutral";
  const best = args.state.best;
  const other = getBestNonBotPairScore(args.ctx);
  const strongPlayers = Boolean(
    best && [best.adcGrade, best.supportGrade].every((grade) => grade === null || GRADE_RANK[grade] >= GRADE_RANK.B),
  );
  if (
    args.planType === "protect-carry" ||
    args.identity === "protect-carry" ||
    args.winConditionRole === "adc" ||
    (best && strongPlayers && (other === null || best.score - other >= DUO.focusMargin))
  ) {
    return "bot";
  }
  if (
    args.winConditionRole === "top" || args.winConditionRole === "jungle" || args.winConditionRole === "mid" ||
    (best && other !== null && other - best.score >= DUO.focusMargin)
  ) {
    return "elsewhere";
  }
  // PLAYER_TRAITS §4.2: doar când celelalte semnale dau „neutral” (și cu flag-ul pornit).
  if (DRAFT_THINKING_CONFIG.traits.botFocusEnabled) {
    const playerOn = (role: Role) => {
      const playerId = args.ctx.roster[role];
      return playerId ? playersById.get(playerId) : undefined;
    };
    const hogOffBot = (["top", "jungle", "mid"] as const).some((role) => hasTrait(playerOn(role), "resource_hog"));
    const adc = playerOn("adc");
    if (hasTrait(adc, "resource_hog") && !hogOffBot) return "bot";
    if (hogOffBot && hasTrait(adc, "weakside_ready")) return "elsewhere";
  }
  return "neutral";
}

/** „Rakan banat → trecem pe Kai'Sa + Nautilus (A / B)” sau „Duo: Kai'Sa + Nautilus (A / B)”. */
export function describeDuoPlan(state: BotDuoState, bans: readonly string[]): string | null {
  const best = state.best;
  if (!best) return null;
  const grades = `${best.adcGrade ?? "?"} / ${best.supportGrade ?? "?"}`;
  const lost = state.bestWithoutBans;
  if (lost && (lost.adcId !== best.adcId || lost.supportId !== best.supportId)) {
    const bannedMember = [lost.adcId, lost.supportId].find((id) => bans.includes(id));
    if (bannedMember) return `${name(bannedMember)} banned: going ${name(best.adcId)} + ${name(best.supportId)} (${grades})`;
  }
  return `Playing through bot: ${name(best.adcId)} + ${name(best.supportId)} (combo, ${grades})`;
}

export type DuoPickResult = { bonus: number; tag: "duo-plan" | "orphan-anchor" | null; line: string | null };

/**
 * §2.2 / FEEDBACK_FIXES §10.4 — bonusul primului pick de bot, după focus (bot / neutral / elsewhere):
 * cel mai bun combo tier 1 / tier 2, alt combo valid, ancoră orfană (mustWith fără partener și fără
 * un combo tier 2 care să-i țină locul). Perechile tier 3 nu primesc nimic aici.
 */
export function getDuoPickBonus(
  candidate: Champion,
  candidateRole: Role | null,
  ctx: MustWithTeamContext,
  state: BotDuoState,
  bans: readonly string[],
  /** Pick-urile inamicului: dacă el a luat partenerul, candidatul e deny, nu ancoră orfană. */
  enemyPicks: readonly string[] = [],
  focus: BotFocus = "neutral",
): DuoPickResult {
  const none: DuoPickResult = { bonus: 0, tag: null, line: null };
  if (candidateRole !== "adc" && candidateRole !== "support") return none;
  if (!state.duos.length && !getMustWith(candidate.id, candidateRole).length) return none;
  if (!bothBotRolesOpen(ctx)) return none;
  const table = DUO.focusBonus[focus];

  const inDuo = (duo: BotDuoOption) => (candidateRole === "adc" ? duo.adcId : duo.supportId) === candidate.id;
  if (state.best && inDuo(state.best)) {
    if (focus === "elsewhere") return { bonus: 0, tag: null, line: "Priority on other lanes: bot picked separately" };
    const bonus = state.best.tier === 1 ? table.bestTier1 : table.bestTier2;
    return { bonus, tag: "duo-plan", line: describeDuoPlan(state, bans) };
  }
  // Ancoră orfană: are mustWith pe rolul bot, dar niciun partener eligibil — înaintea
  // „alt combo valid”: Xayah fără Rakan nu e un plan. Cu un combo tier 2 disponibil, combo-ul acela îi
  // ține locul (fără penalizare). Excepție: partenerul a fost luat chiar de inamic → candidatul e deny (§2.4 / 5.5).
  const partnerTakenByEnemy = getMustWith(candidate.id, candidateRole).some((id) => enemyPicks.includes(id));
  if (getMustWith(candidate.id, candidateRole).length && !partnerTakenByEnemy) {
    const partners = getEligiblePartners(candidate.id, candidateRole, {
      ...ctx,
      ownPicks: [...ctx.ownPicks, candidate.id],
      unavailable: new Set([...ctx.unavailable, candidate.id]),
    });
    const tier2Combo = state.duos.some((duo) => duo.tier === 2 && inDuo(duo));
    if (!partners.length && !tier2Combo) {
      const base = table.orphan;
      const penalty = getCarryArchetype(candidate.id) === "self-sufficient" ? Math.min(base, DUO.orphanSelfSufficientPenalty) : base;
      const missingIds = getMustWith(candidate.id, candidateRole);
      const missing = missingIds.map(name).join(" / ");
      const status = missingIds.some((id) => bans.includes(id)) ? "banned" : "unavailable";
      const going = state.best && focus !== "elsewhere" ? `, going ${name(state.best.adcId)} + ${name(state.best.supportId)}` : "";
      return { bonus: -penalty, tag: "orphan-anchor", line: `${missing} ${status}: ${name(candidate.id)} avoided without ${missing}${going}` };
    }
  }
  if (focus !== "elsewhere" && state.duos.some(inDuo)) return { bonus: table.otherCombo, tag: "duo-plan", line: null };
  return none;
}

export type DuoFallbackResult = { bonus: number; anchorId: string | null; line: string | null };

/**
 * §2.3 — ancora bot e deja luată, dar n-are partener mustWith eligibil (banat,
 * luat, jucătorul < C): candidații de pe rolul complementar care fac un combo tier 2
 * (synergyWith 5, FEEDBACK_FIXES §10.4) cu ancora și au grad ≥ C primesc `fallbackPartnerBonus`,
 * ordonați după grad. Partenerii tier 3 rămân la logica normală.
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

  const pair = anchorRole === "adc" ? getBotPairTier(anchorId, candidate.id) : getBotPairTier(candidate.id, anchorId);
  if (pair !== 2) return none;
  const grade = rosterGrade(ctx.roster, candidateRole, candidate.id);
  if (!isPlayableGrade(grade)) return none;

  const rank = grade ? GRADE_RANK[grade] : GRADE_RANK.C;
  const missing = getMustWith(anchorId, anchorRole).map(name).join(" / ");
  return {
    bonus: DUO.fallbackPartnerBonus + DUO.fallbackGradeStep * (rank - GRADE_RANK.C),
    anchorId,
    line: `${missing} unavailable after ${name(anchorId)}: ${name(candidate.id)} instead (combo, grade ${grade ?? "?"})`,
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
