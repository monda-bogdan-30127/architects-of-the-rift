"use client";

import Image from "next/image";
import { useAudio } from "@/components/audio/AudioContext";

export default function SoundToggle() {
  const { isMuted, toggleMuted } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-label={isMuted ? "Turn sound on" : "Mute sound"}
      style={{
        position: "fixed",
        bottom: "96px",
        right: "calc((100vw - 1120px) / 2 + 48px)",
        zIndex: 50,
      }}
      className="
        flex items-center justify-center
        rounded-[12px]
        bg-[var(--primary)]
        p-[12px]
        transition-opacity hover:opacity-90 active:opacity-80
      "
    >
      <Image
        src={isMuted ? "/svg/volume-off.svg" : "/svg/volume-on.svg"}
        alt=""
        width={24}
        height={24}
        className="h-[24px] w-[24px] object-contain"
      />
    </button>
  );
}