import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CachedMdx } from "@/components/content/CachedMdx";
import { LogPostView } from "@/components/log/LogPostView";
import { getPosts } from "@/lib/content/log";
import { logNeighbors } from "@/lib/neighbors";
import { slugParams } from "@/lib/static-params";

export async function generateStaticParams() {
  return slugParams(await getPosts());
}

async function findPost(slug: string) {
  const posts = await getPosts();
  const post = posts.find((candidate) => candidate.slug === slug);
  if (post === undefined) {
    notFound();
  }
  return { posts, post };
}

export async function generateMetadata({ params }: PageProps<"/log/[slug]">): Promise<Metadata> {
  const { post } = await findPost((await params).slug);
  return { title: post.title, description: post.excerpt };
}

export default async function LogPostPage({ params }: PageProps<"/log/[slug]">) {
  const { posts, post } = await findPost((await params).slug);

  return <LogPostView post={post} neighbors={logNeighbors(posts, post.slug)} body={<CachedMdx source={post.body} />} />;
}
