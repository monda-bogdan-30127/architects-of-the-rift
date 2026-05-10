// ═══════════════════════════════════════════════════════════════════════════
// BeAwareDialog
//
// Pre-series warning dialog.  When the controlled team has one or more
// players with spirit below the warning threshold (45), this dialog appears
// before entering the draft so the user is informed.
//
// Per design (Image #2): a centered modal with "Be Aware!" header in warning
// color, listing each affected player as
//
//     "Player feels <bad label> — <Recommendation>"
//
// followed by a single primary "MOVE TO THE SERIES" button.
//
// FILE: components/ui/BeAwareDialog.tsx
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import {
  getSpiritFeelsLabel,
  getSpiritLabelConfig,
} from "@/app/draft-engine/playerSpiritStorage";

export type BeAwareEntry = {
  playerId: string;
  playerName: string;
  spirit: number;
  recommendation: string;
};

type Props = {
  open: boolean;
  entries: BeAwareEntry[];
  onContinue: () => void;
};

export const BE_AWARE_THRESHOLD = 45;

// ─── Recommendation builder ─────────────────────────────────────────────────
//
// Given a player's situation (spirit value + label), return a short
// actionable suggestion.  Kept simple and deterministic on purpose — these
// are quick hints, not deep analysis.

export function buildRecommendation(spirit: number): string {
  const label = getSpiritLabelConfig(spirit).label;
  switch (label) {
    case "On Edge":
      return "Lock in their signature picks — bench is an option";
    case "Unhappy":
      return "Draft comfort champions to rebuild morale";
    case "Frustrated":
      return "Avoid forcing off-comfort picks this series";
    default:
      // Should never reach here under threshold, but keep a friendly fallback.
      return "Watch their pool carefully";
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function BeAwareDialog({ open, entries, onContinue }: Props) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,11,15,0.40)] backdrop-blur-[4px] px-[16px]"
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="be-aware-title"
        className="
          relative
          flex w-[640px] max-w-[calc(100vw-32px)] flex-col
          items-center gap-[24px]
          rounded-[16px]
          bg-[var(--bg-surface)]
          px-[40px] py-[40px]
          text-center
          shadow-[0_24px_80px_rgba(0,0,0,0.45)]
        "
      >
        <h2
          id="be-aware-title"
          className="h1"
          style={{ color: "#FFB347" }}
        >
          Be Aware!
        </h2>

        <div className="flex flex-col gap-[12px]">
          {entries.length === 0 ? (
            <p className="body-large text-[var(--text-secondary)]">
              All players are in good spirits.
            </p>
          ) : (
            entries.map((entry) => (
              <p
                key={entry.playerId}
                className="body-large"
                style={{ color: "var(--text-primary)" }}
              >
                <span style={{ fontWeight: 600 }}>{entry.playerName}</span>{" "}
                {getSpiritFeelsLabel(entry.spirit).toLowerCase()} —{" "}
                <span style={{ color: "var(--text-secondary)" }}>
                  {entry.recommendation}
                </span>
              </p>
            ))
          )}
        </div>

        <Button
          variant="main"
          onClick={onContinue}
          className="min-w-[200px] !rounded-[16px]"
        >
          MOVE TO THE SERIES
        </Button>
      </div>
    </div>,
    document.body,
  );
}
