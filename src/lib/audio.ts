// Web Audio API-based dhikr audio generator
// Generates calming tones since we don't have actual audio files

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playDhikrTone(duration: number = 5, loop: boolean = false): { stop: () => void } {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Create a calming chord
  const frequencies = [261.63, 329.63, 392.0]; // C major chord
  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.5);
  gainNode.gain.setValueAtTime(0.15, now + duration - 1);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  const oscillators: OscillatorNode[] = [];

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.3 - i * 0.05, now);
    osc.connect(oscGain);
    oscGain.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration);
    oscillators.push(osc);
  });

  let loopTimeout: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  if (loop) {
    const scheduleNext = () => {
      if (stopped) return;
      loopTimeout = setTimeout(() => {
        if (!stopped) {
          const next = playDhikrTone(duration, false);
          loopTimeout = setTimeout(scheduleNext, duration * 1000);
          // Store for cleanup
          (stopFn as { _inner?: () => void })._inner = next.stop;
        }
      }, duration * 1000);
    };
    scheduleNext();
  }

  const stopFn = () => {
    stopped = true;
    if (loopTimeout) clearTimeout(loopTimeout);
    try {
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
    oscillators.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
    if ((stopFn as { _inner?: () => void })._inner) {
      (stopFn as { _inner?: () => void })._inner!();
    }
  };

  return { stop: stopFn };
}

// Bell-like sound for notifications
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
