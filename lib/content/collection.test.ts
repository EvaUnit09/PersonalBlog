// @vitest-environment node
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { loadCollection } from "./collection";

const schema = z.object({ title: z.string(), order: z.number() });

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "collection-"));
});

function mdx(frontmatter: string, body = "Body text.") {
  return `---\n${frontmatter}\n---\n${body}\n`;
}

describe("loadCollection", () => {
  it("returns one validated entry per .mdx file, slugged by filename", async () => {
    await writeFile(join(dir, "nightcap.mdx"), mdx("title: Nightcap\norder: 1", "# Hello"));
    await writeFile(join(dir, "notes.txt"), "ignored");

    const entries = await loadCollection(dir, schema);

    expect(entries).toEqual([{ slug: "nightcap", data: { title: "Nightcap", order: 1 }, body: "# Hello\n" }]);
  });

  it("returns an empty list when the directory does not exist", async () => {
    expect(await loadCollection(join(dir, "missing"), schema)).toEqual([]);
  });

  it("names the file and the field when frontmatter is invalid", async () => {
    await writeFile(join(dir, "broken.mdx"), mdx("title: Broken"));

    await expect(loadCollection(dir, schema)).rejects.toThrow(/broken\.mdx[\s\S]*order/);
  });

  it("rejects filenames that are not lowercase kebab-case slugs", async () => {
    await writeFile(join(dir, "Bad Name.mdx"), mdx("title: X\norder: 1"));

    await expect(loadCollection(dir, schema)).rejects.toThrow(/Bad Name\.mdx/);
  });

  it("rejects an uppercase extension instead of skipping the file", async () => {
    await writeFile(join(dir, "nightcap.MDX"), mdx("title: X\norder: 1"));

    await expect(loadCollection(dir, schema)).rejects.toThrow(/nightcap\.MDX/);
  });

  it("does not descend into subdirectories", async () => {
    await mkdir(join(dir, "drafts"));
    await writeFile(join(dir, "drafts", "wip.mdx"), mdx("title: WIP\norder: 2"));

    expect(await loadCollection(dir, schema)).toEqual([]);
  });
});
