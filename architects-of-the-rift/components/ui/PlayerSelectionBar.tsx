"use client";

import Button from "@/components/ui/Button";
import type { Player } from "@/app/types/player";
import type { Role } from "@/app/types/champion";

type SelectedPlayers = Partial<Record<Role, Player>>;

type Props = {
  selectedPlayers: SelectedPlayers;
  leftRp: number;
  isOverBudget: boolean;
  onRemovePlayer: (role: Role) => void;
  onReady: () => void;
};

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
}: Props) {
  const allRolesFilled = roleOrder.every((role) => selectedPlayers[role]);
  const isReadyDisabled = !allRolesFilled || isOverBudget;

  return (
    <div
      className="
        fixed bottom-0 left-1/2 z-40 -translate-x-1/2
        flex w-[1120px] items-center gap-[16px]
        rounded-t-[16px] bg-[var(--bg-elevated)]
        px-[24px] py-[8px]
        shadow-[0_-8px_8px_0_rgba(0,0,0,0.20)]
      "
    >
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
                <span className="h3 text-[var(--text-secondary)]">
                  Player Name
                </span>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-[16px]">
        <div className="flex flex-col items-start gap-[4px]">
          <p className="label text-[var(--text-primary)]">LEFT RP</p>
          <p
            className={`h3 ${leftRp < 0 ? "text-red-500" : "text-[var(--text-highlight)]"
              }`}
          >
            {leftRp}
          </p>
        </div>

        <Button variant="main" onClick={onReady} disabled={isReadyDisabled}>
          READY!
        </Button>
      </div>
    </div>
  );
}