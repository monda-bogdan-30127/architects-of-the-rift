// ═══════════════════════════════════════════════════════════════════════════
// useEntranceAnimation
//
// Returns `true` only the first time the component mounts within a session,
// or after `clearEntranceAnimation(key)` has been called (e.g. when a series
// finishes and the user returns to the dashboard).
//
// FILE: app/hooks/useEntranceAnimation.ts
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";

const SESSION_PREFIX = "rift-entrance-played:";

/**
 * Returns whether entrance animations should run for this component.
 *
 * @param key - A stable unique key per component (e.g. "sidebar", "standings").
 */
export function useEntranceAnimation(key: string): boolean {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const storageKey = `${SESSION_PREFIX}${key}`;
    const alreadyPlayed = sessionStorage.getItem(storageKey);

    if (!alreadyPlayed) {
      // Mark as played before triggering so fast re-renders don't double-fire
      sessionStorage.setItem(storageKey, "1");
      requestAnimationFrame(() => setShouldAnimate(true));
    }
    // If already played: leave shouldAnimate = false → no animation classes
  }, [key]);

  return shouldAnimate;
}

/**
 * Clear the "played" flag for one or more keys so the next mount will
 * animate again. Call this when a series finishes before navigating back
 * to the dashboard.
 *
 * @param keys - The same keys passed to useEntranceAnimation. Pass nothing
 *               to reset ALL entrance animations.
 */
export function clearEntranceAnimation(...keys: string[]): void {
  if (typeof sessionStorage === "undefined") return;

  if (keys.length === 0) {
    // Clear all entrance flags
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(SESSION_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
    return;
  }

  for (const key of keys) {
    sessionStorage.removeItem(`${SESSION_PREFIX}${key}`);
  }
}
