"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import IsaacCompanion from "@/components/IsaacCompanion";
import { reminders } from "@/lib/spiritual-data";
import { saveCompassionEntry, getCompassionEntries, type CompassionEntry } from "@/lib/storage";

export default function CompassionPage() {
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<CompassionEntry[]>([]);

  useEffect(() => {
    setEntries(getCompassionEntries());
  }, []);

  const handleSave = () => {
    if (!message.trim()) return;
    const entry: CompassionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      message,
    };
    saveCompassionEntry(entry);
    setEntries([entry, ...entries]);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="min-h-screen flex flex-col pb-20">
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
          <div className="animate-fade-in text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary-light)]/30 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            <IsaacCompanion message="Tes mots sont beaux, maman." />

            <div>
              <h2 className="text-2xl font-semibold mb-2">Tes mots portent la guerison</h2>
              <p className="text-[var(--text-muted)]">
                Maman, la compassion que tu t&apos;offres est une forme de force, pas de faiblesse.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <p className="text-sm italic text-[var(--foreground)]">&laquo; {message} &raquo;</p>
            </div>

            <SpiritualReminder reminder={reminders[3]} showLoop soundIndex={3} />

            <button
              onClick={() => {
                setMessage("");
                setSaved(false);
              }}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Ecrire un autre message
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
          <IsaacCompanion message="Maman, sois douce avec toi-meme." />
        </div>
        <h1 className="text-2xl font-semibold">Auto-Compassion</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Une lettre a ton passe</p>
      </header>

      <main className="flex-1 px-6 max-w-lg mx-auto w-full space-y-6">
        <div className="rounded-2xl bg-[var(--surface-warm)] p-5 text-center">
          <p className="text-base font-medium text-[var(--foreground)]">
            Maman, que te dirais-tu pendant ton moment le plus difficile ?
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Ecris avec la meme tendresse que tu offrirais a quelqu&apos;un que tu aimes.
          </p>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cher(e) moi, je veux que tu saches que..."
          className="w-full h-48 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 text-base resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50 leading-relaxed"
        />

        <button
          onClick={handleSave}
          disabled={!message.trim()}
          className={`w-full py-4 rounded-2xl text-base font-medium transition-all ${
            message.trim()
              ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
              : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
          }`}
        >
          Enregistrer le message
        </button>

        <SpiritualReminder reminder={reminders[3]} soundIndex={5} />

        {/* Past messages */}
        {entries.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-muted)]">Tes messages de compassion passes :</p>
            {entries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4"
              >
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  {new Date(entry.date).toLocaleDateString("fr-FR", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm italic">&laquo; {entry.message} &raquo;</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <NavBar />
    </div>
  );
}
