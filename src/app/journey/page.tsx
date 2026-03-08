"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import IsaacCompanion from "@/components/IsaacCompanion";
import { reminders } from "@/lib/spiritual-data";
import { playDhikrSound } from "@/lib/audio";
import { getJourneyToday, completeJourneyStep, saveJournalEntry } from "@/lib/storage";

type TimeOfDay = "matin" | "midi" | "soir" | "nuit";

interface StepState {
  phase: "intro" | "breathing" | "content" | "done";
  answer?: string;
  answers?: string[];
}

const timeSlots: { key: TimeOfDay; label: string; emoji: string; hours: string }[] = [
  { key: "matin", label: "Matin — Reset mental", emoji: "☀", hours: "2 min" },
  { key: "midi", label: "Midi — Check mental", emoji: "🌤", hours: "1 min" },
  { key: "soir", label: "Soir — Realite de la journee", emoji: "🌙", hours: "3 min" },
  { key: "nuit", label: "Nuit — Apaisement", emoji: "⭐", hours: "2 min" },
];

export default function JourneyPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<TimeOfDay | null>(null);
  const [state, setState] = useState<StepState>({ phase: "intro" });
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale");
  const [audioStop, setAudioStop] = useState<(() => void) | null>(null);

  useEffect(() => {
    setCompleted(getJourneyToday());
  }, []);

  // Breathing cycle
  useEffect(() => {
    if (state.phase !== "breathing") return;
    let cancelled = false;
    const cycle = (isInhale: boolean) => {
      if (cancelled) return;
      setBreathPhase(isInhale ? "inhale" : "exhale");
      setTimeout(() => cycle(!isInhale), isInhale ? 4000 : 6000);
    };
    cycle(true);
    // Auto-advance after 20s
    const timer = setTimeout(() => setState((s) => ({ ...s, phase: "content" })), 20000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [state.phase]);

  const startStep = (key: TimeOfDay) => {
    setActiveStep(key);
    if (key === "matin" || key === "nuit") {
      setState({ phase: "breathing" });
      const { stop } = playDhikrSound(0, 10, true);
      setAudioStop(() => stop);
    } else {
      setState({ phase: "content", answer: "", answers: ["", "", ""] });
    }
  };

  const finishStep = () => {
    if (activeStep) {
      completeJourneyStep(activeStep);
      setCompleted((c) => [...c, activeStep]);

      // Save evening answers as journal entry
      if (activeStep === "soir" && state.answers) {
        saveJournalEntry({
          id: Date.now().toString(),
          date: new Date().toISOString(),
          didToday: state.answers[0],
          wentWell: state.answers[1],
          negativeThought: state.answers[2],
        });
      }
    }
    audioStop?.();
    setAudioStop(null);
    setState({ phase: "done" });
  };

  const closeStep = () => {
    audioStop?.();
    setAudioStop(null);
    setActiveStep(null);
    setState({ phase: "intro" });
  };

  // Determine suggested time slot based on current hour
  const hour = new Date().getHours();
  const suggested: TimeOfDay = hour < 12 ? "matin" : hour < 14 ? "midi" : hour < 21 ? "soir" : "nuit";

  // Active step view
  if (activeStep) {
    return (
      <div className="min-h-screen flex flex-col pb-20">
        <div className="px-6 pt-6">
          <button onClick={closeStep} className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors touch-manipulation">
            &larr; Retour au parcours
          </button>
        </div>

        <main className="flex-1 px-6 py-6 max-w-lg mx-auto w-full">
          {/* DONE */}
          {state.phase === "done" && (
            <div className="animate-fade-in text-center space-y-6 mt-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary-light)]/30 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <p className="text-xl font-semibold">Bravo</p>
              <p className="text-sm text-[var(--text-muted)]">
                {activeStep === "matin" && "Maman, ta journee commence avec clarte et intention."}
                {activeStep === "midi" && "Maman, tu as pris un moment pour verifier ton esprit. Bravo."}
                {activeStep === "soir" && "Alhamdulillah pour les petites victoires du jour, maman."}
                {activeStep === "nuit" && "Maman, que ta nuit soit paisible et reparatrice."}
              </p>
              <SpiritualReminder
                reminder={activeStep === "nuit" ? reminders[1] : reminders[0]}
                showLoop
                soundIndex={activeStep === "nuit" ? 1 : 0}
              />
              <button onClick={closeStep} className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-medium touch-manipulation">
                Retour au parcours
              </button>
            </div>
          )}

          {/* BREATHING (matin & nuit) */}
          {state.phase === "breathing" && (
            <div className="animate-fade-in text-center space-y-6 mt-8">
              <p className="text-sm text-[var(--text-muted)]">
                {activeStep === "matin" ? "Maman, prenons un moment pour commencer la journee." : "Maman, preparons ton esprit pour le repos."}
              </p>
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full transition-all ease-in-out ${
                  breathPhase === "inhale"
                    ? "scale-100 duration-[4000ms]"
                    : "scale-75 duration-[6000ms]"
                }`} style={{ backgroundColor: breathPhase === "inhale" ? "var(--inhale-bg)" : "var(--exhale-bg)" }} />
                <p className="relative z-10 text-lg font-semibold transition-colors duration-[2000ms]"
                  style={{ color: breathPhase === "inhale" ? "var(--inhale)" : "var(--exhale)" }}
                >
                  {breathPhase === "inhale" ? "Inspire..." : "Expire..."}
                </p>
              </div>
              <button
                onClick={() => setState((s) => ({ ...s, phase: "content", answer: "" }))}
                className="text-sm text-[var(--primary)] font-medium touch-manipulation"
              >
                Continuer &rarr;
              </button>
            </div>
          )}

          {/* CONTENT — varies by time of day */}
          {state.phase === "content" && (
            <div className="animate-fade-in space-y-5" key={activeStep}>
              {/* MATIN */}
              {activeStep === "matin" && (
                <>
                  <h2 className="text-xl font-semibold">Maman, quelle est une petite chose que tu peux faire aujourd&apos;hui ?</h2>
                  <p className="text-sm text-[var(--text-muted)]">Pas besoin de viser grand. Un tout petit pas suffit.</p>
                  <textarea
                    value={state.answer || ""}
                    onChange={(e) => setState((s) => ({ ...s, answer: e.target.value }))}
                    placeholder="Aujourd'hui, je peux..."
                    className="w-full h-28 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-base resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
                  />
                  <SpiritualReminder reminder={reminders[0]} soundIndex={0} />
                  <button onClick={finishStep} className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-medium touch-manipulation">
                    Terminer
                  </button>
                </>
              )}

              {/* MIDI */}
              {activeStep === "midi" && (
                <>
                  <h2 className="text-xl font-semibold">Maman, ton esprit est-il bloque sur une pensee ?</h2>
                  <p className="text-sm text-[var(--text-muted)]">Prends un instant pour observer ton etat mental.</p>
                  <div className="space-y-3">
                    <Link href="/interrupt" onClick={() => { audioStop?.(); }}>
                      <div className="rounded-2xl bg-[var(--primary)] text-white p-4 text-center font-medium touch-manipulation">
                        Oui — lancer le reset cognitif
                      </div>
                    </Link>
                    <button onClick={finishStep} className="w-full py-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] font-medium text-[var(--foreground)] touch-manipulation">
                      Non — tout va bien pour l&apos;instant
                    </button>
                  </div>
                  <SpiritualReminder reminder={reminders[2]} soundIndex={2} />
                </>
              )}

              {/* SOIR */}
              {activeStep === "soir" && (
                <>
                  <h2 className="text-xl font-semibold">Realite de la journee</h2>
                  <p className="text-sm text-[var(--text-muted)]">Maman, ancre-toi dans ce qui s&apos;est reellement passe.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Maman, qu&apos;as-tu fait aujourd&apos;hui ?</label>
                      <textarea
                        value={state.answers?.[0] || ""}
                        onChange={(e) => setState((s) => {
                          const a = [...(s.answers || ["", "", ""])];
                          a[0] = e.target.value;
                          return { ...s, answers: a };
                        })}
                        placeholder="Meme les petites choses comptent..."
                        className="w-full h-20 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-sm resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Maman, qu&apos;est-ce qui s&apos;est mieux passe que prevu ?</label>
                      <textarea
                        value={state.answers?.[1] || ""}
                        onChange={(e) => setState((s) => {
                          const a = [...(s.answers || ["", "", ""])];
                          a[1] = e.target.value;
                          return { ...s, answers: a };
                        })}
                        placeholder="Il y a eu un moment ou..."
                        className="w-full h-20 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-sm resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Maman, quelle pensee negative a essaye de te tromper aujourd&apos;hui ?</label>
                      <textarea
                        value={state.answers?.[2] || ""}
                        onChange={(e) => setState((s) => {
                          const a = [...(s.answers || ["", "", ""])];
                          a[2] = e.target.value;
                          return { ...s, answers: a };
                        })}
                        placeholder="La pensee qui disait que..."
                        className="w-full h-20 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-sm resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
                      />
                    </div>
                  </div>
                  <button onClick={finishStep} className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-medium touch-manipulation">
                    Enregistrer
                  </button>
                </>
              )}

              {/* NUIT */}
              {activeStep === "nuit" && (
                <>
                  <h2 className="text-xl font-semibold">Moment d&apos;apaisement</h2>
                  <p className="text-sm text-[var(--text-muted)]">Maman, laisse les pensees de la journee se poser doucement.</p>
                  <SpiritualReminder reminder={reminders[1]} showLoop soundIndex={1} />
                  <button onClick={finishStep} className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-medium touch-manipulation">
                    Bonne nuit
                  </button>
                </>
              )}
            </div>
          )}
        </main>
        <NavBar />
      </div>
    );
  }

  // Main journey overview
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="pt-8 pb-4 px-6 text-center">
        <div className="flex justify-center mb-3">
          <IsaacCompanion message="Maman, suivons le parcours ensemble." />
        </div>
        <h1 className="text-2xl font-semibold">Parcours du Jour</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Un guide simple pour chaque moment de la journee</p>
      </header>

      <main className="flex-1 px-6 max-w-lg mx-auto w-full space-y-4">
        {timeSlots.map((slot) => {
          const done = completed.includes(slot.key);
          const isSuggested = slot.key === suggested && !done;

          return (
            <button
              key={slot.key}
              onClick={() => !done && startStep(slot.key)}
              disabled={done}
              className={`w-full rounded-2xl p-5 text-left transition-all touch-manipulation ${
                done
                  ? "bg-[var(--surface-warm)] border border-[var(--border)] opacity-60"
                  : isSuggested
                  ? "bg-[var(--primary)] text-white shadow-lg"
                  : "bg-[var(--surface)] border border-[var(--border)] active:scale-[0.98]"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{slot.emoji}</span>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isSuggested ? "text-white" : done ? "text-[var(--text-muted)]" : ""}`}>
                    {slot.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isSuggested ? "text-white/70" : "text-[var(--text-muted)]"}`}>
                    {slot.hours}
                  </p>
                </div>
                {done ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                ) : isSuggested ? (
                  <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Maintenant</span>
                ) : null}
              </div>
            </button>
          );
        })}

        <div className="rounded-2xl bg-[var(--surface-warm)] p-4 text-center text-sm text-[var(--text-muted)]">
          <p>Maman, complete chaque etape a ton rythme.</p>
          <p className="mt-1">Pas de pression. Chaque petit pas compte.</p>
        </div>
      </main>

      <NavBar />
    </div>
  );
}
