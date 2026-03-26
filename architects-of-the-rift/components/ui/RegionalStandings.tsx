"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { teams } from "@/app/data/teams";

type Props = {
  region: string;
};

type StandingRow = {
  id: string;
  abbreviation: string;
  logo: string;
  wins: number;
  losses: number;
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

export default function RegionalStandings({ region }: Props) {
  const [seriesState, setSeriesState] = useState<SeriesState>({});

  useEffect(() => {
    const syncStandings = () => {
      setSeriesState(readSeriesState());
    };

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

      if (result.winnerTeamSlug === leftTeamSlug) {
        leftTeamRow.wins += 1;
        rightTeamRow.losses += 1;
      } else if (result.winnerTeamSlug === rightTeamSlug) {
        rightTeamRow.wins += 1;
        leftTeamRow.losses += 1;
      }
    }

    return [...rows].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return a.sortOrder - b.sortOrder;
    });
  }, [region, seriesState]);

  return (
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

        <div className="flex flex-col gap-[12px]">
          {standings.map((team, index) => (
            <div key={team.id} className="flex items-center gap-[8px]">
              <div className="w-[16px] shrink-0">
                <span className="label text-[var(--text-primary)]">
                  {index + 1}
                </span>
              </div>

              <div className="relative h-[24px] w-[24px] shrink-0">
                <Image
                  src={team.logo}
                  alt={team.abbreviation}
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>

              <div className="flex-1">
                <span className="label text-[var(--text-primary)]">
                  {team.abbreviation}
                </span>
              </div>

              <div className="shrink-0">
                <span className="label text-[var(--text-primary)]">
                  {team.wins}-{team.losses}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
