"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { teams } from "@/app/data/teams";
import type { Team } from "@/app/types/team";
import {
  createInitialSeries,
  readJson,
  SAVE_KEY,
} from "@/app/draft-engine/draftEngine";
import { simulateAiVsAiSeries } from "@/app/draft-engine/aiSeriesSimulator";
import type { DraftSave } from "@/app/draft-engine/draftTypes";
import {
  getMvpRace,
  getBestTop,
  getBestJungle,
  getBestMid,
  getBestAdc,
  getBestSupport,
} from "@/app/draft-engine/awardsUtils";
import type { PlayoffDialogState } from "@/app/utils/playoffTypes";
import { saveFinalsMvp, savePlayoffChampion } from "@/app/utils/playoffStorage";
import { getTeamFinalsMvpCandidate } from "@/app/utils/playoffUtils";

type SeriesScheduleProps = {
  region: string;
  controlledTeamSlug: string;
  onOpenPlayoffResults?: (dialogState: PlayoffDialogState) => void;
};

type SeriesDefinition = {
  id: string;
  region: string;
  bestOf: 3 | 5;
  stageLabel: string;
  leftTeamSlug: string;
  rightTeamSlug: string;
  round: number;
  leg: number;
};

type SeriesResult = {
  winnerTeamSlug: string;
  leftWins: number;
  rightWins: number;
  completedAt: number;
  resolution: "played" | "simulated";
};

type SeriesState = Record<string, SeriesResult>;

type StandingRow = {
  team: Team;
  wins: number;
  losses: number;
};

type AwardPlayer = {
  playerId: string;
  name: string;
  team: string;
  role: string;
  avgScore: number;
  record: string;
};

type AwardsDialogProps = {
  open: boolean;
  mvpName: string;
  topName: string;
  jungleName: string;
  midName: string;
  adcName: string;
  supportName: string;
  bestStaffLabel: string;
  onClose: () => void;
};

const STORAGE_KEY = "rift-series-state";
const ACTIVE_DRAFT_SERIES_KEY = "rift-active-series-draft";
const REGULAR_SEASON_AWARDS_SHOWN_KEY_PREFIX = "rift-regular-season-awards-shown";

function getWinsNeeded(bestOf: 3 | 5) {
  return Math.ceil(bestOf / 2);
}

function isPlayoffSeriesId(seriesId: string) {
  return seriesId.toLowerCase().includes("playoff");
}

function getAwardsShownStorageKey(region: string) {
  return `${REGULAR_SEASON_AWARDS_SHOWN_KEY_PREFIX}-${region.toLowerCase()}`;
}

function getAwardWinnerName(players: AwardPlayer[] | undefined) {
  return players?.[0]?.name ?? "Player Name";
}

function buildDoubleRoundRobinSchedule(region: string): SeriesDefinition[] {
  const regionTeams = teams
    .filter((team) => team.region.toLowerCase() === region.toLowerCase())
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (regionTeams.length < 2) return [];

  const isOdd = regionTeams.length % 2 !== 0;
  const rotation = [...regionTeams];

  if (isOdd) {
    rotation.push({
      id: "bye",
      slug: "bye",
      name: "BYE",
      abbreviation: "BYE",
      code: "BYE",
      region,
      logo: "",
      sortOrder: 999,
    } as (typeof teams)[number]);
  }

  const roundsPerLeg = rotation.length - 1;
  const matchesPerRound = rotation.length / 2;
  const firstLeg: SeriesDefinition[] = [];

  let currentRotation = [...rotation];

  for (let roundIndex = 0; roundIndex < roundsPerLeg; roundIndex += 1) {
    for (let matchIndex = 0; matchIndex < matchesPerRound; matchIndex += 1) {
      const left = currentRotation[matchIndex];
      const right = currentRotation[currentRotation.length - 1 - matchIndex];

      if (left.slug === "bye" || right.slug === "bye") {
        continue;
      }

      firstLeg.push({
        id: `${region}-round-${roundIndex + 1}-match-${matchIndex + 1}-leg-1-${left.slug}-${right.slug}`,
        region,
        bestOf: 3,
        stageLabel: `Round ${roundIndex + 1}`,
        leftTeamSlug: left.slug,
        rightTeamSlug: right.slug,
        round: roundIndex + 1,
        leg: 1,
      });
    }

    const fixed = currentRotation[0];
    const rest = currentRotation.slice(1);
    rest.unshift(rest.pop()!);
    currentRotation = [fixed, ...rest];
  }

  const secondLeg = firstLeg.map((series, index) => ({
    ...series,
    id: `${region}-round-${series.round + roundsPerLeg}-match-${(index % matchesPerRound) + 1}-leg-2-${series.rightTeamSlug}-${series.leftTeamSlug}`,
    stageLabel: `Round ${series.round + roundsPerLeg}`,
    leftTeamSlug: series.rightTeamSlug,
    rightTeamSlug: series.leftTeamSlug,
    round: series.round + roundsPerLeg,
    leg: 2 as const,
  }));

  return [...firstLeg, ...secondLeg];
}

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

