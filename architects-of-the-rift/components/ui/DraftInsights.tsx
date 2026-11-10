"use client";

// FEEDBACK_FIXES §7 — UI-ul de draft: tipul de comp, atributele echipei (live) și hover-ul pe campion.

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Champion } from "@/app/types/champion";
import { COMP_ATTRIBUTE_INFO } from "@/app/types/compAttributes";
import type { ChampionMatchupLine, IdentitySummary, TeamAttributes, TeamAttribute } from "@/app/draft-engine/draftInsights";

const FONT = '"Spiegel", sans-serif';

function Bar({ value, max = 10, color = "var(--primary)", alignRight = false }: { value: number; max?: number; color?: string; alignRight?: boolean }) {
  const width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
  return (
    <div style={{ flex: 1, height: 4, background: "var(--border-default)", borderRadius: 2, overflow: "hidden", display: "flex", justifyContent: alignRight ? "flex-end" : "flex-start" }}>
      <div style={{ width, height: "100%", background: color, borderRadius: 2, transition: "width 0.2s" }} />
    </div>
  );
}

// ─── 7.1 Indicatorul de comp type ────────────────────────────────────────────
export function CompIdentityIndicator({ summary, alignRight = false }: { summary: IdentitySummary; alignRight?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 8, padding: "0 2px", alignItems: alignRight ? "flex-end" : "flex-start" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "baseline", flexDirection: alignRight ? "row-reverse" : "row" }}>
        <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, letterSpacing: "0.06em", color: summary.split ? "var(--warning)" : "var(--text-primary)", textTransform: "uppercase" }}>
          {summary.split ?? summary.label}
        </span>
        {summary.companion && (
          <span style={{ fontSize: 10, fontFamily: FONT, color: "var(--text-secondary)" }}>{summary.companion}</span>
        )}
      </div>
      <div style={{ width: "100%", display: "flex" }}>
        <Bar value={summary.strength} max={1} color={summary.split ? "var(--warning)" : "var(--primary)"} alignRight={alignRight} />
      </div>
    </div>
  );
}

// ─── 7.2 Atributele echipei (live, pliabil) ───────────────────────────────────
function AttributeRow({ attribute, delta, alignRight }: { attribute: TeamAttribute; delta?: number; alignRight: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: alignRight ? "row-reverse" : "row" }} title={COMP_ATTRIBUTE_INFO[attribute.key].label}>
      <span style={{ width: 62, flexShrink: 0, fontSize: 9, fontFamily: FONT, color: "var(--text-secondary)", textAlign: alignRight ? "right" : "left" }}>{attribute.label}</span>
      <Bar value={attribute.value} alignRight={alignRight} />
      <span style={{ width: 26, flexShrink: 0, fontSize: 9, fontFamily: FONT, textAlign: "right", color: delta ? (delta > 0 ? "var(--success)" : "var(--danger)") : "var(--text-muted)" }}>
        {delta ? `${delta > 0 ? "+" : ""}${delta.toFixed(0)}` : attribute.value.toFixed(0)}
      </span>
    </div>
  );
}

function DamageSplit({ ad, ap, alignRight = false }: { ad: number; ap: number; alignRight?: boolean }) {
  const total = ad + ap;
  const adShare = total > 0 ? (ad / total) * 100 : 50;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: alignRight ? "row-reverse" : "row" }} title={`AD ${ad} · AP ${ap}`}>
      <span style={{ width: 62, flexShrink: 0, fontSize: 9, fontFamily: FONT, color: "var(--text-secondary)", textAlign: alignRight ? "right" : "left" }}>AD / AP</span>
      <div style={{ flex: 1, height: 4, display: "flex", borderRadius: 2, overflow: "hidden", background: "var(--border-default)" }}>
        {total > 0 && (
          <>
            <div style={{ width: `${adShare}%`, background: "#E8894A" }} />
            <div style={{ width: `${100 - adShare}%`, background: "#7A8CFF" }} />
          </>
        )}
      </div>
      <span style={{ width: 26, flexShrink: 0, fontSize: 9, fontFamily: FONT, textAlign: "right", color: "var(--text-muted)" }}>
        {total > 0 ? `${Math.round(adShare)}%` : "—"}
      </span>
    </div>
  );
}

export function TeamAttributesPanel({ attributes, alignRight = false }: { attributes: TeamAttributes; alignRight?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginTop: 10, borderTop: "1px solid var(--divider)", paddingTop: 6 }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="label"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%", textAlign: alignRight ? "right" : "left", color: "var(--text-muted)", fontSize: 9, marginBottom: open ? 5 : 0 }}
        aria-expanded={open}
      >
        TEAM ATTRIBUTES {open ? "▾" : "▸"}
      </button>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {attributes.attributes.map((attribute) => (
            <AttributeRow key={attribute.key} attribute={attribute} alignRight={alignRight} />
          ))}
          <DamageSplit ad={attributes.ad} ap={attributes.ap} alignRight={alignRight} />
        </div>
      )}
    </div>
  );
}

