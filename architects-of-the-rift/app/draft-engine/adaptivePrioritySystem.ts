import type { Champion } from "@/app/types/champion";
import type { DraftGameState, Side } from "./draftTypes";

export function getAdaptivePriorityBonus(args: {
  candidate: Champion;
  side: Side;
  game: DraftGameState;
  enemyChampionIds: string[];
}) {
  const { candidate, side, game, enemyChampionIds } = args;
  const earlyPick = (side === "blue" ? game.picksBlue.length : game.picksRed.length) <= 1;
  let bonus = 0;

  if (earlyPick && candidate.roles.length >= 2) bonus += 1.2;
  if (side === "red" && enemyChampionIds.length >= 2) bonus += 0.6;

  const enemyHasDive = enemyChampionIds.some((id) => ["vi", "wukong", "jarvan-iv", "rell", "rakan", "nautilus"].includes(id));
  const enemyHasPoke = enemyChampionIds.some((id) => ["jayce", "ezreal", "varus", "zoe", "xerath"].includes(id));

  if (enemyHasDive && ["braum", "poppy", "janna", "lulu"].includes(candidate.id)) bonus += 2.1;
  if (enemyHasPoke && ["hard engage", "engage"].some((tag) => candidate.championTags?.includes(tag))) bonus += 1.2;

  return bonus;
}
