export const NEW_TAB_REL = "noopener noreferrer" as const;

/** Site-relative paths and hashes. Protocol-relative "//host" is external. */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function externalLinkAttrs(href: string): { target: "_blank"; rel: typeof NEW_TAB_REL } | Record<string, never> {
  if (isInternalHref(href)) {
    return {};
  }
  return { target: "_blank", rel: NEW_TAB_REL };
}
