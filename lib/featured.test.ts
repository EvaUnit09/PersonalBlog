import { describe, expect, it } from "vitest";
import { pickFeatured, withoutFeatured } from "./featured";

const PROJECTS = [{ slug: "nightcap" }, { slug: "foodsy" }, { slug: "moody" }, { slug: "the-round-up" }];

describe("pickFeatured", () => {
  it("returns featured projects in the given slug order", () => {
    expect(pickFeatured(PROJECTS).map((project) => project.slug)).toEqual(["nightcap", "moody"]);
  });

  it("fails when a featured slug is missing", () => {
    expect(() => pickFeatured([{ slug: "nightcap" }])).toThrow(/moody/);
  });
});

describe("withoutFeatured", () => {
  it("drops featured slugs and keeps the rest in list order", () => {
    expect(withoutFeatured(PROJECTS).map((project) => project.slug)).toEqual(["foodsy", "the-round-up"]);
  });
});
