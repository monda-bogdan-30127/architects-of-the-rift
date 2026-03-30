import type { Champion } from "@/app/types/champion";
import { champions as legacyChampions } from "@/app/data/champions";

const registry = new Map<string, Champion>();

export function registerChampion(champion: Champion) {
  registry.set(champion.id, champion);
}

export function clearChampionRegistry() {
  registry.clear();
}

export function getRegisteredChampionById(id: string): Champion | null {
  return registry.get(id) ?? null;
}

export function getRegisteredChampions(): Champion[] {
  return Array.from(registry.values());
}

export function buildChampionRegistry() {
  clearChampionRegistry();
  for (const champion of legacyChampions) {
    registerChampion(champion);
  }
}

buildChampionRegistry();
