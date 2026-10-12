import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "./find-by-slug";

const notFound = vi.hoisted(() =>
  vi.fn((): never => {
    throw new Error("NEXT_NOT_FOUND");
  }),
);
vi.mock("next/navigation", () => ({ notFound }));

describe("findBySlug", () => {
  const items = [{ slug: "a", n: 1 }, { slug: "b", n: 2 }];

  it("returns the entry whose slug matches", () => {
    expect(findBySlug(items, "b")).toBe(items[1]);
  });

  it("triggers notFound when no entry matches", () => {
    expect(() => findBySlug(items, "nope")).toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledOnce();
  });
});
