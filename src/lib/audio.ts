// Web Audio API — distinct calming sounds for each dhikr

let audioContext: AudioContext | null = null;
let unlocked = false;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  // On mobile (iOS/Android), play a silent buffer on first interaction to unlock audio
  if (!unlocked && audioContext.state === "running") {
    unlocked = true;
    const buf = audioContext.createBuffer(1, 1, 22050);
    const src = audioContext.createBufferSource();
    src.buffer = buf;
    src.connect(audioContext.destination);
    src.start(0);
  }
  return audioContext;
}

// Call this early on any user tap/click to ensure audio works on mobile
export function unlockAudio() {
  getAudioContext();
}

// Each dhikr has its own unique sound profile
const soundProfiles = [
  // 0: SubhanAllah — soft rising shimmer (high ethereal)
  {
    frequencies: [396, 528, 639],
    type: "sine" as OscillatorType,
    attack: 1.0,
    release: 1.5,
    volume: 0.35,
    detune: [0, 5, -3],
    vibrato: 2,
  },
  // 1: Alhamdulillah — warm deep resonance (grounding)
  {
    frequencies: [174, 261.63, 349.23],
    type: "sine" as OscillatorType,
    attack: 1.2,
    release: 2.0,
    volume: 0.40,
    detune: [0, 0, 7],
    vibrato: 0.8,
  },
  // 2: Allahu Akbar — majestic wide chord (powerful calm)
  {
    frequencies: [220, 330, 440, 550],
    type: "triangle" as OscillatorType,
    attack: 0.8,
    release: 1.8,
    volume: 0.30,
    detune: [0, -4, 3, 6],
    vibrato: 1.5,
  },
  // 3: Hasbiya Allah — gentle flowing waves (surrender)
  {
    frequencies: [293.66, 369.99, 440],
    type: "sine" as OscillatorType,
    attack: 1.5,
    release: 2.5,
    volume: 0.35,
    detune: [0, 8, -5],
    vibrato: 3,
  },
  // 4: Quranic verses default — peaceful bell-like
  {
    frequencies: [528, 660, 792],
    type: "sine" as OscillatorType,
    attack: 0.6,
    release: 2.0,
    volume: 0.30,
    detune: [0, 3, -2],
    vibrato: 1.2,
  },
  // 5: Alternate verse — deep ocean calm
  {
    frequencies: [130.81, 196, 261.63],
    type: "sine" as OscillatorType,
    attack: 2.0,
    release: 2.0,
    volume: 0.38,
    detune: [0, 5, 10],
    vibrato: 0.5,
  },
];

export function playDhikrSound(
  soundIndex: number = 0,
  duration: number = 7,
  loop: boolean = false
): { stop: () => void } {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const profile = soundProfiles[soundIndex % soundProfiles.length];

  // Master gain with envelope
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(profile.volume, now + profile.attack);
  masterGain.gain.setValueAtTime(profile.volume, now + duration - profile.release);
  masterGain.gain.linearRampToValueAtTime(0, now + duration);

  const oscillators: OscillatorNode[] = [];

  profile.frequencies.forEach((freq, i) => {
    // Main oscillator
    const osc = ctx.createOscillator();
    osc.type = profile.type;
    osc.frequency.setValueAtTime(freq, now);
    if (profile.detune[i]) {
      osc.detune.setValueAtTime(profile.detune[i], now);
    }

    // Vibrato LFO for organic feel
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(profile.vibrato + i * 0.3, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(3 + i, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    // Per-oscillator gain (softer for higher partials)
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(1 / (1 + i * 0.4), now);
    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration);
    oscillators.push(osc);
  });

  let stopped = false;
  let loopTimeout: ReturnType<typeof setTimeout> | null = null;
  let innerStop: (() => void) | null = null;

  if (loop) {
    const scheduleNext = () => {
      if (stopped) return;
      loopTimeout = setTimeout(() => {
        if (!stopped) {
          const next = playDhikrSound(soundIndex, duration, false);
          innerStop = next.stop;
          loopTimeout = setTimeout(scheduleNext, duration * 1000);
        }
      }, (duration - 0.5) * 1000); // slight overlap for seamless loop
    };
    scheduleNext();
  }

  const stopFn = () => {
    stopped = true;
    if (loopTimeout) clearTimeout(loopTimeout);
    innerStop?.();
    try {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
    setTimeout(() => {
      oscillators.forEach((o) => {
        try { o.stop(); } catch { /* already stopped */ }
      });
    }, 350);
  };

  return { stop: stopFn };
}

// Bell sound for notifications
export function playBell() {
  const ctx = getAudioContext();
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
