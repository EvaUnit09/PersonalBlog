import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content/log";
import { getProjects } from "@/lib/content/projects";
import { buildSitemap } from "@/lib/sitemap-entries";
import { getSiteOrigin } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  return buildSitemap({ origin: getSiteOrigin(), projects, posts });
}
