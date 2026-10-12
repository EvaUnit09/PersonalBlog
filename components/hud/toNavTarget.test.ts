import { describe, expect, it } from "vitest";
import { toNavTarget } from "./toNavTarget";

describe("toNavTarget", () => {
  it("links the entry under the base path with its title", () => {
    expect(toNavTarget("/log", { slug: "a", title: "A" })).toEqual({ href: "/log/a", title: "A" });
  });

  it("is undefined when there is no entry", () => {
    expect(toNavTarget("/log", undefined)).toBeUndefined();
  });
});
