"use client";

import { createContext, useContext, useMemo, useState } from "react";

type AudioContextValue = {
  isMuted: boolean;
  toggleMuted: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMuted, setIsMuted] = useState(false);

  const value = useMemo(
    () => ({
      isMuted,
      toggleMuted: () => setIsMuted((current) => !current),
    }),
    [isMuted]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used inside AudioProvider");
  }

  return context;
}