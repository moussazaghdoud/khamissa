"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import { reminders } from "@/lib/spiritual-data";
import { saveIsaacEntry } from "@/lib/storage";

const exercises = [
  {
    title: "Reconnaitre la realite",
    question: "Pendant la periode difficile, quelles sont les choses que vous avez quand meme faites pour Isaac ?",
    placeholder: "Je me souviens que j'ai...",
    message: "Vous etiez malade et vous avez quand meme pris soin de votre enfant. Cela s'appelle de l'amour.",
    reminderIndex: 3,
  },
  {
    title: "Repenser la culpabilite",
    question: "Si une mere que vous aimez etait malade et faisait de son mieux, la jugeriez-vous ?",
    placeholder: "Non, je penserais que...",
    message: "Pourquoi etes-vous plus dure avec vous-meme ?",
    reminderIndex: 4,
  },
  {
    title: "Message pour Isaac",
    question: "Qu'aimeriez-vous qu'Isaac ressente de votre part aujourd'hui ?",
    placeholder: "Amour, presence, tendresse...",
    message: "La relation avec votre fils continue aujourd'hui.",
    reminderIndex: 3,
  },
  {
    title: "Petites actions dans le present",
    question: "Quelle petite chose pouvez-vous faire avec Isaac aujourd'hui ?",
    placeholder: "Par exemple...",
    suggestions: [
      "Lire une histoire avec Isaac",
      "Lui faire un calin",
      "Lui demander comment s'est passee sa journee",
      "Passer 10 minutes avec lui",
    ],
    message: "Les enfants ont surtout besoin d'amour dans le present.",
    reminderIndex: 0,
  },
  {
    title: "Lacher le passe",
    question: "",
    placeholder: "",
    message: "Vous aimeriez revenir dans le passe pour reparer. Mais Isaac vit avec vous aujourd'hui. Le present est la ou l'amour peut agir.",
    reminderIndex: 2,
  },
];

export default function IsaacPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(exercises.map(() => ""));
  const [completed, setCompleted] = useState(false);

  const current = exercises[step];

  const handleNext = () => {
    if (answers[step].trim() || !current.question) {
      saveIsaacEntry({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        exercise: step + 1,
        answer: answers[step],
      });
    }
    if (step < exercises.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const updateAnswer = (value: string) => {
    const a = [...answers];
    a[step] = value;
    setAnswers(a);
  };

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col pb-20">
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
          <div className="animate-fade-in text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--accent-light)]/30 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">Pour Isaac</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Votre amour pour votre fils est reel et present.
                La culpabilite n&apos;est pas la verite — c&apos;est une blessure qui guerit.
              </p>
            </div>

            <SpiritualReminder reminder={reminders[3]} showLoop soundIndex={3} />

            <button
              onClick={() => { setStep(0); setAnswers(exercises.map(() => "")); setCompleted(false); }}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors touch-manipulation"
            >
              Recommencer les exercices
            </button>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 max-w-lg mx-auto">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-[var(--accent)]" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors touch-manipulation"
          >
            &larr; Retour
          </button>
        )}
      </div>

      <main className="flex-1 px-6 py-6 max-w-lg mx-auto w-full">
        <div className="animate-fade-in space-y-5" key={step}>
          <div>
            <p className="text-xs font-medium text-[var(--accent)] uppercase tracking-wide mb-1">
              Pour mon fils Isaac — Exercice {step + 1} sur {exercises.length}
            </p>
            <h2 className="text-xl font-semibold leading-tight">{current.title}</h2>
          </div>

          {/* Question + textarea */}
          {current.question && (
            <>
              <p className="text-[var(--foreground)] text-base leading-relaxed">{current.question}</p>
              <textarea
                value={answers[step]}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder={current.placeholder}
                className="w-full h-28 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-base resize-none focus:outline-none focus:border-[var(--accent-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
              />
            </>
          )}

          {/* Suggestions for exercise 4 */}
          {current.suggestions && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--text-muted)]">Quelques idees :</p>
              {current.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => updateAnswer(s)}
                  className={`w-full text-left rounded-xl p-3 text-sm border transition-all touch-manipulation ${
                    answers[step] === s
                      ? "border-[var(--accent)] bg-[var(--accent-light)]/20"
                      : "border-[var(--border)] bg-[var(--surface)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Therapeutic message */}
          <div className="rounded-2xl bg-[var(--surface-warm)] p-5">
            <p className="text-sm text-[var(--foreground)] leading-relaxed italic">
              {current.message}
            </p>
          </div>

          <SpiritualReminder reminder={reminders[current.reminderIndex]} soundIndex={current.reminderIndex} />

          <button
            onClick={handleNext}
            disabled={!!current.question && !answers[step].trim()}
            className={`w-full py-4 rounded-2xl text-base font-medium transition-all touch-manipulation ${
              !current.question || answers[step].trim()
                ? "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/85"
                : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
            }`}
          >
            {step === exercises.length - 1 ? "Terminer" : "Continuer"}
          </button>
        </div>
      </main>

      <NavBar />
    </div>
  );
}
