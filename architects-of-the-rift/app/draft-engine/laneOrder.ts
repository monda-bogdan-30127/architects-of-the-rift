// PLAYER_TRAITS §7.3 — ordinea de pick pe lane: „blind” = propriul campion pe rol a fost ales înaintea campionului
// advers de pe același rol, „counter” = după. Pentru botlane se compară adc cu adc și support cu support.
//
// Secvența de pick-uri e în starea jocului (`picksBlue` / `picksRed`, în ordinea în care s-au ales) și în
// `DRAFT_SEQUENCE`; simularea primește jocul întreg, deci `laneOrder` se calculează direct din el.

import type { Role } from "@/app/types/champion";
import { DRAFT_SEQUENCE, ROLE_ORDER, type DraftGameState, type Side } from "./draftTypes";

export type LaneOrder = Partial<Record<Role, "blind" | "counter">>;

/** championId → poziția pick-ului în secvența draftului (0 = primul pick al jocului). */
function pickPositions(game: DraftGameState): Map<string, number> {
  const positions = new Map<string, number>();
  const counters: Record<Side, number> = { blue: 0, red: 0 };
  DRAFT_SEQUENCE.forEach((step, index) => {
    if (step.action !== "pick") return;
    const picks = step.side === "blue" ? game.picksBlue : game.picksRed;
    const championId = picks[counters[step.side]];
    counters[step.side] += 1;
    if (championId) positions.set(championId, index);
  });
  return positions;
}

/** Ordinea pe lane pentru o echipă, după asignările finale ale ambelor echipe. */
export function getLaneOrder(
  game: DraftGameState,
  side: Side,
  assignments: { blue: Partial<Record<Role, string>>; red: Partial<Record<Role, string>> } = {
    blue: game.assignmentsBlue ?? {},
    red: game.assignmentsRed ?? {},
  },
): LaneOrder {
  const positions = pickPositions(game);
  const own = side === "blue" ? assignments.blue : assignments.red;
  const enemy = side === "blue" ? assignments.red : assignments.blue;
  const order: LaneOrder = {};
  for (const role of ROLE_ORDER) {
    const ownPosition = own[role] ? positions.get(own[role]!) : undefined;
    const enemyPosition = enemy[role] ? positions.get(enemy[role]!) : undefined;
    if (ownPosition === undefined || enemyPosition === undefined) continue;
    order[role] = ownPosition < enemyPosition ? "blind" : "counter";
  }
  return order;
}
