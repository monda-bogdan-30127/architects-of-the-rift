"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import RegionalStandings from "@/components/ui/RegionalStandings";
import { players } from "@/app/data/players";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import useBackRedirect from "@/app/hooks/useBrowserBackRedirect.ts";

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

type PlayerGameLog = {
  playerId: string;
  teamSlug: string;
  role: string;
  score: number;
  side: "blue" | "red";
  result: "win" | "loss";
  bestOf: number;
};

type PlayerSeasonStore = {
  logs: PlayerGameLog[];
};

type TeamRosterSlot = {
  role: Role;
  player: Player | null;
};

type TeamRosterGroup = {
  team: (typeof teams)[number];
  slots: TeamRosterSlot[];
};

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];
const PLAYER_SEASON_STATS_KEY = "rift-player-season-stats";

const ROLE_LABELS: Record<Role, string> = {
  top: "TOP",
  jungle: "JUNGLER",
  mid: "MID",
  adc: "ADC",
  support: "SUPPORT",
};

function formatChampions(champions: string[] | undefined) {
  if (!champions || champions.length === 0) return "—";

  return champions
    .slice(0, 3)
    .map((champion) =>
      champion
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    )
    .join(", ");
}

function readPlayerSeasonStore(): PlayerSeasonStore {
  if (typeof window === "undefined") return { logs: [] };

  const raw = localStorage.getItem(PLAYER_SEASON_STATS_KEY);
  if (!raw) return { logs: [] };

  try {
    const parsed = JSON.parse(raw) as PlayerSeasonStore;
    return {
      logs: Array.isArray(parsed?.logs) ? parsed.logs : [],
    };
  } catch {
    return { logs: [] };
  }
}