function saveSeriesState(state: SeriesState) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("rift-series-state-updated"));
}

function getDeterministicSeriesResult(
  series: SeriesDefinition,
  leftTeam: Team,
  rightTeam: Team,
  resolution: "played" | "simulated"
): SeriesResult {
  const winsNeeded = getWinsNeeded(series.bestOf);

  const leftSeed = leftTeam.sortOrder * 13 + series.round * 7 + series.leg * 3;
  const rightSeed = rightTeam.sortOrder * 11 + series.round * 5 + series.leg * 2;

  const leftPower = 100 - leftTeam.sortOrder * 3 + (leftSeed % 10);
  const rightPower = 100 - rightTeam.sortOrder * 3 + (rightSeed % 10);

  const leftWinsSeries = leftPower >= rightPower;
  const isClose = (leftSeed + rightSeed) % 2 === 0;

  if (series.bestOf === 3) {
    if (leftWinsSeries) {
      return {
        winnerTeamSlug: leftTeam.slug,
        leftWins: 2,
        rightWins: isClose ? 1 : 0,
        completedAt: Date.now(),
        resolution,
      };
    }

    return {
      winnerTeamSlug: rightTeam.slug,
      leftWins: isClose ? 1 : 0,
      rightWins: 2,
      completedAt: Date.now(),
      resolution,
    };
  }

  if (leftWinsSeries) {
    return {
      winnerTeamSlug: leftTeam.slug,
      leftWins: winsNeeded,
      rightWins: isClose ? winsNeeded - 1 : winsNeeded - 2,
      completedAt: Date.now(),
      resolution,
    };
  }

  return {
    winnerTeamSlug: rightTeam.slug,
    leftWins: isClose ? winsNeeded - 1 : winsNeeded - 2,
    rightWins: winsNeeded,
    completedAt: Date.now(),
    resolution,
  };
}

function buildRegularSeasonStandings(region: string, seriesState: SeriesState) {
  const regionTeams = teams
    .filter((team) => team.region.toLowerCase() === region.toLowerCase())
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const rows: StandingRow[] = regionTeams.map((team) => ({
    team,
    wins: 0,
    losses: 0,
  }));

  const rowsBySlug = rows.reduce<Record<string, StandingRow>>((acc, row) => {
    acc[row.team.slug] = row;
    return acc;
  }, {});

  for (const [seriesId, result] of Object.entries(seriesState)) {
    if (isPlayoffSeriesId(seriesId)) continue;

    const parts = seriesId.split("-");
    const leftTeamSlug = parts[parts.length - 2] ?? "";
    const rightTeamSlug = parts[parts.length - 1] ?? "";
    const leftRow = rowsBySlug[leftTeamSlug];
    const rightRow = rowsBySlug[rightTeamSlug];

    if (!leftRow || !rightRow) continue;

    if (result.winnerTeamSlug === leftTeamSlug) {
      leftRow.wins += 1;
      rightRow.losses += 1;
    } else if (result.winnerTeamSlug === rightTeamSlug) {
      rightRow.wins += 1;
      leftRow.losses += 1;
    }
  }

  return [...rows].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    return a.team.sortOrder - b.team.sortOrder;
  });
}

