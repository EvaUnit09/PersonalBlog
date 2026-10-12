/**
 * Cache Components rejects an empty generateStaticParams for a dynamic route, so a collection
 * with no entries yet returns one slug that cannot be a real entry (the loader only accepts
 * kebab-case filenames) and the page 404s it.
 */
export const PLACEHOLDER_SLUG = "__placeholder__";

export function slugParams(items: readonly { slug: string }[]): { slug: string }[] {
  return items.length === 0 ? [{ slug: PLACEHOLDER_SLUG }] : items.map(({ slug }) => ({ slug }));
}
