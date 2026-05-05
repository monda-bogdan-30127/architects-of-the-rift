"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import RegionalStandings from "@/components/ui/RegionalStandings";
import { players } from "@/app/data/players";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import useBackRedirect from "@/app/hooks/useBrowserBackRedirect";
import { getRegisteredChampionById } from "@/app/draft-engine/championRegistry";
import {
  readPlayerSeasonStore,
  type PlayerSeasonStore,
} from "@/app/draft-engine/playerSeasonStorage";
import {
  readPlayerHistoryStore,
} from "@/app/draft-engine/playerHistoryStorage";
import { getPlayerAverageKda } from "@/app/draft-engine/kdaStorage";
import { getPlayerMvpStats } from "@/app/draft-engine/mvpStorage";
import { champions } from "@/app/data/champions";
import { getChampionGrade } from "@/app/utils/championMasteryUtils";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import type {
  PlayerHistoryStore,
  PlayerHistoryStatLine,
} from "@/app/draft-engine/playerHistoryTypes";

type DraftSave = {
  region: string;
  controlledTeamSlug: string;
  budget: number;
  leftRp?: number;
  roster: Record<Role, string>;
  updatedTeamRosters: Record<string, Record<Role, string>>;
  playerTeamAssignments: Record<string, string>;
  freeAgentPlayerIds: string[];
};

type TeamRosterSlot = {
  role: Role;
  player: Player | null;
};

type TeamRosterGroup = {
  team: (typeof teams)[number];
  slots: TeamRosterSlot[];
};

type ChampionPerf = {
  championId: string;
  championName: string;
  games: number;
  wins: number;
  winRate: number;
};

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];

const ROLE_LABELS: Record<Role, string> = {
  top: "TOP",
  jungle: "JUNGLER",
  mid: "MID",
  adc: "ADC",
  support: "SUPPORT",
};

const PERF_LIST_SIZE = 3;

function titleCaseSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getChampionDisplayName(championId: string) {
  const champion = getRegisteredChampionById(championId);
  if (champion?.name) return champion.name;
  return titleCaseSlug(championId);
}

function buildPlayerSeasonAverageMap(store: PlayerSeasonStore) {
  const totals = new Map<string, { sum: number; games: number }>();

  for (const log of store.logs) {
    if (!log || typeof log.playerId !== "string") continue;
    if (typeof log.score !== "number" || !Number.isFinite(log.score)) continue;

    const current = totals.get(log.playerId) ?? { sum: 0, games: 0 };
    current.sum += log.score;
    current.games += 1;
    totals.set(log.playerId, current);
  }

  const averages = new Map<string, number>();
  for (const [playerId, value] of totals.entries()) {
    if (value.games <= 0) continue;
    averages.set(playerId, value.sum / value.games);
  }

  return averages;
}

function buildPlayerWinRateMap(store: PlayerSeasonStore) {
  const totals = new Map<string, { wins: number; games: number }>();

  for (const log of store.logs) {
    if (!log || typeof log.playerId !== "string") continue;
    const current = totals.get(log.playerId) ?? { wins: 0, games: 0 };
    current.games += 1;
    if (log.result === "win") current.wins += 1;
    totals.set(log.playerId, current);
  }

  const map = new Map<string, { wins: number; games: number; winRate: number }>();
  for (const [playerId, value] of totals.entries()) {
    map.set(playerId, {
      ...value,
      winRate: value.games > 0 ? value.wins / value.games : 0,
    });
  }
  return map;
}

function buildPlayerKDAMap(playerIds: string[]) {
  const map = new Map<string, number>();
  for (const id of playerIds) {
    const kda = getPlayerAverageKda(id);
    if (typeof kda === "number") map.set(id, kda);
  }
  return map;
}

type MvpEntry = { gameMvps: number; seriesMvps: number };

function buildPlayerMVPCountMap(playerIds: string[]) {
  const map = new Map<string, MvpEntry>();
  for (const id of playerIds) {
    const stats = getPlayerMvpStats(id);
    if (stats.gameMvps > 0 || stats.seriesMvps > 0) map.set(id, stats);
  }
  return map;
}


