import { getPosts } from "@/lib/content/log";
import { getProjects } from "@/lib/content/projects";
import { BootSequence } from "./BootSequence";

/** Server half of the boot: the log reports real content counts. */
export async function Boot() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  return <BootSequence projects={projects.length} posts={posts.length} />;
}
