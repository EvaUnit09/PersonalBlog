import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DECRYPT_MS } from "@/lib/decrypt";
import { DecryptText } from "./DecryptText";

type FrameCallback = (now: number) => void;

let frames: FrameCallback[] = [];
let intersect: (isIntersecting: boolean) => void = () => {};
const observe = vi.fn();
const disconnect = vi.fn();

function stubMotion(isReduced: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches: isReduced }));
}

function runFrame(now: number) {
  const pending = frames;
  frames = [];
  act(() => pending.forEach((callback) => callback(now)));
}

function frameText(container: HTMLElement) {
  return container.querySelector("[data-decrypt-frame]")?.textContent ?? null;
}

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameCallback) => frames.push(callback));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        intersect = (isIntersecting) => act(() => callback([{ isIntersecting }]));
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  delete document.documentElement.dataset.boot;
});

describe("DecryptText", () => {
  it("renders the final text before anything scrolls into view", () => {
    stubMotion(false);
    const { container } = render(<DecryptText text="Experience" />);

    expect(container).toHaveTextContent(/^Experience$/);
    expect(frameText(container)).toBeNull();
  });

  it("scrambles once on first intersection, then settles on the exact text", () => {
    stubMotion(false);
    const { container } = render(<DecryptText text="Experience" />);

    intersect(false);
    expect(frames).toHaveLength(0);

    intersect(true);
    runFrame(1000);
    expect(frameText(container)).toHaveLength("Experience".length);
    expect(frameText(container)).not.toBe("Experience");

    runFrame(1000 + DECRYPT_MS);
    expect(frameText(container)).toBeNull();
    expect(frames).toHaveLength(0);
    expect(disconnect).toHaveBeenCalled();
  });

  it("keeps the final label as the accessible name while scrambling", () => {
    stubMotion(false);
    render(
      <section aria-labelledby="xp">
        <DecryptText text="Experience" id="xp" />
      </section>,
    );

    intersect(true);
    runFrame(0);

    expect(screen.getByRole("region", { name: "Experience" })).toBeInTheDocument();
  });

  it("never animates under reduced motion", () => {
    stubMotion(true);
    const { container } = render(<DecryptText text="Experience" />);

    expect(observe).not.toHaveBeenCalled();
    expect(frameText(container)).toBeNull();
  });

  it("waits for the boot overlay to clear before watching for intersection", async () => {
    stubMotion(false);
    document.documentElement.dataset.boot = "pending";
    render(<DecryptText text="Log" />);
    expect(observe).not.toHaveBeenCalled();

    delete document.documentElement.dataset.boot;

    await vi.waitFor(() => expect(observe).toHaveBeenCalledOnce());
  });

  it("stops the animation when unmounted", () => {
    stubMotion(false);
    const { unmount } = render(<DecryptText text="Log" />);
    intersect(true);

    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
  });
});
