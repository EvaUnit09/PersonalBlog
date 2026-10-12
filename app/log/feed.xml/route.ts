import { LOG_DESCRIPTION } from "@/content/log";
import { SITE } from "@/content/site";
import { getPosts } from "@/lib/content/log";
import { buildFeed } from "@/lib/feed";
import { getSiteOrigin } from "@/lib/site-url";

export async function GET() {
  const xml = buildFeed({
    origin: getSiteOrigin(),
    title: `${SITE.name}: Log`,
    description: LOG_DESCRIPTION,
    posts: await getPosts(),
  });

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
