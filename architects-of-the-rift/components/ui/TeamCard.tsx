import Image from "next/image";
import { Team } from "../../app/types/team";

type Props = {
  team: Team;
  onClick: () => void;
};

export default function TeamCard({ team, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        h-[217px]
        w-full
        flex-col
        items-center
        rounded-[16px]
        bg-[var(--bg-elevated)]
        p-[24px]
        transition-all
        hover:bg-[#232636]
      "
    >
      <div className="flex h-[96px] w-full items-center justify-center">
        <Image
          src={team.logo}
          alt={team.name}
          width={88}
          height={88}
          className="max-h-[88px] w-auto object-contain"
        />
      </div>

      <div className="mt-[8px] w-full border-t border-[var(--divider)]" />

      <div className="mt-[16px] flex flex-1 items-center justify-center">
        <p className="h3 text-center leading-tight text-[var(--text-primary)]">
          {team.name}
        </p>
      </div>
    </button>
  );
}