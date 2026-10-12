import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BOOT_STORAGE_KEY } from "@/lib/boot";
import { BootSequence } from "./BootSequence";

type FrameCallback = (now: number) => void;

let frames: FrameCallback[] = [];

function runFrame(now: number) {
  const pending = frames;
  frames = [];
  act(() => pending.forEach((callback) => callback(now)));
}

function startBoot() {
  document.documentElement.dataset.boot = "pending";
  document.documentElement.dataset.theme = "light";
}

function renderBoot() {
  return render(<BootSequence projects={4} posts={0} />);
}

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameCallback) => frames.push(callback));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
  delete document.documentElement.dataset.boot;
  delete document.documentElement.dataset.theme;
});

describe("BootSequence", () => {
  it("renders nothing and starts no animation without the pending flag", () => {
    const { container } = renderBoot();

    expect(container).toBeEmptyDOMElement();
    expect(frames).toHaveLength(0);
  });

  it("types the log from real counts and the current theme", () => {
    startBoot();
    const { container } = renderBoot();

    runFrame(300);
    expect(container).toHaveTextContent(/^> mount \/projects/);
    runFrame(1300);

    expect(container).toHaveTextContent("> mount /projects ... 4 found");
    expect(container).toHaveTextContent("> mount /log ... 0 entries");
    expect(container).toHaveTextContent("> theme ... light");
  });

  it("hides the log from assistive tech but names the skip button", () => {
    startBoot();
    renderBoot();
    runFrame(500);

    expect(screen.getByRole("button", { name: "Skip intro" })).toHaveTextContent("[ SKIP ]");
    expect(screen.getByText(/mount \/projects/).closest("[aria-hidden]")).toHaveAttribute("aria-hidden", "true");
  });

  it("ends by itself once the log has typed", async () => {
    startBoot();
    const { container } = renderBoot();

    runFrame(1500);

    expect(sessionStorage.getItem(BOOT_STORAGE_KEY)).toBe("1");
    expect(document.documentElement.dataset.boot).toBeUndefined();
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("skips on the SKIP button and remembers the session", async () => {
    startBoot();
    const user = userEvent.setup();
    const { container } = renderBoot();

    await user.click(screen.getByRole("button", { name: "Skip intro" }));

    expect(sessionStorage.getItem(BOOT_STORAGE_KEY)).toBe("1");
    expect(document.documentElement.dataset.boot).toBeUndefined();
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("skips on Escape without moving focus", async () => {
    startBoot();
    const user = userEvent.setup();
    const { container } = renderBoot();
    const focused = document.activeElement;

    await user.keyboard("{Escape}");

    expect(sessionStorage.getItem(BOOT_STORAGE_KEY)).toBe("1");
    expect(document.activeElement).toBe(focused);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("stops listening once it has ended", async () => {
    startBoot();
    const { container } = renderBoot();
    runFrame(1500);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
    sessionStorage.clear();

    await userEvent.keyboard("{Escape}");

    expect(sessionStorage.getItem(BOOT_STORAGE_KEY)).toBeNull();
  });
});
