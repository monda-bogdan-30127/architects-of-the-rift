"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { teams } from "@/app/data/teams";
import { useEntranceAnimation } from "@/app/hooks/useEntranceAnimation";

type Props = {
  region: string;
};

type StandingRow = {
  id: string;
  abbreviation: string;
  logo: string;
  /** Series wins / losses */
  wins: number;
  losses: number;
  /** Individual game wins / losses inside played series */
  gameWins: number;
  gameLosses: number;
  sortOrder: number;
};

type SeriesResult = {
  winnerTeamSlug: string;
  leftWins: number;
  rightWins: number;
  completedAt: number;
  resolution: "played" | "simulated";
};

type SeriesState = Record<string, SeriesResult>;

const STORAGE_KEY = "rift-series-state";

function readSeriesState(): SeriesState {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SeriesState;
  } catch {
    return {};
  }
}

function getTeamSlugFromSeriesId(seriesId: string) {
  const parts = seriesId.split("-");

  if (parts.length < 2) {
    return { leftTeamSlug: "", rightTeamSlug: "" };
  }

  return {
    leftTeamSlug: parts[parts.length - 2] ?? "",
    rightTeamSlug: parts[parts.length - 1] ?? "",
  };
}

function isPlayoffSeriesId(seriesId: string) {
  return seriesId.toLowerCase().includes("playoff");
}

// ── Top-3 colour palette (gold / silver / bronze) ─────────────────────────
function getRankAccent(rank: number): { color: string; glow: string } | null {
  if (rank === 1) return { color: "#FFD466", glow: "rgba(255, 212, 102, 0.35)" };
  if (rank === 2) return { color: "#D8DCE6", glow: "rgba(216, 220, 230, 0.30)" };
  if (rank === 3) return { color: "#E0A878", glow: "rgba(224, 168, 120, 0.30)" };
  return null;
}

