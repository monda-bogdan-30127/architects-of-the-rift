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
};

export default function MatchResultsDialog({
  open,
  simulation,
  onPrimaryAction,
  primaryLabel,
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

  const bluePlayers = simulation.playerScores.filter(
    (entry) => entry.side === "blue"
  );

  const redPlayers = simulation.playerScores.filter(
    (entry) => entry.side === "red"
  );

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
          inline-flex w-fit max-w-[calc(100vw-32px)] flex-col
          gap-[32px]
          rounded-[16px]
          bg-[var(--bg-surface)]
          px-[40px] py-[40px]
        "
      >
        <div className="flex flex-col items-center gap-[8px] text-center">
          <p className="body-small text-[var(--text-primary)]">
            Game Result
          </p>

          <h2
            id="match-results-title"
            className="h1 text-[var(--text-primary)]"
          >
            {winnerName} Win!
          </h2>
        </div>

        <div className="flex w-fit items-start gap-[64px]">
          <section className="flex w-fit min-w-0 flex-col gap-[16px]">
            <h3 className="h1 whitespace-nowrap text-[var(--text-primary)]">
              {blueTeamName} - {simulation.seriesScoreBlue}
            </h3>

            <div className="h-px w-full bg-[var(--border-default)]" />

            <div className="flex w-fit flex-col gap-[16px]">
              {bluePlayers.map((entry) => (
                <PlayerResultRow
                  key={`${entry.side}-${entry.role}-${entry.playerId}`}
                  entry={entry}
                />
              ))}
            </div>
          </section>

          <section className="flex w-fit min-w-0 flex-col gap-[16px]">
            <h3 className="h1 whitespace-nowrap text-right text-[var(--text-primary)]">
              {redTeamName} - {simulation.seriesScoreRed}
            </h3>

            <div className="h-px w-full bg-[var(--border-default)]" />

            <div className="flex w-fit flex-col gap-[16px] self-end">
              {redPlayers.map((entry) => (
                <PlayerResultRow
                  key={`${entry.side}-${entry.role}-${entry.playerId}`}
                  entry={entry}
                  align="right"
                />
              ))}
            </div>
          </section>
        </div>

        <div className="flex justify-end">
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