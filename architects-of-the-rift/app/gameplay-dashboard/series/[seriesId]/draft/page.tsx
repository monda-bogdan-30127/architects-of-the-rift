"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { champions } from "@/app/data/champions";
import { useDraftEngine } from "@/app/hooks/useDraftEngine";
import { resolveFinishedDraftAssignments } from "@/app/draft-engine/draftEngine";
import MatchResultsDialog from "@/components/ui/MatchResultsDialog";
import type { DraftGameState, DraftSave, DraftSimulationResult, DraftStep, Side } from "@/app/draft-engine/draftTypes";
import type { Champion, Role } from "@/app/types/champion";

const CHAMPION_CARD_SIZE = 102;
const CHAMPION_CARD_GAP = 8;
const CHAMPION_GRID_COLUMNS = 5;
const MINI_SLOT_SIZE = 36;
const ROLE_CARD_SIZE = 88;

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];
const FILTERS: Array<{ key: Role | "all"; label: string; icon: string }> = [
  { key: "all", label: "ALL", icon: "/pictures/all-roles.png" },
  { key: "top", label: "TOP", icon: "/pictures/filter-tag.png" },
  { key: "jungle", label: "JG", icon: "/pictures/filter-tag-1.png" },
  { key: "mid", label: "MID", icon: "/pictures/filter-tag-2.png" },
  { key: "adc", label: "ADC", icon: "/pictures/filter-tag-3.png" },
  { key: "support", label: "SUP", icon: "/pictures/filter-tag-4.png" },
];

function getChampionById(championId: string) {
  return champions.find((champion) => champion.id === championId) ?? null;
}

function championMatchesSearch(champion: Champion, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();

  return (
    champion.name.toLowerCase().includes(q) ||
    champion.id.toLowerCase().includes(q)
  );
}

function getRoleLabel(role: Role) {
  if (role === "top") return "TOP";
  if (role === "jungle") return "JUNGLE";
  if (role === "mid") return "MID";
  if (role === "adc") return "ADC";
  return "SUPPORT";
}

function getSwapLabel(role: Role) {
  if (role === "top") return "SWAP TOP";
  if (role === "jungle") return "SWAP JUNGLE";
  if (role === "mid") return "SWAP MID";
  if (role === "adc") return "SWAP ADC";
  return "SWAP SUPP";
}

function getTeamRosterFromSources({
  team,
  save,
}: {
  team: unknown;
  save: DraftSave | null;
}): Partial<Record<Role, string>> {
  if (!team || typeof team !== "object") return {};

  const typedTeam = team as {
    slug?: string;
    roster?: Partial<Record<Role, string>>;
  };

  const teamSlug = typedTeam.slug ?? "";
  const baseRoster =
    typedTeam.roster && typeof typedTeam.roster === "object"
      ? typedTeam.roster
      : {};

  if (!save) {
    return baseRoster;
  }

  const updatedRoster = teamSlug
    ? save.updatedTeamRosters?.[teamSlug]
    : undefined;

  if (updatedRoster && typeof updatedRoster === "object") {
    return updatedRoster;
  }

  if (teamSlug && save.controlledTeamSlug === teamSlug && save.roster) {
    return save.roster;
  }

  return baseRoster;
}

function assignChampionToRoleMap(
  assignments: Partial<Record<Role, string>>,
  championId: string
) {
  const next = { ...assignments };
  const firstOpenRole = ROLE_ORDER.find((role) => !next[role]);

  if (firstOpenRole) {
    next[firstOpenRole] = championId;
  }

  return next;
}

function buildAssignmentsFromPicks(picks: string[]) {
  let assignments: Partial<Record<Role, string>> = {};
  for (const championId of picks) {
    assignments = assignChampionToRoleMap(assignments, championId);
  }
  return assignments;
}

function getDisplayAssignments(
  savedAssignments: Partial<Record<Role, string>>,
  picks: string[]
) {
  if (Object.keys(savedAssignments).length > 0) return savedAssignments;
  return buildAssignmentsFromPicks(picks);
}

function getPreviewBans(
  game: DraftGameState,
  currentStep: DraftStep | null,
  selectedChampionId: string | null,
  userSide: Side,
  isUserTurn: boolean
) {
  let bansBlue = [...game.bansBlue];
  let bansRed = [...game.bansRed];

  if (
    currentStep &&
    selectedChampionId &&
    isUserTurn &&
    currentStep.action === "ban"
  ) {
    if (userSide === "blue") bansBlue = [...bansBlue, selectedChampionId];
    if (userSide === "red") bansRed = [...bansRed, selectedChampionId];
  }

  return { bansBlue, bansRed };
}

