import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CachedMdx } from "@/components/content/CachedMdx";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getProjects } from "@/lib/content/projects";
import { neighborsOf } from "@/lib/neighbors";
import { slugParams } from "@/lib/static-params";

export async function generateStaticParams() {
  return slugParams(await getProjects());
}

async function findProject(slug: string) {
  const projects = await getProjects();
  const project = projects.find((candidate) => candidate.slug === slug);
  if (project === undefined) {
    notFound();
  }
  return { projects, project };
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { project } = await findProject((await params).slug);
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { projects, project } = await findProject((await params).slug);
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
