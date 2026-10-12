import { describe, expect, it } from "vitest";
import { padIndex } from "./padIndex";

describe("padIndex", () => {
  it("pads single digits to two", () => {
    expect(padIndex(2)).toBe("02");
  });

  it("leaves two-digit numbers alone", () => {
    expect(padIndex(12)).toBe("12");
  });
});
