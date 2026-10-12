import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Boot } from "./Boot";

vi.mock("@/lib/content/projects", () => ({ getProjects: async () => [{}, {}, {}] }));
vi.mock("@/lib/content/log", () => ({ getPosts: async () => [{}] }));

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.boot;
});

describe("Boot", () => {
  it("feeds the boot log the real project and post counts", async () => {
    let frame: (now: number) => void = () => {};
    vi.stubGlobal("requestAnimationFrame", (callback: typeof frame) => {
      frame = callback;
      return 1;
    });
    document.documentElement.dataset.boot = "pending";
    const { container } = render(await Boot());

    act(() => frame(1300));

    expect(container).toHaveTextContent("mount /projects ... 3 found");
    expect(container).toHaveTextContent("mount /log ... 1 entry");
  });
});
