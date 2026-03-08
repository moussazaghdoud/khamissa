"use client";

import { useState, useRef, useEffect } from "react";
import NavBar from "@/components/NavBar";
import IsaacCompanion from "@/components/IsaacCompanion";
import { dhikrItems } from "@/lib/spiritual-data";
import { playDhikrSound, playTondeuse } from "@/lib/audio";

export default function CalmPage() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [dhikrIndex, setDhikrIndex] = useState(0);
  const [seconds, setSeconds] = useState(120);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [tondeuseOn, setTondeuseOn] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const tondeuseRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSession = () => {
    setActive(true);
    setSeconds(120);

    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          endSession();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    let breathPhase = 0;
    const phases: ["inhale", "hold", "exhale"] = ["inhale", "hold", "exhale"];
    const durations = [4000, 4000, 6000];

    const runBreathCycle = () => {
      setPhase(phases[breathPhase]);
      breathRef.current = setTimeout(() => {
        breathPhase = (breathPhase + 1) % 3;
        runBreathCycle();
      }, durations[breathPhase]) as unknown as ReturnType<typeof setInterval>;
    };
    runBreathCycle();
  };

  const endSession = () => {
    setActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathRef.current) clearTimeout(breathRef.current as unknown as ReturnType<typeof setTimeout>);
    stopRef.current?.();
    tondeuseRef.current?.();
    setAudioPlaying(false);
    setTondeuseOn(false);
  };

  const toggleAudio = () => {
    if (audioPlaying) {
      stopRef.current?.();
      setAudioPlaying(false);
    } else {
      const { stop } = playDhikrSound(dhikrIndex, 7, true);
      stopRef.current = stop;
      setAudioPlaying(true);
    }
  };

  const toggleTondeuse = () => {
    if (tondeuseOn) {
      tondeuseRef.current?.();
      setTondeuseOn(false);
    } else {
      const { stop } = playTondeuse(0.35);
      tondeuseRef.current = stop;
      setTondeuseOn(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathRef.current) clearTimeout(breathRef.current as unknown as ReturnType<typeof setTimeout>);
      stopRef.current?.();
      tondeuseRef.current?.();
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const currentDhikr = dhikrItems[dhikrIndex];

  if (!active) {
    return (
      <div className="min-h-screen flex flex-col pb-20">
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
          <div className="text-center space-y-8 animate-fade-in">
            <IsaacCompanion message="Maman, respire avec moi." />

            <div>
              <h1 className="text-2xl font-semibold mb-2">Mode Calme</h1>
              <p className="text-[var(--text-muted)] text-sm">
                2 minutes de respiration guidee avec dhikr
              </p>
            </div>

            {/* Dhikr selection */}
            <div className="space-y-3">
              {dhikrItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setDhikrIndex(i)}
                  className={`w-full rounded-2xl p-4 text-center transition-all border ${
                    i === dhikrIndex
                      ? "border-[var(--primary)] bg-[var(--primary-light)]/20"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary-light)]"
                  }`}
                >
                  <p className="text-xl" dir="rtl">{item.arabic}</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{item.transliteration}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.meaning}</p>
                </button>
              ))}
            </div>

            <button
              onClick={startSession}
              className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-medium text-base hover:bg-[var(--primary-dark)] transition-colors"
            >
              Commencer la session
            </button>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0ede8]">
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Timer */}
        <p className="absolute top-8 text-[var(--text-muted)] text-sm font-medium">
          {formatTime(seconds)}
        </p>

        {/* Breathing circle */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out ${
              phase === "inhale"
                ? "scale-100"
                : phase === "hold"
                ? "scale-100"
                : "scale-75"
            }`}
            style={{ backgroundColor: phase === "inhale" ? "var(--inhale-bg)" : "var(--exhale-bg)" }}
          />
          <div className="relative text-center z-10">
            <p className="text-lg font-semibold capitalize mb-3 transition-colors duration-[2000ms]"
              style={{ color: phase === "inhale" ? "var(--inhale)" : "var(--exhale)" }}
            >
              {phase === "inhale" ? "Inspire..." : phase === "hold" ? "Retiens..." : "Expire..."}
            </p>
            <p className="text-2xl" dir="rtl">{currentDhikr.arabic}</p>
            <p className="text-sm text-[var(--text-muted)] mt-2">{currentDhikr.transliteration}</p>
          </div>
        </div>

        {/* Audio toggles */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={toggleAudio}
            className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
              audioPlaying
                ? "bg-[var(--primary)] text-white audio-playing"
                : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary-light)]"
            }`}
          >
            {audioPlaying ? "Couper le dhikr" : "Dhikr"}
          </button>

          <button
            onClick={toggleTondeuse}
            className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
              tondeuseOn
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-light)]"
            }`}
          >
            {tondeuseOn ? "Couper tondeuse" : "Tondeuse"}
          </button>

          <button
            onClick={endSession}
            className="px-5 py-3 rounded-full text-sm font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}
