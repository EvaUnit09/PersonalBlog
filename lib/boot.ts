import { REDUCED_MOTION_QUERY } from "./motion";
import type { Theme } from "./theme";

export interface BootLine {
  command: string;
  result: string;
}

export interface BootCounts {
  projects: number;
  posts: number;
}

export interface BootTiming {
  budgetMs: number;
}

export const BOOT_STORAGE_KEY = "boot-seen";
export const BOOT_SEEN = "1";
export const BOOT_PENDING = "pending";
export const BOOT_TIMING: BootTiming = { budgetMs: 1400 };
/** Pause between the last typed character and the overlay lifting. */
export const BOOT_HOLD_MS = 100;

const SEPARATOR = " ... ";

export function buildBootLines(counts: BootCounts, theme: Theme): readonly BootLine[] {
  return [
    { command: "mount /projects", result: `${counts.projects} found` },
    { command: "mount /log", result: `${counts.posts} ${counts.posts === 1 ? "entry" : "entries"}` },
    { command: "theme", result: theme },
    { command: "boot", result: "ready" },
  ];
}

export function formatBootLine(line: BootLine): string {
  return `${line.command}${SEPARATOR}${line.result}`;
}

/** Where the result starts in the formatted line, so it can be colored apart from the command. */
export function resultOffset(line: BootLine): number {
  return line.command.length + SEPARATOR.length;
}

export function totalChars(lines: readonly BootLine[]): number {
  return lines.reduce((sum, line) => sum + formatBootLine(line).length, 0);
}

/** Per-character delay that fits the whole log in the budget. The log is always long enough that this beats the brand book's ~25ms/char. */
export function bootSchedule(lines: readonly BootLine[], { budgetMs }: BootTiming): number {
  return budgetMs / totalChars(lines);
}

/** Characters typed so far on each line; lines type one after another. */
export function typedCounts(lines: readonly BootLine[], elapsedMs: number, charMs: number): readonly number[] {
  const typed = Math.floor(Math.max(0, elapsedMs) / charMs);
  return lines.reduce<{ counts: readonly number[]; offset: number }>(
    ({ counts, offset }, line) => {
      const length = formatBootLine(line).length;
      const count = Math.min(length, Math.max(0, typed - offset));
      return { counts: [...counts, count], offset: offset + length };
    },
    { counts: [], offset: 0 },
  ).counts;
}

/**
 * Source for the blocking pre-paint script. Flags the boot only when it will really play,
 * so returning visitors, reduced-motion users and blocked storage never see the overlay.
 */
export function bootInitScript(): string {
  const key = JSON.stringify(BOOT_STORAGE_KEY);
  const query = JSON.stringify(REDUCED_MOTION_QUERY);
  const pending = JSON.stringify(BOOT_PENDING);
  return `(function(){try{if(sessionStorage.getItem(${key})!==null)return;if(matchMedia(${query}).matches)return;document.documentElement.dataset.boot=${pending}}catch(e){}})()`;
}

export function isBootPending(): boolean {
  return document.documentElement.dataset.boot === BOOT_PENDING;
}

export function endBoot(): void {
  try {
    sessionStorage.setItem(BOOT_STORAGE_KEY, BOOT_SEEN);
  } catch {
    // Storage can be blocked; the pre-paint script then never flags the boot again anyway.
  }
  delete document.documentElement.dataset.boot;
}

export function subscribeBoot(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-boot"] });
  return () => observer.disconnect();
}

/** Runs the callback once the boot overlay is gone (immediately if it never showed). */
export function onBootSettled(callback: () => void): () => void {
  if (!isBootPending()) {
    callback();
    return () => {};
  }
  const unsubscribe = subscribeBoot(() => {
    if (isBootPending()) return;
    unsubscribe();
    callback();
  });
  return unsubscribe;
}
