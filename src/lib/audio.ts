// Audio system — streams Quranic recitations from everyayah.com CDN
// Local MP3 files as offline fallback

// everyayah.com CDN base URL (Mishary Alafasy, 128kbps)
const CDN_BASE = "https://everyayah.com/data/Alafasy_128kbps";

// Large pool of calming, hopeful, comforting Quranic verses
// Format: "SSSAAA" (surah 3 digits + ayah 3 digits)
const calmingVerses = [
  // -- Mercy & Compassion --
  "007156", // My mercy encompasses all things (7:156)
  "039053", // Do not despair of the mercy of Allah (39:53)
  "006054", // Your Lord has prescribed mercy upon Himself (6:54)
  "012087", // No one despairs of Allah's mercy except the disbelieving (12:87)
  "021107", // We have not sent you except as a mercy to the worlds (21:107)
  // -- Ease after hardship --
  "094005", // Indeed, with hardship comes ease (94:5)
  "094006", // Indeed, with hardship comes ease (94:6)
  "065002", // Whoever fears Allah, He will make a way out (65:2)
  "065003", // Whoever relies upon Allah, He is sufficient (65:3)
  "002286", // Allah does not burden a soul beyond capacity (2:286)
  // -- Remembrance & Peace --
  "013028", // In the remembrance of Allah hearts find rest (13:28)
  "002152", // Remember Me, I will remember you (2:152)
  "033041", // O you who believe, remember Allah with much remembrance (33:41)
  "020014", // Indeed I am Allah, worship Me and establish prayer for My remembrance (20:14)
  // -- Trust & Reliance --
  "003159", // When you have decided, rely upon Allah (3:159)
  "008002", // The believers are those whose hearts tremble at mention of Allah (8:2)
  "009051", // Say: Nothing will happen to us except what Allah has decreed (9:51)
  "003173", // Sufficient for us is Allah, and He is the best Disposer of affairs (3:173)
  // -- Gentleness & Love --
  "042019", // Allah is Gentle with His servants (42:19)
  "011090", // My Lord is Merciful, Loving (11:90)
  "085014", // He is the Forgiving, the Loving (85:14)
  "019096", // Those who believe and do good, the Most Merciful will bestow love (19:96)
  // -- Patience & Hope --
  "002153", // Allah is with the patient (2:153)
  "003200", // O you who believe, be patient and endure (3:200)
  "029069", // Those who strive for Us, We will guide them (29:69)
  "002214", // The help of Allah is near (2:214)
  "003139", // Do not weaken and do not grieve (3:139)
  // -- Forgiveness --
  "004110", // Whoever does wrong then seeks forgiveness will find Allah Forgiving (4:110)
  "008070", // If Allah knows good in your hearts, He will give you better (8:70)
  "025070", // Allah will replace their evil deeds with good (25:70)
  // -- Protection & Safety --
  "002257", // Allah is the Protector of those who believe (2:257)
  "003150", // Allah is your Protector, and He is the best of helpers (3:150)
  "009040", // Do not grieve, Allah is with us (9:040)
  // -- Gratitude --
  "014007", // If you are grateful, I will increase you (14:7)
  "001002", // All praise is due to Allah, Lord of the worlds (1:2)
  // -- Short soothing surahs --
  "112001", // Say: He is Allah, the One (112:1)
  "112002", // Allah, the Eternal Refuge (112:2)
  "093001", // By the morning brightness (93:1)
  "093003", // Your Lord has not forsaken you (93:3)
  "093004", // The Hereafter is better for you than the first life (93:4)
  "093005", // Your Lord will give you and you will be satisfied (93:5)
];

// Local dhikr fallback files
const localDhikrFiles = [
  "/audio/dhikr/dhikr-subhanallah.mp3",
  "/audio/dhikr/dhikr-alhamdulillah.mp3",
  "/audio/dhikr/dhikr-allahu-akbar.mp3",
  "/audio/dhikr/dhikr-hasbiyallah.mp3",
];

// Local verse fallback files
const localVerseFiles: Record<string, string> = {
  "094006": "/audio/verses/094006.mp3",
  "013028": "/audio/verses/013028.mp3",
  "065003": "/audio/verses/065003.mp3",
  "007156": "/audio/verses/007156.mp3",
  "042019": "/audio/verses/042019.mp3",
  "002286": "/audio/verses/002286.mp3",
  "001002": "/audio/verses/001002.mp3",
};

// Shuffle helper
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Build CDN URL for a verse key
function verseUrl(verseKey: string): string {
  return `${CDN_BASE}/${verseKey}.mp3`;
}

// Try to play from CDN, fall back to local file
function createAudio(cdnUrl: string, localFallback?: string): HTMLAudioElement {
  const audio = new Audio(cdnUrl);
  if (localFallback) {
    audio.addEventListener("error", () => {
      audio.src = localFallback;
      audio.load();
      audio.play().catch(() => {});
    }, { once: true });
  }
  return audio;
}

// Unlock audio on mobile — must be called from a user gesture
let unlocked = false;

export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  const audio = new Audio();
  audio.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/2Q==";
  audio.volume = 0.01;
  audio.play().catch(() => {});
}

// Play dhikr — cycles through random calming verses from the internet
// Falls back to local dhikr clips if offline
export function playDhikrSound(
  soundIndex: number = 0,
  _duration: number = 7,
  loop: boolean = false
): { stop: () => void } {
  let stopped = false;
  let currentAudio: HTMLAudioElement | null = null;

  if (loop) {
    // Looping mode: play random calming verses from CDN, cycling through
    const shuffled = shuffleArray(calmingVerses);
    let idx = 0;

    const playNext = () => {
      if (stopped) return;
      const vk = shuffled[idx % shuffled.length];
      currentAudio = createAudio(verseUrl(vk), localVerseFiles[vk]);
      currentAudio.volume = 1.0;
      currentAudio.addEventListener("ended", () => {
        idx++;
        playNext();
      });
      currentAudio.play().catch(() => {});
    };

    playNext();
  } else {
    // Single play: pick a random calming verse from CDN
    const vk = calmingVerses[Math.floor(Math.random() * calmingVerses.length)];
    currentAudio = createAudio(verseUrl(vk), localDhikrFiles[soundIndex % localDhikrFiles.length]);
    currentAudio.volume = 1.0;
    currentAudio.play().catch(() => {});
  }

  const stop = () => {
    stopped = true;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  };

  return { stop };
}

// Play a specific Quranic verse recitation by verse key
// Streams from CDN, falls back to local file
export function playVerseAudio(verseKey: string, loop: boolean = false): { stop: () => void } {
  let stopped = false;
  let currentAudio: HTMLAudioElement | null = null;

  if (loop) {
    // Looping a specific verse: play it, then continue with random calming verses
    const pool = shuffleArray(calmingVerses.filter(v => v !== verseKey));
    let idx = -1; // -1 = play requested verse first

    const playNext = () => {
      if (stopped) return;
      const vk = idx < 0 ? verseKey : pool[idx % pool.length];
      currentAudio = createAudio(verseUrl(vk), localVerseFiles[vk]);
      currentAudio.volume = 1.0;
      currentAudio.addEventListener("ended", () => {
        idx++;
        playNext();
      });
      currentAudio.play().catch(() => {});
    };

    playNext();
  } else {
    currentAudio = createAudio(verseUrl(verseKey), localVerseFiles[verseKey]);
    currentAudio.volume = 1.0;
    currentAudio.play().catch(() => {});
  }

  const stop = () => {
    stopped = true;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  };

  return { stop };
}

// Bell sound for notifications (synthesized — short UI sound)
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