export default function RegionalStandings({ region }: Props) {
  const [seriesState, setSeriesState] = useState<SeriesState>({});
  const mounted = useEntranceAnimation("standings");

  useEffect(() => {
    const syncStandings = () => setSeriesState(readSeriesState());
    syncStandings();

    window.addEventListener("storage", syncStandings);
    window.addEventListener("rift-series-state-updated", syncStandings);

    return () => {
      window.removeEventListener("storage", syncStandings);
      window.removeEventListener("rift-series-state-updated", syncStandings);
    };
  }, []);

  const standings = useMemo(() => {
    const regionTeams = teams
      .filter((team) => team.region.toLowerCase() === region.toLowerCase())
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const rows: StandingRow[] = regionTeams.map((team) => ({
      id: team.id,
      abbreviation: team.abbreviation,
      logo: team.logo,
      wins: 0,
      losses: 0,
      gameWins: 0,
      gameLosses: 0,
      sortOrder: team.sortOrder,
    }));

    const rowsBySlug = regionTeams.reduce<Record<string, StandingRow>>(
      (acc, team) => {
        acc[team.slug] = rows.find((row) => row.id === team.id)!;
        return acc;
      },
      {}
    );

    for (const [seriesId, result] of Object.entries(seriesState)) {
      if (isPlayoffSeriesId(seriesId)) continue;

      const { leftTeamSlug, rightTeamSlug } = getTeamSlugFromSeriesId(seriesId);

      const leftTeamRow = rowsBySlug[leftTeamSlug];
      const rightTeamRow = rowsBySlug[rightTeamSlug];

      if (!leftTeamRow || !rightTeamRow) continue;

      // Series W-L
      if (result.winnerTeamSlug === leftTeamSlug) {
        leftTeamRow.wins += 1;
        rightTeamRow.losses += 1;
      } else if (result.winnerTeamSlug === rightTeamSlug) {
        rightTeamRow.wins += 1;
        leftTeamRow.losses += 1;
      }

      // Game W-L (each individual map inside the series)
      const leftGameWins  = Math.max(0, Number(result.leftWins  ?? 0));
      const rightGameWins = Math.max(0, Number(result.rightWins ?? 0));
      leftTeamRow.gameWins   += leftGameWins;
      leftTeamRow.gameLosses += rightGameWins;
      rightTeamRow.gameWins   += rightGameWins;
      rightTeamRow.gameLosses += leftGameWins;
    }

    return [...rows].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      if (b.gameWins !== a.gameWins) return b.gameWins - a.gameWins;
      return a.sortOrder - b.sortOrder;
    });
  }, [region, seriesState]);

  return (
    <>
      <style>{`
        @keyframes standings-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .standings-row {
          transition: background-color 0.18s ease, transform 0.18s ease;
        }
        .standings-row:hover {
          background-color: var(--bg-hover);
          transform: translateY(-1px);
        }
        @media (prefers-reduced-motion: reduce) {
          .standings-anim { animation: none !important; }
          .standings-row  { transition: none !important; }
        }
      `}</style>

      <aside
        className="
          sticky top-[16px] self-start
          w-[240px] shrink-0
          max-h-[calc(100vh-32px)]
          overflow-y-auto no-scrollbar
          rounded-[24px]
          border
          bg-[var(--bg-elevated)]
          p-[16px]
          shadow-[0_8px_8px_rgba(0,0,0,0.25)]
        "
        style={{ borderColor: "var(--border-strong)" }}
      >
        <div className="flex flex-col gap-[12px]">
          <h2 className="h2 text-[var(--text-primary)]">Region Standings</h2>

          <div
            className="h-px self-stretch"
            style={{ backgroundColor: "var(--border-default)" }}
          />

          <div className="flex flex-col gap-[6px]">
            {standings.map((team, index) => {
              const rank = index + 1;
              const accent = getRankAccent(rank);
              const animDelay = `${0.04 + index * 0.025}s`;

              return (
                <div
                  key={team.id}
                  className={`standings-row flex items-center gap-[8px] ${
                    mounted ? "standings-anim" : ""
                  }`}
                  style={{
                    padding: "6px 6px",
                    borderRadius: 8,
                    border: "1px solid transparent",
                    background: accent
                      ? `linear-gradient(90deg, ${accent.color}10 0%, transparent 60%)`
                      : "transparent",
                    boxShadow: "none",
                    animation: mounted
                      ? `standings-fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${animDelay} both`
                      : undefined,
                  }}
                >
                  {/* Rank */}
                  <div className="w-[16px] shrink-0">
                    <span
                      className="label"
                      style={{
                        color: accent?.color ?? "var(--text-primary)",
                        fontWeight: accent ? 700 : 500,
                      }}
                    >
                      {rank}
                    </span>
                  </div>

                  {/* Logo */}
                  <div
                    className="relative h-[24px] w-[24px] shrink-0"
                    style={{
                      filter: accent
                        ? `drop-shadow(0 0 6px ${accent.glow})`
                        : "none",
                    }}
                  >
                    <Image
                      src={team.logo}
                      alt={team.abbreviation}
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>

                  {/* Abbreviation */}
                  <div className="min-w-0 flex-1">
                    <span className="label text-[var(--text-primary)] truncate block">
                      {team.abbreviation}
                    </span>
                  </div>

                  {/* Series W-L + Game W-L */}
                  <div
                    className="shrink-0 text-right"
                    style={{ minWidth: 70 }}
                  >
                    <div
                      className="label text-[var(--text-primary)]"
                      style={{
                        fontWeight: accent ? 700 : 500,
                        lineHeight: "14px",
                      }}
                    >
                      {team.wins}-{team.losses}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        lineHeight: "12px",
                        color: "var(--text-secondary)",
                        fontFamily: '"Spiegel", sans-serif',
                        fontWeight: 500,
                        marginTop: 2,
                      }}
                    >
                      ({team.gameWins}-{team.gameLosses})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}