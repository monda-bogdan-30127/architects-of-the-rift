import Image from "next/image";
import type { Player } from "@/app/types/player";
import { teams } from "@/app/data/teams";
import { champions } from "@/app/data/champions";

type Props = {
    player: Player;
    onClick?: () => void;
    disabled?: boolean;
    selected?: boolean;
};

export default function PlayerCard({
    player,
    onClick,
    disabled = false,
    selected = false,
}: Props) {
    const team =
        player.teamId === "free-agent"
            ? null
            : teams.find((item) => item.id === player.teamId);

    const teamName =
        player.teamId === "free-agent"
            ? "Free Agent"
            : team?.name ?? "Unknown Team";

    const bestChampions = player.bestChampions
        .map((championId) =>
            champions.find((champion) => champion.id === championId)
        )
        .filter(
            (champion): champion is NonNullable<typeof champion> => Boolean(champion)
        )
        .slice(0, 3);

    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`
        relative flex w-[262px] flex-col items-center rounded-[16px] bg-[var(--bg-elevated)] p-[24px]
        text-left transition-all
        ${disabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer hover:bg-[#232636]"
                }
        ${selected ? "border border-[var(--text-highlight)]" : "border border-transparent"}
      `}
        >
            <div className="absolute left-0 top-0 flex flex-col rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] bg-[var(--bg-surface)] px-[8px] py-[8px]">
                <span className="text-center font-[var(--font-spiegel)] text-[18px] leading-none text-[#D9B96E]">
                    {player.rosterPoints}
                </span>
                <span className="mt-[8px] text-center font-[var(--font-spiegel)] text-[12px] uppercase leading-[1.05] text-[var(--text-secondary)]">
                    Roster
                    <br />
                    Points
                </span>
            </div>

            <div className="flex h-[180px] w-full items-end justify-center overflow-hidden">
                <div className="relative h-[180px] w-[191px]">
                    <Image
                        src={player.image}
                        alt={player.name}
                        fill
                        className="object-contain object-bottom"
                        sizes="191px"
                    />
                </div>
            </div>

            <div className="h-px w-full bg-[var(--divider)]" />

            <div className="flex w-full flex-col items-center gap-[8px] pt-[16px] text-center">
                <h3 className="h3 text-[var(--text-primary)]">{player.name}</h3>

                <p className="label text-[var(--text-primary)]">
                    {teamName} - {player.role.toUpperCase()}
                </p>

                <div className="mt-[8px] grid w-full grid-cols-2 gap-x-[16px] gap-y-[8px] text-left">
                    <div className="body-large text-[var(--text-primary)]">
                        MEC {player.stats.mec}
                    </div>
                    <div className="body-large text-[var(--text-primary)]">
                        MAC {player.stats.mac}
                    </div>
                    <div className="body-large text-[var(--text-primary)]">
                        TFG {player.stats.tfg}
                    </div>
                    <div className="body-large text-[var(--text-primary)]">
                        CLT {player.stats.clt}
                    </div>
                    <div className="body-large text-[var(--text-primary)]">
                        CON {player.stats.con}
                    </div>
                    <div className="body-large text-[var(--text-primary)]">
                        IQ {player.stats.iq}
                    </div>
                </div>

                <div className="mt-[8px] flex w-full items-center gap-[16px]">
                    <span className="label whitespace-nowrap text-[var(--text-primary)]">
                        BEST CHAMPS
                    </span>

                    <div className="flex flex-1 items-center justify-end gap-[16px]">
                        {bestChampions.map((champion) => (
                            <div
                                key={champion.id}
                                className="relative h-[28.33px] w-[28.33px] overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)]"
                            >
                                <Image
                                    src={champion.image}
                                    alt={champion.name}
                                    fill
                                    className="object-contain"
                                    sizes="28px"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </button>
    );
}
