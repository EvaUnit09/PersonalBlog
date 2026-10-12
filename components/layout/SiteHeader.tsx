import Link from "next/link";
import { SITE } from "@/content/site";
import { cx } from "@/lib/cx";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={cx(styles.wordmark, "t-wordmark")}>
        {SITE.name}
      </Link>
      <NavLinks />
      <ThemeToggle />
    </header>
  );
}