function getPlayerChampionPerf(
  history: PlayerHistoryStore,
  playerId: string
): ChampionPerf[] {
  const record = history[playerId];
  if (!record?.champions) return [];

  const list: ChampionPerf[] = [];
  const entries = Object.entries(record.champions) as Array<
    [string, PlayerHistoryStatLine]
  >;
  for (const [championId, line] of entries) {
    if (!line || typeof line.games !== "number" || line.games <= 0) continue;
    list.push({
      championId,
      championName: getChampionDisplayName(championId),
      games: line.games,
      wins: line.wins ?? 0,
      winRate: (line.wins ?? 0) / line.games,
    });
  }
  return list;
}

function pickMostPlayed(perfs: ChampionPerf[], limit = 6) {
  return [...perfs]
    .sort((a, b) => b.games - a.games)
    .slice(0, limit);
}

function pickBestPerformance(perfs: ChampionPerf[]) {
  return [...perfs]
    .sort((a, b) => {
      const wrDiff = Math.round(b.winRate * 100) - Math.round(a.winRate * 100);
      if (wrDiff !== 0) return wrDiff;
      return b.games - a.games;
    })
    .slice(0, PERF_LIST_SIZE);
}

function pickWorstPerformance(perfs: ChampionPerf[]) {
  return [...perfs]
    .sort((a, b) => {
      const wrDiff = Math.round(a.winRate * 100) - Math.round(b.winRate * 100);
      if (wrDiff !== 0) return wrDiff;
      return b.games - a.games;
    })
    .slice(0, PERF_LIST_SIZE);
}

function getAverageStat(player: Player | null, seasonAverageMap: Map<string, number>) {
  if (!player) return "—";

  const seasonAverage = seasonAverageMap.get(player.id);
  if (typeof seasonAverage === "number" && Number.isFinite(seasonAverage)) {
    return seasonAverage.toFixed(2);
  }

  return "NA";
}

function StatPair({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: string | number;
  rightLabel: string;
  rightValue: string | number;
}) {
  return (
    <div className="flex items-center gap-[16px]">
      <p
        className="text-[var(--text-secondary)]"
        style={{
          fontSize: 14,
          lineHeight: "20px",
          fontWeight: 500,
          minWidth: 64,
        }}
      >
        {leftLabel} {leftValue}
      </p>
      <p
        className="text-[var(--text-secondary)]"
        style={{
          fontSize: 14,
          lineHeight: "20px",
          fontWeight: 500,
        }}
      >
        {rightLabel} {rightValue}
      </p>
    </div>
  );
}

