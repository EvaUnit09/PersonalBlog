import type { Metadata } from "next";
import { CachedMdx } from "@/components/content/CachedMdx";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getProjects } from "@/lib/content/projects";
import { findBySlug } from "@/lib/find-by-slug";
import { neighborsOf } from "@/lib/neighbors";
import { slugParams } from "@/lib/static-params";

export async function generateStaticParams() {
  return slugParams(await getProjects());
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = findBySlug(await getProjects(), (await params).slug);
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const projects = await getProjects();
  const project = findBySlug(projects, (await params).slug);
  const hasBody = project.body.trim() !== "";

  return (
    <ProjectDetail
      project={project}
      position={projects.indexOf(project) + 1}
      total={projects.length}
      neighbors={neighborsOf(projects, project.slug)}
      body={hasBody ? <CachedMdx source={project.body} /> : undefined}
    />
  );
}
