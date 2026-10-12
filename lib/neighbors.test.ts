import { describe, expect, it } from "vitest";
import { neighborsOf } from "./neighbors";

const ITEMS = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];

describe("neighborsOf", () => {
  it("returns both sides for a middle entry", () => {
    expect(neighborsOf(ITEMS, "b")).toEqual({ previous: { slug: "a" }, next: { slug: "c" } });
  });

  it("has no previous for the first entry and does not wrap to the last", () => {
    expect(neighborsOf(ITEMS, "a")).toEqual({ previous: undefined, next: { slug: "b" } });
  });

  it("has no next for the last entry and does not wrap to the first", () => {
    expect(neighborsOf(ITEMS, "c")).toEqual({ previous: { slug: "b" }, next: undefined });
  });

  it("has neither side for a single entry", () => {
    expect(neighborsOf([{ slug: "only" }], "only")).toEqual({ previous: undefined, next: undefined });
  });

  it("has neither side for an unknown slug", () => {
    expect(neighborsOf(ITEMS, "nope")).toEqual({ previous: undefined, next: undefined });
  });
});
