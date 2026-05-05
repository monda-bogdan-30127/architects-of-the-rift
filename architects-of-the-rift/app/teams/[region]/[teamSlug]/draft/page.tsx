"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import PlayerSelectionBar from "@/components/ui/PlayerSelectionBar";
import Dialog from "@/components/ui/Dialog";
import { teams } from "@/app/data/teams";
import { players } from "@/app/data/players";
import { champions } from "@/app/data/champions";
import type { Player } from "@/app/types/player";
import type { Role } from "@/app/types/champion";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { getChampionGrade } from "@/app/utils/championMasteryUtils";
import useBackRedirect from "@/app/hooks/useBrowserBackRedirect";

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectedPlayers = Partial<Record<Role, Player>>;

type DraftSave = {
  region: string;
  controlledTeamSlug: string;
  budget: number;
  leftRp: number;
  roster: Record<Role, string>;
  updatedTeamRosters: Record<string, Record<Role, string>>;
  playerTeamAssignments: Record<string, string>;
  freeAgentPlayerIds: string[];
};

type SortKey = "rosterPoints" | "rating" | "mec" | "mac" | "tfg" | "clt" | "con" | "iq";
type SortDir = "asc" | "desc";

type EnrichedPlayer = Player & {
  effectiveRp:  number;
  rating:       number;
  playerRegion: string;
  isCrossGroup: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const roleOrder: Role[] = ["top", "jungle", "mid", "adc", "support"];

const REGION_BUDGET: Record<string, number> = {
  lck: 38,
  lpl: 38,
  lec: 37,
  lcs: 36,
};
const DEFAULT_BUDGET = 38;

/**
 * Group A: LCK + LPL   |   Group B: LEC + LCS
 * Picking a player from a different group costs +1 RP.
 */
const REGION_GROUPS: Record<string, string> = {
  lck: "A",
  lpl: "A",
  lec: "B",
  lcs: "B",
};

const REGION_FILTER_OPTIONS = ["ALL", "LCK", "LPL", "LEC", "LCS", "FREE AGENTS"] as const;
type RegionFilter = (typeof REGION_FILTER_OPTIONS)[number];

const ROLE_LABELS: Record<Role, string> = {
  top:     "TOP",
  jungle:  "JGL",
  mid:     "MID",
  adc:     "ADC",
  support: "SUP",
};

const TABLE_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "rosterPoints", label: "ROSTER POINTS" },
  { key: "rating",       label: "RATING"        },
  { key: "mec",          label: "MECHANICS"     },
  { key: "mac",          label: "MACRO"         },
  { key: "tfg",          label: "TEAMFIGHTING"  },
  { key: "clt",          label: "CLUTCH"        },
  { key: "con",          label: "CONSISTENCY"   },
  { key: "iq",           label: "IQ"            },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPlayerRegion(player: Player): string {
  if (player.teamId === "free-agent") return "free-agent";
  const team = teams.find((t) => t.id === player.teamId);
  return team?.region ?? "";
}

function checkCrossGroup(playerRegion: string, myRegion: string): boolean {
  if (playerRegion === "free-agent") return false;
  const myGroup     = REGION_GROUPS[myRegion];
  const playerGroup = REGION_GROUPS[playerRegion];
  return !!myGroup && !!playerGroup && myGroup !== playerGroup;
}

function getEffectiveRp(player: Player, myRegion: string): number {
  return player.rosterPoints + (checkCrossGroup(getPlayerRegion(player), myRegion) ? 1 : 0);
}

function calcRating(player: Player): number {
  const { mec, mac, tfg, clt, con, iq } = player.stats;
  return Math.round((mec + mac + tfg + clt + con + iq) / 6);
}

function getStatValue(player: EnrichedPlayer, key: SortKey): number {
  switch (key) {
    case "rosterPoints": return player.effectiveRp;
    case "rating":       return player.rating;
    case "mec":          return player.stats.mec;
    case "mac":          return player.stats.mac;
    case "tfg":          return player.stats.tfg;
    case "clt":          return player.stats.clt;
    case "con":          return player.stats.con;
    case "iq":           return player.stats.iq;
  }
}

