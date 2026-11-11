"use client";

import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { teams } from "@/app/data/teams";
import type { DraftPillarReport, DraftSimulationResult, PillarGrade, Side } from "@/app/draft-engine/draftTypes";
import { DRAFT_SCORE_TOOLTIP, PILLAR_LABELS, describeDraftScore } from "@/app/draft-engine/draftDecisionExplainer";
import { OUTCOME_BAR_FULL, OUTCOME_FACTOR_TOOLTIPS, explainOutcome, formatEdge } from "@/app/draft-engine/outcomeExplainer";
import PlayerResultRow from "./PlayerResultRow";

const teamsBySlug = new Map(teams.map((team) => [team.slug, team]));

function getTeamLabel(teamSlug: string) {
  const team = teamsBySlug.get(teamSlug);
  const name = team?.name ?? teamSlug;
  return { name, abbreviation: team?.abbreviation ?? name };
}

/** Sub atâta din numele complet vizibil (cu ellipsis), afișăm abrevierea. */
const MIN_VISIBLE_NAME_RATIO = 0.6;

/**
 * Titlul unei echipe: numele se taie cu ellipsis (tooltip cu numele complet), scorul nu se taie
 * niciodată. Dacă nici cu ellipsis nu se vede ≥ 60% din nume, se afișează abrevierea.
 */
function TeamHeading({ name, abbreviation, score, align }: { name: string; abbreviation: string; score: number; align: "left" | "right" }) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [useAbbreviation, setUseAbbreviation] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;
    const update = () => {
      const fullWidth = measure.scrollWidth;
      setUseAbbreviation(fullWidth > 0 && container.clientWidth / fullWidth < MIN_VISIBLE_NAME_RATIO);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [name]);

  return (
    <h3
      className={`h1 flex min-w-0 items-baseline gap-[8px] self-stretch text-[var(--text-primary)] ${align === "right" ? "justify-end" : ""}`}
      title={name}
    >
      <span ref={containerRef} className="relative min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {useAbbreviation ? abbreviation : name}
        {/* Lățimea numelui complet, pentru alegerea abrevierii. */}
        <span ref={measureRef} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap">
          {name}
        </span>
      </span>
      <span className="shrink-0">- {score}</span>
    </h3>
  );
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
  /** DRAFT_THINKING §8 — raportul pe piloni al echipei userului (după lock-in). */
  pillarReport?: DraftPillarReport | null;
  pillarTeamName?: string;
  /** FEEDBACK_FIXES §6.2 — side-ul echipei userului în acest joc (null = nu e în meci). */
  userSide?: Side | null;
};

const PILLAR_GRADE_COLORS: Record<PillarGrade, string> = {
  A: "var(--success)",
  B: "var(--primary)",
  C: "var(--warning)",
  D: "var(--danger)",
};

/** RESULTS_DIALOG_TABS §2 — tab-urile dialogului. */
type ResultsTab = "scoreboard" | "why" | "draft";
const TAB_LABELS: Record<ResultsTab, string> = { scoreboard: "Scoreboard", why: "Why it ended", draft: "Draft" };
/** Înălțimea fixă a conținutului (cel mai înalt tab compact: scoreboard-ul cu 5 jucători ≈ 375px). */
const TAB_PANEL_HEIGHT = 390;
/** §2.1: într-un pilon deschis, cel mult atâtea note; restul în „+N more” (tooltip). */
const MAX_OPEN_NOTES = 5;

