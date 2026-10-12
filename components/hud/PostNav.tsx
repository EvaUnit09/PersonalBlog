import Link from "next/link";
import { cx } from "@/lib/cx";
import { Brackets } from "./Brackets";
import styles from "./PostNav.module.css";

export interface PostNavTarget {
  href: string;
  title: string;
}

interface PostNavProps {
  /** Accessible name, e.g. "Project navigation". */
  label: string;
  previous: PostNavTarget | undefined;
  next: PostNavTarget | undefined;
}

interface PostNavLinkProps {
  target: PostNavTarget;
  direction: "previous" | "next";
}

function PostNavLink({ target, direction }: PostNavLinkProps) {
  const isNext = direction === "next";

  return (
    <Link href={target.href} className={cx(styles.link, isNext && styles.next)}>
      <Brackets />
      <span className={cx(styles.direction, "t-readout")}>{isNext ? "NEXT ▸" : "◂ PREVIOUS"}</span>
      <span className={cx(styles.title, "t-h3")}>{target.title}</span>
    </Link>
  );
}

/** Previous/next cards. A missing side leaves its cell empty so "next" stays on the right. */
export function PostNav({ label, previous, next }: PostNavProps) {
  if (previous === undefined && next === undefined) {
    return null;
  }

  return (
    <nav aria-label={label} className={styles.nav}>
      {previous !== undefined && <PostNavLink target={previous} direction="previous" />}
      {next !== undefined && <PostNavLink target={next} direction="next" />}
    </nav>
  );
}
