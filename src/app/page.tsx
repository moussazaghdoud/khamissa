"use client";

import Link from "next/link";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import { reminders } from "@/lib/spiritual-data";
import { useEffect, useState } from "react";
import { getRuminationTimer } from "@/lib/storage";

const feelings = [
  {
    label: "Une pensee tourne en boucle",
    description: "Vous n'arrivez pas a sortir d'une idee qui revient sans cesse.",
    href: "/interrupt",
    color: "var(--primary)",
    bgColor: "var(--primary-light)",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    action: "Commencer le reset cognitif",
  },
  {
    label: "Je me sens agite ou anxieux",
    description: "Votre esprit s'emballe et vous avez besoin de calme.",
    href: "/calm",
    color: "var(--primary)",
    bgColor: "var(--primary-light)",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    action: "Respiration & dhikr",
  },
  {
    label: "Je suis dur envers moi-meme",
    description: "Vous vous jugez, vous vous blAmez pour le passe.",
    href: "/compassion",
    color: "var(--accent)",
    bgColor: "var(--accent-light)",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    action: "Ecrire une lettre a soi-meme",
  },
  {
    label: "Je veux faire le point sur ma journee",
    description: "Prendre un moment pour voir ce qui s'est passe aujourd'hui.",
    href: "/journal",
    color: "var(--accent)",
    bgColor: "var(--accent-light)",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    action: "Ouvrir le journal",
  },
  {
    label: "Je rumine toute la journee",
    description: "Les pensees negatives ne s'arretent pas, meme quand vous essayez.",
    href: "/timer",
    color: "var(--primary)",
    bgColor: "var(--primary-light)",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    action: "Planifier un temps de reflexion",
  },
];

export default function Home() {
  const [showTimerReminder, setShowTimerReminder] = useState(false);

  useEffect(() => {
    const timer = getRuminationTimer();
    if (timer.active) {
      const now = new Date();
      const [h, m] = timer.time.split(":").map(Number);
      const start = new Date();
      start.setHours(h, m, 0, 0);
      const end = new Date(start.getTime() + timer.duration * 60000);
      if (now < start || now > end) {
        setShowTimerReminder(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <header className="text-center pt-10 pb-2 px-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
          Cognitive Reset
        </h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Guerir l&apos;esprit par la reflexion et le rappel
        </p>
      </header>

      <main className="flex-1 px-5 max-w-lg mx-auto w-full space-y-5">
        {/* Timer Reminder Banner */}
        {showTimerReminder && (
          <div className="rounded-2xl bg-[var(--accent-light)] p-4 text-center animate-fade-in">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Vous pouvez laisser cette pensee se reposer pour l&apos;instant.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Votre temps de reflexion est programme. Faites confiance au processus.
            </p>
          </div>
        )}

        {/* Guided Question */}
        <div className="rounded-2xl bg-[var(--surface-warm)] p-5 text-center">
          <p className="text-lg font-medium text-[var(--foreground)]">
            Comment vous sentez-vous en ce moment ?
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Choisissez ce qui vous correspond le mieux.
          </p>
        </div>

        {/* Feeling-based Navigation */}
        <div className="space-y-3">
          {feelings.map((feeling) => (
            <Link key={feeling.href} href={feeling.href} className="block touch-manipulation">
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 flex items-start gap-4 active:scale-[0.98] transition-transform hover:border-[var(--primary-light)]">
                <div
                  className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `color-mix(in srgb, ${feeling.bgColor} 30%, transparent)` }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={feeling.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={feeling.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--foreground)]">
                    {feeling.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                    {feeling.description}
                  </p>
                  <p className="text-xs font-medium mt-2" style={{ color: feeling.color }}>
                    {feeling.action} &rarr;
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Daily Spiritual Reminder */}
        <SpiritualReminder reminder={reminders[1]} showLoop soundIndex={1} />
      </main>

      <NavBar />
    </div>
  );
}
