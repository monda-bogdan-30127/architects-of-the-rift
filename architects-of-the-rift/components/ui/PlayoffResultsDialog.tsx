"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import type { FinalsMvpResult, PlayoffRound } from "@/app/utils/playoffTypes";

type Props = {
  open: boolean;
  round: PlayoffRound;
  results: string[];
  finalsMvp?: FinalsMvpResult;
  onContinue: () => void;
};

function getRoundLabel(round: PlayoffRound) {
  if (round === "quarters") return "Quarters:";
  if (round === "semis") return "Semis:";
  return "Finals:";
}

export default function PlayoffResultsDialog({
  open,
  round,
  results,
  finalsMvp,
  onContinue,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const buttonLabel =
    round === "finals" ? "MOVE TO THE NEXT SPLIT" : "MOVE TO NEXT ROUND";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,11,15,0.40)] backdrop-blur-[4px] px-[16px]">
      <div className="flex w-full max-w-[700px] flex-col items-center gap-[24px] rounded-[16px] bg-[var(--bg-surface)] px-[40px] py-[40px] text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <h2 className="h1 text-[var(--text-primary)]">Playoff Results</h2>

        <div className="flex flex-col gap-[4px]">
          <p className="body-large text-[var(--text-primary)]">
            {getRoundLabel(round)}
          </p>

          {results.map((result, index) => (
            <p
              key={`${result}-${index}`}
              className="body-large text-[var(--text-primary)]"
            >
              {result}
            </p>
          ))}

          {round === "finals" && finalsMvp ? (
            <>
              <p className="body-large mt-[8px] text-[var(--text-primary)]">
                Finals MVP:
              </p>

              <p className="body-large text-[var(--text-primary)]">
                {finalsMvp.playerName} - AVG. Grade in Finals {finalsMvp.grade.toFixed(2)}
              </p>
            </>
          ) : null}
        </div>

        <Button
          variant="main"
          onClick={onContinue}
          className="min-w-[186px] !rounded-[16px]"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>,
    document.body
  );
}
