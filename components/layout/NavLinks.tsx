"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/content/site";
import { cx } from "@/lib/cx";
import { isNavItemActive } from "@/lib/nav";
import styles from "./NavLinks.module.css";

/** Client island: needs the current pathname to mark the active section. */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cx(styles.link, "t-index")}
              aria-current={isNavItemActive(pathname, item.href) ? "page" : undefined}
            >
              <span className={styles.index}>{item.index}</span> / {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
