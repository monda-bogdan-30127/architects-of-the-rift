"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { teams } from "@/app/data/teams";
import type { DraftSimulationResult } from "@/app/draft-engine/draftTypes";
import PlayerResultRow from "./PlayerResultRow";

const teamsBySlug = new Map(teams.map((team) => [team.slug, team]));

function getTeamLabel(teamSlug: string) {
  const team = teamsBySlug.get(teamSlug) as
    | { name?: string; shortName?: string }
    | undefined;

  return team?.name ?? team?.shortName ?? teamSlug;
}

type Props = {
  open: boolean;
  simulation: DraftSimulationResult | null;
  onPrimaryAction: () => void;
  primaryLabel: string;
  /** Pass true only when the series is fully decided (someone reached required wins) */
  isSeriesComplete?: boolean;
  /**
   * Name of the series MVP — computed by parent:
   * 1. Count match MVPs per player on the series-winning team
   * 2. Player with most match MVPs wins
   * 3. Tiebreak: highest average score across the series
   */
  seriesMvpName?: string;
};

export default function MatchResultsDialog({
  open,
  simulation,
  onPrimaryAction,
  primaryLabel,
  isSeriesComplete = false,
  seriesMvpName,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !simulation || typeof document === "undefined") {
    return null;
  }

  const blueTeamName = getTeamLabel(simulation.blueTeamSlug);
  const redTeamName = getTeamLabel(simulation.redTeamSlug);

  const winnerName =
    simulation.winnerSide === "blue" ? blueTeamName : redTeamName;
  const title = isSeriesComplete
    ? `${winnerName} Win Series!`
    : `${winnerName} Win!`;

  const bluePlayers = simulation.playerScores.filter(
    (entry) => entry.side === "blue"
  );
  const redPlayers = simulation.playerScores.filter(
    (entry) => entry.side === "red"
  );

  // Game MVP = highest score from WINNING TEAM only
  const winningPlayers = simulation.playerScores.filter(
    (entry) => entry.side === simulation.winnerSide
  );
  const gameMvp = [...winningPlayers].sort(
    (a, b) => b.score - a.score
  )[0] ?? null;

  return createPortal(
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[rgba(11,11,15,0.40)]
        backdrop-blur-[4px]
      "
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-results-title"
        className="
          relative
          flex w-[720px] max-w-[calc(100vw-32px)] flex-col
          gap-[32px]
          rounded-[16px]
          bg-[var(--bg-surface)]
          px-[40px] py-[40px]
        "
      >
        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-[4px] self-stretch text-center">
          <p className="body-small text-[var(--text-primary)]">
            Game Result
          </p>

          <h2
            id="match-results-title"
            className="h1 text-[var(--text-primary)]"
          >
            {title}
          </h2>

          {simulation.gameLength && (
            <p className="body-small text-[var(--text-secondary)]">
              Match Length - {simulation.gameLength}
            </p>
          )}

          {isSeriesComplete && seriesMvpName && (
            <p className="body-small text-[var(--primary)]">
              {seriesMvpName} - Series MVP
            </p>
          )}
        </div>

        {/* ─── Teams area ─────────────────────────────────────────── */}
        <div className="flex min-w-0 items-start gap-[32px] self-stretch">
          {/* ── Left section ───────────────────────────────────────── */}
          <section className="flex min-w-0 flex-1 flex-col gap-[16px]">
            <h3 className="h1 whitespace-nowrap text-[var(--text-primary)]">
              {blueTeamName} - {simulation.seriesScoreBlue}
            </h3>

            <div className="h-px self-stretch bg-[var(--border-default)]" />

            <div className="flex items-center gap-[12px] self-stretch">
              <div className="min-w-0 flex-1" />
              <span className="body-small w-[56px] shrink-0 text-center text-[var(--text-secondary)]">KDA</span>
              <span className="body-small w-[44px] shrink-0 text-center text-[var(--text-secondary)]">Score</span>
            </div>

            <div className="flex flex-col gap-[16px] self-stretch">
              {bluePlayers.map((entry) => (
                <PlayerResultRow
                  key={`${entry.side}-${entry.role}-${entry.playerId}`}
                  entry={entry}
                  showMvp={entry.playerId === gameMvp?.playerId}
                />
              ))}
            </div>
          </section>

          {/* ── Right section ──────────────────────────────────────── */}
          <section className="flex min-w-0 flex-1 flex-col gap-[16px]">
            <h3 className="h1 whitespace-nowrap self-stretch text-right text-[var(--text-primary)]">
              {redTeamName} - {simulation.seriesScoreRed}
            </h3>

            <div className="h-px self-stretch bg-[var(--border-default)]" />

            <div className="flex items-center gap-[12px] self-stretch">
              <span className="body-small w-[44px] shrink-0 text-center text-[var(--text-secondary)]">Score</span>
              <span className="body-small w-[56px] shrink-0 text-center text-[var(--text-secondary)]">KDA</span>
              <div className="min-w-0 flex-1" />
            </div>

            <div className="flex flex-col gap-[16px] self-stretch">
              {redPlayers.map((entry) => (
                <PlayerResultRow
                  key={`${entry.side}-${entry.role}-${entry.playerId}`}
                  entry={entry}
                  align="right"
                  showMvp={entry.playerId === gameMvp?.playerId}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ─── Action ─────────────────────────────────────────────── */}
        <div className="flex justify-center self-stretch">
          <Button
            onClick={onPrimaryAction}
            className="min-w-[186px] !rounded-[16px]"
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}