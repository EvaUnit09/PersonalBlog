import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST_PATH = join(ROOT, "lib/content/slugs.json");
const COLLECTIONS = ["projects", "log"];
const MDX_EXTENSION = ".mdx";
// Mirrors SLUG_PATTERN in lib/content/collection.ts.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function listSlugs(dir) {
  let dirents;
  try {
    dirents = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return dirents
    .filter((d) => d.isFile() && d.name.endsWith(MDX_EXTENSION))
    .map((d) => d.name.slice(0, -MDX_EXTENSION.length))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort();
}

/** Builds the slug manifest from `<contentDir>/<collection>/*.mdx`. */
export async function buildSlugManifest(contentDir = join(ROOT, "content")) {
  const entries = await Promise.all(COLLECTIONS.map(async (name) => [name, await listSlugs(join(contentDir, name))]));
  return Object.fromEntries(entries);
}

export function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await writeFile(MANIFEST_PATH, serializeManifest(await buildSlugManifest()));
}
