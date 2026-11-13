"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useIsClient } from "@/app/hooks/useClientStorage";
import { createPortal } from "react-dom";
import type { Player } from "@/app/types/player";
import { PLAYER_TRAIT_INFO, isActiveTrait } from "@/app/types/playerTraits";
import { COMMS_TOOLTIP, getCommsInfo } from "@/app/utils/playerTraitUtils";

type Props = {
  player: Player;
  anchorRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
};

type TooltipPosition = {
  top: number;
  left: number;
};

const GAP = 16;
const VIEWPORT_MARGIN = 16;
const TOOLTIP_WIDTH = 486;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// ─── Playstyle descriptions ───────────────────────────────────────────────────
const STYLE_DESCRIPTIONS: Record<string, string> = {
  // Internal labels (from PlayerStyleLabel)
  Carry:        "The player demands and consumes resources (gold, priority, vision) to be the decisive factor. He plays for himself to win the game.",
  Scaler:       "Patient early, becomes more dangerous every minute. Avoids early fights and spikes into a win condition.",
  Hypercarry:   "Needs setup and time. Weak early but dominant late if protected. The team plays around his timing.",
  Playmaker:    "Initiates plays for the team, roams, creates opportunities. Team oriented, not solo kills.",
  Assassin:     "Hunts individual kills and picks. Plays for himself, not team fights. High risk, high reward.",
  Aggressive:   "Constant pressure, high risk tolerance, refuses to play passively.",
  Brawler:      "Dominates skirmishes and 1v2s. Avoids full teamfights, wins the game through physical aggression.",
  Weakside:     "Accepts fewer resources, plays safe, does not demand priority. Performs well without attention.",
  Setup:        "Dependent on teammates to function. Creates conditions for others but cannot win alone.",
  Roamer:       "Constantly moving across the map. Does not stay in lane, creates impact through rotational presence.",
  "Lane Bully": "Dominates laning phase. Wants to win the line before anything else.",
  Flex:         "No dominant style. Adapts to what the draft or team needs.",
  Utility:      "Full toolbox of shields, heals, vision, and peel. Value distributed across all phases.",
  Facilitator:  "Creates conditions for teammates: shields, heals, vision, peel.",
  Engage:       "The initiator. Enters the fight first and creates opportunities through aggression.",
  Enchanter:    "Amplifies carries through heals, buffs, and protection.",
  Tank:         "Intentional frontliner. Sacrifices personal resources for physical presence.",
  Farmer:       "Farm-first early. Accumulates resources passively and spikes late.",
  Poke:         "Chip damage at range. Wears down enemies before committing to a fight.",
  Teamfighter:  "Excels in 5v5 chaos. Consistent damage and positioning in full fights.",
  Controller:   "Disciplined, macro-oriented. Plays for objectives and game structure, not kill pressure.",
  Splitpush:    "Prefers side lanes over teamfights. Creates pressure through the threat of splitting.",
};

