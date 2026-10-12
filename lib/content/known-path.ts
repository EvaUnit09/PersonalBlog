export interface SlugManifest {
  projects: readonly string[];
  log: readonly string[];
}

const SLUG_ROUTE = /^\/(projects|log)\/([^/]+)\/?$/;
// A real route that shares the /log/:slug shape.
const FEED_SLUG = "feed.xml";

/** False only for a /projects/:slug or /log/:slug path whose slug is not in the manifest. Everything else is not ours to judge. */
export function isKnownPath(pathname: string, manifest: SlugManifest): boolean {
  const match = SLUG_ROUTE.exec(pathname);
  if (!match) return true;

  const [, collection, rawSlug] = match as unknown as [string, "projects" | "log", string];
  let slug: string;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    return false;
  }
  if (collection === "log" && slug === FEED_SLUG) return true;
  return manifest[collection].includes(slug);
}
