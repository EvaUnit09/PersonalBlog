import { Button } from "@/components/hud/Button";
import { Panel } from "@/components/hud/Panel";
import { TagList } from "@/components/hud/Tag";
import type { Project } from "@/lib/content/projects";
import styles from "./ProjectHero.module.css";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { demo, source } = project.links;

  return (
    <Panel size="hero" aria-labelledby="project-title">
      <TagList tags={project.tags} label="Stack" className={styles.tags} />
      <h1 id="project-title" className={`t-display ${styles.title}`}>
        {project.title}
      </h1>
      <p className={`t-lede ${styles.lede}`}>{project.summary}</p>
      {(demo !== undefined || source !== undefined) && (
        <div className={styles.actions}>
          {demo !== undefined && <Button href={demo}>▸ Live demo</Button>}
          {source !== undefined && (
            <Button href={source} variant="secondary">
              Source on GitHub
            </Button>
          )}
        </div>
      )}
    </Panel>
  );
}
