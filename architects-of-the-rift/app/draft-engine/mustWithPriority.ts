// Prioritatea mustWith în draft (DRAFT_REWORK §5).
//
//   - botlane: partenerul eligibil e luat OBLIGATORIU la următorul pick (override, 5.2);
//   - primul pick de bot: bonus pentru candidații cu partener eligibil (5.3);
//   - alte roluri: bonus mare + șansă de lock în `chooseAiAction` (5.4);
//   - ban-uri: nu-ți banezi partenerul, deny pe partenerul inamicului (5.5).
//
// Partenerii vin din `getMustWithPartners` (championMatchups.ts). Toate
// constantele sunt în `MUSTWITH_CONFIG`.

import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { championsById } from "@/app/data/champions";
import {
  getComplementaryBotRole,
  getMustWith,
  getMustWithPartners,
  getRoleMatchups,
  isBotRole,
  relationAppliesToEnemyRole,
} from "./championMatchups";
import {
  canPickChampionIntoUniqueRoles,
  getOpenRolesForPickedChampions,
  resolveRoleAssignments,
} from "./draftRoleResolver";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";

export const MUSTWITH_CONFIG = {
  /** Gradul minim de mastery al jucătorului pe partener (C). */
  minPartnerGradeRank: 2,
  /** 5.3: bonus pentru primul pick de bot care are un partener eligibil. */
  comboPotentialBonus: 1.75,
  /** 5.3: ponderea `botLaneFitBonus` când perechea bot e explicită. */
  explicitBotPairFitWeight: 0.8,
  explicitBotPairFitCap: 3,
  /** synergyWith de la acest scor în sus = pereche bot explicită. */
  explicitSynergyMinScore: 4,
  /**
   * 5.4: bonus pentru partenerul unei ancore non-bot — mare, ca partenerul să
   * iasă primul (țintă ≥ 80%). Scade la `nonBotOverriddenBonus` doar când există
   * o excepție permisă: counter nota 5 pe adversarul de linie sau pick SS
   * (`getNonBotOverride`). Rolul imposibil / compGate < -2 sunt deja în `compSafe`.
   */
  nonBotBonus: 30,
  nonBotOverriddenBonus: 2.5,
  /** 5.4: șansa (deterministă) de a alege partenerul când e primul în clasament. */
  nonBotLockChance: 0.8,
  /** 5.5: deny când inamicul are ancora și partenerul e liber. */
  deny: {
    bot: { ban: 2.0, pick: 1.5 },
    other: { ban: 1.5, pick: 1.0 },
  },
  /** 5.5: scorul de ban al propriului partener eligibil (nu se banează niciodată). */
  ownPartnerBanScore: -100,
  /** 4.7: evaluarea draftului încheiat. */
  evaluatorPairBonus: { bot: 4, other: 2.5 },
  evaluatorMissedPairPenalty: 1,
  /** Simulare: coeziunea unei perechi complete (înlocuiește vechiul bonus după scor). */
  simulationCohesion: { bot: 0.4, other: 0.25, cap: 0.4 },
} as const;

export type MustWithTeamContext = {
  /** Pick-urile echipei (fără candidat). */
  ownPicks: readonly string[];
  roster: Partial<Record<Role, string>>;
  /** Campioni indisponibili: ban-uri, pick-uri ale ambelor echipe, fearless. */
  unavailable: ReadonlySet<string>;
};

export type EligiblePartner = {
  anchorId: string;
  anchorRole: Role;
  partnerId: string;
  partnerRole: Role;
  grade: ChampionMasteryGrade | null;
  /** Poziția în lista de parteneri (0 = preferatul ancorei). */
  order: number;
  isBotPair: boolean;
};

const playersById = new Map(players.map((player) => [player.id, player]));

function getRosterPlayer(roster: Partial<Record<Role, string>>, role: Role): Player | null {
  const playerId = roster[role];
  return playerId ? playersById.get(playerId) ?? null : null;
}

/** Ban-uri + pick-uri din jocul curent + campionii deja jucați în serie (fearless). */
export function getUnavailableChampionIds(series: ActiveDraftSeries, game: DraftGameState): Set<string> {
  const unavailable = new Set<string>([...game.bansBlue, ...game.bansRed, ...game.picksBlue, ...game.picksRed]);
  for (const previous of series.games) {
    if (previous.number >= game.number) continue;
    for (const championId of [...previous.picksBlue, ...previous.picksRed]) unavailable.add(championId);
  }
  return unavailable;
}

