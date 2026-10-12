import { cx } from "@/lib/cx";
import styles from "./Tag.module.css";

interface TagProps {
  label: string;
}

/** Bracketed, uppercase mono stack tag: [DJANGO]. */
export function Tag({ label }: TagProps) {
  return <span className={cx(styles.tag, "t-tag")}>[{label}]</span>;
}

interface TagListProps {
  tags: readonly string[];
  /** Accessible name for the list, e.g. "Stack". */
  label?: string;
  className?: string;
}

export function TagList({ tags, label, className }: TagListProps) {
  return (
    <ul aria-label={label} className={cx(styles.list, className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Tag label={tag} />
        </li>
      ))}
    </ul>
  );
}
