// ═══════════════════════════════════════════════════════════════════════════
// SpiritIndicator
//
// Reusable visual: colored dot with the spirit value inside, optionally
// followed by the "Feels <Label>" text per design spec.
//
// Usage:
//   <SpiritIndicator playerId="faker" />
//   <SpiritIndicator playerId="faker" showLabel />
//   <SpiritIndicator value={84} showLabel />
//
// FILE: components/ui/SpiritIndicator.tsx
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";
import {
  getSpirit,
  getSpiritFeelsLabel,
  getSpiritLabelConfig,
} from "@/app/draft-engine/playerSpiritStorage";

type Props = {
  /** Either provide a playerId (reads from storage) or a fixed value. */
  playerId?: string;
  value?: number;
  showLabel?: boolean;
  size?: "small" | "medium" | "large";
};

const SIZE_PX: Record<NonNullable<Props["size"]>, { dot: number; font: number; labelFont: number }> = {
  small:  { dot: 24, font: 11, labelFont: 13 },
  medium: { dot: 32, font: 13, labelFont: 16 },
  large:  { dot: 40, font: 15, labelFont: 18 },
};

export default function SpiritIndicator({
  playerId,
  value,
  showLabel = false,
  size = "medium",
}: Props) {
  const [spiritValue, setSpiritValue] = useState<number>(() => {
    if (typeof value === "number") return value;
    if (playerId) return getSpirit(playerId);
    return 65;
  });

  // Re-read from storage when playerId changes or when storage is updated
  // by another tab / a series finishing.
  useEffect(() => {
    if (typeof value === "number") {
      setSpiritValue(value);
      return;
    }
    if (!playerId) return;

    setSpiritValue(getSpirit(playerId));

    const refresh = () => setSpiritValue(getSpirit(playerId));
    window.addEventListener("storage", refresh);
    window.addEventListener("rift-spirit-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("rift-spirit-updated", refresh);
    };
  }, [playerId, value]);

  const config = getSpiritLabelConfig(spiritValue);
  const dims = SIZE_PX[size];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        aria-label={`Spirit ${spiritValue}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: dims.dot,
          height: dims.dot,
          borderRadius: "50%",
          background: config.color,
          color: "#0B0B0F",
          fontSize: dims.font,
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: '"Spiegel", sans-serif',
        }}
      >
        {spiritValue}
      </span>

      {showLabel && (
        <span
          style={{
            color: "var(--text-primary)",
            fontSize: dims.labelFont,
            fontWeight: 500,
            fontFamily: '"Spiegel", sans-serif',
          }}
        >
          {getSpiritFeelsLabel(spiritValue)}
        </span>
      )}
    </div>
  );
}
