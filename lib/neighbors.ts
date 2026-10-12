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
