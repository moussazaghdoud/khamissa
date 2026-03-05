"use client";

import { useState, useRef } from "react";
import type { SpiritualReminder as SpiritualReminderType } from "@/lib/spiritual-data";
import { playDhikrTone } from "@/lib/audio";

interface Props {
  reminder: SpiritualReminderType;
  showLoop?: boolean;
}

export default function SpiritualReminder({ reminder, showLoop = false }: Props) {
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  const handlePlay = () => {
    if (playing) {
      stopRef.current?.();
      setPlaying(false);
      setLooping(false);
      return;
    }
    setPlaying(true);
    const { stop } = playDhikrTone(6, looping);
    stopRef.current = stop;
    if (!looping) {
      setTimeout(() => setPlaying(false), 6000);
    }
  };

  const handleLoop = () => {
    if (looping) {
      stopRef.current?.();
      setPlaying(false);
      setLooping(false);
      return;
    }
    setLooping(true);
    setPlaying(true);
    const { stop } = playDhikrTone(6, true);
    stopRef.current = stop;
  };

  return (
    <div className="rounded-2xl bg-[var(--surface-warm)] p-5 text-center animate-fade-in">
      <p className="text-2xl leading-relaxed mb-2 font-medium" dir="rtl">
        {reminder.arabic}
      </p>
      <p className="text-[var(--foreground)] text-base italic mb-1">
        &laquo; {reminder.french} &raquo;
      </p>
      <p className="text-[var(--text-muted)] text-sm mb-4">({reminder.reference})</p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handlePlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            playing
              ? "bg-[var(--primary)] text-white audio-playing"
              : "bg-[var(--primary-light)] text-[var(--primary-dark)] hover:bg-[var(--primary)] hover:text-white"
          }`}
        >
          {playing ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Arreter
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Ecouter
            </>
          )}
        </button>

        {showLoop && (
          <button
            onClick={handleLoop}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              looping
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--accent-light)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 2l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 22l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            {looping ? "Arreter la boucle" : "Boucle"}
          </button>
        )}
      </div>
    </div>
  );
}
