import type { Champion, Role } from "@/app/types/champion";
import type { TeamDraftEvaluation } from "./draftTypes";
import {
  ENCHANT_SUPPORT_IDS,
  HARD_PROTECT_CARRY_IDS,
  SELF_SUFFICIENT_CARRY_IDS,
  getCarryArchetype,
  getCarrySelfProtectionScore,
  getSupportArchetype,
} from "./draftArchetypes";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getCarryProtectionDemandScore(champion: Champion | null) {
  if (!champion || !champion.roles.includes("adc")) return 0;
  const archetype = getCarryArchetype(champion.id);
  const selfProtection = getCarrySelfProtectionScore(champion);

  let baseDemand = 4.6;
  if (archetype === "hard-protect") baseDemand = 8.8;
  else if (archetype === "lane-prio") baseDemand = 5.8;
  else if (archetype === "dive-follow") baseDemand = 5.2;
  else if (archetype === "self-sufficient") baseDemand = 4.2;

  return clamp(baseDemand - selfProtection * 1.05, 1.4, 9.2);
}

export function inferCarryNeedPenalty(args: {
  candidate: Champion;
  allyChampionIds: string[];
  evaluation: TeamDraftEvaluation;
  championById: (championId: string) => Champion | null;
}) {
  const { candidate, allyChampionIds, evaluation, championById } = args;
  const carryChampions = allyChampionIds
    .map(championById)
    .filter((champion): champion is Champion => champion !== null && champion.roles.includes("adc"));

  if (candidate.roles.includes("adc")) carryChampions.push(candidate);
  if (carryChampions.length === 0) return 0;

  const demand = Math.max(...carryChampions.map((champion) => getCarryProtectionDemandScore(champion)));
  if (demand <= 3.2 && SELF_SUFFICIENT_CARRY_IDS.has(candidate.id)) return 0;

  const supply = evaluation.protectionScore + evaluation.antiDiveScore + evaluation.frontlineScore;
  const penaltyBase = clamp((demand + 4.5 - supply) * 0.4, 0, 5.4);

  const supportIds = allyChampionIds.filter((championId) => championById(championId)?.roles.includes("support") ?? false);
  const supportChampion = supportIds[0] ? championById(supportIds[0]) : null;
  const candidateSelfProtection = getCarrySelfProtectionScore(candidate);

  let penalty = penaltyBase;
  if (candidate.roles.includes("adc")) penalty -= candidateSelfProtection * 0.45;
  if (supportChampion && !ENCHANT_SUPPORT_IDS.has(supportChampion.id) && demand >= 5.8) {
    penalty += 0.85;
  }

  return clamp(penalty, 0, 6);
}

export function evaluateCarryProtectionDemand(championIds: string[], championById?: (championId: string) => Champion | null) {
  const carries = (championById
    ? championIds.map(championById).filter((champion): champion is Champion => champion !== null && champion.roles.includes("adc"))
    : championIds
        .filter((championId) => HARD_PROTECT_CARRY_IDS.has(championId) || !SELF_SUFFICIENT_CARRY_IDS.has(championId))
        .map((championId) => ({ id: championId, roles: ["adc"] } as Champion))
  );

  if (carries.length === 0) return 0;
  const demandValues = carries.map((champion) => getCarryProtectionDemandScore(champion));
  return clamp(Math.max(...demandValues) + average(demandValues) * 0.25, 0, 10);
}

export function evaluateTeamProtectionSupply(evaluation: Pick<TeamDraftEvaluation, "protectionScore" | "antiDiveScore" | "frontlineScore">) {
  return clamp(evaluation.protectionScore * 0.45 + evaluation.antiDiveScore * 0.3 + evaluation.frontlineScore * 0.25, 0, 10);
}

export function getBotLaneArchetypeFit(args: {
  championIds: string[];
  championById: (championId: string) => Champion | null;
}) {
  const adcChampion = args.championIds.map(args.championById).find((champion): champion is Champion => champion !== null && champion.roles.includes("adc")) ?? null;
  const supportChampion = args.championIds.map(args.championById).find((champion): champion is Champion => champion !== null && champion.roles.includes("support")) ?? null;

  if (!adcChampion || !supportChampion) return 5;

  const carryType = getCarryArchetype(adcChampion.id);
  const supportType = getSupportArchetype(supportChampion.id);

  if (carryType === "hard-protect") {
    if (supportType === "peel-enchant") return 9.2;
    if (supportType === "hard-engage") return 5.2;
    if (supportType === "roaming-playmaker") return 4.4;
  }

  if (carryType === "self-sufficient") {
    const selfProtection = getCarrySelfProtectionScore(adcChampion);
    if (supportType === "roaming-playmaker" || supportType === "lane-enabler") return selfProtection >= 3 ? 8.9 : 8.4;
    if (supportType === "hard-engage") return selfProtection >= 3 ? 7.8 : 7.4;
  }

  if (carryType === "dive-follow") {
    if (supportType === "hard-engage") return 9.1;
    if (supportType === "roaming-playmaker") return 7.8;
  }

  if (carryType === "lane-prio") {
    if (supportType === "lane-enabler") return 8.8;
    if (supportType === "hard-engage") return 8.2;
  }

  return 6.4;
}

export function getLaneIdentityCoherence(args: {
  championIds: string[];
  championById: (championId: string) => Champion | null;
}) {
  const champions = args.championIds.map(args.championById).filter((champion): champion is Champion => champion !== null);
  if (champions.length === 0) return 5;

  const values = champions.map((champion) => {
    const archetype = champion.roles.includes("adc")
      ? getCarryArchetype(champion.id)
      : champion.roles.includes("support")
        ? getSupportArchetype(champion.id)
        : "balanced";
    switch (archetype) {
      case "hard-protect":
      case "peel-enchant":
        return 7;
      case "self-sufficient":
      case "roaming-playmaker":
        return 8;
      case "dive-follow":
      case "hard-engage":
        return 8.5;
      case "lane-prio":
      case "lane-enabler":
        return 8.2;
      default:
        return 6;
    }
  });

  return clamp(average(values), 0, 10);
}

export function getCarryDependencyPenalty(args: {
  championIds: string[];
  evaluation: Pick<TeamDraftEvaluation, "protectionScore" | "antiDiveScore" | "frontlineScore">;
  championById: (championId: string) => Champion | null;
}) {
  const demand = evaluateCarryProtectionDemand(args.championIds, args.championById);
  if (demand <= 0) return 0;
  const supply = evaluateTeamProtectionSupply(args.evaluation);
  const adcChampion = args.championIds.map(args.championById).find((champion): champion is Champion => champion !== null && champion.roles.includes("adc")) ?? null;
  const supportChampion = args.championIds.map(args.championById).find((champion): champion is Champion => champion !== null && champion.roles.includes("support")) ?? null;
  const carryType = getCarryArchetype(adcChampion?.id);
  const supportType = getSupportArchetype(supportChampion?.id);

  let penalty = Math.max(0, demand - supply) * 0.45;
  if (carryType === "hard-protect" && supportType === "hard-engage") penalty += 1.35;
  if (carryType === "hard-protect" && supportType === "roaming-playmaker") penalty += 1.6;
  return clamp(penalty, 0, 6.5);
}

export function countRoleChampions(championIds: string[], role: Role, championById: (championId: string) => Champion | null) {
  return championIds.reduce((sum, championId) => sum + ((championById(championId)?.roles.includes(role) ?? false) ? 1 : 0), 0);
}
