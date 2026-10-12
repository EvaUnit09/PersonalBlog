"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  BOOT_HOLD_MS,
  BOOT_TIMING,
  bootSchedule,
  buildBootLines,
  endBoot,
  formatBootLine,
  isBootPending,
  resultOffset,
  subscribeBoot,
  totalChars,
  typedCounts,
  type BootCounts,
  type BootLine,
} from "@/lib/boot";
import { parseTheme } from "@/lib/theme";
import styles from "./BootSequence.module.css";

interface TypedLog {
  lines: readonly BootLine[];
  counts: readonly number[];
}

// The server can't know whether this visit boots, so it renders the frame; CSS shows it only while data-boot is set.
function getServerSnapshot(): boolean {
  return true;
}

function TypedLine({ line, count }: { line: BootLine; count: number }) {
  const text = formatBootLine(line);
  const offset = resultOffset(line);
  return (
    <div>
      <span className={styles.prompt}>&gt; </span>
      {text.slice(0, Math.min(count, offset))}
      <span className={styles.result}>{text.slice(offset, count)}</span>
    </div>
  );
}

/**
 * First-visit intro. The pre-paint script decides whether it plays (data-boot="pending");
 * this types the log against the page's time origin so it always ends inside the CSS failsafe.
 */
export function BootSequence({ projects, posts }: BootCounts) {
  const isPending = useSyncExternalStore(subscribeBoot, isBootPending, getServerSnapshot);
  const [log, setLog] = useState<TypedLog | null>(null);

  useEffect(() => {
    if (!isPending) return;

    const theme = parseTheme(document.documentElement.dataset.theme) ?? "dark";
    const lines = buildBootLines({ projects, posts }, theme);
    const charMs = bootSchedule(lines, BOOT_TIMING);
    const endMs = totalChars(lines) * charMs + BOOT_HOLD_MS;

    let raf = 0;
    const tick = (now: number) => {
      if (now >= endMs) {
        endBoot();
        return;
      }
      setLog({ lines, counts: typedCounts(lines, now, charMs) });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") endBoot();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isPending, projects, posts]);

  if (!isPending) return null;

  return (
    <div data-boot-overlay className={styles.overlay}>
      <div aria-hidden="true" className={`t-code ${styles.log}`}>
        {log?.lines.map(
          (line, index) => log.counts[index] > 0 && <TypedLine key={line.command} line={line} count={log.counts[index]} />,
        )}
      </div>
      <button type="button" aria-label="Skip intro" className={`t-readout ${styles.skip}`} onClick={endBoot}>
        [ SKIP ]
      </button>
    </div>
  );
}
