import { cacheLife } from "next/cache";
import { Mdx } from "./Mdx";

interface CachedMdxProps {
  source: string;
}

/**
 * Mdx behind a cache boundary. Shiki's tokenizer reads Date.now(), which Cache Components rejects
 * during prerender unless it runs inside "use cache", so any page with a code fence must render through this.
 */
export async function CachedMdx({ source }: CachedMdxProps) {
  "use cache";
  // Content only changes on deploy, so a revalidation window would just recompile the same source.
  cacheLife("max");

  return <Mdx source={source} />;
}
