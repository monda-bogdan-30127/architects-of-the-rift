// DUO_PRIORITY_AND_FEARLESS §2–§3 — priority în funcție de partener: un campion construit în jurul unui
// partener (Renata cu Kalista, Rakan cu Xayah) valorează mult mai puțin singur. Valoarea lui depinde de
// dacă poți lua și partenerul acum (fereastră de pereche), dacă adversarul îl poate lua / bana înainte
// (expus) sau dacă partenerul nu mai e disponibil (orfan). În fearless, un combo cu partenerul doar banat
// în jocul ăsta se păstrează pentru un joc următor.

import { champions, championsById } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getMustWith } from "./championMatchups";
import { getCarryArchetype } from "./draftArchetypes";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import type { ActiveDraftSeries, DraftGameState, Side } from "./draftTypes";
import { DRAFT_SEQUENCE, ROLE_ORDER } from "./draftTypes";

const PAIR = DRAFT_THINKING_CONFIG.pair;
const playersById = new Map(players.map((player) => [player.id, player]));

/** Rolul partenerului: adc ↔ support; pentru perechile non-bot, rolurile din fișierul partenerului. */
const complementaryRole = (role: Role): Role | null => (role === "adc" ? "support" : role === "support" ? "adc" : null);

let reverseIndex: Map<string, { partnerId: string; partnerRole: Role }[]> | null = null;

/** championId:rol → partenerii care îl au în `mustWith` (relația în sens invers). */
function getReverseIndex() {
  if (reverseIndex) return reverseIndex;
  reverseIndex = new Map();
  for (const champion of champions) {
    for (const role of champion.roles) {
      for (const targetId of getMustWith(champion.id, role)) {
        const target = championsById[targetId];
        if (!target) continue;
        const targetRole = complementaryRole(role);
        const targetRoles = targetRole && target.roles.includes(targetRole) ? [targetRole] : target.roles;
        for (const entryRole of targetRoles) {
          const key = `${targetId}:${entryRole}`;
          reverseIndex.set(key, [...(reverseIndex.get(key) ?? []), { partnerId: champion.id, partnerRole: role }]);
        }
      }
    }
  }
  return reverseIndex;
}

/** Partenerii unui campion pe un rol, în ambele sensuri (pentru priority, relația contează în ambele). */
export function getComboPartners(championId: string, role: Role): { partnerId: string; partnerRole: Role }[] {
  const forwardRole = complementaryRole(role);
  const forward = getMustWith(championId, role).flatMap((partnerId) => {
    const partner = championsById[partnerId];
    if (!partner) return [];
    const partnerRole = forwardRole && partner.roles.includes(forwardRole) ? forwardRole : partner.roles[0];
    return [{ partnerId, partnerRole }];
  });
  const seen = new Set(forward.map((entry) => entry.partnerId));
  const reverse = (getReverseIndex().get(`${championId}:${role}`) ?? []).filter((entry) => !seen.has(entry.partnerId));
  return [...forward, ...reverse];
}

/** §2.2 — cât depinde campionul de partener (0..1): 0.7 piesă de combo, 0.35 dacă e un carry self-sufficient. */
export function getPairDependency(champion: Champion, role: Role | null): number {
  if (!role || !getComboPartners(champion.id, role).length) return 0;
  return getCarryArchetype(champion.id) === "self-sufficient" ? PAIR.dependencySelfSufficient : PAIR.dependency;
}

export type PartnerState = "secured" | "pair-window" | "exposed" | "orphan" | "none";
export type PartnerStateResult = { state: PartnerState; partnerId: string | null; denyChance: number };

/** Ce are nevoie starea partenerului de la contextul de draft (fără dependență de draftContext). */
export type PartnerView = {
  side: Side;
  stepIndex: number;
  ownPicks: readonly string[];
  ownRoster: Partial<Record<Role, string>>;
  unavailable: ReadonlySet<string>;
  enemyPicksBeforeOurNext: number;
  enemyBansBeforeOurNext: number;
  /** Interesul adversarului pentru un campion (0..10). */
  theirInterest: (champion: Champion) => number;
  /** Partenerul e un favorit / combo al nostru vizibil (ei știu că îl vrem) → ban mai probabil. */
  isVisibleToEnemy: (championId: string) => boolean;
};

function rosterRank(roster: Partial<Record<Role, string>>, role: Role, championId: string): number {
  const player = roster[role] ? playersById.get(roster[role]!) : undefined;
  return player ? GRADE_RANK[getChampionGrade(player, championId)] : GRADE_RANK.C;
}

