import type { FinalsMvpResult } from "./playoffTypes";

export const PLAYOFF_CHAMPION_KEY = "rift-playoff-champion";
export const PLAYOFF_MVP_KEY = "rift-finals-mvp";

export function savePlayoffChampion(teamName: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYOFF_CHAMPION_KEY, teamName);
}

export function saveFinalsMvp(finalsMvp: FinalsMvpResult) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYOFF_MVP_KEY, JSON.stringify(finalsMvp));
}