function buildQuarterfinals(region: string, topEight: Team[]): SeriesDefinition[] {
  if (topEight.length < 8) return [];

  return [
    {
      id: `${region}-playoff-qf1-${topEight[0].slug}-${topEight[7].slug}`,
      region,
      bestOf: 5,
      stageLabel: "Playoff",
      leftTeamSlug: topEight[0].slug,
      rightTeamSlug: topEight[7].slug,
      round: 1,
      leg: 1,
    },
    {
      id: `${region}-playoff-qf2-${topEight[1].slug}-${topEight[6].slug}`,
      region,
      bestOf: 5,
      stageLabel: "Playoff",
      leftTeamSlug: topEight[1].slug,
      rightTeamSlug: topEight[6].slug,
      round: 1,
      leg: 2,
    },
    {
      id: `${region}-playoff-qf3-${topEight[2].slug}-${topEight[5].slug}`,
      region,
      bestOf: 5,
      stageLabel: "Playoff",
      leftTeamSlug: topEight[2].slug,
      rightTeamSlug: topEight[5].slug,
      round: 1,
      leg: 3,
    },
    {
      id: `${region}-playoff-qf4-${topEight[3].slug}-${topEight[4].slug}`,
      region,
      bestOf: 5,
      stageLabel: "Playoff",
      leftTeamSlug: topEight[3].slug,
      rightTeamSlug: topEight[4].slug,
      round: 1,
      leg: 4,
    },
  ];
}

function buildSemifinals(
  region: string,
  quarterfinals: SeriesDefinition[],
  seriesState: SeriesState
): SeriesDefinition[] {
  if (quarterfinals.length !== 4) return [];

  const qf1Winner = seriesState[quarterfinals[0].id]?.winnerTeamSlug;
  const qf2Winner = seriesState[quarterfinals[1].id]?.winnerTeamSlug;
  const qf3Winner = seriesState[quarterfinals[2].id]?.winnerTeamSlug;
  const qf4Winner = seriesState[quarterfinals[3].id]?.winnerTeamSlug;

  if (!qf1Winner || !qf2Winner || !qf3Winner || !qf4Winner) return [];

  return [
    {
      id: `${region}-playoff-sf1-${qf1Winner}-${qf3Winner}`,
      region,
      bestOf: 5,
      stageLabel: "Playoff",
      leftTeamSlug: qf1Winner,
      rightTeamSlug: qf3Winner,
      round: 2,
      leg: 1,
    },
    {
      id: `${region}-playoff-sf2-${qf2Winner}-${qf4Winner}`,
      region,
      bestOf: 5,
      stageLabel: "Playoff",
      leftTeamSlug: qf2Winner,
      rightTeamSlug: qf4Winner,
      round: 2,
      leg: 2,
    },
  ];
}

function buildFinal(
  region: string,
  semifinals: SeriesDefinition[],
  seriesState: SeriesState
): SeriesDefinition[] {
  if (semifinals.length !== 2) return [];

  const sf1Winner = seriesState[semifinals[0].id]?.winnerTeamSlug;
  const sf2Winner = seriesState[semifinals[1].id]?.winnerTeamSlug;

  if (!sf1Winner || !sf2Winner) return [];

  return [
    {
      id: `${region}-playoff-final-${sf1Winner}-${sf2Winner}`,
      region,
      bestOf: 5,
      stageLabel: "Playoff",
      leftTeamSlug: sf1Winner,
      rightTeamSlug: sf2Winner,
      round: 3,
      leg: 1,
    },
  ];
}

