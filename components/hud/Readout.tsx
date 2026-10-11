import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Readout.module.css";

interface ReadoutRowProps {
  label: ReactNode;
  value: ReactNode;
  /** Hairline divider between rows (about/project facts) vs. none (home status). */
  isRuled?: boolean;
  /** Lime value for live/ok states like "▲ PASSING". */
  isAccent?: boolean;
}

/** One label/value pair. Render inside a <dl>. */
export function ReadoutRow({ label, value, isRuled = false, isAccent = false }: ReadoutRowProps) {
  return (
    <div className={cx(styles.row, "t-readout", isRuled && styles.ruled)}>
      <dt className={styles.label}>{label}</dt>
      <dd className={cx(styles.value, isAccent && styles.accent)}>{value}</dd>
    </div>
  );
}

interface ReadoutBarProps {
  items: readonly ReactNode[];
  className?: string;
}

/** A row of readouts in ink-faint separated by "·". */
export function ReadoutBar({ items, className }: ReadoutBarProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <p className={cx(styles.bar, "t-readout", className)}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          {item}
        </span>
      ))}
    </p>
  );
}
