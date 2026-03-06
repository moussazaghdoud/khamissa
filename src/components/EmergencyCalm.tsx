"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { reminders } from "@/lib/spiritual-data";
import { playDhikrSound } from "@/lib/audio";

type Phase = "breathing" | "dhikr" | "grounding" | "reminder";

const INHALE = 4000;
const EXHALE = 6000;
const BREATHING_DURATION = 30000; // 30s of breathing before auto-advance

export default function EmergencyCalm() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("breathing");
  const [breathState, setBreathState] = useState<"inhale" | "exhale">("inhale");
  const [groundingText, setGroundingText] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const stopAudioRef = useRef<(() => void) | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    stopAudioRef.current?.();
    setAudioPlaying(false);
    if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
  }, []);

  const startBreathing = useCallback(() => {
    let cancelled = false;

    const cycle = (isInhale: boolean) => {
      if (cancelled) return;
      setBreathState(isInhale ? "inhale" : "exhale");
      breathTimerRef.current = setTimeout(
        () => cycle(!isInhale),
        isInhale ? INHALE : EXHALE
      );
    };

    cycle(true);

    // Auto-advance after 30s
    autoAdvanceRef.current = setTimeout(() => {
      setPhase("dhikr");
    }, BREATHING_DURATION);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    if (phase === "breathing") {
      const cancel = startBreathing();
      return () => {
        cancel();
        if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      };
    }
  }, [open, phase, startBreathing]);

  const handleOpen = () => {
    setOpen(true);
    setPhase("breathing");
    setBreathState("inhale");
    setGroundingText("");
  };

  const handleClose = () => {
    cleanup();
    setOpen(false);
  };

  const toggleAudio = () => {
    if (audioPlaying) {
      stopAudioRef.current?.();
      setAudioPlaying(false);
    } else {
      const { stop } = playDhikrSound(0, 7, true);
      stopAudioRef.current = stop;
      setAudioPlaying(true);
    }
  };

  const nextPhase = () => {
    cleanup();
    if (phase === "breathing") setPhase("dhikr");
    else if (phase === "dhikr") setPhase("grounding");
    else if (phase === "grounding") setPhase("reminder");
  };

  // The Quranic reminder for the final step
  const finalReminder = reminders[2]; // "Whoever relies upon Allah..."

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-20 right-4 z-50 bg-[var(--accent)] text-white px-4 py-3 rounded-full shadow-lg text-sm font-medium hover:bg-[var(--accent)]/85 transition-all animate-pulse-glow"
        style={{ boxShadow: "0 4px 20px rgba(212, 165, 116, 0.4)" }}
      >
        Je suis mal
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--background)] flex flex-col items-center justify-center px-6">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="max-w-md w-full text-center space-y-8 animate-fade-in" key={phase}>
        {/* Phase 1: Breathing */}
        {phase === "breathing" && (
          <>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full transition-all ease-in-out ${
                  breathState === "inhale"
                    ? "scale-100 bg-[var(--primary-light)]/40 duration-[4000ms]"
                    : "scale-75 bg-[var(--primary-light)]/25 duration-[6000ms]"
                }`}
              />
              <p className="relative z-10 text-lg font-medium text-[var(--primary-dark)]">
                {breathState === "inhale" ? "Inspirez..." : "Expirez..."}
              </p>
            </div>

            <div>
              <p className="text-[var(--text-muted)] text-sm">
                Concentrez-vous uniquement sur votre souffle.
              </p>
              <p className="text-[var(--text-muted)] text-xs mt-1">
                4 secondes inspirer / 6 secondes expirer
              </p>
            </div>

            <button
              onClick={nextPhase}
              className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors font-medium"
            >
              Continuer &rarr;
            </button>
          </>
        )}

        {/* Phase 2: Dhikr */}
        {phase === "dhikr" && (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-2">Ecoutez, respirez</h2>
              <p className="text-[var(--text-muted)] text-sm">
                Laissez le dhikr apaiser votre esprit.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-3xl" dir="rtl">سبحان الله</p>
              <p className="text-[var(--text-muted)]">SubhanAllah - Alhamdulillah - Allahu Akbar</p>
            </div>

            <button
              onClick={toggleAudio}
              className={`mx-auto flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                audioPlaying
                  ? "bg-[var(--primary)] text-white audio-playing"
                  : "bg-[var(--primary-light)] text-[var(--primary-dark)] hover:bg-[var(--primary)] hover:text-white"
              }`}
            >
              {audioPlaying ? (
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
                  Ecouter le dhikr
                </>
              )}
            </button>

            <button
              onClick={nextPhase}
              className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors font-medium"
            >
              Continuer &rarr;
            </button>
          </>
        )}

        {/* Phase 3: Grounding */}
        {phase === "grounding" && (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Quelle pensee vous fait mal en ce moment ?
              </h2>
              <p className="text-[var(--text-muted)] text-sm">
                Ecrivez-la pour la sortir de votre esprit.
              </p>
            </div>

            <textarea
              value={groundingText}
              onChange={(e) => setGroundingText(e.target.value)}
              placeholder="En ce moment, je ressens..."
              className="w-full h-28 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-base resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
              autoFocus
            />

            <div className="rounded-2xl bg-[var(--surface-warm)] p-4">
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Les emotions intenses peuvent deformer notre perception.
                Ce que vous ressentez est reel, mais la pensee qui l&apos;accompagne n&apos;est peut-etre pas la realite.
              </p>
            </div>

            <button
              onClick={nextPhase}
              className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] transition-colors"
            >
              Continuer
            </button>
          </>
        )}

        {/* Phase 4: Reminder */}
        {phase === "reminder" && (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary-light)]/30 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            <div className="rounded-2xl bg-[var(--surface-warm)] p-6 space-y-3">
              <p className="text-2xl leading-relaxed font-medium" dir="rtl">
                {finalReminder.arabic}
              </p>
              <p className="text-[var(--foreground)] text-base italic">
                &laquo; {finalReminder.french} &raquo;
              </p>
              <p className="text-[var(--text-muted)] text-sm">({finalReminder.reference})</p>
            </div>

            <div>
              <p className="text-[var(--foreground)] font-medium mb-1">
                Vous avez fait preuve de courage.
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Demander de l&apos;aide, meme a soi-meme, est un acte de force.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] transition-colors"
            >
              Retourner au parcours
            </button>
          </>
        )}
      </div>
    </div>
  );
}
