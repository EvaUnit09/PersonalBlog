"use client";

import { useSyncExternalStore } from "react";
import { cx } from "@/lib/cx";
import { THEME_STORAGE_KEY, THEMES, parseTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme | null {
  return parseTheme(document.documentElement.dataset.theme);
}

// Null on the server so neither side renders as pressed before the pre-paint script's result is known.
function getServerSnapshot(): Theme | null {
  return null;
}

function selectTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked; the choice still applies for this page view.
  }
}

/** Client island: the pre-paint script owns the initial theme, this reflects and changes it. */
export function ThemeToggle() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div role="group" aria-label="Theme" className={cx(styles.toggle, "t-readout")}>
      <span aria-hidden="true">[ </span>
      {THEMES.map((theme, index) => (
        <span key={theme}>
          {index > 0 && <span aria-hidden="true"> / </span>}
          <button
            type="button"
            className={styles.button}
            aria-pressed={current === null ? undefined : current === theme}
            onClick={() => selectTheme(theme)}
          >
            {theme.toUpperCase()}
          </button>
        </span>
      ))}
      <span aria-hidden="true"> ]</span>
    </div>
  );
}
