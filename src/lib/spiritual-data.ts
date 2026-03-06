export interface SpiritualReminder {
  arabic: string;
  french: string;
  reference: string;
  verseKey: string; // maps to audio file in /audio/verses/
}

export const reminders: SpiritualReminder[] = [
  {
    arabic: "\u0641\u0625\u0646\u0651\u064e \u0645\u064e\u0639\u064e \u0627\u0644\u0639\u064f\u0633\u0631\u0650 \u064a\u064f\u0633\u0631\u064b\u0627",
    french: "Car certes, avec la difficulte vient la facilite.",
    reference: "Coran 94:6",
    verseKey: "094006",
  },
  {
    arabic: "\u0623\u064e\u0644\u064e\u0627 \u0628\u0650\u0630\u0650\u0643\u0631\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u062a\u064e\u0637\u0645\u064e\u0626\u0650\u0646\u0651\u064f \u0627\u0644\u0642\u064f\u0644\u064f\u0648\u0628\u064f",
    french: "C'est par le rappel d'Allah que les coeurs s'apaisent.",
    reference: "Coran 13:28",
    verseKey: "013028",
  },
  {
    arabic: "\u0648\u064e\u0645\u064e\u0646 \u064a\u064e\u062a\u064e\u0648\u064e\u0643\u0651\u064e\u0644 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0641\u064e\u0647\u064f\u0648\u064e \u062d\u064e\u0633\u0628\u064f\u0647\u064f",
    french: "Et quiconque place sa confiance en Allah, Il lui suffit.",
    reference: "Coran 65:3",
    verseKey: "065003",
  },
  {
    arabic: "\u0648\u064e\u0631\u064e\u062d\u0645\u064e\u062a\u0650\u064a \u0648\u064e\u0633\u0650\u0639\u064e\u062a \u0643\u064f\u0644\u0651\u064e \u0634\u064e\u064a\u0621\u064d",
    french: "Ma misericorde embrasse toute chose.",
    reference: "Coran 7:156",
    verseKey: "007156",
  },
  {
    arabic: "\u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0644\u064e\u0637\u0650\u064a\u0641\u064c \u0628\u0650\u0639\u0650\u0628\u064e\u0627\u062f\u0650\u0647\u0650",
    french: "Allah est Doux envers Ses serviteurs.",
    reference: "Coran 42:19",
    verseKey: "042019",
  },
  {
    arabic: "\u0644\u064e\u0627 \u064a\u064f\u0643\u064e\u0644\u0651\u0650\u0641\u064f \u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0646\u064e\u0641\u0633\u064b\u0627 \u0625\u0650\u0644\u0651\u064e\u0627 \u0648\u064f\u0633\u0639\u064e\u0647\u064e\u0627",
    french: "Allah n'impose a aucune ame une charge superieure a sa capacite.",
    reference: "Coran 2:286",
    verseKey: "002286",
  },
];

export const dhikrItems = [
  { arabic: "\u0633\u0628\u062d\u0627\u0646 \u0627\u0644\u0644\u0647", transliteration: "SubhanAllah", meaning: "Gloire a Allah" },
  { arabic: "\u0627\u0644\u062d\u0645\u062f \u0644\u0644\u0647", transliteration: "Alhamdulillah", meaning: "Louange a Allah" },
  { arabic: "\u0627\u0644\u0644\u0647 \u0623\u0643\u0628\u0631", transliteration: "Allahu Akbar", meaning: "Allah est le Plus Grand" },
  {
    arabic: "\u062d\u0633\u0628\u064a \u0627\u0644\u0644\u0647 \u0648\u0646\u0639\u0645 \u0627\u0644\u0648\u0643\u064a\u0644",
    transliteration: "Hasbiya Allahu wa ni'mal wakeel",
    meaning: "Allah me suffit, Il est le meilleur Garant",
  },
];

export function getRandomReminder(): SpiritualReminder {
  return reminders[Math.floor(Math.random() * reminders.length)];
}
