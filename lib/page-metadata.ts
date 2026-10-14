import type { Metadata } from "next";
import { SITE } from "@/content/site";

/** Document title and social title for the home page (no `: Home` suffix). */
export function homeMetadata(): Metadata {
  return pageShare(SITE.name, SITE.description);
}

/**
 * Per-page title, description, and social tags.
 *
 * Root layout already emits openGraph and twitter, so a page that only sets
 * `title` / `description` would keep the site-wide og/twitter copy. Every
 * route has to set these explicitly.
 */
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    ...pageShare(`${SITE.name}: ${title}`, description),
  };
}

function pageShare(title: string, description: string): Metadata {
  return {
    description,
    openGraph: {
      title,
      description,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
