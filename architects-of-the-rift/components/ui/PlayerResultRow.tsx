"use client";

import type { PlayerGameScore } from "@/app/draft-engine/matchSimulationTypes";

type Props = {
  entry: PlayerGameScore;
  align?: "left" | "right";
};

export default function PlayerResultRow({
  entry,
  align = "left",
}: Props) {
  const isRight = align === "right";

  return (
    <div className="flex items-start justify-between gap-[16px]">
      <div className={`min-w-0 flex-1 ${isRight ? "order-2 text-right" : "order-1 text-left"}`}>
        <div className="body-large truncate text-[var(--text-primary)]">
          {entry.playerName}
        </div>

        <div className="body mt-[4px] truncate text-[var(--text-secondary)]">
          {entry.championName}
        </div>
      </div>

      <div
        className={`h1 shrink-0 whitespace-nowrap text-[var(--text-highlight)] ${
          isRight ? "order-1" : "order-2"
        }`}
      >
        {entry.score.toFixed(1)}
      </div>
    </div>
  );
}