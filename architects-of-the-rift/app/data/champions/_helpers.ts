// Helper-e pentru fișierele de campion (un fișier per campion în acest folder).

import type { Champion, ChampionWeakness } from "../../types/champion";

type DefaultedKeys =
  | "synergyWith"
  | "offers"
  | "needs"
  | "weaknesses"
  | "playerScaling"
  | "carryProfile"
  | "roleData";

/**
 * Completează câmpurile opționale. `roleData: {}` e doar o plasă de siguranță —
 * validatorul (`npm run validate:matchups`) cere câte o intrare pentru fiecare rol din `roles`.
 */
export const createChampion = (
  champion: Omit<Champion, DefaultedKeys> & Partial<Pick<Champion, DefaultedKeys>>,
): Champion => ({
  synergyWith: [],
  offers: [],
  needs: [],
  weaknesses: [],
  carryProfile: undefined,
  roleData: {},
  ...champion,
});

export const mergeWeaknesses = (weaknesses: ChampionWeakness[]): ChampionWeakness[] => {
  const merged = new Map<ChampionWeakness["exposedTo"], ChampionWeakness>();

  for (const weakness of weaknesses) {
    const existing = merged.get(weakness.exposedTo);

    if (!existing || weakness.severity > existing.severity) {
      merged.set(weakness.exposedTo, weakness);
    }
  }

  return Array.from(merged.values());
};
