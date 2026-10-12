// @vitest-environment node
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { buildSlugManifest } from "../../scripts/content-slugs.mjs";
import manifest from "./slugs.json";

describe("slugs.json", () => {
  test("matches the content directories (run `npm run content:slugs` if this fails)", async () => {
    expect(manifest).toEqual(await buildSlugManifest());
  });
});

describe("buildSlugManifest", () => {
  test("keeps only top-level kebab-case .mdx files, sorted, and tolerates a missing collection", async () => {
    const dir = await mkdtemp(join(tmpdir(), "slugs-"));
    await mkdir(join(dir, "projects/nested"), { recursive: true });
    for (const file of ["b.mdx", "a.mdx", "Bad_Name.mdx", "notes.md", "nested/c.mdx"]) {
      await writeFile(join(dir, "projects", file), "");
    }

    expect(await buildSlugManifest(dir)).toEqual({ projects: ["a", "b"], log: [] });
  });
});
