import type { ReactNode } from "react";
import { Crumbs } from "@/components/hud/Crumbs";
import { PostNav } from "@/components/hud/PostNav";
import { toNavTarget } from "@/components/hud/toNavTarget";
import type { Project } from "@/lib/content/projects";
import type { Neighbors } from "@/lib/neighbors";
import { padIndex } from "@/lib/padIndex";
import { ProjectHero } from "./ProjectHero";
import { ProjectSpec } from "./ProjectSpec";
import styles from "./ProjectDetail.module.css";

interface ProjectDetailProps {
  project: Project;
  /** 1-based place in the project list. */
  position: number;
  total: number;
  neighbors: Neighbors<Project>;
  /** Rendered write-up; omit when the project has no body. */
  body?: ReactNode;
}

export function ProjectDetail({ project, position, total, neighbors, body }: ProjectDetailProps) {
  const hasBody = body !== undefined;
  const crumbs = [
    `02 / PROJECT ${padIndex(position)} OF ${padIndex(total)}`,
    ...(project.updated === undefined ? [] : [`UPDATED ${project.updated}`]),
  ];

  return (
    <main className={styles.stack}>
      <Crumbs backHref="/projects" backLabel="ALL PROJECTS" items={crumbs} />
      <ProjectHero project={project} />
      <div className="grid">
        {hasBody && (
          <article aria-label={`${project.title} write-up`} className="span-8">
            {body}
          </article>
        )}
        <ProjectSpec project={project} span={hasBody ? 4 : 12} />
      </div>
      <PostNav
        label="Project navigation"
        previous={toNavTarget("/projects", neighbors.previous)}
        next={toNavTarget("/projects", neighbors.next)}
      />
    </main>
  );
}