function buildPlayerAverageMap(store: PlayerSeasonStore) {
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

function getAverageStat(player: Player | null, playerAverageMap: Map<string, number>) {
  if (!player) return "—";

  const seasonAverage = playerAverageMap.get(player.id);
  if (typeof seasonAverage === "number" && Number.isFinite(seasonAverage)) {
    return seasonAverage.toFixed(1);
  }

  const values = [
    player.stats.mec,
    player.stats.mac,
    player.stats.tfg,
    player.stats.clt,
    player.stats.con,
    player.stats.iq,
  ];

  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return avg.toFixed(1);
}

function StatRow({
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
    <div className="flex min-w-0 items-center gap-[12px]">
      <p
        className="w-fit text-[var(--text-secondary)]"
        style={{
          fontSize: 13,
          lineHeight: "18px",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {leftLabel} {leftValue}
      </p>

      <p
        className="w-fit text-[var(--text-secondary)]"
        style={{
          fontSize: 13,
          lineHeight: "18px",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {rightLabel} {rightValue}
      </p>
    </div>
  );
}

function RosterSlot({
  role,
  player,
  playerAverageMap,
}: TeamRosterSlot & { playerAverageMap: Map<string, number> }) {
  return (
    <div className="flex min-w-0 flex-1 basis-0 flex-col gap-[8px]">
      <p
        className="text-[var(--text-highlight)] uppercase"
        style={{
          fontSize: 13,
          lineHeight: "16px",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}
      >
        {ROLE_LABELS[role]}
      </p>

      <h3
        className="truncate text-[var(--text-primary)]"
        style={{
          fontFamily: "Beaufort, serif",
          fontSize: 20,
          lineHeight: "24px",
          fontWeight: 500,
        }}
      >
        {player?.name ?? "Empty Slot"}
      </h3>

      <StatRow
        leftLabel="MEC"
        leftValue={player?.stats.mec ?? "—"}
        rightLabel="MAC"
        rightValue={player?.stats.mac ?? "—"}
      />

      <StatRow
        leftLabel="TFG"
        leftValue={player?.stats.tfg ?? "—"}
        rightLabel="CLT"
        rightValue={player?.stats.clt ?? "—"}
      />

      <StatRow
        leftLabel="CON"
        leftValue={player?.stats.con ?? "—"}
        rightLabel="IQ"
        rightValue={player?.stats.iq ?? "—"}
      />

      <div className="min-w-0">
        <p
          className="uppercase text-[var(--text-secondary)]"
          style={{
            fontSize: 13,
            lineHeight: "16px",
            fontWeight: 500,
            letterSpacing: "0.02em",
            marginBottom: 2,
          }}
        >
          Best Champs:
        </p>

        <p
          className="break-words text-[var(--text-secondary)]"
          style={{
            fontSize: 13,
            lineHeight: "18px",
            fontWeight: 500,
          }}
        >
          {formatChampions(player?.bestChampions)}
        </p>
      </div>

      <p
        className="text-[var(--text-secondary)]"
        style={{
          fontSize: 13,
          lineHeight: "18px",
          fontWeight: 500,
        }}
      >
        AVG. : {getAverageStat(player, playerAverageMap)}
      </p>
    </div>
  );
}

function TeamRosterCard({
  group,
  isControlled,
  playerAverageMap,
}: {
  group: TeamRosterGroup;
  isControlled: boolean;
  playerAverageMap: Map<string, number>;
}) {
  return (
    <section
      className={[
        "rounded-[16px] border bg-[var(--bg-surface)] p-[16px]",
        isControlled
          ? "border-[var(--border-strong)] shadow-[0_0_0_1px_rgba(16,228,249,0.08)]"
          : "border-transparent",
      ].join(" ")}
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between gap-[12px]">
          <h2
            className="text-[var(--text-primary)]"
            style={{
              fontFamily: "Beaufort, serif",
              fontSize: 28,
              lineHeight: "32px",
              fontWeight: 500,
            }}
          >
            {group.team.name}
          </h2>

          {isControlled ? (
            <span className="label rounded-[999px] border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-[10px] py-[6px] text-[var(--primary)]">
              CONTROLLED
            </span>
          ) : null}
        </div>

        <div className="flex items-start gap-[16px] overflow-x-auto">
          {group.slots.map((slot) => (
            <RosterSlot
              key={`${group.team.id}-${slot.role}-${slot.player?.id ?? "empty"}`}
              role={slot.role}
              player={slot.player}
              playerAverageMap={playerAverageMap}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function RostersPage() {
  useBackRedirect("/");

  const [save, setSave] = useState<DraftSave | null>(null);
  const [seasonStore, setSeasonStore] = useState<PlayerSeasonStore>({ logs: [] });

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
  }, []);

  const controlledTeam = useMemo(() => {
    if (!save) return null;
    return teams.find((team) => team.slug === save.controlledTeamSlug) ?? null;
  }, [save]);

  const playerAverageMap = useMemo(() => buildPlayerAverageMap(seasonStore), [seasonStore]);

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

  const standingsRegion = save?.region ?? controlledTeam?.region ?? "lck";

  const dashboardLabel =
    controlledTeam?.name != null
      ? `<${controlledTeam.name}>’s Dashboard`
      : "<Selected/Control Team Name>’s Dashboard";

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
                  <p
                    className="text-[var(--text-primary)]"
                    style={{
                      fontSize: 14,
                      lineHeight: "18px",
                      fontWeight: 400,
                    }}
                  >
                    {dashboardLabel}
                  </p>

                  <h1
                    className="text-[var(--text-primary)]"
                    style={{
                      fontSize: 56,
                      lineHeight: 0.95,
                      fontWeight: 500,
                      fontFamily: "Beaufort, serif",
                    }}
                  >
                    Rosters
                  </h1>
                </div>
              </div>

              {!save || !controlledTeam ? (
                <p className="body-large text-[var(--text-secondary)]">
                  No draft save found yet.
                </p>
              ) : (
                <div className="flex flex-col gap-[24px]">
                  {groupedTeamPlayers.map((group) => (
                    <TeamRosterCard
                      key={group.team.id}
                      group={group}
                      isControlled={group.team.slug === save.controlledTeamSlug}
                      playerAverageMap={playerAverageMap}
                    />
                  ))}
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
