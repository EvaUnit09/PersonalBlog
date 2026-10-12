import type { MetadataRoute } from "next";

export interface SitemapInput {
  origin: string;
  projects: readonly { slug: string; updated?: string }[];
  posts: readonly { slug: string; date: string }[];
}

export function buildSitemap({ origin, projects, posts }: SitemapInput): MetadataRoute.Sitemap {
  const page = (path: string, lastModified?: string) => ({
    url: `${origin}${path}`,
    ...(lastModified !== undefined && { lastModified }),
  });

  return [
    page("/"),
    page("/about"),
    page("/projects"),
    ...projects.map(({ slug, updated }) => page(`/projects/${slug}`, updated)),
    page("/log"),
    ...posts.map(({ slug, date }) => page(`/log/${slug}`, date)),
  ];
}
