/**
 * Audio utility for timer beeps.
 *
 * Uses a singleton AudioContext that gets created/resumed on first
 * user interaction, avoiding browser autoplay restrictions.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // Browsers suspend AudioContext until a user gesture resumes it
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a short beep sound.
 *
 * @param volume - Gain value between 0 and 1 (default 0.3)
 */
export function playBeep(volume: number = 0.3): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = volume;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio not available — silently ignore
  }
}

/**
 * Pre-warm the AudioContext so it's ready for the first beep.
 * Call this from a user-gesture handler (e.g. "Iniciar preparación").
 */
export function warmUpAudio(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
  } catch {
    // ignore
  }
}