// ─── Champion Mastery Popup ───────────────────────────────────────────────────

const MASTERY_GRADE_ORDER: ChampionMasteryGrade[] = ["SS", "S", "A", "B", "C", "D", "F"];

const GRADE_COLORS: Record<ChampionMasteryGrade, { bg: string; text: string; border: string }> = {
  SS: { bg: "#B8860B",  text: "#FFF8E1", border: "#FFD466" },
  S:  { bg: "#8B1A2B",  text: "#FFD1DA", border: "#E84868" },
  A:  { bg: "#5B2D8E",  text: "#E8D4FF", border: "#A86EDB" },
  B:  { bg: "#1A6B5A",  text: "#D4F5ED", border: "#38BFA0" },
  C:  { bg: "#4A4A52",  text: "#D0D0D4", border: "#808088" },
  D:  { bg: "#6B4226",  text: "#EADDD4", border: "#A87850" },
  F:  { bg: "#3A1A1A",  text: "#D08080", border: "#802020" },
};

function MasteryGradeBadge({ grade }: { grade: ChampionMasteryGrade }) {
  const colors = GRADE_COLORS[grade];
  return (
    <span
      style={{
        position: "absolute",
        top: -4,
        left: -4,
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: grade === "SS" ? 26 : 22,
        height: 22,
        borderRadius: 6,
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        color: colors.text,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.04em",
        fontFamily: '"Spiegel", sans-serif',
        lineHeight: 1,
      }}
    >
      {grade}
    </span>
  );
}

