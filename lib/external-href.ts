import { getSiteOrigin } from "./site-url";

export const NEW_TAB_REL = "noopener noreferrer" as const;

const ABSOLUTE_OR_PROTOCOL_RELATIVE = /^(https?:)?\/\//i;

/** Site-relative paths used by next/link. Protocol-relative "//host" is not this. */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/** Absolute http(s):// or protocol-relative // URLs whose origin is not this site. */
export function isExternalHref(href: string, origin: string = getSiteOrigin()): boolean {
  const trimmed = href.trim();
  if (!ABSOLUTE_OR_PROTOCOL_RELATIVE.test(trimmed)) {
    return false;
  }
  try {
    return new URL(trimmed, origin).origin !== new URL(origin).origin;
  } catch {
    return false;
  }
}

export function externalLinkAttrs(
  href: string,
  origin: string = getSiteOrigin(),
): { target: "_blank"; rel: typeof NEW_TAB_REL } | Record<string, never> {
  if (!isExternalHref(href, origin)) {
    return {};
  }
  return { target: "_blank", rel: NEW_TAB_REL };
}
