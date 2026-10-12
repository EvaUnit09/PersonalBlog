import Link from "next/link";
import { ListRow } from "@/components/hud/ListRow";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { TagList } from "@/components/hud/Tag";
import type { ProjectList } from "@/lib/content/projects";
import { PROJECT_STATUS_LABEL } from "@/lib/content/schema";
import { padIndex } from "@/lib/padIndex";
import styles from "./ProjectsIndexPanel.module.css";

interface ProjectsIndexPanelProps {
  projects: ProjectList;
}

export function ProjectsIndexPanel({ projects }: ProjectsIndexPanelProps) {
  return (
    <Panel span={12} aria-labelledby="projects-title">
      <h1 id="projects-title" className="visually-hidden">
        Projects
      </h1>
      <PanelHeader index="02" label="Projects" readout={`${padIndex(projects.length)} TOTAL`} />
      <ol className={styles.list}>
        {projects.map((project, i) => (
          <ListRow
            key={project.slug}
            marker={padIndex(i + 1)}
            title={
              <Link href={`/projects/${project.slug}`} className={styles.titleLink}>
                {project.title}
              </Link>
            }
            summary={project.summary}
          >
            <div className={styles.meta}>
              <TagList tags={project.tags} label={`${project.title} stack`} />
              <span className="t-readout">STATUS: {PROJECT_STATUS_LABEL[project.status]}</span>
            </div>
          </ListRow>
        ))}
      </ol>
    </Panel>
  );
}