// ─── 7.3 Hover pe campion ─────────────────────────────────────────────────────
export type HoverPreview = {
  attributes: (TeamAttribute & { delta: number })[];
  identity: IdentitySummary;
};

function Pips({ value }: { value: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} style={{ width: 5, height: 5, borderRadius: 1, background: index <= value ? "var(--primary)" : "var(--border-default)" }} />
      ))}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 8, fontFamily: FONT, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)" }}>{title}</span>
      {children}
    </div>
  );
}

const textStyle = { fontSize: 10, fontFamily: FONT, color: "var(--text-secondary)", lineHeight: 1.3 } as const;

/** Bara de jos (LOCK IN / DRAFT READY): tooltip-ul nu coboară peste ea. */
const ACTION_BAR_SPACE = 76;

export function ChampionHoverCard({
  champion, anchor, preview, matchups,
}: {
  champion: Champion;
  anchor: DOMRect;
  preview: HoverPreview | null;
  matchups: ChampionMatchupLine[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const width = 250;
  const left = anchor.right + 8 + width <= window.innerWidth - 8 ? anchor.right + 8 : Math.max(8, anchor.left - width - 8);

  // După măsurare: urcă tooltip-ul cât să nu acopere bara cu LOCK IN (poziția direct pe nod, fără re-render).
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const maxTop = window.innerHeight - ACTION_BAR_SPACE - node.offsetHeight;
    node.style.top = `${Math.max(8, Math.min(anchor.top, maxTop))}px`;
  }, [anchor, preview, matchups]);

  const offers = [...(champion.offers ?? [])].sort((a, b) => b.strength - a.strength).slice(0, 4);
  const needs = (champion.needs ?? []).filter((need) => need.priority >= 2);
  const weaknesses = [...(champion.weaknesses ?? [])].sort((a, b) => b.severity - a.severity).slice(0, 3);

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      style={{
        position: "fixed", zIndex: 130, top: anchor.top, left, width,
        background: "var(--bg-elevated)", border: "1px solid var(--border-default)", boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
        padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 12, fontFamily: FONT, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase" }}>{champion.name}</span>
        <span style={{ ...textStyle, color: "var(--text-muted)" }}>{champion.roles.join(" / ")} · {(champion.damageProfile ?? []).join(" + ")}</span>
      </div>
      {offers.length > 0 && (
        <Section title="OFFERS">
          {offers.map((offer) => (
            <div key={offer.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={textStyle}>{COMP_ATTRIBUTE_INFO[offer.type]?.label ?? offer.type}</span>
              <Pips value={offer.strength} />
            </div>
          ))}
        </Section>
      )}
      {needs.length > 0 && (
        <Section title="NEEDS">
          <span style={textStyle}>{needs.map((need) => COMP_ATTRIBUTE_INFO[need.type]?.needLabel ?? need.type).join(", ")}</span>
        </Section>
      )}
      {weaknesses.length > 0 && (
        <Section title="WEAK INTO">
          <span style={textStyle}>{weaknesses.map((weakness) => COMP_ATTRIBUTE_INFO[weakness.exposedTo]?.label ?? weakness.exposedTo).join(", ")}</span>
        </Section>
      )}
      {preview && (
        <Section title="IF PICKED">
          <span style={{ ...textStyle, color: preview.identity.split ? "var(--warning)" : "var(--text-primary)" }}>
            {preview.identity.split ?? preview.identity.label}{preview.identity.companion ? ` ${preview.identity.companion}` : ""}
          </span>
          {preview.attributes.filter((attribute) => attribute.delta !== 0).map((attribute) => (
            <div key={attribute.key} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={textStyle}>{attribute.label}</span>
              <span style={{ ...textStyle, color: attribute.delta > 0 ? "var(--success)" : "var(--danger)" }}>
                {attribute.delta > 0 ? "+" : ""}{attribute.delta.toFixed(0)} → {attribute.value.toFixed(0)}
              </span>
            </div>
          ))}
        </Section>
      )}
      {matchups.length > 0 && (
        <Section title="VS THEIR PICKS">
          {matchups.slice(0, 4).map((line) => (
            <div key={line.label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ ...textStyle, color: line.kind === "good" ? "var(--success)" : "var(--danger)" }}>{line.label}</span>
              <span style={{ fontSize: 9, fontFamily: FONT, color: "var(--text-muted)", lineHeight: 1.3 }}>{line.reason}</span>
            </div>
          ))}
        </Section>
      )}
    </div>,
    document.body
  );
}