function buildChampionGridItems(filtered: Champion[]) {
  return filtered;
}

export default function DraftPage() {
  const params = useParams<{ seriesId: string }>();
  const router = useRouter();
  const seriesId = params?.seriesId ?? "";

  const {
    draftSave,
    series,
    setSeries,
    currentGame,
    currentStep,
    userSide,
    blueTeam,
    redTeam,
    unavailableChampionIds,
    blueLockedChampionIds,
    redLockedChampionIds,
    blueWins,
    redWins,
    isUserTurn,
    allPicksCompleted,
    canSwapRoles,
    readyDisabled,
    commitAction,
    swapRoles,
    finishCurrentGame,
  } = useDraftEngine(seriesId);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(null);
  const [openSwapRole, setOpenSwapRole] = useState<Role | null>(null);
  const swapMenuContainerRef = useRef<HTMLDivElement | null>(null);
  const [resultsGameNumber, setResultsGameNumber] = useState<number | null>(null);
  const [resultsSimulation, setResultsSimulation] = useState<DraftSimulationResult | null>(null);
  const [resultsSeriesFinished, setResultsSeriesFinished] = useState(false);

  useEffect(() => {
    if (!series || !currentGame || currentStep) return;
    if (!allPicksCompleted) return;
    if (
      Object.keys(currentGame.assignmentsBlue).length > 0 &&
      Object.keys(currentGame.assignmentsRed).length > 0
    ) {
      return;
    }

    setSeries((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        games: prev.games.map((game) =>
          game.number === currentGame.number
            ? resolveFinishedDraftAssignments(game, prev, draftSave)
            : game
        ),
      };
    });
  }, [series, currentGame, currentStep, allPicksCompleted, setSeries, draftSave]);

  useEffect(() => {
    if (!series || resultsGameNumber === null) return;

    const completedGame = series.games.find((game) => game.number === resultsGameNumber) ?? null;
    if (!completedGame?.completed || !completedGame.simulation) return;

    setResultsSimulation(completedGame.simulation);
    setResultsGameNumber(null);
  }, [series, resultsGameNumber]);

  function handleResultsPrimaryAction() {
    setResultsSimulation(null);

    if (resultsSeriesFinished) {
      router.push("/gameplay-dashboard");
      return;
    }
  }

  const filteredChampions = useMemo(() => {
    return [...champions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((champion) => championMatchesSearch(champion, search))
      .filter((champion) => {
        if (roleFilter === "all") return true;
        return champion.roles.includes(roleFilter);
      });
  }, [roleFilter, search]);

  const championGridItems = useMemo(
    () => buildChampionGridItems(filteredChampions),
    [filteredChampions]
  );

  function handleChampionClick(championId: string) {
    if (!isUserTurn || !currentStep) return;
    if (unavailableChampionIds.has(championId)) return;
    setSelectedChampionId((prev) => (prev === championId ? null : championId));
  }

  function handleLockIn() {
    if (!isUserTurn || !currentStep || !selectedChampionId) return;
    if (unavailableChampionIds.has(selectedChampionId)) return;

    commitAction(selectedChampionId, currentStep.side, currentStep.action);
    setSelectedChampionId(null);
    setOpenSwapRole(null);
  }

  function handleReady() {
    if (!currentGame || !series) return;

    const completedGameNumber = currentGame.number;
    const resolvedGame = resolveFinishedDraftAssignments(currentGame, series, draftSave);

    flushSync(() => {
      setSeries((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          games: prev.games.map((game) =>
            game.number === resolvedGame.number ? resolvedGame : game
          ),
        };
      });
    });

    const result = finishCurrentGame();

    setSelectedChampionId(null);
    setOpenSwapRole(null);
    setResultsSeriesFinished(result === "series-finished");
    setResultsGameNumber(completedGameNumber);
  }

  function handleExitDraft() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("rift-active-series-draft");
    }
    router.push("/gameplay-dashboard");
  }

  function handleFilterToggle(nextFilter: Role | "all") {
    setRoleFilter((prev) => {
      if (nextFilter === "all") return "all";
      return prev === nextFilter ? "all" : nextFilter;
    });
  }

  function handleSwapMenuToggle(role: Role) {
    if (!currentGame || !canSwapRoles) return;

    const userAssignments =
      userSide === "blue"
        ? getDisplayAssignments(currentGame.assignmentsBlue, currentGame.picksBlue)
        : getDisplayAssignments(currentGame.assignmentsRed, currentGame.picksRed);

    if (!userAssignments[role]) return;
    setOpenSwapRole((prev) => (prev === role ? null : role));
  }

  function handleRoleSwap(sourceRole: Role, targetRole: Role) {
    if (!canSwapRoles) return;
    if (sourceRole === targetRole) return;
    swapRoles(userSide, sourceRole, targetRole);
    setOpenSwapRole(null);
  }

  useEffect(() => {
    if (!openSwapRole) return;

    function handlePointerDown(event: MouseEvent) {
      const container = swapMenuContainerRef.current;
      if (!container) return;
      if (container.contains(event.target as Node)) return;
      setOpenSwapRole(null);
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [openSwapRole]);

  if (!series || !currentGame || !blueTeam || !redTeam) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]">
        <p className="body text-[var(--text-secondary)]">Loading draft...</p>
      </main>
    );
  }

  const currentAssignmentsBlue = getDisplayAssignments(
    currentGame.assignmentsBlue,
    currentGame.picksBlue
  );
  const currentAssignmentsRed = getDisplayAssignments(
    currentGame.assignmentsRed,
    currentGame.picksRed
  );

  const previewAssignmentsBlue =
    selectedChampionId &&
    isUserTurn &&
    currentStep?.action === "pick" &&
    currentStep.side === "blue"
      ? assignChampionToRoleMap(currentAssignmentsBlue, selectedChampionId)
      : currentAssignmentsBlue;

  const previewAssignmentsRed =
    selectedChampionId &&
    isUserTurn &&
    currentStep?.action === "pick" &&
    currentStep.side === "red"
      ? assignChampionToRoleMap(currentAssignmentsRed, selectedChampionId)
      : currentAssignmentsRed;

  const previewBans = getPreviewBans(
    currentGame,
    currentStep,
    selectedChampionId,
    userSide,
    isUserTurn
  );

  const activeTeamAbbr =
    currentStep?.side === "blue" ? blueTeam.abbreviation : redTeam.abbreviation;

  const title = currentStep
    ? `${activeTeamAbbr}'s ${currentStep.action === "ban" ? "Ban" : "Pick"} ${currentStep.label.replace(/[BR]/g, "")}`
    : "Draft Complete";

  return (
    <main className="min-h-screen bg-[var(--bg-main)] py-[20px] text-[var(--text-primary)]">
      <div className="mx-auto flex max-w-[1440px] items-start">
        <SidebarPanel
          side="blue"
          team={blueTeam}
          score={blueWins}
          bans={previewBans.bansBlue}
          assignments={previewAssignmentsBlue}
          showSwap={canSwapRoles && userSide === "blue"}
          openSwapRole={userSide === "blue" ? openSwapRole : null}
          onSwapToggle={handleSwapMenuToggle}
          onSwapSelect={handleRoleSwap}
          swapMenuContainerRef={userSide === "blue" ? swapMenuContainerRef : null}
          lockedChampionIds={blueLockedChampionIds}
          roster={getTeamRosterFromSources({ team: blueTeam, save: draftSave })}
        />

        <section className="min-w-0 flex-1">
          <div className="flex min-h-[calc(100vh-40px)] flex-col">
            <div
              className="sticky top-0 z-40"
              style={{
                background: "var(--bg-main) ",
              }}
            >
              <div className="flex items-center justify-between px-[18px] py-[10px]">
                <Button variant="text" onClick={handleExitDraft}>
                  EXIT DRAFT
                </Button>

                <h3 className="h3 flex-1 px-[16px] text-center text-[var(--text-primary)]">
                  {title}
                </h3>

                <div className="body-small w-[68px] text-right text-[var(--text-secondary)]">
                  Bo{series.bo}
                </div>
              </div>

              <div className="flex items-center justify-between px-[18px] pt-[6px] pb-[24px]">
                <div className="flex items-center gap-[14px]">
                  {FILTERS.map((filterItem) => {
                    const isActive =
                      (filterItem.key === "all" && roleFilter === "all") ||
                      roleFilter === filterItem.key;

                    return (
                      <button
                        key={filterItem.key}
                        type="button"
                        onClick={() => handleFilterToggle(filterItem.key)}
                        className="flex h-[32px] w-[32px] shrink-0 items-center justify-center transition-opacity duration-200"
                        style={{ opacity: isActive ? 1 : 0.35 }}
                        aria-label={filterItem.label}
                      >
                        <Image
                          src={filterItem.icon}
                          alt={filterItem.label}
                          width={32}
                          height={32}
                          className="block h-[32px] w-[32px] object-contain"
                        />
                      </button>
                    );
                  })}
                </div>

                <div
                  className="flex w-[204px] items-center gap-[8px] rounded-[4px] border px-[12px] py-[8px]"
                  style={{ borderColor: "var(--border-default)" }}
                >
                  <Image
                    src="/svg/search.svg"
                    alt="search"
                    width={16}
                    height={16}
                    className="block h-[16px] w-[16px] shrink-0 object-contain"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="SEARCH"
                    className="body-small w-full bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 px-[18px] pb-[120px]">
              <ChampionGrid
                champions={championGridItems}
                selectedChampionId={selectedChampionId}
                unavailableChampionIds={unavailableChampionIds}
                isUserTurn={isUserTurn}
                onChampionClick={handleChampionClick}
              />
            </div>

            <div className="sticky bottom-0 z-20 px-[18px] pt-[8px]">
              <div
                className="flex justify-center border-t px-[8px] pt-[16px] pb-[16px] backdrop-blur-[10px]"
                style={{
                  borderColor: "var(--border-divider)",
                  background: "var(--bg-main)",
                }}
              >
                <Button
                  onClick={currentStep ? handleLockIn : handleReady}
                  disabled={
                    currentStep
                      ? !isUserTurn ||
                        !selectedChampionId ||
                        unavailableChampionIds.has(selectedChampionId)
                      : readyDisabled
                  }
                  className="min-w-[126px] !rounded-[14px] !px-[24px] !py-[12px]"
                >
                  {currentStep ? "LOCK IN" : "DRAFT READY"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <SidebarPanel
          side="red"
          team={redTeam}
          score={redWins}
          bans={previewBans.bansRed}
          assignments={previewAssignmentsRed}
          showSwap={canSwapRoles && userSide === "red"}
          openSwapRole={userSide === "red" ? openSwapRole : null}
          onSwapToggle={handleSwapMenuToggle}
          onSwapSelect={handleRoleSwap}
          swapMenuContainerRef={userSide === "red" ? swapMenuContainerRef : null}
          lockedChampionIds={redLockedChampionIds}
          roster={getTeamRosterFromSources({ team: redTeam, save: draftSave })}
          alignRight
        />
      </div>

      <MatchResultsDialog
        open={Boolean(resultsSimulation)}
        simulation={resultsSimulation}
        onPrimaryAction={handleResultsPrimaryAction}
        primaryLabel={resultsSeriesFinished ? "BACK TO DASHBOARD" : "GO NEXT GAME"}
      />
    </main>
  );
}

