// Web Audio API spin sound — oscillator sweep from high to low pitch

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playSpinSound(duration = 3.5): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume if suspended (needed after user interaction policy)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Create oscillator
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = "sine";

  // Sweep from 800hz down to 200hz with exponential ramp
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + duration);

  // Volume envelope: quick fade in, slow fade out
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.start(now);
  osc.stop(now + duration);
}

export function playResultSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Quick celebratory "ding" chord
  const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.5);
  });
}
