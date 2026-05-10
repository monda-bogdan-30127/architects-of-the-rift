// ═══════════════════════════════════════════════════════════════════════════
// SpiritLogTab
//
// Renders inside the player profile section on the rosters page when the
// "SPIRIT LOG" tab is selected.  Shows:
//
//   ─ a SPIRIT progress bar (gradient red → yellow → green) with the current
//     value as a marker beneath it
//   ─ chronologically-grouped event feed: SERIES VS <TEAM> headers with
//     summed deltas, expanded into numbered sub-events, interleaved with
//     LEADERSHIP INFLUENCE rows when those triggers fired.
//
// Only rendered when viewing the controlled team's roster — the parent page
// is responsible for that gating.
//
// FILE: components/ui/SpiritLogTab.tsx
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useMemo, useState } from "react";
import { teams } from "@/app/data/teams";
import {
  getSpirit,
  getSpiritHistoryForPlayer,
  SPIRIT_MIN,
  SPIRIT_MAX,
} from "@/app/draft-engine/playerSpiritStorage";
import type { SpiritEvent, SpiritReason } from "@/app/types/spirit";

type Props = {
  playerId: string;
};

// ─── Reason → human label ───────────────────────────────────────────────────

const REASON_LABEL: Record<SpiritReason, string> = {
  series_win:          "Series win",
  series_loss:         "Series loss",
  sweep_win:           "Sweep win",
  sweep_loss:          "Sweep loss",
  high_score:          "Strong scores",
  low_score:           "Weak scores",
  game_mvp:            "Game MVP",
  series_mvp:          "Series MVP",
  comfort_picks:       "Signature picks",
  off_comfort:         "Off-comfort picks",
  off_comfort_streak:  "Off-comfort streak",
  resilience_win:      "Resilience win",
  pool_pressure:       "Pool pressure",
  leadership_boost:    "Leadership boost",
  leadership_drain:    "Leadership drain",
  win_streak_3:        "3-win streak",
  loss_streak_3:       "3-loss streak",
};

const LEADERSHIP_REASONS = new Set<SpiritReason>(["leadership_boost", "leadership_drain"]);

// ─── Group structure for the feed ───────────────────────────────────────────

type FeedRow =
  | { kind: "leadership"; event: SpiritEvent }
  | { kind: "series"; seriesId: string; opponentSlug: string | null; totalDelta: number; events: SpiritEvent[] };

function teamSlugFromSeriesId(seriesId: string, controlledTeamSlug: string): string | null {
  // Series IDs end with "<leftSlug>-<rightSlug>"; the opponent is whichever
  // isn't the controlled team.
  const parts = seriesId.split("-");
  if (parts.length < 2) return null;
  const left  = parts[parts.length - 2];
  const right = parts[parts.length - 1];
  if (left === controlledTeamSlug)  return right;
  if (right === controlledTeamSlug) return left;
  // Fallback for playoff IDs that may include extra suffixes.
  return left ?? null;
}

function buildFeedRows(events: SpiritEvent[], controlledTeamSlug: string): FeedRow[] {
  // Iterate in REVERSE chronological order so the most recent rows appear at
  // the top of the feed.  We still keep the order WITHIN a series ascending
  // (1. EVENT, 2. EVENT…) because that reads more naturally.
  const reversed = [...events].reverse();
  const rows: FeedRow[] = [];
  let currentSeriesGroup: { seriesId: string; events: SpiritEvent[] } | null = null;

  function flushSeriesGroup() {
    if (!currentSeriesGroup) return;
    const ordered = [...currentSeriesGroup.events].reverse();   // chronological inside group
    const totalDelta = ordered.reduce((s, e) => s + e.delta, 0);
    rows.push({
      kind: "series",
      seriesId: currentSeriesGroup.seriesId,
      opponentSlug: teamSlugFromSeriesId(currentSeriesGroup.seriesId, controlledTeamSlug),
      totalDelta,
      events: ordered,
    });
    currentSeriesGroup = null;
  }

  for (const event of reversed) {
    if (LEADERSHIP_REASONS.has(event.reason)) {
      flushSeriesGroup();
      rows.push({ kind: "leadership", event });
      continue;
    }

    const seriesId = event.seriesId ?? "unknown";

    if (currentSeriesGroup && currentSeriesGroup.seriesId === seriesId) {
      currentSeriesGroup.events.push(event);
    } else {
      flushSeriesGroup();
      currentSeriesGroup = { seriesId, events: [event] };
    }
  }
  flushSeriesGroup();

  return rows;
}

