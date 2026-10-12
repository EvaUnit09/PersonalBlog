import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CachedMdx } from "./CachedMdx";
import { Mdx } from "./Mdx";

vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

describe("CachedMdx", () => {
  it("renders the given source through Mdx", async () => {
    const element = await CachedMdx({ source: "Hello **world**" });

    expect(element.type).toBe(Mdx);
    render(await Mdx(element.props));
    expect(screen.getByText("world").tagName).toBe("STRONG");
  });

  // Vitest does not run the Cache Components transform, so only the source can prove the boundary exists.
  it("source-level regression guard: the function opens with the 'use cache' directive and pins cacheLife to max", () => {
    const source = readFileSync(join(__dirname, "CachedMdx.tsx"), "utf8");

    expect(source).toMatch(/export async function CachedMdx\([^)]*\)\s*\{\s*"use cache";/);
    expect(source).toContain('cacheLife("max");');
  });
});
