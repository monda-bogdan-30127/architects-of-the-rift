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
const PLAYER_SPIRIT_KEY = "rift-player-spirit";
const SPIRIT_ACCUMULATOR_KEY = "rift-spirit-accumulator";

export default function HomePage() {
  const router = useRouter();

  const [hasSaveFile, setHasSaveFile] = useState(false);
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const existingSave = localStorage.getItem(SAVE_KEY);
    setHasSaveFile(Boolean(existingSave));
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleStartFreshGame = () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SERIES_SAVE_KEY);
    localStorage.removeItem(ACTIVE_DRAFT_SERIES_KEY);
    localStorage.removeItem(PLAYER_HISTORY_KEY);
    localStorage.removeItem(PLAYER_SEASON_STATS_KEY);
    localStorage.removeItem(PLAYER_SPIRIT_KEY);
    localStorage.removeItem(SPIRIT_ACCUMULATOR_KEY);
    localStorage.removeItem("rift-storage-version");
    localStorage.removeItem("rift-player-kda-stats");
    localStorage.removeItem("rift-player-mvp-stats");
    localStorage.removeItem("rift-series-mvp-progress");

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

  const handleCloseNewGameDialog = () => setIsNewGameDialogOpen(false);
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
      <style>{`
        /* ── Entrance animations ─────────────────────────────────────────── */
        @keyframes home-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes home-image-rise {
          from { opacity: 0; transform: scale(1.04) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        /* ── Ambient background motion ───────────────────────────────────── */
        @keyframes home-ambient-drift {
          0%   { transform: translate(0, 0)        scale(1);    opacity: 0.55; }
          50%  { transform: translate(2%, -1.5%)   scale(1.05); opacity: 0.75; }
          100% { transform: translate(0, 0)        scale(1);    opacity: 0.55; }
        }
        @keyframes home-ambient-drift-2 {
          0%   { transform: translate(0, 0)        scale(1);    opacity: 0.4; }
          50%  { transform: translate(-2.5%, 2%)   scale(1.08); opacity: 0.6; }
          100% { transform: translate(0, 0)        scale(1);    opacity: 0.4; }
        }

        /* ── Highlight tag pulse ─────────────────────────────────────────── */
        @keyframes home-pulse-dot {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }

        /* ── Image hover parallax ────────────────────────────────────────── */
        .home-hero-image {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      filter    0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .home-hero-wrap:hover .home-hero-image {
          transform: scale(1.015);
          filter: brightness(1.08);
        }

        /* ── Buttons hover lift ──────────────────────────────────────────── */
        .home-button-shell {
          transition: transform 0.18s ease;
        }
        .home-button-shell:hover {
          transform: translateY(-1px);
        }

        /* ── Exit link underline reveal ─────────────────────────────────── */
        .home-exit-link {
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s ease, letter-spacing 0.2s ease;
        }
        .home-exit-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .home-exit-link:hover {
          letter-spacing: 0.18em;
        }
        .home-exit-link:hover::after {
          transform: scaleX(1);
        }

        /* ── Stagger entrance helpers ────────────────────────────────────── */
        .home-anim-1 { animation: home-fade-up   0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both; }
        .home-anim-2 { animation: home-fade-up   0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both; }
        .home-anim-3 { animation: home-fade-up   0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.30s both; }
        .home-anim-4 { animation: home-fade-up   0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both; }
        .home-anim-5 { animation: home-fade-up   0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both; }
        .home-anim-image { animation: home-image-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both; }

        @media (prefers-reduced-motion: reduce) {
          .home-anim-1, .home-anim-2, .home-anim-3, .home-anim-4, .home-anim-5,
          .home-anim-image, .home-ambient {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Full-viewport ambient background (behind PageContainer) ───── */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {/* Primary orb — top left */}
        <div
          aria-hidden
          className="home-ambient absolute"
          style={{
            top:    "-20%",
            left:   "-10%",
            width:  "70%",
            height: "70%",
            background:
              "radial-gradient(ellipse at center, color-mix(in srgb, var(--primary) 28%, transparent) 0%, transparent 60%)",
            filter:    "blur(60px)",
            animation: "home-ambient-drift 14s ease-in-out infinite",
          }}
        />
        {/* Highlight orb — bottom right */}
        <div
          aria-hidden
          className="home-ambient absolute"
          style={{
            bottom: "-25%",
            right:  "-15%",
            width:  "65%",
            height: "65%",
            background:
              "radial-gradient(ellipse at center, color-mix(in srgb, var(--highlight) 22%, transparent) 0%, transparent 60%)",
            filter:    "blur(70px)",
            animation: "home-ambient-drift-2 18s ease-in-out infinite",
          }}
        />
        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize:  "64px 64px",
            maskImage:        "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage:  "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      <PageContainer className="relative z-[1] min-h-screen">
        <section
          className="relative flex min-h-screen items-center justify-center px-[80px] py-[80px] overflow-hidden"
        >

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div
            className="relative flex w-full max-w-[1120px] items-center gap-[32px]"
          >
            <div className="flex max-w-[448px] flex-1 flex-col self-stretch">
              <div className="flex flex-col gap-[24px]">
                {/* Tagline pill */}
                <div
                  className={mounted ? "home-anim-1" : ""}
                  style={{
                    display:        "inline-flex",
                    alignItems:     "center",
                    gap:            10,
                    padding:        "6px 14px",
                    borderRadius:   999,
                    border:         "1px solid color-mix(in srgb, var(--highlight) 45%, transparent)",
                    background:     "color-mix(in srgb, var(--highlight) 8%, transparent)",
                    width:          "fit-content",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width:        6,
                      height:       6,
                      borderRadius: "50%",
                      background:   "var(--highlight)",
                      animation:    "home-pulse-dot 2.4s ease-in-out infinite",
                      boxShadow:    "0 0 8px var(--highlight)",
                    }}
                  />
                  <p
                    className="label"
                    style={{
                      color:         "var(--highlight)",
                      letterSpacing: "0.18em",
                      margin:        0,
                    }}
                  >
                    Build the next dynasty
                  </p>
                </div>

                <div className="flex flex-col gap-[24px]">
                  <div
                    className={`flex items-center gap-[16px] ${mounted ? "home-anim-2" : ""}`}
                    style={{
                      filter:
                        "drop-shadow(0 0 24px color-mix(in srgb, var(--primary) 35%, transparent))",
                    }}
                  >
                    <Image
                      src="/svg/rift's-architects-logo.svg"
                      alt="Rift's Architects logo"
                      width={366}
                      height={72}
                      priority
                    />
                  </div>

                  <p className={`body-m max-w-[448px] text-[var(--text-primary)] ${mounted ? "home-anim-3" : ""}`}>
                    Build your roster. Shape your identity. Master the draft.
                    WIN!
                  </p>
                </div>
              </div>

              <div className="mt-[160px] flex w-[200px] flex-col gap-[24px]">
                <div className={mounted ? "home-anim-4" : ""}>
                  <div className="home-button-shell">
                    <Button
                      disabled={!hasSaveFile}
                      onClick={handleContinue}
                      className="w-full"
                    >
                      CONTINUE
                    </Button>
                  </div>
                </div>

                <div className={mounted ? "home-anim-4" : ""}>
                  <div
                    className="home-button-shell"
                    style={{
                      filter:
                        "drop-shadow(0 0 12px color-mix(in srgb, var(--primary) 40%, transparent))",
                    }}
                  >
                    <Button onClick={handleNewGame} className="w-full">
                      NEW GAME
                    </Button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExit}
                  className={`home-exit-link label w-fit text-[var(--primary)] ${mounted ? "home-anim-5" : ""}`}
                >
                  EXIT
                </button>
              </div>
            </div>

            {/* ── Hero image ─────────────────────────────────────────────── */}
            <div
              className={`home-hero-wrap relative h-[542px] w-[640px] shrink-0 ${mounted ? "home-anim-image" : ""}`}
            >
              {/* Image */}
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <Image
                  src="/pictures/start-page-picture.png"
                  alt="Rift's Architects start page"
                  fill
                  priority
                  className="home-hero-image object-contain"
                />
              </div>
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