import { CONTACT_LINKS, SITE } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={cx(styles.footer, "t-readout")}>
      <p className={styles.copyright}>
        © {SITE.name} · {SITE.coordinates}
      </p>
      <ul className={styles.links}>
        {CONTACT_LINKS.map((contact) => (
          <li key={contact.label}>
            <a href={contact.href}>
              {contact.label} <span aria-hidden="true">▸</span>
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
