// Audio system — real MP3 recitations for dhikr and Quranic verses

// Dhikr audio files (human voice recitations)
const dhikrFiles = [
  "/audio/dhikr/dhikr-subhanallah.mp3",     // 0: SubhanAllah
  "/audio/dhikr/dhikr-alhamdulillah.mp3",    // 1: Alhamdulillah
  "/audio/dhikr/dhikr-allahu-akbar.mp3",     // 2: Allahu Akbar
  "/audio/dhikr/dhikr-hasbiyallah.mp3",      // 3: Hasbiya Allah
];

// Quranic verse audio files (Mishary Alafasy recitation)
const verseFiles: Record<string, string> = {
  "094006": "/audio/verses/094006.mp3",  // Quran 94:6 - Fa inna ma'al usri yusra
  "013028": "/audio/verses/013028.mp3",  // Quran 13:28 - Ala bi dhikri Allah
  "065003": "/audio/verses/065003.mp3",  // Quran 65:3 - Wa man yatawakkal
  "007156": "/audio/verses/007156.mp3",  // Quran 7:156 - Wa rahmati wasi'at
  "042019": "/audio/verses/042019.mp3",  // Quran 42:19 - Allah latifun bi ibadihi
  "002286": "/audio/verses/002286.mp3",  // Quran 2:286 - La yukallifu Allah
  "001002": "/audio/verses/001002.mp3",  // Quran 1:2 - Alhamdulillahi Rabbil Aalameen
};

// Map soundIndex used in components to audio files
// 0-3: dhikr files, 4-5: verse files (used as defaults in SpiritualReminder)
const soundIndexToFile = [
  dhikrFiles[0],  // 0: SubhanAllah
  dhikrFiles[1],  // 1: Alhamdulillah
  dhikrFiles[2],  // 2: Allahu Akbar
  dhikrFiles[3],  // 3: Hasbiya Allah
  dhikrFiles[0],  // 4: default (SubhanAllah)
  dhikrFiles[1],  // 5: alternate (Alhamdulillah)
];

// Unlock audio on mobile — must be called from a user gesture
let unlocked = false;

export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  // Create and immediately play a silent audio to unlock on iOS/Android
  const audio = new Audio();
  audio.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/2Q==";
  audio.volume = 0.01;
  audio.play().catch(() => {});
}

export function playDhikrSound(
  soundIndex: number = 0,
  _duration: number = 7,
  loop: boolean = false
): { stop: () => void } {
  const file = soundIndexToFile[soundIndex % soundIndexToFile.length];
  const audio = new Audio(file);
  audio.loop = loop;
  audio.volume = 1.0;
  audio.play().catch(() => {});

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  };

  return { stop };
}

// Play a specific Quranic verse recitation by verse key (e.g. "013028")
export function playVerseAudio(verseKey: string, loop: boolean = false): { stop: () => void } {
  const file = verseFiles[verseKey];
  if (!file) {
    // Fallback to a dhikr sound if verse not found
    return playDhikrSound(0, 7, loop);
  }

  const audio = new Audio(file);
  audio.loop = loop;
  audio.volume = 1.0;
  audio.play().catch(() => {});

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  };

  return { stop };
}

// Bell sound for notifications (kept as synthesized — short UI sound)
export function playBell() {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(528, now);
  osc.frequency.exponentialRampToValueAtTime(264, now + 2);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 2);
}
