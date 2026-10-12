export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "theme";

const DEFAULT_THEME: Theme = "dark";
const LIGHT_THEME: Theme = "light";
const LIGHT_SCHEME_QUERY = "(prefers-color-scheme: light)";

/** Boundary guard: localStorage and the DOM attribute are untrusted strings. */
export function parseTheme(value: unknown): Theme | null {
  return THEMES.find((theme) => theme === value) ?? null;
}

/**
 * Source for the blocking pre-paint script. Built from the same constants the
 * toggle uses so the two can never disagree on the key or the valid values.
 * Storage and matchMedia are each guarded: storage throws in some private modes.
 */
export function themeInitScript(): string {
  const themes = JSON.stringify(THEMES);
  const key = JSON.stringify(THEME_STORAGE_KEY);
  const fallback = JSON.stringify(DEFAULT_THEME);
  const light = JSON.stringify(LIGHT_THEME);
  const query = JSON.stringify(LIGHT_SCHEME_QUERY);
  return `(function(){var themes=${themes},theme=null;try{var stored=localStorage.getItem(${key});if(themes.indexOf(stored)>-1)theme=stored}catch(e){}if(!theme){try{theme=matchMedia(${query}).matches?${light}:${fallback}}catch(e){theme=${fallback}}}document.documentElement.dataset.theme=theme})()`;
}
