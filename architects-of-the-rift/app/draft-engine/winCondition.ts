// Win condition-ul compoziției (DRAFT_THINKING §5.3): pick-ul propriu care
// contribuie cel mai mult la identitatea dominantă, plus bonusul pentru candidații
// care îi satisfac nevoile și penalizarea pentru un al doilea carry hard-protect.

import { players } from "@/app/data/players";
import type { Champion, Role } from "@/app/types/champion";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getChampionRoleProfile } from "./championProfileSystem";
import { getCandidateIdentityFit, type CompIdentityReading } from "./compIdentity";
import { getCarryArchetype } from "./draftArchetypes";
import { getChampionById } from "./draftEvaluator";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { ROLE_ORDER } from "./draftTypes";
import { getResourceDemand } from "./championResource";
import { hasTrait } from "@/app/utils/playerTraitUtils";

const WIN = DRAFT_THINKING_CONFIG.winCondition;
const playersById = new Map(players.map((player) => [player.id, player]));

export type WinCondition = {
  championId: string;
  role: Role;
  kind: "carry" | "jungle-tempo" | "teamfight-engage" | "split";
};

const offerOf = (champion: Champion, type: string) =>
  Math.max(0, ...(champion.offers ?? []).filter((offer) => String(offer.type) === type).map((offer) => offer.strength));

function carryContribution(champion: Champion, role: Role): number {
  const tags = new Set(getChampionRoleProfile(champion, role)?.tags ?? []);
  let bonus = 0;
  if (tags.has("primary-carry") || tags.has("dps") || role === "adc") bonus += WIN.carryBonus;
  // Un carry hard-protect e win condition-ul compoziției oricare ar fi identitatea (totul se joacă pentru el).
  if (getCarryArchetype(champion.id) === "hard-protect") bonus += WIN.hardProtectBonus;
  return bonus;
}

function kindOf(champion: Champion, role: Role, identity: CompIdentityReading["dominant"]): WinCondition["kind"] {
  const tags = new Set(getChampionRoleProfile(champion, role)?.tags ?? []);
  if (role === "jungle" && (identity === "dive" || identity === "pick")) return "jungle-tempo";
  if (role === "top" && Math.max(offerOf(champion, "sideLanePressure"), offerOf(champion, "splitpush")) >= 4) return "split";
  if (tags.has("engage") && (identity === "teamfight" || identity === "dive")) return "teamfight-engage";
  return "carry";
}

/**
 * Pick-ul propriu cu cea mai mare contribuție la identitatea dominantă
 * (fit + carry). La egalitate: gradul de mastery, apoi ordinea pick-ului.
 */
export function getWinCondition(
  ownPicks: string[],
  roles: Partial<Record<Role, string>>,
  identity: CompIdentityReading,
  roster: Partial<Record<Role, string>> = {},
): WinCondition | null {
  if (!identity.dominant || ownPicks.length === 0) return null;
  let best: { championId: string; role: Role; score: number; demand: number; hog: number; grade: number; order: number } | null = null;
  ownPicks.forEach((championId, order) => {
    const champion = getChampionById(championId);
    const role = ROLE_ORDER.find((entry) => roles[entry] === championId);
    if (!champion || !role) return;
    // COMP_ATTRIBUTES_EXPANSION §2.2: un campion weakside (cerere < 3) nu poate fi win condition.
    const demand = getResourceDemand(championId, role);
    if (demand < DRAFT_THINKING_CONFIG.attributes.winConditionMinDemand) return;
    const score = getCandidateIdentityFit(champion, role, identity.dominant!) + carryContribution(champion, role);
    const player = roster[role] ? playersById.get(roster[role]!) : undefined;
    const grade = player ? GRADE_RANK[getChampionGrade(player, championId)] : 0;
    // PLAYER_TRAITS §4.3: la egalitate (după cerere), câștigă campionul jucat de un resource_hog. Nu depinde de
    // resourceDemand (egalitățile de scor sunt dese), deci e în spatele unui flag, ca botFocusEnabled.
    const hog = DRAFT_THINKING_CONFIG.traits.winConditionHogTieEnabled && hasTrait(player, "resource_hog") ? 1 : 0;
    const tieBreak = (current: NonNullable<typeof best>) =>
      demand > current.demand ||
      (demand === current.demand && (hog > current.hog || (hog === current.hog && (grade > current.grade || (grade === current.grade && order < current.order)))));
    if (!best || score > best.score + 1e-9 || (Math.abs(score - best.score) <= 1e-9 && tieBreak(best))) {
      best = { championId, role, score, demand, hog, grade, order };
    }
  });
  if (!best) return null;
  const chosen = best as { championId: string; role: Role };
  const champion = getChampionById(chosen.championId)!;
  return { championId: chosen.championId, role: chosen.role, kind: kindOf(champion, chosen.role, identity.dominant) };
}

/** Protecție pe pick-urile proprii (peel + antiDive + disengage din `offers`). */
function protectionSupply(ownPicks: readonly string[]): number {
  return ownPicks.reduce((sum, id) => {
    const champion = getChampionById(id);
    if (!champion) return sum;
    return sum + offerOf(champion, "peel") + offerOf(champion, "antiDive") + offerOf(champion, "disengage");
  }, 0);
}

export type WinConditionEffect = { bonus: number; line: string | null };

/**
 * §5.3 — candidatul satisface `needs` (prioritate ≥ 2) ale win condition-ului cu
 * `offers` (strength ≥ 3, același tip) → +1.5; un al doilea carry hard-protect
 * când win condition-ul e deja hard-protect și echipa nu are protecție → −1.5.
 */
export function getWinConditionEffect(
  candidate: Champion,
  winCondition: WinCondition | null,
  ownPicks: readonly string[],
): WinConditionEffect {
  if (!winCondition || winCondition.championId === candidate.id) return { bonus: 0, line: null };
  const carry = getChampionById(winCondition.championId);
  if (!carry) return { bonus: 0, line: null };

  const enabledNeed = (carry.needs ?? []).find(
    (need) => need.priority >= WIN.minNeedPriority && offerOf(candidate, String(need.type)) >= WIN.minOfferStrength,
  );
  if (enabledNeed) {
    return { bonus: WIN.enableBonus, line: `Supports the win condition (${carry.name}): ${enabledNeed.type}` };
  }

  if (
    getCarryArchetype(carry.id) === "hard-protect" &&
    getCarryArchetype(candidate.id) === "hard-protect" &&
    protectionSupply(ownPicks) < WIN.minProtectionSupply
  ) {
    return { bonus: -WIN.secondHardProtectPenalty, line: `Second carry to protect next to ${carry.name}, without protection` };
  }
  return { bonus: 0, line: null };
}
