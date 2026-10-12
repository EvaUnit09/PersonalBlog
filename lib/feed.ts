import { absoluteUrl } from "./site-url";

export interface FeedPost {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
}

export interface FeedInput {
  origin: string;
  title: string;
  description: string;
  /** Newest first. */
  posts: readonly FeedPost[];
}

const XML_ESCAPES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => XML_ESCAPES[char] ?? char);
}

/** RFC 822 date at midnight UTC; toUTCString emits the "GMT" zone RSS readers expect. */
export function toRfc822(day: string): string {
  return new Date(`${day}T00:00:00Z`).toUTCString();
}

function item(origin: string, post: FeedPost): string {
  const link = escapeXml(absoluteUrl(`/log/${post.slug}`, origin));
  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${link}</link>`,
    `      <guid>${link}</guid>`,
    `      <pubDate>${toRfc822(post.date)}</pubDate>`,
    `      <description>${escapeXml(post.excerpt)}</description>`,
    "    </item>",
  ].join("\n");
}

export function buildFeed({ origin, title, description, posts }: FeedInput): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(absoluteUrl("/log", origin))}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    "    <language>en</language>",
    ...posts.map((post) => item(origin, post)),
    "  </channel>",
    "</rss>",
  ];
  return `${lines.join("\n")}\n`;
}
