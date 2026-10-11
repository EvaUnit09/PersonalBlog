import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./PanelHeader.module.css";

const UNNUMBERED = "//";

interface PanelHeaderProps {
  /** "01".."04" for numbered sections, or "//" for side panels. */
  index: string;
  label: ReactNode;
  /** id for the label, so the parent panel can use aria-labelledby. */
  labelId?: string;
  /** Right-aligned readout or link after the rule. */
  readout?: ReactNode;
  className?: string;
}

/** Section index row: lime number, label, hairline rule, optional readout. */
export function PanelHeader({ index, label, labelId, readout, className }: PanelHeaderProps) {
  return (
    <div className={cx(styles.header, "t-index", className)}>
      <span>
        <span className={styles.index}>{index}</span>
        {index === UNNUMBERED ? " " : " / "}
        <span id={labelId}>{label}</span>
      </span>
      <span aria-hidden="true" className={styles.rule} />
      {readout !== undefined && (
        <span data-readout className={cx(styles.readout, "t-readout")}>
          {readout}
        </span>
      )}
    </div>
  );
}
