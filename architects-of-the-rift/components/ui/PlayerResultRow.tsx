"use client";

import type { PlayerGameScore } from "@/app/draft-engine/matchSimulationTypes";

type Props = {
  entry: PlayerGameScore;
  align?: "left" | "right";
  showMvp?: boolean;
};

export default function PlayerResultRow({
  entry,
  align = "left",
  showMvp = false,
}: Props) {
  const isRight = align === "right";
  const kdaText = `${entry.kills}/${entry.deaths}/${entry.assists}`;

  if (isRight) {
    // Right side: Score | KDA | MVP? | Name+Champ
    return (
      <div className="flex items-center gap-[12px] self-stretch">
        <div className="h1 w-[44px] shrink-0 text-center text-[var(--text-highlight)]">
          {entry.score.toFixed(1)}
        </div>

        <div className="body w-[56px] shrink-0 text-center text-[var(--text-secondary)]">
          {kdaText}
        </div>

        {showMvp && (
          <span className="body-small shrink-0 font-semibold text-[var(--primary)]">
            MVP
          </span>
        )}

        <div className="min-w-0 flex-1 text-right">
          <div className="body-large truncate text-[var(--text-primary)]">
            {entry.playerName}
          </div>
          <div className="body mt-[2px] truncate text-[var(--text-secondary)]">
            {entry.championName}
          </div>
        </div>
      </div>
    );
  }

  // Left side: Name+Champ | MVP? | KDA | Score
  return (
    <div className="flex items-center gap-[12px] self-stretch">
      <div className="min-w-0 flex-1">
        <div className="body-large truncate text-[var(--text-primary)]">
          {entry.playerName}
        </div>
        <div className="body mt-[2px] truncate text-[var(--text-secondary)]">
          {entry.championName}
        </div>
      </div>

      {showMvp && (
        <span className="body-small shrink-0 font-semibold text-[var(--primary)]">
          MVP
        </span>
      )}

      <div className="body w-[56px] shrink-0 text-center text-[var(--text-secondary)]">
        {kdaText}
      </div>

      <div className="h1 w-[44px] shrink-0 text-center text-[var(--text-highlight)]">
        {entry.score.toFixed(1)}
      </div>
    </div>
  );
}