export default function PlayerCardTooltip({ player, anchorRef, visible }: Props) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const mounted = useIsClient();
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });

  const { seed } = player.advancedProfile;
  const { displayPrimary, displaySecondary } = player.playstyleIdentity;
  // PLAYER_TRAITS §3: trait-urile (doar familiile cu efecte implementate) în locul tag-urilor de playstyle.
  const traits = (player.traits ?? []).filter(isActiveTrait);
  const comms = getCommsInfo(player);

  const primaryDesc  = STYLE_DESCRIPTIONS[displayPrimary]  ?? "A dominant playstyle that defines this player's approach to the game.";
  const secondaryDesc = STYLE_DESCRIPTIONS[displaySecondary] ?? "A complementary tendency that colours how this player operates.";

  useLayoutEffect(() => {
    if (!visible || !anchorRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const anchorRect  = anchorRef.current?.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      if (!anchorRect || !tooltipRect) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const rightLeft = anchorRect.right + GAP;
      const leftLeft  = anchorRect.left - tooltipRect.width - GAP;

      let left = rightLeft;
      let top  = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;

      if (rightLeft + tooltipRect.width + VIEWPORT_MARGIN <= vw) {
        left = rightLeft;
      } else if (leftLeft >= VIEWPORT_MARGIN) {
        left = leftLeft;
      } else {
        left = clamp(
          anchorRect.left + (anchorRect.width - tooltipRect.width) / 2,
          VIEWPORT_MARGIN,
          vw - tooltipRect.width - VIEWPORT_MARGIN,
        );
        const bottomTop = anchorRect.bottom + GAP;
        const topTop    = anchorRect.top - tooltipRect.height - GAP;
        top = bottomTop + tooltipRect.height + VIEWPORT_MARGIN <= vh
          ? bottomTop
          : topTop >= VIEWPORT_MARGIN
            ? topTop
            : top;
      }

      top  = clamp(top,  VIEWPORT_MARGIN, vh - tooltipRect.height - VIEWPORT_MARGIN);
      left = clamp(left, VIEWPORT_MARGIN, vw - tooltipRect.width  - VIEWPORT_MARGIN);
      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, visible]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: TOOLTIP_WIDTH,
        zIndex: 9999,
        borderRadius: 16,
        background: "var(--bg-elevated, #1a1a2e)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "-8px 8px 8px 0 rgba(0,0,0,0.45)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      {/* Header — player name */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-secondary, rgba(255,255,255,0.5))", textTransform: "uppercase" }}>
        {player.name.toUpperCase()}
      </div>

      {/* Top 3-column row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>

        {/* Seed */}
        <div style={colStyle}>
          <SectionLabel>Seed</SectionLabel>
          <SeedRow label="Execution"  value={seed.execution}  />
          <SeedRow label="Map Sens"   value={seed.mapSense}    />
          <SeedRow label="Combat"     value={seed.combat}      />
          <SeedRow label="Resilience" value={seed.resilience}  />
          <SeedRow label="Stability"  value={seed.stability}   />
          <SeedRow label="Game Read"  value={seed.gameRead}    />
        </div>

        {/* 1st Playstyle */}
        <div style={colStyle}>
          <SectionLabel>1st Play Style</SectionLabel>
          <StyleBlock label={displayPrimary} description={primaryDesc} />
        </div>

        {/* 2nd Playstyle */}
        <div style={colStyle}>
          <SectionLabel>2nd Play Style</SectionLabel>
          <StyleBlock label={displaySecondary} description={secondaryDesc} />
        </div>

      </div>

      {/* Traits row */}
      {traits.length > 0 && (
        <div style={colStyle}>
          <SectionLabel>Traits</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {traits.map((trait) => (
              <div key={trait.id} style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-primary, rgba(255,255,255,0.9))" }}>
                <span style={{ color: "var(--text-highlight, #e2b96a)", fontWeight: 600 }}>{PLAYER_TRAIT_INFO[trait.id].label}</span>
                {trait.intensity === 2 ? (
                  <span style={{ color: "var(--text-highlight, #e2b96a)", fontSize: 10, fontWeight: 700, marginLeft: 6 }}>STRONG</span>
                ) : null}
                <span style={{ color: "var(--text-secondary, rgba(255,255,255,0.55))" }}> · {PLAYER_TRAIT_INFO[trait.id].description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLAYER_TRAITS §3.1: comunicarea */}
      <div style={colStyle}>
        <SectionLabel>Comms</SectionLabel>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-primary, rgba(255,255,255,0.9))" }}>
          <span style={{ color: "var(--text-highlight, #e2b96a)", fontWeight: 600 }}>{comms.level}</span>
          {comms.leader ? <span style={{ color: "var(--text-highlight, #e2b96a)", fontWeight: 600 }}> · Leader</span> : null}
          <span style={{ color: "var(--text-secondary, rgba(255,255,255,0.55))" }}> · {COMMS_TOOLTIP}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const colStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: 10,
  padding: "10px 12px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: "var(--text-secondary, rgba(255,255,255,0.4))",
      marginBottom: 2,
    }}>
      {children}
    </div>
  );
}

function SeedRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: 12, color: "var(--text-secondary, rgba(255,255,255,0.55))" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary, rgba(255,255,255,0.9))", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

function StyleBlock({ label, description }: { label: string; description: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-highlight, #e2b96a)" }}>
        {label}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.55, color: "var(--text-secondary, rgba(255,255,255,0.60))" }}>
        {description}
      </div>
    </div>
  );
}