export interface Neighbors<T> {
  previous: T | undefined;
  next: T | undefined;
}

/**
 * Picks the entries on either side of `slug` in `ordered`, without wrapping around.
 * An unknown slug has no neighbors.
 */
export function neighborsOf<T extends { slug: string }>(ordered: readonly T[], slug: string): Neighbors<T> {
  const index = ordered.findIndex((item) => item.slug === slug);
  if (index === -1) {
    return { previous: undefined, next: undefined };
  }
  return { previous: ordered[index - 1], next: ordered[index + 1] };
}

/**
 * Neighbors in a newest-first list, read as a timeline: previous is the next-older entry
 * and next is the next-newer one. That is the reverse of list order.
 */
export function logNeighbors<T extends { slug: string }>(newestFirst: readonly T[], slug: string): Neighbors<T> {
  const { previous, next } = neighborsOf(newestFirst, slug);
  return { previous: next, next: previous };
}
