import Image from "next/image";
import { Region } from "../../app/types/region";

type Props = {
  region: Region;
  onClick: () => void;
};

export default function RegionCard({ region, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        w-[240px]
        flex-col
        items-center
        rounded-[16px]
        bg-[var(--bg-elevated)]
        p-[24px]
        transition-all
        hover:bg-[#232636]
      "
    >
      {/* Logo */}
      <div className="flex h-[120px] w-full items-center justify-center">
        <Image
          src={region.logo}
          alt={region.name}
          width={160}
          height={100}
          className="max-h-[100px] w-auto object-contain"
        />
      </div>

      {/* Divider */}
      <div className="w-full border-t border-[var(--divider)]" />

      {/* Text section */}
      <div className="flex w-full flex-col items-center justify-center gap-[8px] pt-[16px]">
        <p className="h3 text-center text-[var(--text-primary)]">
          {region.name}
        </p>

        <p className="body-small text-center text-[var(--text-secondary)]">
          {region.server}
        </p>

        <p className="body-small text-center text-[var(--text-muted)]">
          {region.teams} Teams
        </p>
      </div>
    </button>
  );
}