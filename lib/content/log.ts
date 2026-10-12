import { join } from "node:path";
import { cacheLife } from "next/cache";
import { loadCollection, type Entry } from "./collection";
import { logFrontmatter, type LogFrontmatter } from "./schema";

const LOG_DIR = join(process.cwd(), "content", "log");
const WORDS_PER_MINUTE = 225;

export interface Post extends LogFrontmatter {
  slug: string;
  body: string;
  /** 1 for the first post ever published; shown as LOG #01. */
  number: number;
  readingMinutes: number;
}

function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function byPublication(a: Entry<LogFrontmatter>, b: Entry<LogFrontmatter>): number {
  return a.data.date.localeCompare(b.data.date) || a.slug.localeCompare(b.slug);
}

/** Newest first. */
export function toPostList(entries: readonly Entry<LogFrontmatter>[]): readonly Post[] {
  return [...entries]
    .sort(byPublication)
    .map(({ slug, data, body }, index) => ({ slug, ...data, body, number: index + 1, readingMinutes: readingMinutes(body) }))
    .reverse();
}

export async function getPosts(): Promise<readonly Post[]> {
  "use cache";
  // Content only changes on deploy, so a revalidation window would just re-read the same files.
  cacheLife("max");
  return toPostList(await loadCollection(LOG_DIR, logFrontmatter));
}
