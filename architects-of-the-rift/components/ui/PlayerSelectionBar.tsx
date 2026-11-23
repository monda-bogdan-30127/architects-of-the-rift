"use client";

import Button from "@/components/ui/Button";
import TeamFitPanel from "@/components/ui/TeamFitPanel";
import type { Player } from "@/app/types/player";
import type { Role } from "@/app/types/champion";

type SelectedPlayers = Partial<Record<Role, Player>>;

type Props = {
  selectedPlayers: SelectedPlayers;
  leftRp: number;
  isOverBudget: boolean;
  onRemovePlayer: (role: Role) => void;
  onReady: () => void;
  /** ROSTER_IMPORTS_AND_INFO §1.5: importurile din lineup (null = fără regulă de import). */
  importCount?: number | null;
  maxImports?: number;
  /** Motivul pentru care Ready e dezactivat în afară de roluri / buget (ex. prea multe importuri). */
  blockedReason?: string | null;
};

// TEAM_FIT_LIVE §2: unde stă panoul Team Fit — „column” (lângă sloturi) sau „strip” (bandă deasupra sloturilor).
// De ales după screenshot-uri.
const TEAM_FIT_LAYOUT: "column" | "strip" = "strip";

const roleOrder: Role[] = ["top", "jungle", "mid", "adc", "support"];

const roleLabels: Record<Role, string> = {
  top: "TOP",
  jungle: "JG",
  mid: "MID",
  adc: "ADC",
  support: "SUP",
};

export default function PlayerSelectionBar({
  selectedPlayers,
  leftRp,
  isOverBudget,
  onRemovePlayer,
  onReady,
  importCount = null,
  maxImports = 2,
  blockedReason = null,
}: Props) {
  const allRolesFilled = roleOrder.every((role) => selectedPlayers[role]);
  const isReadyDisabled = !allRolesFilled || isOverBudget || Boolean(blockedReason);
  // La limită galben, peste limită roșu (n-ar trebui să se poată).
  const importColor = importCount === null ? undefined : importCount > maxImports ? "var(--danger)" : importCount === maxImports ? "var(--warning)" : "var(--text-highlight)";

  return (
    <div
      className="
        fixed bottom-0 left-1/2 z-40 -translate-x-1/2
        flex w-[1120px] flex-col gap-[6px]
        rounded-t-[16px] bg-[var(--bg-elevated)]
        px-[24px] py-[8px]
        shadow-[0_-8px_8px_0_rgba(0,0,0,0.20)]
      "
    >
      {TEAM_FIT_LAYOUT === "strip" && (
        <div className="border-b border-white/10 pb-[6px]">
          <TeamFitPanel selectedPlayers={selectedPlayers} layout="strip" />
        </div>
      )}

      <div className="flex w-full items-center gap-[16px]">
      {roleOrder.map((role) => {
        const player = selectedPlayers[role];

        return (
          <div
            key={role}
            className="flex min-w-0 flex-1 flex-col items-start gap-[4px]"
          >
            <p className="label text-[var(--text-primary)]">
              {roleLabels[role]}
            </p>

            {player ? (
              <div
                className="
                  flex w-full items-center gap-[4px]
                  rounded-[8px] bg-[var(--bg-surface)]
                  px-[8px] py-[4px]
                "
              >
                <button
                  type="button"
                  onClick={() => onRemovePlayer(role)}
                  aria-label={`Remove ${player.name}`}
                  className="
                    flex h-[24px] w-[24px] items-center justify-center
                    rounded-[8px]
                    text-[var(--primary)]
                    transition-opacity hover:opacity-80
                  "
                >
                  <img
                    src="/svg/x-icon.svg"
                    alt=""
                    className="h-[24px] w-[24px]"
                  />
                </button>

                <span className="h3 truncate text-[var(--text-primary)]">
                  {player.name} - {player.rosterPoints}
                </span>
              </div>
            ) : (
              <div
                className="
                  flex w-full items-center
                  rounded-[8px]
                  px-[8px] py-[4px]
                "
              >
                <span className="h3 truncate whitespace-nowrap text-[var(--text-secondary)]">
                  Player Name
                </span>
              </div>
            )}
          </div>
        );
      })}

      {TEAM_FIT_LAYOUT === "column" && <TeamFitPanel selectedPlayers={selectedPlayers} />}

      <div className="flex items-center gap-[16px]">
        {importCount !== null && (
          <div className="flex flex-col items-start gap-[4px]" title={`At most ${maxImports} imports in the lineup`}>
            <p className="label text-[var(--text-primary)]">IMPORTS</p>
            <p className="h3" style={{ color: importColor }}>
              {importCount}/{maxImports}
            </p>
          </div>
        )}
        <div className="flex flex-col items-start gap-[4px]">
          <p className="label text-[var(--text-primary)]">LEFT RP</p>
          <p
            className={`h3 ${leftRp < 0 ? "text-red-500" : "text-[var(--text-highlight)]"
              }`}
          >
            {leftRp}
          </p>
        </div>

        <span title={blockedReason ?? undefined}>
          <Button variant="main" onClick={onReady} disabled={isReadyDisabled}>
            READY!
          </Button>
        </span>
      </div>
      </div>
    </div>
  );
}