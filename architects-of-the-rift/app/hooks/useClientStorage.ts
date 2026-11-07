"use client";

// Citiri din browser fără `setState` în `useEffect` (regula react-hooks/set-state-in-effect).
// `useSyncExternalStore` dă valoarea de server (`false` / `null`) la SSR și la
// hidratare, apoi valoarea reală pe client — fără mismatch de hidratare.

import { useMemo, useSyncExternalStore } from "react";

const subscribeNothing = () => () => {};

/** `false` la SSR și la hidratare, `true` după montarea pe client. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribeNothing, () => true, () => false);
}

function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Valoarea brută din `localStorage` (null pe server / dacă lipsește). Se actualizează la evenimentul `storage`. */
export function useStoredString(key: string): string | null {
  return useSyncExternalStore(
    subscribeStorage,
    () => readStorage(key),
    () => null,
  );
}

/** JSON-ul din `localStorage`, parsat (null dacă lipsește sau e invalid). */
export function useStoredJson<T>(key: string): T | null {
  const raw = useStoredString(key);
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [raw]);
}
