import type { Metadata } from "next";
import { ProjectsIndexPanel } from "@/components/projects/ProjectsIndexPanel";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Backend and full-stack projects I have built, with stack and status.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="grid">
      <ProjectsIndexPanel projects={projects} />
    </main>
  );
}
