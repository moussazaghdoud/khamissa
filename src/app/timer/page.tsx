"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import { reminders } from "@/lib/spiritual-data";
import { getRuminationTimer, saveRuminationTimer } from "@/lib/storage";

export default function TimerPage() {
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(20);
  const [active, setActive] = useState(false);
  const [isWithinWindow, setIsWithinWindow] = useState(false);

  useEffect(() => {
    const timer = getRuminationTimer();
    setTime(timer.time);
    setDuration(timer.duration);
    setActive(timer.active);
    checkWindow(timer.time, timer.duration, timer.active);
  }, []);

  const checkWindow = (t: string, d: number, a: boolean) => {
    if (!a) {
      setIsWithinWindow(false);
      return;
    }
    const now = new Date();
    const [h, m] = t.split(":").map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + d * 60000);
    setIsWithinWindow(now >= start && now <= end);
  };

  const handleToggle = () => {
    const newActive = !active;
    setActive(newActive);
    saveRuminationTimer({ time, duration, active: newActive });
    checkWindow(time, duration, newActive);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    saveRuminationTimer({ time: newTime, duration, active });
    checkWindow(newTime, duration, active);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    saveRuminationTimer({ time, duration: newDuration, active });
    checkWindow(time, newDuration, active);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="pt-10 pb-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Minuteur de Rumination</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Planifiez un moment precis pour les pensees difficiles
        </p>
      </header>

      <main className="flex-1 px-6 max-w-lg mx-auto w-full space-y-6">
        <div className="rounded-2xl bg-[var(--surface-warm)] p-5 text-center">
          <p className="text-sm text-[var(--foreground)] leading-relaxed">
            Au lieu de ruminer toute la journee, accordez a vos inquietudes une fenetre de temps precise.
            En dehors de ce moment, rappelez-vous doucement : la pensee peut attendre.
          </p>
        </div>

        {/* Status banner */}
        {active && (
          <div
            className={`rounded-2xl p-4 text-center animate-fade-in ${
              isWithinWindow
                ? "bg-[var(--primary-light)]/30 border border-[var(--primary-light)]"
                : "bg-[var(--accent-light)] border border-[var(--accent)]"
            }`}
          >
            {isWithinWindow ? (
              <>
                <p className="text-sm font-medium text-[var(--primary-dark)]">
                  C&apos;est votre temps de reflexion.
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Permettez-vous de traiter vos pensees, puis lachez prise quand le temps sera ecoule.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Vous pouvez laisser cette pensee se reposer pour l&apos;instant.
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Votre temps de reflexion est a {time} pendant {duration} minutes.
                </p>
              </>
            )}
          </div>
        )}

        {/* Settings */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] block mb-2">
                Heure de reflexion
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] px-4 py-3 text-base focus:outline-none focus:border-[var(--primary-light)] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--foreground)] block mb-2">
                Duree : {duration} minutes
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={duration}
                onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)]">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggle}
            className={`w-full py-4 rounded-2xl text-base font-medium transition-all ${
              active
                ? "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/80"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
            }`}
          >
            {active ? "Desactiver le minuteur" : "Activer le minuteur"}
          </button>
        </div>

        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 text-sm text-[var(--text-muted)] leading-relaxed">
          <p className="font-medium text-[var(--foreground)] mb-2">Comment ca marche :</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Definissez un moment precis pour traiter les pensees difficiles</li>
            <li>En dehors de cette fenetre, l&apos;application vous rappelle doucement de lacher prise</li>
            <li>Cela entraine votre cerveau a comprendre que les soucis ont un temps et un lieu</li>
            <li>Progressivement, la rumination en dehors de la fenetre diminue</li>
          </ul>
        </div>

        {!isWithinWindow && active && (
          <SpiritualReminder reminder={reminders[2]} showLoop />
        )}
      </main>

      <NavBar />
    </div>
  );
}
