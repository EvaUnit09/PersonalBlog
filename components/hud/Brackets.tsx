import { cx } from "@/lib/cx";
import styles from "./Brackets.module.css";

const CORNERS = ["tl", "tr", "bl", "br"] as const;

interface BracketsProps {
  /** Force the lime "active" state regardless of hover. */
  isActive?: boolean;
}

/** Four decorative L-shaped corners. The parent must be position: relative. */
export function Brackets({ isActive = false }: BracketsProps) {
  return (
    <span aria-hidden="true" className={cx(styles.brackets, isActive && styles.active)}>
      {CORNERS.map((corner) => (
        <span key={corner} data-bracket className={cx(styles.corner, styles[corner])} />
      ))}
    </span>
  );
}
