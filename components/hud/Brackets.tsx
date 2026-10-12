import styles from "./Brackets.module.css";

const CORNERS = ["tl", "tr", "bl", "br"] as const;

/** Four decorative L-shaped corners. The parent must be position: relative. */
export function Brackets() {
  return (
    <span aria-hidden="true" className={styles.brackets}>
      {CORNERS.map((corner) => (
        <span key={corner} data-bracket className={`${styles.corner} ${styles[corner]}`} />
      ))}
    </span>
  );
}
