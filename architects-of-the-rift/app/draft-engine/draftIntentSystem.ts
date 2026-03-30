import type { Champion } from "@/app/types/champion";
import type { DraftGameState, Side } from "./draftTypes";
import { getMetaPriorityScore } from "./draftEvaluator";

export type DraftIntent = "power" | "synergy" | "deny" | "counter" | "comfort" | "plan-fill";

export type DraftIntentBreakdown = {
  primary: DraftIntent;
  weights: Record<DraftIntent, number>;
};

export function getDraftIntent(args: {
  candidate: Champion;
  side: Side;
  game: DraftGameState;
  synergyScore: number;
  counterScore: number;
  comfortScore: number;
  planBonus: number;
}) : DraftIntentBreakdown {
  const { candidate, game, synergyScore, counterScore, comfortScore, planBonus } = args;
  const pickNumber = (game.picksBlue.length + game.picksRed.length) + 1;
  const metaPriority = getMetaPriorityScore(candidate);

  const weights: Record<DraftIntent, number> = {
    power: metaPriority * (pickNumber <= 4 ? 1.25 : 0.85),
    synergy: synergyScore,
    deny: metaPriority * 0.4,
    counter: counterScore,
    comfort: comfortScore,
    "plan-fill": planBonus,
  };

  const primary = (Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "power") as DraftIntent;
  return { primary, weights };
}
