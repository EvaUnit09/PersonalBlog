import { describe, expect, it } from "vitest";
import { DECRYPT_GLYPHS, DECRYPT_MS, decryptFrame, pickRandomGlyph } from "./decrypt";

const NOISE = () => "#";
const LABEL = "More projects / v2.1";

function resolvedCount(frame: string, text: string): number {
  const index = Array.from(frame).findIndex((char, i) => char !== text[i]);
  return index === -1 ? text.length : index;
}

describe("decryptFrame", () => {
  it("shows no final letters or digits at progress 0 but keeps spaces and punctuation", () => {
    expect(decryptFrame(LABEL, 0, NOISE)).toBe("#### ######## / ##.#");
  });

  it("returns the text exactly at progress 1", () => {
    expect(decryptFrame(LABEL, 1, pickRandomGlyph)).toBe(LABEL);
  });

  it("resolves characters left to right and never un-resolves one", () => {
    const text = "EXPERIENCE";
    const counts = [0, 0.1, 0.25, 0.5, 0.75, 0.99, 1].map((p) => resolvedCount(decryptFrame(text, p, NOISE), text));

    expect(counts).toEqual([0, 1, 2, 5, 7, 9, 10]);
  });

  it("clamps progress outside 0..1", () => {
    expect(decryptFrame("LOG", -3, NOISE)).toBe("###");
    expect(decryptFrame("LOG", 7, NOISE)).toBe("LOG");
  });

  it("keeps the character count so a monospace label never changes width", () => {
    expect(decryptFrame(LABEL, 0.4, pickRandomGlyph)).toHaveLength(LABEL.length);
  });
});

describe("pickRandomGlyph", () => {
  it("draws from the glyph set", () => {
    const draws = Array.from({ length: 200 }, pickRandomGlyph);

    expect(draws.every((glyph) => DECRYPT_GLYPHS.includes(glyph))).toBe(true);
  });

  it("stays within the spec's 400ms ceiling", () => {
    expect(DECRYPT_MS).toBeLessThanOrEqual(400);
  });
});