function formatSeriesResultLine(
  series: SeriesDefinition,
  seriesState: SeriesState,
  teamsBySlug: Record<string, Team>
) {
  const result = seriesState[series.id];
  const leftTeam = teamsBySlug[series.leftTeamSlug];
  const rightTeam = teamsBySlug[series.rightTeamSlug];

  if (!result || !leftTeam || !rightTeam) {
    return "";
  }

  return `${leftTeam.abbreviation} ${result.leftWins} - ${result.rightWins} ${rightTeam.abbreviation}`;
}

function AwardsDialog({
  open,
  mvpName,
  topName,
  jungleName,
  midName,
  adcName,
  supportName,
  bestStaffLabel,
  onClose,
}: AwardsDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,11,15,0.56)] backdrop-blur-[4px] px-[16px]"
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="awards-dialog-title"
        className="relative flex w-full max-w-[860px] flex-col rounded-[16px] border border-[rgba(255,255,255,0.04)] bg-[var(--bg-surface)] px-[40px] py-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col items-center gap-[16px] text-center">
            <h2
              id="awards-dialog-title"
              className="h1 text-[var(--text-primary)]"
            >
              Awards
            </h2>

            <div className="flex w-full flex-col items-center rounded-[12px] border border-[var(--border-default)] bg-[rgba(255,255,255,0.01)] px-[24px] py-[24px] text-center">
              <p className="body-large text-[var(--text-primary)]">
                The Regular Season is over, and here are the awards:
              </p>

              <div className="mt-[16px] flex w-full flex-col gap-[16px]">
                <p className="body-large text-[var(--text-primary)]">
                  MVP: {mvpName}
                </p>

                <p className="body-large text-[var(--text-primary)]">
                  All-Pro Team: {topName}, {jungleName}, {midName}, {adcName},{" "}
                  {supportName}
                </p>

                <p className="body-large text-[var(--text-primary)]">
                  Best Staff: {bestStaffLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button variant="main" onClick={onClose}>
              MOVE TO PLAYOFFS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SeriesCardProps = {
  series: SeriesDefinition;
  leftTeam: Team;
  rightTeam: Team;
  result?: SeriesResult;
  regionLabel: string;
  isActive: boolean;
  canPlay: boolean;
  canSimulate: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onSimulate: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
};

function SeriesCard({
  series,
  leftTeam,
  rightTeam,
  result,
  regionLabel,
  isActive,
  canPlay,
  canSimulate,
  isLoading,
  onPlay,
  onSimulate,
  cardRef,
}: SeriesCardProps) {
  const isCompleted = Boolean(result);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] scroll-mt-[160px] ${
        isActive ? "shadow-[0_0_0_1px_rgba(16,228,249,0.24)]" : ""
      }`}
    >
      <div className="relative flex min-h-[112px] items-center px-[24px] py-[16px]">
        <div className="flex w-full items-center justify-center">
          <div className="flex items-center justify-center gap-[24px]">
            <div className="flex items-center gap-[16px]">
              <p className="label text-[var(--text-primary)]">
                {leftTeam.abbreviation}
              </p>

              <div className="relative h-[40px] w-[40px] shrink-0">
                <Image
                  src={leftTeam.logo}
                  alt={leftTeam.name}
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>

              {isCompleted && (
                <span className="body-large min-w-[20px] text-center text-[var(--text-primary)]">
                  {result?.leftWins}
                </span>
              )}
            </div>

            <div className="h-[40px] w-[1px] rotate-[30deg] bg-[var(--border-default)]" />

            <div className="flex items-center gap-[16px]">
              {isCompleted && (
                <span className="body-large min-w-[20px] text-center text-[var(--text-primary)]">
                  {result?.rightWins}
                </span>
              )}

              <div className="relative h-[40px] w-[40px] shrink-0">
                <Image
                  src={rightTeam.logo}
                  alt={rightTeam.name}
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>

              <p className="label text-[var(--text-primary)]">
                {rightTeam.abbreviation}
              </p>
            </div>
          </div>
        </div>

        {!isCompleted && canPlay && (
          <Button
            variant="main"
            onClick={onPlay}
            className="absolute bottom-[16px] right-[16px] min-w-[117px]"
          >
            PLAY
          </Button>
        )}

        {!isCompleted && canSimulate && !isLoading && (
          <Button
            variant="main"
            onClick={onSimulate}
            className="absolute bottom-[16px] right-[16px] min-w-[117px]"
          >
            SIMULATE
          </Button>
        )}

        {!isCompleted && isLoading && (
          <div className="absolute bottom-[16px] right-[16px] flex h-[48px] min-w-[117px] items-center justify-center rounded-[12px] border border-[var(--border-default)] bg-[var(--bg-elevated)]">
            <span className="spinner" aria-label="Loading simulation" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] px-[16px] py-[8px]">
        <p className="label text-[var(--primary)]">{regionLabel}</p>
        <p className="body-small text-[var(--text-secondary)]">
          {series.stageLabel}
        </p>
        <p className="body-small text-[var(--text-secondary)]">
          Bo{series.bestOf}
        </p>
      </div>
    </div>
  );
}

export default function SeriesSchedule({
  region,
  controlledTeamSlug,
  onOpenPlayoffResults,
}: SeriesScheduleProps) {
  const router = useRouter();
  const [seriesState, setSeriesState] = useState<SeriesState>({});
  const [isAwardsDialogOpen, setIsAwardsDialogOpen] = useState(false);
  const [loadingSeriesId, setLoadingSeriesId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hasAutoScrolled = useRef(false);

  useEffect(() => {
    setSeriesState(readSeriesState());
  }, []);

  const regularSeasonSchedule = useMemo(() => {
    return buildDoubleRoundRobinSchedule(region);
  }, [region]);

  const teamsBySlug = useMemo(() => {
    return teams.reduce<Record<string, Team>>((acc, team) => {
      acc[team.slug] = team;
      return acc;
    }, {});
  }, []);

  const regularSeasonCompletedCount = useMemo(() => {
    return regularSeasonSchedule.filter((series) => seriesState[series.id]).length;
  }, [regularSeasonSchedule, seriesState]);

  const regularSeasonComplete =
    regularSeasonSchedule.length > 0 &&
    regularSeasonCompletedCount === regularSeasonSchedule.length;

  const regularStandings = useMemo(() => {
    return buildRegularSeasonStandings(region, seriesState);
  }, [region, seriesState]);

  const topEight = useMemo(() => {
    return regularStandings.slice(0, 8).map((row) => row.team);
  }, [regularStandings]);

  const quarterfinals = useMemo(() => {
    if (!regularSeasonComplete) return [];
    return buildQuarterfinals(region, topEight);
  }, [region, regularSeasonComplete, topEight]);

  const semifinals = useMemo(() => {
    return buildSemifinals(region, quarterfinals, seriesState);
  }, [region, quarterfinals, seriesState]);

  const finalSeries = useMemo(() => {
    return buildFinal(region, semifinals, seriesState);
  }, [region, semifinals, seriesState]);

  const playoffStageSchedule = useMemo(() => {
    if (!regularSeasonComplete) return [] as SeriesDefinition[];

    const quarterfinalsComplete =
      quarterfinals.length === 4 &&
      quarterfinals.every((series) => Boolean(seriesState[series.id]));
    if (!quarterfinalsComplete) return quarterfinals;

    const semifinalsComplete =
      semifinals.length === 2 &&
      semifinals.every((series) => Boolean(seriesState[series.id]));
    if (!semifinalsComplete) return semifinals;

    return finalSeries;
  }, [finalSeries, quarterfinals, regularSeasonComplete, semifinals, seriesState]);

  const displayedSchedule = regularSeasonComplete
    ? playoffStageSchedule
    : regularSeasonSchedule;

  const sectionLabel = regularSeasonComplete ? "Playoff" : "Regular Season";

  const activeSeriesIndex = useMemo(() => {
    return displayedSchedule.findIndex((series) => !seriesState[series.id]);
  }, [displayedSchedule, seriesState]);

  const awardsShownStorageKey = useMemo(() => {
    return getAwardsShownStorageKey(region);
  }, [region]);

  const mvpWinnerName = useMemo(() => getAwardWinnerName(getMvpRace()), []);
  const bestTopName = useMemo(() => getAwardWinnerName(getBestTop()), []);
  const bestJungleName = useMemo(() => getAwardWinnerName(getBestJungle()), []);
  const bestMidName = useMemo(() => getAwardWinnerName(getBestMid()), []);
  const bestAdcName = useMemo(() => getAwardWinnerName(getBestAdc()), []);
  const bestSupportName = useMemo(() => getAwardWinnerName(getBestSupport()), []);

  const bestStaffLabel = useMemo(() => {
    const bestTeam = regularStandings[0]?.team;

    if (!bestTeam) {
      return "Team with Best Record";
    }

    return `${bestTeam.name} (${regularStandings[0].wins}-${regularStandings[0].losses})`;
  }, [regularStandings]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!regularSeasonComplete) return;

    const alreadyShown = window.localStorage.getItem(awardsShownStorageKey) === "true";
    if (alreadyShown) return;

    window.localStorage.setItem(awardsShownStorageKey, "true");
    setIsAwardsDialogOpen(true);
  }, [awardsShownStorageKey, regularSeasonComplete]);

  useEffect(() => {
    if (isAwardsDialogOpen) return;
    if (activeSeriesIndex < 0) return;

    const activeSeries = displayedSchedule[activeSeriesIndex];
    const node = cardRefs.current[activeSeries.id];

    if (!node) return;

    const offset = 240;
    const y = node.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: y,
      behavior: hasAutoScrolled.current ? "smooth" : "auto",
    });

    hasAutoScrolled.current = true;
  }, [activeSeriesIndex, displayedSchedule, isAwardsDialogOpen]);

  const handleResolveSeries = async (
    series: SeriesDefinition,
    resolution: "played" | "simulated"
  ) => {
    const leftTeam = teamsBySlug[series.leftTeamSlug];
    const rightTeam = teamsBySlug[series.rightTeamSlug];

    if (!leftTeam || !rightTeam) return;

    if (resolution === "simulated") {
      setLoadingSeriesId(series.id);
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    }

    let result: SeriesResult | null = null;

    try {
      if (resolution === "simulated") {
        const save = readJson<DraftSave>(SAVE_KEY);
        const initialSeries = createInitialSeries(series.id, "__ai__");
        result = simulateAiVsAiSeries(initialSeries, save).result;
      } else {
        result = getDeterministicSeriesResult(
          series,
          leftTeam,
          rightTeam,
          resolution
        );
      }

      if (!result) return;

      const nextState = {
        ...seriesState,
        [series.id]: result,
      };

      setSeriesState(nextState);
      saveSeriesState(nextState);

      if (isPlayoffSeriesId(series.id) && onOpenPlayoffResults) {
        if (series.round === 1) {
          const roundSeries = quarterfinals;
          const allDone =
            roundSeries.length > 0 &&
            roundSeries.every((entry) => Boolean(nextState[entry.id]));

          if (allDone) {
            onOpenPlayoffResults({
              open: true,
              round: "quarters",
              results: roundSeries
                .map((entry) => formatSeriesResultLine(entry, nextState, teamsBySlug))
                .filter(Boolean),
            });
          }
        } else if (series.round === 2) {
          const roundSeries = semifinals;
          const allDone =
            roundSeries.length > 0 &&
            roundSeries.every((entry) => Boolean(nextState[entry.id]));

          if (allDone) {
            onOpenPlayoffResults({
              open: true,
              round: "semis",
              results: roundSeries
                .map((entry) => formatSeriesResultLine(entry, nextState, teamsBySlug))
                .filter(Boolean),
            });
          }
        } else if (series.round === 3) {
          const winnerTeam = teamsBySlug[result.winnerTeamSlug];

          if (winnerTeam) {
            const finalsMvp =
              getTeamFinalsMvpCandidate(winnerTeam.slug, winnerTeam.name) ?? {
                playerName: `${winnerTeam.abbreviation} Player`,
                team: winnerTeam.name,
                grade: 8.5,
              };

            savePlayoffChampion(winnerTeam.name);
            saveFinalsMvp(finalsMvp);

            onOpenPlayoffResults({
              open: true,
              round: "finals",
              results: [formatSeriesResultLine(series, nextState, teamsBySlug)].filter(Boolean),
              finalsMvp,
            });
          }
        }
      }
    } finally {
      if (resolution === "simulated") {
        setLoadingSeriesId((current) => (current === series.id ? null : current));
      }
    }
  };

  const handlePlaySeries = (series: SeriesDefinition) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACTIVE_DRAFT_SERIES_KEY);
    }

    router.push(`/gameplay-dashboard/series/${series.id}/draft`);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(ACTIVE_DRAFT_SERIES_KEY);
      window.localStorage.removeItem(awardsShownStorageKey);
    }

    setIsAwardsDialogOpen(false);
    setSeriesState({});
    setLoadingSeriesId(null);
    hasAutoScrolled.current = false;
  };

  const completedCount = displayedSchedule.filter((series) => seriesState[series.id]).length;

  return (
    <>
      <AwardsDialog
        open={isAwardsDialogOpen}
        mvpName={mvpWinnerName}
        topName={bestTopName}
        jungleName={bestJungleName}
        midName={bestMidName}
        adcName={bestAdcName}
        supportName={bestSupportName}
        bestStaffLabel={bestStaffLabel}
        onClose={() => setIsAwardsDialogOpen(false)}
      />

      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[16px] py-[12px]">
          <div className="flex flex-col">
            <p className="label text-[var(--text-primary)]">{sectionLabel}</p>
            {!regularSeasonComplete ? (
              <p className="body-small text-[var(--text-secondary)]">
                {regularSeasonCompletedCount} / {regularSeasonSchedule.length} series completed
              </p>
            ) : (
              <p className="body-small text-[var(--text-secondary)]">
                {completedCount} / {displayedSchedule.length} series completed
              </p>
            )}
          </div>

          <Button variant="secondary" onClick={handleReset}>
            Reset Schedule
          </Button>
        </div>

        <div className="flex flex-col gap-[16px]">
          {displayedSchedule.map((series, index) => {
            const leftTeam = teamsBySlug[series.leftTeamSlug];
            const rightTeam = teamsBySlug[series.rightTeamSlug];

            if (!leftTeam || !rightTeam) return null;

            const result = seriesState[series.id];
            const isCompleted = Boolean(result);
            const isActive = index === activeSeriesIndex;
            const involvesControlledTeam =
              series.leftTeamSlug === controlledTeamSlug ||
              series.rightTeamSlug === controlledTeamSlug;

            return (
              <SeriesCard
                key={series.id}
                series={series}
                leftTeam={leftTeam}
                rightTeam={rightTeam}
                result={result}
                regionLabel={region.toUpperCase()}
                isActive={isActive}
                canPlay={!isCompleted && isActive && involvesControlledTeam}
                canSimulate={!isCompleted && isActive && !involvesControlledTeam}
                isLoading={loadingSeriesId === series.id}
                onPlay={() => handlePlaySeries(series)}
                onSimulate={() => handleResolveSeries(series, "simulated")}
                cardRef={(node) => {
                  cardRefs.current[series.id] = node;
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
