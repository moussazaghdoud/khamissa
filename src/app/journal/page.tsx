"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import IsaacCompanion from "@/components/IsaacCompanion";
import { reminders } from "@/lib/spiritual-data";
import { saveJournalEntry, getJournalEntries, type JournalEntry } from "@/lib/storage";

export default function JournalPage() {
  const [didToday, setDidToday] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [negativeThought, setNegativeThought] = useState("");
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  const handleSave = () => {
    if (!didToday.trim() && !wentWell.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      didToday,
      wentWell,
      negativeThought,
    };
    saveJournalEntry(entry);
    setEntries([entry, ...entries]);
    setSaved(true);
  };

  const handleNew = () => {
    setDidToday("");
    setWentWell("");
    setNegativeThought("");
    setSaved(false);
  };

  if (saved) {
    return (
      <div className="min-h-screen flex flex-col pb-20">
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
          <div className="animate-fade-in text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--accent-light)]/30 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            <IsaacCompanion message="Merci maman d'avoir ecrit tout ca." />

            <div>
              <h2 className="text-2xl font-semibold mb-2">Alhamdulillah pour les bienfaits d&apos;aujourd&apos;hui</h2>
              <p className="text-[var(--text-muted)]">
                Ta reflexion a ete enregistree. Chaque petit pas compte, maman.
              </p>
            </div>

            <SpiritualReminder reminder={reminders[3]} showLoop soundIndex={3} />

            <button
              onClick={handleNew}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Ecrire une autre entree
            </button>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="pt-8 pb-4 px-6 text-center">
        <div className="flex justify-center mb-3">
          <IsaacCompanion message="Maman, raconte-moi ta journee." />
        </div>
        <h1 className="text-2xl font-semibold">Journal de Realite Quotidien</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Ancre-toi dans ce qui est reel</p>
      </header>

      <main className="flex-1 px-6 max-w-lg mx-auto w-full space-y-5">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
              Maman, qu&apos;as-tu fait aujourd&apos;hui ?
            </label>
            <textarea
              value={didToday}
              onChange={(e) => setDidToday(e.target.value)}
              placeholder="Meme les petites choses comptent..."
              className="w-full h-24 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-sm resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
              Maman, quelle petite chose s&apos;est bien passee aujourd&apos;hui ?
            </label>
            <textarea
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="Cela peut etre tres simple..."
              className="w-full h-24 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-sm resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
              Maman, quelle pensee negative est apparue aujourd&apos;hui ?
            </label>
            <textarea
              value={negativeThought}
              onChange={(e) => setNegativeThought(e.target.value)}
              placeholder="Ecris-la ici pour la liberer..."
              className="w-full h-24 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-sm resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!didToday.trim() && !wentWell.trim()}
          className={`w-full py-4 rounded-2xl text-base font-medium transition-all ${
            didToday.trim() || wentWell.trim()
              ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
              : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
          }`}
        >
          Enregistrer
        </button>

        {/* History */}
        {entries.length > 0 && (
          <div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showHistory ? "Masquer" : "Afficher"} les entrees passees ({entries.length})
            </button>

            {showHistory && (
              <div className="mt-3 space-y-3">
                {entries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-2"
                  >
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(entry.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {entry.wentWell && (
                      <p className="text-sm">
                        <span className="text-[var(--primary)] font-medium">Bien passe : </span>
                        {entry.wentWell}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <NavBar />
    </div>
  );
}
