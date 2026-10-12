import type { PostNavTarget } from "./PostNav";

/** A PostNav target for a neighbor under `basePath` ("/log"), or undefined at either end of the list. */
export function toNavTarget(
  basePath: string,
  entry: { slug: string; title: string } | undefined,
): PostNavTarget | undefined {
  return entry && { href: `${basePath}/${entry.slug}`, title: entry.title };
}
