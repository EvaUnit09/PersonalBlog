// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { Entry } from "./collection";
import { toPostList } from "./log";
import type { LogFrontmatter } from "./schema";

function entry(slug: string, date: string, body = "word"): Entry<LogFrontmatter> {
  return { slug, data: { title: slug, date, excerpt: "E", tags: ["Backend"] }, body };
}

describe("toPostList", () => {
  it("lists newest first and numbers posts in publication order", () => {
    const posts = toPostList([entry("middle", "2026-02-01"), entry("first", "2026-01-01"), entry("last", "2026-03-01")]);

    expect(posts.map((post) => [post.slug, post.number])).toEqual([
      ["last", 3],
      ["middle", 2],
      ["first", 1],
    ]);
  });

  it("orders same-day posts by slug so numbering is stable", () => {
    const posts = toPostList([entry("b", "2026-01-01"), entry("a", "2026-01-01")]);

    expect(posts.map((post) => [post.slug, post.number])).toEqual([
      ["b", 2],
      ["a", 1],
    ]);
  });

  it("estimates reading time from the body, rounding up, at least one minute", () => {
    const [short] = toPostList([entry("short", "2026-01-01", "one two")]);
    const [long] = toPostList([entry("long", "2026-01-01", Array(451).fill("word").join(" "))]);

    expect(short?.readingMinutes).toBe(1);
    expect(long?.readingMinutes).toBe(3);
  });

  it("counts prose only, not code samples or MDX syntax", () => {
    const code = Array(900).fill("x").join(" ");
    const body = `import { Note } from "./note";\n\n## Heading\n\n<Note kind="tip">Read this.</Note>\n\n\`\`\`python\n${code}\n\`\`\`\n`;
    const [post] = toPostList([entry("code", "2026-01-01", body)]);

    expect(post?.readingMinutes).toBe(1);
  });

  it("returns an empty list when there are no posts", () => {
    expect(toPostList([])).toEqual([]);
  });
});
