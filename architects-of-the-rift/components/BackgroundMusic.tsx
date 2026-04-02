"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/components/audio/AudioContext";

const TRACKS = [
  "/music/track1.mp3",
  "/music/track2.mp3",
  "/music/track3.mp3",
  "/music/track4.mp3",
  "/music/track5.mp3",
  "/music/track6.mp3",
  "/music/track7.mp3",
  "/music/track8.mp3",
  "/music/track9.mp3",
  "/music/track10.mp3",
  "/music/track11.mp3",
  "/music/track12.mp3",
];

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted } = useAudio();
  const [trackIndex, setTrackIndex] = useState(0);
  const [hasUnlockedAudio, setHasUnlockedAudio] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
    audio.volume = 0.1;
    audio.loop = false;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const unlockAudio = async () => {
      try {
        audio.muted = isMuted;
        audio.volume = 0.1;
        await audio.play();
        setHasUnlockedAudio(true);
      } catch {
        // browserul poate bloca autoplay până la prima interacțiune
      }
    };

    const handleFirstInteraction = () => {
      void unlockAudio();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasUnlockedAudio) return;

    audio.muted = isMuted;
    audio.volume = 0.1;

    const playCurrentTrack = async () => {
      try {
        audio.load();
        await audio.play();
      } catch {
        // ignore
      }
    };

    void playCurrentTrack();
  }, [trackIndex, hasUnlockedAudio, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setTrackIndex((current) => (current + 1) % TRACKS.length);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return <audio ref={audioRef} src={TRACKS[trackIndex]} preload="auto" />;
}