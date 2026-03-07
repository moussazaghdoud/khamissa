export interface JournalEntry {
  id: string;
  date: string;
  didToday: string;
  wentWell: string;
  negativeThought: string;
}

export interface ThoughtEntry {
  id: string;
  date: string;
  thought: string;
  isFact: string;
  evidence: string;
  friendAdvice: string;
  alternative: string;
}

export interface CompassionEntry {
  id: string;
  date: string;
  message: string;
}

export interface RuminationTimer {
  time: string; // HH:mm
  duration: number; // minutes
  active: boolean;
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Journal
export function getJournalEntries(): JournalEntry[] {
  return getItem("cr_journal", []);
}

export function saveJournalEntry(entry: JournalEntry) {
  const entries = getJournalEntries();
  entries.unshift(entry);
  setItem("cr_journal", entries);
}

// Thoughts (for pattern detection)
export function getThoughtEntries(): ThoughtEntry[] {
  return getItem("cr_thoughts", []);
}

export function saveThoughtEntry(entry: ThoughtEntry) {
  const entries = getThoughtEntries();
  entries.unshift(entry);
  setItem("cr_thoughts", entries);
}

export function detectRuminationPattern(thought: string): number {
  const entries = getThoughtEntries();
  const normalized = thought.toLowerCase().trim();
  const words = normalized.split(/\s+/).filter((w) => w.length > 3);
  let count = 0;
  for (const entry of entries) {
    const entryNorm = entry.thought.toLowerCase().trim();
    const matchScore = words.filter((w) => entryNorm.includes(w)).length;
    if (matchScore >= Math.max(1, words.length * 0.5)) {
      count++;
    }
  }
  return count;
}

// Compassion
export function getCompassionEntries(): CompassionEntry[] {
  return getItem("cr_compassion", []);
}

export function saveCompassionEntry(entry: CompassionEntry) {
  const entries = getCompassionEntries();
  entries.unshift(entry);
  setItem("cr_compassion", entries);
}

// Rumination Timer
export function getRuminationTimer(): RuminationTimer {
  return getItem("cr_timer", { time: "18:00", duration: 20, active: false });
}

export function saveRuminationTimer(timer: RuminationTimer) {
  setItem("cr_timer", timer);
}

// Isaac module
export interface IsaacEntry {
  id: string;
  date: string;
  exercise: number; // 1-5
  answer: string;
}

export function getIsaacEntries(): IsaacEntry[] {
  return getItem("cr_isaac", []);
}

export function saveIsaacEntry(entry: IsaacEntry) {
  const entries = getIsaacEntries();
  entries.unshift(entry);
  setItem("cr_isaac", entries);
}

// Journey — tracks which time-of-day steps were completed today
export function getJourneyToday(): string[] {
  const data = getItem<{ date: string; completed: string[] }>("cr_journey", { date: "", completed: [] });
  const today = new Date().toISOString().slice(0, 10);
  return data.date === today ? data.completed : [];
}

export function completeJourneyStep(step: string) {
  const today = new Date().toISOString().slice(0, 10);
  const completed = getJourneyToday();
  if (!completed.includes(step)) {
    completed.push(step);
  }
  setItem("cr_journey", { date: today, completed });
}
