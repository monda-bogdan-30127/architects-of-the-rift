"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import { useDraftEngine } from "@/app/hooks/useDraftEngine";
import { resolveFinishedDraftAssignments } from "@/app/draft-engine/draftEngine";
import MatchResultsDialog from "@/components/ui/MatchResultsDialog";
import type { DraftGameState, DraftSave, DraftSimulationResult, DraftStep, Side } from "@/app/draft-engine/draftTypes";
import type { Champion, Role } from "@/app/types/champion";

const CHAMPION_CARD_SIZE = 86;
const CHAMPION_CARD_GAP = 5;
const CHAMPION_GRID_COLUMNS = 6;
const MINI_SLOT_SIZE = 34;

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];
const FILTERS: Array<{ key: Role | "all"; label: string; icon: string }> = [
  { key: "all", label: "ALL", icon: "/pictures/all-roles.png" },
  { key: "top", label: "TOP", icon: "/pictures/filter-tag.png" },
  { key: "jungle", label: "JG", icon: "/pictures/filter-tag-1.png" },
  { key: "mid", label: "MID", icon: "/pictures/filter-tag-2.png" },
  { key: "adc", label: "ADC", icon: "/pictures/filter-tag-3.png" },
  { key: "support", label: "SUP", icon: "/pictures/filter-tag-4.png" },
];

const ROLE_ICONS: Record<Role, string> = {
  top: "/pictures/filter-tag.png",
  jungle: "/pictures/filter-tag-1.png",
  mid: "/pictures/filter-tag-2.png",
  adc: "/pictures/filter-tag-3.png",
  support: "/pictures/filter-tag-4.png",
};

