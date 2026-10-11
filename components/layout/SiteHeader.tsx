import Link from "next/link";
import { SITE } from "@/content/site";
import { cx } from "@/lib/cx";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={cx(styles.wordmark, "t-wordmark")}>
        {SITE.name}
      </Link>
      <NavLinks />
      {/* Static stand-in; becomes the ThemeToggle button in Phase 4. */}
      <span aria-hidden="true" className={cx(styles.theme, "t-readout")}>
        [ <span className={styles.themeActive}>DARK</span> / LIGHT ]
      </span>
    </header>
  );
}
