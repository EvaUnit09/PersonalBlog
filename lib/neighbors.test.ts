import { describe, expect, it } from "vitest";
import { logNeighbors, neighborsOf } from "./neighbors";

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

describe("logNeighbors", () => {
  const NEWEST_FIRST = [{ slug: "new" }, { slug: "mid" }, { slug: "old" }];

  it("treats the older post as previous and the newer post as next", () => {
    expect(logNeighbors(NEWEST_FIRST, "mid")).toEqual({ previous: { slug: "old" }, next: { slug: "new" } });
  });

  it("has no next for the newest post and no previous for the oldest", () => {
    expect(logNeighbors(NEWEST_FIRST, "new")).toEqual({ previous: { slug: "mid" }, next: undefined });
    expect(logNeighbors(NEWEST_FIRST, "old")).toEqual({ previous: undefined, next: { slug: "mid" } });
  });

  it("has no neighbors for an unknown slug", () => {
    expect(logNeighbors(NEWEST_FIRST, "nope")).toEqual({ previous: undefined, next: undefined });
  });
});
