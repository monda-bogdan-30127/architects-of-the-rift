// TEAM_FIT_LIVE §2 — panoul Team Fit din bara de jos a ecranului „Choose Your Team”, actualizat la fiecare slot:
// resurse (bara cu 3 segmente), comunicarea echipei, numărul de sfaturi de draft și cel mult 3 sfaturi. Tonul e de
// sfat de la un analist: nimic nu blochează o alegere.

import type { Player } from "@/app/types/player";
import type { Role } from "@/app/types/champion";
import { computeTeamFit, getCommsLevel, topAdvice, type CommsLevel, type TeamFitAdvice } from "@/app/utils/playerTraitUtils";

export const COMMS_COLORS: Record<CommsLevel, string> = {
  Poor: "var(--danger)",
  Average: "var(--text-secondary)",
  Good: "var(--success)",
  Elite: "var(--text-highlight)",
};

export const ADVICE_ICON: Record<TeamFitAdvice["level"], string> = { warning: "⚠", tip: "•", good: "✓" };
export const ADVICE_COLOR: Record<TeamFitAdvice["level"], string> = {
  warning: "var(--warning)",
  tip: "var(--text-secondary)",
  good: "var(--success)",
};

const rowLabel: React.CSSProperties = { fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", width: 62, flexShrink: 0 };

// layout: „column” = panou îngust lângă sloturi; „strip” = o bandă pe toată lățimea, deasupra sloturilor.
export default function TeamFitPanel({
  selectedPlayers,
  layout = "column",
}: {
  selectedPlayers: Partial<Record<Role, Player>>;
  layout?: "column" | "strip";
}) {
  const strip = layout === "strip";
  const roster = Object.fromEntries(Object.entries(selectedPlayers).flatMap(([role, player]) => (player ? [[role, player.id]] : []))) as Partial<Record<Role, string>>;
  const byId = new Map(Object.values(selectedPlayers).flatMap((player) => (player ? [[player.id, player] as const] : [])));
  const fit = computeTeamFit(roster, (playerId) => byId.get(playerId));

  if (fit.filledRoles.length === 0) {
    return (
      <div style={{ width: strip ? "100%" : 300, flexShrink: 0, fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>
        Pick players to see how they fit together
      </div>
    );
  }

  const { hogCount, max } = fit.resources;
  const hogNames = fit.hogs.map((entry) => byId.get(entry.playerId)?.name ?? entry.playerId).join(", ");
  const commsTooltip = Object.values(selectedPlayers)
    .flatMap((player) => (player ? [player] : []))
    .map((player) => {
      const level = getCommsLevel(player.advancedProfile.hiddenTraits.communication);
      return `${player.name}: ${level}${fit.comms.weakest?.playerId === player.id ? " (weakest)" : ""}`;
    })
    .join("\n");
  const draftCount = fit.advice.filter((entry) => entry.dimension === "draft").length;
  const shown = topAdvice(fit.advice, strip ? 2 : 3);

  return (
    <div
      style={
        strip
          ? { width: "100%", display: "flex", alignItems: "center", gap: 18, minWidth: 0 }
          : { width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 3 }
      }
      aria-label="Team Fit"
    >
      <p className="label" style={{ fontSize: 9, color: "var(--text-primary)", margin: 0 }}>TEAM FIT</p>

      {/* Resources: 3 segmente (0–2 ok, al treilea roșu) */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }} title={hogNames ? `Resource Hogs: ${hogNames}` : "No Resource Hog yet"}>
        <span style={rowLabel}>RESOURCES</span>
        <div style={{ display: "flex", gap: 2 }}>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              style={{
                width: 16,
                height: 6,
                borderRadius: 2,
                background: index < hogCount ? (index >= max ? "var(--danger)" : "var(--primary)") : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 10, color: hogCount > max ? "var(--danger)" : "var(--text-secondary)" }}>{fit.resources.summary}</span>
      </div>

      {/* Comms */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }} title={commsTooltip}>
        <span style={rowLabel}>COMMS</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: fit.comms.level ? COMMS_COLORS[fit.comms.level] : "var(--text-muted)", cursor: "help" }}>
          {fit.comms.summary || "—"}
        </span>
      </div>

      {/* Draft */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={rowLabel}>DRAFT</span>
        <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{draftCount ? `${draftCount} ${draftCount === 1 ? "note" : "notes"}` : "—"}</span>
      </div>

      {/* Advice (cel mult 3) */}
      {shown.map((advice) => (
        <span
          key={advice.id}
          title={advice.text}
          style={{ fontSize: 10, color: ADVICE_COLOR[advice.level], whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3, minWidth: 0, flexShrink: 1 }}
        >
          {ADVICE_ICON[advice.level]} {advice.text}
        </span>
      ))}
    </div>
  );
}
