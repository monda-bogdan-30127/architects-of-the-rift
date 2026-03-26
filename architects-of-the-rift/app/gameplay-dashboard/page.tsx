"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import RegionalStandings from "@/components/ui/RegionalStandings";
import SeriesSchedule from "@/components/ui/SeriesSchedule";
import PlayoffResultsDialog from "@/components/ui/PlayoffResultsDialog";
import { teams } from "@/app/data/teams";
import useBackRedirect from "@/app/hooks/useBrowserBackRedirect";
import type { Role } from "@/app/types/champion";
import type { PlayoffDialogState } from "@/app/utils/playoffTypes";
import {
  addSplitHistory,
  getCurrentSplit,
  incrementSplit,
} from "@/app/utils/splitHistoryStorage";
import { startNextSplit } from "@/app/utils/startNextSplit";
import { getMvpRace } from "@/app/draft-engine/awardsUtils";

type DraftSave = {
  region: string;
  controlledTeamSlug: string;
  budget: number;
  roster: Record<Role, string>;
  updatedTeamRosters: Record<string, Record<Role, string>>;
  playerTeamAssignments: Record<string, string>;
  freeAgentPlayerIds: string[];
};

const DEFAULT_PLAYOFF_DIALOG: PlayoffDialogState = {
  open: false,
  round: "quarters",
  results: [],
};

export default function GameplayDashboardPage() {
  useBackRedirect("/");

  const [save, setSave] = useState<DraftSave | null>(null);
  const [playoffDialog, setPlayoffDialog] =
    useState<PlayoffDialogState>(DEFAULT_PLAYOFF_DIALOG);

  useEffect(() => {
    const rawSave = localStorage.getItem("rift-draft-save");

    if (!rawSave) return;

    try {
      const parsed = JSON.parse(rawSave) as DraftSave;
      setSave(parsed);
    } catch {
      setSave(null);
    }
  }, []);

  const controlledTeam = useMemo(() => {
    if (!save) return null;

    return teams.find((team) => team.slug === save.controlledTeamSlug) ?? null;
  }, [save]);

  const standingsRegion = save?.region ?? controlledTeam?.region ?? "lck";
  const controlledTeamSlug = save?.controlledTeamSlug ?? "";

  const dashboardLabel =
    controlledTeam?.name != null
      ? `${controlledTeam.name} Dashboard`
      : "Gameplay Dashboard";

  function handlePlayoffContinue() {
    if (playoffDialog.round === "finals" && playoffDialog.finalsMvp) {
      const split = getCurrentSplit();
      const regularSeasonMvp = getMvpRace()?.[0]?.name ?? "Player Name";

      addSplitHistory({
        split,
        champion: playoffDialog.finalsMvp.team,
        finalsMvp: playoffDialog.finalsMvp.playerName,
        regularSeasonMvp,
      });

      incrementSplit();
      startNextSplit();
      return;
    }

    setPlayoffDialog(DEFAULT_PLAYOFF_DIALOG);
  }

  return (
    <PageContainer className="min-h-screen bg-[var(--bg-main)] py-[16px]">
      <div className="flex items-start gap-[32px]">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          <div className="flex flex-col">
            <div className="sticky top-0 z-20 bg-[var(--bg-main)] px-[16px] pt-[16px] pb-[32px]">
              <div className="flex flex-col gap-[8px]">
                <p className="body-small text-[var(--text-primary)]">
                  {dashboardLabel}
                </p>

                <h1 className="h1 text-[var(--text-primary)]">
                  Games Schedule
                </h1>

                <div className="flex flex-col gap-0">
                  <p className="body-small text-[var(--text-secondary)]">
                    All regular season matches are Best of 3 series, and the top
                    8 teams will qualify for the Playoffs.
                  </p>
                  <p className="body-small text-[var(--text-secondary)]">
                    The Playoff series are Best of 5.
                  </p>
                  <p className="body-small text-[var(--text-secondary)]">
                    All series are played in a Fearless format (once a champion
                    is played in a game, it is blocked for the rest of the
                    series).
                  </p>
                  <p className="body-small text-[var(--text-secondary)]">
                    Good luck and create your dynasty!
                  </p>
                </div>
              </div>
            </div>

            <div className="px-[16px] pb-[16px]">
              <SeriesSchedule
                region={standingsRegion}
                controlledTeamSlug={controlledTeamSlug}
                onOpenPlayoffResults={(dialogState) => {
                  setPlayoffDialog(dialogState);
                }}
              />
            </div>
          </div>
        </main>

        <RegionalStandings region={standingsRegion} />
      </div>

      <PlayoffResultsDialog
        open={playoffDialog.open}
        round={playoffDialog.round}
        results={playoffDialog.results}
        finalsMvp={playoffDialog.finalsMvp}
        onContinue={handlePlayoffContinue}
      />
    </PageContainer>
  );
}
