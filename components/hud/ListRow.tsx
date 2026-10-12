import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./ListRow.module.css";

interface ListRowProps {
  /** Index ("02") or period ("[YYYY] – NOW") shown in the leading column. */
  marker: ReactNode;
  /** "index" fits a two-digit number; "period" fits a date range. */
  markerSize?: "index" | "period";
  title: ReactNode;
  summary: ReactNode;
  /** Extra content under the summary, e.g. a TagList. */
  children?: ReactNode;
}

export function ListRow({ marker, markerSize = "index", title, summary, children }: ListRowProps) {
  return (
    <li className={styles.row}>
      <span className={cx(styles.marker, styles[markerSize], "t-readout")}>{marker}</span>
      <div className={styles.body}>
        <div className="t-h3">{title}</div>
        <div className={cx(styles.summary, "t-body-sm")}>{summary}</div>
        {children !== undefined && <div className={styles.extra}>{children}</div>}
      </div>
    </li>
  );
}