// ─── Spirit bar ─────────────────────────────────────────────────────────────

function SpiritBar({ value }: { value: number }) {
  const clamped = Math.max(SPIRIT_MIN, Math.min(SPIRIT_MAX, value));
  const range = SPIRIT_MAX - SPIRIT_MIN;
  const percent = ((clamped - SPIRIT_MIN) / range) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
      <p
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          fontFamily: '"Spiegel", sans-serif',
          margin: 0,
        }}
      >
        Spirit
      </p>

      <div
        style={{
          position: "relative",
          height: 16,
          borderRadius: 8,
          overflow: "visible",
          background:
            "linear-gradient(90deg, #F44336 0%, #FF9800 22%, #FFC107 44%, #B0B0B0 66%, #4CAF50 100%)",
        }}
      >
        {/* Right-side mask covers the track past `percent` so the gradient
            only reads the active portion. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${percent}%`,
            right: 0,
            background: "rgba(11,11,15,0.78)",
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />

        {/* Marker triangle + value label below the track. */}
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: `${percent}%`,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 2,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: "6px solid var(--text-primary)",
              marginBottom: 2,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: '"Spiegel", sans-serif',
            }}
          >
            {clamped}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Delta cell formatter ───────────────────────────────────────────────────

function formatDelta(value: number): string {
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : `${value}`;
}

function deltaColor(value: number): string {
  if (value > 0) return "#4CAF50";
  if (value < 0) return "#F44336";
  return "var(--text-secondary)";
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function SpiritLogTab({ playerId }: Props) {
  const [spirit, setSpirit] = useState<number>(() => getSpirit(playerId));
  const [events, setEvents] = useState<SpiritEvent[]>(() => getSpiritHistoryForPlayer(playerId));

  useEffect(() => {
    const refresh = () => {
      setSpirit(getSpirit(playerId));
      setEvents(getSpiritHistoryForPlayer(playerId));
    };
    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener("rift-spirit-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("rift-spirit-updated", refresh);
    };
  }, [playerId]);

  const teamsBySlug = useMemo(
    () => Object.fromEntries(teams.map((t) => [t.slug, t])),
    [],
  );

  const controlledTeamSlug = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = window.localStorage.getItem("rift-draft-save");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return typeof parsed?.controlledTeamSlug === "string" ? parsed.controlledTeamSlug : "";
    } catch {
      return "";
    }
  }, []);

  const feedRows = useMemo(
    () => buildFeedRows(events, controlledTeamSlug),
    [events, controlledTeamSlug],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 12 }}>
      <SpiritBar value={spirit} />

      {feedRows.length === 0 && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            fontFamily: '"Spiegel", sans-serif',
          }}
        >
          No spirit changes yet. Play some series to see history here.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {feedRows.map((row, i) => {
          if (row.kind === "leadership") {
            return (
              <div
                key={`lead-${row.event.timestamp}-${i}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    fontFamily: '"Spiegel", sans-serif',
                  }}
                >
                  Leadership Influence
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: deltaColor(row.event.delta),
                    fontFamily: '"Spiegel", sans-serif',
                  }}
                >
                  {formatDelta(row.event.delta)}
                </span>
              </div>
            );
          }

          // series row
          const opponent = row.opponentSlug ? teamsBySlug[row.opponentSlug] : null;
          const opponentLabel = opponent
            ? opponent.abbreviation || opponent.name
            : (row.opponentSlug ?? "TEAM");

          return (
            <div key={`series-${row.seriesId}-${i}`} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--text-primary)",
                    textTransform: "uppercase",
                    fontFamily: '"Spiegel", sans-serif',
                  }}
                >
                  Series vs {opponentLabel}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: deltaColor(row.totalDelta),
                    fontFamily: '"Spiegel", sans-serif',
                  }}
                >
                  {formatDelta(row.totalDelta)}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 8 }}>
                {row.events.map((event, idx) => (
                  <div
                    key={`${event.timestamp}-${idx}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        fontFamily: '"Spiegel", sans-serif',
                      }}
                    >
                      {idx + 1}. {event.details ?? REASON_LABEL[event.reason]}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        fontFamily: '"Spiegel", sans-serif',
                      }}
                    >
                      {formatDelta(event.delta)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
