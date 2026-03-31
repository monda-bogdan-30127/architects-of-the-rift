"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import RegionalStandings from "@/components/ui/RegionalStandings";
import { teams } from "@/app/data/teams";
import useBackRedirect from "@/app/hooks/useBrowserBackRedirect";
import {
  getMvpRace,
  getBestTop,
  getBestJungle,
  getBestMid,
  getBestAdc,
  getBestSupport,
} from "@/app/draft-engine/awardsUtils";

type TeamRecordObject = {
  wins?: number;
  losses?: number;
  win?: number;
  loss?: number;
  record?: string;
};

type StandingEntry = {
  team?: string;
  teamName?: string;
  teamSlug?: string;
  slug?: string;
  id?: string;
  record?: string;
  wins?: number;
  losses?: number;
  win?: number;
  loss?: number;
};

type DraftSave = {
  region: string;
  controlledTeamSlug: string;
  teamRecords?: Record<string, string | TeamRecordObject>;
  updatedTeamRecords?: Record<string, string | TeamRecordObject>;
  standings?: StandingEntry[];
  updatedStandings?: StandingEntry[];
};

type PlayerEntry = {
  playerId: string;
  name: string;
  team: string;
  role: string;
  avgScore: number;
  record: string;
};

function normalizeTeamKey(value: string | undefined | null) {
  return (value ?? "").trim().toLowerCase();
}

function parseRecordValue(
  value: string | TeamRecordObject | undefined | null
): { wins: number; losses: number } | null {
  if (!value) return null;

  if (typeof value === "string") {
    const [winsRaw, lossesRaw] = value.split("-");
    const wins = Number(winsRaw ?? 0);
    const losses = Number(lossesRaw ?? 0);

    if (Number.isNaN(wins) || Number.isNaN(losses)) return null;

    return { wins, losses };
  }

  if (typeof value === "object") {
    if (typeof value.record === "string") {
      return parseRecordValue(value.record);
    }

    const wins = Number(value.wins ?? value.win ?? 0);
    const losses = Number(value.losses ?? value.loss ?? 0);

    if (Number.isNaN(wins) || Number.isNaN(losses)) return null;

    return { wins, losses };
  }

  return null;
}

function formatWinRateFromRecord(
  record: { wins: number; losses: number } | null | undefined
) {
  if (!record) return "0%";

  const total = record.wins + record.losses;

  if (!total) return "0%";

  return `${Math.round((record.wins / total) * 100)}%`;
}

function addTeamRecordToMap(
  map: Record<string, { wins: number; losses: number }>,
  key: string | undefined,
  value: string | TeamRecordObject | undefined | null
) {
  const normalizedKey = normalizeTeamKey(key);
  const parsed = parseRecordValue(value);

  if (!normalizedKey || !parsed) return;

  map[normalizedKey] = parsed;
}

function extractTeamRecordMap(save: DraftSave | null) {
  const result: Record<string, { wins: number; losses: number }> = {};

  if (!save) return result;

  const recordBuckets = [save.teamRecords, save.updatedTeamRecords];

  recordBuckets.forEach((bucket) => {
    if (!bucket) return;

    Object.entries(bucket).forEach(([teamKey, value]) => {
      addTeamRecordToMap(result, teamKey, value);

      const matchedTeam = teams.find(
        (team) =>
          normalizeTeamKey(team.slug) === normalizeTeamKey(teamKey) ||
          normalizeTeamKey(team.id) === normalizeTeamKey(teamKey) ||
          normalizeTeamKey(team.name) === normalizeTeamKey(teamKey)
      );

      if (matchedTeam) {
        addTeamRecordToMap(result, matchedTeam.slug, value);
        addTeamRecordToMap(result, matchedTeam.id, value);
        addTeamRecordToMap(result, matchedTeam.name, value);
      }
    });
  });

  const standingsBuckets = [save.standings, save.updatedStandings];

  standingsBuckets.forEach((bucket) => {
    if (!bucket) return;

    bucket.forEach((entry) => {
      const parsed = parseRecordValue({
        record: entry.record,
        wins: entry.wins ?? entry.win,
        losses: entry.losses ?? entry.loss,
      });

      if (!parsed) return;

      const possibleKeys = [
        entry.team,
        entry.teamName,
        entry.teamSlug,
        entry.slug,
        entry.id,
      ];

      possibleKeys.forEach((key) => {
        if (!key) return;
        result[normalizeTeamKey(key)] = parsed;
      });

      const matchedTeam = teams.find(
        (team) =>
          possibleKeys.some(
            (key) =>
              normalizeTeamKey(key) === normalizeTeamKey(team.slug) ||
              normalizeTeamKey(key) === normalizeTeamKey(team.id) ||
              normalizeTeamKey(key) === normalizeTeamKey(team.name)
          )
      );

      if (matchedTeam) {
        result[normalizeTeamKey(matchedTeam.slug)] = parsed;
        result[normalizeTeamKey(matchedTeam.id)] = parsed;
        result[normalizeTeamKey(matchedTeam.name)] = parsed;
      }
    });
  });

  return result;
}

