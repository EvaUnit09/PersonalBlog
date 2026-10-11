/**
 * Decides whether a primary-nav item is the "current page" for aria-current
 * and the lime underline.
 *
 * @param pathname current route from usePathname(), e.g. "/projects/nightcap"
 * @param href     the nav item's href, e.g. "/projects" or "/#experience"
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  // In-page anchors point at a section of another page, never a page of their own.
  if (href.includes("#")) {
    return false;
  }

  // Match the section root or anything under it, but not "/logbook" for "/log".
  return pathname === href || pathname.startsWith(`${href}/`);
}
