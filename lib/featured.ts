export const FEATURED_SLUGS = ["nightcap", "moody"] as const;

export function pickFeatured<T extends { slug: string }>(
  projects: readonly T[],
  slugs: readonly string[] = FEATURED_SLUGS,
): T[] {
  return slugs.map((slug) => {
    const project = projects.find((item) => item.slug === slug);
    if (project === undefined) {
      throw new Error(`Featured project "${slug}" is missing`);
    }
    return project;
  });
}

export function withoutFeatured<T extends { slug: string }>(
  projects: readonly T[],
  slugs: readonly string[] = FEATURED_SLUGS,
): T[] {
  const skip = new Set(slugs);
  return projects.filter((project) => !skip.has(project.slug));
}
