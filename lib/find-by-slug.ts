import { notFound } from "next/navigation";

/** The entry with `slug`, or the framework's 404 when none matches. */
export function findBySlug<T extends { slug: string }>(items: readonly T[], slug: string): T {
  const item = items.find((candidate) => candidate.slug === slug);
  if (item === undefined) {
    notFound();
  }
  return item;
}