function getChampionById(id: string) {
  return champions.find((c) => c.id === id) ?? null;
}
function getPlayerNameById(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return players.find((p) => p.id === id)?.name;
}
function championMatchesSearch(champion: Champion, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return champion.name.toLowerCase().includes(q) || champion.id.toLowerCase().includes(q);
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

function getTeamRosterFromSources({ team, save }: { team: unknown; save: DraftSave | null }): Partial<Record<Role, string>> {
  if (!team || typeof team !== "object") return {};
  const typedTeam = team as { slug?: string; roster?: Partial<Record<Role, string>> };
  const teamSlug = typedTeam.slug ?? "";
  const baseRoster = typedTeam.roster && typeof typedTeam.roster === "object" ? typedTeam.roster : {};
  if (!save) return baseRoster;
  const updatedRoster = teamSlug ? save.updatedTeamRosters?.[teamSlug] : undefined;
  if (updatedRoster && typeof updatedRoster === "object") return updatedRoster;
  if (teamSlug && save.controlledTeamSlug === teamSlug && save.roster) return save.roster;
  return baseRoster;
}

function assignChampionToRoleMap(assignments: Partial<Record<Role, string>>, championId: string) {
  const next = { ...assignments };
  const firstOpenRole = ROLE_ORDER.find((role) => !next[role]);
  if (firstOpenRole) next[firstOpenRole] = championId;
  return next;
}

function buildAssignmentsFromPicks(picks: string[]) {
  let assignments: Partial<Record<Role, string>> = {};
  for (const championId of picks) assignments = assignChampionToRoleMap(assignments, championId);
  return assignments;
}

function getDisplayAssignments(savedAssignments: Partial<Record<Role, string>>, picks: string[]) {
  if (Object.keys(savedAssignments).length > 0) return savedAssignments;
  return buildAssignmentsFromPicks(picks);
}

function getPreviewBans(game: DraftGameState, currentStep: DraftStep | null, selectedChampionId: string | null, userSide: Side, isUserTurn: boolean) {
  let bansBlue = [...game.bansBlue];
  let bansRed = [...game.bansRed];
  if (currentStep && selectedChampionId && isUserTurn && currentStep.action === "ban") {
    if (userSide === "blue") bansBlue = [...bansBlue, selectedChampionId];
    if (userSide === "red") bansRed = [...bansRed, selectedChampionId];
  }
  return { bansBlue, bansRed };
}

// ─── Draft-specific scoped styles ─────────────────────────────────────────────
// Only styles that can't be expressed with existing globals.css classes.
const DRAFT_STYLES = `
  .draft-pick-slot {
    position: relative;
    overflow: hidden;
    clip-path: polygon(0 0, 94% 0, 100% 6%, 100% 100%, 0 100%);
    transition: box-shadow 0.2s ease;
  }
  .draft-pick-slot-right {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 6% 100%, 0 94%);
  }
  .draft-pick-slot-active {
    box-shadow: 0 0 0 1px var(--primary), 0 0 14px rgba(16,228,249,0.25);
  }
  .draft-champ-btn {
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .draft-champ-btn:not(:disabled):hover .draft-champ-img {
    filter: brightness(1.18);
    transform: scale(1.03);
  }
  .draft-champ-btn:disabled {
    cursor: not-allowed;
  }
  .draft-champ-img {
    transition: filter 0.12s ease, transform 0.12s ease;
  }
  .draft-ban-active {
    box-shadow: 0 0 0 1px var(--danger), 0 0 8px rgba(239,68,68,0.3);
  }
  .draft-lock-btn {
    background: var(--primary);
    color: var(--bg-main);
    font-family: "Spiegel", sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    border: none;
    padding: 11px 44px;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    cursor: pointer;
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }
  .draft-lock-btn:hover:not(:disabled) {
    background: var(--primary-hover);
    box-shadow: 0 0 20px rgba(16,228,249,0.35);
  }
  .draft-lock-btn:disabled {
    background: var(--bg-elevated);
    color: var(--text-muted);
    box-shadow: none;
    cursor: not-allowed;
  }
  .draft-ready-btn {
    background: transparent;
    color: var(--primary);
    font-family: "Spiegel", sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    border: 1px solid var(--primary);
    padding: 11px 36px;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    cursor: pointer;
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }
  .draft-ready-btn:hover:not(:disabled) {
    background: rgba(16,228,249,0.08);
    box-shadow: 0 0 14px rgba(16,228,249,0.2);
  }
  .draft-ready-btn:disabled {
    border-color: var(--border-default);
    color: var(--text-muted);
    box-shadow: none;
    cursor: not-allowed;
  }
  .draft-scroll::-webkit-scrollbar { width: 3px; }
  .draft-scroll::-webkit-scrollbar-track { background: transparent; }
  .draft-scroll::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 2px; }
  .draft-filter-btn { transition: opacity 0.15s ease, filter 0.15s ease; }
  .draft-filter-btn:hover { opacity: 0.85 !important; }
  @keyframes draft-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .draft-picking-pulse { animation: draft-pulse 1.4s ease-in-out infinite; }

  @keyframes draft-side-glow {
    0%, 100% { box-shadow: inset 0 0 20px rgba(16,228,249,0.04); }
    50%      { box-shadow: inset 0 0 30px rgba(16,228,249,0.10); }
  }
  .draft-active-side {
    animation: draft-side-glow 2.4s ease-in-out infinite;
  }
`;

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DraftPage() {
  const params = useParams<{ seriesId: string }>();
  const router = useRouter();
  const seriesId = params?.seriesId ?? "";

  const {
    draftSave, series, setSeries, currentGame, currentStep,
    userSide, blueTeam, redTeam, unavailableChampionIds,
    blueLockedChampionIds, redLockedChampionIds,
    blueWins, redWins, isUserTurn, allPicksCompleted,
    canSwapRoles, readyDisabled, commitAction, swapRoles, finishCurrentGame,
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
    if (!series || !currentGame || currentStep || !allPicksCompleted) return;
    if (Object.keys(currentGame.assignmentsBlue).length > 0 && Object.keys(currentGame.assignmentsRed).length > 0) return;
    setSeries((prev) => {
      if (!prev) return prev;
      return { ...prev, games: prev.games.map((g) => g.number === currentGame.number ? resolveFinishedDraftAssignments(g, prev, draftSave) : g) };
    });
  }, [series, currentGame, currentStep, allPicksCompleted, setSeries, draftSave]);

  useEffect(() => {
    if (!series || resultsGameNumber === null) return;
    const completedGame = series.games.find((g) => g.number === resultsGameNumber) ?? null;
    if (!completedGame?.completed || !completedGame.simulation) return;
    setResultsSimulation(completedGame.simulation);
    setResultsGameNumber(null);
  }, [series, resultsGameNumber]);

  const filteredChampions = useMemo(() =>
    [...champions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((c) => championMatchesSearch(c, search))
      .filter((c) => roleFilter === "all" ? true : c.roles.includes(roleFilter)),
    [roleFilter, search]
  );

  function handleChampionClick(championId: string) {
    if (!isUserTurn || !currentStep || unavailableChampionIds.has(championId)) return;
    setSelectedChampionId((prev) => (prev === championId ? null : championId));
  }

  function handleLockIn() {
    if (!isUserTurn || !currentStep || !selectedChampionId || unavailableChampionIds.has(selectedChampionId)) return;
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
        return { ...prev, games: prev.games.map((g) => g.number === resolvedGame.number ? resolvedGame : g) };
      });
    });
    const result = finishCurrentGame();
    setSelectedChampionId(null);
    setOpenSwapRole(null);
    setResultsSeriesFinished(result === "series-finished");
    setResultsGameNumber(completedGameNumber);
  }

  function handleExitDraft() {
    if (typeof window !== "undefined") window.localStorage.removeItem("rift-active-series-draft");
    router.push("/gameplay-dashboard");
  }

  function handleFilterToggle(nextFilter: Role | "all") {
    setRoleFilter((prev) => nextFilter === "all" ? "all" : prev === nextFilter ? "all" : nextFilter);
  }

  function handleSwapMenuToggle(role: Role) {
    if (!currentGame || !canSwapRoles) return;
    const ua = userSide === "blue"
      ? getDisplayAssignments(currentGame.assignmentsBlue, currentGame.picksBlue)
      : getDisplayAssignments(currentGame.assignmentsRed, currentGame.picksRed);
    if (!ua[role]) return;
    setOpenSwapRole((prev) => (prev === role ? null : role));
  }

  function handleRoleSwap(sourceRole: Role, targetRole: Role) {
    if (!canSwapRoles || sourceRole === targetRole) return;
    swapRoles(userSide, sourceRole, targetRole);
    setOpenSwapRole(null);
  }

  useEffect(() => {
    if (!openSwapRole) return;
    function handlePointerDown(e: MouseEvent) {
      const container = swapMenuContainerRef.current;
      if (!container || container.contains(e.target as Node)) return;
      setOpenSwapRole(null);
    }
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [openSwapRole]);

  if (!series || !currentGame || !blueTeam || !redTeam) {
    return (
      <main style={{ minHeight: "100dvh", background: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{DRAFT_STYLES}</style>
        <p className="label" style={{ color: "var(--text-muted)" }}>LOADING DRAFT...</p>
      </main>
    );
  }

  const currentAssignmentsBlue = getDisplayAssignments(currentGame.assignmentsBlue, currentGame.picksBlue);
  const currentAssignmentsRed = getDisplayAssignments(currentGame.assignmentsRed, currentGame.picksRed);

  const previewAssignmentsBlue = selectedChampionId && isUserTurn && currentStep?.action === "pick" && currentStep.side === "blue"
    ? assignChampionToRoleMap(currentAssignmentsBlue, selectedChampionId)
    : currentAssignmentsBlue;

  const previewAssignmentsRed = selectedChampionId && isUserTurn && currentStep?.action === "pick" && currentStep.side === "red"
    ? assignChampionToRoleMap(currentAssignmentsRed, selectedChampionId)
    : currentAssignmentsRed;

  const previewBans = getPreviewBans(currentGame, currentStep, selectedChampionId, userSide, isUserTurn);

  const activeTeamAbbr = currentStep?.side === "blue" ? blueTeam.abbreviation : redTeam.abbreviation;
  const title = currentStep
    ? `${activeTeamAbbr}'s ${currentStep.action === "ban" ? "Ban" : "Pick"} ${currentStep.label.replace(/[BR]/g, "")}`
    : "Draft Complete";

  return (
    <main style={{ minHeight: "100dvh", height: "100dvh", background: "var(--bg-main)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{DRAFT_STYLES}</style>

      {/* ── TOP HEADER — bans + title ── */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px 8px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--divider)",
        flexShrink: 0,
        gap: "12px",
      }}>
        {/* Blue bans */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const chamId = previewBans.bansBlue[i];
            const cham = chamId ? getChampionById(chamId) : null;
            const isActive = isUserTurn && currentStep?.action === "ban" && currentStep.side === "blue" && i === previewBans.bansBlue.length;
            return <BanSlot key={`bb-${i}`} champion={cham} isActive={isActive} size={MINI_SLOT_SIZE} />;
          })}
        </div>

        {/* Center title */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <h3 className="h3" style={{ color: "var(--text-primary)", marginBottom: "2px" }}>{title}</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <span className="body-small" style={{ color: "var(--text-muted)" }}>Bo{series.bo}</span>
            <button
              type="button"
              onClick={handleExitDraft}
              className="button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontFamily: "inherit",
                transition: "color 0.15s",
                padding: "2px 6px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              EXIT DRAFT
            </button>
          </div>
        </div>

        {/* Red bans */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center", flexDirection: "row-reverse" }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const chamId = previewBans.bansRed[i];
            const cham = chamId ? getChampionById(chamId) : null;
            const isActive = isUserTurn && currentStep?.action === "ban" && currentStep.side === "red" && i === previewBans.bansRed.length;
            return <BanSlot key={`br-${i}`} champion={cham} isActive={isActive} size={MINI_SLOT_SIZE} />;
          })}
        </div>
      </header>

      {/* ── MAIN ROW — sidebars + grid ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Blue sidebar */}
        <SidebarPanel
          side="blue"
          team={blueTeam}
          score={blueWins}
          assignments={previewAssignmentsBlue}
          showSwap={canSwapRoles && userSide === "blue"}
          openSwapRole={userSide === "blue" ? openSwapRole : null}
          onSwapToggle={handleSwapMenuToggle}
          onSwapSelect={handleRoleSwap}
          swapMenuContainerRef={userSide === "blue" ? swapMenuContainerRef : null}
          lockedChampionIds={blueLockedChampionIds}
          roster={getTeamRosterFromSources({ team: blueTeam, save: draftSave })}
          currentStep={currentStep}
          isUserTurn={isUserTurn}
        />

        <div style={{ width: "1px", background: "var(--divider)", flexShrink: 0 }} />

        {/* Center section */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Filters */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px 6px",
            borderBottom: "1px solid var(--divider)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {FILTERS.map((f) => {
                const isActive = (f.key === "all" && roleFilter === "all") || roleFilter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => handleFilterToggle(f.key)}
                    className="draft-filter-btn"
                    style={{
                      width: "26px",
                      height: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      opacity: isActive ? 1 : 0.3,
                      filter: isActive ? "drop-shadow(0 0 5px rgba(16,228,249,0.45))" : "none",
                      padding: 0,
                      transition: "opacity 0.15s ease, filter 0.15s ease",
                    }}
                    aria-label={f.label}
                  >
                    <Image src={f.icon} alt={f.label} width={22} height={22} style={{ objectFit: "contain" }} />
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              padding: "5px 10px",
              width: "172px",
            }}>
              <Image src="/svg/search.svg" alt="search" width={13} height={13} style={{ opacity: 0.45, flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH"
                className="body-small"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  color: "var(--text-primary)",
                  fontFamily: '"Spiegel", sans-serif',
                }}
              />
            </div>
          </div>

          {/* Champion grid */}
          <div className="draft-scroll" style={{ flex: 1, overflowY: "auto", padding: "10px 14px 14px" }}>
            <ChampionGrid
              champions={filteredChampions}
              selectedChampionId={selectedChampionId}
              unavailableChampionIds={unavailableChampionIds}
              isUserTurn={isUserTurn}
              onChampionClick={handleChampionClick}
            />
          </div>

          {/* Action bar */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 14px 12px",
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--divider)",
            flexShrink: 0,
          }}>
            {currentStep ? (
              <button
                type="button"
                className="draft-lock-btn"
                onClick={handleLockIn}
                disabled={!isUserTurn || !selectedChampionId || (!!selectedChampionId && unavailableChampionIds.has(selectedChampionId))}
              >
                LOCK IN
              </button>
            ) : (
              <button
                type="button"
                className="draft-ready-btn"
                onClick={handleReady}
                disabled={readyDisabled}
              >
                DRAFT READY
              </button>
            )}
          </div>
        </section>

        <div style={{ width: "1px", background: "var(--divider)", flexShrink: 0 }} />

        {/* Red sidebar */}
        <SidebarPanel
          side="red"
          team={redTeam}
          score={redWins}
          assignments={previewAssignmentsRed}
          showSwap={canSwapRoles && userSide === "red"}
          openSwapRole={userSide === "red" ? openSwapRole : null}
          onSwapToggle={handleSwapMenuToggle}
          onSwapSelect={handleRoleSwap}
          swapMenuContainerRef={userSide === "red" ? swapMenuContainerRef : null}
          lockedChampionIds={redLockedChampionIds}
          roster={getTeamRosterFromSources({ team: redTeam, save: draftSave })}
          currentStep={currentStep}
          isUserTurn={isUserTurn}
          alignRight
        />
      </div>

      <MatchResultsDialog
        open={Boolean(resultsSimulation)}
        simulation={resultsSimulation}
        onPrimaryAction={() => { setResultsSimulation(null); if (resultsSeriesFinished) router.push("/gameplay-dashboard"); }}
        primaryLabel={resultsSeriesFinished ? "BACK TO DASHBOARD" : "GO NEXT GAME"}
        isSeriesComplete={resultsSeriesFinished}
        seriesMvpName={
          resultsSeriesFinished
            ? getPlayerNameById(
                (resultsSimulation as DraftSimulationResult & { seriesMvpPlayerId?: string | null })
                  ?.seriesMvpPlayerId ?? null
              )
            : undefined
        }
      />
    </main>
  );
}

