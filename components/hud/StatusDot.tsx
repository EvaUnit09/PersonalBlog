import { cx } from "@/lib/cx";
import styles from "./StatusDot.module.css";

interface StatusDotProps {
  /** Accent for live or open states, warn for work in progress. */
  tone: "accent" | "warn";
}

/** Decorative status light. The status text beside it carries the meaning. */
export function StatusDot({ tone }: StatusDotProps) {
  return <span aria-hidden="true" data-tone={tone} className={cx(styles.dot, styles[tone])} />;
}