function PerformanceList({
  title,
  items,
}: {
  title: string;
  items: ChampionPerf[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <p
        className="uppercase text-[var(--text-primary)]"
        style={{
          fontSize: 13,
          lineHeight: "16px",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </p>
      {items.length === 0 ? (
        <p
          className="text-[var(--text-secondary)]"
          style={{ fontSize: 13, lineHeight: "20px" }}
        >
          —
        </p>
      ) : (
        <ol className="flex flex-col gap-[2px]">
          {items.map((item, index) => (
            <li
              key={item.championId}
              className="text-[var(--text-secondary)]"
              style={{ fontSize: 13, lineHeight: "20px", fontWeight: 500 }}
            >
              {index + 1}. {item.championName.toUpperCase()} -{" "}
              {Math.round(item.winRate * 100)}% - {item.games}{" "}
              {item.games === 1 ? "GAME" : "GAMES"}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous team" : "Next team"}
      className="flex items-center justify-center rounded-[12px] transition-opacity"
      style={{
        width: 56,
        height: 48,
        backgroundColor: "var(--primary)",
        color: "var(--bg-main)",
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

type PlayerTab = "stats" | "mastery";
type MasterySort = "grade" | "alpha";

const GRADE_COLORS: Record<ChampionMasteryGrade, { bg: string; text: string; border: string }> = {
  SS: { bg: "#B8860B",  text: "#FFF8E1", border: "#FFD466" },
  S:  { bg: "#8B1A2B",  text: "#FFD1DA", border: "#E84868" },
  A:  { bg: "#5B2D8E",  text: "#E8D4FF", border: "#A86EDB" },
  B:  { bg: "#1A6B5A",  text: "#D4F5ED", border: "#38BFA0" },
  C:  { bg: "#4A4A52",  text: "#D0D0D4", border: "#808088" },
  D:  { bg: "#6B4226",  text: "#EADDD4", border: "#A87850" },
  F:  { bg: "#3A1A1A",  text: "#D08080", border: "#802020" },
};

const GRADE_ORDER: ChampionMasteryGrade[] = ["SS", "S", "A", "B", "C", "D", "F"];

function GradeBadge({ grade }: { grade: ChampionMasteryGrade }) {
  const colors = GRADE_COLORS[grade];
  return (
    <span
      style={{
        position: "absolute",
        top: -4,
        left: -4,
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: grade === "SS" ? 26 : 22,
        height: 22,
        borderRadius: 6,
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        color: colors.text,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.04em",
        fontFamily: '"Spiegel", sans-serif',
        lineHeight: 1,
      }}
    >
      {grade}
    </span>
  );
}

function ChampionMasteryTab({
  player,
  role,
  sort,
  onSortChange,
}: {
  player: Player;
  role: Role;
  sort: MasterySort;
  onSortChange: (s: MasterySort) => void;
}) {
  const masteryList = useMemo(() => {
    // Get all champions playable in this role
    const roleChamps = champions.filter((c) => c.roles.includes(role));

    const entries = roleChamps.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      grade: getChampionGrade(player, c.id),
    }));

    if (sort === "alpha") {
      return entries.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Sort by grade (best first), then alphabetically within same grade
    return entries.sort((a, b) => {
      const gradeA = GRADE_ORDER.indexOf(a.grade);
      const gradeB = GRADE_ORDER.indexOf(b.grade);
      if (gradeA !== gradeB) return gradeA - gradeB;
      return a.name.localeCompare(b.name);
    });
  }, [player, role, sort]);

  // Group by grade for section labels
  const grouped = useMemo(() => {
    if (sort === "alpha") return null;
    const map = new Map<ChampionMasteryGrade, typeof masteryList>();
    for (const entry of masteryList) {
      const list = map.get(entry.grade) ?? [];
      list.push(entry);
      map.set(entry.grade, list);
    }
    return map;
  }, [masteryList, sort]);

  // Count per grade for summary
  const gradeCounts = useMemo(() => {
    const counts: Record<ChampionMasteryGrade, number> = { SS: 0, S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const entry of masteryList) counts[entry.grade]++;
    return counts;
  }, [masteryList]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
      {/* Sort toggle */}
      <div className="flex items-center gap-[8px]">
        <span
          className="uppercase text-[var(--text-secondary)]"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}
        >
          Sort:
        </span>
        {(["grade", "alpha"] as MasterySort[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSortChange(s)}
            className="uppercase"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: "3px 10px",
              borderRadius: 6,
              border: `1px solid ${sort === s ? "var(--text-highlight)" : "var(--border-default)"}`,
              background: sort === s ? "color-mix(in srgb, var(--text-highlight) 12%, transparent)" : "transparent",
              color: sort === s ? "var(--text-highlight)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {s === "grade" ? "Grade" : "A-Z"}
          </button>
        ))}
      </div>

      {/* Grade summary */}
      <div className="flex flex-wrap items-center" style={{ gap: "4px 8px" }}>
        {GRADE_ORDER.map((grade) => {
          const count = gradeCounts[grade];
          if (count === 0) return null;
          const colors = GRADE_COLORS[grade];
          return (
            <span
              key={grade}
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.03em",
                color: colors.border,
                fontFamily: '"Spiegel", sans-serif',
              }}
            >
              {grade}: {count}
            </span>
          );
        })}
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-muted)",
            fontFamily: '"Spiegel", sans-serif',
            marginLeft: 4,
          }}
        >
          ({masteryList.length} total)
        </span>
      </div>

      {/* Champion grid */}
      {sort === "alpha" || !grouped ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 10,
          }}
        >
          {masteryList.map((entry) => (
            <ChampionMasteryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-[14px]">
          {GRADE_ORDER.map((grade) => {
            const items = grouped.get(grade);
            if (!items || items.length === 0) return null;
            return (
              <div key={grade} className="flex flex-col gap-[6px]">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 10,
                  }}
                >
                  {items.map((entry) => (
                    <ChampionMasteryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChampionMasteryCard({
  entry,
}: {
  entry: { id: string; name: string; image: string; grade: ChampionMasteryGrade };
}) {
  const colors = GRADE_COLORS[entry.grade];
  const isUnplayable = entry.grade === "F";

  return (
    <div
      className="flex flex-col items-center gap-[4px]"
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "relative",
          width: 72,
          height: 72,
          borderRadius: 8,
          overflow: "hidden",
          border: `2px solid ${colors.border}`,
          filter: isUnplayable ? "grayscale(0.7) brightness(0.5)" : "none",
        }}
      >
        <GradeBadge grade={entry.grade} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.image}
          alt={entry.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 15%",
          }}
        />
      </div>
      <span
        className="text-center uppercase"
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: isUnplayable ? "var(--text-muted)" : "var(--text-secondary)",
          maxWidth: 76,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: "12px",
        }}
      >
        {entry.name}
      </span>
    </div>
  );
}

function PlayerCard({
  player,
  role,
  seasonAverageMap,
  winRateMap,
  kdaMap,
  mvpMap,
  history,
}: {
  player: Player | null;
  role: Role;
  seasonAverageMap: Map<string, number>;
  winRateMap: Map<string, { wins: number; games: number; winRate: number }>;
  kdaMap: Map<string, number>;
  mvpMap: Map<string, MvpEntry>;
  history: PlayerHistoryStore;
}) {
  const perfs = useMemo(
    () => (player ? getPlayerChampionPerf(history, player.id) : []),
    [history, player]
  );

  const bestPerf = useMemo(() => pickBestPerformance(perfs), [perfs]);
  const worstPerf = useMemo(() => pickWorstPerformance(perfs), [perfs]);
  const mostPlayed = useMemo(() => pickMostPlayed(perfs, 6), [perfs]);

  const winRateEntry = player ? winRateMap.get(player.id) : undefined;
  const winRateText = winRateEntry && winRateEntry.games > 0
    ? `${Math.round(winRateEntry.winRate * 100)}%`
    : "—";

  const kdaRaw = player ? kdaMap.get(player.id) : undefined;
  const kdaText = typeof kdaRaw === "number" ? kdaRaw.toFixed(1) : "—";

  const mvpEntry      = player ? mvpMap.get(player.id) : undefined;
  const gameMvpCount   = mvpEntry?.gameMvps   ?? 0;
  const seriesMvpCount = mvpEntry?.seriesMvps ?? 0;

  const playstylePrimary = player?.playstyleIdentity?.displayPrimary?.toUpperCase() ?? "";
  const playstyleSecondary = player?.playstyleIdentity?.displaySecondary?.toUpperCase() ?? "";
  const playstyleTags = player?.playstyleIdentity?.displayTags ?? [];

  const playstyleLine = [playstylePrimary, playstyleSecondary]
    .filter(Boolean)
    .join(" - ");
  const tagsLine = playstyleTags.map((t) => t.toUpperCase()).join(", ");

  const [activeTab, setActiveTab] = useState<PlayerTab>("stats");
  const [masterySort, setMasterySort] = useState<MasterySort>("grade");

  return (
    <section
      className="rounded-[16px] bg-[var(--bg-surface)]"
      style={{ padding: 24 }}
    >
      <div className="flex items-stretch gap-[32px]">
        {/* LEFT — image + name + role + playstyle + avg (always visible) */}
        <div
          className="flex shrink-0 flex-col items-center gap-[8px]"
          style={{ width: 220 }}
        >
          <div
            className="overflow-hidden rounded-[8px] bg-[var(--bg-elevated)]"
            style={{ width: 220, height: 220 }}
          >
            {player?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.image}
                alt={player.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[var(--text-secondary)]"
                style={{ fontSize: 13 }}
              >
                No image
              </div>
            )}
          </div>

          <h2
            className="text-[var(--text-primary)]"
            style={{
              fontFamily: "Beaufort, serif",
              fontSize: 24,
              lineHeight: "28px",
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            {player?.name ?? "Empty Slot"}
          </h2>

          <p
            className="uppercase text-[var(--text-highlight)]"
            style={{
              fontSize: 13,
              lineHeight: "16px",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {ROLE_LABELS[role]}
          </p>

          {playstyleLine ? (
            <p
              className="uppercase text-[var(--text-primary)]"
              style={{
                fontSize: 13,
                lineHeight: "16px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              {playstyleLine}
            </p>
          ) : null}

          {tagsLine ? (
            <p
              className="uppercase text-[var(--text-secondary)]"
              style={{
                fontSize: 13,
                lineHeight: "16px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              {tagsLine}
            </p>
          ) : null}

          <p
            className="text-[var(--text-secondary)]"
            style={{
              fontSize: 14,
              lineHeight: "20px",
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            Score : {getAverageStat(player, seasonAverageMap)}{"   "}
            KDA : {kdaText}
          </p>

          <p
            className="text-[var(--text-secondary)]"
            style={{
              fontSize: 14,
              lineHeight: "20px",
              fontWeight: 500,
            }}
          >
            Game MVPs : {gameMvpCount}{"   "}
          </p>
        </div>

        {/* RIGHT — tab switcher + content */}
        <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
          {/* Tab bar */}
          <div
            className="flex items-center"
            style={{
              gap: 0,
              borderBottom: "1px solid var(--border-default)",
            }}
          >
            {(["stats", "mastery"] as PlayerTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === "stats" ? "STATS" : "CHAMPION MASTERY";
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    fontFamily: '"Spiegel", sans-serif',
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive ? "2px solid var(--text-highlight)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "stats" ? (
            <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <StatPair
                  leftLabel="MECHANICS"
                  leftValue={player?.stats.mec ?? "—"}
                  rightLabel="MACRO"
                  rightValue={player?.stats.mac ?? "—"}
                />
                <StatPair
                  leftLabel="TEAMFIGHTING"
                  leftValue={player?.stats.tfg ?? "—"}
                  rightLabel="CLUTCH"
                  rightValue={player?.stats.clt ?? "—"}
                />
                <StatPair
                  leftLabel="CONSISTENCY"
                  leftValue={player?.stats.con ?? "—"}
                  rightLabel="IQ"
                  rightValue={player?.stats.iq ?? "—"}
                />
              </div>

              <div className="flex items-start gap-[32px]">
                <PerformanceList title="BEST PERFORMANCE CHAMPIONS" items={bestPerf} />
                <PerformanceList title="WORST PERFORMANCE CHAMPIONS" items={worstPerf} />
              </div>

              {/* Most played champions — 2 columns */}
              <div className="flex flex-col gap-[6px]">
                <p
                  className="uppercase text-[var(--text-primary)]"
                  style={{ fontSize: 13, lineHeight: "16px", fontWeight: 600, letterSpacing: "0.04em" }}
                >
                  MOST PLAYED CHAMPIONS
                </p>
                {mostPlayed.length === 0 ? (
                  <p className="text-[var(--text-secondary)]" style={{ fontSize: 13, lineHeight: "20px" }}>—</p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: `repeat(${Math.ceil(mostPlayed.length / 2)}, auto)`,
                      gridAutoFlow: "column",
                      gap: "2px 32px",
                    }}
                  >
                    {mostPlayed.map((item, index) => (
                      <p
                        key={item.championId}
                        className="text-[var(--text-secondary)]"
                        style={{ fontSize: 13, lineHeight: "20px", fontWeight: 500 }}
                      >
                        {index + 1}. {item.championName.toUpperCase()} - {Math.round(item.winRate * 100)}% - {item.games}{" "}
                        {item.games === 1 ? "GAME" : "GAMES"}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <p
                className="uppercase text-[var(--text-secondary)]"
                style={{ fontSize: 13, lineHeight: "20px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                WIN RATE: {winRateText}
              </p>
            </div>
          ) : player ? (
            <ChampionMasteryTab
              player={player}
              role={role}
              sort={masterySort}
              onSortChange={setMasterySort}
            />
          ) : (
            <p className="text-[var(--text-secondary)]" style={{ fontSize: 13 }}>
              No player selected.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function PlayerThumbnails({
  slots,
  selectedRole,
  onSelect,
}: {
  slots: TeamRosterSlot[];
  selectedRole: Role;
  onSelect: (role: Role) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-[16px]">
      {slots.map((slot) => {
        const isSelected = slot.role === selectedRole;
        return (
          <button
            key={slot.role}
            type="button"
            onClick={() => onSelect(slot.role)}
            aria-label={`Select ${ROLE_LABELS[slot.role]}`}
            className="overflow-hidden rounded-[8px] bg-[var(--bg-elevated)] transition-all"
            style={{
              width: 110,
              height: 110,
              border: isSelected
                ? "2px solid var(--text-highlight)"
                : "2px solid transparent",
              opacity: isSelected ? 1 : 0.45,
              cursor: "pointer",
              padding: 0,
            }}
          >
            {slot.player?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slot.player.image}
                alt={slot.player.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[var(--text-secondary)]"
                style={{ fontSize: 11 }}
              >
                {ROLE_LABELS[slot.role]}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function RostersPage() {
  useBackRedirect("/");

  const [save, setSave] = useState<DraftSave | null>(null);
  const [seasonStore, setSeasonStore] = useState<PlayerSeasonStore>({ logs: [] });
  const [historyStore, setHistoryStore] = useState<PlayerHistoryStore>({});

  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role>("top");

  useEffect(() => {
    const rawSave = localStorage.getItem("rift-draft-save");

    if (!rawSave) {
      setSave(null);
    } else {
      try {
        const parsed = JSON.parse(rawSave) as DraftSave;
        setSave(parsed);
      } catch {
        setSave(null);
      }
    }

    setSeasonStore(readPlayerSeasonStore());
    setHistoryStore(readPlayerHistoryStore());
  }, []);

  const controlledTeam = useMemo(() => {
    if (!save) return null;
    return teams.find((team) => team.slug === save.controlledTeamSlug) ?? null;
  }, [save]);

  const seasonAverageMap = useMemo(
    () => buildPlayerSeasonAverageMap(seasonStore),
    [seasonStore]
  );
  const winRateMap = useMemo(
    () => buildPlayerWinRateMap(seasonStore),
    [seasonStore]
  );
  const kdaMap = useMemo(
    () => buildPlayerKDAMap(players.map((p) => p.id)),
    // re-read on save change so newly simulated games show up
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [save]
  );
  const mvpMap = useMemo(
    () => buildPlayerMVPCountMap(players.map((p) => p.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [save]
  );

  const groupedTeamPlayers = useMemo<TeamRosterGroup[]>(() => {
    if (!save) return [];

    const regionTeams = teams.filter(
      (team) => team.region.toLowerCase() === save.region.toLowerCase()
    );

    const sortedTeams = [...regionTeams].sort((a, b) => {
      if (a.slug === save.controlledTeamSlug) return -1;
      if (b.slug === save.controlledTeamSlug) return 1;
      return a.sortOrder - b.sortOrder;
    });

    return sortedTeams.map((team) => {
      const roster =
        save.updatedTeamRosters[team.id] ?? ({} as Record<Role, string>);

      const slots = ROLE_ORDER.map((role) => {
        const playerId = roster[role];
        const player =
          players.find((entry) => entry.id === playerId && entry.role === role) ??
          null;

        return {
          role,
          player,
        };
      });

      return {
        team,
        slots,
      };
    });
  }, [save]);

  // Reset selection when save first loads (controlled team is index 0 by sort)
  useEffect(() => {
    setSelectedTeamIndex(0);
    setSelectedRole("top");
  }, [save?.controlledTeamSlug, save?.region]);

  const teamCount = groupedTeamPlayers.length;
  const safeTeamIndex =
    teamCount > 0 ? Math.min(Math.max(selectedTeamIndex, 0), teamCount - 1) : 0;
  const currentGroup = groupedTeamPlayers[safeTeamIndex] ?? null;
  const currentSlot =
    currentGroup?.slots.find((s) => s.role === selectedRole) ?? null;

  const goPrevTeam = () => {
    if (teamCount <= 1) return;
    setSelectedTeamIndex((idx) => (idx - 1 + teamCount) % teamCount);
    setSelectedRole("top");
  };

  const goNextTeam = () => {
    if (teamCount <= 1) return;
    setSelectedTeamIndex((idx) => (idx + 1) % teamCount);
    setSelectedRole("top");
  };

  const standingsRegion = save?.region ?? controlledTeam?.region ?? "lck";

  const dashboardLabel =
    controlledTeam?.name != null
      ? `${controlledTeam.name}'s Dashboard`
      : "Gameplay Dashboard";

  return (
    <PageContainer className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 1120,
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: "80px minmax(0, 1fr) 220px",
            columnGap: 32,
            alignItems: "start",
          }}
        >
          <aside
            style={{
              position: "sticky",
              top: 16,
              width: 80,
              alignSelf: "start",
            }}
          >
            <DashboardSidebar />
          </aside>

          <main className="min-w-0">
            <div className="flex flex-col gap-[24px]">
              <div
                className="bg-[var(--bg-main)]"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                  paddingBottom: 8,
                }}
              >
                <div className="flex flex-col gap-[8px]">
                  <p className="body-small text-[var(--text-primary)]">
                    {dashboardLabel}
                  </p>

                  <h1 className="h1 text-[var(--text-primary)]">Rosters</h1>
                </div>
              </div>

              {!save || !controlledTeam || !currentGroup ? (
                <p className="body-large text-[var(--text-secondary)]">
                  No draft save found yet.
                </p>
              ) : (
                <div className="flex flex-col gap-[24px]">
                  {/* Team navigator */}
                  <div className="flex items-center justify-between gap-[16px]">
                    <ArrowButton
                      direction="left"
                      onClick={goPrevTeam}
                      disabled={teamCount <= 1}
                    />

                    <h2
                      className="flex-1 text-center text-[var(--text-primary)]"
                      style={{
                        fontFamily: "Beaufort, serif",
                        fontSize: 28,
                        lineHeight: "32px",
                        fontWeight: 500,
                      }}
                    >
                      {currentGroup.team.name}
                    </h2>

                    <ArrowButton
                      direction="right"
                      onClick={goNextTeam}
                      disabled={teamCount <= 1}
                    />
                  </div>

                  {/* Player thumbnails (above card) */}
                  <PlayerThumbnails
                    slots={currentGroup.slots}
                    selectedRole={selectedRole}
                    onSelect={setSelectedRole}
                  />

                  {/* Player card */}
                  <PlayerCard
                    player={currentSlot?.player ?? null}
                    role={selectedRole}
                    seasonAverageMap={seasonAverageMap}
                    winRateMap={winRateMap}
                    kdaMap={kdaMap}
                    mvpMap={mvpMap}
                    history={historyStore}
                  />
                </div>
              )}
            </div>
          </main>

          <aside
            style={{
              position: "sticky",
              top: 16,
              width: 220,
              alignSelf: "start",
            }}
          >
            <RegionalStandings region={standingsRegion} />
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}