import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const MDX_EXTENSION = ".mdx";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface Entry<T> {
  slug: string;
  data: T;
  body: string;
}

async function listMdxFiles(dir: string): Promise<string[]> {
  try {
    const dirents = await readdir(dir, { withFileTypes: true });
    return dirents.filter((d) => d.isFile() && d.name.endsWith(MDX_EXTENSION)).map((d) => d.name);
  } catch (error) {
    // A collection with no entries yet has no directory; that's empty, not broken.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function loadEntry<S extends z.ZodType>(dir: string, file: string, schema: S): Promise<Entry<z.output<S>>> {
  const slug = file.slice(0, -MDX_EXTENSION.length);
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`${join(dir, file)}: filename must be a lowercase kebab-case slug`);
  }

  const { data, content } = matter(await readFile(join(dir, file), "utf8"));
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
