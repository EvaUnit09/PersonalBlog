import type { Metadata } from "next";
import { CachedMdx } from "@/components/content/CachedMdx";
import { LogPostView } from "@/components/log/LogPostView";
import { getPosts } from "@/lib/content/log";
import { findBySlug } from "@/lib/find-by-slug";
import { logNeighbors } from "@/lib/neighbors";
import { slugParams } from "@/lib/static-params";

export async function generateStaticParams() {
  return slugParams(await getPosts());
}

export async function generateMetadata({ params }: PageProps<"/log/[slug]">): Promise<Metadata> {
  const post = findBySlug(await getPosts(), (await params).slug);
  return { title: post.title, description: post.excerpt };
}

export default async function LogPostPage({ params }: PageProps<"/log/[slug]">) {
  const posts = await getPosts();
  const post = findBySlug(posts, (await params).slug);

  return <LogPostView post={post} neighbors={logNeighbors(posts, post.slug)} body={<CachedMdx source={post.body} />} />;
}