export function getTeamPicks(game: DraftGameState, side: Side) {
  return side === "blue" ? game.picksBlue : game.picksRed;
}

/** Ancorele echipei: fiecare pick propriu cu rolul lui rezolvat. */
function getOwnAnchors(ctx: MustWithTeamContext): { anchorId: string; anchorRole: Role }[] {
  const assignments = resolveRoleAssignments([...ctx.ownPicks], ctx.roster);
  return (Object.entries(assignments) as [Role, string | undefined][])
    .filter((entry): entry is [Role, string] => Boolean(entry[1]))
    .map(([anchorRole, anchorId]) => ({ anchorId, anchorRole }));
}

function sortPartners(partners: EligiblePartner[]) {
  return partners.sort(
    (a, b) => (b.grade ? GRADE_RANK[b.grade] : 0) - (a.grade ? GRADE_RANK[a.grade] : 0) || a.order - b.order,
  );
}

/**
 * 5.1 — partenerii eligibili ai ancorei pentru echipa din `ctx`:
 * liberi, cu rolul complementar liber, jucătorul de pe acel rol are grad ≥ C
 * și pick-ul încape în compoziție. Ordonați: grad desc → ordinea din mustWith.
 */
export function getEligiblePartners(anchorId: string, anchorRole: Role, ctx: MustWithTeamContext): EligiblePartner[] {
  const partners = getMustWithPartners(anchorId, anchorRole);
  if (partners.length === 0) return [];

  const openRoles = getOpenRolesForPickedChampions([...ctx.ownPicks], ctx.roster);
  const botComplement = getComplementaryBotRole(anchorRole);
  const eligible: EligiblePartner[] = [];

  partners.forEach((partnerId, order) => {
    if (ctx.unavailable.has(partnerId) || ctx.ownPicks.includes(partnerId)) return;
    const partner = championsById[partnerId];
    if (!partner) return;

    const candidateRoles = botComplement
      ? [botComplement]
      : partner.roles.filter((role) => role !== anchorRole);
    const partnerRole = candidateRoles.find((role) => partner.roles.includes(role) && openRoles.includes(role));
    if (!partnerRole) return;

    const player = getRosterPlayer(ctx.roster, partnerRole);
    const grade = player ? getChampionGrade(player, partnerId) : null;
    // Fără jucător cunoscut pe rol nu se poate verifica mastery-ul → permisiv.
    if (grade && GRADE_RANK[grade] < MUSTWITH_CONFIG.minPartnerGradeRank) return;
    if (!canPickChampionIntoUniqueRoles([...ctx.ownPicks], partnerId, ctx.roster)) return;

    eligible.push({
      anchorId,
      anchorRole,
      partnerId,
      partnerRole,
      grade,
      order,
      isBotPair: Boolean(botComplement),
    });
  });

  return sortPartners(eligible);
}

/** Toți partenerii eligibili ai pick-urilor proprii. */
export function getAllEligiblePartners(ctx: MustWithTeamContext): EligiblePartner[] {
  return getOwnAnchors(ctx).flatMap(({ anchorId, anchorRole }) => getEligiblePartners(anchorId, anchorRole, ctx));
}

/**
 * 5.2 — override botlane: echipa are un campion pe adc/support, celălalt rol
 * bot e liber și există un partener eligibil → acel partener e următorul pick.
 */
export function resolveMustWithLock(ctx: MustWithTeamContext): EligiblePartner | null {
  for (const anchor of getOwnAnchors(ctx)) {
    if (!isBotRole(anchor.anchorRole)) continue;
    const [best] = getEligiblePartners(anchor.anchorId, anchor.anchorRole, ctx);
    if (best) return best;
  }
  return null;
}

/**
 * 5.3 — primul pick de bot (ambele roluri bot libere): bonus dacă, odată luat,
 * candidatul ar avea un partener mustWith eligibil pe celălalt rol bot.
 */
