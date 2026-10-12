import type { Metadata } from "next";
import { LogIndexPanel } from "@/components/log/LogIndexPanel";
import { LOG_DESCRIPTION } from "@/content/log";
import { getPosts } from "@/lib/content/log";

export const metadata: Metadata = {
  title: "Log",
  description: LOG_DESCRIPTION,
};

export default async function LogPage() {
  const posts = await getPosts();

  return (
    <main className="grid">
      <LogIndexPanel posts={posts} />
    </main>
  );
}
