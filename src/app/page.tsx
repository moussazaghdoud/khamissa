"use client";

import Link from "next/link";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import { reminders } from "@/lib/spiritual-data";
import { useEffect, useState } from "react";
import { getRuminationTimer } from "@/lib/storage";

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
      <header className="text-center pt-12 pb-6 px-6">
        <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight">
          Cognitive Reset
        </h1>
        <p className="text-[var(--text-muted)] mt-2 text-base">
          Guerir l&apos;esprit par la reflexion et le rappel
        </p>
      </header>

      <main className="flex-1 px-5 max-w-lg mx-auto w-full space-y-6">
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

        {/* Main CTA Button */}
        <Link href="/interrupt" className="block">
          <div className="rounded-3xl bg-[var(--primary)] p-8 text-center text-white animate-pulse-glow cursor-pointer hover:bg-[var(--primary-dark)] transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-xl font-semibold mb-1">Je suis bloque dans une pensee</p>
            <p className="text-white/70 text-sm">Commencer le reset cognitif guide</p>
          </div>
        </Link>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/calm">
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 text-center hover:border-[var(--primary-light)] transition-colors cursor-pointer">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[var(--primary-light)]/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="font-medium text-sm">Mode Calme</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Respiration & dhikr</p>
            </div>
          </Link>

          <Link href="/journal">
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 text-center hover:border-[var(--primary-light)] transition-colors cursor-pointer">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[var(--accent-light)]/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="font-medium text-sm">Journal Quotidien</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Ancrage dans le reel</p>
            </div>
          </Link>

          <Link href="/compassion">
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 text-center hover:border-[var(--primary-light)] transition-colors cursor-pointer">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[var(--primary-light)]/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-medium text-sm">Auto-Compassion</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Lettre a soi-meme</p>
            </div>
          </Link>

          <Link href="/timer">
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 text-center hover:border-[var(--primary-light)] transition-colors cursor-pointer">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[var(--accent-light)]/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium text-sm">Minuteur de Pensee</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Planifier le temps d&apos;inquietude</p>
            </div>
          </Link>
        </div>

        {/* Daily Spiritual Reminder */}
        <SpiritualReminder reminder={reminders[1]} showLoop />
      </main>

      <NavBar />
    </div>
  );
}