/** Următorul pas din DRAFT_SEQUENCE e tot un pick al nostru? (fereastra de pereche) */
function nextStepIsOurPick(stepIndex: number, side: Side): boolean {
  const next = DRAFT_SEQUENCE[stepIndex + 1];
  return Boolean(next && next.side === side && next.action === "pick");
}

/** §2.3 — starea celui mai bun partener la pasul curent (ordinea din mustWith, apoi gradul jucătorului nostru). */
export function getPartnerState(champion: Champion, role: Role | null, view: PartnerView): PartnerStateResult {
  if (!role) return { state: "none", partnerId: null, denyChance: 0 };
  const partners = getComboPartners(champion.id, role);
  if (!partners.length) return { state: "none", partnerId: null, denyChance: 0 };

  const secured = partners.find((entry) => view.ownPicks.includes(entry.partnerId));
  if (secured) return { state: "secured", partnerId: secured.partnerId, denyChance: 0 };

  const playable = partners
    .filter((entry) => !view.unavailable.has(entry.partnerId) && rosterRank(view.ownRoster, entry.partnerRole, entry.partnerId) >= GRADE_RANK.C)
    .sort((a, b) => rosterRank(view.ownRoster, b.partnerRole, b.partnerId) - rosterRank(view.ownRoster, a.partnerRole, a.partnerId));
  const best = playable[0];
  if (!best) return { state: "orphan", partnerId: partners[0].partnerId, denyChance: 1 };

  if (nextStepIsOurPick(view.stepIndex, view.side)) return { state: "pair-window", partnerId: best.partnerId, denyChance: 0 };

  const partner = championsById[best.partnerId]!;
  const pTake = (view.theirInterest(partner) / 10) * DRAFT_THINKING_CONFIG.lookahead.takeRate;
  const pBan = view.isVisibleToEnemy(best.partnerId) ? PAIR.banRateVisible : PAIR.banRate;
  const denyChance = 1 - Math.pow(1 - pTake, view.enemyPicksBeforeOurNext) * Math.pow(1 - pBan, view.enemyBansBeforeOurNext);
  return { state: "exposed", partnerId: best.partnerId, denyChance };
}

/** §2.4 — factorul aplicat părții dependente de partener a valorii. */
export function getPairFactor(result: PartnerStateResult): number {
  switch (result.state) {
    case "exposed":
      return 1 - result.denyChance;
    case "orphan":
      return PAIR.orphanFactor;
    default:
      return 1;
  }
}

/** value × (1 − dep) + value × dep × pairFactor */
export function adjustForPartner(value: number, dependency: number, result: PartnerStateResult): number {
  return value * (1 - dependency) + value * dependency * getPairFactor(result);
}

// ─── §3 Fearless: păstrăm combo-ul pentru un joc următor ─────────────────────

/**
 * Câte jocuri mai pot urma, cel mult, după jocul curent: bo − jocul curent (Bo3 la 1–1 → jocul 3 e ultimul, 0;
 * Bo3 jocul 2 → 1). Dacă seria se poate termina chiar acum pentru echipa AI, o acoperă `eliminationGame`.
 */
export function getGamesRemainingPossible(series: ActiveDraftSeries): number {
  return Math.max(0, series.bo - series.currentGameNumber);
}

/**
 * §3.3 — piesa de combo e orfană, dar cel puțin un partener e indisponibil DOAR în jocul ăsta (banat acum,
 * nejucat anterior, neluat de adversar): partenerul se poate folosi într-un joc următor.
 */
export function isPartnerOnlyBannedThisGame(champion: Champion, role: Role | null, game: DraftGameState, series: ActiveDraftSeries, enemyPicks: readonly string[]): boolean {
  if (!role) return false;
  const bans = new Set([...game.bansBlue, ...game.bansRed]);
  const playedBefore = new Set<string>();
  for (const previous of series.games) {
    if (previous.number >= game.number) continue;
    for (const id of [...previous.picksBlue, ...previous.picksRed]) playedBefore.add(id);
  }
  return getComboPartners(champion.id, role).some(
    (entry) => bans.has(entry.partnerId) && !playedBefore.has(entry.partnerId) && !enemyPicks.includes(entry.partnerId),
  );
}

/** Roluri pentru care un campion e piesă de combo (pentru calibrare / raport). */
export function isComboPiece(championId: string, role: Role | null): boolean {
  return Boolean(role && ROLE_ORDER.includes(role) && getComboPartners(championId, role).length);
}
