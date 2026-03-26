export const SPLIT_HISTORY_KEY = "rift-split-history";
export const CURRENT_SPLIT_KEY = "rift-current-split";

export type SplitHistoryEntry = {
  split: number;
  champion: string;
  finalsMvp: string;
  regularSeasonMvp: string;
};

export function getCurrentSplit(): number {
  if (typeof window === "undefined") return 1;

  const raw = window.localStorage.getItem(CURRENT_SPLIT_KEY);
  if (!raw) return 1;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function incrementSplit() {
  if (typeof window === "undefined") return;

  const current = getCurrentSplit();
  window.localStorage.setItem(CURRENT_SPLIT_KEY, String(current + 1));
}

export function addSplitHistory(entry: SplitHistoryEntry) {
  if (typeof window === "undefined") return;

  const raw = window.localStorage.getItem(SPLIT_HISTORY_KEY);
  const history: SplitHistoryEntry[] = raw ? JSON.parse(raw) : [];

  history.push(entry);

  window.localStorage.setItem(SPLIT_HISTORY_KEY, JSON.stringify(history));
}
