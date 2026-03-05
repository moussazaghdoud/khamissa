"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import SpiritualReminder from "@/components/SpiritualReminder";
import { reminders } from "@/lib/spiritual-data";
import { saveThoughtEntry, detectRuminationPattern } from "@/lib/storage";

const steps = [
  {
    title: "Quelle pensee tourne en boucle dans votre esprit ?",
    subtitle: "Ecrivez-la exactement comme elle apparait. Externaliser la pensee reduit son emprise.",
    placeholder: "Je n'arrete pas de penser que...",
    reminderIndex: 1,
  },
  {
    title: "Est-ce un FAIT ou une PEUR ?",
    subtitle: "Beaucoup de pensees ruminantes semblent reelles mais sont basees sur la peur, pas sur des preuves.",
    placeholder: "Quand je regarde cela clairement, je pense que c'est...",
    reminderIndex: 2,
  },
  {
    title: "Quelles preuves contredisent cette pensee ?",
    subtitle: "Pensez a des moments reels qui montrent une image differente.",
    placeholder: "Par exemple, il y a eu un moment ou...",
    reminderIndex: 0,
  },
  {
    title: "Que diriez-vous a un ami qui pense cela ?",
    subtitle: "Nous sommes souvent plus bienveillants envers les autres qu'envers nous-memes.",
    placeholder: "Je lui dirais...",
    reminderIndex: 3,
  },
  {
    title: "Maintenant, ecrivez une pensee alternative plus saine.",
    subtitle: "Elle n'a pas besoin d'etre positive - juste plus equilibree et vraie.",
    placeholder: "Une facon plus equilibree de voir les choses est...",
    reminderIndex: 4,
  },
];

export default function InterruptPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [completed, setCompleted] = useState(false);
  const [patternCount, setPatternCount] = useState(0);

  const currentStep = steps[step];

  const handleNext = () => {
    if (step === 0 && answers[0].trim()) {
      const count = detectRuminationPattern(answers[0]);
      setPatternCount(count);
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      saveThoughtEntry({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        thought: answers[0],
        isFact: answers[1],
        evidence: answers[2],
        friendAdvice: answers[3],
        alternative: answers[4],
      });
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);
  };

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col pb-20">
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
          <div className="animate-fade-in text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary-light)]/30 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">Bravo</h2>
              <p className="text-[var(--text-muted)]">
                Vous avez fait un pas puissant en examinant cette pensee avec clarte et compassion.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 text-left space-y-3">
              <div>
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Votre pensee</p>
                <p className="text-sm mt-1">{answers[0]}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Alternative plus saine</p>
                <p className="text-sm mt-1 text-[var(--primary-dark)] font-medium">{answers[4]}</p>
              </div>
            </div>

            <SpiritualReminder reminder={reminders[4]} showLoop />

            <button
              onClick={() => {
                setStep(0);
                setAnswers(["", "", "", "", ""]);
                setCompleted(false);
                setPatternCount(0);
              }}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Commencer une nouvelle session
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
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleBack}
          className={`mt-4 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors ${
            step === 0 ? "invisible" : ""
          }`}
        >
          &larr; Retour
        </button>
      </div>

      <main className="flex-1 px-6 py-6 max-w-lg mx-auto w-full">
        <div className="animate-fade-in space-y-5" key={step}>
          <div>
            <p className="text-xs font-medium text-[var(--primary)] uppercase tracking-wide mb-2">
              Etape {step + 1} sur {steps.length}
            </p>
            <h2 className="text-2xl font-semibold leading-tight">{currentStep.title}</h2>
            <p className="text-[var(--text-muted)] mt-2 text-sm leading-relaxed">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Pattern Detection Warning */}
          {step === 0 && patternCount >= 3 && (
            <div className="rounded-2xl bg-[var(--accent-light)] p-4 animate-fade-in">
              <p className="text-sm font-medium">
                Cette pensee est apparue {patternCount} fois.
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Il s&apos;agit peut-etre d&apos;un schema de rumination plutot que de la realite. Examinons-la ensemble.
              </p>
            </div>
          )}

          <textarea
            value={answers[step]}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={currentStep.placeholder}
            className="w-full h-32 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-base resize-none focus:outline-none focus:border-[var(--primary-light)] transition-colors placeholder:text-[var(--text-muted)]/50"
          />

          <SpiritualReminder reminder={reminders[currentStep.reminderIndex]} />

          <button
            onClick={handleNext}
            disabled={!answers[step].trim()}
            className={`w-full py-4 rounded-2xl text-base font-medium transition-all ${
              answers[step].trim()
                ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
            }`}
          >
            {step === steps.length - 1 ? "Terminer" : "Continuer"}
          </button>
        </div>
      </main>

      <NavBar />
    </div>
  );
}
