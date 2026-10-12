import { describe, expect, it } from "vitest";
import { SLUG_PATTERN } from "./content/collection";
import { PLACEHOLDER_SLUG, slugParams } from "./static-params";

describe("slugParams", () => {
  it("maps each entry to a slug param in order", () => {
    const entries = [{ slug: "a", title: "A" }, { slug: "b", title: "B" }];

    expect(slugParams(entries)).toEqual([{ slug: "a" }, { slug: "b" }]);
  });

  it("returns a single placeholder when there are no entries, never an empty list", () => {
    expect(slugParams([])).toEqual([{ slug: PLACEHOLDER_SLUG }]);
  });

  it("uses a placeholder the content loader could never accept as a filename slug", () => {
    expect(PLACEHOLDER_SLUG).not.toMatch(SLUG_PATTERN);
  });
});
