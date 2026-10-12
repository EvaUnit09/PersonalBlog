import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BOOT_STORAGE_KEY,
  BOOT_TIMING,
  bootInitScript,
  bootSchedule,
  buildBootLines,
  endBoot,
  formatBootLine,
  onBootSettled,
  resultOffset,
  totalChars,
  typedCounts,
  type BootLine,
} from "./boot";
import { prefersReducedMotion } from "./motion";

const SHORT: readonly BootLine[] = [{ command: "a", result: "b" }];

function lineOfLength(length: number): BootLine {
  return { command: "x".repeat(length - " ... ".length - 1), result: "y" };
}

function stubReducedMotion(isReduced: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: isReduced && query === "(prefers-reduced-motion: reduce)",
  }));
}

function runScript() {
  new Function(bootInitScript())();
  return document.documentElement.dataset.boot;
}

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
  delete document.documentElement.dataset.boot;
});

describe("buildBootLines", () => {
  it("reports the real counts and theme, lowercase and terse", () => {
    const lines = buildBootLines({ projects: 4, posts: 0 }, "dark").map(formatBootLine);

    expect(lines).toEqual([
      "mount /projects ... 4 found",
      "mount /log ... 0 entries",
      "theme ... dark",
      "boot ... ready",
    ]);
  });

  it("uses the singular for one log entry", () => {
    expect(buildBootLines({ projects: 1, posts: 1 }, "light")[1].result).toBe("1 entry");
  });
});

describe("bootSchedule", () => {
  it("types at the 25ms cap when the content is short", () => {
    expect(bootSchedule(SHORT, BOOT_TIMING)).toBe(25);
  });

  it("compresses long content so all of it types within the budget", () => {
    const lines = [lineOfLength(200), lineOfLength(150)];
    const charMs = bootSchedule(lines, BOOT_TIMING);

    expect(charMs).toBeLessThan(25);
    expect(totalChars(lines) * charMs).toBeCloseTo(1400);
  });

  it("keeps the real boot log under 1.5s", () => {
    const lines = buildBootLines({ projects: 99, posts: 999 }, "light");

    expect(totalChars(lines) * bootSchedule(lines, BOOT_TIMING)).toBeLessThanOrEqual(1400);
  });
});

describe("typedCounts", () => {
  const lines: readonly BootLine[] = [
    { command: "ab", result: "c" },
    { command: "d", result: "e" },
  ];

  it("types lines one after another", () => {
    expect(typedCounts(lines, 0, 10)).toEqual([0, 0]);
    expect(typedCounts(lines, 50, 10)).toEqual([5, 0]);
    expect(typedCounts(lines, 90, 10)).toEqual([8, 1]);
    expect(typedCounts(lines, 10_000, 10)).toEqual([8, 7]);
  });

  it("splits the result from the command", () => {
    expect(formatBootLine(lines[0]).slice(resultOffset(lines[0]))).toBe("c");
  });
});

describe("bootInitScript", () => {
  it("flags a fresh session as pending", () => {
    stubReducedMotion(false);

    expect(runScript()).toBe("pending");
  });

  it("does not flag a session that has already seen the boot", () => {
    stubReducedMotion(false);
    sessionStorage.setItem(BOOT_STORAGE_KEY, "1");

    expect(runScript()).toBeUndefined();
  });

  it("does not flag under reduced motion", () => {
    stubReducedMotion(true);

    expect(runScript()).toBeUndefined();
  });

  it("does not flag when storage throws", () => {
    stubReducedMotion(false);
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("denied");
      },
    });

    expect(runScript()).toBeUndefined();
  });
});

describe("endBoot", () => {
  it("marks the session seen and clears the flag", () => {
    document.documentElement.dataset.boot = "pending";

    endBoot();

    expect(sessionStorage.getItem(BOOT_STORAGE_KEY)).toBe("1");
    expect(document.documentElement.dataset.boot).toBeUndefined();
  });

  it("still clears the flag when storage throws", () => {
    document.documentElement.dataset.boot = "pending";
    vi.stubGlobal("sessionStorage", {
      setItem: () => {
        throw new Error("denied");
      },
    });

    endBoot();

    expect(document.documentElement.dataset.boot).toBeUndefined();
  });
});

describe("onBootSettled", () => {
  it("runs at once when no boot is pending", () => {
    const callback = vi.fn();

    onBootSettled(callback);

    expect(callback).toHaveBeenCalledOnce();
  });

  it("waits for the boot to end", async () => {
    document.documentElement.dataset.boot = "pending";
    const callback = vi.fn();

    onBootSettled(callback);
    expect(callback).not.toHaveBeenCalled();
    endBoot();
    await vi.waitFor(() => expect(callback).toHaveBeenCalledOnce());
  });

  it("does not run after it is cancelled", async () => {
    document.documentElement.dataset.boot = "pending";
    const callback = vi.fn();

    onBootSettled(callback)();
    endBoot();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(callback).not.toHaveBeenCalled();
  });
});

describe("prefersReducedMotion", () => {
  it("reads the media query", () => {
    stubReducedMotion(true);

    expect(prefersReducedMotion()).toBe(true);
  });

  it("treats a missing matchMedia as reduced", () => {
    vi.stubGlobal("matchMedia", undefined);

    expect(prefersReducedMotion()).toBe(true);
  });
});
