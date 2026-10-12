import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { cacheLife } from "next/cache";
import { CachedMdx } from "./CachedMdx";
import { Mdx } from "./Mdx";

vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

describe("CachedMdx", () => {
  it("renders the given source through Mdx and pins the cache lifetime to max", async () => {
    const element = await CachedMdx({ source: "Hello **world**" });

    expect(element.type).toBe(Mdx);
    render(await Mdx(element.props));
    expect(screen.getByText("world").tagName).toBe("STRONG");
    expect(cacheLife).toHaveBeenCalledWith("max");
  });
});
