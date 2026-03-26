"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";

const SAVE_KEY = "rift-draft-save";
const SERIES_SAVE_KEY = "rift-series-state";
const ACTIVE_DRAFT_SERIES_KEY = "rift-active-series-draft";
const PLAYER_HISTORY_KEY = "rift-player-history";
const PLAYER_SEASON_STATS_KEY = "rift-player-season-stats";

export default function HomePage() {
  const router = useRouter();

  const [hasSaveFile, setHasSaveFile] = useState(false);
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);

  useEffect(() => {
    const existingSave = localStorage.getItem(SAVE_KEY);
    setHasSaveFile(Boolean(existingSave));
  }, []);

  const handleStartFreshGame = () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SERIES_SAVE_KEY);
    localStorage.removeItem(ACTIVE_DRAFT_SERIES_KEY);
    localStorage.removeItem(PLAYER_HISTORY_KEY);
    localStorage.removeItem(PLAYER_SEASON_STATS_KEY);
    localStorage.removeItem("rift-storage-version");

    router.push("/select-region");
  };

  const handleNewGame = () => {
    if (hasSaveFile) {
      setIsNewGameDialogOpen(true);
      return;
    }

    handleStartFreshGame();
  };

  const handleContinue = () => {
    if (!hasSaveFile) return;
    router.push("/gameplay-dashboard");
  };

  const handleCloseNewGameDialog = () => {
    setIsNewGameDialogOpen(false);
  };

  const handleConfirmNewGame = () => {
    setIsNewGameDialogOpen(false);
    handleStartFreshGame();
  };

  const handleExit = () => {
    window.open("", "_self");
    window.close();
  };

  return (
    <>
      <PageContainer className="min-h-screen">
        <section className="flex min-h-screen items-center justify-center px-[80px] py-[80px]">
          <div className="flex w-full max-w-[1120px] items-center gap-[32px]">
            <div className="flex max-w-[448px] flex-1 flex-col self-stretch">
              <div className="flex flex-col gap-[24px]">
                <p className="label text-[var(--highlight)]">
                  Build the next dynasty
                </p>

                <div className="flex flex-col gap-[24px]">
                  <div className="flex items-center gap-[16px]">
                    <Image
                      src="/svg/rift's-architects-logo.svg"
                      alt="Rift's Architects logo"
                      width={366}
                      height={72}
                      priority
                    />
                  </div>

                  <p className="body-m max-w-[448px] text-[var(--text-primary)]">
                    Build your roster. Shape your identity. Master the draft.
                    WIN!
                  </p>
                </div>
              </div>

              <div className="mt-[160px] flex w-[200px] flex-col gap-[24px]">
                <Button
                  disabled={!hasSaveFile}
                  onClick={handleContinue}
                  className="w-full"
                >
                  CONTINUE
                </Button>

                <Button onClick={handleNewGame} className="w-full">
                  NEW GAME
                </Button>

                <button
                  type="button"
                  onClick={handleExit}
                  className="label w-fit text-[var(--primary)] transition-opacity hover:opacity-80"
                >
                  EXIT
                </button>
              </div>
            </div>

            <div className="relative h-[542px] w-[640px] shrink-0">
              <Image
                src="/pictures/start-page-picture.png"
                alt="Rift's Architects start page"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </section>
      </PageContainer>

      <Dialog
        open={isNewGameDialogOpen}
        onClose={handleCloseNewGameDialog}
        title="New Dynasty?"
        description="You already have a save in progress. Starting a new dynasty will overwrite your current progress. Are you sure you want to begin a new run?"
        secondaryLabel="Cancel"
        onSecondaryAction={handleCloseNewGameDialog}
        primaryLabel="New Game"
        onPrimaryAction={handleConfirmNewGame}
      />
    </>
  );
}