export function getComboPotentialBonus(
  candidate: Champion,
  candidateRole: Role | null,
  ctx: MustWithTeamContext,
): { bonus: number; partner: EligiblePartner | null } {
  if (!isBotRole(candidateRole)) return { bonus: 0, partner: null };
  const openRoles = getOpenRolesForPickedChampions([...ctx.ownPicks], ctx.roster);
  if (!openRoles.includes("adc") || !openRoles.includes("support")) return { bonus: 0, partner: null };

  const [partner] = getEligiblePartners(candidate.id, candidateRole, {
    ...ctx,
    ownPicks: [...ctx.ownPicks, candidate.id],
    unavailable: new Set([...ctx.unavailable, candidate.id]),
  });
  return partner ? { bonus: MUSTWITH_CONFIG.comboPotentialBonus, partner } : { bonus: 0, partner: null };
}

/** 5.3 — perechea bot din compoziție e explicită (mustWith sau synergyWith ≥ 4)? */
export function isExplicitBotPair(adcId: string | null | undefined, supportId: string | null | undefined): boolean {
  if (!adcId || !supportId) return false;
  if (getMustWithPartners(adcId, "adc").includes(supportId)) return true;
  if (getMustWithPartners(supportId, "support").includes(adcId)) return true;
  const min = MUSTWITH_CONFIG.explicitSynergyMinScore;
  const adc = championsById[adcId];
  const support = championsById[supportId];
  return Boolean(
    adc?.synergyWith.some((entry) => entry.championId === supportId && (entry.score ?? 0) >= min) ||
      support?.synergyWith.some((entry) => entry.championId === adcId && (entry.score ?? 0) >= min),
  );
}

/**
 * 5.4 — excepțiile care pot depăși partenerul non-bot:
 *   - un counter de nota 5 disponibil contra unui adversar de linie deja ales
 *     (pe un rol încă liber la noi, jucătorul nostru îl poate juca, grad ≥ C);
 *   - un campion SS al unui jucător propriu pe un rol încă liber.
 * Întoarce motivul, sau null dacă nu există excepție.
 */
export function getNonBotOverride(ctx: MustWithTeamContext, enemyCtx: MustWithTeamContext): string | null {
  const openRoles = getOpenRolesForPickedChampions([...ctx.ownPicks], ctx.roster);
  const isFree = (championId: string) => !ctx.unavailable.has(championId);

  const enemyAssignments = resolveRoleAssignments([...enemyCtx.ownPicks], enemyCtx.roster);
  for (const role of openRoles) {
    const enemyId = enemyAssignments[role];
    if (!enemyId) continue;
    const player = getRosterPlayer(ctx.roster, role);
    for (const relation of getRoleMatchups(enemyId, role).weakVs) {
      if (relation.score !== 5 || !isFree(relation.championId)) continue;
      if (!relationAppliesToEnemyRole(relation, role, role)) continue;
      if (!championsById[relation.championId]?.roles.includes(role)) continue;
      const counterGrade = player ? getChampionGrade(player, relation.championId) : null;
      if (counterGrade && GRADE_RANK[counterGrade] < MUSTWITH_CONFIG.minPartnerGradeRank) continue;
      return `counter nota 5: ${relation.championId} contra ${enemyId} (${role})`;
    }
  }

  for (const role of openRoles) {
    const player = getRosterPlayer(ctx.roster, role);
    if (!player) continue;
    const signature = Object.values(championsById).find(
      (champion) => champion.roles.includes(role) && isFree(champion.id) && getChampionGrade(player, champion.id) === "SS",
    );
    if (signature) return `pick SS: ${player.id} pe ${signature.id} (${role})`;
  }
  return null;
}

/** 5.4 — candidatul e partenerul eligibil al unei ancore proprii (pereche non-bot)? */
export function getNonBotMustWithBonus(
  candidate: Champion,
  ctx: MustWithTeamContext,
  partners: readonly EligiblePartner[] = getAllEligiblePartners(ctx),
  override: string | null = null,
): { bonus: number; partner: EligiblePartner | null } {
  const partner = partners.find((entry) => !entry.isBotPair && entry.partnerId === candidate.id) ?? null;
  if (!partner) return { bonus: 0, partner: null };
  return { bonus: override ? MUSTWITH_CONFIG.nonBotOverriddenBonus : MUSTWITH_CONFIG.nonBotBonus, partner };
}