// ─── Ban slot ──────────────────────────────────────────────────────────────────
function BanSlot({ champion, isActive, size }: { champion: Champion | null; isActive: boolean; size: number }) {
  return (
    <div
      className={isActive ? "draft-ban-active" : ""}
      style={{
        width: size,
        height: size,
        background: champion ? "transparent" : "var(--bg-elevated)",
        border: champion ? "none" : "1px solid var(--border-default)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {champion && (
        <>
          <Image src={champion.image || "/pictures/champion-thumbnail-placeholder.png"} alt={champion.name} fill sizes={`${size}px`} style={{ objectFit: "cover", filter: "grayscale(0.5) brightness(0.55)" }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(239,68,68,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width={size * 0.38} height={size * 0.38} viewBox="0 0 14 14" fill="none">
              <line x1="2" y1="2" x2="12" y2="12" stroke="rgba(239,68,68,0.95)" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="2" x2="2" y2="12" stroke="rgba(239,68,68,0.95)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sidebar Panel ─────────────────────────────────────────────────────────────
function SidebarPanel({
  side, team, score, assignments, showSwap, openSwapRole,
  onSwapToggle, onSwapSelect, swapMenuContainerRef,
  lockedChampionIds, roster, currentStep, isUserTurn, alignRight = false,
}: {
  side: Side;
  team: { name: string; abbreviation: string; logo: string; slug?: string };
  score: number;
  assignments: Partial<Record<Role, string>>;
  showSwap: boolean;
  openSwapRole: Role | null;
  onSwapToggle: (role: Role) => void;
  onSwapSelect: (sourceRole: Role, targetRole: Role) => void;
  swapMenuContainerRef?: { current: HTMLDivElement | null } | null;
  lockedChampionIds: string[];
  roster?: Partial<Record<Role, string>>;
  currentStep?: DraftStep | null;
  isUserTurn?: boolean;
  alignRight?: boolean;
}) {
  const swapButtonRefs = useRef<Partial<Record<Role, HTMLButtonElement | null>>>({});
  const [swapMenuPosition, setSwapMenuPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);

  useEffect(() => {
    if (!openSwapRole) { setSwapMenuPosition(null); return; }
    const update = () => {
      const btn = swapButtonRefs.current[openSwapRole];
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      setSwapMenuPosition({
        top: rect.top,
        ...(alignRight ? { right: Math.max(window.innerWidth - rect.left + 8, 8) } : { left: rect.right + 8 }),
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [alignRight, openSwapRole]);

  // Which role slot is currently being filled
  const currentPickRole = (() => {
    if (!currentStep || currentStep.action !== "pick" || currentStep.side !== side) return null;
    return ROLE_ORDER.find((role) => !assignments[role]) ?? null;
  })();

  const isActiveTeam = currentStep?.side === side;

  return (
    <aside
      className={isActiveTeam ? "draft-active-side" : ""}
      style={{
      width: 240,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--bg-surface)",
      borderRight: !alignRight ? "none" : undefined,
      padding: "12px 10px 10px",
      overflow: "hidden",
      transition: "box-shadow 0.4s ease",
    }}>

      {/* Team header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexDirection: alignRight ? "row-reverse" : "row",
        marginBottom: "8px",
        padding: "0 2px",
      }}>
        {team.logo && (
          <Image src={team.logo} alt={team.name} width={26} height={26} style={{ objectFit: "contain", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          <div
            className="label"
            style={{
              color: isActiveTeam ? "var(--primary)" : "var(--text-highlight)",
              textAlign: alignRight ? "right" : "left",
              transition: "color 0.2s",
            }}
          >
            {team.abbreviation}
          </div>
          <div
            className="body-small"
            style={{ color: "var(--text-muted)", textAlign: alignRight ? "right" : "left", fontSize: "12px" }}
          >
            {score} WIN{score !== 1 ? "S" : ""}
          </div>
        </div>
      </div>

      {/* Thin accent line */}
      <div style={{
        height: "1px",
        background: isActiveTeam
          ? "linear-gradient(" + (alignRight ? "270deg" : "90deg") + ", var(--primary), transparent)"
          : "var(--divider)",
        marginBottom: "10px",
        transition: "background 0.3s",
      }} />

      {/* Pick rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1, overflow: "hidden" }}>
        {ROLE_ORDER.map((role) => {
          const championId = assignments[role];
          const champion = championId ? getChampionById(championId) : null;
          const isCurrentSlot = currentPickRole === role;
          const isSwapOpen = openSwapRole === role;

          return (
            <div
              key={`${side}-${role}`}
              ref={isSwapOpen ? (swapMenuContainerRef as React.RefObject<HTMLDivElement> | null) ?? null : null}
              style={{
                display: "flex",
                alignItems: "stretch",
                flexDirection: alignRight ? "row-reverse" : "row",
                gap: "5px",
              }}
            >
              {/* Swap button */}
              {showSwap && champion ? (
                <button
                  ref={(node) => { swapButtonRefs.current[role] = node; }}
                  type="button"
                  onClick={() => onSwapToggle(role)}
                  style={{
                    width: "18px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: isSwapOpen ? 1 : 0.45,
                    transition: "opacity 0.15s",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = isSwapOpen ? "1" : "0.45")}
                >
                  <Image src="/svg/swap.svg" alt="swap" width={13} height={13} style={{ objectFit: "contain" }} />
                </button>
              ) : (
                <div style={{ width: "18px", flexShrink: 0 }} />
              )}

              {/* Pick card */}
              <div
                className={`draft-pick-slot ${alignRight ? "draft-pick-slot-right" : ""}`}
                style={{
                  flex: 1,
                  height: "64px",
                  display: "flex",
                  flexDirection: alignRight ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--bg-elevated)",
                  border: `1px solid ${champion ? "var(--border-default)" : "var(--divider)"}`,
                  opacity: champion ? 1 : 0.7,
                  padding: "0 8px",
                  overflow: "hidden",
                }}
              >
                {/* Square champion image */}
                <div style={{
                  width: "52px",
                  height: "52px",
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "3px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                }}>
                  {champion ? (
                    <Image
                      src={champion.image || "/pictures/champion-thumbnail-placeholder.png"}
                      alt={champion.name}
                      fill
                      sizes="52px"
                      style={{ objectFit: "cover", objectPosition: "50% 15%" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Image
                        src={ROLE_ICONS[role]}
                        alt={getRoleLabel(role)}
                        width={18}
                        height={18}
                        style={{ objectFit: "contain", opacity: 0.2 }}
                      />
                    </div>
                  )}
                </div>

                {/* Role + name text */}
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  overflow: "hidden",
                  textAlign: alignRight ? "right" : "left",
                }}>
                  {/* Role label */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", flexDirection: alignRight ? "row-reverse" : "row" }}>
                    <Image src={ROLE_ICONS[role]} alt={getRoleLabel(role)} width={10} height={10} style={{ objectFit: "contain", opacity: 0.5, flexShrink: 0 }} />
                    <span style={{
                      fontSize: "8px",
                      fontFamily: '"Spiegel", sans-serif',
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}>
                      {getRoleLabel(role)}
                    </span>
                  </div>

                  {/* Player name */}
                  <span style={{
                    fontSize: "11px",
                    fontFamily: '"Spiegel", sans-serif',
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: champion ? "var(--text-primary)" : roster?.[role] ? "var(--text-secondary)" : "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textTransform: "uppercase",
                  }}>
                    {roster?.[role] ? roster[role] : "—"}
                  </span>

                  {/* Champion name — shown only after pick */}
                  {champion && (
                    <span style={{
                      fontSize: "9px",
                      fontFamily: '"Spiegel", sans-serif',
                      fontWeight: 500,
                      letterSpacing: "0.03em",
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textTransform: "uppercase",
                    }}>
                      {champion.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked champions */}
      {lockedChampionIds.length > 0 && (
        <div style={{ marginTop: "10px", borderTop: "1px solid var(--divider)", paddingTop: "8px" }}>
          <div className="label" style={{ color: "var(--text-muted)", fontSize: "9px", marginBottom: "5px", textAlign: alignRight ? "right" : "left" }}>
            LOCKED
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", justifyContent: alignRight ? "flex-end" : "flex-start" }}>
            {lockedChampionIds.map((chamId, i) => {
              const cham = chamId ? getChampionById(chamId) : null;
              return (
                <div key={i} style={{
                  width: MINI_SLOT_SIZE,
                  height: MINI_SLOT_SIZE,
                  position: "relative",
                  overflow: "hidden",
                  opacity: 0.45,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                }}>
                  {cham && <Image src={cham.image} alt={cham.name} fill sizes={`${MINI_SLOT_SIZE}px`} style={{ objectFit: "cover" }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Swap portal */}
      {openSwapRole && swapMenuPosition && typeof document !== "undefined" && createPortal(
        <div
          ref={swapMenuContainerRef ?? null}
          style={{
            position: "fixed",
            zIndex: 120,
            top: swapMenuPosition.top,
            left: swapMenuPosition.left,
            right: swapMenuPosition.right,
            width: "152px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--primary)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
            padding: "6px",
          }}
        >
          {ROLE_ORDER.filter((r) => r !== openSwapRole).map((targetRole) => (
            <button
              key={`${side}-${openSwapRole}-${targetRole}`}
              type="button"
              onClick={() => onSwapSelect(openSwapRole, targetRole)}
              className="button"
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                color: "var(--text-secondary)",
                fontFamily: '"Spiegel", sans-serif',
                transition: "color 0.1s, background 0.1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "none"; }}
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

// ─── Champion Grid ─────────────────────────────────────────────────────────────
function ChampionGrid({
  champions, selectedChampionId, unavailableChampionIds, isUserTurn, onChampionClick,
}: {
  champions: Champion[];
  selectedChampionId: string | null;
  unavailableChampionIds: Set<string>;
  isUserTurn: boolean;
  onChampionClick: (id: string) => void;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${CHAMPION_GRID_COLUMNS}, ${CHAMPION_CARD_SIZE}px)`,
      gap: CHAMPION_CARD_GAP,
    }}>
      {champions.map((champion) => {
        const isUnavailable = unavailableChampionIds.has(champion.id);
        const isSelected = selectedChampionId === champion.id;

        return (
          <button
            key={champion.id}
            type="button"
            onClick={() => onChampionClick(champion.id)}
            disabled={!isUserTurn || isUnavailable}
            className="draft-champ-btn"
            style={{
              width: CHAMPION_CARD_SIZE,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              background: "none",
              border: "none",
              padding: 0,
              filter: isUnavailable ? "grayscale(1)" : "none",
              opacity: isUnavailable ? 0.3 : 1,
            }}
          >
            <div style={{
              width: CHAMPION_CARD_SIZE,
              height: CHAMPION_CARD_SIZE,
              position: "relative",
              overflow: "hidden",
              background: "var(--bg-elevated)",
              outline: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-default)",
              outlineOffset: isSelected ? "-1px" : "0px",
              boxShadow: isSelected ? "0 0 12px rgba(16,228,249,0.3)" : "none",
              transition: "outline 0.12s, box-shadow 0.12s",
            }}>
              <Image
                src={champion.image || "/pictures/champion-thumbnail-placeholder.png"}
                alt={champion.name}
                fill
                sizes={`${CHAMPION_CARD_SIZE}px`}
                className="draft-champ-img"
                style={{ objectFit: "cover" }}
              />
              {isSelected && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(16,228,249,0.1)",
                  pointerEvents: "none",
                }} />
              )}
            </div>
            <div
              className="tooltip"
              style={{
                width: CHAMPION_CARD_SIZE,
                textAlign: "center",
                color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "9px",
                letterSpacing: "0.06em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                padding: "0 2px",
                transition: "color 0.12s",
                fontFamily: '"Spiegel", sans-serif',
                textTransform: "uppercase",
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {champion.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}