export default function MatchResultsDialog({
  open,
  simulation,
  onPrimaryAction,
  primaryLabel,
  isSeriesComplete = false,
  seriesMvpName,
  pillarReport,
  pillarTeamName,
  userSide = null,
}: Props) {
  // Tab-ul și pilonul deschis țin de jocul afișat: la un joc nou revin la Scoreboard / niciun pilon (fără effect).
  const gameKey = simulation
    ? `${simulation.blueTeamSlug}:${simulation.redTeamSlug}:${simulation.seriesScoreBlue}:${simulation.seriesScoreRed}:${simulation.gameLength}`
    : "";
  const [tabState, setTabState] = useState<{ key: string; tab: ResultsTab; pillar: string | null }>({ key: "", tab: "scoreboard", pillar: null });
  const current = tabState.key === gameKey ? tabState : { key: gameKey, tab: "scoreboard" as ResultsTab, pillar: null };
  const tabRefs = useRef<Partial<Record<ResultsTab, HTMLButtonElement | null>>>({});

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

  const blueTeam = getTeamLabel(simulation.blueTeamSlug);
  const redTeam = getTeamLabel(simulation.redTeamSlug);
  const blueTeamName = blueTeam.name;
  const redTeamName = redTeam.name;

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

  // §6.2: ce a decis meciul (simulările vechi nu au factorii → tab-ul lipsește).
  const outcome = explainOutcome({
    factors: simulation.outcomeFactors,
    winnerSide: simulation.winnerSide,
    userSide,
    closeness: simulation.closeness,
  });

  // §2: tab-urile disponibile (cu un singur tab, bara nu se afișează).
  const tabs: ResultsTab[] = ["scoreboard", ...(outcome ? (["why"] as const) : []), ...(pillarReport ? (["draft"] as const) : [])];
  const activeTab: ResultsTab = tabs.includes(current.tab) ? current.tab : "scoreboard";
  const selectTab = (tab: ResultsTab) => setTabState({ key: gameKey, tab, pillar: current.pillar });
  const togglePillar = (pillar: string) =>
    setTabState({ key: gameKey, tab: activeTab, pillar: current.pillar === pillar ? null : pillar });
  const onTabKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = tabs.indexOf(activeTab);
    const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  // §3.2: scorul brut de draft al ambelor echipe (altă mărime decât „Draft impact”).
  const ownDraftScore = userSide === "red" ? simulation.redDraftScore : simulation.blueDraftScore;
  const theirDraftScore = userSide === "red" ? simulation.blueDraftScore : simulation.redDraftScore;
  const draftGap = ownDraftScore - theirDraftScore;

  const metaLine = [
    simulation.gameLength ? simulation.gameLength : null,
    isSeriesComplete && seriesMvpName ? `${seriesMvpName} - Series MVP` : null,
  ].filter(Boolean);

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
          gap-[20px]
          rounded-[16px]
          bg-[var(--bg-surface)]
          px-[40px] py-[28px]
        "
      >
        {/* ─── Header (fix) ───────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-[2px] self-stretch text-center">
          <p className="body-small text-[var(--text-primary)]">Game Result</p>
          <h2 id="match-results-title" className="h1 max-w-full text-balance break-words text-[var(--text-primary)]">
            {title}
          </h2>
          {metaLine.length > 0 && (
            <p className="body-small text-[var(--text-secondary)]">
              {simulation.gameLength ? `Match Length - ${simulation.gameLength}` : null}
              {simulation.gameLength && isSeriesComplete && seriesMvpName ? " · " : null}
              {isSeriesComplete && seriesMvpName ? <span className="text-[var(--primary)]">{seriesMvpName} - Series MVP</span> : null}
            </p>
          )}
        </div>

        {/* ─── Tab-uri (fixe) ─────────────────────────────────────── */}
        {tabs.length > 1 && (
          <div role="tablist" aria-label="Game result" className="flex justify-center gap-[24px] self-stretch border-b border-[var(--border-default)]" onKeyDown={onTabKeyDown}>
            {tabs.map((tab) => {
              const selected = tab === activeTab;
              return (
                <button
                  key={tab}
                  ref={(node) => { tabRefs.current[tab] = node; }}
                  type="button"
                  role="tab"
                  id={`results-tab-${tab}`}
                  aria-selected={selected}
                  aria-controls={`results-panel-${tab}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(tab)}
                  className="label -mb-px pb-[8px]"
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${selected ? "var(--primary)" : "transparent"}`,
                    color: selected ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "0 2px 8px",
                  }}
                >
                  {TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>
        )}

        {/* ─── Conținutul tab-ului (înălțime fixă, fără scroll) ───── */}
        <div
          role="tabpanel"
          id={`results-panel-${activeTab}`}
          aria-labelledby={tabs.length > 1 ? `results-tab-${activeTab}` : undefined}
          className="flex flex-col self-stretch overflow-hidden"
          style={{ height: TAB_PANEL_HEIGHT }}
        >
          {activeTab === "scoreboard" && (
            <div className="flex min-w-0 items-start gap-[32px] self-stretch">
              {/* ── Left section ───────────────────────────────────── */}
              <section className="flex min-w-0 flex-1 flex-col gap-[12px]">
                <TeamHeading name={blueTeam.name} abbreviation={blueTeam.abbreviation} score={simulation.seriesScoreBlue} align="left" />
                <div className="h-px self-stretch bg-[var(--border-default)]" />
                <div className="flex items-center gap-[12px] self-stretch">
                  <div className="min-w-0 flex-1" />
                  <span className="body-small w-[56px] shrink-0 text-center text-[var(--text-secondary)]">KDA</span>
                  <span className="body-small w-[44px] shrink-0 text-center text-[var(--text-secondary)]">Score</span>
                </div>
                <div className="flex flex-col gap-[12px] self-stretch">
                  {bluePlayers.map((entry) => (
                    <PlayerResultRow
                      key={`${entry.side}-${entry.role}-${entry.playerId}`}
                      entry={entry}
                      showMvp={entry.playerId === gameMvp?.playerId}
                    />
                  ))}
                </div>
              </section>

              {/* ── Right section ──────────────────────────────────── */}
              <section className="flex min-w-0 flex-1 flex-col gap-[12px]">
                <TeamHeading name={redTeam.name} abbreviation={redTeam.abbreviation} score={simulation.seriesScoreRed} align="right" />
                <div className="h-px self-stretch bg-[var(--border-default)]" />
                <div className="flex items-center gap-[12px] self-stretch">
                  <span className="body-small w-[44px] shrink-0 text-center text-[var(--text-secondary)]">Score</span>
                  <span className="body-small w-[56px] shrink-0 text-center text-[var(--text-secondary)]">KDA</span>
                  <div className="min-w-0 flex-1" />
                </div>
                <div className="flex flex-col gap-[12px] self-stretch">
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
          )}

          {/* ─── Why it ended (FEEDBACK_FIXES §6.2) ───────────────── */}
          {activeTab === "why" && outcome && (
            <section className="flex flex-col gap-[10px] self-stretch">
              <p className="body-small text-[var(--text-secondary)]">Why {winnerName} won</p>
              <div className="h-px self-stretch bg-[var(--border-default)]" />
              {outcome.winnerFactors.length > 0 ? (
                <div className="flex flex-col gap-[6px] self-stretch">
                  {outcome.winnerFactors.map((line) => (
                    <div key={line.key} className="flex items-center gap-[12px] self-stretch" title={OUTCOME_FACTOR_TOOLTIPS[line.key]}>
                      <span className="body-small w-[150px] shrink-0 text-[var(--text-primary)]">{line.label}</span>
                      <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--border-default)]">
                        {/* §3.3: scală fixă (OUTCOME_BAR_FULL = bară plină), ca un +0.05 să arate mic. */}
                        <div
                          className="h-full rounded-full bg-[var(--primary)]"
                          style={{ width: `${Math.max(3, Math.min(100, (line.value / OUTCOME_BAR_FULL) * 100))}%` }}
                        />
                      </div>
                      <span className="body-small w-[48px] shrink-0 text-right font-bold text-[var(--text-primary)]">{formatEdge(line.value)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {/* §3.3: upset și close game nu apar împreună (upset are prioritate). */}
              {outcome.upset && (
                <span className="body-small text-[var(--warning)]">Upset: the weaker team on paper won (comeback or variance).</span>
              )}
              {outcome.varianceNote && <span className="body-small text-[var(--warning)]">{outcome.varianceNote}</span>}
              {outcome.userFactors && (
                <span className="body-small text-[var(--text-secondary)]">
                  What worked for you:{" "}
                  {outcome.userFactors.length
                    ? outcome.userFactors.map((line) => `${line.label} ${formatEdge(line.value)}`).join(", ")
                    : "nothing stood out"}
                </span>
              )}
              {outcome.summary && <span className="body-small text-[var(--text-primary)]">{outcome.summary}</span>}
              {simulation.reason && (
                <span className="text-[11px] leading-tight text-[var(--text-muted)]">{simulation.reason}</span>
              )}
            </section>
          )}

          {/* ─── Draft pe piloni (acordeon, fără scroll) ──────────── */}
          {activeTab === "draft" && pillarReport && (
            <section className="flex flex-col gap-[10px] self-stretch">
              <p className="body-small text-[var(--text-secondary)]">Draft{pillarTeamName ? `: ${pillarTeamName}` : ""}</p>
              <div className="h-px self-stretch bg-[var(--border-default)]" />
              {/* §3.2: scorul brut al ambelor echipe, cu tooltip. */}
              <p
                className="body-small font-bold"
                title={DRAFT_SCORE_TOOLTIP}
                style={{ color: draftGap > 0.05 ? "var(--success)" : draftGap < -0.05 ? "var(--danger)" : "var(--text-secondary)" }}
              >
                {describeDraftScore(ownDraftScore, theirDraftScore)}
              </p>
              <div className="flex flex-col gap-[8px] self-stretch">
                {PILLAR_LABELS.map(({ key, label }) => {
                  const pillar = pillarReport[key];
                  const isOpen = current.pillar === key;
                  const shown = isOpen ? pillar.notes.slice(0, MAX_OPEN_NOTES) : pillar.notes.slice(0, 1);
                  const hidden = isOpen ? pillar.notes.slice(MAX_OPEN_NOTES) : [];
                  const canOpen = pillar.notes.length > 1 || Boolean(pillar.reasons?.some(Boolean));
                  return (
                    <div key={key} className="flex items-start gap-[12px] self-stretch">
                      <button
                        type="button"
                        onClick={() => canOpen && togglePillar(key)}
                        aria-expanded={canOpen ? isOpen : undefined}
                        className="body-small flex w-[174px] shrink-0 items-center gap-[8px] text-left"
                        style={{ background: "none", border: "none", padding: 0, cursor: canOpen ? "pointer" : "default", color: "var(--text-primary)" }}
                      >
                        <span className="w-[10px] shrink-0 text-[var(--text-muted)]">{canOpen ? (isOpen ? "▾" : "▸") : ""}</span>
                        <span className="flex-1">{label}</span>
                        <span className="w-[24px] shrink-0 text-center font-bold" style={{ color: PILLAR_GRADE_COLORS[pillar.grade] }}>
                          {pillar.grade}
                        </span>
                      </button>
                      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                        {shown.map((note, index) => {
                          const reason = pillar.reasons?.[index];
                          return (
                            <div key={`${index}:${note}`} className="flex flex-col" title={reason ?? undefined}>
                              <span className={`body-small text-[var(--text-secondary)] ${isOpen ? "" : "truncate"}`}>{note}</span>
                              {/* §4.3: explicația matchup-ului, a doua linie mai mică (în pilonul deschis). */}
                              {reason && isOpen && <span className="text-[11px] leading-tight text-[var(--text-muted)]">{reason}</span>}
                            </div>
                          );
                        })}
                        {hidden.length > 0 && (
                          <span className="body-small cursor-help text-[var(--primary)]" title={hidden.join("\n")}>
                            +{hidden.length} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* ─── Action (fix, mereu vizibil) ────────────────────────── */}
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