function getPlayerTeamWinRate(
  player: PlayerEntry | undefined,
  teamRecordMap: Record<string, { wins: number; losses: number }>
) {
  if (!player) return "0%";

  const normalizedPlayerTeam = normalizeTeamKey(player.team);

  const matchedTeam = teams.find(
    (team) =>
      normalizeTeamKey(team.slug) === normalizedPlayerTeam ||
      normalizeTeamKey(team.id) === normalizedPlayerTeam ||
      normalizeTeamKey(team.name) === normalizedPlayerTeam
  );

  const record =
    teamRecordMap[normalizedPlayerTeam] ??
    (matchedTeam
      ? teamRecordMap[normalizeTeamKey(matchedTeam.slug)] ??
        teamRecordMap[normalizeTeamKey(matchedTeam.id)] ??
        teamRecordMap[normalizeTeamKey(matchedTeam.name)]
      : undefined);

  if (record) {
    return formatWinRateFromRecord(record);
  }

  return formatWinRateFromRecord(parseRecordValue(player.record));
}

function AwardContender({
  rank,
  player,
  teamWinRate,
}: {
  rank: number;
  player?: PlayerEntry;
  teamWinRate: string;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-start"
      style={{ gap: 4 }}
    >
      <p
        className="uppercase text-[var(--text-highlight)]"
        style={{
          fontSize: 13,
          lineHeight: "16px",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}
      >
        {rank}# CONTENDER
      </p>

      <h3
        className="truncate text-[var(--text-primary)]"
        style={{
          maxWidth: "100%",
          fontSize: 20,
          lineHeight: "24px",
          fontWeight: 500,
        }}
      >
        {player?.name ?? "Player Name"}
      </h3>

      <p
        className="text-[var(--text-secondary)]"
        style={{ fontSize: 16, lineHeight: "20px" }}
      >
        Avg. : {player ? player.avgScore.toFixed(2) : "10"}
      </p>

      <p
        className="text-[var(--text-secondary)]"
        style={{ fontSize: 16, lineHeight: "20px" }}
      >
        Win Rate: {teamWinRate}
      </p>
    </div>
  );
}

function AwardSection({
  title,
  players,
  teamRecordMap,
}: {
  title: string;
  players: PlayerEntry[];
  teamRecordMap: Record<string, { wins: number; losses: number }>;
}) {
  const topThree = [players[0], players[1], players[2]];

  return (
    <section
      className="rounded-[16px] bg-[var(--bg-surface)]"
      style={{
        width: 680,
        maxWidth: "100%",
        padding: 16,
      }}
    >
      <div className="flex flex-col" style={{ gap: 16 }}>
        <h2
          className="text-[var(--text-primary)]"
          style={{
            fontSize: 26,
            lineHeight: "32px",
            fontWeight: 500,
          }}
        >
          {title}
        </h2>

        <div className="flex w-full items-start" style={{ gap: 24 }}>
          <AwardContender
            rank={1}
            player={topThree[0]}
            teamWinRate={getPlayerTeamWinRate(topThree[0], teamRecordMap)}
          />
          <AwardContender
            rank={2}
            player={topThree[1]}
            teamWinRate={getPlayerTeamWinRate(topThree[1], teamRecordMap)}
          />
          <AwardContender
            rank={3}
            player={topThree[2]}
            teamWinRate={getPlayerTeamWinRate(topThree[2], teamRecordMap)}
          />
        </div>
      </div>
    </section>
  );
}

export default function AwardsPage() {
  useBackRedirect("/");

  const [save, setSave] = useState<DraftSave | null>(null);

  useEffect(() => {
    const rawSave = localStorage.getItem("rift-draft-save");

    if (!rawSave) {
      setSave(null);
      return;
    }

    try {
      setSave(JSON.parse(rawSave) as DraftSave);
    } catch {
      setSave(null);
    }
  }, []);

  const controlledTeam = useMemo(() => {
    if (!save) return null;
    return teams.find((team) => team.slug === save.controlledTeamSlug) ?? null;
  }, [save]);

  const teamRecordMap = useMemo(() => {
    return extractTeamRecordMap(save);
  }, [save]);

  const standingsRegion = save?.region ?? controlledTeam?.region ?? "lck";

  const dashboardLabel =
    controlledTeam?.name != null
      ? `${controlledTeam.name} Dashboard`
      : "Gameplay Dashboard";

  const mvp = getMvpRace();
  const top = getBestTop();
  const jungle = getBestJungle();
  const mid = getBestMid();
  const adc = getBestAdc();
  const support = getBestSupport();

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
            gridTemplateColumns: "80px 680px 220px",
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

          <main style={{ width: 680, minWidth: 680 }}>
            <div className="flex flex-col" style={{ gap: 24 }}>
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

                  <h1 className="h1 text-[var(--text-primary)]">
                    Award Race
                  </h1>
                </div>
              </div>

              <div className="flex flex-col" style={{ gap: 24 }}>
                <AwardSection
                  title="MVP"
                  players={mvp}
                  teamRecordMap={teamRecordMap}
                />
                <AwardSection
                  title="Best Toplaners"
                  players={top}
                  teamRecordMap={teamRecordMap}
                />
                <AwardSection
                  title="Best Jungler"
                  players={jungle}
                  teamRecordMap={teamRecordMap}
                />
                <AwardSection
                  title="Best Midlaner"
                  players={mid}
                  teamRecordMap={teamRecordMap}
                />
                <AwardSection
                  title="Best ADC"
                  players={adc}
                  teamRecordMap={teamRecordMap}
                />
                <AwardSection
                  title="Best Support"
                  players={support}
                  teamRecordMap={teamRecordMap}
                />
              </div>
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
