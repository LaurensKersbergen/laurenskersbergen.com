// Tiny interface sounds, synthesized with Web Audio (no audio files):
// a soft blip on hover, a tick for outgoing links and buttons, and a
// rising two-note blip for navigating within the site.

export type UISound = "hover" | "click" | "navigate";

const SILENT = 0.001;

function tone(
  ctx: BaseAudioContext,
  at: number,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
) {
  const oscillator = ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(SILENT, at + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + duration);
}

function hiss(ctx: BaseAudioContext, at: number, duration: number, volume: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 4000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(SILENT, at + duration);

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(at);
}

export function scheduleSound(ctx: BaseAudioContext, sound: UISound, at = ctx.currentTime) {
  switch (sound) {
    case "hover":
      tone(ctx, at, 1200, 0.04, 0.02);
      break;
    case "click":
      tone(ctx, at, 800, 0.06, 0.04);
      hiss(ctx, at, 0.03, 0.015);
      break;
    case "navigate":
      tone(ctx, at, 600, 0.08, 0.03, "triangle");
      tone(ctx, at + 0.06, 900, 0.08, 0.03, "triangle");
      break;
  }
}

let context: AudioContext | null = null;

// Browsers only allow audio after a user gesture, so call this from one
// (pointerdown, keydown or click).
export function unlockSounds() {
  if (!context || context.state === "closed") {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    context = new Ctor();
  }
  if (context.state === "suspended") void context.resume();
}

export function playSound(sound: UISound) {
  // Hover isn't a gesture, so it stays silent until a click or key unlocks audio
  if (sound !== "hover") unlockSounds();
  if (!context || (sound === "hover" && context.state !== "running")) return;
  scheduleSound(context, sound);
}
