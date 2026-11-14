// PLAYER_TRAITS / TEAM_FIT_LIVE §5 — chip-ul unui trait de jucător: fundal discret și tooltip cu descrierea, ca să se
// vadă că e ceva cu efect în joc, nu text oarecare. Intensity 2 e marcată cu „●”.

import type { PlayerTrait } from "@/app/types/playerTraits";
import { PLAYER_TRAIT_INFO } from "@/app/types/playerTraits";

type Props = {
  trait: PlayerTrait;
  /** Mic (tabel, bara de jos) sau normal (preview, rosters). */
  size?: "small" | "normal";
  /** Culoarea după context (draftul de campioni); implicit neutru. */
  tone?: "good" | "bad" | "neutral";
};

const TONE_COLORS = {
  good: { color: "var(--success)", border: "var(--success)" },
  bad: { color: "var(--danger)", border: "var(--danger)" },
  neutral: { color: "var(--text-secondary)", border: "rgba(255,255,255,0.14)" },
} as const;

export default function TraitChip({ trait, size = "normal", tone = "neutral" }: Props) {
  const info = PLAYER_TRAIT_INFO[trait.id];
  const colors = TONE_COLORS[tone];
  const small = size === "small";
  return (
    <span
      title={`${info.label}${trait.intensity === 2 ? " (Strong)" : ""}: ${info.description}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: small ? "1px 6px" : "3px 8px",
        borderRadius: 999,
        border: `1px solid ${colors.border}`,
        background: "rgba(255,255,255,0.05)",
        color: colors.color,
        fontSize: small ? 9 : 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        cursor: "help",
        lineHeight: 1.3,
      }}
    >
      {info.label}
      {trait.intensity === 2 ? <span style={{ color: "var(--text-highlight)" }}>●</span> : null}
    </span>
  );
}