/** 5.5 — nu-ți bana partenerul eligibil al unui campion deja luat. */
export function isProtectedOwnPartner(
  championId: string,
  ctx: MustWithTeamContext,
  partners: readonly EligiblePartner[] = getAllEligiblePartners(ctx),
): boolean {
  return partners.some((entry) => entry.partnerId === championId);
}

/**
 * 5.5 — deny: inamicul are ancora și candidatul e partenerul lui eligibil
 * (liber, pe un rol liber al inamicului, jucătorul lor îl poate juca).
 */
export function getMustWithDenyBonus(
  candidate: Champion,
  enemyCtx: MustWithTeamContext,
  forBan: boolean,
  enemyPartners: readonly EligiblePartner[] = getAllEligiblePartners(enemyCtx),
): { bonus: number; partner: EligiblePartner | null } {
  const partner = enemyPartners.find((entry) => entry.partnerId === candidate.id) ?? null;
  if (!partner) return { bonus: 0, partner: null };
  const values = partner.isBotPair ? MUSTWITH_CONFIG.deny.bot : MUSTWITH_CONFIG.deny.other;
  return { bonus: forBan ? values.ban : values.pick, partner };
}

/**
 * 4.5 — ancoră de combo expusă: candidatul are `mustWith` pe rolul proiectat,
 * dar echipa nu are niciun partener eligibil care să-l completeze.
 */
export function isExposedComboAnchor(
  candidate: Champion,
  candidateRole: Role | null,
  ctx: MustWithTeamContext,
): boolean {
  if (!candidateRole || getMustWith(candidate.id, candidateRole).length === 0) return false;
  const partners = getEligiblePartners(candidate.id, candidateRole, {
    ...ctx,
    ownPicks: [...ctx.ownPicks, candidate.id],
    unavailable: new Set([...ctx.unavailable, candidate.id]),
  });
  return partners.length === 0;
}

/**
 * 4.7 — oportunitate ratată: ancora din compoziția finală nu are partenerul,
 * deși unul era disponibil (nebanat, neluat de inamic) și jucătorul de pe rolul
 * complementar îl putea juca (grad ≥ C).
 */
export function hadAvailableUnusedPartner(
  anchorId: string,
  anchorRole: Role,
  assignments: Partial<Record<Role, string>>,
  roster: Partial<Record<Role, string>>,
  unavailable: ReadonlySet<string>,
): boolean {
  const picked = new Set(Object.values(assignments).filter(Boolean));
  const partners = getMustWithPartners(anchorId, anchorRole);
  if (partners.length === 0 || partners.some((partnerId) => picked.has(partnerId))) return false;

  const botComplement = getComplementaryBotRole(anchorRole);
  return partners.some((partnerId) => {
    if (unavailable.has(partnerId)) return false;
    const partner = championsById[partnerId];
    if (!partner) return false;
    const roles = botComplement ? [botComplement] : partner.roles.filter((role) => role !== anchorRole);
    return roles.some((role) => {
      if (!partner.roles.includes(role)) return false;
      const player = getRosterPlayer(roster, role);
      if (!player) return false;
      return GRADE_RANK[getChampionGrade(player, partnerId)] >= MUSTWITH_CONFIG.minPartnerGradeRank;
    });
  });
}

/** Perechile mustWith complete dintr-o compoziție cu roluri rezolvate. */
export function getCompletedMustWithPairs(
  assignments: Partial<Record<Role, string>>,
): { anchorId: string; partnerId: string; isBotPair: boolean }[] {
  const entries = (Object.entries(assignments) as [Role, string | undefined][]).filter(
    (entry): entry is [Role, string] => Boolean(entry[1]),
  );
  const seen = new Set<string>();
  const pairs: { anchorId: string; partnerId: string; isBotPair: boolean }[] = [];
  for (const [anchorRole, anchorId] of entries) {
    const partners = getMustWithPartners(anchorId, anchorRole);
    for (const [partnerRole, partnerId] of entries) {
      if (partnerId === anchorId || !partners.includes(partnerId)) continue;
      const key = [anchorId, partnerId].sort().join(":");
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ anchorId, partnerId, isBotPair: isBotRole(anchorRole) && isBotRole(partnerRole) });
    }
  }
  return pairs;
}
