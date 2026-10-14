import { LogIndexPanel } from "@/components/log/LogIndexPanel";
import { LOG_DESCRIPTION } from "@/content/log";
import { getPosts } from "@/lib/content/log";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Log", LOG_DESCRIPTION);

export default async function LogPage() {
  const posts = await getPosts();

  return (
    <main className="grid">
      <LogIndexPanel posts={posts} />
    </main>
  );
}
