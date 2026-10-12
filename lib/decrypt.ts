export const DECRYPT_MS = 400;

export const DECRYPT_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/";

const SCRAMBLES = /[\p{L}\p{N}]/u;

export function pickRandomGlyph(): string {
  return DECRYPT_GLYPHS[Math.floor(Math.random() * DECRYPT_GLYPHS.length)];
}

function clamp(progress: number): number {
  return Math.min(1, Math.max(0, progress));
}

/**
 * One frame of the decrypt: characters lock in left to right as progress runs 0..1.
 * Only letters and digits scramble, so spaces and punctuation hold the word shapes still.
 */
export function decryptFrame(text: string, progress: number, randomGlyph: () => string): string {
  const chars = Array.from(text);
  const done = clamp(progress);
  return chars
    .map((char, index) => (!SCRAMBLES.test(char) || done >= (index + 1) / chars.length ? char : randomGlyph()))
    .join("");
}