function SidebarPanel({
  side,
  team,
  score,
  bans,
  assignments,
  showSwap,
  openSwapRole,
  onSwapToggle,
  onSwapSelect,
  swapMenuContainerRef,
  lockedChampionIds,
  roster,
  alignRight = false,
}: {
  side: Side;
  team: {
    name: string;
    abbreviation: string;
    logo: string;
    slug?: string;
    roster?: Partial<Record<Role, string>>;
  };
  score: number;
  bans: string[];
  assignments: Partial<Record<Role, string>>;
  showSwap: boolean;
  openSwapRole: Role | null;
  onSwapToggle: (role: Role) => void;
  onSwapSelect: (sourceRole: Role, targetRole: Role) => void;
  swapMenuContainerRef?: { current: HTMLDivElement | null } | null;
  lockedChampionIds: string[];
  roster?: Partial<Record<Role, string>>;
  alignRight?: boolean;
}) {
  const orderedBans = alignRight ? [...bans].reverse() : bans;
  const visibleLockedRows = Math.ceil(lockedChampionIds.length / 5);
  const visibleLockedSlots = visibleLockedRows * 5;
  const lockedSlots = Array.from({ length: visibleLockedSlots }).map(
    (_, index) => lockedChampionIds[index] ?? null
  );
  const swapButtonRefs = useRef<Partial<Record<Role, HTMLButtonElement | null>>>({});
  const [swapMenuPosition, setSwapMenuPosition] = useState<{
    top: number;
    left?: number;
    right?: number;
  } | null>(null);

  useEffect(() => {
    if (!openSwapRole) {
      setSwapMenuPosition(null);
      return;
    }

    const updateSwapMenuPosition = () => {
      const button = swapButtonRefs.current[openSwapRole];
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const gap = 8;
      const menuWidth = 160;

      setSwapMenuPosition({
        top: rect.top,
        ...(alignRight
          ? { right: Math.max(window.innerWidth - rect.left + gap, gap) }
          : { left: rect.right + gap }),
      });
    };

    updateSwapMenuPosition();

    window.addEventListener("resize", updateSwapMenuPosition);
    window.addEventListener("scroll", updateSwapMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateSwapMenuPosition);
      window.removeEventListener("scroll", updateSwapMenuPosition, true);
    };
  }, [alignRight, openSwapRole]);

  return (
    <aside
      className="sticky top-0 z-30 h-screen w-[250px] shrink-0 self-start overflow-hidden pt-[2px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(5,10,20,0.98) 0%, rgba(5,10,20,0.96) 86%, rgba(5,10,20,0.82) 100%)",
      }}
    >
      <div className="flex h-full flex-col overflow-y-auto overflow-x-visible pb-[10px]">
        <div className={`flex items-center gap-[16px] ${alignRight ? "justify-end" : ""}`}>
          {!alignRight && (
            <div className="label text-[var(--text-primary)]">{team.abbreviation}</div>
          )}
          <div className="body-large text-[var(--text-primary)]">{score}</div>
          {alignRight && (
            <div className="label text-[var(--text-primary)]">{team.abbreviation}</div>
          )}
        </div>

        <div className="mt-[14px] border-t" style={{ borderColor: "var(--border-divider)" }} />

        <div className={`mt-[10px] grid grid-cols-5 gap-[4px] ${alignRight ? "justify-items-end" : ""}`}>
          {Array.from({ length: 5 }).map((_, index) => {
            const champion = orderedBans[index] ? getChampionById(orderedBans[index]) : null;
            return <MiniSquare key={`${side}-ban-${index}`} champion={champion} size={MINI_SLOT_SIZE} />;
          })}
        </div>

        <div className="mt-[12px]">
          <div className="flex flex-col gap-[12px] pb-[10px]">
            {ROLE_ORDER.map((role) => {
              const championId = assignments[role];
              const champion = championId ? getChampionById(championId) : null;
              const isSwapMenuOpen = openSwapRole === role;
              const swapTargets = ROLE_ORDER.filter((targetRole) => targetRole !== role);

              return (
                <div
                  key={`${side}-${role}`}
                  className={`relative flex items-start gap-[12px] ${alignRight ? "flex-row-reverse" : ""}`}
                  ref={isSwapMenuOpen ? swapMenuContainerRef ?? null : null}
                >
                  {showSwap && champion ? (
                    <div className={`relative shrink-0 ${alignRight ? "order-3" : "order-1"}`}>
                      <button
                        ref={(node) => {
                          swapButtonRefs.current[role] = node;
                        }}
                        type="button"
                        onClick={() => onSwapToggle(role)}
                        className="flex h-[24px] w-[24px] items-center justify-center"
                        aria-label={`Open swap menu for ${getRoleLabel(role)}`}
                      >
                        <Image
                          src="/svg/swap.svg"
                          alt="swap"
                          width={24}
                          height={24}
                          className="block h-[24px] w-[24px] object-contain"
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="h-[24px] w-[24px] shrink-0" />
                  )}

                  <div
                    className="relative shrink-0 overflow-hidden"
                    style={{
                      width: ROLE_CARD_SIZE,
                      height: ROLE_CARD_SIZE,
                      background: "rgba(255,255,255,0.2)",
                      outline: isSwapMenuOpen ? "1px solid var(--primary)" : "none",
                      outlineOffset: isSwapMenuOpen ? "2px" : "0px",
                    }}
                  >
                    <Image
                      src={champion?.image || "/pictures/champion-thumbnail-placeholder.png"}
                      alt={champion?.name ?? "placeholder"}
                      fill
                      sizes={`${ROLE_CARD_SIZE}px`}
                      className="object-cover"
                    />
                  </div>

                  <div className={`min-w-0 flex-1 ${alignRight ? "items-end text-right" : "items-start text-left"}`}>
                    <div className={`flex flex-col ${alignRight ? "items-end" : "items-start"}`}>
                      <div className="label text-[13px] text-[var(--text-primary)]">{getRoleLabel(role)}</div>
                      <div className="body-small mt-[4px] text-[var(--text-primary)]">
                        {roster?.[role] ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {lockedSlots.length > 0 && (
            <div
              className="mt-[18px] border-t pt-[10px]"
              style={{ borderColor: "var(--border-divider)" }}
            >
              <div className={`label text-[var(--text-primary)] ${alignRight ? "text-right" : ""}`}>
                LOCKED CHAMPIONS
              </div>

              <div className={`mt-[10px] grid grid-cols-5 gap-[4px] ${alignRight ? "justify-items-end" : ""}`}>
                {lockedSlots.map((championId, index) => {
                  const champion = championId ? getChampionById(championId) : null;
                  return (
                    <MiniSquare
                      key={`${side}-locked-${index}`}
                      champion={champion}
                      size={MINI_SLOT_SIZE}
                      opacity={champion ? 0.55 : 1}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {openSwapRole &&
        swapMenuPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={swapMenuContainerRef ?? null}
            className="fixed z-[120] flex w-[160px] flex-col whitespace-nowrap border bg-[var(--bg-elevated)] p-[10px]"
            style={{
              top: swapMenuPosition.top,
              left: swapMenuPosition.left,
              right: swapMenuPosition.right,
              borderColor: "var(--primary)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
            }}
          >
            {ROLE_ORDER.filter((targetRole) => targetRole !== openSwapRole).map((targetRole) => (
              <button
                key={`${side}-${openSwapRole}-${targetRole}`}
                type="button"
                onClick={() => onSwapSelect(openSwapRole, targetRole)}
                className="label flex min-h-[40px] items-center whitespace-nowrap px-[10px] text-left text-[13px] text-[var(--text-primary)] hover:text-[var(--primary)]"
              >
                {getSwapLabel(targetRole)}
              </button>
            ))}
          </div>,
          document.body
        )}
    </aside>
  );
}

function ChampionGrid({
  champions,
  selectedChampionId,
  unavailableChampionIds,
  isUserTurn,
  onChampionClick,
}: {
  champions: Champion[];
  selectedChampionId: string | null;
  unavailableChampionIds: Set<string>;
  isUserTurn: boolean;
  onChampionClick: (championId: string) => void;
}) {
  const gridWidth =
    CHAMPION_GRID_COLUMNS * CHAMPION_CARD_SIZE +
    (CHAMPION_GRID_COLUMNS - 1) * CHAMPION_CARD_GAP;

  return (
    <div
      className="grid items-start content-start justify-start"
      style={{
        width: gridWidth,
        gridTemplateColumns: `repeat(${CHAMPION_GRID_COLUMNS}, ${CHAMPION_CARD_SIZE}px)`,
        gap: CHAMPION_CARD_GAP,
      }}
    >
      {champions.map((champion) => {
        const isUnavailable = unavailableChampionIds.has(champion.id);
        const isSelected = selectedChampionId === champion.id;

        return (
          <button
            key={champion.id}
            type="button"
            onClick={() => onChampionClick(champion.id)}
            disabled={!isUserTurn || isUnavailable}
            className="flex flex-col items-center gap-[4px] text-center disabled:cursor-not-allowed"
            style={{
              width: CHAMPION_CARD_SIZE,
              filter: isUnavailable ? "grayscale(1)" : "none",
              opacity: isUnavailable ? 0.45 : 1,
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                width: CHAMPION_CARD_SIZE,
                height: CHAMPION_CARD_SIZE,
                outline: isSelected ? "1px solid var(--primary)" : "none",
                outlineOffset: isSelected ? "2px" : "0px",
                background: "rgba(255,255,255,0.2)",
              }}
            >
              <Image
                src={champion.image || "/pictures/champion-thumbnail-placeholder.png"}
                alt={champion.name}
                fill
                sizes={`${CHAMPION_CARD_SIZE}px`}
                className="object-cover"
              />
            </div>

            <div className="label w-full text-center leading-[1.05] text-[var(--text-primary)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
              {champion.name.toUpperCase()}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MiniSquare({
  champion,
  opacity = 1,
  size = 40,
}: {
  champion: Champion | null;
  opacity?: number;
  size?: number;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: size,
        height: size,
        opacity,
        background: "rgba(255,255,255,0.2)",
      }}
    >
      <Image
        src={champion?.image || "/pictures/champion-thumbnail-placeholder.png"}
        alt={champion?.name ?? "placeholder"}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}
