import { join } from "node:path";
import { cacheLife } from "next/cache";
import { loadCollection, type Entry } from "./collection";
import { projectFrontmatter, type ProjectFrontmatter } from "./schema";

const PROJECTS_DIR = join(process.cwd(), "content", "projects");

export interface Project extends ProjectFrontmatter {
  slug: string;
  body: string;
}

/** Ordered by `order`; the first entry is the featured project. */
export type ProjectList = readonly [Project, ...Project[]];

export function toProjectList(entries: readonly Entry<ProjectFrontmatter>[]): ProjectList {
  const projects = entries
    .map(({ slug, data, body }) => ({ slug, ...data, body }))
    .sort((a, b) => a.order - b.order);

  const [featured, ...rest] = projects;
  if (featured === undefined) {
    throw new Error(`${PROJECTS_DIR} has no projects; the home page needs a featured project`);
  }

  const orders = projects.map((project) => project.order);
  if (orders.some((order, index) => order !== index + 1)) {
    throw new Error(`Project order must run 1..${projects.length} with no gaps or repeats, got ${orders.join(", ")}`);
  }

  return [featured, ...rest];
}

export async function getProjects(): Promise<ProjectList> {
  "use cache";
  // Content only changes on deploy, so a revalidation window would just re-read the same files.
  cacheLife("max");
  return toProjectList(await loadCollection(PROJECTS_DIR, projectFrontmatter));
}
