import type { ContactLink } from "@/content/site";

const PLACEHOLDER_PATTERNS: readonly RegExp[] = [
  /example\.(com|org|net)/i,
  // A profile host with no handle after it, e.g. "https://github.com/".
  /^https?:\/\/(www\.)?(github|linkedin)\.com\/?$/i,
];

/** Returns contact links that still hold handoff placeholders instead of real handles. */
export function findPlaceholderLinks(links: readonly ContactLink[]): ContactLink[] {
  return links.filter((link) => PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(link.href)));
}
