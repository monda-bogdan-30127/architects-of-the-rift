import type { Champion } from "@/app/types/champion";
import {
  buildChampionRegistry,
  getRegisteredChampionById,
  getRegisteredChampions,
} from "./championRegistry";

let cachedChampions: Champion[] = [];
let cachedChampionMap = new Map<string, Champion>();

function refreshChampionCache() {
  buildChampionRegistry();
  cachedChampions = getRegisteredChampions();
  cachedChampionMap = new Map(cachedChampions.map((champion) => [champion.id, champion]));
}

refreshChampionCache();

export function getChampionPool(): Champion[] {
  return cachedChampions;
}

export function getChampionMap(): Map<string, Champion> {
  return cachedChampionMap;
}

export function getChampionFromPool(id: string): Champion | null {
  return getRegisteredChampionById(id);
}

export function rebuildChampionPool() {
  refreshChampionCache();
}
