import type { Champion } from "@/app/types/champion";
import type { DraftGameState, DraftPlanType, Side, TeamDraftEvaluation } from "./draftTypes";

function getOfferValue(candidate: Champion, types: string[]) {
  return candidate.offers
    .filter((offer) => types.includes(String(offer.type)))
    .reduce((sum, offer) => sum + offer.strength, 0);
}

export function getDraftPlan(args: {
  candidate: Champion;
  side: Side;
  game: DraftGameState;
  evaluation: TeamDraftEvaluation;
  enemyChampionIds: string[];
}) {
  const { candidate, side, game, evaluation, enemyChampionIds } = args;
  const allyPickCount = side === "blue" ? game.picksBlue.length : game.picksRed.length;
  const enemyPickCount = enemyChampionIds.length;

  if (side === "blue" && allyPickCount === 0) {
    if ((candidate.stats.blindPickRate ?? 0) >= 55 && candidate.roles.length >= 2) {
      return { type: "protect-blind" as DraftPlanType, bias: 2.4 };
    }
    return { type: "secure-power" as DraftPlanType, bias: 2.1 };
  }

  if (side === "red" && allyPickCount <= 1 && enemyPickCount >= 1) {
    return { type: "hold-counter" as DraftPlanType, bias: evaluation.counterScore * 0.34 };
  }

  if (evaluation.compIdentity === "pick") {
    const pickFit = getOfferValue(candidate, ["pick", "reliableCC", "roamPressure", "burst"]);
    return { type: "stabilize-comp" as DraftPlanType, bias: pickFit * 0.28 };
  }

  if (evaluation.compIdentity === "dive") {
    const diveFit = getOfferValue(candidate, ["dive", "backlineAccess", "followUp", "engage"]);
    return { type: "stabilize-comp" as DraftPlanType, bias: diveFit * 0.26 };
  }

  if (evaluation.compIdentity === "poke") {
    const pokeFit = getOfferValue(candidate, ["poke", "siege", "waveclear", "zoneControl"]);
    return { type: "stabilize-comp" as DraftPlanType, bias: pokeFit * 0.24 };
  }

  if (evaluation.compIdentity === "front-to-back") {
    const frontFit = getOfferValue(candidate, ["frontline", "peel", "frontToBack", "sustainedDamage"]);
    return { type: "stabilize-comp" as DraftPlanType, bias: frontFit * 0.24 };
  }

  if (evaluation.carryProtectionPenalty >= 1.8) {
    return {
      type: "protect-carry" as DraftPlanType,
      bias: evaluation.protectionScore * 0.3 - evaluation.carryProtectionPenalty * 0.5,
    };
  }

  if (candidate.roles.includes("support") && allyPickCount <= 2) {
    return { type: "lock-bot-prio" as DraftPlanType, bias: 1.2 };
  }

  if (candidate.roles.length >= 2 && allyPickCount <= 2) {
    return { type: "hide-solo-lane" as DraftPlanType, bias: 1.5 };
  }

  return {
    type: "stabilize-comp" as DraftPlanType,
    bias: evaluation.frontlineScore * 0.12 + evaluation.engageScore * 0.1,
  };
}