function ChampionMasteryPopup({
  player,
  onClose,
}: {
  player: Player;
  onClose: () => void;
}) {
  const role = player.role as Role;

  const masteryList = useMemo(() => {
    const roleChamps = champions.filter((c) => c.roles.includes(role));
    return roleChamps
      .map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image,
        grade: getChampionGrade(player, c.id),
      }))
      .sort((a, b) => {
        const ga = MASTERY_GRADE_ORDER.indexOf(a.grade);
        const gb = MASTERY_GRADE_ORDER.indexOf(b.grade);
        if (ga !== gb) return ga - gb;
        return a.name.localeCompare(b.name);
      });
  }, [player, role]);

  const playstyleLine = [
    player.playstyleIdentity?.displayPrimary,
    player.playstyleIdentity?.displaySecondary,
  ]
    .filter(Boolean)
    .join(" - ");

  const tagsLine = (player.playstyleIdentity?.displayTags ?? []).join(", ");

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(11,11,15,0.70)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 760,
          width: "calc(100vw - 48px)",
          maxHeight: "calc(100vh - 48px)",
          overflow: "hidden",
          borderRadius: 16,
          background: "var(--bg-surface)",
          padding: "28px 32px 32px",
        }}
      >
        {/* Close X */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            color: "var(--text-highlight)",
            fontSize: 20,
            fontWeight: 700,
            cursor: "pointer",
            borderRadius: 6,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          ✕
        </button>

        {/* Player info row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 100,
              height: 120,
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: 8,
              background: "var(--bg-elevated)",
            }}
          >
            {player.image && (
              <img
                src={player.image}
                alt={player.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              {player.name}
            </span>

            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "var(--text-highlight)",
              }}
            >
              {role.toUpperCase()}
            </span>

            {playstyleLine && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "0.02em",
                }}
              >
                {playstyleLine.toUpperCase()}
              </span>
            )}

            {tagsLine && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.02em",
                }}
              >
                {tagsLine.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Champion grid */}
        <div
          className="mastery-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            paddingRight: 4,
          }}
        >
          {masteryList.map((entry) => {
            const colors = GRADE_COLORS[entry.grade];
            const isUnplayable = entry.grade === "F";
            return (
              <div
                key={entry.id}
                className="flex flex-col items-center"
                style={{ gap: 4, position: "relative" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: `2px solid ${colors.border}`,
                    filter: isUnplayable
                      ? "grayscale(0.7) brightness(0.5)"
                      : "none",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    if (!isUnplayable) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = `0 0 12px ${colors.border}55`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <MasteryGradeBadge grade={entry.grade} />
                  <img
                    src={entry.image}
                    alt={entry.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 15%",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: isUnplayable
                      ? "var(--text-muted)"
                      : "var(--text-secondary)",
                    maxWidth: 84,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    textTransform: "uppercase",
                    lineHeight: "12px",
                  }}
                >
                  {entry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DraftPage() {
  const router = useRouter();
  const params = useParams<{ region: string; teamSlug: string }>();

  useBackRedirect("/");

  const region    = (params.region ?? "").toLowerCase();
  const teamSlug  = params.teamSlug ?? "";
  const maxBudget = REGION_BUDGET[region] ?? DEFAULT_BUDGET;

  // ── State ──────────────────────────────────────────────────────────────────

  const [selectedPlayers,    setSelectedPlayers]    = useState<SelectedPlayers>({});
  const [isReadyDialogOpen,  setIsReadyDialogOpen]  = useState(false);
  const [hoveredPlayer,      setHoveredPlayer]      = useState<EnrichedPlayer | null>(null);
  const [activeRoleFilters,  setActiveRoleFilters]  = useState<Set<Role>>(new Set());
  const [activeRegionFilter, setActiveRegionFilter] = useState<RegionFilter>("ALL");
  const [sortKey,            setSortKey]            = useState<SortKey>("rosterPoints");
  const [sortDir,            setSortDir]            = useState<SortDir>("desc");
  const [masteryPlayer,      setMasteryPlayer]      = useState<EnrichedPlayer | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedTeam = useMemo(
    () => teams.find((t) => t.slug === teamSlug) ?? null,
    [teamSlug],
  );

  const enrichedPlayers = useMemo<EnrichedPlayer[]>(() => {
    return players.map((p) => {
      const playerRegion = getPlayerRegion(p);
      return {
        ...p,
        effectiveRp:  getEffectiveRp(p, region),
        rating:       calcRating(p),
        playerRegion,
        isCrossGroup: checkCrossGroup(playerRegion, region),
      };
    });
  }, [region]);

  const displayPlayers = useMemo<EnrichedPlayer[]>(() => {
    let list = enrichedPlayers;

    if (activeRoleFilters.size > 0) {
      list = list.filter((p) => activeRoleFilters.has(p.role));
    }

    if (activeRegionFilter !== "ALL") {
      if (activeRegionFilter === "FREE AGENTS") {
        list = list.filter((p) => p.teamId === "free-agent");
      } else {
        const regionKey     = activeRegionFilter.toLowerCase();
        const regionTeamIds = teams
          .filter((t) => t.region === regionKey)
          .map((t) => t.id);
        list = list.filter((p) => regionTeamIds.includes(p.teamId));
      }
    }

    return [...list].sort((a, b) => {
      const diff = getStatValue(b, sortKey) - getStatValue(a, sortKey);
      return sortDir === "desc" ? diff : -diff;
    });
  }, [enrichedPlayers, activeRoleFilters, activeRegionFilter, sortKey, sortDir]);

  const selectedRoleSet = useMemo(
    () => new Set(roleOrder.filter((r) => selectedPlayers[r])),
    [selectedPlayers],
  );

  const usedBudget = useMemo(() => {
    return Object.values(selectedPlayers).reduce((sum, p) => {
      return sum + (p ? getEffectiveRp(p, region) : 0);
    }, 0);
  }, [selectedPlayers, region]);

  const leftRp          = maxBudget - usedBudget;
  const allRolesFilled  = roleOrder.every((r) => selectedPlayers[r]);
  const isReadyDisabled = !allRolesFilled || leftRp < 0;

  // ── Preview data ───────────────────────────────────────────────────────────

  const previewTeam = hoveredPlayer
    ? teams.find((t) => t.id === hoveredPlayer.teamId) ?? null
    : null;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSelectPlayer = (player: EnrichedPlayer) => {
    const { role } = player;
    if (selectedPlayers[role]?.id === player.id) {
      setSelectedPlayers((cur) => { const n = { ...cur }; delete n[role]; return n; });
      return;
    }
    setSelectedPlayers((cur) => ({ ...cur, [role]: player }));
  };

  const handleRemovePlayer = (role: Role) => {
    setSelectedPlayers((cur) => { const n = { ...cur }; delete n[role]; return n; });
  };

  const handleToggleRoleFilter = (role: Role) => {
    setActiveRoleFilters((cur) => {
      const next = new Set(cur);
      if (next.has(role)) next.delete(role); else next.add(role);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleOpenReadyDialog  = () => { if (!isReadyDisabled) setIsReadyDialogOpen(true); };
  const handleCloseReadyDialog = () => setIsReadyDialogOpen(false);

  const handleConfirmReady = () => {
    if (!selectedTeam) return;

    // Build original rosters for ALL teams globally
    const originalTeamRosters: Record<string, Partial<Record<Role, Player>>> = {};
    for (const team of teams) originalTeamRosters[team.id] = {};
    for (const p of players) {
      if (p.teamId === "free-agent") continue;
      originalTeamRosters[p.teamId] = { ...originalTeamRosters[p.teamId], [p.role]: p };
    }

    // Start with copies of originals for ALL teams
    const updatedTeamRosters: Record<string, Record<Role, string>> = {};
    for (const team of teams) {
      const orig = originalTeamRosters[team.id];
      updatedTeamRosters[team.id] = {
        top:     orig.top?.id     ?? "",
        jungle:  orig.jungle?.id  ?? "",
        mid:     orig.mid?.id     ?? "",
        adc:     orig.adc?.id     ?? "",
        support: orig.support?.id ?? "",
      };
    }

    const freeAgentIds = new Set(
      players.filter((p) => p.teamId === "free-agent").map((p) => p.id),
    );

    for (const role of roleOrder) {
      const chosenPlayer   = selectedPlayers[role];
      if (!chosenPlayer) continue;
      const outgoingPlayer = originalTeamRosters[selectedTeam.id]?.[role];
      if (!outgoingPlayer) continue;

      updatedTeamRosters[selectedTeam.id][role] = chosenPlayer.id;

      if (chosenPlayer.teamId === "free-agent") {
        freeAgentIds.delete(chosenPlayer.id);
        freeAgentIds.add(outgoingPlayer.id);
      } else if (chosenPlayer.teamId !== selectedTeam.id) {
        updatedTeamRosters[chosenPlayer.teamId][role] = outgoingPlayer.id;
      }
    }

    const playerTeamAssignments: Record<string, string> = {};
    for (const team of teams) {
      for (const role of roleOrder) {
        const pid = updatedTeamRosters[team.id][role];
        if (pid) playerTeamAssignments[pid] = team.id;
      }
    }
    for (const faId of freeAgentIds) playerTeamAssignments[faId] = "free-agent";

    const savePayload: DraftSave = {
      region,
      controlledTeamSlug: selectedTeam.slug,
      budget:             usedBudget,
      leftRp,
      roster: {
        top:     selectedPlayers.top?.id     ?? "",
        jungle:  selectedPlayers.jungle?.id  ?? "",
        mid:     selectedPlayers.mid?.id     ?? "",
        adc:     selectedPlayers.adc?.id     ?? "",
        support: selectedPlayers.support?.id ?? "",
      },
      updatedTeamRosters,
      playerTeamAssignments,
      freeAgentPlayerIds: Array.from(freeAgentIds),
    };

    localStorage.setItem("rift-draft-save", JSON.stringify(savePayload));
    router.push("/gameplay-dashboard");
  };

  const readyDescription = roleOrder
    .map((r) => `${r.toUpperCase()}: ${selectedPlayers[r]?.name ?? "-"}`)
    .join("\n");

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hide scrollbar globally for this page */}
      <style>{`
        .draft-scroll::-webkit-scrollbar { display: none; }
        .draft-scroll { scrollbar-width: none; -ms-overflow-style: none; }

        .mastery-scroll::-webkit-scrollbar { width: 6px; }
        .mastery-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.04);
          border-radius: 3px;
        }
        .mastery-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 3px;
          transition: background 0.2s;
        }
        .mastery-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.28);
        }
        .mastery-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.15) rgba(255,255,255,0.04);
        }
      `}</style>

      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          height:        "100dvh",
          paddingTop:    80,   // navbar height
          paddingBottom: 140,  // selection bar height
          overflow:      "hidden",
          background:    "var(--bg-primary)",
        }}
      >
        {/* ── Title + Preview + Filters — fixed top section, never scrolls ── */}
        <div style={{ flexShrink: 0 }}>
          {/* Title */}
          <div style={{ padding: "24px 40px 16px" }}>
            <p className="h3" style={{ color: "var(--text-secondary)", marginBottom: 4 }}>
              {region.toUpperCase()} Region — {selectedTeam?.name ?? "<Chosen Team Name>"}
            </p>
            <h1 className="h1" style={{ color: "var(--text-primary)", marginBottom: 8 }}>
              Choose Your Team
            </h1>
            <p className="body" style={{ color: "var(--text-secondary)", maxWidth: 680 }}>
              Pick one player for each role. Selecting a player from another team will swap them
              with the player currently occupying that role.
              <br />
              All other players will remain on their original teams.
            </p>
          </div>

          {/* ── Preview + Filters — part of fixed top section ──────────── */}
          <div
            style={{
              background:   "var(--bg-primary)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Player preview */}
            <div
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          32,
                padding:      "16px 40px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                minHeight:    100,
              }}
            >
              {/* Team logo + name */}
              <div
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  alignItems:    "center",
                  gap:           6,
                  width:         100,
                  flexShrink:    0,
                }}
              >
                {previewTeam?.logo ? (
                  <img
                    src={previewTeam.logo}
                    alt={previewTeam.name}
                    style={{ width: 44, height: 44, objectFit: "contain" }}
                  />
                ) : (
                  <div
                    style={{
                      width:        44,
                      height:       44,
                      borderRadius: "50%",
                      background:   "rgba(255,255,255,0.08)",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize:   11,
                    color:      "var(--text-secondary)",
                    textAlign:  "center",
                    lineHeight: 1.3,
                  }}
                >
                  {hoveredPlayer
                    ? hoveredPlayer.teamId === "free-agent"
                      ? "Free Agent"
                      : (previewTeam?.name ?? "—")
                    : "—"}
                </span>
              </div>

              {/* Player photo */}
              <div
                style={{
                  width:        100,
                  height:       100,
                  flexShrink:   0,
                  overflow:     "hidden",
                  borderRadius: 6,
                  background:   "rgba(255,255,255,0.04)",
                }}
              >
                {hoveredPlayer?.image && (
                  <img
                    src={hoveredPlayer.image}
                    alt={hoveredPlayer.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>

              {/* Player details */}
              {hoveredPlayer ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span
                    style={{
                      fontSize:   22,
                      fontWeight: 700,
                      color:      "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {hoveredPlayer.name}
                  </span>

                  <span
                    style={{
                      fontSize:      11,
                      fontWeight:    700,
                      letterSpacing: "0.1em",
                      color:         "var(--text-highlight)",
                      display:       "flex",
                      alignItems:    "center",
                      gap:           8,
                    }}
                  >
                    {hoveredPlayer.role.toUpperCase()}
                    {hoveredPlayer.isCrossGroup && (
                      <span
                        style={{
                          padding:      "1px 6px",
                          borderRadius: 3,
                          background:   "rgba(180,140,60,0.2)",
                          fontSize:     10,
                          fontWeight:   700,
                        }}
                      >
                        +1 RP (cross-region)
                      </span>
                    )}
                  </span>

                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {hoveredPlayer.playstyleIdentity.displayPrimary}
                    {hoveredPlayer.playstyleIdentity.displaySecondary
                      ? ` · ${hoveredPlayer.playstyleIdentity.displaySecondary}`
                      : ""}
                  </span>

                  {hoveredPlayer.playstyleIdentity.displayTags.length > 0 && (
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                      {hoveredPlayer.playstyleIdentity.displayTags.join(", ")}
                    </span>
                  )}
                </div>
              ) : (
                <span
                  style={{
                    fontSize:   13,
                    color:      "rgba(255,255,255,0.25)",
                    fontStyle:  "italic",
                  }}
                >
                  Hover over a player to preview
                </span>
              )}
            </div>

            {/* Filters row */}
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "10px 40px",
                gap:            16,
              }}
            >
              {/* Role filters — multi-select; click active role to deselect */}
              <div style={{ display: "flex", gap: 6 }}>
                {roleOrder.map((role) => {
                  const active = activeRoleFilters.has(role);
                  return (
                    <button
                      key={role}
                      onClick={() => handleToggleRoleFilter(role)}
                      style={{
                        padding:       "5px 12px",
                        borderRadius:  4,
                        border:        `1px solid ${active ? "var(--text-highlight)" : "rgba(255,255,255,0.18)"}`,
                        background:    active ? "rgba(180,140,60,0.12)" : "transparent",
                        color:         active ? "var(--text-highlight)" : "var(--text-secondary)",
                        cursor:        "pointer",
                        fontSize:      11,
                        fontWeight:    700,
                        letterSpacing: "0.07em",
                        transition:    "all 0.12s",
                      }}
                    >
                      {ROLE_LABELS[role]}
                    </button>
                  );
                })}
              </div>

              {/* Region filters — single select */}
              <div style={{ display: "flex", gap: 6 }}>
                {REGION_FILTER_OPTIONS.map((r) => {
                  const active = activeRegionFilter === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setActiveRegionFilter(r)}
                      style={{
                        padding:       "5px 14px",
                        borderRadius:  4,
                        border:        `1px solid ${active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)"}`,
                        background:    active ? "rgba(255,255,255,0.1)" : "transparent",
                        color:         active ? "var(--text-primary)" : "var(--text-secondary)",
                        cursor:        "pointer",
                        fontSize:      11,
                        fontWeight:    700,
                        letterSpacing: "0.07em",
                        transition:    "all 0.12s",
                      }}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>{/* end preview+filters */}

          {/* ── Table header — lives in fixed section, never scrolls ──────── */}
          <table
            style={{
              width:          "100%",
              borderCollapse: "collapse",
              tableLayout:    "fixed",
              borderBottom:   "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <colgroup>
              <col style={{ width: "14%" }} />
              <col style={{ width: "8%"  }} />
              {TABLE_COLUMNS.map((c) => (
                <col key={c.key} style={{ width: `${72 / TABLE_COLUMNS.length}%` }} />
              ))}
              <col style={{ width: "6%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={thStyle}>NAME</th>
                <th style={thStyle}>POSITION</th>
                {TABLE_COLUMNS.map(({ key, label }) => {
                  const isActive = sortKey === key;
                  return (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      style={{
                        ...thStyle,
                        cursor:     "pointer",
                        color:      isActive
                          ? "var(--text-highlight)"
                          : "var(--text-tertiary, rgba(255,255,255,0.35))",
                        userSelect: "none",
                      }}
                    >
                      {label}
                      <span style={{ marginLeft: 4, opacity: isActive ? 1 : 0 }}>
                        {sortDir === "desc" ? "↓" : "↑"}
                      </span>
                    </th>
                  );
                })}
                <th style={{ ...thStyle, textAlign: "center" }}>CHAMPION POOL</th>
              </tr>
            </thead>
          </table>

        </div>{/* end fixed top section */}

        {/* ── Scroll container — only tbody scrolls ─────────────────────── */}
        <div
          className="draft-scroll"
          style={{ flex: 1, overflowY: "auto" }}
        >
          <table
            style={{
              width:          "100%",
              borderCollapse: "collapse",
              tableLayout:    "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "14%" }} />
              <col style={{ width: "8%"  }} />
              {TABLE_COLUMNS.map((c) => (
                <col key={c.key} style={{ width: `${72 / TABLE_COLUMNS.length}%` }} />
              ))}
              <col style={{ width: "6%" }} />
            </colgroup>

            <tbody>
              {displayPlayers.map((player) => {
                const isSelected     = selectedPlayers[player.role]?.id === player.id;
                const isRoleOccupied = !isSelected && selectedRoleSet.has(player.role);
                const isHovered      = hoveredPlayer?.id === player.id;

                const rowBg = isSelected
                  ? "rgba(180,140,60,0.13)"
                  : isHovered
                    ? "rgba(255,255,255,0.05)"
                    : "transparent";

                return (
                  <tr
                    key={player.id}
                    onClick={() => !isRoleOccupied && handleSelectPlayer(player)}
                    onMouseEnter={() => setHoveredPlayer(player)}
                    onMouseLeave={() => setHoveredPlayer(null)}
                    style={{
                      cursor:       isRoleOccupied ? "not-allowed" : "pointer",
                      background:   rowBg,
                      opacity:      isRoleOccupied ? 0.35 : 1,
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition:   "background 0.08s, opacity 0.08s",
                    }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{player.name}</td>

                    <td
                      style={{
                        ...tdStyle,
                        color:         "var(--text-highlight)",
                        fontWeight:    700,
                        fontSize:      11,
                        letterSpacing: "0.07em",
                      }}
                    >
                      {player.role.toUpperCase()}
                    </td>

                    {/* Effective RP — +1 badge shown when cross-group */}
                    <td style={tdStyle}>
                      {player.effectiveRp}
                      {player.isCrossGroup && (
                        <span
                          style={{
                            marginLeft: 4,
                            fontSize:   9,
                            color:      "var(--text-highlight)",
                            fontWeight: 700,
                            opacity:    0.75,
                          }}
                        >
                          +1
                        </span>
                      )}
                    </td>

                    <td style={tdStyle}>{player.rating}</td>
                    <td style={tdStyle}>{player.stats.mec}</td>
                    <td style={tdStyle}>{player.stats.mac}</td>
                    <td style={tdStyle}>{player.stats.tfg}</td>
                    <td style={tdStyle}>{player.stats.clt}</td>
                    <td style={tdStyle}>{player.stats.con}</td>
                    <td style={tdStyle}>{player.stats.iq}</td>

                    {/* Champion pool — chevron opens mastery popup */}
                    <td style={{ ...tdStyle, textAlign: "center", padding: "8px 4px" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMasteryPlayer(player);
                        }}
                        aria-label={`See ${player.name}'s champion pool`}
                        style={{
                          display:        "inline-flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          width:          24,
                          height:         24,
                          padding:        0,
                          border:         "none",
                          background:     "transparent",
                          cursor:         "pointer",
                          color:          "#10E4F9",
                          transition:     "transform 0.15s ease, filter 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.12)";
                          e.currentTarget.style.filter = "drop-shadow(0 0 4px rgba(16,228,249,0.6))";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.filter = "none";
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 9L14 12L11 15" stroke="#10E4F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3C19.2 3 21 4.8 21 12C21 19.2 19.2 21 12 21C4.8 21 3 19.2 3 12C3 4.8 4.8 3 12 3Z" stroke="#10E4F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>

      {/* ── Sticky bottom: Player selection bar ───────────────────────────── */}
      <PlayerSelectionBar
        selectedPlayers={selectedPlayers}
        leftRp={leftRp}
        isOverBudget={leftRp < 0}
        onRemovePlayer={handleRemovePlayer}
        onReady={handleOpenReadyDialog}
      />

      <Dialog
        open={isReadyDialogOpen}
        onClose={handleCloseReadyDialog}
        title="Ready to start?"
        description={readyDescription}
        secondaryLabel="Back"
        onSecondaryAction={handleCloseReadyDialog}
        primaryLabel="Ready"
        onPrimaryAction={handleConfirmReady}
      />

      {masteryPlayer && (
        <ChampionMasteryPopup
          player={masteryPlayer}
          onClose={() => setMasteryPlayer(null)}
        />
      )}
    </>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  padding:       "8px 16px",
  textAlign:     "left",
  fontSize:      10,
  fontWeight:    700,
  letterSpacing: "0.09em",
  color:         "var(--text-tertiary, rgba(255,255,255,0.35))",
  whiteSpace:    "nowrap",
  background:    "var(--bg-primary)",
};

const tdStyle: React.CSSProperties = {
  padding:  "8px 16px",
  fontSize: 13,
  color:    "var(--text-primary)",
};