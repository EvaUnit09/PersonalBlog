import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { z } from "zod";

const MDX_EXTENSION = ".mdx";
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// The YAML 1.2 core schema has no timestamp type, so dates reach zod as the exact string the author wrote.
// The default schema turns 2026-02-30 into a Date that silently rolls over to March 2.
export const FRONTMATTER_OPTIONS = {
  engines: { yaml: (source: string) => yaml.load(source, { schema: yaml.CORE_SCHEMA }) as object },
};

export interface Entry<T> {
  slug: string;
  data: T;
  body: string;
}

async function listMdxFiles(dir: string): Promise<string[]> {
  try {
    const dirents = await readdir(dir, { withFileTypes: true });
    return dirents.filter((d) => d.isFile() && d.name.toLowerCase().endsWith(MDX_EXTENSION)).map((d) => d.name);
  } catch (error) {
    // A collection with no entries yet has no directory; that's empty, not broken.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function loadEntry<S extends z.ZodType>(dir: string, file: string, schema: S): Promise<Entry<z.output<S>>> {
  const slug = file.slice(0, -MDX_EXTENSION.length);
  if (!file.endsWith(MDX_EXTENSION) || !SLUG_PATTERN.test(slug)) {
    throw new Error(`${join(dir, file)}: filename must be a lowercase kebab-case slug ending in ${MDX_EXTENSION}`);
  }

  const { data, content } = matter(await readFile(join(dir, file), "utf8"), FRONTMATTER_OPTIONS);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`${join(dir, file)}: invalid frontmatter\n${z.prettifyError(parsed.error)}`);
  }

  return { slug, data: parsed.data, body: content };
}

/** Reads every top-level .mdx file in `dir`, validating its frontmatter against `schema`. */
export async function loadCollection<S extends z.ZodType>(dir: string, schema: S): Promise<Entry<z.output<S>>[]> {
  const files = await listMdxFiles(dir);
  return Promise.all(files.map((file) => loadEntry(dir, file, schema)));
}
